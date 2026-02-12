# The Good Ship — Website Redesign Plan

## 1. Overview

A complete redesign of good-ship.co.uk as a single-page (or minimal multi-section) HTML site, built to be deployed via Claude Code with the Impeccable Style plugin. The site should feel like Tom — warm, principled, slightly unconventional, deeply competent. It should communicate what The Good Ship does, showcase the tools and frameworks Tom has built, and make it easy for potential collaborators to get in touch.

**Current state**: The existing site has placeholder Lorem Ipsum text, outdated references, and limited styling. It needs a ground-up rebuild.

**Key framing shift**: All references should use "social purpose" rather than "charities and VCSE". The audience is anyone working to make the world better — charities, social enterprises, B Corps, community businesses, public sector, and mission-driven private companies.

---

## 2. Brand & Metaphor

### The Ship Metaphor

The Good Ship is a deliberate name. It evokes:

- **Navigation** — charting a course through uncertainty
- **Crew, not passengers** — working alongside organisations, not doing things to them
- **Wayfinding** — not a fixed destination but a considered journey
- **Resilience** — built to weather storms
- **Captain's log** — documentation, reflection, learning openly

The visual identity should lean into maritime/nautical language and imagery **subtly** — not pirate kitsch, not corporate cruise liner. Think: hand-drawn nautical charts, sextants, constellations, horizon lines, compass roses. The aesthetic of careful exploration, not adventure tourism.

### Blending With Tom's Work

Tom's work spans systems thinking, organisational resilience, AI strategy, data storytelling, facilitation, open infrastructure, and tool-building. The site should feel like it belongs to someone who:

- Builds things (a maker, not just an advisor)
- Works in the open (transparency as a principle)
- Cares more about doing good work than scaling a business
- Is technically proficient but communicates simply
- Uses metaphors well (gardens, ships, weather, seeds)

---

## 3. Aesthetic Direction

**Theme**: "Thoughtful Cartography" — the feeling of a well-made chart or a hand-annotated map. Warm, precise, slightly weathered, deeply considered.

### Typography
- **Display/Headings**: A distinctive serif with character — consider **Fraunces** (warm, slightly wonky), **Lora** (elegant, editorial), or **Crimson Pro** (classic, readable). Something that says "considered" not "corporate"
- **Body**: A humanist sans-serif — **DM Sans**, **Outfit**, or **Source Sans 3**. Clean but warm
- **Accent/Navigation**: Could use a monospace for labels and small UI elements — **JetBrains Mono** or **IBM Plex Mono** — to suggest the technical/builder side

### Colour Palette
- **Deep navy** (`#1B2A4A`) — primary text and backgrounds. The colour of deep water
- **Warm cream/parchment** (`#F5F0E8`) — primary light background. Aged paper
- **Teal/sea green** (`#2D8B7A`) — primary accent. Active water, growth
- **Warm amber/gold** (`#D4993D`) — secondary accent. Brass, compass needles, warmth
- **Soft grey-blue** (`#8BA4B8`) — tertiary. Mist, horizon, secondary text
- **Coral/rust** (`#C75B3A`) — sparingly, for emphasis or alerts

### SVG Illustrations

Custom inline SVGs throughout, matching the nautical-cartographic theme. These should feel hand-drawn or etched, not polished vector art. Suggested illustrations:

1. **Hero**: A compass rose or stylised ship's wheel — clean, geometric, with subtle animation
2. **Services/What We Do**: Icons for each service area:
   - Organisational Resilience → compass/sextant
   - AI & Technology Strategy → constellation/star chart
   - Data & Insight → telescope/spyglass
   - Learning & Coaching → lighthouse
   - Facilitation → anchor (grounding conversations)
   - Open Infrastructure → ship's blueprint/rigging diagram
3. **Tools section**: Each tool gets a small illustrative icon:
   - Open Recommendations → open book/scroll
   - Flowlance → flowing current/tide
   - llmstxt.social → signal flag
   - Map My Patch → map with drawn boundary
   - The List → ship's log/manifest
   - Questions for Action → compass needle
4. **Frameworks section**: Garden/organic illustrations for facilitation tools:
   - Garden of Ideas → seeds/sprouts
   - Theory of Change → path/journey
   - Principles of Good Data → measuring instruments
5. **Section dividers**: Wave lines, horizon lines, subtle rope knots — SVG patterns that break up sections with character

### Motion & Interaction
- Gentle parallax on the hero illustration
- Tools cards with subtle hover effects (slight lift, shadow shift)
- SVG illustrations with CSS animation — compass needle that settles, lighthouse beam that sweeps slowly
- Smooth scroll-linked fade-ins using Intersection Observer
- `prefers-reduced-motion` respected throughout

### Layout
- Full-width hero with generous whitespace
- Content sections alternating between full-width atmospheric backgrounds and constrained-width (~720px) editorial text
- Tools grid: responsive cards, 2-3 columns on desktop, stacking on mobile
- Frameworks section: horizontal scroll or accordion for the downloadable resources
- Footer: warm, personal, not corporate

---

## 4. Page Structure

```
┌─────────────────────────────────────────────────┐
│ NAVIGATION BAR                                  │
│ The Good Ship [logo/wordmark]                   │
│ Anchor links: About | What We Do | Tools |      │
│               Frameworks | Writing | Contact     │
├─────────────────────────────────────────────────┤
│ HERO                                            │
│                                                 │
│ SVG: Compass rose or ship illustration          │
│                                                 │
│ "The Good Ship"                                 │
│ Strategy, technology, and resilience             │
│ for social purpose organisations                │
│                                                 │
│ Brief intro paragraph about Tom and the work    │
│                                                 │
├─────────────────────────────────────────────────┤
│ ABOUT / WHO WE ARE                              │
│                                                 │
│ The story — who Tom is, what drives him,         │
│ the philosophy of practical over perfect,        │
│ working in the open, principle-led work          │
│                                                 │
│ Data for Action legacy: co-founded with          │
│ Tom Forth in 2023, explored infrastructure       │
│ for social purpose sector, embraced              │
│ uncertainty over certainty. Ended Jan 2026.      │
│ The work continues through The Good Ship         │
│ and the open tools built during DfA              │
│                                                 │
│ Key facts: Based in NE England, working          │
│ globally. Solo consultancy by design.            │
│                                                 │
│ Notable clients/partners (light touch):          │
│ Lloyds Bank Foundation, JRF, ClientEarth,        │
│ Social Tech Trust, Power to Change, NPC,         │
│ Wildlife Trusts, NHSE, Cabinet Office            │
│                                                 │
├─────────────────────────────────────────────────┤
│ WHAT WE DO (Services)                           │
│                                                 │
│ 6 service cards with SVG icons:                  │
│                                                 │
│ 1. Organisational Resilience                     │
│    Frameworks, assessment, strategic planning    │
│    for navigating uncertainty                    │
│                                                 │
│ 2. AI & Technology Strategy                      │
│    Responsible AI adoption, digital sovereignty, │
│    helping orgs think strategically about tech   │
│                                                 │
│ 3. Data & Insight                                │
│    Strategy, storytelling, visualisation,         │
│    minimum viable data standards                 │
│                                                 │
│ 4. Learning Partnerships & Coaching              │
│    One-to-one development, team learning,        │
│    long-term advisory relationships              │
│                                                 │
│ 5. Facilitation & Organisational Design          │
│    Participatory methods, consent-based          │
│    decision making, governance design            │
│                                                 │
│ 6. Open Infrastructure                           │
│    Building shared digital tools for the sector  │
│    (links to Tools section)                      │
│                                                 │
├─────────────────────────────────────────────────┤
│ TOOLS (Digital Products)                        │
│                                                 │
│ "Things I've built"                              │
│ Intro: tools born from real problems             │
│                                                 │
│ Card grid — each with:                           │
│   - SVG icon                                     │
│   - Name + one-line description                  │
│   - External link                                │
│                                                 │
│ ┌──────────────────┐ ┌──────────────────┐       │
│ │ Open             │ │ The List         │       │
│ │ Recommendations  │ │ UK Funding       │       │
│ │ Upload, analyse  │ │ Changes. By      │       │
│ │ & track reports  │ │ fundraisers, for │       │
│ │ across the       │ │ fundraisers.     │       │
│ │ social purpose   │ │ Built with       │       │
│ │ sector           │ │ Jo Jeffery       │       │
│ │ → openrecs.com   │ │ → the-list.uk    │       │
│ └──────────────────┘ └──────────────────┘       │
│ ┌──────────────────┐ ┌──────────────────┐       │
│ │ Map My Patch     │ │ Questions for    │       │
│ │ Combine maps &   │ │ Action           │       │
│ │ questions to     │ │ Prioritise your  │       │
│ │ understand your  │ │ most important   │       │
│ │ neighbourhoods   │ │ questions,       │       │
│ │                  │ │ individually or  │       │
│ │ → mapmypatch     │ │ collaboratively  │       │
│ │   .co.uk         │ │ → questionsfor   │       │
│ └──────────────────┘ │   action.com     │       │
│ ┌──────────────────┐ └──────────────────┘       │
│ │ llmstxt.social   │ ┌──────────────────┐       │
│ │ AI-readable      │ │ Flowlance        │       │
│ │ documentation    │ │ AI-powered       │       │
│ │ for social       │ │ finance, project │       │
│ │ purpose orgs.    │ │ & proposal       │       │
│ │ Be seen by AI    │ │ management for   │       │
│ │ → llmstxt.social │ │ freelancers      │       │
│ └──────────────────┘ │ → flowlance.io   │       │
│                      └──────────────────┘       │
│                                                 │
├─────────────────────────────────────────────────┤
│ FRAMEWORKS & RESOURCES                          │
│                                                 │
│ "Frameworks & facilitation tools"               │
│ Intro: practical tools shared openly            │
│                                                 │
│ Downloadable resources (PDF/slides links):       │
│                                                 │
│ 🌱 Garden of Ideas                               │
│    A facilitation device using organic           │
│    metaphors. Plant, compost, save seeds.        │
│    [Download PDF] [View slides]                  │
│                                                 │
│ 🌊 Theory of Change — Demystified               │
│    Simple metaphors (journey, ripple, seed)      │
│    to make theory of change accessible           │
│    [Download slides]                             │
│                                                 │
│ 📊 Principles of Good Data                       │
│    A framework for thinking about data           │
│    in social purpose organisations               │
│    [Download PDF]                                │
│                                                 │
│ 🧭 Organisational Resilience Toolkit             │
│    Purpose, Money, People — nine principles      │
│    for navigating uncertainty                    │
│    [Download PDF]                                │
│                                                 │
│ 🤝 Collaboration Spectrum                        │
│    From networking to integrating —              │
│    mapping how organisations work together       │
│    [Download slides]                             │
│                                                 │
│ (All shared under Creative Commons licensing)    │
│                                                 │
├─────────────────────────────────────────────────┤
│ WRITING                                         │
│                                                 │
│ "Thinking out loud"                              │
│ Brief note about writing openly                  │
│                                                 │
│ Link to blog: tomcw.xyz                          │
│ Highlight 2-3 recent/key posts if possible       │
│                                                 │
├─────────────────────────────────────────────────┤
│ CONTACT / LET'S TALK                            │
│                                                 │
│ Warm, personal closing. Not a sales pitch.       │
│                                                 │
│ Three clear CTAs:                                │
│                                                 │
│ [Book a Call]     [Get in Touch]   [Sign Up]     │
│  → cal.com link    → hello@        → email       │
│                    good-ship.co.uk  newsletter    │
│                                                 │
│ Also:                                            │
│ Phone: 07427 654504                              │
│ LinkedIn: Tom Campbell Watson                    │
│ Blog: tomcw.xyz                                  │
│                                                 │
├─────────────────────────────────────────────────┤
│ FOOTER                                          │
│                                                 │
│ © 2026 The Good Ship Ltd                         │
│ Based in North East England, working globally    │
│ All work shared openly where possible            │
│ CC BY-NC where applicable                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 5. Content Notes

### Language & Tone

- **"Social purpose"** throughout — never "charities and VCSE"
- **UK English** — organisation, colour, programme
- **First person** where appropriate — "I" not "we" for personal bits, "The Good Ship" for the entity
- **Honest, direct, warm** — the voice from the blog and the "End of Data for Action" post
- **No jargon without explanation** — but don't dumb down either
- **Brief**. Let the work speak. Don't over-explain

### Key Messages

1. **Practical over perfect** — Tom builds things and tests them, not just advises
2. **Open by default** — tools, frameworks, and thinking shared freely
3. **Principle-led** — values aren't decoration, they're operational
4. **Social purpose focus** — but broad: charities to B Corps to government
5. **Solo by design** — intentionally small, not incidentally
6. **Builder + advisor** — rare combination of making things and helping organisations use them

### Client/Partner References (light touch, no testimonials unless we have them)

Lloyds Bank Foundation, Joseph Rowntree Foundation, ClientEarth, Social Tech Trust (Longitude Prize on Dementia), Power to Change, NPC, SOS, Wildlife Trusts, NHSE, NCSC, MHCLG, Cabinet Office

---

## 6. Technical Spec

### Stack
- **Single HTML file** — all CSS and JS inline
- No framework dependencies
- Google Fonts for typography
- CSS custom properties for theming
- Intersection Observer for scroll animations
- Inline SVGs (no external image files)
- Semantic HTML5

### Performance
- Zero external images (all SVG inline)
- Minimal JS — CSS-first animations
- Fonts loaded with `display: swap`
- Should score 95+ on Lighthouse

### Accessibility
- Proper heading hierarchy
- `prefers-reduced-motion` support
- WCAG AA contrast ratios
- Focusable navigation with visible focus styles
- `aria-label` on SVG illustrations
- Skip-to-content link

### Analytics
- Plausible Analytics — single lightweight script tag (`<script defer data-domain="good-ship.co.uk" src="https://plausible.io/js/script.js"></script>`)
- No cookies, no GDPR banner needed
- ~1KB additional load

### Responsive
- Breakpoints: 480px, 768px, 1024px, 1200px
- Fluid typography with `clamp()`
- Tool cards: 1 col mobile → 2 col tablet → 3 col desktop
- Navigation collapses to hamburger on mobile

---

## 7. SVG Illustration Brief

Each SVG should feel:
- **Hand-drawn** or **etched** — not corporate vector art
- **Single colour + accent** — works with the navy/teal/amber palette
- **Meaningful** — not decorative filler
- **Animated subtly** — CSS keyframes, not heavy JS

### Required SVGs

| Location | Subject | Style Notes |
|----------|---------|-------------|
| Hero | Compass rose or ship's wheel | Large, central, slow rotation animation on needle |
| Nav | Small ship icon (wordmark) | Tiny, simple, distinctive |
| Service: Resilience | Compass/sextant | Precision instrument feel |
| Service: AI & Tech | Constellation | Connected dots, star chart |
| Service: Data | Telescope/spyglass | Looking ahead, seeing clearly |
| Service: Learning | Lighthouse | Steady, reliable, guiding |
| Service: Facilitation | Anchor | Grounding, stability |
| Service: Open Infra | Ship's blueprint | Technical drawing, open |
| Tool: Open Recs | Open book/scroll | Knowledge, documentation |
| Tool: The List | Ship's manifest | Tracking, recording |
| Tool: Map My Patch | Map with boundary | Geography, place |
| Tool: Questions | Compass needle | Direction, priority |
| Tool: llmstxt | Signal flag | Communication, visibility |
| Tool: Flowlance | Flowing current | Movement, cashflow |
| Framework: Garden | Seeds/sprout | Growth, organic |
| Framework: ToC | Path/journey | Direction, progression |
| Framework: Data | Measuring tools | Precision, care |
| Section dividers | Wave/rope patterns | Texture, nautical |

---

## 8. Build Steps

1. **Read Impeccable Style SKILL.md** — understand plugin requirements
2. **Scaffold HTML** — semantic structure with all content sections
3. **Create SVG illustrations** — inline, themed, accessible
4. **Typography & base styles** — fonts, CSS variables, reset
5. **Hero section** — illustration, text, navigation
6. **About section** — editorial layout, client references
7. **Services section** — card grid with SVG icons
8. **Tools section** — external-linking cards with descriptions
9. **Frameworks section** — downloadable resources with icons
10. **Writing section** — blog link, brief intro
11. **Contact & footer** — warm, personal, complete
12. **Scroll animations** — Intersection Observer, staggered reveals
13. **Responsive refinement** — all breakpoints
14. **Accessibility pass** — contrast, focus, motion, semantics
15. **Polish** — micro-interactions, spacing, final SVG animation

---

## 9. Decisions (Resolved)

- ✅ **PDFs/Slides**: Placeholder links for now — will add real URLs later
- ✅ **Blog integration**: RSS feed — see RSS approach below
- ✅ **Domain**: good-ship.co.uk — build locally first
- ✅ **TechFreedom**: Yes, include as upcoming programme (card in Tools with "Coming Soon")
- ✅ **Data for Action**: Yes, mention the legacy and what it became
- ✅ **Photography**: Headshot placeholder for now, Tom will add later
- ✅ **Analytics**: Plausible Analytics
- ✅ **CTAs**: Three actions throughout the site:
  - **Sign up** — email newsletter/updates signup
  - **Contact me** — mailto:hello@good-ship.co.uk
  - **Book a call** — links to cal.com (placeholder URL: https://cal.com/tomcampbellwatson until confirmed)

---

## 9a. RSS Feed Approach — Options for Lightweight Blog Integration

The goal: show 3-5 recent blog posts from tomcw.xyz on the Good Ship site without adding weight or complexity.

### Option A: Client-side fetch (Recommended for lightweight)

**How it works**: A small piece of JavaScript (~20 lines) fetches the RSS feed from tomcw.xyz when a visitor loads the page, parses it, and renders the latest 3-5 post titles with links.

**Pros**:
- Zero build step — the HTML file stays static
- Always shows the latest posts automatically
- Tiny JS footprint (~1KB)
- No server infrastructure needed

**Cons**:
- Depends on tomcw.xyz having CORS headers that allow cross-origin fetch (most blog platforms do, but needs testing)
- Brief flash before posts appear (can be masked with a subtle fade-in)
- If the RSS feed is down, the section shows a fallback "Read the blog →" link

**What it requires**:
- tomcw.xyz must have an RSS feed (likely at `tomcw.xyz/feed/` or `tomcw.xyz/rss.xml`)
- ~20 lines of vanilla JS using `fetch()` and `DOMParser`
- A fallback state in case the feed can't be loaded

### Option B: Build-time static (More reliable, needs occasional rebuild)

**How it works**: A simple script fetches the RSS feed and bakes the latest posts into the HTML at build time. You'd run this script whenever you want to update the displayed posts.

**Pros**:
- Zero JS on the page — pure static HTML
- Fastest possible load
- Works even if tomcw.xyz is down

**Cons**:
- Posts go stale unless you rebuild
- Needs a build step (even if it's just running a script)

### Option C: Just link to it (Simplest)

Show a "Writing" section with a brief description and a prominent link to tomcw.xyz. No dynamic content. Add 3-5 hand-picked post titles as static links.

**Recommendation**: Start with **Option A** (client-side fetch). It keeps the site as a single static HTML file with no build step, adds negligible weight, and means the blog posts are always current. If CORS is an issue, fall back to **Option C** and update manually.

---

## 10. Relationship to TechFreedom

TechFreedom could appear as either:
- A card in the Tools section (with "Coming Soon" badge)
- A brief mention in the Services section under AI & Technology Strategy
- A standalone link in the navigation

Recommend: a card in Tools with a "Coming Soon" badge linking to the TechFreedom landing page once built.

---

*Ready to build. Let's set sail.*
