'use strict';

/**
 * ================================================================
 *  JBLX — JBCL Dupe Scraper v7
 *
 *  Item discovery (no Puppeteer needed):
 *    1. Fetch items_metadata.json directly from JBCL's asset CDN
 *       → covers all vehicles, weapons, spoilers, rims, etc.
 *    2. Load one HyperChrome page with Puppeteer to intercept
 *       the hyperchrome-specific metadata JSON
 *    3. Merge both lists, deduplicate by ID
 *
 *  Dupe fetching:
 *    - For every discovered item, call /api/items/dupes?id=X
 *    - Run in parallel batches of CONCURRENCY
 *    - Merge with existing records (never delete, only add)
 *
 *  Output:
 *    - data/jbcl-dupes.json   (raw data)
 *    - js/jbcl-dupes-bundle.js (loaded by dupe.html)
 * ================================================================
 */

const puppeteer = require('puppeteer-core');
const fetch     = require('node-fetch');
const fs        = require('fs');
const path      = require('path');

// ── config ────────────────────────────────────────────────────

const BASE            = 'https://jailbreakchangelogs.xyz';
const ASSETS_BASE     = 'https://assets.jailbreakchangelogs.xyz';
const REQUEST_DELAY   = 150;  // ms between API calls
const CONCURRENCY     = 6;    // parallel requests for dupes fetching
const PUPPETEER_WAIT  = 8000; // ms to wait for hyperchrome intercept

const OUT_JSON = path.join(__dirname, 'data', 'jbcl-dupes.json');
const OUT_JS   = path.join(__dirname, 'js',   'jbcl-dupes-bundle.js');

// Known HyperChrome page — loading this triggers their hyperchrome metadata API call
const HYPERCHROME_PAGE = `${BASE}/item/hyperchrome/HyperGreen%20Level%205#dupes`;

// ── helpers ───────────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));
const log   = (...a) => console.log(`[${new Date().toISOString()}]`, ...a);

const HEADERS = {
  'User-Agent': 'JBLX-DupeScraper/7.0 (+https://jblx.net; permitted by JBCL owner)',
  'Accept': 'application/json',
};

async function apiFetch(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { headers: HEADERS, timeout: 15000 });
      if (res.status === 429) { log(`  Rate limited — waiting 5s…`); await sleep(5000); continue; }
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('json')) return null;
      return await res.json();
    } catch (err) {
      if (i === retries - 1) { log(`  WARN: ${url} → ${err.message}`); return null; }
      await sleep(800 * (i + 1));
    }
  }
  return null;
}

// ── normalise a raw item object from any metadata shape ───────

function normaliseItem(obj) {
  if (!obj || typeof obj !== 'object') return null;
  const id   = obj.id ?? obj.item_id ?? obj.itemId;
  const name = obj.name ?? obj.item_name ?? obj.itemName ?? obj.title;
  const type = (obj.type ?? obj.category ?? 'vehicle').toString().toLowerCase();
  if (!id || !name) return null;
  return { id: Number(id), name: String(name).trim(), type };
}

// Walk any JSON shape to find arrays of items
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
    // Single item shape
    const item = normaliseItem(data);
    if (item && !results.has(item.id)) results.set(item.id, item);
  }

  return [...results.values()];
}

// ── Step 1a: fetch main items metadata directly ───────────────

async function fetchMainItems() {
  log('Fetching main items metadata from CDN…');
  const data = await apiFetch(`${ASSETS_BASE}/assets/json/items_metadata.json`);
  if (!data) {
    log('  WARN: items_metadata.json not available');
    return [];
  }
  const items = extractItems(data);
  log(`  ✓ ${items.length} items from items_metadata.json`);
  return items;
}

// ── Step 1b: use Puppeteer to intercept HyperChrome metadata ──

async function fetchHyperChromeItems() {
  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser';
  log('Launching headless Chrome for HyperChrome discovery…');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
           '--disable-gpu', '--no-zygote'],
  });

  const found  = new Map();
  let   done   = false;
  let   resolveDone;
  const doneP  = new Promise(r => { resolveDone = r; });

  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', req => req.continue());

    page.on('response', async response => {
      const url = response.url();
      // Only care about JBCL or its asset CDN
      if (!url.includes('jailbreakchangelogs.xyz')) return;
      try {
        const ct = response.headers()['content-type'] || '';
        if (!ct.includes('json')) return;
        const json = await response.json().catch(() => null);
        if (!json) return;

        const items = extractItems(json);
        const hcItems = items.filter(i => i.type === 'hyperchrome');
        if (hcItems.length > 0) {
          log(`  [intercept] ${url} → ${hcItems.length} hyperchrome item(s)`);
          for (const item of hcItems) found.set(item.id, item);
          if (!done) { done = true; resolveDone(); }
        }
      } catch {}
    });

    await page.goto(HYPERCHROME_PAGE, { waitUntil: 'networkidle2', timeout: 25000 }).catch(() => {});
    await Promise.race([doneP, sleep(PUPPETEER_WAIT)]);
    await page.close();
  } finally {
    await browser.close();
  }

  const items = [...found.values()];
  log(`  ✓ ${items.length} HyperChrome item(s) discovered`);
  return items;
}

// ── Step 2: fetch dupers for one item ─────────────────────────

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
      for (const f of ['username', 'user_name', 'roblox_username', 'owner',
                       'name', 'user', 'Username', 'Owner']) {
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
  log('=== JBLX Dupe Scraper v7 starting ===');

  const existingRecords = loadExistingRecords();

  // ── Step 1: discover all items ───────────────────────────────
  const [mainItems, hcItems] = await Promise.all([
    fetchMainItems(),
    fetchHyperChromeItems(),
  ]);

  // Merge, deduplicate by ID, hyperchrome items take type precedence
  const itemMap = new Map();
  for (const item of [...mainItems, ...hcItems]) {
    itemMap.set(item.id, item);
  }
  const allItems = [...itemMap.values()];

  // Log summary by type
  const byType = {};
  for (const item of allItems) {
    byType[item.type] = (byType[item.type] || 0) + 1;
  }
  log(`\nTotal items: ${allItems.length} — ${Object.entries(byType).map(([t,c]) => `${t}:${c}`).join(', ')}`);

  if (allItems.length === 0) {
    log('FATAL: No items found — aborting');
    process.exit(1);
  }

  // ── Step 2: fetch dupers for every item ──────────────────────
  log('\nFetching dupers for all items…\n');
  const newRecords = [];
  const dupeItems  = [];

  const usernamesList = await pooled(allItems, fetchDupersForItem, CONCURRENCY);

  for (let i = 0; i < allItems.length; i++) {
    const item      = allItems[i];
    const usernames = usernamesList[i];
    if (!usernames || usernames.length === 0) continue;

    const itemKey = item.name.replace(/\s+/g, '_').toUpperCase();
    dupeItems.push({ item: item.name, itemKey, type: item.type, id: item.id });

    for (const username of usernames) {
      newRecords.push({
        username: username.toUpperCase(),
        item:     item.name,
        itemKey,
        type:     item.type,
        source:   'jbcl',
      });
    }
  }

  // ── Step 3: merge with existing + write ──────────────────────
  const existingDeduped = dedup(existingRecords);
  const merged          = dedup([...existingDeduped, ...newRecords]);
  const added           = merged.length - existingDeduped.length;

  log(`\nSummary: ${existingDeduped.length} existing + ${newRecords.length} scraped → ${merged.length} total (${added} new unique)`);
  writeOutputs(merged, dupeItems);
  log('=== Done ===');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });