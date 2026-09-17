(function () {
  const params = new URLSearchParams(window.location.search);
  const position = params.get('position');
  const positionField = document.querySelector('[name="job_applying_for"]');
  if (position && positionField && !positionField.value) positionField.value = position.slice(0, 160);

  const success = document.querySelector('[data-application-success]');
  if (params.get('submitted') === '1' && success) {
    success.hidden = false;
    success.focus();
  }
})();
