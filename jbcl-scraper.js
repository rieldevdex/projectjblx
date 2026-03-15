'use strict';

/**
 * ================================================================
 *  JBLX — JBCL Dupe Scraper v9
 *
 *  JBCL returns entries in the format:  DisplayName@RobloxUsername
 *  We store BOTH so the dupe checker can match on:
 *    - username  (the @part — used for Roblox user ID lookup)
 *    - displayName (the part before @  — shown in UI)
 *
 *  What the records mean:
 *    username X owns a duped copy of item Y (as detected by JBCL's
 *    inventory scanner — NOT that X is actively trading it).
 *
 *  Item discovery:
 *    A) Main items  — items_metadata.json from JBCL's CDN
 *    B) HyperChrome — Puppeteer intercepts /api/items/dupes?id=X
 *                     while loading each HC Level 5 page
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

const REQUEST_DELAY = 150;
const CONCURRENCY   = 6;
const HC_PAGE_WAIT  = 12000;

const OUT_JSON = path.join(__dirname, 'data', 'jbcl-dupes.json');
const OUT_JS   = path.join(__dirname, 'js',   'jbcl-dupes-bundle.js');

// Known HC Level 5 names. Add new colours here as JBCL adds them.
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
  'User-Agent': 'JBLX-DupeScraper/9.0 (+https://jblx.net; permitted by JBCL owner)',
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

// ── parse "DisplayName@RobloxUsername" ───────────────────────
// Returns { displayName, username } or null.
// username is the ROBLOX username (after @).
// displayName is optional cosmetic (before @).

function parseOwnerString(str) {
  if (!str || typeof str !== 'string') return null;
  str = str.trim();

  if (str.includes('@')) {
    const atIdx      = str.lastIndexOf('@');
    const displayName = str.slice(0, atIdx).trim() || null;
    const username    = str.slice(atIdx + 1).replace(/[^A-Za-z0-9_]/g, '').trim();
    if (username.length >= 3 && username.length <= 30) {
      return { displayName: displayName || username, username };
    }
  }

  // No @ — treat entire string as username (plain username entries)
  const clean = str.replace(/[^A-Za-z0-9_]/g, '');
  if (clean.length >= 3 && clean.length <= 30) {
    return { displayName: clean, username: clean };
  }

  return null;
}

function isPlainUsername(str) {
  return /^[A-Za-z0-9_]{3,30}$/.test((str || '').trim());
}

// ── extract owners from API response ─────────────────────────
// Returns array of { displayName, username }
// Handles:
//   - Array of "DisplayName@Username" strings
//   - Array of objects with owner/username/display_name fields
//   - Wrapper objects { dupes: [...], users: [...], data: [...] }

function extractOwners(data) {
  const owners  = new Map(); // username.toUpperCase() → { displayName, username }
  const entries = Array.isArray(data)
    ? data
    : (data?.dupes ?? data?.users ?? data?.data ?? data?.owners ?? []);

  for (const entry of entries) {
    if (typeof entry === 'string') {
      // Could be "DisplayName@Username" or just "Username"
      const parsed = parseOwnerString(entry);
      if (parsed && !owners.has(parsed.username.toUpperCase())) {
        owners.set(parsed.username.toUpperCase(), parsed);
      }
      continue;
    }

    if (!entry || typeof entry !== 'object') continue;

    // ── Try to find the combined "DisplayName@Username" string first ──
    // JBCL often puts this in an "owner" or "user" field
    const combinedFields = ['owner', 'user', 'player', 'owner_name', 'user_name'];
    let found = false;
    for (const f of combinedFields) {
      const val = entry[f];
      if (typeof val === 'string' && val.includes('@')) {
        const parsed = parseOwnerString(val);
        if (parsed && !owners.has(parsed.username.toUpperCase())) {
          owners.set(parsed.username.toUpperCase(), parsed);
          found = true;
          break;
        }
      }
    }
    if (found) continue;

    // ── Try separate displayName + username fields ──
    const usernameFields     = ['username', 'roblox_username', 'roblox_name', 'login'];
    const displayNameFields  = ['display_name', 'displayName', 'display', 'name', 'alias'];

    let username    = null;
    let displayName = null;

    for (const f of usernameFields) {
      if (typeof entry[f] === 'string' && isPlainUsername(entry[f])) {
        username = entry[f].trim();
        break;
      }
    }

    for (const f of displayNameFields) {
      if (typeof entry[f] === 'string' && entry[f].trim().length > 0) {
        displayName = entry[f].trim();
        break;
      }
    }

    // Fall back: if no dedicated username field, try the @ pattern in any field
    if (!username) {
      for (const val of Object.values(entry)) {
        if (typeof val !== 'string') continue;
        if (val.includes('@')) {
          const parsed = parseOwnerString(val);
          if (parsed) { username = parsed.username; displayName = displayName || parsed.displayName; break; }
        }
      }
    }

    if (username && !owners.has(username.toUpperCase())) {
      owners.set(username.toUpperCase(), {
        username,
        displayName: displayName || username,
      });
    }
  }

  return [...owners.values()];
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
  const hcResults = new Map(); // name → { id, owners[] }

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
      // Match any endpoint that looks dupe/user related
      if (!url.includes('dupe') && !url.includes('user') && !url.includes('owner')) return;

      try {
        const ct = response.headers()['content-type'] || '';
        if (!ct.includes('json')) return;
        const json = await response.json().catch(() => null);
        if (!json) return;

        // Extract the item ID from the URL
        const idMatch = url.match(/[?&]id=(\d+)/) || url.match(/\/(\d+)(?:[?#&]|$)/);
        if (!idMatch) return;
        const id = Number(idMatch[1]);

        const owners = extractOwners(json);
        if (owners.length > 0 || !resolved) {
          log(`    [intercept] ${url} → id=${id}, ${owners.length} owner(s)`);
          capturedId     = id;
          capturedOwners = owners;
          if (!resolved) { resolved = true; resolveP(); }
        }
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
    note:         'username = Roblox username (@handle). displayName = display name shown in-game.',
  };

  fs.writeFileSync(OUT_JSON, JSON.stringify({ meta, records, dupeItems }, null, 2));
  log(`Wrote ${OUT_JSON} (${records.length} records)`);

  fs.writeFileSync(OUT_JS,
    `/**\n * AUTO-GENERATED by jbcl-scraper.js\n` +
    ` * Generated: ${meta.generated}\n` +
    ` * ${meta.credit}\n` +
    ` * username = Roblox @handle (use for ID lookup)\n` +
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
  log('=== JBLX Dupe Scraper v9 starting ===');

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

  // Build HC records
  for (const [name, { id, owners }] of hcData) {
    if (owners.length === 0) continue;
    const itemKey = name.replace(/\s+/g, '_').toUpperCase();
    dupeItems.push({ item: name, itemKey, type: 'hyperchrome', id });
    for (const { username, displayName } of owners) {
      newRecords.push({
        username:    username.toUpperCase(),   // Roblox @handle — use for ID lookup + search
        displayName: displayName || username,  // in-game display name
        item:        name,
        itemKey,
        type:        'hyperchrome',
        source:      'jbcl',
      });
    }
  }
  log(`\nHyperChrome: ${hcData.size} item(s), ${newRecords.length} HC records so far`);

  // C) Main items dupers
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
  log(`\nScraped by type: ${Object.entries(byType).map(([t,c]) => `${t}:${c}`).join(', ')}`);
  log(`Summary: ${existingDeduped.length} existing + ${newRecords.length} scraped → ${merged.length} total (${added} new unique)`);

  writeOutputs(merged, dupeItems);
  log('=== Done ===');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });