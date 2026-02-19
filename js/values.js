/* ================================================================
   JBLX — values.js
   Item data + rendering logic for values.html
   ================================================================ */

// ── ITEM DATA ────────────────────────────────────────────────
// TODO: Replace image URLs with official JBLX-hosted images when ready.
// Current images sourced from jailbreaktradingnetwork.com as placeholders.

const ITEMS = [
  {
    name: "Javelin",
    type: "Vehicle",
    value: 50000000,
    duped: null,
    demand: "High",
    trend: "Stable",
    change: "+500,000",
    description: "Limited seasonal vehicle from Season 2. A sleek, high-speed car with a distinct aerodynamic design that makes it one of the most sought-after vehicles in the Jailbreak trading scene.",
    notes: "S2 · Updated 1 week ago",
    image: "assets/item-images/vehicles/javelin.webp" // TODO: Replace with JBLX hosted image
  },
  {
    name: "Torpedo",
    type: "Vehicle",
    value: 49000000,
    duped: 44000000,
    demand: "Decent",
    trend: "Stable",
    change: "+1,000,000",
    description: "A high-performance aquatic/road hybrid vehicle from Season 6. Known for its streamlined chassis and strong resale demand among veteran traders.",
    notes: "S2 · Updated 4 days ago",
    image: "https://www.jailbreaktradingnetwork.com/images/torpedo.png" // TODO: Replace with JBLX hosted image
  },
  {
    name: "Beignet",
    type: "Vehicle",
    value: 40000000,
    duped: 37000000,
    demand: "High",
    trend: "Stable",
    change: "+500,000",
    description: "Modeled after the Bugatti Bolide, known for its extraordinary stats and performance, as well as superb looks.",
    notes: "S6 · L10 · Updated 4 weeks ago",
    image: "https://www.jailbreaktradingnetwork.com/images/beignet.png" // TODO: Replace with JBLX hosted image
  },
  {
    name: "Celsior",
    type: "Vehicle",
    value: 33000000,
    duped: 31000000,
    demand: "Medium",
    trend: "Stable",
    change: "-500,000",
    description: "One of the most overrated vehicle inside of Roblox Jailbreak. Literally a fucking flying brick.",
    notes: "S8 · L10 · Updated 6 days ago",
    image: "https://www.jailbreaktradingnetwork.com/images/celsior.png" // TODO: Replace with JBLX hosted image
  },
  {
    name: "Proto-8",
    type: "Vehicle",
    value: 30000000,
    duped: null,
    demand: "High",
    trend: "Stable",
    change: "+500,000",
    description: "A track car modeled after the Porsche Mission 8, known for its' quick launch and acceleration.",
    notes: "S14 · L10 · Updated 3 weeks ago",
    image: "https://www.jailbreaktradingnetwork.com/images/proto-8.png" // TODO: Replace with JBLX hosted image
  },
  {
    name: "Power 1",
    type: "Vehicle",
    value: 23000000,
    duped: null,
    demand: "High",
    trend: "Stable",
    change: "+500,000",
    description: "The most detailed interior and exterior a Roblox Jailbreak vehicle has. Modeled after the McLaren P1.",
    notes: "S17 · L10 · Updated 4 weeks ago",
    image: "https://www.jailbreaktradingnetwork.com/images/power1.png" // TODO: Replace with JBLX hosted image
  },
  {
    name: "Arachnid",
    type: "Vehicle",
    value: 21000000,
    duped: 18000000,
    demand: "Medium",
    trend: "Stable",
    change: "+500,000",
    description: "A vehicle themed after the Batmobile in OG Season 1 and 2. It's early release contributed largely to it's value.",
    notes: "S2 · Updated 1 week ago",
    image: "https://www.jailbreaktradingnetwork.com/images/arachnid.png" // TODO: Replace with JBLX hosted image
  },
  {
    name: "Icebreaker",
    type: "Vehicle",
    value: 20000000,
    duped: 17000000,
    demand: "Decent",
    trend: "Stable",
    change: "+500,000",
    description: "A winter-themed vehicle from Season 7. Known for it's rarity due to the difficulty of the season.",
    notes: "S7 · L10 · Updated 2 months ago",
    image: "https://www.jailbreaktradingnetwork.com/images/icebreaker.png" // TODO: Replace with JBLX hosted image
  },
  {
    name: "Beam Hybrid",
    type: "Vehicle",
    value: 19000000,
    duped: 16000000,
    demand: "Decent",
    trend: "Stable",
    change: "+500,000",
    description: "A vehicle modeled after the BMW i8 from Season 1. Its clean design and level-locked status make it a mid-tier staple in most trade lists.",
    notes: "S1 · L10 · Updated 3 months ago",
    image: "https://www.jailbreaktradingnetwork.com/images/beamhybrid.png" // TODO: Replace with JBLX hosted image
  },
  {
    name: "Banana Car",
    type: "Vehicle",
    value: 17000000,
    duped: null,
    demand: "Decent",
    trend: "Hyped",
    change: "+1,000,000",
    description: "Banana",
    notes: "S5 · L10 · Updated 19 hours ago",
    image: "https://www.jailbreaktradingnetwork.com/images/bananacar.png" // TODO: Replace with JBLX hosted image
  },
  {
    name: "Molten M12",
    type: "Vehicle",
    value: 15000000,
    duped: null,
    demand: "Decent",
    trend: "Stable",
    change: "",
    description: "Placeholder, Jailbreak Trade Core sucks",
    notes: "S3 · Updated 19 hours ago",
    image: "https://www.jailbreaktradingnetwork.com/images/moltenm12.png" // TODO: Replace with JBLX hosted image
  },
  {
    name: "Raptor",
    type: "Vehicle",
    value: 11000000,
    duped: null,
    demand: "Medium",
    trend: "Stable",
    change: "-500,000",
    description: "Placeholder, Jailbreak Trade Core sucks",
    notes: "S3 · Updated 2 days ago",
    image: "https://www.jailbreaktradingnetwork.com/images/raptor.png" // TODO: Replace with JBLX hosted image
  },
  {
    name: "Volt 4x4",
    type: "Vehicle",
    value: 10000000,
    duped: null,
    demand: "Decent",
    trend: "Stable",
    change: "",
    description: "Placeholder, Jailbreak Trade Core sucks",
    notes: "S3 · L10 · Updated 3 days ago",
    image: "https://www.jailbreaktradingnetwork.com/images/volt4x4.png" // TODO: Replace with JBLX hosted image
  },
  {
    name: "Crew Capsule",
    type: "Vehicle",
    value: 9500000,
    duped: null,
    demand: "Very Low",
    trend: "Stable",
    change: "-500,000",
    description: "Placeholder, Jailbreak Trade Core sucks",
    notes: "S2 · L10 · Updated 1 day ago",
    image: "https://www.jailbreaktradingnetwork.com/images/crewcapsule.png" // TODO: Replace with JBLX hosted image
  },
  {
    name: "Parisian",
    type: "Vehicle",
    value: 9000000,
    duped: null,
    demand: "High",
    trend: "Stable",
    change: "+500,000",
    description: "Placeholder, Jailbreak Trade Core sucks",
    notes: "Updated 19 hours ago",
    image: "https://www.jailbreaktradingnetwork.com/images/parisian.png" // TODO: Replace with JBLX hosted image
  },
  {
    name: "Aperture",
    type: "Vehicle",
    value: 7500000,
    duped: null,
    demand: "Decent",
    trend: "Stable",
    change: "",
    description: "Placeholder, Jailbreak Trade Core sucks",
    notes: "Updated 1 month ago",
    image: "https://www.jailbreaktradingnetwork.com/images/aperture.png" // TODO: Replace with JBLX hosted image
  },
  {
    name: "Shogun",
    type: "Vehicle",
    value: 6500000,
    duped: null,
    demand: "Decent",
    trend: "Stable",
    change: "",
    description: "Placeholder, Jailbreak Trade Core sucks",
    notes: "S15 · L10 · Updated 3 months ago",
    image: "https://www.jailbreaktradingnetwork.com/images/shogun.png" // TODO: Replace with JBLX hosted image
  },
  {
    name: "Scorpion",
    type: "Vehicle",
    value: 6000000,
    duped: null,
    demand: "Decent",
    trend: "Stable",
    change: "",
    description: "Placeholder, Jailbreak Trade Core sucks",
    notes: "Updated 1 month ago",
    image: "https://www.jailbreaktradingnetwork.com/images/scorpion.png" // TODO: Replace with JBLX hosted image
  },
  {
    name: "Carbonara",
    type: "Vehicle",
    value: 5500000,
    duped: null,
    demand: "Decent",
    trend: "Stable",
    change: "",
    description: "Placeholder, Jailbreak Trade Core sucks",
    notes: "Updated 19 hours ago",
    image: "https://www.jailbreaktradingnetwork.com/images/carbonara.png" // TODO: Replace with JBLX hosted image
  },
  {
    name: "Macaron",
    type: "Vehicle",
    value: 5500000,
    duped: null,
    demand: "Decent",
    trend: "Stable",
    change: "",
    description: "Placeholder, Jailbreak Trade Core sucks",
    notes: "S10 · L10 · Updated 1 month ago",
    image: "https://www.jailbreaktradingnetwork.com/images/macaron.png" // TODO: Replace with JBLX hosted image
  }
];

// ── UTILITIES ─────────────────────────────────────────────────
function fmtValue(n) {
  if (n === null || n === undefined) return null;
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return (Number.isInteger(v) ? v : v.toFixed(1)) + 'M';
  }
  if (n >= 1_000) {
    const v = n / 1_000;
    return (Number.isInteger(v) ? v : v.toFixed(1)) + 'K';
  }
  return n.toLocaleString();
}

function demandClass(d) {
  return { 'High':'d-high','Decent':'d-decent','Medium':'d-medium','Low':'d-low','Very Low':'d-verylow' }[d] || 'd-decent';
}

function trendClass(t) {
  return { 'Stable':'t-stable','Hyped':'t-hyped','Rising':'t-rising','Falling':'t-falling' }[t] || 't-stable';
}

const TREND_ICON = { Stable:'–', Hyped:'🔥', Rising:'▲', Falling:'▼' };

function changeBadge(c) {
  if (!c) return '';
  const cls = c.startsWith('+') ? 'change-up' : 'change-down';
  return `<span class="change-badge ${cls}">${c}</span>`;
}

function imgEl(item, cls = '') {
  // Shows image if available; falls back to initials
  const fallback = item.name.slice(0, 3).toUpperCase();
  return `
    <img src="${item.image}" alt="${item.name}" loading="lazy" class="${cls}"
         onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
    <div class="card-img-fallback" style="display:none">${fallback}</div>`;
}

// ── SORT / FILTER STATE ────────────────────────────────────────
const state = {
  mode:    'card',   // 'card' | 'list'
  search:  '',
  demand:  '',
  trend:   '',
  sortKey: 'value',
  sortDir: 'desc'
};

// ── FILTERED ITEMS ─────────────────────────────────────────────
function filtered() {
  let list = [...ITEMS];
  if (state.search) {
    const q = state.search.toLowerCase();
    list = list.filter(i => i.name.toLowerCase().includes(q) || i.notes.toLowerCase().includes(q));
  }
  if (state.demand) list = list.filter(i => i.demand === state.demand);
  if (state.trend)  list = list.filter(i => i.trend  === state.trend);

  const demandOrder = { High:5, Decent:4, Medium:3, Low:2, 'Very Low':1 };
  list.sort((a, b) => {
    let av, bv;
    if (state.sortKey === 'name')   { av = a.name.toLowerCase(); bv = b.name.toLowerCase(); }
    else if (state.sortKey === 'value') { av = a.value; bv = b.value; }
    else if (state.sortKey === 'demand') { av = demandOrder[a.demand]||0; bv = demandOrder[b.demand]||0; }
    else return 0;
    if (av < bv) return state.sortDir === 'asc' ? -1 : 1;
    if (av > bv) return state.sortDir === 'asc' ?  1 : -1;
    return 0;
  });
  return list;
}

// ── RENDER CARDS ───────────────────────────────────────────────
function renderCards(items) {
  const wrap = document.getElementById('card-view');
  if (!items.length) {
    wrap.innerHTML = `<div class="empty-state" style="grid-column:1/-1">No items match your search.</div>`;
    return;
  }
  wrap.innerHTML = items.map((item, i) => `
    <div class="item-card" style="animation-delay:${Math.min(i, 12) * 0.035}s" data-name="${item.name}">
      <div class="card-img-wrap">
        ${imgEl(item)}
      </div>
      <div class="card-body">
        <div class="card-name">${item.name}</div>
        <div class="card-stats">
          <div class="card-stat-row">
            <span class="stat-label">Value</span>
            <span class="stat-value">${fmtValue(item.value)}${changeBadge(item.change)}</span>
          </div>
          <div class="card-stat-row">
            <span class="stat-label">Duped</span>
            ${item.duped !== null
              ? `<span class="stat-value" style="color:var(--text-dim)">${fmtValue(item.duped)}</span>`
              : `<span class="stat-na">N/A</span>`}
          </div>
          <div class="card-stat-row">
            <span class="stat-label">Demand</span>
            <span class="badge-demand ${demandClass(item.demand)}">${item.demand}</span>
          </div>
        </div>
      </div>
      <div class="card-hover-overlay">
        <button class="show-details-btn" data-name="${item.name}">Show Details</button>
      </div>
    </div>
  `).join('');

  wrap.querySelectorAll('.show-details-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openModal(btn.dataset.name); });
  });
}

// ── RENDER LIST ─────────────────────────────────────────────────
function renderList(items) {
  const tbody = document.querySelector('#list-view tbody');
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty-state">No items match your search.</td></tr>`;
    return;
  }
  tbody.innerHTML = items.map(item => `
    <tr data-name="${item.name}">
      <td class="td-img">
        <div class="row-img-wrap">
          <img src="${item.image}" alt="${item.name}" loading="lazy"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
          <div class="row-img-fallback" style="display:none">${item.name.slice(0,3).toUpperCase()}</div>
        </div>
      </td>
      <td><span class="td-name">${item.name}</span></td>
      <td><span class="badge-demand ${demandClass(item.demand)}" style="font-size:0.68rem;padding:2px 7px">${item.type}</span></td>
      <td><span class="td-value">${fmtValue(item.value)}${changeBadge(item.change)}</span></td>
      <td>${item.duped !== null ? `<span class="td-duped">${fmtValue(item.duped)}</span>` : `<span class="stat-na">N/A</span>`}</td>
      <td><span class="badge-demand ${demandClass(item.demand)}">${item.demand}</span></td>
      <td><span class="badge-trend ${trendClass(item.trend)}">${TREND_ICON[item.trend] || '–'} ${item.trend}</span></td>
      <td><span class="td-notes">${item.notes}</span></td>
    </tr>
  `).join('');

  tbody.querySelectorAll('tr').forEach(row => {
    row.addEventListener('click', () => openModal(row.dataset.name));
  });
}

// ── RENDER DISPATCH ────────────────────────────────────────────
function render() {
  const items = filtered();
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
}

// ── MODAL ──────────────────────────────────────────────────────
let currentItem = null;

function openModal(name) {
  const item = ITEMS.find(i => i.name === name);
  if (!item) return;
  currentItem = item;

  const overlay = document.getElementById('modal-overlay');
  const fallback = item.name.slice(0, 3).toUpperCase();

  // Populate image
  const modalImg = document.getElementById('modal-img');
  const modalImgFb = document.getElementById('modal-img-fallback');
  modalImg.src = item.image;
  modalImg.style.display = 'block';
  modalImgFb.textContent = fallback;
  modalImg.onerror = () => { modalImg.style.display = 'none'; };

  document.getElementById('modal-name').textContent = item.name;
  document.getElementById('modal-type').textContent = item.type;

  document.getElementById('modal-value').textContent = fmtValue(item.value);
  document.getElementById('modal-duped').textContent = item.duped !== null ? fmtValue(item.duped) : 'N/A';
  document.getElementById('modal-duped').className = 'modal-stat-value' + (item.duped === null ? ' na' : '');

  const demandEl = document.getElementById('modal-demand');
  demandEl.textContent = item.demand;
  demandEl.className = `badge-demand ${demandClass(item.demand)}`;

  const trendEl = document.getElementById('modal-trend');
  trendEl.textContent = `${TREND_ICON[item.trend] || '–'} ${item.trend}`;
  trendEl.className = `badge-trend ${trendClass(item.trend)}`;

  document.getElementById('modal-desc').textContent = item.description || '—';
  document.getElementById('modal-notes').textContent = item.notes || '—';

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
  currentItem = null;
}

// ── SORT HEADER CLICK ──────────────────────────────────────────
function initSortHeaders() {
  document.querySelectorAll('.values-table th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (state.sortKey === key) {
        state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortKey = key;
        state.sortDir = key === 'name' ? 'asc' : 'desc';
      }
      document.querySelectorAll('.values-table th.sortable').forEach(t => {
        t.classList.remove('sorted');
        const sa = t.querySelector('.sort-arrow');
        if (sa) sa.textContent = '↕';
      });
      th.classList.add('sorted');
      const arrow = th.querySelector('.sort-arrow');
      if (arrow) arrow.textContent = state.sortDir === 'asc' ? '↑' : '↓';
      render();
    });
  });
}

// ── INIT ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Mode buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.mode = btn.dataset.mode;
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === state.mode));
      render();
    });
  });

  // Search
  const searchEl = document.getElementById('search-input');
  if (searchEl) searchEl.addEventListener('input', e => { state.search = e.target.value.trim(); render(); });

  // Filters
  const demandFilter = document.getElementById('demand-filter');
  if (demandFilter) demandFilter.addEventListener('change', e => { state.demand = e.target.value; render(); });

  const trendFilter = document.getElementById('trend-filter');
  if (trendFilter) trendFilter.addEventListener('change', e => { state.trend = e.target.value; render(); });

  // Modal close
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    document.getElementById('modal-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal(); });
  }

  // Sort headers
  initSortHeaders();

  // Initial render
  render();
});
