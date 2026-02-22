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
  { username: "POLARCHYR",              item: "Torpedo", itemKey: "TORP", notes: "" },
  { username: "JOSUEESTEBAN27",         item: "Torpedo", itemKey: "TORP", notes: "" },
  { username: "SPAYE",                  item: "Torpedo", itemKey: "TORP", notes: "" },
  { username: "COCOTHECUTEGAMERO",      item: "Torpedo", itemKey: "TORP", notes: "" },
  { username: "yt_itswither",           item: "Torpedo", itemKey: "TORP", notes: "" },
  { username: "VUXSTEALSBRAWDS",        item: "Torpedo", itemKey: "TORP", notes: "" },
  { username: "SEANTHESUPERBOY123",     item: "Torpedo", itemKey: "TORP", notes: "" },
  { username: "FASTARDRAGOS",           item: "Torpedo", itemKey: "TORP", notes: "" },
  { username: "KINGPOOKIE12",           item: "Torpedo", itemKey: "TORP", notes: "" },
  { username: "XXJUMIOSXXTORPCRAVEMEOW",item: "Torpedo", itemKey: "TORP", notes: "" },
  { username: "THEBULLIED_GUEST",       item: "Torpedo", itemKey: "TORP", notes: "" },

  // ════════════ BEIGNET ════════════════════════════════════════
  { username: "david12banana",          item: "Beignet", itemKey: "BEIGNET", notes: "" },
  { username: "DetektivRoura",          item: "Beignet", itemKey: "BEIGNET", notes: "" },
  { username: "abrahanbas23",           item: "Beignet", itemKey: "BEIGNET", notes: "" },
  { username: "kraofann1",              item: "Beignet", itemKey: "BEIGNET", notes: "" },
  { username: "KingVaibhavkr",          item: "Beignet", itemKey: "BEIGNET", notes: "" },
  { username: "Emirex111xd",            item: "Beignet", itemKey: "BEIGNET", notes: "" },
  { username: "FFERAKMF2",              item: "Beignet", itemKey: "BEIGNET", notes: "" },

];

/* ── HELPERS ──────────────────────────────────────────────────── */

// Get all unique tracked items
function getDupeItems() {
  const seen = new Set();
  return DUPE_RECORDS
    .filter(r => { const k = r.itemKey; if (seen.has(k)) return false; seen.add(k); return true; })
    .map(r => ({ item: r.item, itemKey: r.itemKey }));
}

// Search by username (case-insensitive, partial match)
function searchByUsername(query) {
  if (!query.trim()) return [];
  const lo = query.toLowerCase();
  return DUPE_RECORDS.filter(r => r.username.toLowerCase().includes(lo));
}

// Search by item name (case-insensitive, partial match)
function searchByItem(query) {
  if (!query.trim()) return [];
  const lo = query.toLowerCase();
  return DUPE_RECORDS.filter(r =>
    r.item.toLowerCase().includes(lo) || r.itemKey.toLowerCase().includes(lo)
  );
}

// Combined search — used for the main search bar
function dupeSearch(query) {
  if (!query.trim()) return { type: null, results: [] };
  const lo = query.trim().toLowerCase();

  // Try username match first
  const byUser = DUPE_RECORDS.filter(r => r.username.toLowerCase() === lo);
  if (byUser.length) return { type: 'exact-user', results: byUser };

  const byUserPartial = DUPE_RECORDS.filter(r => r.username.toLowerCase().includes(lo));
  if (byUserPartial.length) return { type: 'partial-user', results: byUserPartial };

  // Then item match
  const byItem = DUPE_RECORDS.filter(r =>
    r.item.toLowerCase().includes(lo) || r.itemKey.toLowerCase().includes(lo)
  );
  if (byItem.length) return { type: 'item', results: byItem };

  // No results = clean
  return { type: 'clean', results: [] };
}