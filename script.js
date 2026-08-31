// Restoricon, LLC - Main JavaScript

document.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    const MAILTO_EMAIL = 'contact@restoricon.com';

    function buildMailtoUrl(subject, body) {
        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);
        return `mailto:${MAILTO_EMAIL}?subject=${encodedSubject}&body=${encodedBody}`;
    }

    
    function showMailtoSuccess(form, message, mailtoUrl) {
        const oldMsg = form.querySelector('.form-message');
        if (oldMsg) oldMsg.remove();

        const msg = document.createElement('div');
        msg.className = 'form-message success';
        
        const strong = document.createElement('strong');
        strong.textContent = message;
        
        const pInstruction = document.createElement('p');
        pInstruction.className = 'mailto-instruction';
        pInstruction.textContent = 'Opening your email app... Please review the pre-filled message and tap Send!';
        
        const pFallback = document.createElement('p');
        pFallback.className = 'mailto-fallback';
        pFallback.textContent = "Didn't open? ";
        
        const aDirect = document.createElement('a');
        aDirect.href = mailtoUrl;
        aDirect.target = '_blank';
        aDirect.rel = 'noopener';
        aDirect.textContent = 'Click here to send email directly';
        
        const spanOr = document.createElement('span');
        spanOr.textContent = ' or contact us at ';
        
        const aContact = document.createElement('a');
        aContact.href = 'mailto:' + MAILTO_EMAIL;
        aContact.textContent = MAILTO_EMAIL;
        
        pFallback.appendChild(aDirect);
        pFallback.appendChild(spanOr);
        pFallback.appendChild(aContact);
        
        msg.appendChild(strong);
        msg.appendChild(pInstruction);
        msg.appendChild(pFallback);
        
        form.appendChild(msg);

        msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return msg;
    }

    function showFormError(form, message) {
        const oldMsg = form.querySelector('.form-message');
        if (oldMsg) oldMsg.remove();

        const msg = document.createElement('div');
        msg.className = 'form-message error';
        msg.textContent = message;
        form.appendChild(msg);
        msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function validateRequiredFields(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let firstInvalid = null;
        requiredFields.forEach(field => {
            if (!field.checkValidity()) {
                field.reportValidity();
                if (!firstInvalid) firstInvalid = field;
            }
        });
        return firstInvalid;
    }

    // ==========================================
    // 1. UNIVERSAL NAV DRAWER & TOGGLE
    // ==========================================
    const navToggleBtn = document.getElementById('navToggleBtn') || document.querySelector('.nav-toggle');
    const navDrawer = document.getElementById('navDrawer');
    const drawerOverlay = document.getElementById('navDrawerOverlay');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    const navMenu = document.querySelector('.nav-menu');

    function openDrawer() {
        if (!navDrawer) return;
        navDrawer.classList.add('open');
        navDrawer.setAttribute('aria-hidden', 'false');
        if (drawerOverlay) drawerOverlay.classList.add('active');
        if (navToggleBtn) {
            navToggleBtn.setAttribute('aria-expanded', 'true');
            navToggleBtn.setAttribute('aria-label', 'Close universal navigation menu');
        }
        document.body.style.overflow = 'hidden';
        if (drawerCloseBtn) drawerCloseBtn.focus();
    }

    function closeDrawer() {
        if (!navDrawer) return;
        navDrawer.classList.remove('open');
        navDrawer.setAttribute('aria-hidden', 'true');
        if (drawerOverlay) drawerOverlay.classList.remove('active');
        if (navToggleBtn) {
            navToggleBtn.setAttribute('aria-expanded', 'false');
            navToggleBtn.setAttribute('aria-label', 'Open universal navigation menu');
            navToggleBtn.focus();
        }
        document.body.style.overflow = '';
    }

    if (navToggleBtn) {
        navToggleBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (navDrawer && navDrawer.classList.contains('open')) {
                closeDrawer();
            } else if (navDrawer) {
                openDrawer();
            } else if (navMenu) {
                navMenu.classList.toggle('open');
            }
        });
    }

    if (drawerCloseBtn) {
        drawerCloseBtn.addEventListener('click', function (e) {
            e.preventDefault();
            closeDrawer();
        });
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', function () {
            closeDrawer();
        });
    }

    // Escape key closes drawer
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navDrawer && navDrawer.classList.contains('open')) {
            closeDrawer();
        }
    });

    // Auto-close drawer when clicking any links inside drawer
    if (navDrawer) {
        navDrawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeDrawer();
            });
        });
    }

    // Auto-close desktop nav when clicking menu links (if used)
    if (navMenu) {
        navMenu.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
            });
        });
    }

    // ==========================================
    // 2. SMOOTH SCROLLING FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ==========================================
    // 3. GLOBAL MODAL CONTROL HANDLER (Event Delegation)
    // ==========================================
    // Modals are tracked as a stack so that closing the topmost modal
    // (e.g. the nested Agreement modal opened from within the Subcontractor
    // modal) never closes the modal(s) underneath it, and so focus returns
    // to whatever element opened each modal.
    const modalStack = [];
    const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function openModal(modal, triggerEl) {
        if (!modal) return;
        modal._lastFocused = triggerEl || document.activeElement;
        modal.style.display = 'block';
        modalStack.push(modal);
        const focusTarget = modal.querySelector('.modal-close') || modal.querySelector(FOCUSABLE_SELECTOR);
        if (focusTarget) focusTarget.focus();
    }

    function closeModal(modal) {
        if (!modal) return;
        const idx = modalStack.indexOf(modal);
        if (idx !== -1) modalStack.splice(idx, 1);
        modal.style.display = 'none';
        if (modal._lastFocused && typeof modal._lastFocused.focus === 'function') {
            modal._lastFocused.focus();
        }
    }

    function closeTopModal() {
        const modal = modalStack[modalStack.length - 1];
        if (modal) closeModal(modal);
    }

    document.addEventListener('click', function (e) {
        // Open Pre-Claim Modal
        if (e.target.closest('#openPreClaimModal') || e.target.closest('.pre-claim-cta')) {
            e.preventDefault();
            openModal(document.getElementById('preClaimModal'), e.target);
        }

        // Open Subcontractor Modal
        if (e.target.closest('#openSubcontractorModal') || e.target.closest('.subcontractor-cta')) {
            e.preventDefault();
            openModal(document.getElementById('subcontractorModal'), e.target);
        }

        // Close only the specific modal the close button/X belongs to
        const closeTrigger = e.target.closest('.modal-close, .modal-close-btn, .close-modal');
        if (closeTrigger) {
            e.preventDefault();
            closeModal(closeTrigger.closest('.modal-overlay'));
        }

        // Open Agreement Terms Modal
        if (e.target.closest('#reviewAgreementBtn')) {
            e.preventDefault();
            openModal(document.getElementById('agreementModal'), e.target);
        }

        // Close modal when clicking outside content (backdrop click) —
        // only the overlay that was actually clicked, not every open modal.
        if (e.target.classList.contains('modal-overlay')) {
            closeModal(e.target);
        }
    });

    // Escape closes only the topmost (most recently opened) modal, and Tab
    // is trapped inside it so keyboard focus can't escape to background content.
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeTopModal();
            return;
        }
        if (e.key === 'Tab' && modalStack.length) {
            const modal = modalStack[modalStack.length - 1];
            const focusable = Array.from(modal.querySelectorAll(FOCUSABLE_SELECTOR));
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    // ==========================================
    // 4. FORM SUBMIT HANDLERS
    // ==========================================
    const handleFormMailto = (formId, subjectPrefix, redirectUrl) => {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validation
            const invalidField = validateRequiredFields(this);
            if (invalidField) {
                invalidField.focus();
                return;
            }

            const formData = new FormData(this);
            let bodyText = `New Form Submission (${subjectPrefix}):\n\n`;
            formData.forEach((value, key) => {
                bodyText += `${key.replace(/_/g, ' ').toUpperCase()}: ${value}\n`;
            });

            const mailtoUrl = `mailto:${MAILTO_EMAIL}?subject=${encodeURIComponent(subjectPrefix)}&body=${encodeURIComponent(bodyText)}`;

            window.location.href = mailtoUrl;

            if (redirectUrl) {
                // There's no backend to confirm a real send against, so this
                // fires once the mail-client handoff has been triggered, not
                // once the email is actually sent. mailto: is an OS-level
                // handoff, not a page navigation, so the tab is still here
                // and free to move on to the thank-you page.
                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 900);
            } else {
                alert("Opening your email client... Please review the pre-filled message and click Send!");
            }
        });
    };

    handleFormMailto('contactForm', 'Website Contact Inquiry', '/thank-you/');
    handleFormMailto('subcontractorForm', 'Subcontractor Application');
    handleFormMailto('preClaimForm', 'Free Pre-Claim Estimate Request');

    // ==========================================
    // 5. SUBCONTRACTOR FORM - Conditional License Field
    // ==========================================
    const licenseRadios = document.querySelectorAll('input[name="has_license"]');
    const licenseNumberField = document.getElementById('license_number_field');
    const licenseNumberInput = document.getElementById('license_number');

    licenseRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'Yes') {
                licenseNumberField.hidden = false;
                licenseNumberInput.required = true;
                licenseNumberInput.setAttribute('aria-required', 'true');
            } else {
                licenseNumberField.hidden = true;
                licenseNumberInput.required = false;
                licenseNumberInput.removeAttribute('aria-required');
            }
        });
    });

    // ==========================================
    // 6. FOOTER YEAR
    // ==========================================
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});
    // ==========================================
    // 7. COOKIE CONSENT & ANALYTICS
    // ==========================================
    function loadAnalytics() {
        const script = document.createElement('script');
        // determine base path based on current path depth
        const depth = window.location.pathname.split('/').filter(p => p).length;
        let prefix = '';
        if (depth > 0 && !window.location.pathname.endsWith('.html')) prefix = '../'.repeat(depth);
        else if (depth > 1) prefix = '../'.repeat(depth - 1);
        
        script.src = (prefix || './') + 'assets/analytics.js';
        script.defer = true;
        document.head.appendChild(script);
    }

    function initCookieConsent() {
        const consent = localStorage.getItem('cookieConsent');
        if (consent === 'granted') {
            loadAnalytics();
            return;
        } else if (consent === 'denied') {
            return;
        }

        // Show banner
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <p>We use cookies to analyze site traffic and optimize your experience. <a href="/privacy-policy.html">Learn more</a>.</p>
                <div class="cookie-buttons">
                    <button id="btnAcceptCookies" class="btn btn-primary" style="padding: 5px 15px; margin-right: 10px;">Accept</button>
                    <button id="btnDeclineCookies" class="btn" style="padding: 5px 15px; background: transparent; border: 1px solid #fff; color: #fff;">Decline</button>
                </div>
            </div>
        `;
        
        // Basic inline styles for banner since it's dynamic (to avoid breaking CSP, we can add a class, but we need styles)
        // Wait, CSP style-src has 'unsafe-inline' so we can use inline styles, or better add a class and put it in style.css
        
        document.body.appendChild(banner);

        document.getElementById('btnAcceptCookies').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'granted');
            banner.remove();
            loadAnalytics();
        });

        document.getElementById('btnDeclineCookies').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'denied');
            banner.remove();
        });
    }

    initCookieConsent();

    // ==========================================
    // 8. SERVICE WORKER REGISTRATION (PWA)
    // ==========================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered with scope:', registration.scope);
                })
                .catch(err => {
                    console.error('SW registration failed:', err);
                });
        });
    }
