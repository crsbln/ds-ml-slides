// Slide menu: one click from any slide to any other (handy in Q&A). Uses the slide titles; deck.js follows the hash.
(() => {
  'use strict';
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('menu');
  const list = document.getElementById('menuList');
  if (!btn || !menu) return;
  const slides = [...document.querySelectorAll('.slide')];
  const buttons = slides.map((s, i) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    const n = document.createElement('b');
    n.textContent = i + 1;
    b.append(n, s.dataset.title);
    b.addEventListener('click', () => { location.hash = `#${i + 1}`; close(); });
    li.appendChild(b);
    list.appendChild(li);
    return b;
  });
  // bottom-bar dots: hover (or focus) shows "9 · title: keywords" through js/tooltip.js
  document.querySelectorAll('#dots button').forEach((d, i) => {
    const s = slides[i];
    d.dataset.tip = `${i + 1} · ${s.dataset.title}${s.dataset.keys ? `: ${s.dataset.keys}` : ''}`;
  });
  const current = () => (parseInt(location.hash.slice(1), 10) || 1) - 1;
  function open() {
    buttons.forEach((b, i) => (i === current() ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current')));
    menu.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    buttons[current()]?.focus();
  }
  function close() { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
  btn.addEventListener('click', () => (menu.hidden ? open() : close()));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !menu.hidden) { close(); btn.focus(); }
    else if ((e.key === 'm' || e.key === 'M') && !e.target.closest?.('input, textarea')) { menu.hidden ? open() : close(); }
  });
  document.addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target) && !btn.contains(e.target)) close(); });

  // Fullscreen: button in the bar or the F key (works where F11 is taken by the laptop)
  const fsBtn = document.getElementById('fsBtn');
  const toggleFs = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {});
  fsBtn?.addEventListener('click', toggleFs);
  document.addEventListener('keydown', e => {
    if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && !e.altKey && !e.target.closest?.('input, textarea')) toggleFs();
  });
})();
