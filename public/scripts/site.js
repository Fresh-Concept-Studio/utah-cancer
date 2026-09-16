// Shared navigation behavior, loaded once on each page.
(function () {
  const header = document.querySelector('.navbar');
  const toggle = document.getElementById('navbar-hamburger');
  const nav = document.querySelector('.navbar-nav');
  const overlay = document.getElementById('mobile-menu-overlay');
  if (!header || !toggle || !nav || !overlay) return;
  function setOpen(open) {
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  }
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  overlay.addEventListener('click', () => setOpen(false));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setOpen(false); });
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
})();
