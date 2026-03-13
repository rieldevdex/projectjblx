'use strict';

/**
 * ================================================================
 *  JBLX — JBCL Dupe Scraper v3
 *
 *  JBCL item pages (e.g. /item/vehicle/Power%201#dupes) list
 *  dupers in the format:  DisplayName@RobloxUsername
 *  The part AFTER @ is the actual Roblox username we want.
 *
 *  Flow:
 *  1. Scrape /dupes landing page → get list of duped items
 *  2. For each item, fetch /item/{type}/{name} and extract all
 *     @Username entries from the HTML (static or JSON-embedded)
 *  3. Merge with existing records (never delete, only add)
 *  4. Write updated bundle to js/jbcl-dupes-bundle.js
 * ================================================================
 */

const fetch   = require('node-fetch');
const cheerio = require('cheerio');
const fs      = require('fs');
const path    = require('path');

// ── config ────────────────────────────────────────────────────

const BASE_URL         = 'https://jailbreakchangelogs.xyz';
const DUPES_PAGE       = `${BASE_URL}/dupes`;
const REQUEST_DELAY_MS = 800;

const OUT_JSON = path.join(__dirname, 'data', 'jbcl-dupes.json');
const OUT_JS   = path.join(__dirname, 'js',   'jbcl-dupes-bundle.js');

// ── helpers ───────────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));
const log   = (...args) => console.log(`[${new Date().toISOString()}]`, ...args);

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'JBLX-DupeScraper/3.0 (+https://jblx.net; permitted by JBCL owner)',
      'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
    timeout: 20000,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

// ── extract all @Username entries from page HTML ──────────────
// JBCL renders entries as "DisplayName@RobloxUsername"
// We want everything after the @

function extractUsernames(html, itemName) {
  const usernames = new Set();

  // ── Strategy 1: search all <script> tags for JSON data ──────
  // JBCL likely uses Next.js / Nuxt which embeds page data as JSON
  const scriptContents = [];
  const scriptRe = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let sm;
  while ((sm = scriptRe.exec(html)) !== null) {
    scriptContents.push(sm[1]);
  }

  for (const scriptContent of scriptContents) {
    // Look for the @Username pattern inside JSON strings
    const jsonAtRe = /"([A-Za-z0-9 _]{1,40})@([A-Za-z0-9_]{3,30})"/g;
    let jm;
    while ((jm = jsonAtRe.exec(scriptContent)) !== null) {
      const username = jm[2].trim();
      if (isValidUsername(username)) usernames.add(username);
    }
  }

  if (usernames.size > 0) {
    log(`  [JSON] ${usernames.size} username(s) for ${itemName}`);
    return [...usernames];
  }

  // ── Strategy 2: parse HTML text nodes with cheerio ──────────
  const $ = cheerio.load(html);

  // Look for elements that contain "text@username" pattern
  $('*').each((_, el) => {
    // Only look at text-level elements, skip script/style
    const tag = el.tagName?.toLowerCase();
    if (['script', 'style', 'head', 'meta', 'link'].includes(tag)) return;

    const text = $(el).clone().children().remove().end().text().trim();
    if (text.includes('@') && !text.includes('http') && !text.includes('.com')) {
      // Could be "DisplayName@Username" — split on @
      const parts = text.split('@');
      if (parts.length === 2) {
        const username = parts[1].replace(/[^A-Za-z0-9_]/g, '').trim();
        if (isValidUsername(username)) usernames.add(username);
      }
    }
  });

  if (usernames.size > 0) {
    log(`  [HTML nodes] ${usernames.size} username(s) for ${itemName}`);
    return [...usernames];
  }

  // ── Strategy 3: raw regex on full HTML ──────────────────────
  // Last resort — scan the entire raw HTML for the pattern
  const rawRe = /(?:^|[\s"',>\[{])([A-Za-z0-9 _]{1,40})@([A-Za-z0-9_]{3,30})(?:[\s"',<\]\}]|$)/gm;
  let rm;
  while ((rm = rawRe.exec(html)) !== null) {
    const username = rm[2].trim();
    if (isValidUsername(username)) usernames.add(username);
  }

  if (usernames.size > 0) {
    log(`  [raw-regex] ${usernames.size} username(s) for ${itemName}`);
  } else {
    log(`  No usernames found for ${itemName}`);
  }

  return [...usernames];
}

function isValidUsername(u) {
  if (!u || u.length < 3 || u.length > 30) return false;
  if (!/^[A-Za-z0-9_]+$/.test(u)) return false;
  // Filter obvious false positives
  const lower = u.toLowerCase();
  const skip = ['gmail', 'yahoo', 'hotmail', 'outlook', 'roblox', 'jblx',
                 'jbcl', 'discord', 'twitter', 'youtube', 'com', 'net', 'org'];
  if (skip.includes(lower)) return false;
  return true;
}

// ── scrape /dupes landing page for item list ──────────────────

async function scrapeDupesLandingPage() {
  log('Fetching /dupes landing page…');
  const html = await fetchPage(DUPES_PAGE);
  const $    = cheerio.load(html);
  const items = [];
  const seen  = new Set();

  $('a[href*="/item/"]').each((_, el) => {
    const href  = $(el).attr('href') || '';
    const parts = href.split('/').filter(Boolean);
    if (parts.length >= 3 && parts[0] === 'item') {
      const type = parts[1];
      const slug = parts[2];
      const name = decodeURIComponent(slug).replace(/-/g, ' ');
      if (!seen.has(slug)) {
        seen.add(slug);
        items.push({ name, type, slug });
      }
    }
  });

  log(`  Found ${items.length} duped item(s) on landing page`);
  return items;
}

// ── scrape item page for dupers ───────────────────────────────

async function scrapeItemPage(item) {
  const urlCandidates = [
    `${BASE_URL}/item/${item.type}/${encodeURIComponent(item.name)}`,
    `${BASE_URL}/item/${item.type}/${item.slug}`,
    `${BASE_URL}/item/vehicle/${encodeURIComponent(item.name)}`,
    `${BASE_URL}/item/${item.type}/${item.name.replace(/\s+/g, '-')}`,
  ];

  // Remove duplicates
  const urls = [...new Set(urlCandidates)];

  for (const url of urls) {
    try {
      const html      = await fetchPage(url);
      const usernames = extractUsernames(html, item.name);
      if (usernames.length > 0) {
        log(`  ✓ ${item.name}: ${usernames.length} duper(s) from ${url}`);
        return usernames;
      }
    } catch (err) {
      log(`  ✗ ${url}: ${err.message}`);
    }
    await sleep(300);
  }

  log(`  ✗ ${item.name}: no data found on any URL`);
  return [];
}

// ── load / save helpers ───────────────────────────────────────

function loadExistingRecords() {
  try {
    if (fs.existsSync(OUT_JSON)) {
      const data    = JSON.parse(fs.readFileSync(OUT_JSON, 'utf8'));
      const records = data.records || [];
      log(`Loaded ${records.length} existing records`);
      return records;
    }
  } catch (err) {
    log('WARNING: Could not load existing records:', err.message);
  }
  return [];
}

function deduplicateRecords(records) {
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
  log('=== JBLX Dupe Scraper v3 starting ===');

  const existingRecords = loadExistingRecords();
  const newRecords      = [];

  // 1. Get all duped items from landing page
  let dupeItems = [];
  try {
    dupeItems = await scrapeDupesLandingPage();
  } catch (err) {
    log('FATAL: Could not fetch landing page:', err.message);
    process.exit(1);
  }
  await sleep(REQUEST_DELAY_MS);

  // 2. For each item, scrape its page for the full dupers list
  for (const item of dupeItems) {
    log(`\nScraping: ${item.name} (${item.type})`);
    try {
      const usernames = await scrapeItemPage(item);

      for (const username of usernames) {
        newRecords.push({
          username: username.toUpperCase(),
          item:     item.name,
          itemKey:  item.name.replace(/\s+/g, '_').toUpperCase(),
          type:     item.type || 'Unknown',
          source:   'jbcl',
        });
      }
    } catch (err) {
      log(`  ERROR: ${err.message}`);
    }

    await sleep(REQUEST_DELAY_MS);
  }

  // 3. Merge new into existing and deduplicate
  const existingDeduped = deduplicateRecords(existingRecords);
  const merged          = deduplicateRecords([...existingDeduped, ...newRecords]);
  const added           = merged.length - existingDeduped.length;

  log(`\nSummary: ${existingDeduped.length} existing + ${newRecords.length} scraped → ${merged.length} total (${added} new unique added)`);

  writeOutputs(merged, dupeItems);
  log('=== Done ===');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});