# Selqentra — one-page site

Supplier Ground Truth Audit. Vite + React + TypeScript, raw Three.js with custom GLSL, GSAP ScrollTrigger, Lenis.

## Run
```
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks, then builds to dist/
npm run preview    # serves dist/ on :4173
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
- `src/scene/` — one persistent WebGL canvas. `Engine.ts` owns renderer, camera rig, bloom; `data.ts` builds the procedural dataset (150 records → 30 survivors, deterministic); `shaders.ts` holds the point / line / plane / node GLSL; `store.ts` is the named-stage state (each stage 0..1) that ScrollTrigger drives.
- `src/hooks/useStage.ts` — binds a DOM section to a scene stage with a scrubbed ScrollTrigger; `useLenis.ts` — Lenis ↔ GSAP ticker ↔ ScrollTrigger per the documented pattern.
- `src/sections/` — nine DOM sections; `src/content/` — all copy and the fictional sample dataset as structured data.
- `src/scene/Fallback.tsx` — static SVG of the resolved matrix. Used when WebGL is unavailable or `prefers-reduced-motion` is set; the page reads identically without WebGL.

## Performance decisions
- DPR capped at 1.5 desktop, 1.0 mobile. 150 records desktop, 90 mobile (survivors always 30). Bloom only on desktop with ≥4 cores and no `deviceMemory ≤ 4`.
- Scene is lazy-loaded after idle; the fallback SVG ships in the initial bundle so first paint never waits on Three.
- Rendering pauses on `visibilitychange` and when the canvas leaves the viewport. No depth of field. Fonts self-hosted and preloaded; no layout shift from type.
- Record positions are computed on the CPU each frame (150 points is trivial) so lines and points can never disagree; shaders handle appearance only.

## Accessibility
Semantic sections with labelled headings; visible ultraviolet focus ring; the sample table is keyboard-operable (↑↓ rows, Enter opens the evidence trail, filters are real toggle buttons with `aria-pressed`); status is conveyed by text tags as well as colour; the canvas is `aria-hidden` behind a labelled `aside`; reduced motion removes all animation.

## Design system notes
Palette as specified. The filled primary button uses a slightly deeper cobalt (`#4262EE`) so white label text clears WCAG AA (4.9:1); the specified `#5577FF` remains the accent for text, lines and states on the dark ground (5:1) and is the button's hover state.

## Content integrity
All six sample records, every evidence line, and every figure in the deliverable previews are fictional and labelled as such on the page. No real company is described. No third-party assets, screenshots, copy, data or claims are included in this repository.
