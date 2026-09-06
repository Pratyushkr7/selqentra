# Selqentra — one-page site

Supplier Ground Truth Audit. Vite + React + TypeScript. Motion lives inside individual modules: a Three.js records→matrix module in the hero (custom GLSL points), an SVG evidence diagram scrubbed by GSAP ScrollTrigger beside the six verification steps, CSS-driven comparison cards and product previews. Lenis for smooth scroll.

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
| `VITE_PILOT_LINK` | Optional payment or booking link (Razorpay page, Wise request, Cal.com). | Not yet surfaced in the UI — reserved for a "pay now" step after scope is confirmed. |
| `VITE_SAMPLE_URL` | Optional hosted sample audit file. | "Inspect a sample audit" scrolls to the on-page sample until set. |

`npm run build:preview` builds without the address for local layout checks only; it must not be deployed.

## How the primary call to action works
Every "Start a pilot" button scrolls to the on-page intake. Six answers become a structured scoping brief which opens in the visitor's own mail client, addressed and filled in — nothing is stored or transmitted by the site itself. If the mail client does not open, the composed brief is shown with a copy button and the address. A "what happens next" list beside the form removes the second dead end: what happens after you send.

Without JavaScript the page still shows the offer and a direct mailto (the address is injected at build time into `index.html`). If WebGL is unavailable, fails to initialise, or the GPU context is lost, the panel falls back to a static SVG of the resolved matrix.

## Architecture
- `src/scene/HeroMatrix.tsx` — the only WebGL on the page: thirty records scatter → settle into a 6×5 verified matrix, once, when the module enters view. Falls back to `Fallback.tsx` (static SVG) on WebGL failure, context loss, or reduced motion.
- `src/sections/EvidenceDiagram.tsx` — an SVG diagram with six states (identities merge, unsupported drop away, manufacturer vs trader lanes, evidence links resolve, one source goes stale, confidence rings fill), scrubbed by ScrollTrigger against the steps column. Reduced motion shows the resolved state.
- `src/sections/` — nine DOM sections with varied compositions: centred hero, full-width statement, comparison cards, evidence diagram + steps, sample-audit module, product cards, commercial card, fit, method, intake.
- `src/content/` — all copy and the fictional sample dataset as structured data.

## Colour system
Black `#070706` · Charcoal `#151311` · Porcelain `#F3F0E9` · Grey `#9C968E` · Orange `#FF5900` · Ember `#351309`. Orange is the single signal colour: verified states, key lines, selected rows, important data points and the primary action. Unsupported states are grey and struck through; "needs review" is an orange outline. No blue, violet or cyan anywhere.

## Performance decisions
- DPR capped at 1.5 desktop, 1.0 mobile. Thirty points, no post-processing, `low-power` GPU preference. Camera distance adapts to the module's aspect so all six columns fit on a phone.
- Scene is lazy-loaded after idle; the fallback SVG ships in the initial bundle so first paint never waits on Three.
- Rendering pauses on `visibilitychange` and when the canvas leaves the viewport. No depth of field. Fonts self-hosted and preloaded; no layout shift from type.
- The hero module renders only while it is on screen and the tab is visible.

## Accessibility
Semantic sections with labelled headings; visible ultraviolet focus ring; the sample table is keyboard-operable (↑↓ rows, Enter opens the evidence trail, filters are real toggle buttons with `aria-pressed`); status is conveyed by text tags as well as colour; the canvas is `aria-hidden` behind a labelled `aside`; reduced motion removes all animation.

## Content integrity
All six sample records, every evidence line, and every figure in the deliverable previews are fictional and labelled as such on the page. No real company is described. No third-party assets, screenshots, copy, data or claims are included in this repository.
