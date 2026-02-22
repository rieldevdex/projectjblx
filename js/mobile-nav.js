/* ================================================================
   JBLX — Mobile Navigation
   Injects a hamburger button + slide-in sidebar on narrow screens.
   Include AFTER theme.js on every page.
================================================================ */

(function () {

  // SVG icons (inline so no external deps)
  const ICONS = {
    values: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`,
    calc:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>`,
    info:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    teams:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    disc:   `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>`,
    dupe:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    sun:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  };

  // All nav pages in order
  const NAV_PAGES = [
    { href: 'values.html', label: 'Values',       icon: ICONS.values },
    { href: 'calc.html',   label: 'Calculator',   icon: ICONS.calc   },
    { href: 'info.html',   label: 'Info',         icon: ICONS.info   },
    { href: 'teams.html',  label: 'Team',         icon: ICONS.teams  },
    { href: 'disc.html',   label: 'Discord',      icon: ICONS.disc   },
    { href: 'dupe.html',   label: 'Dupe Checker', icon: ICONS.dupe   },
  ];

  function getActivePage() {
    const seg = window.location.pathname.split('/').pop() || 'index.html';
    return seg;
  }

  function initMobileNav() {
    const nav = document.querySelector('.top-nav');
    if (!nav) return;

    const activePage = getActivePage();

    // ── Hamburger button ──────────────────────────────────────
    const hamburger = document.createElement('button');
    hamburger.className = 'jblx-hamburger';
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = `<span></span><span></span><span></span>`;
    nav.appendChild(hamburger);

    // ── Overlay ───────────────────────────────────────────────
    const overlay = document.createElement('div');
    overlay.className = 'jblx-sidebar-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    // ── Sidebar ───────────────────────────────────────────────
    const sidebar = document.createElement('div');
    sidebar.className = 'jblx-sidebar';
    sidebar.setAttribute('role', 'dialog');
    sidebar.setAttribute('aria-label', 'Navigation');

    // Detect logo src from existing nav brand
    const brandImg = nav.querySelector('.nav-brand img');
    const logoSrc = brandImg ? brandImg.getAttribute('src') : 'assets/images/jblx-logo.png';

    // Build sidebar nav links
    const linksHTML = NAV_PAGES.map(p => {
      const isActive = activePage === p.href ? ' active' : '';
      return `<a href="${p.href}" class="jblx-sidebar-link${isActive}">
        ${p.icon}
        <span>${p.label}</span>
      </a>`;
    }).join('');

    // Theme toggle button label
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const themeLabel = currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode';

    sidebar.innerHTML = `
      <div class="jblx-sidebar-header">
        <a href="index.html"><img src="${logoSrc}" alt="JBLX" class="jblx-sidebar-logo"></a>
        <button class="jblx-sidebar-close" aria-label="Close menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <nav class="jblx-sidebar-nav">
        ${linksHTML}
      </nav>
      <div class="jblx-sidebar-footer">
        <button class="jblx-sidebar-theme" id="jblx-sidebar-theme-btn">
          ${ICONS.sun}
          <span id="jblx-sidebar-theme-label">${themeLabel}</span>
        </button>
      </div>`;

    document.body.appendChild(sidebar);

    // ── Open / Close helpers ──────────────────────────────────
    function openSidebar() {
      sidebar.classList.add('open');
      overlay.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', openSidebar);
    overlay.addEventListener('click', closeSidebar);
    sidebar.querySelector('.jblx-sidebar-close').addEventListener('click', closeSidebar);

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) closeSidebar();
    });

    // ── Sidebar theme toggle ──────────────────────────────────
    // Piggybacks on the existing theme.js toggle logic
    sidebar.querySelector('#jblx-sidebar-theme-btn').addEventListener('click', () => {
      // Trigger the existing theme toggle button if present
      const existingToggle = document.getElementById('theme-toggle');
      if (existingToggle) existingToggle.click();
      // Update sidebar label
      const newTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const lbl = document.getElementById('jblx-sidebar-theme-label');
      if (lbl) lbl.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }

})();
