'use strict';

/**
 * ================================================================
 *  JBLX — JBCL Dupe Scraper v5 (Direct API — no browser needed)
 *
 *  Puppeteer intercepted JBCL's real API endpoint:
 *    GET /api/items/dupes?id={itemId}
 *
 *  This scraper:
 *   1. Fetches ALL items from JBCL's items list API
 *   2. For each item, calls /api/items/dupes?id={id} directly
 *   3. Extracts Roblox usernames from the JSON response
 *   4. Merges with existing records (never deletes, only adds)
 *   5. Writes js/jbcl-dupes-bundle.js + data/jbcl-dupes.json
 *
 *  No Puppeteer, no Chrome, no headless browser — just fast API
 *  calls. Covers ALL items: HyperChrome, Void Rims, Checkers, etc.
 * ================================================================
 */

const fetch = require('node-fetch');
const fs    = require('fs');
const path  = require('path');

// ── config ────────────────────────────────────────────────────

const BASE_API        = 'https://jailbreakchangelogs.xyz/api';
const REQUEST_DELAY   = 300;   // ms between requests — be polite
const MAX_CONCURRENCY = 3;     // parallel requests at a time

const OUT_JSON = path.join(__dirname, 'data', 'jbcl-dupes.json');
const OUT_JS   = path.join(__dirname, 'js',   'jbcl-dupes-bundle.js');

// ── helpers ───────────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));
const log   = (...a) => console.log(`[${new Date().toISOString()}]`, ...a);

const HEADERS = {
  'User-Agent': 'JBLX-DupeScraper/5.0 (+https://jblx.net; permitted by JBCL owner)',
  'Accept': 'application/json',
};

async function apiFetch(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { headers: HEADERS, timeout: 15000 });
      if (res.status === 429) {
        log(`  Rate limited — waiting 5s…`);
        await sleep(5000);
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await sleep(1000 * (i + 1));
    }
  }
}

// ── fetch all items ───────────────────────────────────────────
// JBCL exposes a list of all items. We try a few known endpoints.

async function fetchAllItems() {
  const endpoints = [
    `${BASE_API}/items/list`,
    `${BASE_API}/items/all`,
    `${BASE_API}/items`,
    `${BASE_API}/item/list`,
  ];

  for (const url of endpoints) {
    try {
      log(`Trying items list: ${url}`);
      const data = await apiFetch(url);
      const items = Array.isArray(data) ? data : (data.items || data.data || []);
      if (items.length > 0) {
        log(`  ✓ Got ${items.length} items from ${url}`);
        return items;
      }
    } catch (err) {
      log(`  ✗ ${url}: ${err.message}`);
    }
  }

  // Fallback: probe item IDs 1–500 to discover all valid IDs
  // We know from interception: Torpedo=222, Beignet=138, etc. — IDs go to ~250+
  log('Items list API not found — probing IDs 1–500…');
  return await probeItemIds(1, 500);
}

// Probe sequential IDs to find all valid items
async function probeItemIds(start, end) {
  const items = [];
  const batchSize = 10;

  for (let id = start; id <= end; id += batchSize) {
    const batch = [];
    for (let j = id; j < Math.min(id + batchSize, end + 1); j++) {
      batch.push(j);
    }

    const results = await Promise.allSettled(
      batch.map(async itemId => {
        try {
          const data = await apiFetch(`${BASE_API}/items/get?id=${itemId}`);
          if (data && (data.name || data.item_name)) {
            return { id: itemId, name: data.name || data.item_name, type: data.type || 'vehicle' };
          }
        } catch {}
        return null;
      })
    );

    for (const r of results) {
      if (r.status === 'fulfilled' && r.value) {
        items.push(r.value);
        log(`  Found item ${r.value.id}: ${r.value.name}`);
      }
    }

    await sleep(REQUEST_DELAY);
  }

  return items;
}

// ── fetch dupers for one item ─────────────────────────────────

async function fetchDupersForItem(item) {
  try {
    const data = await apiFetch(`${BASE_API}/items/dupes?id=${item.id}`);

    // The API response could be an array of duper objects or a wrapper
    const entries = Array.isArray(data) ? data : (data.dupes || data.users || data.data || []);

    if (!entries.length) return [];

    // Extract usernames — the API returns objects with various field names
    // From interception we know it returns DisplayName@Username format somewhere,
    // or structured objects with owner/username fields
    const usernames = new Set();

    for (const entry of entries) {
      if (typeof entry === 'string') {
        // Could be "DisplayName@Username" format
        if (entry.includes('@')) {
          const parts = entry.split('@');
          const username = parts[parts.length - 1].replace(/[^A-Za-z0-9_]/g, '');
          if (username.length >= 3) usernames.add(username);
        } else if (/^[A-Za-z0-9_]{3,30}$/.test(entry)) {
          usernames.add(entry);
        }
      } else if (typeof entry === 'object' && entry !== null) {
        // Look for username fields
        const fields = ['username', 'user_name', 'roblox_username', 'owner', 'name',
                        'Username', 'Owner', 'Name', 'user', 'User'];
        for (const f of fields) {
          if (entry[f] && typeof entry[f] === 'string') {
            const val = entry[f].trim();
            // Handle "DisplayName@Username" in field values too
            if (val.includes('@')) {
              const parts = val.split('@');
              const u = parts[parts.length - 1].replace(/[^A-Za-z0-9_]/g, '');
              if (u.length >= 3) { usernames.add(u); break; }
            } else if (/^[A-Za-z0-9_]{3,30}$/.test(val)) {
              usernames.add(val);
              break;
            }
          }
        }
      }
    }

    return [...usernames];
  } catch (err) {
    log(`  ERROR fetching dupes for ${item.name} (id=${item.id}): ${err.message}`);
    return [];
  }
}

// ── load / save ───────────────────────────────────────────────

function loadExistingRecords() {
  try {
    if (fs.existsSync(OUT_JSON)) {
      const data = JSON.parse(fs.readFileSync(OUT_JSON, 'utf8'));
      const records = data.records || [];
      log(`Loaded ${records.length} existing records`);
      return records;
    }
  } catch (e) {
    log('WARNING: could not load existing records:', e.message);
  }
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
  for (const dir of ['data', 'js']) {
    if (!fs.existsSync(path.join(__dirname, dir))) {
      fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
    }
  }

  const meta = {
    generated:    new Date().toISOString(),
    totalRecords: records.length,
    source:       'jailbreakchangelogs.xyz API (used with owner permission)',
    credit:       'Data sourced from JBCL — https://jailbreakchangelogs.xyz',
  };

  fs.writeFileSync(OUT_JSON, JSON.stringify({ meta, records, dupeItems }, null, 2));
  log(`Wrote ${OUT_JSON} (${records.length} records)`);

  const bundle = `/**
 * AUTO-GENERATED by jbcl-scraper.js
 * Generated: ${meta.generated}
 * Source: ${meta.source}
 * ${meta.credit}
 * DO NOT EDIT — re-run jbcl-scraper.js to update.
 */

const JBCL_RECORDS = ${JSON.stringify(records, null, 2)};

const JBCL_DUPE_ITEMS = ${JSON.stringify(dupeItems, null, 2)};

const JBCL_META = ${JSON.stringify(meta, null, 2)};`;

  fs.writeFileSync(OUT_JS, bundle);
  log(`Wrote ${OUT_JS}`);
}

// ── run with limited concurrency ─────────────────────────────

async function processWithConcurrency(items, fn, concurrency) {
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
    if (i + concurrency < items.length) await sleep(REQUEST_DELAY);
  }
  return results;
}

// ── main ──────────────────────────────────────────────────────

async function main() {
  log('=== JBLX Dupe Scraper v5 (direct API) starting ===');

  const existingRecords = loadExistingRecords();
  const newRecords = [];

  // 1. Get all items
  const allItems = await fetchAllItems();
  if (!allItems.length) {
    log('FATAL: Could not retrieve item list');
    process.exit(1);
  }
  log(`\nFound ${allItems.length} total items — checking each for dupes…\n`);

  // 2. For each item, fetch its dupers
  const dupeItems = [];

  await processWithConcurrency(allItems, async (item) => {
    const usernames = await fetchDupersForItem(item);

    if (usernames.length > 0) {
      log(`  ${item.name}: ${usernames.length} duper(s)`);
      const itemKey = (item.name || item.id.toString()).replace(/\s+/g, '_').toUpperCase();
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
  }, MAX_CONCURRENCY);

  // 3. Merge + dedup
  const existingDeduped = dedup(existingRecords);
  const merged          = dedup([...existingDeduped, ...newRecords]);
  const added           = merged.length - existingDeduped.length;

  log(`\nSummary: ${existingDeduped.length} existing + ${newRecords.length} scraped → ${merged.length} total (${added} new unique)`);
  writeOutputs(merged, dupeItems);
  log('=== Done ===');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});