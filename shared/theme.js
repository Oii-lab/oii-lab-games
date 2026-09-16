// ============================================================
//  THEME TOGGLE (light / dark) — shared across all pages
// ============================================================
(function () {
  var KEY = 'oii-theme';

  function getSaved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(theme) {
    try { localStorage.setItem(KEY, theme); } catch (e) {}
  }
  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.dispatchEvent(new CustomEvent('oii-theme-change', { detail: { theme: theme } }));
  }

  // Apply saved (or default dark) theme as early as possible to avoid a flash.
  apply(getSaved() === 'light' ? 'light' : 'dark');

  function updateBtn(btn) {
    var isLight = document.documentElement.getAttribute('data-theme') === 'light';
    btn.textContent = isLight ? '🌙' : '☀️';
    btn.setAttribute('aria-label', isLight ? '切換至深色模式' : '切換至淺色模式');
    btn.title = isLight ? '切換至深色模式' : '切換至淺色模式';
  }

  function init() {
    var btn = document.createElement('button');
    btn.id = 'theme-toggle-btn';
    btn.type = 'button';
    updateBtn(btn);
    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      apply(next);
      save(next);
      updateBtn(btn);
    });
    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
