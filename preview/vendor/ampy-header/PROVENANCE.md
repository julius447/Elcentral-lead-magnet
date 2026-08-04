# Vendored: the real Ampy header/menu — QA ONLY

`styles.css` and `engine.js` are **verbatim copies** of Ampy's approved, iOS-hardened header
delivery. `markup.html` is the `.ampy-hdr-root` subtree lifted from that delivery's own
parity-verified preview.

**Source:** `~/Desktop/Website-blocks-git/Header/delivery/fluentsnippets/` (+ `delivery/preview/index.html`)
**Copied:** 2026-08-03, for `preview/block-qa-context.html`

## Why this exists

The owner asked to see the Elcentral-kollen block with Ampy's actual menu on top, "framförallt
för mobilen", to confirm the menu does not break the block's design or animations. The QA rig
previously used a hand-made `.sim-hdr` placeholder, which cannot answer that question: the real
menu is `position: fixed`, opens three mega panels and a mobile drawer, dims the page, and
**locks body scroll** — all of which can collide with a block that does its own scroll alignment.

## This is NOT part of the block delivery

`preview/block.html` — the file Chris gets — contains only the block, per owner directive.
Nothing here ships with the Elcentral-kollen snippets. Do not import from this folder into
`assets/`.

## Two deviations from the source, both deliberate

1. **Fonts.** The delivery's `@font-face` rules point at `/wp-content/uploads/ampy-fonts/*.woff2`.
   Verified against ampy.se on 2026-08-03: **all six 404** — they have not been uploaded yet.
   The delivery's own preview solved this with Google Fonts, which breaks this repo's invariant 5
   (no Google Fonts, GDPR). The QA rig instead re-points Outfit at this repo's self-hosted variable
   font in `assets/fonts/`. Weights therefore come off one variable file rather than six static
   cuts, so weight rendering is close but not byte-identical to production.
2. **Images and the logo** load from their real `https://ampy.se/wp-content/uploads/` URLs, exactly
   as the delivery does. Nothing is redrawn or invented.

## Numbers worth knowing when reading the rig

- `--header-h`: **76px**, dropping to **66px** at `max-width: 992px`, where the nav is replaced by
  the burger. `body { padding-top }` switches at the same 992px.
- z-index: `.hdr` 100 · `.drawer` 95 · `.mega` 90 · `.dim` 60. The block declares none of its own
  at this level, and its sticky verdict CTA is disabled in block mode.
- `body.aph-open { overflow: hidden }` is the drawer's scroll lock; the engine also position-fixes
  the body on iOS.
