// Chart tooltips: show an element's data-tip next to the pointer, or above it on keyboard focus.
(() => {
  'use strict';
  const tip = document.createElement('div');
  tip.className = 'tip';
  tip.setAttribute('aria-hidden', 'true');
  document.body.appendChild(tip);

  const target = e => e.target.closest?.('[data-tip]');
  function place(x, y) {
    const r = tip.getBoundingClientRect();
    tip.style.left = `${Math.min(innerWidth - r.width - 8, Math.max(8, x - r.width / 2))}px`;
    tip.style.top = `${y - r.height - 14 < 8 ? y + 18 : y - r.height - 14}px`;
  }
  function show(el, x, y) { tip.textContent = el.dataset.tip; tip.classList.add('on'); place(x, y); }
  const hide = () => tip.classList.remove('on');

  document.addEventListener('pointerover', e => { const el = target(e); if (el) show(el, e.clientX, e.clientY); });
  document.addEventListener('pointermove', e => { if (target(e)) place(e.clientX, e.clientY); });
  document.addEventListener('pointerout', e => { const el = target(e); if (el && !el.contains(e.relatedTarget)) hide(); });
  document.addEventListener('focusin', e => { const el = target(e); if (el) { const r = el.getBoundingClientRect(); show(el, r.left + r.width / 2, r.top); } });
  document.addEventListener('focusout', hide);
  window.addEventListener('hashchange', hide);
})();
