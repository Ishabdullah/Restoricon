document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('year').textContent = new Date().getFullYear();

    // ------------------------------------------------------------------
    // UTM read (analytics.js, loaded deferred above, has already run by
    // the time DOMContentLoaded fires, so window.gtag is defined here if
    // a real GA4 Measurement ID has been configured).
    // ------------------------------------------------------------------
    var params = new URLSearchParams(window.location.search);
    var utmSource = params.get('utm_source') || 'gas_station_qr';
    var utmMedium = params.get('utm_medium') || 'qr_code';
    var utmCampaign = params.get('utm_campaign') || '';
    document.getElementById('utm_source').value = utmSource;
    document.getElementById('utm_medium').value = utmMedium;
    document.getElementById('utm_campaign').value = utmCampaign;

    function trackEvent(name, extraParams) {
      if (typeof window.gtag !== 'function') return;
      var baseParams = {
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        page_location: window.location.href
      };
      window.gtag('event', name, Object.assign(baseParams, extraParams || {}));
    }

    // 1. Page view (custom event, in addition to GA4's automatic page_view)
    trackEvent('gas_page_view');

    // 2. Primary CTA click
    var primaryCta = document.querySelector('.cta-stack .btn-primary');
    if (primaryCta) {
      primaryCta.addEventListener('click', function () {
        trackEvent('gas_cta_click', { cta_label: primaryCta.textContent.trim() });
      });
    }

    // 3. Phone (tel:) clicks — anywhere on the page
    document.querySelectorAll('a[href^="tel:"]').forEach(function (el) {
      el.addEventListener('click', function () {
        trackEvent('gas_phone_click', { phone_number: el.getAttribute('href').replace('tel:', '') });
      });
    });

    // 4. Email (mailto:) clicks — the static contact-line link only; the
    //    dynamically inserted fallback link inside the success message is
    //    covered separately since it doesn't exist until after form submit.
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (el) {
      el.addEventListener('click', function () {
        trackEvent('gas_email_click');
      });
    });

    // 5. Consultation form — mailto handoff only. This page cannot detect
    //    whether the visitor's mail app actually sent the message, so the
    //    event name reflects an attempt, not a confirmed submission.
    var form = document.getElementById('gasLeadForm');
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var required = form.querySelectorAll('[required]');
      for (var i = 0; i < required.length; i++) {
        if (!required[i].checkValidity()) {
          required[i].reportValidity();
          required[i].focus();
          return;
        }
      }

      var projectType = document.getElementById('project_type').value;

      var formData = new FormData(form);
      var lines = ['New Consultation Request (Gas Station Campaign):', ''];
      formData.forEach(function (value, key) {
        if (!value) return;
        lines.push(key.replace(/_/g, ' ').toUpperCase() + ': ' + value);
      });
      lines.push('SOURCE PAGE: ' + window.location.href);

      var mailtoUrl = 'mailto:contact@restoricon.com?subject=' +
        encodeURIComponent('Gas Station Campaign - Consultation Request') +
        '&body=' + encodeURIComponent(lines.join('\n'));

      trackEvent('gas_form_submit_attempt', { project_type: projectType || '(not specified)' });

      var old = form.querySelector('.form-message');
      if (old) old.remove();
      var msg = document.createElement('div');
      msg.className = 'form-message success';
      msg.innerHTML = '<strong>Opening your email app&hellip;</strong><p>Please review the pre-filled message and tap Send. Didn\'t open? <a href="' + mailtoUrl + '">Tap here</a> or call <a href="tel:+18603371820">(860) 337-1820</a>.</p>';
      form.appendChild(msg);
      msg.scrollIntoView({ behavior: 'smooth', block: 'center' });

      window.location.href = mailtoUrl;

      // There's no backend to confirm a real send against, so this fires
      // once the mail-client handoff has been triggered (not once the email
      // is actually sent) — same caveat as the gas_form_submit_attempt event
      // above. mailto: is an OS-level handoff, not a page navigation, so the
      // tab is still here and free to move on to the thank-you page.
      setTimeout(function () {
        window.location.href = '/gas/thank-you/';
      }, 900);
    });
  });
