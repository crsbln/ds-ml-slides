// Slide deck controller: keyboard, swipe, dots and the URL hash.
(() => {
  'use strict';
  const $ = sel => document.querySelector(sel);
  const slides = [...document.querySelectorAll('.slide')];
  if (!slides.length) return;

  const progress = $('#progress');
  const curEl = $('#counter .cur');
  const totEl = $('#counter .tot');
  const titleEl = $('#slideTitle');
  const announcer = $('#announcer');
  const prevBtn = $('#prev');
  const nextBtn = $('#next');
  const dots = $('#dots');
  let current = -1;

  const slideTitle = i => slides[i].dataset.title;
  const dotButtons = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Go to slide ${i + 1}: ${slideTitle(i)}`);
    b.addEventListener('click', () => go(i));
    dots.appendChild(b);
    return b;
  });

  function go(index, updateHash = true) {
    const next = Math.max(0, Math.min(slides.length - 1, index));
    if (next === current) return;
    const focusInSlide = current >= 0 && slides[current].contains(document.activeElement);
    current = next;
    slides.forEach((s, j) => { s.classList.toggle('active', j === current); s.classList.toggle('past', j < current); s.inert = j !== current; });
    dotButtons.forEach((d, j) => (j === current ? d.setAttribute('aria-current', 'step') : d.removeAttribute('aria-current')));
    progress.style.width = `${((current + 1) / slides.length) * 100}%`;
    curEl.textContent = current + 1;
    totEl.textContent = slides.length;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === slides.length - 1;
    slides[current].scrollTop = 0;
    titleEl.textContent = slideTitle(current);
    announcer.textContent = `Slide ${current + 1} of ${slides.length}: ${slideTitle(current)}`;
    if (focusInSlide) slides[current].focus({ preventScroll: true });
    if (updateHash) { try { history.replaceState(null, '', `${location.search}#${current + 1}`); } catch { /* not allowed here */ } }
  }

  prevBtn.addEventListener('click', () => go(current - 1));
  nextBtn.addEventListener('click', () => go(current + 1));
  window.addEventListener('hashchange', () => go((parseInt(location.hash.slice(1), 10) || 1) - 1, false));

  document.addEventListener('keydown', e => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const onControl = !!e.target.closest?.('a, button, input, select, textarea, summary');
    let t = null;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') t = current + 1;
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') t = current - 1;
    else if (!onControl && (e.key === ' ' || e.key === 'Enter')) t = e.shiftKey ? current - 1 : current + 1;
    else if (e.key === 'Home') t = 0;
    else if (e.key === 'End') t = slides.length - 1;
    if (t === null) return;
    e.preventDefault();
    go(t);
  });

  let touch = null;
  document.addEventListener('touchstart', e => { touch = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null; }, { passive: true });
  document.addEventListener('touchend', e => {
    if (!touch) return;
    const dx = e.changedTouches[0].clientX - touch.x, dy = e.changedTouches[0].clientY - touch.y;
    touch = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  go((parseInt(location.hash.slice(1), 10) || 1) - 1, location.hash !== '');
})();
