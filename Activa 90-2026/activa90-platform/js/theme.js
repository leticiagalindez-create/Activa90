/* ============================================================
   ACTIVA 90 — Theme Toggle
   Dark/Light mode with localStorage persistence
   ============================================================ */

(function() {
  const STORAGE_KEY = 'activa90-theme';

  // Get saved theme or system preference
  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  // Apply theme to document
  function applyTheme(theme) {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    console.log('[Theme] Applied:', theme); // Debug log
  }

  // Toggle theme
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  // Apply saved theme immediately
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Initialize toggle buttons when DOM is ready
  function initToggleButtons() {
    const buttons = document.querySelectorAll('.theme-toggle');
    console.log('[Theme] Found toggle buttons:', buttons.length); // Debug log

    buttons.forEach(btn => {
      // Remove any existing listeners (in case of HMR)
      btn.replaceWith(btn.cloneNode(true));
    });

    // Re-query and add listeners
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToggleButtons);
  } else {
    initToggleButtons();
  }

  // Also re-init when page is fully loaded (for late-loading content)
  window.addEventListener('load', initToggleButtons);

  // Listen for system preference changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      // Only update if user hasn't manually set a preference recently
      const saved = localStorage.getItem(STORAGE_KEY);
      const savedTime = localStorage.getItem(STORAGE_KEY + '-time');
      const isManuallySet = savedTime && (Date.now() - parseInt(savedTime)) < 86400000; // 24 hours

      if (!isManuallySet) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Expose for manual use and debugging
  window.toggleTheme = toggleTheme;
  window.setTheme = applyTheme;
})();
