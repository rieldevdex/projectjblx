'use strict';

/**
 * ================================================================
 *  JBLX — JBCL Dupe Scraper (auto-discovery edition)
 *
 *  Instead of checking a hardcoded list of usernames, this scraper:
 *  1. Fetches JBCL's public /dupes landing page to get all duped items
 *  2. For each item, fetches its JBCL item page to find listed dupers
 *  3. Loads the existing jbcl-dupes.json (if any) and MERGES new
 *     records in — never removes existing entries, only adds new ones
 *  4. Writes the updated bundle back to js/jbcl-dupes-bundle.js
 *
 *  Result: every day the database grows automatically as JBCL logs
 *  new dupers, with zero manual work from you.
 * ================================================================
 */

const fetch   = require('node-fetch');
const cheerio = require('cheerio');
const fs      = require('fs');
const path    = require('path');

// ── config ────────────────────────────────────────────────────

const BASE_URL   = 'https://jailbreakchangelogs.xyz';
const API_URL    = 'https://api.jailbreakchangelogs.xyz';
const DUPES_PAGE = `${BASE_URL}/dupes`;

const REQUEST_DELAY_MS = 1200;

const OUT_JSON = path.join(__dirname, 'data', 'jbcl-dupes.json');
const OUT_JS   = path.join(__dirname, 'js',   'jbcl-dupes-bundle.js');

// ── helpers ───────────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));
const log   = (...args) => console.log(`[${new Date().toISOString()}]`, ...args);

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'JBLX-DupeScraper/2.0 (+https://jblx.net; permitted by JBCL owner)',
      'Accept': 'text/html,application/xhtml+xml',
    },
    timeout: 15000,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'JBLX-DupeScraper/2.0 (+https://jblx.net)',
      'Accept': 'application/json',
    },
    timeout: 10000,
  });
  if (!res.ok) return null;
  return res.json();
}

// Resolve Roblox username → user ID
async function resolveUsername(username) {
  try {
    const res = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
      timeout: 10000,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

// Resolve Roblox user ID → username
async function resolveUserId(userId) {
  try {
    const res = await fetch(`https://users.roblox.com/v1/users/${userId}`, { timeout: 10000 });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.name ?? null;
  } catch {
    return null;
  }
}

// ── Step 1: try JBCL public API first ────────────────────────
// If JBCL exposes a /dupes or /items/duped endpoint, use that.
// Falls back to HTML scraping if API returns nothing useful.

async function fetchViaAPI() {
  const endpoints = [
    `${API_URL}/dupes`,
    `${API_URL}/items/duped`,
    `${API_URL}/trading/dupes`,
  ];

  for (const url of endpoints) {
    try {
      const data = await fetchJson(url);
      if (data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)) {
        log(`  API hit: ${url}`);
        return data;
      }
    } catch {
      // continue to next endpoint
    }
  }
  return null;
}

// ── Step 2: scrape the /dupes landing page ────────────────────
// Returns array of { name, type, itemPagePath }

async function scrapeDupesLandingPage() {
  log('Fetching /dupes landing page…');
  const html = await fetchPage(DUPES_PAGE);
  const $    = cheerio.load(html);
  const items = [];
  const seen  = new Set();

  // Extract item links — pattern: /item/{type}/{name}
  $('a[href*="/item/"]').each((_, el) => {
    const href  = $(el).attr('href') || '';
    const parts = href.split('/').filter(Boolean);
    if (parts.length >= 3 && parts[0] === 'item') {
      const type = parts[1];
      const slug = parts[2];
      const name = decodeURIComponent(slug).replace(/-/g, ' ');
      if (!seen.has(slug)) {
        seen.add(slug);
        items.push({ name, type, slug, href });
      }
    }
  });

  // Also try card-based selectors
  $('[class*="item-card"], [class*="ItemCard"], [class*="dupe-card"]').each((_, el) => {
    const name = $(el).find('[class*="item-name"], [class*="ItemName"], h2, h3').first().text().trim();
    const type = $(el).find('[class*="item-type"], [class*="ItemType"]').first().text().trim();
    const slug = name.replace(/\s+/g, '-').toLowerCase();
    if (name && !seen.has(slug)) {
      seen.add(slug);
      items.push({ name, type: type || 'Unknown', slug, href: null });
    }
  });

  log(`  Found ${items.length} duped item(s) on landing page`);
  return items;
}

// ── Step 3: scrape per-item duper pages ───────────────────────
// JBCL may have pages like /dupes/item/Torpedo listing all dupers.
// We try several URL patterns and parse any usernames we find.

async function scrapeItemDupersPage(item) {
  const slugVariants = [
    item.slug,
    item.name.replace(/\s+/g, '-'),
    item.name.replace(/\s+/g, '_'),
    encodeURIComponent(item.name),
  ];

  const urlPatterns = slugVariants.flatMap(s => [
    `${DUPES_PAGE}/item/${s}`,
    `${DUPES_PAGE}/${item.type}/${s}`,
    `${BASE_URL}/item/${item.type}/${s}`,
  ]);

  // Also try the API
  const apiPatterns = [
    `${API_URL}/dupes/item/${item.slug}`,
    `${API_URL}/items/${item.slug}/dupers`,
    `${API_URL}/trading/dupes/${item.slug}`,
  ];

  const users = [];
  const seenUsers = new Set();

  // Try API first
  for (const url of apiPatterns) {
    try {
      const data = await fetchJson(url);
      if (data) {
        const arr = Array.isArray(data) ? data : data.users || data.dupers || [];
        for (const entry of arr) {
          const username = entry.username || entry.name || entry;
          if (typeof username === 'string' && !seenUsers.has(username.toUpperCase())) {
            seenUsers.add(username.toUpperCase());
            users.push(username);
          }
        }
        if (users.length > 0) {
          log(`  [API] ${item.name} → ${users.length} duper(s)`);
          return users;
        }
      }
    } catch { /* continue */ }
  }

  // Try HTML scraping
  for (const url of urlPatterns) {
    try {
      const html = await fetchPage(url);
      const $    = cheerio.load(html);

      // Look for username elements
      $('[class*="username"], [class*="user-name"], [class*="player"], [data-username]').each((_, el) => {
        const username = ($(el).attr('data-username') || $(el).text()).trim();
        if (username && username.length > 2 && !seenUsers.has(username.toUpperCase())) {
          seenUsers.add(username.toUpperCase());
          users.push(username);
        }
      });

      // Look for Roblox profile links
      $('a[href*="roblox.com/users/"]').each((_, el) => {
        const text = $(el).text().trim();
        if (text && !seenUsers.has(text.toUpperCase())) {
          seenUsers.add(text.toUpperCase());
          users.push(text);
        }
      });

      if (users.length > 0) {
        log(`  [HTML] ${item.name} → ${users.length} duper(s) from ${url}`);
        return users;
      }
    } catch { /* continue to next URL */ }
    await sleep(400);
  }

  if (users.length === 0) {
    log(`  ${item.name} → no dupers found via page scraping`);
  }
  return users;
}

// ── Step 4: scrape per-user dupe pages ────────────────────────
// For each username discovered, get their specific duped items.

async function scrapeUserDupePage(username) {
  const userId = await resolveUsername(username);
  if (!userId) return [];

  const url = `${DUPES_PAGE}/${userId}`;
  let html;
  try {
    html = await fetchPage(url);
  } catch {
    return [];
  }

  const $     = cheerio.load(html);
  const dupes = [];
  const seen  = new Set();

  // Item cards on user page
  $('[class*="item-card"], [class*="ItemCard"], [class*="dupe-card"], [class*="DupeItem"]').each((_, el) => {
    const name = $(el).find('[class*="item-name"], [class*="name"], h2, h3').first().text().trim();
    const type = $(el).find('[class*="type"], [class*="category"]').first().text().trim();
    if (name && !seen.has(name)) {
      seen.add(name);
      dupes.push({ username: username.toUpperCase(), item: name, itemKey: name.replace(/\s+/g, '_').toUpperCase(), type: type || 'Unknown', source: 'jbcl' });
    }
  });

  // Fallback: item links
  if (dupes.length === 0) {
    $('a[href*="/item/"]').each((_, el) => {
      const href  = $(el).attr('href') || '';
      const parts = href.split('/').filter(Boolean);
      if (parts.length >= 3 && parts[0] === 'item') {
        const name = decodeURIComponent(parts[2]).replace(/-/g, ' ');
        if (!seen.has(name)) {
          seen.add(name);
          dupes.push({ username: username.toUpperCase(), item: name, itemKey: name.replace(/\s+/g, '_').toUpperCase(), type: parts[1] || 'Unknown', source: 'jbcl' });
        }
      }
    });
  }

  return dupes;
}

// ── Step 5: load existing records (for merging) ───────────────

function loadExistingRecords() {
  try {
    if (fs.existsSync(OUT_JSON)) {
      const raw  = fs.readFileSync(OUT_JSON, 'utf8');
      const data = JSON.parse(raw);
      const records = data.records || [];
      log(`Loaded ${records.length} existing records from jbcl-dupes.json`);
      return records;
    }
  } catch (err) {
    log('WARNING: Could not load existing records:', err.message);
  }
  return [];
}

// ── Step 6: deduplicate ───────────────────────────────────────

function deduplicateRecords(records) {
  const seen = new Set();
  return records.filter(r => {
    const key = `${r.username}|${r.itemKey}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── Step 7: write outputs ─────────────────────────────────────

function writeOutputs(records, dupeItems) {
  for (const dir of ['data', 'js']) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  const meta = {
    generated:    new Date().toISOString(),
    totalRecords: records.length,
    source:       'jailbreakchangelogs.xyz (scraped with owner permission)',
    credit:       'Data sourced from JBCL — https://jailbreakchangelogs.xyz',
  };

  fs.writeFileSync(OUT_JSON, JSON.stringify({ meta, records, dupeItems }, null, 2));
  log(`Wrote ${OUT_JSON} (${records.length} total records)`);

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

// ── main ──────────────────────────────────────────────────────

async function main() {
  log('=== JBLX Dupe Scraper (auto-discovery) starting ===');

  // Load what we already have — we MERGE into this, never wipe it
  const existingRecords = loadExistingRecords();
  const newRecords      = [];

  // 1. Get all duped items from the landing page
  let dupeItems = [];
  try {
    dupeItems = await scrapeDupesLandingPage();
  } catch (err) {
    log('WARNING: Landing page scrape failed:', err.message);
  }
  await sleep(REQUEST_DELAY_MS);

  // 2. For each item, find who duped it
  const discoveredUsers = new Set();

  for (const item of dupeItems) {
    log(`Scanning dupers for: ${item.name}`);
    const users = await scrapeItemDupersPage(item);
    for (const username of users) {
      discoveredUsers.add(username);
    }
    await sleep(REQUEST_DELAY_MS);
  }

  log(`Discovered ${discoveredUsers.size} unique username(s) across all items`);

  // 3. For each discovered user, get their full dupe page
  for (const username of discoveredUsers) {
    log(`Checking user page: ${username}`);
    try {
      const records = await scrapeUserDupePage(username);
      newRecords.push(...records);
    } catch (err) {
      log(`  ERROR for ${username}:`, err.message);
    }
    await sleep(REQUEST_DELAY_MS);
  }

  // 4. If we found no per-user data, at least create records from
  //    the landing page items + discovered usernames
  if (newRecords.length === 0 && discoveredUsers.size > 0) {
    log('No per-user dupe pages found — creating records from item/user pairs');
    for (const username of discoveredUsers) {
      for (const item of dupeItems) {
        newRecords.push({
          username: username.toUpperCase(),
          item:     item.name,
          itemKey:  item.name.replace(/\s+/g, '_').toUpperCase(),
          type:     item.type || 'Unknown',
          source:   'jbcl',
        });
      }
    }
  }

  // 5. Merge: existing + new, then deduplicate
  const merged = deduplicateRecords([...existingRecords, ...newRecords]);
  const addedCount = merged.length - existingRecords.length;
  log(`Records: ${existingRecords.length} existing + ${newRecords.length} scraped → ${merged.length} total (${addedCount} new)`);

  writeOutputs(merged, dupeItems);
  log('=== Done ===');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});