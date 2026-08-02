# RESTORICON, LLC — PROJECT ARCHITECTURE & CONTEXT

## 1. Executive Summary & Brand Identity
- **Company Name:** Restoricon, LLC
- **Primary Domain/Hosting:** GitHub Pages (`https://ishabdullah.github.io/Restoricon/`)
- **Repository:** `https://github.com/Ishabdullah/Restoricon.git`
- **Contact Email:** `restoricon@gmail.com`
- **Design Palette:** Custom CSS properties (`--navy: #0A192F`, `--charcoal: #1E293B`, `--bronze: #C5A059`, `--offwhite: #F8FAFC`).

## 2. Directory Tree & File Map
```text
restoricon/
├── QWEN.md                 # Project architecture & context memory file
├── index.html              # Main landing page & single-page application entry point
├── style.css               # Centralized semantic stylesheet (Flexbox/Grid, media queries)
├── script.js              # Centralized JavaScript interactivity (forms, modals, nav)
├── assets/
│   ├── documents/         # Static MSA agreements, contracts, and templates
│   ├── images/            # Project photos and background visuals
│   └── logos/
│       └── restoricon-logo.png # High-res brand logo (constrained max-width)
└── pages/                  # Multi-page routing sub-directory
    ├── about.html          # Extended company vision & leadership details
    ├── contact.html        # Primary contact page with form validation
    └── services.html       # Full service breakdown (6 core offerings)
```

## 3. Critical Structural & Relative Path Rules
- **Root Page (index.html):** References scripts as `<script src="script.js" defer></script>` and assets as `assets/....`
- **Subpages (pages/*.html):** MUST reference assets and scripts with relative root steps:
  - Scripts: `<script src="../script.js" defer></script>`
  - Styles: `<link rel="stylesheet" href="../style.css">`
  - Root links: `../index.html`
  - Peer page links: `services.html`, `about.html`, `contact.html`

## 4. Key Interactive Components & Logic
- **Subcontractor Onboarding Modal:** Triggered via `#subcontractorModal` buttons in `script.js`. Handles license verification toggles, MSA preview/downloads, and Formspree AJAX posting.
- **Contact Form Submission:** Handles `#contactForm` via `fetch()` to Formspree endpoint (targeting `restoricon@gmail.com`).
- **Services Grid (6 Core Cards):**
  1. Full Home Remodeling & Additions
  2. Kitchen & Bathroom Renovations
  3. Interior & Exterior Finishes
  4. Structural Repairs & Framing
  5. Project Management & Permitting
  6. Pre-Claim Construction & Repair Estimate (New 6th card)

## 5. Deployment & Git Standards
- Always stage all project directories using `git add -A`.
- Keep changes modular across `index.html`, `style.css`, `script.js`, and `pages/`.
- Maintain clean, descriptive commit messages.
- Save this file as `/data/data/com.termux/files/home/restoricon/QWEN.md`, then commit and push it to GitHub:
```bash
git add QWEN.md
git commit -m "Created QWEN.md context memory file for project architecture"
git push origin main
```