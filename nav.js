/**
 * CQC Shared Navigation Utility
 * Populates the Quality Week dropdown from the pages registry stored in localStorage.
 * Call populateQualityWeekNav(basePath) after DOM content is loaded.
 * basePath: relative path prefix to QE24.html, e.g. 'pages/' from root, '' from pages/.
 */
(function (global) {
  var PAGES_REGISTRY_KEY = 'cqc_pages_list';

  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function loadPagesRegistry() {
    try {
      var stored = localStorage.getItem(PAGES_REGISTRY_KEY);
      if (stored) {
        var parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return [{ slug: 'qe2022', title: 'QE Week 2022', contentKey: 'cqc_event_data' }];
  }

  function populateQualityWeekNav(basePath) {
    var container = document.getElementById('qualityWeekDropdown');
    if (!container) return;
    var base = basePath || '';
    var registry = loadPagesRegistry();
    container.innerHTML = registry.map(function (page) {
      var slug = String(page.slug).replace(/[^a-z0-9_-]/gi, '');
      var url  = base + 'QE24.html?event=' + encodeURIComponent(slug);
      return '<li><a class="dropdown-item" href="' + escHtml(url) + '">' + escHtml(String(page.title)) + '</a></li>';
    }).join('');
  }

  global.populateQualityWeekNav = populateQualityWeekNav;
  global.loadPagesRegistry       = global.loadPagesRegistry || loadPagesRegistry;
})(window);
