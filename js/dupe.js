/* ================================================================
   JBLX — dupe.js  (updated)
   ─────────────────────────────────────────────────────────────
   Data priority:
     1. JBLX hand-curated records (JBLX_MANUAL_RECORDS below)
     2. JBCL auto-scraped records (JBCL_RECORDS, from jbcl-dupes-bundle.js)

   Include scripts in dupe.html in this order:
     <script src="js/jbcl-dupes-bundle.js"></script>  ← auto-generated
     <script src="js/dupe.js"></script>                ← this file
================================================================ */

/* ── YOUR HAND-CURATED RECORDS ─────────────────────────────── */
/* Keep adding confirmed dupers here. These are shown first.    */

const JBLX_MANUAL_RECORDS = [

  // ════════ TORPEDO ════════════════════════════════════════════
  { username: "POLARCHYR",               item: "Torpedo", itemKey: "TORP", notes: "" },
  { username: "JOSUEESTEBAN27",          item: "Torpedo", itemKey: "TORP", notes: "" },
  { username: "SPAYE",                   item: "Torpedo", itemKey: "TORP", notes: "" },
  { username: "COCOTHECUTEGAMERO",       item: "Torpedo", itemKey: "TORP", notes: "" },
  { username: "yt_itswither",            item: "Torpedo", itemKey: "TORP", notes: "" },
  { username: "VUXSTEALSBRAWDS",         item: "Torpedo", itemKey: "TORP", notes: "" },
  { username: "SEANTHESUPERBOY123",      item: "Torpedo", itemKey: "TORP", notes: "" },
  { username: "FASTARDRAGOS",            item: "Torpedo", itemKey: "TORP", notes: "" },
  { username: "KINGPOOKIE12",            item: "Torpedo", itemKey: "TORP", notes: "" },
  { username: "XXJUMIOSXXTORPCRAVEMEOW", item: "Torpedo", itemKey: "TORP", notes: "" },
  { username: "THEBULLIED_GUEST",        item: "Torpedo", itemKey: "TORP", notes: "" },

  // ════════ BEIGNET ════════════════════════════════════════════
  { username: "david12banana",           item: "Beignet", itemKey: "BEIGNET", notes: "" },
  { username: "DetektivRoura",           item: "Beignet", itemKey: "BEIGNET", notes: "" },
  { username: "abrahanbas23",            item: "Beignet", itemKey: "BEIGNET", notes: "" },
  { username: "kraofann1",               item: "Beignet", itemKey: "BEIGNET", notes: "" },
  { username: "KingVaibhavkr",           item: "Beignet", itemKey: "BEIGNET", notes: "" },
  { username: "Emirex111xd",             item: "Beignet", itemKey: "BEIGNET", notes: "" },
  { username: "FFERAKMF2",               item: "Beignet", itemKey: "BEIGNET", notes: "" },

];

/* ── MERGE: manual + JBCL bundle ───────────────────────────── */
/* JBCL_RECORDS comes from jbcl-dupes-bundle.js (auto-generated).
   If that file hasn't been generated yet, fall back to empty.   */

const DUPE_RECORDS = [
  ...JBLX_MANUAL_RECORDS,
  ...(typeof JBCL_RECORDS !== 'undefined' ? JBCL_RECORDS : []),
];

/* ── USER ID RESOLUTION ────────────────────────────────────── */

const ROBLOX_PROXY = 'https://jblx-dupe-proxy.ntlalt38092.workers.dev';

function looksLikeUserId(query) {
  return /^\d{4,}$/.test(query.trim());
}

async function resolveUserId(id) {
  try {
    const res = await fetch(`${ROBLOX_PROXY}/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.name || null;
  } catch {
    return null;
  }
}

/* ── LIVE JBCL FALLBACK ────────────────────────────────────── */
/* If a username is NOT found in our local database, we do a    */
/* live lookup on the JBCL public page via your Cloudflare      */
/* Worker proxy (add a second route to the same worker, or      */
/* deploy a separate one — see template below).                  */

const JBCL_PROXY = 'https://jblx-dupe-proxy.ntlalt38092.workers.dev/jbcl';
// Set to false to disable live fallback (local DB only)
const JBCL_LIVE_ENABLED = true;

/**
 * Checks JBCL's public /dupes/{userId} page via your proxy.
 * Returns an array of { username, item, itemKey, source:'jbcl-live' }
 * or null if the lookup failed or returned nothing.
 */
async function checkJBCLLive(username) {
  if (!JBCL_LIVE_ENABLED) return null;
  try {
    const url = `${JBCL_PROXY}/${encodeURIComponent(username)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = await res.json();
    // Proxy returns: { dupes: [{ item, itemKey, type }] }
    if (!data?.dupes?.length) return null;
    return data.dupes.map(d => ({
      username: username.toUpperCase(),
      item:    d.item,
      itemKey: d.itemKey || d.item.replace(/\s+/g,'_').toUpperCase(),
      source:  'jbcl-live',
    }));
  } catch {
    return null;
  }
}

/* ── HELPERS ──────────────────────────────────────────────── */

function getDupeItems() {
  const seen = new Set();
  return DUPE_RECORDS
    .filter(r => { const k = r.itemKey; if (seen.has(k)) return false; seen.add(k); return true; })
    .map(r => ({ item: r.item, itemKey: r.itemKey }));
}

function searchByUsername(query) {
  if (!query.trim()) return [];
  const lo = query.toLowerCase();
  return DUPE_RECORDS.filter(r => r.username.toLowerCase().includes(lo));
}

function searchByItem(query) {
  if (!query.trim()) return [];
  const lo = query.toLowerCase();
  return DUPE_RECORDS.filter(r =>
    r.item.toLowerCase().includes(lo) || r.itemKey.toLowerCase().includes(lo)
  );
}

/**
 * Combined search.
 * Returns { type, results, jbclLive } where jbclLive is a Promise
 * that resolves to live JBCL results (or null) for clean results.
 */
function dupeSearch(query) {
  if (!query.trim()) return { type: null, results: [], jbclLive: null };
  const lo = query.trim().toLowerCase();

  // 1. Exact username
  const byUser = DUPE_RECORDS.filter(r => r.username.toLowerCase() === lo);
  if (byUser.length) return { type: 'exact-user', results: byUser, jbclLive: null };

  // 2. Partial username
  const byUserPartial = DUPE_RECORDS.filter(r => r.username.toLowerCase().includes(lo));
  if (byUserPartial.length) return { type: 'partial-user', results: byUserPartial, jbclLive: null };

  // 3. Item name
  const byItem = DUPE_RECORDS.filter(r =>
    r.item.toLowerCase().includes(lo) || r.itemKey.toLowerCase().includes(lo)
  );
  if (byItem.length) return { type: 'item', results: byItem, jbclLive: null };

  // 4. Clean in our DB — kick off a live JBCL check in parallel
  return {
    type: 'clean',
    results: [],
    jbclLive: checkJBCLLive(query.trim()),
  };
}

/* ================================================================
   CLOUDFLARE WORKER TEMPLATE — JBCL PROXY ROUTE
   ─────────────────────────────────────────────────────────────
   Add this route to your existing Cloudflare Worker that already
   handles Roblox user ID resolution.

   The worker fetches the public JBCL /dupes/{userId} page,
   parses the JSON-LD or HTML, and returns structured dupe data.

   Route: GET /jbcl/:username
   ─────────────────────────────────────────────────────────────

   // In your worker's fetch handler, add:

   if (url.pathname.startsWith('/jbcl/')) {
     const username = decodeURIComponent(url.pathname.replace('/jbcl/', ''));

     // Step 1: resolve username → Roblox user ID
     const robloxRes = await fetch(
       `https://users.roblox.com/v1/usernames/users`,
       {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
       }
     );
     const robloxData = await robloxRes.json();
     const userId = robloxData?.data?.[0]?.id;
     if (!userId) {
       return new Response(JSON.stringify({ dupes: [] }), {
         headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
       });
     }

     // Step 2: fetch JBCL public dupe page
     const jbclRes = await fetch(
       `https://jailbreakchangelogs.xyz/dupes/${userId}`,
       { headers: { 'User-Agent': 'JBLX-DupeProxy/1.0 (+https://jblx.net)' } }
     );
     const html = await jbclRes.text();

     // Step 3: extract duped item names from HTML
     // Look for JSON-LD structured data first (most reliable)
     const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
     let dupes = [];

     if (jsonLdMatch) {
       try {
         const ld = JSON.parse(jsonLdMatch[1]);
         // shape varies; adjust if JBCL adds schema markup
         dupes = (ld.items || []).map(i => ({
           item: i.name || i,
           itemKey: (i.name || i).replace(/\s+/g,'_').toUpperCase(),
         }));
       } catch {}
     }

     if (!dupes.length) {
       // Fallback: scrape item links
       const itemRe = /href="\/item\/[^/]+\/([^"]+)"/g;
       let m;
       const seen = new Set();
       while ((m = itemRe.exec(html)) !== null) {
         const name = decodeURIComponent(m[1]).replace(/-/g,' ');
         if (!seen.has(name)) { seen.add(name); dupes.push({ item: name, itemKey: name.replace(/\s+/g,'_').toUpperCase() }); }
       }
     }

     return new Response(JSON.stringify({ dupes }), {
       headers: {
         'Content-Type': 'application/json',
         'Access-Control-Allow-Origin': 'https://jblx.net',
         'Cache-Control': 'public, max-age=3600',
       }
     });
   }

================================================================ */