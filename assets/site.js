/* Progressive enhancements only. Navigation, case studies and image links also work without JS. */
(() => {
  'use strict';
  document.documentElement.classList.add('enhanced');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  function closeMenu(returnFocus = false) {
    if (!toggle || !nav) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Menu +';
    if (returnFocus) toggle.focus();
  }
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close −' : 'Menu +';
    });
    nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
    });
    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) closeMenu();
    });
    window.matchMedia('(min-width: 761px)').addEventListener('change', () => closeMenu());
  }

  const filters = document.querySelectorAll('[data-filter]');
  const items = document.querySelectorAll('[data-category]');
  const status = document.querySelector('#filter-status');
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    let count = 0;
    items.forEach(item => {
      item.hidden = button.dataset.filter !== 'all' && item.dataset.category !== button.dataset.filter;
      if (!item.hidden) count++;
    });
    if (status) status.textContent = `${count} creative${count === 1 ? '' : 's'} shown`;
  }));

  const dialog = document.querySelector('#lightbox');
  if (dialog && typeof dialog.showModal === 'function') {
    const image = dialog.querySelector('img');
    const caption = dialog.querySelector('#lightbox-caption');
    const original = dialog.querySelector('[data-original]');
    const error = dialog.querySelector('.lightbox-error');
    let group = [], index = 0, trigger;
    function show(i) {
      index = (i + group.length) % group.length;
      const link = group[index];
      image.hidden = false;
      error.hidden = true;
      image.src = link.href;
      image.alt = link.dataset.caption || link.querySelector('img')?.alt || 'Project screenshot';
      caption.textContent = `${image.alt} · ${index + 1} of ${group.length}`;
      original.href = link.href;
      dialog.querySelectorAll('[data-step]').forEach(button => button.hidden = group.length < 2);
    }
    image.addEventListener('error', () => { image.hidden = true; error.hidden = false; });
    document.addEventListener('click', e => {
      const link = e.target.closest('a[data-gallery]');
      if (!link || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      group = [...document.querySelectorAll('a[data-gallery]')].filter(a => a.dataset.gallery === link.dataset.gallery && !a.closest('[hidden]'));
      trigger = link;
      show(group.indexOf(link));
      dialog.showModal();
    });
    dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
    dialog.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => show(index + Number(button.dataset.step))));
    dialog.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); show(index + (e.key === 'ArrowLeft' ? -1 : 1)); }
    });
    dialog.addEventListener('click', e => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => { image.removeAttribute('src'); trigger?.focus(); });
  }

  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('entering'); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
})();
