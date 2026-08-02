// Restoricon, LLC - Main JavaScript

document.addEventListener('DOMContentLoaded', function () {
    console.log("RESTORICON JS Loaded Successfully");

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

    function getFormValue(form, fieldConfigs) {
        for (const config of fieldConfigs) {
            const field = form.querySelector(config.selector);
            if (field && field.value.trim()) {
                return field.value.trim();
            }
        }
        return config?.default || '';
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
    document.addEventListener('click', function (e) {
        // Open Pre-Claim Modal
        if (e.target.closest('#openPreClaimModal') || e.target.closest('.pre-claim-cta')) {
            e.preventDefault();
            const modal = document.getElementById('preClaimModal');
            if (modal) modal.style.display = 'block';
        }

        // Open Subcontractor Modal
        if (e.target.closest('#openSubcontractorModal') || e.target.closest('#openSubcontractorModalHero') || e.target.closest('.subcontractor-cta')) {
            e.preventDefault();
            const modal = document.getElementById('subcontractorModal');
            if (modal) modal.style.display = 'block';
        }

        // Close any open modal via X or Close button
        if (e.target.matches('.modal-close, .modal-close-btn, .close-modal') || e.target.closest('.modal-close, .close-modal')) {
            e.preventDefault();
            document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
        }

        // Open Agreement Terms Modal
        if (e.target.closest('#reviewAgreementBtn')) {
            e.preventDefault();
            const modal = document.getElementById('agreementModal');
            if (modal) modal.style.display = 'block';
        }

        // Close modal when clicking outside content (backdrop click)
        if (e.target.classList.contains('modal-overlay')) {
            e.target.style.display = 'none';
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay[style*="display: block"]').forEach(m => m.style.display = 'none');
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