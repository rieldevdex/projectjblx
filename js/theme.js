/* ================================================================
   JBLX — theme.js
   Global dark/light mode toggle — included on every page
   ================================================================ */

(function () {
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('jblx-theme', theme);
    const icon = document.querySelector('.theme-toggle .toggle-icon');
    if (icon) icon.textContent = theme === 'dark' ? '☀' : '☾';
  }

  // Apply saved theme immediately (before paint)
  const saved = localStorage.getItem('jblx-theme') || 'dark';
  applyTheme(saved);

  document.addEventListener('DOMContentLoaded', () => {
    // Re-apply after DOM (handles icon update)
    applyTheme(localStorage.getItem('jblx-theme') || 'dark');

    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }
  });
})();
