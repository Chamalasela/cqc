/**
 * CQC Theme Toggle
 * Handles switching between dark mode (default) and light mode.
 * Preference is persisted in localStorage.
 */
(function () {
  var STORAGE_KEY = 'cqc_theme';
  var LIGHT_CLASS = 'light-theme';

  function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'dark';
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.classList.add(LIGHT_CLASS);
    } else {
      document.documentElement.classList.remove(LIGHT_CLASS);
    }
    updateToggleButton(theme);
  }

  function updateToggleButton(theme) {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    var icon = btn.querySelector('i');
    // Convention: show the icon that represents the mode you'll SWITCH TO.
    // Light mode active → show moon (click to go dark).
    // Dark mode active  → show sun  (click to go light).
    if (theme === 'light') {
      if (icon) icon.className = 'fas fa-moon';
      btn.setAttribute('aria-label', 'Switch to dark mode');
      btn.setAttribute('title', 'Switch to dark mode');
    } else {
      if (icon) icon.className = 'fas fa-sun';
      btn.setAttribute('aria-label', 'Switch to light mode');
      btn.setAttribute('title', 'Switch to light mode');
    }
  }

  function toggleTheme() {
    var current = getSavedTheme();
    var next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  // Apply theme immediately to prevent flash of wrong theme
  applyTheme(getSavedTheme());

  document.addEventListener('DOMContentLoaded', function () {
    // Re-apply to update button icon once DOM is ready
    applyTheme(getSavedTheme());
    var btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
    }
  });

  // Expose toggle for inline onclick fallbacks
  window.toggleTheme = toggleTheme;
})();
