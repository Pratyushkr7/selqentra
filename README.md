# Selqentra — one-page site

Supplier landscape intelligence for chemicals: who actually makes a product, classified as manufacturer, distributor or trader on evidence. Vite + React + TypeScript. The centrepiece is a five-stage scroll-driven walkthrough (product brief → global trade flows → producers by country → classification → Verified Source Map) built in SVG and driven by GSAP ScrollTrigger, with three switchable sample briefs. Lenis for smooth scroll. No WebGL.

## Run
```
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks, then builds to dist/
npm run preview    # serves dist/ on :4173
npm run lint       # eslint + strict TypeScript
npm run verify     # headless Chromium pass: console errors, overflow, WebGL/fallback, filters, keyboard, mobile (needs `npm i -D playwright`)
```

## Connect before deploying — environment variables
Copy `.env.example` to `.env.local`, or set these in the host's environment panel (Vercel → Project → Settings → Environment Variables).

| Variable | Purpose | Behaviour |
|---|---|---|
| `VITE_CONTACT_EMAIL` | **Required.** A personal address, never an employer address. | `npm run build` refuses to produce a production build without a valid address, so the site can never ship with a call to action that leads nowhere. |
| `VITE_BOOKING_URL` | Optional scheduling link (Cal.com, Calendly). | "Book a free pilot" opens it when set; otherwise it opens the on-page product brief, which composes an email. |

`npm run build:preview` builds without the address for local layout checks only; it must not be deployed.

## How the primary call to action works
"Book a free pilot" opens the scheduling link when one is configured; otherwise it scrolls to the product brief. The brief (product, CAS, application, grade/form, properties, volume, delivery location, current source type) becomes an email in the visitor's own mail client, addressed and filled in — nothing is stored or transmitted by the site itself; the visitor attaches SDS/TDS there. If the mail client does not open, the composed brief is shown with a copy button and the address. A "what happens next" list beside the form removes the second dead end: what happens after you send.

Without JavaScript the page still shows the offer and a direct mailto (the address is injected at build time into `index.html`). If WebGL is unavailable, fails to initialise, or the GPU context is lost, the panel falls back to a static SVG of the resolved matrix.

## Architecture
- `src/sections/Walkthrough.tsx` — the walkthrough. One SVG (graticule map with country nodes, arcs to the delivery location, producer nodes, classification lanes) plus DOM overlays (brief card, stage card, result card). A single GSAP timeline is scrubbed by ScrollTrigger across a tall container; the module itself is `position: sticky`. Switching the sample brief rebuilds the timeline. Reduced motion shows the resolved state.
- `src/content/briefs.ts` — the three sample briefs. Products are real chemical classes; buyers, volumes, export shares and producer counts are illustrative and labelled so on the page. No real company is named.
- `src/sections/` — centred hero, walkthrough, statement + three role cards + eight "why lists mislead" cards, sample landscape table (fictional), three output cards, free-pilot card, fit, method, brief + what-happens-next.
- `src/content/copy.ts`, `src/content/sample.ts` — all copy and the fictional sample as structured data.

## Colour system
Black `#070706` · Charcoal `#151311` · Porcelain `#F3F0E9` · Grey `#9C968E` · Orange `#FF5900` · Ember `#351309`. Orange is the single signal colour: manufacturers, verified states, key lines, selected rows and the primary action. Distributors are porcelain, traders grey. Ember tints give the walkthrough and the manufacturer card depth. No blue, violet or cyan anywhere.

## Performance decisions
- No WebGL. One SVG and a handful of DOM overlays; GSAP tweens attributes and opacity only.
- Rendering pauses on `visibilitychange` and when the canvas leaves the viewport. No depth of field. Fonts self-hosted and preloaded; no layout shift from type.
- Parallax on the walkthrough layers responds to fine pointers only.

## Accessibility
Semantic sections with labelled headings; visible ultraviolet focus ring; the sample table is keyboard-operable (↑↓ rows, Enter opens the evidence trail, filters are real toggle buttons with `aria-pressed`); status is conveyed by text tags as well as colour; the canvas is `aria-hidden` behind a labelled `aside`; reduced motion removes all animation.

## Content integrity
All six sample records, every evidence line, and every figure in the deliverable previews are fictional and labelled as such on the page. No real company is described. No third-party assets, screenshots, copy, data or claims are included in this repository.
