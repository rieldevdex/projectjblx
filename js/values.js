/* ================================================================
   JBLX — values.js
   Item data, filtering, sorting, pagination, card/list rendering
================================================================ */

const PAGE_SIZE = 20;

// ── IMAGE PATH HELPERS ────────────────────────────────────────
// Item images live in assets/item-images/{type}/{filename}
// Set image: "" to use the auto-generated initials fallback.
// TODO: Add image filenames as assets are dropped into the folders.

// ── ITEM DATA ─────────────────────────────────────────────────
const ITEMS = [

  // ════════════ VEHICLES ════════════════════════════════════════
  {
    name: "Javelin",       type: "Vehicle",
    value: 50000000,       duped: null,
    demand: "High",        trend: "Stable",     change: "+500,000",
    description: "Limited seasonal vehicle from Season 2. Sleek aerodynamic design and early-season origin make it one of the most coveted vehicles in the trading scene.",
    notes: "S2 · Updated 1 week ago",
    image: "assets/item-images/vehicles/javelin.webp"
  },
  {
    name: "Torpedo",       type: "Vehicle",
    value: 49000000,       duped: 44000000,
    demand: "Decent",      trend: "Stable",     change: "+1,000,000",
    description: "High-performance vehicle from Season 6. Streamlined chassis and sustained resale demand among veteran traders.",
    notes: "S6 · Updated 4 days ago",
    image: "assets/item-images/vehicles/torpedo.png"
  },
  {
    name: "Beignet",       type: "Vehicle",
    value: 40000000,       duped: 37000000,
    demand: "High",        trend: "Stable",     change: "+500,000",
    description: "Fan-favourite novelty vehicle from Season 8. Unique appearance and high-level requirement make it a rare find in active trades.",
    notes: "S8 · L10 · Updated 4 weeks ago",
    image: "assets/item-images/vehicles/beignet.png"
  },
  {
    name: "Celsior",       type: "Vehicle",
    value: 33000000,       duped: 31000000,
    demand: "Medium",      trend: "Stable",     change: "-500,000",
    description: "Refined luxury vehicle from Season 14. Facing a slight downtrend as newer seasonal releases compete for trader attention.",
    notes: "S14 · L10 · Updated 6 days ago",
    image: "assets/item-images/vehicles/celsior.png"
  },
  {
    name: "Proto-8",       type: "Vehicle",
    value: 30000000,       duped: null,
    demand: "High",        trend: "Stable",     change: "+500,000",
    description: "Futuristic concept vehicle from Season 17. High demand sustained by its unique aesthetic and clean trade history.",
    notes: "S17 · L10 · Updated 3 weeks ago",
    image: ""
  },
  {
    name: "Power 1",       type: "Vehicle",
    value: 23000000,       duped: null,
    demand: "High",        trend: "Stable",     change: "+500,000",
    description: "Exclusive high-performance vehicle from Season 2. Early-season origin contributes significantly to its maintained trading value.",
    notes: "S2 · Updated 4 weeks ago",
    image: ""
  },
  {
    name: "Arachnid",      type: "Vehicle",
    value: 21000000,       duped: 18000000,
    demand: "Medium",      trend: "Stable",     change: "+500,000",
    description: "Spider-themed vehicle from Season 7 with a distinctive multi-legged visual design. Moderate demand with a notable duped value spread.",
    notes: "S7 · L10 · Updated 1 week ago",
    image: ""
  },
  {
    name: "Icebreaker",    type: "Vehicle",
    value: 20000000,       duped: 17000000,
    demand: "Decent",      trend: "Stable",     change: "+500,000",
    description: "Winter-themed vehicle from Season 1. One of the earliest seasonal vehicles, giving it nostalgic value and consistent trading activity.",
    notes: "S1 · L10 · Updated 2 months ago",
    image: ""
  },
  {
    name: "Beam Hybrid",   type: "Vehicle",
    value: 19000000,       duped: 16000000,
    demand: "Decent",      trend: "Stable",     change: "+500,000",
    description: "Eco-styled hybrid vehicle from Season 5. Clean design and level-locked status make it a mid-tier staple in most trade lists.",
    notes: "S5 · L10 · Updated 3 months ago",
    image: ""
  },
  {
    name: "Banana Car",    type: "Vehicle",
    value: 17000000,       duped: null,
    demand: "Decent",      trend: "Hyped",      change: "+1,000,000",
    description: "Novelty fruit-themed vehicle currently experiencing a hype surge. Recent community attention has driven value upward rapidly.",
    notes: "Updated 19 hours ago",
    image: ""
  },
  {
    name: "Molten M12",    type: "Vehicle",
    value: 15000000,       duped: null,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "Fiery-themed variant of the M12 from Season 3. Maintains steady trading volume with consistent mid-tier demand.",
    notes: "S3 · Updated 19 hours ago",
    image: ""
  },
  {
    name: "Stallion",      type: "Vehicle",
    value: 14000000,       duped: 12000000,
    demand: "Decent",      trend: "Stable",     change: "+500,000",
    description: "A powerful muscle car with classic American styling. Popular among collectors for its aggressive look and respectable value floor.",
    notes: "S9 · Updated 1 week ago",
    image: ""
  },
  {
    name: "Brulee",        type: "Vehicle",
    value: 13500000,       duped: null,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "Dessert-themed novelty vehicle. Part of the culinary series alongside Macaron and Carbonara.",
    notes: "S11 · Updated 2 weeks ago",
    image: ""
  },
  {
    name: "Widebody Concept", type: "Vehicle",
    value: 13000000,       duped: null,
    demand: "Medium",      trend: "Falling",    change: "-500,000",
    description: "Wide-body styled concept car with an aggressive stance. Demand has softened as the market shifts toward newer seasonal vehicles.",
    notes: "S13 · L10 · Updated 5 days ago",
    image: ""
  },
  {
    name: "Rattler",       type: "Vehicle",
    value: 12500000,       duped: null,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Snake-themed vehicle with a bold, exotic design. Holds mid-tier value with a reliable collector base.",
    notes: "S12 · Updated 3 weeks ago",
    image: ""
  },
  {
    name: "Raptor",        type: "Vehicle",
    value: 11000000,       duped: null,
    demand: "Low",         trend: "Stable",     change: "-500,000",
    description: "Rugged off-road vehicle from Season 3. Falling demand as newer offerings attract trader attention.",
    notes: "S3 · L10 · Updated 2 days ago",
    image: ""
  },
  {
    name: "Volt 4x4",      type: "Vehicle",
    value: 10000000,       duped: null,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "Electric off-road SUV from Season 2. Fan favourite for its versatility and clean aesthetic.",
    notes: "S2 · L10 · Updated 3 days ago",
    image: ""
  },
  {
    name: "Badger",        type: "Vehicle",
    value: 9800000,        duped: null,
    demand: "Decent",      trend: "Rising",     change: "+300,000",
    description: "A rugged all-terrain vehicle with a stocky build. Slowly gaining traction in the market.",
    notes: "S16 · Updated 4 days ago",
    image: ""
  },
  {
    name: "Crew Capsule",  type: "Vehicle",
    value: 9500000,        duped: null,
    demand: "Very Low",    trend: "Stable",     change: "-500,000",
    description: "Space-themed vehicle with very limited trading interest. Oversaturation and low community demand.",
    notes: "Updated 1 day ago",
    image: ""
  },
  {
    name: "Parisian",      type: "Vehicle",
    value: 9000000,        duped: null,
    demand: "High",        trend: "Stable",     change: "+500,000",
    description: "Stylish European-inspired vehicle with a loyal collector base. High demand relative to its value tier.",
    notes: "Updated 19 hours ago",
    image: ""
  },
  {
    name: "Stealth",       type: "Vehicle",
    value: 8500000,        duped: null,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Sleek dark-toned vehicle with a military stealth aesthetic. Consistent collector appeal in mid-range trades.",
    notes: "S10 · Updated 2 weeks ago",
    image: ""
  },
  {
    name: "Aperture",      type: "Vehicle",
    value: 7500000,        duped: null,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "Sleek tech-themed vehicle from Season 15. Distinctive lens-shaped design with steady collector demand.",
    notes: "S15 · L10 · Updated 1 month ago",
    image: ""
  },
  {
    name: "Shogun",        type: "Vehicle",
    value: 6500000,        duped: null,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "Samurai-inspired vehicle with strong visual identity. Consistent trading activity across multiple market cycles.",
    notes: "Updated 3 months ago",
    image: ""
  },
  {
    name: "Scorpion",      type: "Vehicle",
    value: 6000000,        duped: null,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "Aggressive-styled sports vehicle. Recognisable design and broad appeal keep it active in casual trading.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "Carbonara",     type: "Vehicle",
    value: 5500000,        duped: null,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "Food-themed novelty vehicle from Season 10. Part of the culinary series with consistent collector interest.",
    notes: "S10 · L10 · Updated 19 hours ago",
    image: ""
  },
  {
    name: "Macaron",       type: "Vehicle",
    value: 5500000,        duped: null,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "Pastel-coloured confectionery vehicle. Novelty appeal sustains its position in the lower value bracket.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "LM002",         type: "Vehicle",
    value: 5000000,        duped: null,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Classic luxury SUV with historical significance in the Jailbreak lineup. Steady but unspectacular demand.",
    notes: "Updated 6 weeks ago",
    image: ""
  },
  {
    name: "Lunar Roving Vehicle", type: "Vehicle",
    value: 4500000,        duped: null,
    demand: "Medium",      trend: "Falling",    change: "-300,000",
    description: "Space exploration-themed vehicle. Quirky novelty keeps some collector interest but overall sentiment has softened.",
    notes: "Updated 2 months ago",
    image: ""
  },
  {
    name: "Tiburon",       type: "Vehicle",
    value: 4000000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "A sleek coupe with a shark-inspired name. Limited demand outside of dedicated collectors.",
    notes: "S4 · Updated 2 months ago",
    image: ""
  },
  {
    name: "Roadster",      type: "Vehicle",
    value: 3500000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "Classic open-top sports car. Nostalgic value for long-time players but limited appeal in the current meta.",
    notes: "Updated 3 months ago",
    image: ""
  },
  {
    name: "Blade",         type: "Vehicle",
    value: 20000000,       duped: null,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Sleek and fast vehicle with blade-like design. Steady demand in mid-tier trades.",
    notes: "Updated 2 weeks ago",
    image: ""
  },
  {
    name: "Icicle",        type: "Vehicle",
    value: 3500000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "Winter-themed vehicle with icicle aesthetics. Niche appeal for seasonal collectors.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "JB8",           type: "Vehicle",
    value: 3500000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "Classic vehicle model with reliable performance. Low demand but stable value.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "Iceborn",       type: "Vehicle",
    value: 3500000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "Ice-themed vehicle from limited event. Rare but low trading interest.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "Snake",         type: "Vehicle",
    value: 3500000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "Snake-inspired vehicle with unique handling. Niche collector item.",
    notes: "S16 · L10 · Updated 1 month ago",
    image: ""
  },
  {
    name: "Torero",        type: "Vehicle",
    value: 3500000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "High-performance vehicle from 2021 Winter Update. Steady low-tier value.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "Concept",       type: "Vehicle",
    value: 2500000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "Futuristic concept vehicle. Moderate collector interest.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "Bloxy",         type: "Vehicle",
    value: 2500000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "Blocky-themed vehicle from Season 3. Nostalgic appeal.",
    notes: "S3 · L10 · Updated 1 month ago",
    image: ""
  },
  {
    name: "Tiny Toy",      type: "Vehicle",
    value: 3000000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "Miniature toy vehicle from Season 11. Fun novelty item.",
    notes: "S11 · L10 · Updated 1 month ago",
    image: ""
  },
  {
    name: "Frost Crawler", type: "Vehicle",
    value: 1500000,        duped: null,
    demand: "Very Low",    trend: "Stable",     change: "",
    description: "Frosty crawler vehicle. Low demand due to common availability.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "Manta",         type: "Vehicle",
    value: 1500000,        duped: null,
    demand: "Very Low",    trend: "Stable",     change: "",
    description: "Futuristic bike vehicle. Minimal trading activity.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "Shell Classic", type: "Vehicle",
    value: 1750000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "Classic shell vehicle. Low but steady demand.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "Jackrabbit",    type: "Vehicle",
    value: 2500000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "Fast rabbit-themed vehicle from Season 8.",
    notes: "S8 · L10 · Updated 1 month ago",
    image: ""
  },
  {
    name: "Longhorn",      type: "Vehicle",
    value: 1500000,        duped: null,
    demand: "Very Low",    trend: "Stable",     change: "",
    description: "Pickup truck with long horns. Low interest.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "Maverick",      type: "Vehicle",
    value: 1000000,        duped: null,
    demand: "Very Low",    trend: "Stable",     change: "",
    description: "Helicopter vehicle. Common and low value.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "Megalodon",     type: "Vehicle",
    value: 1250000,        duped: null,
    demand: "Very Low",    trend: "Stable",     change: "",
    description: "Boat vehicle with shark theme. Low demand.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "OG Monster",    type: "Vehicle",
    value: 1000000,        duped: null,
    demand: "Very Low",    trend: "Stable",     change: "",
    description: "Original monster truck. Nostalgic but low value.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "Striker",       type: "Vehicle",
    value: 1250000,        duped: null,
    demand: "Very Low",    trend: "Stable",     change: "",
    description: "Striking design vehicle. Low trading interest.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "Venom",         type: "Vehicle",
    value: 1000000,        duped: null,
    demand: "Very Low",    trend: "Stable",     change: "",
    description: "Venomous hypercar. Low demand.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "Hammerhead",    type: "Vehicle",
    value: 1000000,        duped: null,
    demand: "Very Low",    trend: "Stable",     change: "",
    description: "Boat vehicle with hammerhead theme. Low value.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "JB8",           type: "Vehicle",
    value: 3500000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "Jailbreak 8 vehicle. Steady low-tier.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "Wedge",         type: "Vehicle",
    value: 2500000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "Wedge-shaped vehicle. Low demand.",
    notes: "Updated 1 month ago",
    image: ""
  },

  // ════════════ HYPERCHROMES ════════════════════════════════════
  {
    name: "HyperShift Level 5", type: "HyperChrome",
    value: 356000000,       duped: 312500000,
    demand: "Decent",        trend: "Stable",     change: "",
    description: "The rarest HyperShift obtained by collecting all Level 5 hyperchromes. Unique gradient color-changing rainbow effect.",
    notes: "Max tier · Updated 3 months ago",
    image: ""
  },
 {
    name: "HyperShift Level 4", type: "HyperChrome",
    value: 250500000,       duped: null,
    demand: "Very Low",        trend: "Stable",     change: "",
    description: "This color is a reference to all the different colors of HyperChromes at Level 4",
    notes: "Max tier · Updated 3 months ago",
    image: ""
  },
  {
    name: "Hyper Diamond Level 5", type: "HyperChrome",
    value: 70000000,       duped: 60000000,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "Hyper Diamond is progressively evolved by grinding the Jewelry Store; one of the most popular hyperchrome colors.",
    notes: "L5 · Updated 1 month ago",
    image: ""
  },
  {
    name: "Hyper Blue Level 5", type: "HyperChrome",
    value: 61000000,       duped: 50000000,
    demand: "Decent",        trend: "Stable",     change: "",
    description: "Hyper Blue is progressively evolved by grinding the Cargo Plane; considered the most time-consuming hyperchrome.",
    notes: "L5 · Updated 1 month ago",
    image: ""
  },
  {
    name: "Hyper Pink Level 5", type: "HyperChrome",
    value: 58000000,       duped: 51000000,
    demand: "Decent",        trend: "Stable",     change: "",
    description: "Hyper Pink is progressively evolved by grinding the Casino; straightforward but time-consuming.",
    notes: "L5 · Updated 1 month ago",
    image: ""
  },
  {
    name: "Hyper Blue Level 4", type: "HyperChrome",
    value: 51000000,       duped: null,
    demand: "Very Low",      trend: "Stable",     change: "",
    description: "High-tier blue hyperchrome with intense metallic sheen.",
    notes: "L5 · Updated 1 week ago",
    image: ""
  },
  {
    name: "Hyper Blue Level 4", type: "HyperChrome",
    value: 46500000,       duped: null,
    demand: "Very Low",      trend: "Stable",     change: "",
    description: "High-tier blue hyperchrome with intense metallic sheen.",
    notes: "L5 · Updated 1 week ago",
    image: ""
  },
  {
    name: "Hyper Red Level 5", type: "HyperChrome",
    value: 45000000,       duped: 39000000,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "High-tier red hyperchrome with intense metallic sheen.",
    notes: "L5 · Updated 1 week ago",
    image: ""
  },
  {
    name: "Hyper Purple Level 5", type: "HyperChrome",
    value: 43000000,       duped: 40000000,
    demand: "High",        trend: "Rising",     change: "+500,000",
    description: "Purple hyperchrome with rich violet shift, gaining popularity.",
    notes: "L5 · Updated 1 month ago",
    image: ""
  },
  {
    name: "Hyper Pink Level 4", type: "HyperChrome",
    value: 42000000,       duped: null,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Mid-high tier pink hyperchrome, stepping stone to L5.",
    notes: "L4 · Updated 2 weeks ago",
    image: ""
  },
  {
    name: "Hyper Orange Level 5", type: "HyperChrome",
    value: 34000000,       duped: 31500000,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "High-tier orange hyperchrome with intense metallic sheen.",
    notes: "L4 · Updated 2 weeks ago",
    image: ""
  },
  {
    name: "Hyper Purple Level 4", type: "HyperChrome",
    value: 32000000,       duped: null,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Mid-high tier purple hyperchrome, stepping stone to L5.",
    notes: "L4 · Updated 2 weeks ago",
    image: ""
  },
  // Add more hyperchromes as needed from the data

  // ════════════ FURNITURE ═══════════════════════════════════════
  {
    name: "Hot Tub",       type: "Furniture",
    value: 12000000,       duped: null,
    demand: "High",        trend: "Stable",     change: "+500,000",
    description: "A luxury hot tub for your apartment. One of the most in-demand furniture items due to its rarity and aesthetic appeal.",
    notes: "Updated 2 weeks ago",
    image: ""
  },
  {
    name: "Pool Table",    type: "Furniture",
    value: 9000000,        duped: null,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "Full-size pool table furniture item. Rare apartment decoration with steady demand among interior collectors.",
    notes: "Updated 3 weeks ago",
    image: ""
  },
  {
    name: "Piano",         type: "Furniture",
    value: 7500000,        duped: null,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "Grand piano apartment item. A prestigious furniture piece that signals high-level collector status.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "Fireplace",     type: "Furniture",
    value: 5000000,        duped: null,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Decorative fireplace for your base. Adds a warm aesthetic touch and holds moderate collector value.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "Bookshelf",     type: "Furniture",
    value: 3500000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "Wall-mounted bookshelf furniture. Low demand but a clean addition to any apartment setup.",
    notes: "Updated 2 months ago",
    image: ""
  },
  {
    name: "Flat Screen TV",type: "Furniture",
    value: 3000000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "Large flat-screen TV for your apartment wall. Common furniture item with limited trading appeal.",
    notes: "Updated 2 months ago",
    image: ""
  },
  {
    name: "Couch",         type: "Furniture",
    value: 2000000,        duped: null,
    demand: "Very Low",    trend: "Stable",     change: "",
    description: "Standard apartment couch. One of the more common furniture drops with minimal trader interest.",
    notes: "Updated 3 months ago",
    image: ""
  },
  {
    name: "Coffee Table",  type: "Furniture",
    value: 1500000,        duped: null,
    demand: "Very Low",    trend: "Falling",    change: "-100,000",
    description: "Basic apartment accessory. Very low demand — mostly acquired passively rather than traded for.",
    notes: "Updated 3 months ago",
    image: ""
  },
  {
    name: "Sci-fi Kitchen", type: "Furniture",
    value: 4000000,        duped: 3500000,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Futuristic kitchen set for apartments. Niche décor piece with weak liquidity.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "Missile Bed",   type: "Furniture",
    value: 1250000,        duped: 1000000,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Missile-themed bed. Trade reality lags its price, treated as niche décor.",
    notes: "Updated 2 weeks ago",
    image: ""
  },

  // ════════════ COSMETICS ═══════════════════════════════════════
  {
    name: "Shark Fin Spoiler", type: "Cosmetic",
    value: 8500000,        duped: null,
    demand: "High",        trend: "Stable",     change: "+200,000",
    description: "A premium shark fin spoiler cosmetic. One of the rarest and most recognisable spoiler styles in the game.",
    notes: "Updated 1 week ago",
    image: ""
  },
  {
    name: "Galaxy Rim",    type: "Cosmetic",
    value: 7000000,        duped: null,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "Rare galaxy-patterned rim cosmetic. Visually striking design that holds strong value among rim collectors.",
    notes: "Updated 2 weeks ago",
    image: ""
  },
  {
    name: "Chrome Rim",    type: "Cosmetic",
    value: 5500000,        duped: null,
    demand: "Decent",      trend: "Rising",     change: "+300,000",
    description: "Classic chrome rim finish. Timeless aesthetic driving a slow but consistent upward value trend.",
    notes: "Updated 1 week ago",
    image: ""
  },
  {
    name: "Neon Underglow (Purple)", type: "Cosmetic",
    value: 4500000,        duped: null,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Purple neon underglow body colour modifier. Popular cosmetic for traders who want to stand out in active lobbies.",
    notes: "Updated 3 weeks ago",
    image: ""
  },
  {
    name: "Gold Tire Sticker", type: "Cosmetic",
    value: 4000000,        duped: null,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Premium gold-lettered tire sticker. Subtle yet high-status cosmetic detail favoured by high-end traders.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "Sniper Skin (Crimson)", type: "Cosmetic",
    value: 3800000,        duped: null,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Limited crimson weapon skin for the sniper rifle. Rare cosmetic with niche but stable collector demand.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "Dragon Drift",  type: "Cosmetic",
    value: 3500000,        duped: null,
    demand: "Decent",      trend: "Rising",     change: "+200,000",
    description: "Dragon-themed drift trail cosmetic. Increasingly popular in the community, with value gently climbing.",
    notes: "Updated 2 weeks ago",
    image: ""
  },
  {
    name: "Racing Spoiler",type: "Cosmetic",
    value: 2500000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "Standard racing-style spoiler. Low demand but commonly included as filler in larger trade packages.",
    notes: "Updated 2 months ago",
    image: ""
  },
  {
    name: "Bone Tire Style", type: "Cosmetic",
    value: 2000000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "Bone-pattern tire style cosmetic. Niche appeal among Halloween-themed collector sets.",
    notes: "Updated 2 months ago",
    image: ""
  },
  {
    name: "Standard Horn", type: "Cosmetic",
    value: 500000,         duped: null,
    demand: "Very Low",    trend: "Falling",    change: "",
    description: "Basic vehicle horn cosmetic. Minimal trade value — mainly included in bulk deals to round off trades.",
    notes: "Updated 3 months ago",
    image: ""
  },
  // Add Spoilers as type "Spoiler"
  {
    name: "Thrusters",     type: "Spoiler",
    value: 40000000,       duped: 37000000,
    demand: "High",        trend: "Stable",     change: "",
    description: "Thruster spoiler from Season 2. High demand due to exclusivity.",
    notes: "S2 · L9 · Updated 1 month ago",
    image: ""
  },
  {
    name: "Snow Shovel",   type: "Spoiler",
    value: 8500000,        duped: 8000000,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Snow shovel spoiler from Season 7. Medium demand for seasonal collectors.",
    notes: "S7 · L7 · Updated 11 days ago",
    image: ""
  },
  {
    name: "2 Billion",     type: "Spoiler",
    value: 6500000,        duped: 6000000,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Spoiler from 2 Billion Event. Medium demand.",
    notes: "Event Exclusive · Updated 1 month ago",
    image: ""
  },
  // Add more spoilers from the list...

  // Add Textures as type "Texture"
  {
    name: "Checker",       type: "Texture",
    value: 42500000,       duped: 38000000,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "Checker pattern texture. Retired item with medium demand.",
    notes: "Retired · Updated 1 week ago",
    image: ""
  },
  {
    name: "Drip",          type: "Texture",
    value: 20000000,       duped: 17750000,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Drip texture from Season 5. Medium demand.",
    notes: "S5 · L8 · Updated 1 month ago",
    image: ""
  },
  {
    name: "Snowstorm",     type: "Texture",
    value: 7500000,        duped: 7000000,
    demand: "Low",         trend: "Stable",     change: "",
    description: "Snowstorm texture. Season limited with low demand.",
    notes: "Season Limited · Updated 1 month ago",
    image: ""
  },
  // Add more textures...

  // Add Rims as type "Rim"
  {
    name: "Void",          type: "Rim",
    value: 47000000,       duped: 42000000,
    demand: "High",        trend: "Stable",     change: "",
    description: "Void rim with rare design. High demand among collectors.",
    notes: "Updated 7 hours ago",
    image: ""
  },
  // Add more if data available

  // Add Tire Stickers as type "Tire Sticker"
  {
    name: "Blue 50",       type: "Tire Sticker",
    value: 9000000,        duped: 8500000,
    demand: "Low",         trend: "Stable",     change: "",
    description: "Blue 50 tire sticker from Season 3. Low demand.",
    notes: "S3 · L50 · Updated 1 month ago",
    image: ""
  },
  {
    name: "Spiked",        type: "Tire Sticker",
    value: 8000000,        duped: 7500000,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Spiked tire sticker from Season 20. Medium demand.",
    notes: "S20 · L9 · Updated 14 days ago",
    image: ""
  },
  {
    name: "Brickset",      type: "Tire Sticker",
    value: 5000000,        duped: 4750000,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Brickset tire sticker. Obtainable with medium demand.",
    notes: "Updated 3 days ago",
    image: ""
  },
  // Add more tire stickers...

];

// ── STATE ─────────────────────────────────────────────────────
const state = {
  mode:    'card',
  search:  '',
  type:    '',
  demand:  '',
  trend:   '',
  sortKey: 'value',
  sortDir: 'desc',
  page:    1
};

// ── HELPERS ───────────────────────────────────────────────────
function fmtValue(n) {
  if (n === null || n === undefined) return null;
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return (Number.isInteger(v) ? v : +v.toFixed(1)) + 'M';
  }
  if (n >= 1_000) {
    const v = n / 1_000;
    return (Number.isInteger(v) ? v : +v.toFixed(1)) + 'K';
  }
  return n.toLocaleString();
}

const DEMAND_ORDER = { High: 5, Decent: 4, Medium: 3, Low: 2, 'Very Low': 1 };

function demandClass(d) {
  return { High:'d-high', Decent:'d-decent', Medium:'d-medium', Low:'d-low', 'Very Low':'d-verylow' }[d] || '';
}
function trendClass(t) {
  return { Stable:'t-stable', Hyped:'t-hyped', Rising:'t-rising', Falling:'t-falling' }[t] || '';
}
// Mapping type string → CSS class suffix (no spaces, lowercase)
function typeClass(t) {
  return { Vehicle:'type-vehicle', HyperChrome:'type-hyperchrome', Furniture:'type-furniture', Cosmetic:'type-cosmetic', Texture:'type-texture', Spoiler:'type-spoiler', Rim:'type-rim', 'Tire Sticker':'type-tiresticker' }[t] || '';
}

const TREND_ICON = { Stable: '—', Hyped: '🔥', Rising: '▲', Falling: '▼' };

function changeBadge(c) {
  if (!c) return '';
  const cls = c.startsWith('+') ? 'change-up' : 'change-down';
  return `<span class="change-badge ${cls}">${c}</span>`;
}

// Build initials from name
function initials(name) { return name.replace(/[^A-Z0-9]/gi, '').slice(0, 3).toUpperCase(); }

// Image HTML — uses existing CSS class names (row-img-fallback / card-img-fallback)
function cardImgHTML(item) {
  const fb = initials(item.name);
  if (item.image) {
    return `<img src="${item.image}" alt="${item.name}" loading="lazy"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div class="card-img-fallback" style="display:none;">${fb}</div>`;
  }
  return `<div class="card-img-fallback">${fb}</div>`;
}

function rowImgHTML(item) {
  const fb = initials(item.name);
  if (item.image) {
    return `<img src="${item.image}" alt="${item.name}" loading="lazy"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div class="row-img-fallback" style="display:none;">${fb}</div>`;
  }
  return `<div class="row-img-fallback">${fb}</div>`;
}

// ── FILTER + SORT ─────────────────────────────────────────────
function getFiltered() {
  let list = [...ITEMS];
  if (state.search) {
    const q = state.search.toLowerCase();
    list = list.filter(i => i.name.toLowerCase().includes(q));
  }
  if (state.type)   list = list.filter(i => i.type === state.type);
  if (state.demand) list = list.filter(i => i.demand === state.demand);
  if (state.trend)  list = list.filter(i => i.trend  === state.trend);

  list.sort((a, b) => {
    let av, bv;
    if      (state.sortKey === 'name')   { av = a.name.toLowerCase();     bv = b.name.toLowerCase(); }
    else if (state.sortKey === 'value')  { av = a.value;                  bv = b.value; }
    else if (state.sortKey === 'demand') { av = DEMAND_ORDER[a.demand]||0; bv = DEMAND_ORDER[b.demand]||0; }
    else if (state.sortKey === 'type')   { av = a.type.toLowerCase();     bv = b.type.toLowerCase(); }
    else return 0;
    if (av < bv) return state.sortDir === 'asc' ? -1 : 1;
    if (av > bv) return state.sortDir === 'asc' ?  1 : -1;
    return 0;
  });
  return list;
}

// ── PAGINATION ────────────────────────────────────────────────
function renderPagination(total) {
  const el = document.getElementById('pagination');
  if (!el) return;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  if (totalPages <= 1) { el.innerHTML = ''; return; }

  el.innerHTML = `
    <button class="page-btn" id="pg-prev" ${state.page <= 1 ? 'disabled' : ''}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      Prev
    </button>
    <span class="page-info">Page ${state.page} / ${totalPages}</span>
    <button class="page-btn" id="pg-next" ${state.page >= totalPages ? 'disabled' : ''}>
      Next
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    </button>`;

  document.getElementById('pg-prev').addEventListener('click', () => {
    if (state.page > 1) { state.page--; render(); scrollTo({ top: 0, behavior: 'smooth' }); }
  });
  document.getElementById('pg-next').addEventListener('click', () => {
    if (state.page < totalPages) { state.page++; render(); scrollTo({ top: 0, behavior: 'smooth' }); }
  });
}

// ── RENDER CARDS ──────────────────────────────────────────────
function renderCards(items) {
  const wrap = document.getElementById('card-view');
  if (!items.length) {
    wrap.innerHTML = `<div class="empty-state" style="grid-column:1/-1">No items match your filters.</div>`;
    return;
  }
  const page = items.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);

  wrap.innerHTML = page.map((item, i) => `
    <div class="item-card" style="animation-delay:${Math.min(i,15)*0.03}s">
      <div class="card-img-wrap">${cardImgHTML(item)}</div>
      <div class="card-body">
        <div class="card-name">${item.name}</div>
        <div style="margin-bottom:7px;">
          <span class="badge-type ${typeClass(item.type)}">${item.type}</span>
        </div>
        <div class="card-stats">
          <div class="card-stat-row">
            <span class="stat-lbl">Value</span>
            <span class="stat-val">${fmtValue(item.value)}${changeBadge(item.change)}</span>
          </div>
          <div class="card-stat-row">
            <span class="stat-lbl">Duped</span>
            ${item.duped !== null
              ? `<span class="stat-val" style="color:var(--text-dim)">${fmtValue(item.duped)}</span>`
              : `<span class="stat-na">N/A</span>`}
          </div>
          <div class="card-stat-row">
            <span class="stat-lbl">Demand</span>
            <span class="badge-demand ${demandClass(item.demand)}">${item.demand}</span>
          </div>
        </div>
      </div>
      <div class="card-hover-overlay">
        <button class="show-details-btn" data-name="${item.name}">Show Details</button>
      </div>
    </div>`).join('');

  wrap.querySelectorAll('.show-details-btn').forEach(btn =>
    btn.addEventListener('click', e => { e.stopPropagation(); openModal(btn.dataset.name); })
  );
}

// ── RENDER LIST ───────────────────────────────────────────────
function renderList(items) {
  const tbody = document.querySelector('#list-view tbody');
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty-state">No items match your filters.</td></tr>`;
    return;
  }
  const page = items.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);

  tbody.innerHTML = page.map(item => `
    <tr data-name="${item.name}">
      <td class="td-img">
        <div class="row-img-wrap">${rowImgHTML(item)}</div>
      </td>
      <td><span class="td-name">${item.name}</span></td>
      <td><span class="badge-type ${typeClass(item.type)}">${item.type}</span></td>
      <td><span class="td-value">${fmtValue(item.value)}${changeBadge(item.change)}</span></td>
      <td>${item.duped !== null
          ? `<span class="td-duped">${fmtValue(item.duped)}</span>`
          : `<span class="stat-na">N/A</span>`}</td>
      <td><span class="badge-demand ${demandClass(item.demand)}">${item.demand}</span></td>
      <td><span class="badge-trend ${trendClass(item.trend)}">${TREND_ICON[item.trend]||'—'} ${item.trend}</span></td>
      <td><span class="td-notes">${item.notes}</span></td>
    </tr>`).join('');

  tbody.querySelectorAll('tr').forEach(row =>
    row.addEventListener('click', () => openModal(row.dataset.name))
  );
}

// ── MAIN RENDER ───────────────────────────────────────────────
function render() {
  const items = getFiltered();
  const countEl = document.getElementById('item-count');
  if (countEl) countEl.textContent = `${items.length} / ${ITEMS.length} items`;

  if (state.mode === 'card') {
    document.getElementById('card-view').style.display = 'grid';
    document.getElementById('list-view').style.display = 'none';
    renderCards(items);
  } else {
    document.getElementById('card-view').style.display = 'none';
    document.getElementById('list-view').style.display = 'block';
    renderList(items);
  }
  renderPagination(items.length);
}

// ── MODAL ─────────────────────────────────────────────────────
function openModal(name) {
  const item = ITEMS.find(i => i.name === name);
  if (!item) return;

  const overlay  = document.getElementById('modal-overlay');
  const modalImg = document.getElementById('modal-img');
  const modalFb  = document.getElementById('modal-img-fallback');

  modalFb.textContent = initials(item.name);
  if (item.image) {
    modalImg.src = item.image;
    modalImg.style.display = 'block';
    modalImg.onerror = () => { modalImg.style.display = 'none'; };
  } else {
    modalImg.src = '';
    modalImg.style.display = 'none';
  }

  document.getElementById('modal-name').textContent = item.name;

  const typeEl = document.getElementById('modal-type');
  typeEl.textContent = item.type;
  typeEl.className = `modal-type badge-type ${typeClass(item.type)}`;

  document.getElementById('modal-value').textContent = fmtValue(item.value);

  const dupedEl = document.getElementById('modal-duped');
  if (item.duped !== null) {
    dupedEl.textContent = fmtValue(item.duped);
    dupedEl.classList.remove('na');
  } else {
    dupedEl.textContent = 'N/A';
    dupedEl.classList.add('na');
  }

  const demandEl = document.getElementById('modal-demand');
  demandEl.textContent  = item.demand;
  demandEl.className    = `badge-demand ${demandClass(item.demand)}`;

  const trendEl = document.getElementById('modal-trend');
  trendEl.textContent = `${TREND_ICON[item.trend]||'—'} ${item.trend}`;
  trendEl.className   = `badge-trend ${trendClass(item.trend)}`;

  document.getElementById('modal-desc').textContent  = item.description || '—';
  document.getElementById('modal-notes').textContent = item.notes || '—';

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── SORT HEADERS ──────────────────────────────────────────────
function initSortHeaders() {
  document.querySelectorAll('.values-table th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (state.sortKey === key) {
        state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortKey = key;
        state.sortDir = (key === 'name' || key === 'type') ? 'asc' : 'desc';
      }
      document.querySelectorAll('.values-table th.sortable').forEach(t => {
        t.classList.remove('sorted');
        const sa = t.querySelector('.sort-arrow');
        if (sa) sa.textContent = '↕';
      });
      th.classList.add('sorted');
      const arrow = th.querySelector('.sort-arrow');
      if (arrow) arrow.textContent = state.sortDir === 'asc' ? '↑' : '↓';
      state.page = 1;
      render();
    });
  });
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.mode = btn.dataset.mode;
      state.page = 1;
      document.querySelectorAll('.mode-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.mode === state.mode));
      render();
    });
  });

  const searchEl = document.getElementById('search-input');
  if (searchEl) searchEl.addEventListener('input', e => {
    state.search = e.target.value.trim(); state.page = 1; render();
  });

  const typeEl = document.getElementById('type-filter');
  if (typeEl) typeEl.addEventListener('change', e => {
    state.type = e.target.value; state.page = 1; render();
  });

  const demandEl = document.getElementById('demand-filter');
  if (demandEl) demandEl.addEventListener('change', e => {
    state.demand = e.target.value; state.page = 1; render();
  });

  const trendEl = document.getElementById('trend-filter');
  if (trendEl) trendEl.addEventListener('change', e => {
    state.trend = e.target.value; state.page = 1; render();
  });

  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    document.getElementById('modal-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });
  }

  initSortHeaders();
  render();
});