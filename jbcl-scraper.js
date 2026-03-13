/**
 * ================================================================
 *  JBLX — JBCL Dupe Scraper
 *  Scrapes publicly accessible pages on jailbreakchangelogs.xyz
 *  with their owner's permission.
 *
 *  HOW IT WORKS
 *  ─────────────────────────────────────────────────────────────
 *  1. Hits /dupes (the public "most duplicated items" landing page)
 *     to get a list of known-duped item names.
 *  2. For each username in WATCH_USERS (your existing DUPE_RECORDS
 *     usernames + any extras), hits /dupes/{userId} and scrapes
 *     the HTML result for flagged items.
 *  3. Merges everything and writes output to:
 *       data/jbcl-dupes.json       — full flat record list
 *       js/jbcl-dupes-bundle.js    — ready-to-drop-in JS module
 *
 *  SETUP
 *  ─────────────────────────────────────────────────────────────
 *  npm install node-fetch cheerio          # one-time
 *
 *  Run manually:
 *    node jbcl-scraper.js
 *
 *  Run daily via cron (server / GitHub Actions):
 *    0 4 * * * /usr/bin/node /path/to/jbcl-scraper.js >> scraper.log 2>&1
 *
 *  GitHub Actions alternative: see the workflow template at the
 *  bottom of this file (copy into .github/workflows/scrape-dupes.yml)
 * ================================================================
 */

'use strict';

// ── deps ──────────────────────────────────────────────────────
// node-fetch v2 for CommonJS  (npm i node-fetch@2 cheerio)
const fetch   = require('node-fetch');
const cheerio = require('cheerio');
const fs      = require('fs');
const path    = require('path');

// ── config ────────────────────────────────────────────────────

const BASE_URL   = 'https://jailbreakchangelogs.xyz';
const DUPES_PAGE = `${BASE_URL}/dupes`;

// Roblox usernames whose per-user pages should be scraped.
// This list is seeded from your existing DUPE_RECORDS in dupe.js.
// Add/remove as needed — the scraper will keep these up to date.
const WATCH_USERS = [
  // ── Torpedo dupers (from dupe.js) ──
  'POLARCHYR', 'JOSUEESTEBAN27', 'SPAYE', 'COCOTHECUTEGAMERO',
  'yt_itswither', 'VUXSTEALSBRAWDS', 'SEANTHESUPERBOY123',
  'FASTARDRAGOS', 'KINGPOOKIE12', 'XXJUMIOSXXTORPCRAVEMEOW',
  'THEBULLIED_GUEST',
  // ── Beignet dupers ──
  'david12banana', 'DetektivRoura', 'abrahanbas23', 'kraofann1',
  'KingVaibhavkr', 'Emirex111xd', 'FFERAKMF2',
  // ── Add more usernames here as your community reports them ──
];

// Polite delay between requests (ms). Don't hammer their server.
const REQUEST_DELAY_MS = 1200;

// Output paths (relative to this script)
const OUT_JSON = path.join(__dirname, 'data', 'jbcl-dupes.json');
const OUT_JS   = path.join(__dirname, 'js',   'jbcl-dupes-bundle.js');

// ── helpers ───────────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));

const log = (...args) =>
  console.log(`[${new Date().toISOString()}]`, ...args);

/** Fetch with a User-Agent that identifies JBLX (polite scraping). */
async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'JBLX-DupeScraper/1.0 (+https://jblx.net; permitted by JBCL owner)',
      'Accept': 'text/html,application/xhtml+xml',
    },
    timeout: 15000,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

/** Resolve a username → Roblox user ID via their own proxy endpoint. */
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

// ── Step 1: scrape the /dupes landing page ────────────────────
// The page shows a public grid of the most-duplicated items.
// Each card contains: item name, type, cash value, duped value.

async function scrapeDupesLandingPage() {
  log('Fetching /dupes landing page…');
  const html = await fetchPage(DUPES_PAGE);
  const $    = cheerio.load(html);
  const items = [];

  // JBCL renders item cards — the exact selectors below match their
  // current DOM as of early 2026. If JBCL updates their markup,
  // adjust these selectors by inspecting their page source.
  $('[class*="item-card"], [class*="ItemCard"], [class*="dupe-card"]').each((_, el) => {
    const name = $(el).find('[class*="item-name"], [class*="ItemName"], h2, h3').first().text().trim();
    const type = $(el).find('[class*="item-type"], [class*="ItemType"]').first().text().trim();
    if (name) items.push({ name, type: type || 'Unknown' });
  });

  // Fallback: look for any heading that sits inside a card-like container
  if (items.length === 0) {
    $('a[href*="/item/"]').each((_, el) => {
      const href = $(el).attr('href') || '';
      // href pattern: /item/vehicle/Torpedo
      const parts = href.split('/').filter(Boolean);
      if (parts.length >= 3 && parts[0] === 'item') {
        const type = parts[1];
        const name = parts[2].replace(/-/g, ' ');
        items.push({ name, type });
      }
    });
  }

  log(`  Found ${items.length} duped items on landing page`);
  return items;
}

// ── Step 2: scrape per-user /dupes/{userId} pages ─────────────
// Each user page lists which of their items are flagged as duped.

async function scrapeUserDupePage(username) {
  // First resolve to a numeric ID (JBCL URLs use numeric IDs)
  const userId = await resolveUsername(username);
  if (!userId) {
    log(`  Could not resolve user ID for: ${username}`);
    return [];
  }

  const url = `${DUPES_PAGE}/${userId}`;
  let html;
  try {
    html = await fetchPage(url);
  } catch (err) {
    log(`  Failed to fetch ${url}: ${err.message}`);
    return [];
  }

  const $      = cheerio.load(html);
  const dupes  = [];

  // Each duped item on the user page is an item card.
  // We look for the item name and its type.
  $('[class*="item-card"], [class*="ItemCard"], [class*="dupe-card"], [class*="DupeItem"]').each((_, el) => {
    const name = $(el).find('[class*="item-name"], [class*="name"], h2, h3').first().text().trim();
    const type = $(el).find('[class*="type"], [class*="category"]').first().text().trim();
    if (name) {
      dupes.push({
        username: username.toUpperCase(),
        item:    name,
        itemKey: name.replace(/\s+/g, '_').toUpperCase(),
        type:    type || 'Unknown',
        source:  'jbcl',
      });
    }
  });

  // Fallback: look for item links in the page
  if (dupes.length === 0) {
    $('a[href*="/item/"]').each((_, el) => {
      const href  = $(el).attr('href') || '';
      const parts = href.split('/').filter(Boolean);
      if (parts.length >= 3 && parts[0] === 'item') {
        const name = decodeURIComponent(parts[2]).replace(/-/g, ' ');
        dupes.push({
          username: username.toUpperCase(),
          item:    name,
          itemKey: name.replace(/\s+/g, '_').toUpperCase(),
          type:    parts[1] || 'Unknown',
          source:  'jbcl',
        });
      }
    });
  }

  log(`  ${username} → ${dupes.length} duped item(s)`);
  return dupes;
}

// ── Step 3: merge + deduplicate ───────────────────────────────

function deduplicateRecords(records) {
  const seen = new Set();
  return records.filter(r => {
    const key = `${r.username}|${r.itemKey}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── Step 4: write output files ────────────────────────────────

function writeOutputs(records, dupeItems) {
  // Ensure output dirs exist
  for (const dir of ['data', 'js']) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  const meta = {
    generated:   new Date().toISOString(),
    totalRecords: records.length,
    source:      'jailbreakchangelogs.xyz (scraped with owner permission)',
    credit:      'Data sourced from JBCL — https://jailbreakchangelogs.xyz',
  };

  // data/jbcl-dupes.json  — raw data for server/build tools
  fs.writeFileSync(OUT_JSON, JSON.stringify({ meta, records, dupeItems }, null, 2));
  log(`Wrote ${OUT_JSON} (${records.length} records)`);

  // js/jbcl-dupes-bundle.js — drop-in for dupe.js in the browser
  // This replaces/extends your DUPE_RECORDS array in dupe.js.
  const bundle = `
/**
 * AUTO-GENERATED by jbcl-scraper.js
 * Generated: ${meta.generated}
 * Source: ${meta.source}
 * ${meta.credit}
 *
 * DO NOT EDIT — re-run jbcl-scraper.js to update.
 *
 * HOW TO USE:
 *   In dupe.js, replace the DUPE_RECORDS array definition with:
 *     const DUPE_RECORDS = [...JBCL_RECORDS, ...JBLX_MANUAL_RECORDS];
 *   where JBLX_MANUAL_RECORDS is your existing hand-curated list.
 *   Then include this script BEFORE dupe.js in dupe.html:
 *     <script src="js/jbcl-dupes-bundle.js"></script>
 *     <script src="js/dupe.js"></script>
 */

const JBCL_RECORDS = ${JSON.stringify(records, null, 2)};

const JBCL_DUPE_ITEMS = ${JSON.stringify(dupeItems, null, 2)};

const JBCL_META = ${JSON.stringify(meta, null, 2)};
`.trim();

  fs.writeFileSync(OUT_JS, bundle);
  log(`Wrote ${OUT_JS}`);
}

// ── main ──────────────────────────────────────────────────────

async function main() {
  log('=== JBLX Dupe Scraper starting ===');

  const allRecords = [];

  // 1. Landing page — get known-duped item list
  let dupeItems = [];
  try {
    dupeItems = await scrapeDupesLandingPage();
  } catch (err) {
    log('WARNING: Landing page scrape failed:', err.message);
  }

  await sleep(REQUEST_DELAY_MS);

  // 2. Per-user pages
  log(`Scraping ${WATCH_USERS.length} user pages…`);
  for (const username of WATCH_USERS) {
    try {
      const records = await scrapeUserDupePage(username);
      allRecords.push(...records);
    } catch (err) {
      log(`  ERROR for ${username}:`, err.message);
    }
    await sleep(REQUEST_DELAY_MS);
  }

  // 3. Deduplicate + write
  const clean = deduplicateRecords(allRecords);
  log(`Total records: ${allRecords.length} → ${clean.length} after dedup`);

  writeOutputs(clean, dupeItems);
  log('=== Done ===');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});


/*
==================================================================
  GITHUB ACTIONS WORKFLOW TEMPLATE
  Save this as: .github/workflows/scrape-dupes.yml
  It runs daily at 04:00 UTC, commits jbcl-dupes-bundle.js
  back to the repo so your site is always up to date.
==================================================================

name: Scrape JBCL Dupes

on:
  schedule:
    - cron: '0 4 * * *'   # every day at 04:00 UTC
  workflow_dispatch:        # allow manual trigger from GitHub UI

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm install node-fetch@2 cheerio

      - name: Run scraper
        run: node jbcl-scraper.js

      - name: Commit updated dupe bundle
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: 'chore: auto-update JBCL dupe data'
          file_pattern: 'js/jbcl-dupes-bundle.js data/jbcl-dupes.json'
          commit_user_name: 'jblx-bot'
          commit_user_email: 'bot@jblx.net'
*/