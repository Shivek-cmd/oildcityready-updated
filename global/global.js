/**
 * GLOBAL SCRIPTS — Oil City Ready Mix Ltd.
 * Handles: reveal animations, counter sweep, FAQ accordion,
 *          calculator logic, quote form.
 * Loaded by loader.js after DOM is ready.
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
   * 1. REVEAL ON SCROLL (IntersectionObserver)
   * ───────────────────────────────────────────── */
  function initReveal() {
    var els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!els.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    els.forEach(function (el) { observer.observe(el); });
  }


  /* ─────────────────────────────────────────────
   * 2. COUNTER SWEEP
   * Usage: <span class="counter" data-target="1000" data-suffix="m³">0</span>
   * ───────────────────────────────────────────── */
  function initCounters() {
    var counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el      = entry.target;
        var target  = parseFloat(el.dataset.target) || 0;
        var suffix  = el.dataset.suffix  || '';
        var prefix  = el.dataset.prefix  || '';
        var decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
        var duration = 2000;
        var start    = performance.now();

        function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

        function tick(now) {
          var elapsed  = now - start;
          var progress = Math.min(elapsed / duration, 1);
          var value    = easeOutCubic(progress) * target;
          el.textContent = prefix + value.toFixed(decimals) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { observer.observe(el); });
  }


  /* ─────────────────────────────────────────────
   * 3. CALCULATOR
   * ───────────────────────────────────────────── */
  function initCalculator() {

    /* ── Tab switching ── */
    var tabs    = document.querySelectorAll('.calc-tab');
    var panels  = document.querySelectorAll('.calc-panel');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.dataset.tab;

        tabs.forEach(function (t) { t.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });

        tab.classList.add('active');
        var panel = document.getElementById('panel-' + target);
        if (panel) panel.classList.add('active');

        /* Reset results */
        document.querySelectorAll('.calc-result-value').forEach(function (r) {
          r.textContent = '—';
        });
      });
    });

    /* ── Flat Area Calculator ── */
    var flatForm = document.getElementById('calc-flat');
    if (flatForm) {
      flatForm.addEventListener('input', calcFlat);
      flatForm.addEventListener('submit', function (e) { e.preventDefault(); calcFlat(); });
    }

    function calcFlat() {
      var length    = parseFloat(document.getElementById('flat-length').value) || 0;
      var width     = parseFloat(document.getElementById('flat-width').value)  || 0;
      var thickness = parseFloat(document.getElementById('flat-thick').value)  || 0;
      var resultEl  = document.getElementById('flat-result');

      if (length > 0 && width > 0 && thickness > 0) {
        /* Convert: length(ft) × width(ft) × thickness(in÷12) × 0.0283168 */
        var cubicFt = length * width * (thickness / 12);
        var cubicM  = cubicFt * 0.0283168;
        /* Add 10% waste factor */
        var withWaste = cubicM * 1.10;
        if (resultEl) resultEl.textContent = withWaste.toFixed(2) + ' m³';
      } else {
        if (resultEl) resultEl.textContent = '—';
      }
    }

    /* ── Pile / Cylinder Calculator ── */
    var pileForm = document.getElementById('calc-pile');
    if (pileForm) {
      pileForm.addEventListener('input', calcPile);
      pileForm.addEventListener('submit', function (e) { e.preventDefault(); calcPile(); });
    }

    function calcPile() {
      var radius = parseFloat(document.getElementById('pile-radius').value) || 0;
      var height = parseFloat(document.getElementById('pile-height').value) || 0;
      var count  = parseFloat(document.getElementById('pile-count').value)  || 0;
      var resultEl = document.getElementById('pile-result');

      if (radius > 0 && height > 0 && count > 0) {
        /* radius in inches → feet = radius / 12 */
        var radiusFt  = radius / 12;
        var volumeFt  = Math.PI * radiusFt * radiusFt * height * count;
        var cubicM    = volumeFt * 0.0283168;
        var withWaste = cubicM * 1.10;
        if (resultEl) resultEl.textContent = withWaste.toFixed(2) + ' m³';
      } else {
        if (resultEl) resultEl.textContent = '—';
      }
    }
  }

  /* ─────────────────────────────────────────────
   * 4. DISCLAIMER ACCORDION
   * ───────────────────────────────────────────── */
  function initDisclaimerAccordion() {
    var toggle = document.querySelector('.calc-disclaimer-toggle');
    var body   = document.getElementById('disclaimer-body');
    if (!toggle || !body) return;

    function updateState(isOpen) {
      toggle.setAttribute('aria-expanded', String(isOpen));
      body.classList.toggle('open', isOpen);
    }

    updateState(body.classList.contains('open'));

    function toggleAccordion(event) {
      if (event) event.preventDefault();
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      updateState(!isOpen);
    }

    toggle.addEventListener('click', toggleAccordion);
    toggle.addEventListener('touchend', toggleAccordion, { passive: false });
  }


  /* ─────────────────────────────────────────────
   * 5. QUOTE FORM SUBMISSION
   * ───────────────────────────────────────────── */
  function initQuoteForm() {
    var form = document.getElementById('quote-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var btn = form.querySelector('[type="submit"]');
      var originalText = btn.textContent;

      btn.textContent = 'Sending…';
      btn.disabled = true;

      /* Simulate send — replace with real endpoint / GHL form when ready */
      setTimeout(function () {
        btn.textContent = 'Sent! We\'ll be in touch.';
        btn.style.background = '#22c55e';
        btn.style.borderColor = '#22c55e';
        form.reset();

        setTimeout(function () {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.borderColor = '';
        }, 4000);
      }, 1200);
    });
  }


  /* ─────────────────────────────────────────────
   * 5. FAQ ACCORDION
   * ───────────────────────────────────────────── */
  function initFAQ() {
    var triggers = document.querySelectorAll('.faq-trigger');
    if (!triggers.length) return;

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item   = trigger.closest('.faq-item');
        var body   = item.querySelector('.faq-body');
        var isOpen = item.classList.contains('open');

        /* Close all */
        document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
          var b = openItem.querySelector('.faq-body');
          b.style.maxHeight = null;
        });

        /* Open clicked (if it was closed) */
        if (!isOpen) {
          item.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }


  /* ─────────────────────────────────────────────
   * 6. FLOATING CONTACT BUTTONS (WhatsApp + Call)
   * ───────────────────────────────────────────── */
 function initFloatingButtons() {
   var style = document.createElement('style');
    style.textContent = [
      '.floating-contact{position:fixed;bottom:95px;right:26px;display:flex;flex-direction:column;gap:16px;z-index:var(--z-toast, 500);}',
      '.floating-btn{width:55px;height:55px;border-radius:50%;display:flex;align-items:center;justify-content:center;text-decoration:none;box-shadow:0 4px 20px rgba(0,0,0,0.18);transition:transform 0.22s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.22s ease;border:none;cursor:pointer;}',
      '.floating-btn:hover{transform:scale(1.12);box-shadow:0 8px 28px rgba(0,0,0,0.22);opacity:1;}',
      '.floating-btn--whatsapp{background:#25D366;}',
      '.floating-btn--call{background:#0A0F1C;color:#fff;}',
      '.floating-btn svg{display:block;flex-shrink:0;}',
      '@media(max-width:540px){.floating-contact{bottom:90px;right:20px;}.floating-btn{width:55px;height:55px;}}'
    ].join('');
    document.head.appendChild(style);

    var wrap = document.createElement('div');
    wrap.className = 'floating-contact';
    wrap.setAttribute('aria-label', 'Quick contact');
    wrap.innerHTML = [
      '<a href="https://wa.me/17803184949" class="floating-btn floating-btn--whatsapp" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">',
        '<svg width="26" height="26" viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.168 1.6 5.933L0 24l6.233-1.574A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.374l-.36-.214-3.7.934.988-3.61-.234-.372A9.818 9.818 0 1112 21.818z"/></svg>',
      '</a>',
      '<a href="tel:7803184949" class="floating-btn floating-btn--call" aria-label="Call us at 780-318-4949">',
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07A19.5 19.5 0 013.89 10.8 19.8 19.8 0 01.82 2.18 2 2 0 012.82 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.6a16 16 0 006.29 6.29l.97-.97a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>',
      '</a>'
    ].join('');

    document.body.appendChild(wrap);
  }



  /* ─────────────────────────────────────────────
   * INIT ALL
   * ───────────────────────────────────────────── */
  function init() {
    initReveal();
    initCounters();
    initCalculator();
    initDisclaimerAccordion();
    initQuoteForm();
    initFAQ();
    initFloatingButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

