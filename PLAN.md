# Plan

> Last updated: 2026-02-13
> Status: In progress — site is live, iterating on refinements

## Objective

Redesign good-ship.co.uk as a single-page HTML site that communicates what The Good Ship does, showcases Tom's tools and frameworks, and makes it easy for potential collaborators to get in touch. It should feel warm, principled, slightly unconventional, deeply competent. "Thoughtful Cartography" aesthetic — nautical-cartographic theme, hand-drawn SVGs, considered typography.

See `good-ship-redesign-plan.md` for the full design brief.

## Approach

- Single HTML file (`index.html`) — all CSS and JS inline
- No framework dependencies
- Google Fonts: Fraunces (display), DM Sans (body), JetBrains Mono (accents)
- Navy/cream/teal/amber colour palette
- Inline SVGs throughout, hand-drawn/etched style
- CSS-first animations, Intersection Observer for scroll reveals
- Plausible Analytics (no cookies)
- Hosted on Netlify with Netlify Forms for signup

## Tasks

### Build (complete)

- [x] Scaffold semantic HTML structure
- [x] Typography & base styles — CSS custom properties, fluid `clamp()` sizing
- [x] Create inline SVG illustrations — hero compass rose, service icons, tool icons, framework icons
- [x] Hero section — compass rose animation, tagline, intro
- [x] About section — Tom's story, Data for Action legacy, client list
- [x] Services section — 6 card grid with SVG icons
- [x] Tools section — external-linking cards (Open Recs, The List, Map My Patch, Q4A, llmstxt.social, Flowlance, TechFreedom)
- [x] Frameworks section — downloadable PDFs with icons
- [x] Writing section — blog link to tomcw.xyz
- [x] Contact & footer — Netlify signup form, email, cal.com booking
- [x] Scroll animations — Intersection Observer, staggered reveals
- [x] Responsive — hamburger nav, fluid grid, all breakpoints
- [x] Favicon (SVG)
- [x] Plausible Analytics script

### SEO & deployment (complete)

- [x] OG/Twitter card meta tags
- [x] JSON-LD structured data
- [x] Sitemap, robots.txt
- [x] llms.txt for AI readability
- [x] OG image (og-image.html → og-image.png)

### Content updates (complete)

- [x] Replace "charities and VCSE" with "social purpose" throughout
- [x] Refine copy — data service title, about section, resilience wording
- [x] Reorder services and strengthen data themes
- [x] Add TechFreedom card with "Launching Soon" badge and link
- [x] Remove phone number, add Netlify signup form

### Remaining work

- [ ] Accessibility audit — contrast, focus styles, reduced motion, heading hierarchy, ARIA
- [ ] RSS blog integration — client-side fetch from tomcw.xyz/feed (Option A from plan)
- [ ] Add Collaboration Spectrum PDF to `frameworks/`
- [ ] Add Organisational Resilience Toolkit PDF to `frameworks/`
- [ ] Performance/Lighthouse audit — target 95+
- [ ] Photography — add Tom's headshot when available
- [ ] Review and polish — spacing, micro-interactions, final SVG animations

## Decisions Made

| Decision | Rationale | Date |
|----------|-----------|------|
| Single HTML file, all inline | No build step, simple deployment, fits the project's ethos | pre-build |
| "Social purpose" not "charities and VCSE" | Broader audience: charities, social enterprises, B Corps, public sector | pre-build |
| Plausible Analytics | Lightweight, no cookies, no GDPR banner | pre-build |
| Netlify Forms for signup | No backend needed, integrates with hosting | 2026-02-12 |
| Phone number removed | Replaced with Netlify signup form | 2026-02-12 |
| TechFreedom as Tools card with "Launching Soon" | Visible but clearly not yet available | 2026-02-12 |
| RSS Option A (client-side fetch) | Keeps site static, auto-updates, tiny JS footprint | pre-build |
| PDFs as placeholder links initially | Real URLs added as PDFs become available | pre-build |
| OG image generated from HTML template | Reproducible, on-brand, no external design tool needed | 2026-02-12 |

## Open Questions

- [ ] CORS on tomcw.xyz RSS feed — needs testing before building client-side fetch
- [ ] Collaboration Spectrum & Resilience Toolkit PDFs — do these exist yet?
- [ ] Tom's headshot — when will it be available?
- [ ] cal.com URL — currently placeholder, needs confirming

## Out of Scope

- Multi-page site or SPA framework
- CMS or blog on this domain (blog stays at tomcw.xyz)
- Backend/server-side anything
- Cookie consent (Plausible is cookieless)
- Testimonials section (no testimonials collected yet)

<!--
Update this file as work progresses. Tell Claude:
"Update PLAN.md to reflect what we just did, then continue with the next task."
-->
