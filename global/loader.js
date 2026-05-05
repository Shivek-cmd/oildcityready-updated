/**
 * GLOBAL LOADER — Oil City Ready Mix Ltd.
 * Fetches and injects global partials into every page.
 *
 * Include in every page's <head> (before closing </head>):
 *   <script src="/global/loader.js"></script>
 *
 * Every page must have these two inject targets in <body>:
 *   <div id="global-header"></div>   ← top of body
 *   <div id="global-footer"></div>   ← bottom of body
 */

(function () {
  'use strict';

  /**
   * Fetch an HTML partial and inject into a target element.
   * Re-executes any <script> tags inside the partial.
   */
  function injectPartial(url, targetId, callback) {
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load: ' + url);
        return res.text();
      })
      .then(function (html) {
        var target = document.getElementById(targetId);
        if (!target) return;
        target.innerHTML = html;

        /* Re-execute <script> tags inside injected HTML */
        target.querySelectorAll('script').forEach(function (oldScript) {
          var newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(function (attr) {
            newScript.setAttribute(attr.name, attr.value);
          });
          newScript.textContent = oldScript.textContent;
          document.body.appendChild(newScript);
          oldScript.remove();
        });

        if (typeof callback === 'function') callback();
      })
      .catch(function (err) {
        console.warn('[GlobalLoader]', err.message);
      });
  }

  /**
   * Inject headtrackingcode.html tracking scripts into <head>.
   * NOTE: CSS (variable.css, base.css, fonts) are linked directly
   * in each page's <head> — NOT fetched here. Fetch is for
   * tracking scripts only (GTM, analytics, etc.).
   */
  function injectHead() {
    fetch('/global/headtrackingcode.html')
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var temp = document.createElement('div');
        temp.innerHTML = html;

        /* Append only <script> tracking tags — skip <link> and <style> */
        temp.querySelectorAll('script').forEach(function (oldScript) {
          var s = document.createElement('script');
          Array.from(oldScript.attributes).forEach(function (attr) {
            s.setAttribute(attr.name, attr.value);
          });
          s.textContent = oldScript.textContent;
          document.head.appendChild(s);
        });
      })
      .catch(function (err) {
        console.warn('[GlobalLoader] headtrackingcode.html:', err.message);
      });
  }

  /**
   * Inject bodytrackingcode.html at the end of <body>.
   */
  function injectBodyTracking() {
    fetch('/global/bodytrackingcode.html')
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        document.body.appendChild(div);
      })
      .catch(function (err) {
        console.warn('[GlobalLoader] bodytrackingcode.html:', err.message);
      });
  }

  /* ── Run on DOM ready ── */
  document.addEventListener('DOMContentLoaded', function () {
    injectHead();
    injectPartial('/global/header.html', 'global-header');
    injectPartial('/global/footer.html', 'global-footer', function () {
      var yearEl = document.getElementById('footer-year');
      if (yearEl) yearEl.textContent = new Date().getFullYear();
    });
    // injectBodyTracking();
  });

})();
