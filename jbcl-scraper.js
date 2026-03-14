'use strict';

/**
 * ================================================================
 *  JBLX — JBCL Dupe Scraper v8
 *
 *  Item discovery:
 *    A) Main items  — fetch items_metadata.json from CDN directly
 *    B) HyperChrome — load each known HC Level 5 page with
 *                     Puppeteer and intercept the dupes API call.
 *                     This gives us the item ID *and* the dupers
 *                     in a single page load, no metadata needed.
 *
 *  Dupe fetching:
 *    - Main items: /api/items/dupes?id=X via plain fetch (fast)
 *    - HyperChrome: already captured during page interception
 *
 *  Output:
 *    - data/jbcl-dupes.json
 *    - js/jbcl-dupes-bundle.js
 * ================================================================
 */

const puppeteer = require('puppeteer-core');
const fetch     = require('node-fetch');
const fs        = require('fs');
const path      = require('path');

// ── config ────────────────────────────────────────────────────

const BASE        = 'https://jailbreakchangelogs.xyz';
const ASSETS_BASE = 'https://assets.jailbreakchangelogs.xyz';

const REQUEST_DELAY  = 150;   // ms between plain fetch calls
const CONCURRENCY    = 6;     // parallel fetch workers
const HC_PAGE_WAIT   = 10000; // ms to wait per HC page for API intercept

const OUT_JSON = path.join(__dirname, 'data', 'jbcl-dupes.json');
const OUT_JS   = path.join(__dirname, 'js',   'jbcl-dupes-bundle.js');

// All known HyperChrome Level 5 item names
// Level 5s are the rare/duped tier — add more here if JBCL adds new colours
const HYPERCHROME_LEVEL5_NAMES = [
  'HyperBlue Level 5',
  'HyperGreen Level 5',
  'HyperRed Level 5',
  'HyperYellow Level 5',
  'HyperPink Level 5',
  'HyperOrange Level 5',
  'HyperPurple Level 5',
  'HyperDiamond Level 5',
];

// ── helpers ───────────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));
const log   = (...a) => console.log(`[${new Date().toISOString()}]`, ...a);

const HEADERS = {
  'User-Agent': 'JBLX-DupeScraper/8.0 (+https://jblx.net; permitted by JBCL owner)',
  'Accept': 'application/json',
};

async function apiFetch(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { headers: HEADERS, timeout: 15000 });
      if (res.status === 429) { log('  Rate limited — waiting 5s…'); await sleep(5000); continue; }
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!(res.headers.get('content-type') || '').includes('json')) return null;
      return await res.json();
    } catch (err) {
      if (i === retries - 1) { log(`  WARN: ${url} → ${err.message}`); return null; }
      await sleep(800 * (i + 1));
    }
  }
  return null;
}

// ── normalise item object ─────────────────────────────────────

function normaliseItem(obj) {
  if (!obj || typeof obj !== 'object') return null;
  const id   = obj.id ?? obj.item_id ?? obj.itemId;
  const name = obj.name ?? obj.item_name ?? obj.itemName ?? obj.title;
  const type = (obj.type ?? obj.category ?? 'vehicle').toString().toLowerCase();
  if (!id || !name) return null;
  return { id: Number(id), name: String(name).trim(), type };
}

function extractItems(data) {
  const results = new Map();
  function tryArray(arr) {
    if (!Array.isArray(arr)) return;
    for (const obj of arr) {
      const item = normaliseItem(obj);
      if (item && !results.has(item.id)) results.set(item.id, item);
    }
  }
  if (Array.isArray(data)) {
    tryArray(data);
  } else if (data && typeof data === 'object') {
    for (const key of ['items', 'data', 'results', 'vehicles', 'list', 'hyperchromes']) {
      if (Array.isArray(data[key])) tryArray(data[key]);
    }
    const item = normaliseItem(data);
    if (item && !results.has(item.id)) results.set(item.id, item);
  }
  return [...results.values()];
}

// ── username extraction from any API response shape ───────────

function extractUsernames(data) {
  const usernames = new Set();
  const entries = Array.isArray(data)
    ? data
    : (data?.dupes ?? data?.users ?? data?.data ?? []);

  for (const entry of entries) {
    if (typeof entry === 'string') {
      if (entry.includes('@')) {
        const u = entry.split('@').pop().replace(/[^A-Za-z0-9_]/g, '');
        if (u.length >= 3 && u.length <= 30) usernames.add(u);
      } else if (/^[A-Za-z0-9_]{3,30}$/.test(entry.trim())) {
        usernames.add(entry.trim());
      }
    } else if (entry && typeof entry === 'object') {
      for (const f of ['username','user_name','roblox_username','owner',
                       'name','user','Username','Owner']) {
        const val = entry[f];
        if (typeof val !== 'string') continue;
        const t = val.trim();
        if (t.includes('@')) {
          const u = t.split('@').pop().replace(/[^A-Za-z0-9_]/g, '');
          if (u.length >= 3) { usernames.add(u); break; }
        } else if (/^[A-Za-z0-9_]{3,30}$/.test(t)) {
          usernames.add(t); break;
        }
      }
    }
  }
  return [...usernames];
}

// ── A) Fetch main items from CDN ──────────────────────────────

async function fetchMainItems() {
  log('Fetching items_metadata.json from CDN…');
  const data = await apiFetch(`${ASSETS_BASE}/assets/json/items_metadata.json`);
  if (!data) { log('  WARN: items_metadata.json unavailable'); return []; }
  const items = extractItems(data);
  log(`  ✓ ${items.length} main items`);
  return items;
}

// ── B) HyperChrome: one Puppeteer session, all HC pages ───────
//
// Strategy: load each HC Level 5 page, intercept the
// /api/items/dupes?id=X response. This gives us:
//   - the item ID (from the URL query param)
//   - the dupers list (from the response body)
// We collect both and skip the separate dupe-fetch step for HCs.

async function fetchHyperChromeData(browser) {
  // { itemName → { id, usernames[] } }
  const hcResults = new Map();

  for (const name of HYPERCHROME_LEVEL5_NAMES) {
    const pageUrl = `${BASE}/item/hyperchrome/${encodeURIComponent(name)}#dupes`;
    log(`  Loading HC page: ${name}…`);

    let capturedId        = null;
    let capturedUsernames = [];
    let resolved          = false;
    let resolveP;
    const waitP = new Promise(r => { resolveP = r; });

    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', req => req.continue());

    page.on('response', async response => {
      const url = response.url();
      // We want: /api/items/dupes?id=X
      if (!url.includes('jailbreakchangelogs.xyz')) return;
      if (!url.includes('dupe') && !url.includes('user')) return;
      try {
        const idMatch = url.match(/[?&]id=(\d+)/) || url.match(/\/(\d+)(?:[?#]|$)/);
        if (!idMatch) return;
        const id   = Number(idMatch[1]);
        const json = await response.json().catch(() => null);
        if (!json) return;

        const usernames = extractUsernames(json);
        log(`    [intercept] id=${id} → ${usernames.length} duper(s)`);
        capturedId        = id;
        capturedUsernames = usernames;
        if (!resolved) { resolved = true; resolveP(); }
      } catch {}
    });

    try {
      await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 25000 }).catch(() => {});
      await Promise.race([waitP, sleep(HC_PAGE_WAIT)]);
    } finally {
      await page.close().catch(() => {});
    }

    if (capturedId !== null) {
      hcResults.set(name, { id: capturedId, usernames: capturedUsernames });
      log(`  ✓ ${name} (id=${capturedId}): ${capturedUsernames.length} duper(s)`);
    } else {
      log(`  ✗ ${name}: no dupes API call intercepted (item may not exist on JBCL)`);
    }

    await sleep(500); // brief pause between pages
  }

  return hcResults;
}

// ── C) Fetch dupers for regular items via API ─────────────────

async function fetchDupersForItem(item) {
  const data = await apiFetch(`${BASE}/api/items/dupes?id=${item.id}`);
  if (!data) return [];
  const usernames = extractUsernames(data);
  if (usernames.length > 0) {
    log(`  ${item.name} (${item.type}, id=${item.id}): ${usernames.length} duper(s)`);
  }
  return usernames;
}

// ── concurrency pool ──────────────────────────────────────────

async function pooled(items, fn, concurrency) {
  const results = new Array(items.length);
  let idx = 0;
  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i]);
      await sleep(REQUEST_DELAY);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

// ── load / save ───────────────────────────────────────────────

function loadExistingRecords() {
  try {
    if (fs.existsSync(OUT_JSON)) {
      const data    = JSON.parse(fs.readFileSync(OUT_JSON, 'utf8'));
      const records = data.records || [];
      log(`Loaded ${records.length} existing records`);
      return records;
    }
  } catch (e) { log('WARNING: could not load existing records:', e.message); }
  return [];
}

function dedup(records) {
  const seen = new Set();
  return records.filter(r => {
    const key = `${(r.username || '').toUpperCase()}|${r.itemKey}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function writeOutputs(records, dupeItems) {
  ['data', 'js'].forEach(d => {
    const p = path.join(__dirname, d);
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  });

  const meta = {
    generated:    new Date().toISOString(),
    totalRecords: records.length,
    source:       'jailbreakchangelogs.xyz API (used with owner permission)',
    credit:       'Data sourced from JBCL — https://jailbreakchangelogs.xyz',
  };

  fs.writeFileSync(OUT_JSON, JSON.stringify({ meta, records, dupeItems }, null, 2));
  log(`Wrote ${OUT_JSON} (${records.length} records)`);

  fs.writeFileSync(OUT_JS,
    `/**\n * AUTO-GENERATED by jbcl-scraper.js\n` +
    ` * Generated: ${meta.generated}\n` +
    ` * ${meta.credit}\n * DO NOT EDIT\n */\n\n` +
    `const JBCL_RECORDS = ${JSON.stringify(records, null, 2)};\n\n` +
    `const JBCL_DUPE_ITEMS = ${JSON.stringify(dupeItems, null, 2)};\n\n` +
    `const JBCL_META = ${JSON.stringify(meta, null, 2)};\n`
  );
  log(`Wrote ${OUT_JS}`);
}

// ── main ──────────────────────────────────────────────────────

async function main() {
  log('=== JBLX Dupe Scraper v8 starting ===');

  const existingRecords = loadExistingRecords();
  const newRecords      = [];
  const dupeItems       = [];

  // ── A) Main items via CDN fetch ──────────────────────────────
  const mainItems = await fetchMainItems();

  // ── B) HyperChrome via Puppeteer page interception ───────────
  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser';
  log('\nLaunching headless Chrome for HyperChrome pages…');
  const browser = await puppeteer.launch({
    headless: 'new', executablePath,
    args: ['--no-sandbox','--disable-setuid-sandbox',
           '--disable-dev-shm-usage','--disable-gpu','--no-zygote'],
  });

  let hcData = new Map();
  try {
    hcData = await fetchHyperChromeData(browser);
  } finally {
    await browser.close();
  }

  log(`\nHyperChrome: ${hcData.size} item(s) found with data`);

  // Build HC records
  for (const [name, { id, usernames }] of hcData) {
    if (usernames.length === 0) continue;
    const itemKey = name.replace(/\s+/g, '_').toUpperCase();
    dupeItems.push({ item: name, itemKey, type: 'hyperchrome', id });
    for (const username of usernames) {
      newRecords.push({ username: username.toUpperCase(), item: name, itemKey, type: 'hyperchrome', source: 'jbcl' });
    }
  }

  // ── C) Main items dupers via direct API ──────────────────────
  log('\nFetching dupers for main items…\n');
  const usernamesList = await pooled(mainItems, fetchDupersForItem, CONCURRENCY);

  for (let i = 0; i < mainItems.length; i++) {
    const item      = mainItems[i];
    const usernames = usernamesList[i];
    if (!usernames || usernames.length === 0) continue;

    const itemKey = item.name.replace(/\s+/g, '_').toUpperCase();
    dupeItems.push({ item: item.name, itemKey, type: item.type, id: item.id });
    for (const username of usernames) {
      newRecords.push({ username: username.toUpperCase(), item: item.name, itemKey, type: item.type, source: 'jbcl' });
    }
  }

  // ── Merge + write ─────────────────────────────────────────────
  const existingDeduped = dedup(existingRecords);
  const merged          = dedup([...existingDeduped, ...newRecords]);
  const added           = merged.length - existingDeduped.length;

  // Summary by type
  const byType = {};
  for (const r of newRecords) byType[r.type] = (byType[r.type] || 0) + 1;
  log(`\nScraped by type: ${Object.entries(byType).map(([t,c]) => `${t}:${c}`).join(', ')}`);
  log(`Summary: ${existingDeduped.length} existing + ${newRecords.length} scraped → ${merged.length} total (${added} new unique)`);

  writeOutputs(merged, dupeItems);
  log('=== Done ===');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });