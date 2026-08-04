// Restoricon, LLC - Main JavaScript

document.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    const MAILTO_EMAIL = 'restoricon@gmail.com';

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
        msg.innerHTML = `
            <strong>${message}</strong>
            <p class="mailto-instruction">Opening your email app... Please review the pre-filled message and tap Send!</p>
            <p class="mailto-fallback">
                Didn't open? <a href="${mailtoUrl}" target="_blank" rel="noopener">Click here to send email directly</a>
                or contact us at <a href="mailto:${MAILTO_EMAIL}">${MAILTO_EMAIL}</a>
            </p>
        `;
        form.appendChild(msg);
        msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return msg;
    }

    function showFormError(form, message) {
        const oldMsg = form.querySelector('.form-message');
        if (oldMsg) oldMsg.remove();

        const msg = document.createElement('div');
        msg.className = 'form-message error';
        msg.innerHTML = message;
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
    // 1. MOBILE NAV TOGGLE (Direct handler - no delegation needed)
    // ==========================================
    const menuToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function (e) {
            e.preventDefault();
            navMenu.classList.toggle('open');
            const isOpen = navMenu.classList.contains('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
        });

        // Auto-close nav when clicking menu links
        navMenu.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Open navigation');
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
    const handleFormMailto = (formId, subjectPrefix) => {
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

            alert("Opening your email client... Please review the pre-filled message and click Send!");
        });
    };

    handleFormMailto('contactForm', 'Website Contact Inquiry');
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