// One native dialog shared by the header and foundation section.
(function () {
  const dialog = document.getElementById('coming-soon-modal');
  if (!dialog) return;
  let opener;
  let previousOverflow;
  let pressedBackdrop = false;

  document.querySelectorAll('[data-coming-soon]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      if (dialog.open) return;
      opener = trigger;
      previousOverflow = document.documentElement.style.overflow;
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
    });
  });
  dialog.querySelectorAll('[data-close-coming-soon]').forEach(button => {
    button.addEventListener('click', () => dialog.close());
  });

  // Dismiss only when both press and release are outside the panel, so a
  // selection or drag that starts inside the message cannot close it.
  function outside(event) {
    const rect = dialog.getBoundingClientRect();
    return event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
  }
  dialog.addEventListener('pointerdown', event => { pressedBackdrop = outside(event); });
  dialog.addEventListener('click', event => {
    if (pressedBackdrop && outside(event)) dialog.close();
    pressedBackdrop = false;
  });
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = previousOverflow;
    // On mobile the navigation drawer closes when Donate Now is selected.
    // Return focus to its visible toggle instead of the now-hidden trigger.
    const menuToggle = document.getElementById('navbar-hamburger');
    const inClosedMobileMenu = opener?.closest('.navbar-nav') && menuToggle && getComputedStyle(menuToggle).display !== 'none';
    (inClosedMobileMenu ? menuToggle : opener)?.focus({ preventScroll: true });
  });
})();
