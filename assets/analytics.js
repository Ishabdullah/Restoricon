// Restoricon, LLC — shared GA4 loader.
//
// GA_MEASUREMENT_ID is the Restoricon GA4 property's Measurement ID. If it's
// ever unset or reverted to the "G-XXXXXXXXXX" placeholder, this file loads no
// external script, sets no cookies, and window.gtag stays undefined — every
// page on the site keeps working normally either way.
(function () {
  var GA_MEASUREMENT_ID = 'G-5YP2PZ0W54';

  if (!/^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID) || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    return;
  }

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
})();
