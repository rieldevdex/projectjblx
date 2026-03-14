'use strict';

/**
 * ================================================================
 *  JBLX — JBCL Dupe Scraper v6
 *
 *  Strategy:
 *   1. Use Puppeteer to load JBCL's trading/items page ONCE
 *      and intercept the full items list API call to get ALL
 *      item IDs and names (HyperChrome, Void Rims, Checkers, etc.)
 *   2. For each item ID, call /api/items/dupes?id=X directly
 *      with plain node-fetch (fast, no browser needed per item)
 *   3. Merge with existing records, write bundle
 * ================================================================
 */

const puppeteer = require('puppeteer-core');
const fetch     = require('node-fetch');
const fs        = require('fs');
const path      = require('path');

// ── config ────────────────────────────────────────────────────

const BASE          = 'https://jailbreakchangelogs.xyz';
const REQUEST_DELAY = 200;   // ms between dupes API calls
const CONCURRENCY   = 5;     // parallel dupes requests

const OUT_JSON = path.join(__dirname, 'data', 'jbcl-dupes.json');
const OUT_JS   = path.join(__dirname, 'js',   'jbcl-dupes-bundle.js');

// Pages to try for intercepting the items list
const ITEM_LIST_PAGES = [
  `${BASE}/trading`,
  `${BASE}/items`,
  `${BASE}/values`,
  `${BASE}/dupes`,
];

// ── helpers ───────────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));
const log   = (...a) => console.log(`[${new Date().toISOString()}]`, ...a);

const FETCH_HEADERS = {
  'User-Agent': 'JBLX-DupeScraper/6.0 (+https://jblx.net; permitted by JBCL owner)',
  'Accept': 'application/json',
};

async function apiFetch(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { headers: FETCH_HEADERS, timeout: 15000 });
      if (res.status === 429) { await sleep(5000); continue; }
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('json')) return null;
      return await res.json();
    } catch (err) {
      if (i === retries - 1) return null;
      await sleep(800 * (i + 1));
    }
  }
  return null;
}

// ── extract all items from intercepted JSON ───────────────────
// JBCL items list can have many shapes — handle them all

function extractItemsFromJson(data) {
  const items = [];
  const seen  = new Set();

  function tryArray(arr) {
    if (!Array.isArray(arr)) return;
    for (const obj of arr) {
      if (!obj || typeof obj !== 'object') continue;
      // Must have an id and a name
      const id   = obj.id   ?? obj.item_id ?? obj.itemId;
      const name = obj.name ?? obj.item_name ?? obj.itemName ?? obj.title;
      const type = obj.type ?? obj.category ?? 'vehicle';
      if (id && name && !seen.has(id)) {
        seen.add(id);
        items.push({ id: Number(id), name: String(name), type: String(type) });
      }
    }
  }

  if (Array.isArray(data)) {
    tryArray(data);
  } else if (data && typeof data === 'object') {
    // Try common wrapper keys
    for (const key of ['items', 'data', 'results', 'vehicles', 'list']) {
      if (Array.isArray(data[key])) { tryArray(data[key]); }
    }
    // If it's a single item, add it
    const id   = data.id ?? data.item_id;
    const name = data.name ?? data.item_name;
    if (id && name && !seen.has(id)) {
      seen.add(id);
      items.push({ id: Number(id), name: String(name), type: String(data.type || 'vehicle') });
    }
  }

  return items;
}

// ── Puppeteer: load a page and intercept all JSON API calls ───

async function interceptItemsFromPage(browser, pageUrl) {
  const page      = await browser.newPage();
  const allItems  = new Map(); // id → item
  let   resolved  = false;
  let   resolveP;
  const waitP = new Promise(r => { resolveP = r; });

  await page.setRequestInterception(true);
  page.on('request', req => req.continue());

  page.on('response', async response => {
    const url = response.url();
    if (!url.includes('jailbreakchangelogs.xyz')) return;
    try {
      const ct = response.headers()['content-type'] || '';
      if (!ct.includes('json')) return;
      const json = await response.json().catch(() => null);
      if (!json) return;

      const found = extractItemsFromJson(json);
      if (found.length > 0) {
        log(`  [intercept] ${url} → ${found.length} item(s)`);
        for (const item of found) allItems.set(item.id, item);
        // If we've got a large batch, we're done
        if (allItems.size > 20 && !resolved) {
          resolved = true;
          resolveP();
        }
      }
    } catch {}
  });

  try {
    await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 25000 });
  } catch {}

  // Wait up to 5s for a large item batch to arrive
  await Promise.race([waitP, sleep(5000)]);
  await page.close();

  return [...allItems.values()];
}

// ── fetch dupers for one item via API ─────────────────────────

function extractUsernames(data) {
  const usernames = new Set();
  const entries = Array.isArray(data) ? data : (data?.dupes ?? data?.users ?? data?.data ?? []);

  for (const entry of entries) {
    if (typeof entry === 'string') {
      if (entry.includes('@')) {
        const u = entry.split('@').pop().replace(/[^A-Za-z0-9_]/g, '');
        if (u.length >= 3 && u.length <= 30) usernames.add(u);
      } else if (/^[A-Za-z0-9_]{3,30}$/.test(entry.trim())) {
        usernames.add(entry.trim());
      }
    } else if (entry && typeof entry === 'object') {
      // Try all plausible username fields
      for (const f of ['username','user_name','roblox_username','owner','name','user','Username','Owner']) {
        const val = entry[f];
        if (typeof val !== 'string') continue;
        const trimmed = val.trim();
        if (trimmed.includes('@')) {
          const u = trimmed.split('@').pop().replace(/[^A-Za-z0-9_]/g, '');
          if (u.length >= 3) { usernames.add(u); break; }
        } else if (/^[A-Za-z0-9_]{3,30}$/.test(trimmed)) {
          usernames.add(trimmed); break;
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
  if (usernames.length > 0) log(`  ${item.name} (id=${item.id}): ${usernames.length} duper(s)`);
  return usernames;
}

// ── run N tasks with limited concurrency ─────────────────────

async function pooled(items, fn, concurrency) {
  const results = new Array(items.length);
  let   idx = 0;

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
    seen.add(key); return true;
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
  log('=== JBLX Dupe Scraper v6 starting ===');

  const existingRecords = loadExistingRecords();

  // ── Step 1: get all items by loading JBCL pages with Puppeteer ──
  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser';
  log('Launching headless Chrome…');
  const browser = await puppeteer.launch({
    headless: 'new', executablePath,
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu','--no-zygote'],
  });

  let allItems = [];
  try {
    for (const pageUrl of ITEM_LIST_PAGES) {
      log(`\nLoading ${pageUrl} to intercept items list…`);
      const found = await interceptItemsFromPage(browser, pageUrl);
      log(`  → ${found.length} items found`);

      // Merge new items
      const before = allItems.length;
      const ids = new Set(allItems.map(i => i.id));
      for (const item of found) {
        if (!ids.has(item.id)) { ids.add(item.id); allItems.push(item); }
      }
      const added = allItems.length - before;
      if (added > 0) log(`  (+${added} new, ${allItems.length} total)`);

      // If we have a substantial list, stop loading more pages
      if (allItems.length > 50) break;
    }
  } finally {
    await browser.close();
  }

  if (allItems.length === 0) {
    // Hard fallback: use known IDs from previous Puppeteer run + probe
    log('\nWARNING: Could not intercept items list — using known IDs + probe 1-300');
    const knownIds = [133,137,138,146,166,170,183,195,222]; // from prior run
    allItems = knownIds.map(id => ({ id, name: `Item_${id}`, type: 'vehicle' }));
    // Also probe for unknown IDs
    for (let id = 1; id <= 300; id++) {
      if (!knownIds.includes(id)) allItems.push({ id, name: `Item_${id}`, type: 'vehicle' });
    }
  }

  log(`\n${allItems.length} items to check. Fetching dupes via API…\n`);

  // ── Step 2: fetch dupers for every item via direct API ──────
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
        item:    item.name,
        itemKey,
        type:    item.type || 'Unknown',
        source:  'jbcl',
      });
    }
  }

  // ── Step 3: merge + write ────────────────────────────────────
  const existingDeduped = dedup(existingRecords);
  const merged          = dedup([...existingDeduped, ...newRecords]);
  const added           = merged.length - existingDeduped.length;

  log(`\nSummary: ${existingDeduped.length} existing + ${newRecords.length} scraped → ${merged.length} total (${added} new unique)`);
  writeOutputs(merged, dupeItems);
  log('=== Done ===');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });