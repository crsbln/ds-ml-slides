// Motion: give staggered elements their index, and count numbers up each time their slide opens.
// The entrance animations themselves are CSS (.active ...); reduced motion shows the final state.
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --i drives the CSS stagger (set through the CSSOM: the CSP forbids style attributes)
  const stagger = (selector, scope = document) => scope.querySelectorAll(selector).forEach((el, i) => el.style.setProperty('--i', i));
  document.querySelectorAll('.chart svg, .vs-card svg, .dots-svg svg, .steps, .grid, .recs, .trap svg, .plan-chips, .berg svg, .future, .calib svg, .how-pred, .steps5, .build5').forEach(group => {
    stagger(':scope > g, :scope > li, :scope > .card, :scope > .person', group);
    stagger(':scope > circle', group);
  });

  // Count-up: animate the first number in an element's text, keep everything around it
  const NUM = /\d[\d,]*(?:\.\d+)?/;
  const counters = [...document.querySelectorAll('[data-count]')].map(el => {
    const text = el.textContent;
    const m = text.match(NUM);
    const raw = m[0].replace(/,/g, '');
    return { el, text, m, target: parseFloat(raw), decimals: (raw.split('.')[1] || '').length, commas: m[0].includes(',') };
  });
  const format = (c, v) => {
    const n = c.commas ? v.toLocaleString('en-US', { minimumFractionDigits: c.decimals, maximumFractionDigits: c.decimals }) : v.toFixed(c.decimals);
    return c.text.slice(0, c.m.index) + n + c.text.slice(c.m.index + c.m[0].length);
  };
  const ease = t => 1 - Math.pow(1 - t, 3);

  function run(slide) {
    counters.filter(c => slide.contains(c.el)).forEach(c => {
      if (reduce) { c.el.textContent = c.text; return; }
      const delay = parseFloat(c.el.dataset.delay || '0.25') * 1000;
      const duration = parseFloat(c.el.dataset.duration || '1.3') * 1000;
      const start = performance.now() + delay;
      c.el.textContent = format(c, 0);
      const tick = now => {
        const t = Math.min(1, Math.max(0, (now - start) / duration));
        c.el.textContent = format(c, c.target * ease(t));
        if (t < 1 && slide.classList.contains('active')) requestAnimationFrame(tick);
        else c.el.textContent = c.text;
      };
      requestAnimationFrame(tick);
    });
  }

  // Re-run every time a slide becomes active (deck.js toggles .active)
  const slides = document.querySelectorAll('.slide');
  const seen = new WeakMap();
  const watch = new MutationObserver(records => records.forEach(({ target }) => {
    const on = target.classList.contains('active');
    if (on && !seen.get(target)) run(target);
    seen.set(target, on);
  }));
  slides.forEach(s => { watch.observe(s, { attributes: true, attributeFilter: ['class'] }); if (s.classList.contains('active')) { seen.set(s, true); run(s); } });
})();
