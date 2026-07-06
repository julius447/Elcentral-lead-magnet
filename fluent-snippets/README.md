# Elcentral-kollen — Fluent Snippets build (1:1 of the tool)

**Reader: Chris.** This folder is the same Elcentral-kollen tool, repackaged from a WordPress
*plugin* into **three snippets** you paste into **FluentSnippets** and drop into a Bricks page.
The design and behaviour are unchanged — this is a **repackaging only**, a verified 1:1 of the
plugin at `v2.16.5`. It is built the same way as the Elkollen Fluent Snippets port, so both tools
deploy identically.

## The three files

| File | FluentSnippets type | What it is |
|---|---|---|
| `ampy-elcentral-kollen.css` | **CSS** | The full stylesheet, **format-ported**: every `rem` → `px` (1rem = 10px) so it renders identically without a `62.5%` root, plus a zero-specificity theme-hardening reset. No design value changed. |
| `ampy-elcentral-kollen.php` | **PHP** | Registers the `[elcentralkollen]` shortcode → the mount, a crawlable SEO fallback, and the tool **data** (as `window.AmpyEC.data`). |
| `ampy-elcentral-kollen.js` | **JS** | The engine + wizard, **byte-identical** to the plugin's JS (reads the data the PHP injected). |
| `fonts/` | — | The 4 self-hosted `woff2` files. See Fonts. |
| `_selftest.html`, `_build/` | — | Dev only: open `_selftest.html` in a browser to see the tool render locally; `_build/build.py` regenerates the three files from the plugin source. Neither ships to WordPress. |

**How it works:** the PHP shortcode prints `<div class="ampy-ec">` + a `<script>` that sets
`window.AmpyEC.data`. The JS snippet (byte-identical to the plugin) boots on `DOMContentLoaded`,
finds that div, reads the data, and renders. The CSS styles it. No build step, no external API,
no data file to host.

## Why the CSS was rem→px converted (important — this is the robustness fix)

The plugin sized everything in `rem` and set a global `html { font-size: 62.5% }` (so `1rem = 10px`).
Pasted into a theme as a site-wide CSS snippet, that global rule would **resize the whole
WordPress/Bricks site**, and our `rem` sizes would silently break if the theme's root font-size
isn't 62.5%. So the build converts every `rem` to the exact `px` it resolved to (`1rem = 10px`) and
drops the global `html` rule. The tool now renders at **absolute pixel sizes, independent of the
theme** — pixel-identical to the plugin, on any site. (Verified: at a default 16px root the rail
heading is 44px, bullets 15px, rail column 500px — exactly the plugin's values.)

## Install (≈5 minutes)

1. **CSS snippet** — FluentSnippets → New → **CSS**. Paste `ampy-elcentral-kollen.css`. Run: *Everywhere* (or the page). Save + activate.
2. **PHP snippet** — New → **PHP** (Functions). Paste `ampy-elcentral-kollen.php`. **Test on staging (`php -l`) first** — a PHP error white-screens the site. Save + activate.
3. **JS snippet** — New → **JS**. Paste `ampy-elcentral-kollen.js`. Run: *Everywhere* (or the page), footer. Save + activate.
4. **Place the tool** — on the Bricks page, add a **Shortcode** element containing exactly:
   ```
   [elcentralkollen]
   ```
   Do **not** add a separate heading above it — the tool renders its own `<h1>` in the left rail.
5. *(Optional, for a pixel-match of the surrounding canvas)* set the Bricks section background to
   `radial-gradient(130% 90% at 50% -10%, #fbfcff 0%, #f3f5fb 55%, #eceef6 100%)`.

Load the page on desktop + mobile — it should be pixel-identical to
https://julius447.github.io/Elcentral-lead-magnet/ .

## Fonts (one setup step — matters for the look and for GDPR)

The `@font-face` rules point to the woff2 on GitHub Pages, so the tool renders in the correct fonts
out of the box (there's a `system-ui` fallback in the font stack if a file is unreachable). **Before
public launch, move the fonts onto ampy.se** (Ampy self-hosts fonts to avoid third-party requests):

1. Upload the 4 files in `fonts/` to the Media Library (or `wp-content/uploads/…`).
2. In the CSS snippet, replace the base URL
   `https://julius447.github.io/Elcentral-lead-magnet/assets/fonts` with your upload path (4 occurrences).

## Changing content or copy later

All text, questions, options, links, CTAs and scoring live in the **data** — the big
`window.AmpyEC.data = { … }` object inside the **PHP snippet** (a `nowdoc` block). It's the same JSON
the plugin used. Edit there and save the snippet; don't hard-code strings anywhere else.

> **Keep it in sync with the repo.** The canonical source is the GitHub repo
> (`github.com/julius447/Elcentral-lead-magnet`). If the tool changes there, run
> `python3 fluent-snippets/_build/build.py` to regenerate these three files — don't hand-edit them
> in two places. If you change scoring weights, keep the repo's `node assets/engine.test.js` green.

## The 1:1 guarantee (how this was verified)

- **CSS:** built from the plugin CSS by a script that only (a) converts `rem`→`px` at 1rem=10px,
  (b) drops the global `html{62.5%}`, (c) makes `@font-face` URLs absolute, (d) prepends a
  `:where()` (zero-specificity) reset. `em`, `vw`, `%`, breakpoints and every color/gradient/weight
  are untouched. A 6-lens agent review + a live render confirmed the rendered result is identical.
- **JS:** byte-identical to the plugin's `assets/elcentralkollen.js` (`diff` clean).
- **Data:** the object embedded in the PHP **deep-equals** the plugin's `data/elcentralkollen-data.json`.
- **PHP:** the shortcode outputs the same mount + crawlable fallback as the plugin's `render.php`.

## Go-live checklist (same gates as the plugin — see the repo README §6)

- [ ] **Lead webhook:** in the PHP data block, `meta.lead_webhook_url` is `null` → the contact form
      **simulates success and drops leads**. Set it to your n8n/Make webhook URL.
- [ ] **Fonts:** move to ampy.se (above) for GDPR.
- [ ] **Analytics:** the tool pushes `ampy_ec_*` events to `window.dataLayer` — wire GTM/GA4 + Meta pixel.
- [ ] **OG image (optional):** enable the OG block in the PHP snippet + set the 1200×630 image URL,
      **or** let your SEO plugin handle social tags (not both → double OG).
- [ ] **`php -l`** the PHP snippet on staging before activating.
- [ ] **Verify** on desktop + mobile 360px: all 7 steps, the akut (bränd lukt) path, the oklart path,
      and a test lead submission reaching your webhook.
