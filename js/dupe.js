/* ================================================================
   JBLX — dupe.js
   Dupe Checker Database
   Structure: { username, item, itemKey, notes }
   - username: exact Roblox username of the known duper
   - item: display name of the duped item
   - itemKey: short abbreviation / internal key
   - notes: optional context (e.g. "confirmed via trade hub")
================================================================ */

const DUPE_RECORDS = [

  // ════════════ TORPEDO ════════════════════════════════════════
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

  // ════════════ BEIGNET ════════════════════════════════════════
  { username: "david12banana",           item: "Beignet", itemKey: "BEIGNET", notes: "" },
  { username: "DetektivRoura",           item: "Beignet", itemKey: "BEIGNET", notes: "" },
  { username: "abrahanbas23",            item: "Beignet", itemKey: "BEIGNET", notes: "" },
  { username: "kraofann1",               item: "Beignet", itemKey: "BEIGNET", notes: "" },
  { username: "KingVaibhavkr",           item: "Beignet", itemKey: "BEIGNET", notes: "" },
  { username: "Emirex111xd",             item: "Beignet", itemKey: "BEIGNET", notes: "" },
  { username: "FFERAKMF2",               item: "Beignet", itemKey: "BEIGNET", notes: "" },

];

/* ================================================================
   USER ID RESOLUTION
   Converts a numeric Roblox User ID → username via a Cloudflare
   Worker proxy, which adds CORS headers that the Roblox API itself
   does not send — making direct browser fetches impossible without it.

   ► SETUP: Deploy the Worker from the JBLX README, then paste your
     Worker's URL into the ROBLOX_PROXY constant below.
================================================================ */

// ▼ Replace this with your deployed Cloudflare Worker URL
//   e.g. 'https://jblx-proxy.yourname.workers.dev'
const ROBLOX_PROXY = 'https://dupe-checker.ntlalt38092.workers.dev';

/**
 * Detects whether the query looks like a Roblox User ID.
 * Roblox IDs are purely numeric and at least 4 digits long.
 * We use 4 as the floor to avoid matching very short numeric queries.
 */
function looksLikeUserId(query) {
  return /^\d{4,}$/.test(query.trim());
}

/**
 * Resolves a Roblox User ID to a username via the Cloudflare proxy.
 * Returns the username string on success, or null on any failure.
 */
async function resolveUserId(id) {
  try {
    const res = await fetch(`${ROBLOX_PROXY}/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.name || null;
  } catch {
    // Network error, proxy down, or invalid ID
    return null;
  }
}

/* ================================================================
   HELPERS
================================================================ */

/** Get all unique tracked items (for the item browser). */
function getDupeItems() {
  const seen = new Set();
  return DUPE_RECORDS
    .filter(r => {
      const k = r.itemKey;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .map(r => ({ item: r.item, itemKey: r.itemKey }));
}

/** Search by username only (case-insensitive, partial match). */
function searchByUsername(query) {
  if (!query.trim()) return [];
  const lo = query.toLowerCase();
  return DUPE_RECORDS.filter(r => r.username.toLowerCase().includes(lo));
}

/** Search by item name or itemKey (case-insensitive, partial match). */
function searchByItem(query) {
  if (!query.trim()) return [];
  const lo = query.toLowerCase();
  return DUPE_RECORDS.filter(r =>
    r.item.toLowerCase().includes(lo) || r.itemKey.toLowerCase().includes(lo)
  );
}

/**
 * Combined search — used by the main search bar.
 * Priority: exact username → partial username → item name → clean.
 *
 * NOTE: Synchronous. Expects a resolved username, not a raw User ID.
 * ID resolution happens upstream in runSearch() inside dupe.html.
 */
function dupeSearch(query) {
  if (!query.trim()) return { type: null, results: [] };
  const lo = query.trim().toLowerCase();

  // 1. Exact username match
  const byUser = DUPE_RECORDS.filter(r => r.username.toLowerCase() === lo);
  if (byUser.length) return { type: 'exact-user', results: byUser };

  // 2. Partial username match
  const byUserPartial = DUPE_RECORDS.filter(r => r.username.toLowerCase().includes(lo));
  if (byUserPartial.length) return { type: 'partial-user', results: byUserPartial };

  // 3. Item name / key match
  const byItem = DUPE_RECORDS.filter(r =>
    r.item.toLowerCase().includes(lo) || r.itemKey.toLowerCase().includes(lo)
  );
  if (byItem.length) return { type: 'item', results: byItem };

  // 4. No match — user is clean in our records
  return { type: 'clean', results: [] };
}