// Public marketing pages. Never read form values or track portal/payment actions.
(function () {
  'use strict';
  var config = document.currentScript;
  if (!config || window.ucsAnalyticsInitialized) return;
  var id = config.dataset.measurementId;
  var origin = config.dataset.origin;
  var path = config.dataset.path;
  var currentPath = location.pathname.replace(/index\.html$/, '').replace(/\/$/, '') + '/';
  if (!/^G-[A-Z0-9]+$/.test(id || '') || location.origin !== origin || currentPath !== path) return;
  window.ucsAnalyticsInitialized = true;
  var optOutKey = 'ucs.analytics-opt-out';
  var button = document.getElementById('analytics-opt-out');
  var status = document.getElementById('analytics-status');
  var optedOut = false;
  try { optedOut = localStorage.getItem(optOutKey) === '1'; } catch (_) { return; }
  var privacySignal = navigator.globalPrivacyControl || navigator.doNotTrack === '1';
  if (button && status) {
    button.hidden = false;
    button.textContent = optedOut ? 'Allow website analytics' : 'Turn off website analytics';
    status.textContent = privacySignal ? 'Analytics is off because of your browser privacy preference.'
      : optedOut ? 'Analytics is off in this browser.' : 'Analytics is enabled for eligible public pages in this browser.';
    button.disabled = !!privacySignal;
    button.addEventListener('click', function () {
      optedOut = !optedOut;
      try { localStorage.setItem(optOutKey, optedOut ? '1' : '0'); } catch (_) {
        status.textContent = 'Your browser could not save this preference. Enable Do Not Track or Global Privacy Control to disable analytics.';
        return;
      }
      window['ga-disable-' + id] = optedOut;
      if (optedOut) {
        document.cookie.split(';').forEach(function (cookie) {
          var name = cookie.split('=')[0].trim();
          if (name === '_ga' || name === '_ga_' + id.slice(2)) {
            document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax; Secure';
          }
        });
      }
      // Unload the tag immediately after withdrawing; re-run guards when enabling.
      location.reload();
    });
  }
  if (optedOut || privacySignal) return;
  if (document.querySelector('form') || window.self !== window.top) return;
  var query = new URLSearchParams(location.search);
  if (query.has('siteadjust') || query.has('sitewalk')) return;
  try { if (sessionStorage.getItem('sitewalk.on')) return; } catch (_) { return; }
  function sensitiveDestination(target) {
    return /(^|\.)(navigatingcare\.com|poscorp\.com|formsubmit\.co)$/.test(target.hostname)
      || /\/(?:contact|job-application|patient-portal|portal|login|billing|appointments?|schedule)(?:\/|$)/i.test(target.pathname);
  }
  var referrer = '';
  try {
    var from = new URL(document.referrer);
    if (/^https?:$/.test(from.protocol) && !sensitiveDestination(from)) referrer = from.origin + '/';
  } catch (_) {}
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  // No consent banner by the site owner's instruction. Advertising remains denied.
  gtag('consent', 'default', {
    analytics_storage: 'granted', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied'
  });
  gtag('js', new Date());
  var options = {
    send_page_view: false,
    page_location: origin + path,
    page_referrer: referrer,
    page_title: config.dataset.title,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_domain: 'none',
    cookie_expires: 395 * 24 * 60 * 60,
    cookie_update: false
  };
  // Preserve useful campaign attribution without forwarding arbitrary URL input.
  ['source', 'medium', 'name', 'id', 'content'].forEach(function (field) {
    var value = query.get('utm_' + (field === 'name' ? 'campaign' : field));
    if (value) options['campaign_' + field] = /^[a-zA-Z0-9 _.-]{1,100}$/.test(value) && !/\d{7,}/.test(value) ? value : '(redacted)';
  });
  if (query.has('utm_term')) options.campaign_term = '(redacted)';
  gtag('config', id, options);
  gtag('event', 'page_view', { send_to: id });
  var links = new WeakMap();
  document.querySelectorAll('a[href]').forEach(function (link) { links.set(link, link.href); });
  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link || links.get(link) !== link.href || event.defaultPrevented) return;
    if (/^(tel|mailto):/i.test(link.href)) {
      gtag('event', 'contact_click', { send_to: id, contact_method: link.href.startsWith('tel:') ? 'phone' : 'email' });
      return;
    }
    try {
      var destination = new URL(link.href);
      if (!/^https?:$/.test(destination.protocol) || sensitiveDestination(destination)) return;
      var download = destination.pathname.match(/\.([a-z0-9]+)$/i);
      if (download && /^(pdf|docx?|xlsx?|pptx?|csv|zip)$/i.test(download[1])) {
        gtag('event', 'file_download', { send_to: id, file_extension: download[1].toLowerCase(), link_url: destination.origin + destination.pathname });
      } else if (destination.origin !== origin) {
        // Domains identify referral destinations without forwarding destination query strings or personal paths.
        gtag('event', 'click', { send_to: id, outbound: true, link_domain: destination.hostname, link_url: destination.origin + '/' });
      }
    } catch (_) {}
  });
  var tag = document.createElement('script');
  tag.async = true;
  tag.referrerPolicy = 'no-referrer';
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(tag);
})();
