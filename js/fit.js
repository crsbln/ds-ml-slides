// No scrolling at any screen size: if a slide's content is taller or wider than the screen, scale it down to fit.
(() => {
  'use strict';
  const slides = [...document.querySelectorAll('.slide')];

  function fit(slide) {
    const inner = slide.querySelector('.inner');
    if (!inner) return;
    inner.style.transform = '';
    inner.style.marginTop = '';
    inner.style.minHeight = 'auto';
    const cs = getComputedStyle(slide);
    const availH = slide.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    const availW = slide.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const h = inner.scrollHeight;
    const w = Math.max(inner.scrollWidth, inner.offsetWidth);
    let s = Math.min(1, availH / h, availW / w);
    if (s > 0.99) s = 1;   // ignore sub-pixel differences
    if (s < 1) {
      inner.style.transformOrigin = 'top center';
      inner.style.transform = `scale(${s})`;
      inner.style.marginTop = `${Math.max(0, (availH - h * s) / 2)}px`;
    } else {
      inner.style.minHeight = '';   // fits: keep the normal vertical centring
    }
  }
  const fitAll = () => slides.forEach(fit);

  let raf = 0;
  window.addEventListener('resize', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fitAll); });
  document.fonts?.ready.then(fitAll);
  window.addEventListener('load', fitAll);
  fitAll();
})();
