# RESTORICON, LLC — PROJECT ARCHITECTURE & CONTEXT

## 1. Executive Summary & Brand Identity
- **Company Name:** Restoricon, LLC
- **Primary Domain:** `https://restoricon.com` (custom domain via `CNAME`, GitHub Pages hosting, HTTPS enforced)
- **Repository:** `https://github.com/Ishabdullah/Restoricon.git`
- **Contact:** Phone `(860) 337-1820`, Email `contact@restoricon.com`
- **Design Palette:** CSS custom properties in `style.css` (`--navy: #0A192F`, `--charcoal: #1E293B`, `--bronze: #D4AF37`, `--offwhite: #F8FAFC`).

## 2. Actual Directory Structure (verified against repo, not aspirational)
```text
restoricon/
├── QWEN.md                  # This file — architecture & context memory
├── index.html                # Single-page site: ALL content lives here (hero, services,
│                              #   subcontractors, about, FAQ, homeowner contract, contact, modals)
├── style.css                  # Single global stylesheet
├── script.js                  # Single global script (nav, modals, form handlers, footer year)
├── sitemap.xml / robots.txt   # SEO crawl files (root, GitHub Pages compatible)
├── llms.txt / llms-full.txt   # AI-assistant-facing site descriptions
├── CNAME                      # restoricon.com
└── assets/
    ├── documents/            # Tracked: Restoricon_Home_Improvement_Contract.docx,
    │                          #   Subcontractor_MSA.docx (both linked as download CTAs in index.html)
    │                          # Untracked/gitignored: *_Final.docx, *_Updated.docx, extracted/, *.py helper scripts
    ├── images/                # Currently empty — no project photos exist yet
    └── logos/
        └── restoricon-logo.png  # Used as favicon AND hero image (single asset, dual purpose)
```

**There is no `pages/` directory and no multi-page routing.** This is one HTML file with in-page anchor navigation (`#services`, `#about`, `#contact`, etc.), not a multi-page site.

## 3. Path Rules
Everything is relative to the single root: `style.css`, `script.js`, and `assets/...` are all referenced directly (no `../` needed anywhere, since there are no subpages).

## 4. Key Interactive Components & Logic
- **Forms submit via `mailto:`, not a server or third-party form service.** `script.js` builds a `mailto:contact@restoricon.com` link from form field values and redirects the browser to it (`window.location.href`) — this opens the visitor's local email client with a pre-filled draft. There is no Formspree, no AJAX POST, and no backend. (Known limitation: silently fails if the visitor has no configured mail client — flagged as a conversion-risk recommendation, not yet changed.)
- **Three forms, all using this pattern:** `#contactForm` (homeowner/subcontractor toggle via radio buttons), `#subcontractorForm` (multi-section onboarding with compliance checklist), `#preClaimForm` (free pre-claim damage estimate request).
- **Modals:** `#subcontractorModal`, `#agreementModal` (nested, opened from within the subcontractor modal), `#preClaimModal` — all controlled via a single delegated click handler in `script.js`, toggling `display: block/none` on `.modal-overlay` elements. Closed via close button, backdrop click, or Escape key.
- **Services Grid (6 cards):**
  1. Full Home Remodeling & Additions
  2. Kitchen & Bathroom Renovations
  3. Interior & Exterior Finishes
  4. Structural Repairs & Framing
  5. Project Management & Permitting
  6. Pre-Claim Construction & Repair Estimate (opens its own detailed modal with a 5-step process + compliance disclosures)

## 5. Known Gaps (do not fabricate to fill these — ask the business owner)
- No street address (service-area business — Connecticut / Hartford County described generally, no towns claimed as service area except in form placeholder text).
- No CT HIC license number given (site self-describes as "a licensed General Contractor (CT HIC)" without a number).
- No real social media profile URLs.
- No project photos (`assets/images/` is empty), no testimonials, no reviews, no years-in-business figure.

## 6. Deployment & Git Standards
- Stage specific files by name; avoid blind `git add -A` if untracked scratch/generated files may be present (e.g. `assets/documents/*.py`, `extracted/`, `verify_final/` are gitignored on purpose).
- Keep changes modular across `index.html`, `style.css`, `script.js`.
- Maintain clean, descriptive commit messages.
