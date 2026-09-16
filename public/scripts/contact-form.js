// Progressive enhancement: native POST remains available without JavaScript.
(function () {
  const form = document.getElementById('contact-form');
  if (!form || !window.fetch) return;
  const button = form.querySelector('button[type="submit"]');
  const label = form.querySelector('[data-submit-label]');
  const status = document.getElementById('contact-form-status');
  let pending = false;

  function show(message, state) {
    status.textContent = message;
    status.dataset.state = state;
    status.hidden = false;
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    const fields = Object.fromEntries(new FormData(form));
    if (fields._honey) return;
    pending = true;
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    label.textContent = 'Sending…';
    show('Sending your message…', 'pending');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(form.dataset.ajaxEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(fields),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || ![true, 'true'].includes(result.success)) throw new Error('Submission not accepted');
      if (/activat|confirm your email|verify your email/i.test(result.message || '')) {
        show('Email delivery is still being set up. Your message has not been confirmed. Please call us instead.', 'error');
      } else {
        form.reset();
        show('Thank you. Your message has been submitted. Our team will reply to the email address you provided.', 'success');
      }
    } catch (_) {
      show('We could not confirm your submission. Your message is still here. Please try again later or call us using the number above.', 'error');
    } finally {
      clearTimeout(timeout);
      pending = false;
      button.disabled = false;
      form.setAttribute('aria-busy', 'false');
      label.textContent = 'Send Message';
      status.focus();
    }
  });
})();
