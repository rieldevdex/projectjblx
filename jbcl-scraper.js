'use strict';

/**
 * ================================================================
 *  JBLX — JBCL Dupe Scraper v10
 *
 *  Parsing logic is identical to v8 (which worked — 2825 records).
 *  The only addition is capturing displayName alongside username.
 *
 *  JBCL format:  "DisplayName@RobloxUsername"
 *    → username    = part after @  (Roblox handle, used for ID lookup)
 *    → displayName = part before @ (cosmetic, shown in UI)
 *
 *  If no @ present, the whole string is the username (= displayName).
 *
 *  Item discovery:
 *    A) Main items  — items_metadata.json from CDN (plain fetch)
 *    B) HyperChrome — Puppeteer intercepts /api/items/dupes?id=X
 * ================================================================
 */

const puppeteer = require('puppeteer-core');
const fetch     = require('node-fetch');
const fs        = require('fs');
const path      = require('path');

// ── config ────────────────────────────────────────────────────

const BASE        = 'https://jailbreakchangelogs.xyz';
const ASSETS_BASE = 'https://assets.jailbreakchangelogs.xyz';

const REQUEST_DELAY = 150;
const CONCURRENCY   = 6;
const HC_PAGE_WAIT  = 12000;

const OUT_JSON = path.join(__dirname, 'data', 'jbcl-dupes.json');
const OUT_JS   = path.join(__dirname, 'js',   'jbcl-dupes-bundle.js');

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
  'User-Agent': 'JBLX-DupeScraper/10.0 (+https://jblx.net; permitted by JBCL owner)',
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

// ── extract owners from API response ─────────────────────────
// Returns array of { username, displayName }
//
// This is v8's extractUsernames logic (which reliably returned 2825
// records), extended to also capture the display name component.
//
// JBCL returns one of:
//   - Array of "DisplayName@Username" strings
//   - Array of objects with a username / owner / name field
//   - A wrapper object: { dupes: [...], users: [...], data: [...] }

function extractOwners(data) {
  const seen    = new Set();
  const owners  = [];

  const entries = Array.isArray(data)
    ? data
    : (data?.dupes ?? data?.users ?? data?.data ?? data?.owners ?? []);

  for (const entry of entries) {
    // ── String entries ────────────────────────────────────────
    if (typeof entry === 'string') {
      if (entry.includes('@')) {
        // "DisplayName@Username"
        const atIdx      = entry.lastIndexOf('@');
        const displayName = entry.slice(0, atIdx).trim();
        const username    = entry.slice(atIdx + 1).replace(/[^A-Za-z0-9_]/g, '').trim();
        if (username.length >= 3 && username.length <= 30 && !seen.has(username.toUpperCase())) {
          seen.add(username.toUpperCase());
          owners.push({ username, displayName: displayName || username });
        }
      } else {
        // Plain username string
        const username = entry.replace(/[^A-Za-z0-9_]/g, '').trim();
        if (username.length >= 3 && username.length <= 30 && !seen.has(username.toUpperCase())) {
          seen.add(username.toUpperCase());
          owners.push({ username, displayName: username });
        }
      }
      continue;
    }

    // ── Object entries ────────────────────────────────────────
    if (!entry || typeof entry !== 'object') continue;

    // Step 1: look for "DisplayName@Username" in any string field
    let username    = null;
    let displayName = null;

    for (const val of Object.values(entry)) {
      if (typeof val !== 'string') continue;
      if (val.includes('@') && !val.includes('http') && !val.includes('.com')) {
        const atIdx = val.lastIndexOf('@');
        const u     = val.slice(atIdx + 1).replace(/[^A-Za-z0-9_]/g, '').trim();
        const dn    = val.slice(0, atIdx).trim();
        if (u.length >= 3 && u.length <= 30) {
          username    = u;
          displayName = dn || u;
          break;
        }
      }
    }

    // Step 2: if no @ found, try dedicated username fields (same as v8)
    if (!username) {
      for (const f of ['username', 'user_name', 'roblox_username', 'owner', 'name', 'user', 'Username', 'Owner']) {
        const val = entry[f];
        if (typeof val !== 'string') continue;
        const trimmed = val.trim();
        if (/^[A-Za-z0-9_]{3,30}$/.test(trimmed)) {
          username    = trimmed;
          displayName = trimmed;
          break;
        }
      }
    }

    // Step 3: try to get a separate display name if we found a username
    if (username && !displayName) {
      for (const f of ['display_name', 'displayName', 'display', 'Display']) {
        if (typeof entry[f] === 'string' && entry[f].trim()) {
          displayName = entry[f].trim();
          break;
        }
      }
    }

    if (username && !seen.has(username.toUpperCase())) {
      seen.add(username.toUpperCase());
      owners.push({ username, displayName: displayName || username });
    }
  }

  return owners;
}

// ── item normalisation ────────────────────────────────────────

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
  if (Array.isArray(data)) tryArray(data);
  else if (data && typeof data === 'object') {
    for (const key of ['items', 'data', 'results', 'vehicles', 'list', 'hyperchromes']) {
      if (Array.isArray(data[key])) tryArray(data[key]);
    }
    const item = normaliseItem(data);
    if (item && !results.has(item.id)) results.set(item.id, item);
  }
  return [...results.values()];
}

// ── A) Main items from CDN ────────────────────────────────────

async function fetchMainItems() {
  log('Fetching items_metadata.json from CDN…');
  const data = await apiFetch(`${ASSETS_BASE}/assets/json/items_metadata.json`);
  if (!data) { log('  WARN: unavailable'); return []; }
  const items = extractItems(data);
  log(`  ✓ ${items.length} main items`);
  return items;
}

// ── B) HyperChrome via Puppeteer ─────────────────────────────

async function fetchHyperChromeData(browser) {
  const hcResults = new Map();

  for (const name of HYPERCHROME_LEVEL5_NAMES) {
    const pageUrl = `${BASE}/item/hyperchrome/${encodeURIComponent(name)}#dupes`;
    log(`  Loading HC page: ${name}…`);

    let capturedId     = null;
    let capturedOwners = [];
    let resolved       = false;
    let resolveP;
    const waitP = new Promise(r => { resolveP = r; });

    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', req => req.continue());

    page.on('response', async response => {
      const url = response.url();
      if (!url.includes('jailbreakchangelogs.xyz')) return;
      if (!url.includes('dupe') && !url.includes('user') && !url.includes('owner')) return;

      try {
        const ct = response.headers()['content-type'] || '';
        if (!ct.includes('json')) return;
        const json = await response.json().catch(() => null);
        if (!json) return;

        const idMatch = url.match(/[?&]id=(\d+)/) || url.match(/\/(\d+)(?:[?#&]|$)/);
        if (!idMatch) return;
        const id = Number(idMatch[1]);

        const owners = extractOwners(json);
        log(`    [intercept] ${url} → id=${id}, ${owners.length} owner(s)`);
        capturedId     = id;
        capturedOwners = owners;
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
      hcResults.set(name, { id: capturedId, owners: capturedOwners });
      log(`  ✓ ${name} (id=${capturedId}): ${capturedOwners.length} owner(s)`);
    } else {
      log(`  ✗ ${name}: no API call intercepted`);
    }

    await sleep(500);
  }

  return hcResults;
}

// ── C) Fetch dupers for main items ───────────────────────────

async function fetchOwnersForItem(item) {
  const data = await apiFetch(`${BASE}/api/items/dupes?id=${item.id}`);
  if (!data) return [];
  const owners = extractOwners(data);
  if (owners.length > 0) {
    log(`  ${item.name} (${item.type}, id=${item.id}): ${owners.length} owner(s)`);
  }
  return owners;
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
    note:         'username = Roblox @handle. displayName = in-game display name.',
  };

  fs.writeFileSync(OUT_JSON, JSON.stringify({ meta, records, dupeItems }, null, 2));
  log(`Wrote ${OUT_JSON} (${records.length} records)`);

  fs.writeFileSync(OUT_JS,
    `/**\n * AUTO-GENERATED by jbcl-scraper.js\n` +
    ` * Generated: ${meta.generated}\n` +
    ` * ${meta.credit}\n` +
    ` * username = Roblox @handle (use for ID lookup + search)\n` +
    ` * displayName = in-game display name\n` +
    ` * DO NOT EDIT\n */\n\n` +
    `const JBCL_RECORDS = ${JSON.stringify(records, null, 2)};\n\n` +
    `const JBCL_DUPE_ITEMS = ${JSON.stringify(dupeItems, null, 2)};\n\n` +
    `const JBCL_META = ${JSON.stringify(meta, null, 2)};\n`
  );
  log(`Wrote ${OUT_JS}`);
}

// ── main ──────────────────────────────────────────────────────

async function main() {
  log('=== JBLX Dupe Scraper v10 starting ===');

  const existingRecords = loadExistingRecords();
  const newRecords      = [];
  const dupeItems       = [];

  // A) Main items from CDN
  const mainItems = await fetchMainItems();

  // B) HyperChrome via Puppeteer
  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser';
  log('\nLaunching headless Chrome for HyperChrome pages…');
  const browser = await puppeteer.launch({
    headless: 'new', executablePath,
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu','--no-zygote'],
  });

  let hcData = new Map();
  try {
    hcData = await fetchHyperChromeData(browser);
  } finally {
    await browser.close();
  }

  // HC records
  for (const [name, { id, owners }] of hcData) {
    if (owners.length === 0) continue;
    const itemKey = name.replace(/\s+/g, '_').toUpperCase();
    dupeItems.push({ item: name, itemKey, type: 'hyperchrome', id });
    for (const { username, displayName } of owners) {
      newRecords.push({
        username:    username.toUpperCase(),
        displayName: displayName || username,
        item:        name,
        itemKey,
        type:        'hyperchrome',
        source:      'jbcl',
      });
    }
  }
  log(`\nHyperChrome: ${hcData.size} item(s), ${newRecords.length} HC records`);

  // C) Main items
  log('\nFetching owners for main items…\n');
  const ownersList = await pooled(mainItems, fetchOwnersForItem, CONCURRENCY);

  for (let i = 0; i < mainItems.length; i++) {
    const item   = mainItems[i];
    const owners = ownersList[i];
    if (!owners || owners.length === 0) continue;

    const itemKey = item.name.replace(/\s+/g, '_').toUpperCase();
    dupeItems.push({ item: item.name, itemKey, type: item.type, id: item.id });
    for (const { username, displayName } of owners) {
      newRecords.push({
        username:    username.toUpperCase(),
        displayName: displayName || username,
        item:        item.name,
        itemKey,
        type:        item.type,
        source:      'jbcl',
      });
    }
  }

  // Merge + write
  const existingDeduped = dedup(existingRecords);
  const merged          = dedup([...existingDeduped, ...newRecords]);
  const added           = merged.length - existingDeduped.length;

  const byType = {};
  for (const r of newRecords) byType[r.type] = (byType[r.type] || 0) + 1;
  log(`\nScraped by type: ${Object.entries(byType).map(([t,c]) => `${t}:${c}`).join(', ') || 'none'}`);
  log(`Summary: ${existingDeduped.length} existing + ${newRecords.length} scraped → ${merged.length} total (${added} new unique)`);

  writeOutputs(merged, dupeItems);
  log('=== Done ===');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });