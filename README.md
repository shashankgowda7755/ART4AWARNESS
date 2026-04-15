# Awareness by Art — National Student Art Platform

A fully functional, CSR-funded student art competition platform for students aged 6–17 across India. Built as a static web app (HTML + CSS + vanilla JS) with a full user portal and admin panel.

## Features

### Public Site
- **Home** — Hero carousel, impact stats, upcoming competitions, dream generator, winners gallery, categories, prizes, FAQ, Instagram feed
- **Events & Calendar** — Full monthly calendar with event dots, filter tabs, event detail popups
- **Results** — Past winners with filters
- **Gallery** — Student artworks with filters (category, theme, age group)
- **Organization** — CSR partnership info, how it works, benefits, financial model, jury
- **About Us** — Mission, achievements, NEP 2020 alignment, DPDP compliance
- **Contact** — Contact form + info cards

### User Portal
- Email/password signup and login (hashed password, email validation, strength check)
- Social login (Google / Facebook — unique per-provider accounts)
- Artwork submission wizard (4 steps: personal info → event → upload → acknowledgement)
- Dashboard with:
  - Overview stats (submissions, results declared, trees funded)
  - My Submissions table with result status
  - Results & Certificates tab (certificates only available after results declared)
  - Profile editing

### Admin Panel (`admin.html`)
- Secure admin login (separate from user auth)
- **Dashboard** — Platform stats, recent submissions, pending actions
- **Submissions** — All submissions across all users with search + filters (All/Pending/Winners/Participated). Per-row actions: Declare Winner, Declare Participated, Reset, Delete
- **Declare Results** — Event-based bulk view: select any event (even without submissions), see summary stats, declare individual or bulk results
- **Users** — All registered users with submission counts and result breakdown
- **Events** — View, add, edit, delete custom events. Admin events automatically sync to the main site

## Technical Stack

- **Pure HTML + CSS + Vanilla JS** — no frameworks, no build step
- **localStorage** — for all persistent data (users, submissions, events, sessions)
- **Canvas API** — for certificate PNG generation
- **SPA pattern** — hash-based router

## File Structure

```
/
├── index.html          # Main public site shell
├── admin.html          # Admin panel shell
├── css/
│   └── style.css       # Full design system
├── js/
│   ├── data.js         # Mock data + AUTH helper
│   ├── app.js          # Router, auth, modals, registration, certificates
│   ├── pages.js        # All page renderers for the main site
│   └── admin.js        # Admin panel logic
└── assets/             # Banner images
```

## Getting Started

1. Clone this repo
2. Serve the directory with any static server:
   ```bash
   python3 -m http.server 8090
   ```
3. Open `http://localhost:8090` for the main site
4. Open `http://localhost:8090/admin.html` for the admin panel

## Admin Credentials

- **Email:** `admin@awarenessbyart.in`
- **Password:** `admin123`

## End-to-End Flow

1. **Admin** creates a new competition in the Events tab of the admin panel.
2. **User** visits the main site, sees the new event on the home page and in the registration wizard.
3. **User** signs up, submits artwork, and sees an acknowledgement screen with their uploaded image (no certificate yet).
4. **Admin** goes to "Declare Results," selects the event, and marks each submission as Winner or Participated.
5. **User** refreshes their dashboard → Results tab → now sees their result and can download their participation/winner certificate as a PNG.

## Design

- Color palette: deep teal primary (#2E6B7A), navy (#0D2137), warm gold (#C5A028)
- Typography: Outfit (headings), Inter (body)
- Glassmorphism cards, subtle gradients, responsive layouts
- Full keyboard accessibility, focus-visible styles, prefers-reduced-motion support

## Compliance

- **DPDP Act 2023** — teacher-mediated model, minimal data collection, clear IP licensing
- **NEP 2020 aligned** — monthly themes support art integration in school curricula
- **CSR-eligible** — qualifies under Schedule VII clauses (ii), (iv), (v) of the Companies Act 2013

## License

Proprietary — all content and code © Awareness by Art.
