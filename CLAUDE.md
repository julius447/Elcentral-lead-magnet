# CLAUDE.md — agent guide for Elcentral-kollen

This file orients an AI coding agent (Claude) working in this repo. Human onboarding is in
[`README.md`](README.md). Read both before changing anything.

## What this is

A self-contained WordPress plugin (shortcode `[elcentralkollen]`) that renders a Swedish
lead-generation tool: a homeowner answers **7 tap-only questions** and gets a **two-axis verdict
(_Säker?_ / _Redo?_)** from a calibrated 2×2 matrix. No build step, no npm, no framework — pure PHP
+ vanilla ES6 + CSS. It is a 1:1 visual sibling of Ampy's "Elkollen" tool. Currently at version
`2.16.5`, live on GitHub Pages, shipping-ready as code; remaining work is configuration (README §6).

## The golden rule

> **Everything a human can see or click — copy, questions, options, links, CTAs, scoring weights,
> thresholds, the verdict matrix, the go-live gates — lives in `data/elcentralkollen-data.json`.**
> Do not hard-code UI strings or rules in PHP/JS/CSS. To change wording or behaviour, edit the data
> file. The JS/CSS/PHP are the engine and the chrome; they read the data.

UI strings are **Swedish by design — never translate them.** Code, comments and docs are English.

## Architecture

```
data/elcentralkollen-data.json   →   assets/elcentralkollen.js   →   rendered two-pane tool
   (truth: rules + copy)              ENGINE (pure) + WIZARD            rail (brand) + stage (quiz)
```

- **Engine** (pure functions, exposed on `window.AmpyEC` for the test oracle):
  `computeSafety()` → `computeReady()` → `computeCrossAxis()` → `computeCell()`, wrapped by
  `diagnose(answers, data)` which returns the verdict descriptor `dx` (cell, axis states,
  escalation, findings). **JS-only — there is no PHP scoring twin; do not create one.**
- **Wizard** (`Wizard` class in the same file): renders the start screen, the 7 question slides,
  and the besked (result); tracks `this.answers`; encodes them into the URL as `?q=<vector>`;
  renders + submits the in-tool lead form.
- **PHP shell** (`elcentral-kollen.php` + `includes/render.php`): the shortcode enqueues the
  assets, injects the *entire* data file via `wp_localize_script` as `window.AmpyEC.data` (no second
  HTTP round-trip), prints the mount node `<div class="ampy-ec">` with a crawlable no-JS fallback
  inside (incl. the SEO `<h1>`), and writes dynamic Open Graph tags in `<head>`.
- On boot the JS reads `window.AmpyEC.data` (or, in the standalone preview, fetches the JSON via the
  `data-data-url` attribute), removes the fallback, and renders the wizard.

## Data model (top-level keys of the JSON)

- `meta` — version, page heading/lead, links, the **go-live gates** (`lead_webhook_url`,
  `pdf_webhook_url`, `privacy_policy_url`), the rail content (`rail.bullets`, `rail.contact`), the
  `start` screen copy, the in-tool `lead_form` copy.
- `questions` — the 7 questions (each: `id`, `axis` = safety|ready, `type` = single|multi,
  `title`, `options[]`). **Question/option `id`s and their order are load-bearing** (the `?q=` URL
  vector is index-based, and the engine + oracle key off the ids).
- `state_schema.prefixes` — the one-letter prefix per question id used to build the `?q=` vector.
- `scoring` — weights, thresholds, **floors** (escalation/symptom), uncertainty rules, ready rules,
  pill levels. This is what the oracle verifies.
- `verdict_matrix` — the 2×2 cells (`sr` / `si` / `rs` / `rr`) with their copy, findings logic, CTA wiring.
- `cta_defs` — named CTAs (`radgivning` opens the in-tool lead form via `opens_form:true`; `ring` is
  the akut tel: button; the rest are service-page links).
- `facts` — substantiated claims (e.g. `facts.brand` = the fire statistic), with source links.
- `copy` — shared strings (share text, etc.).

Internal keys prefixed with `_` (e.g. a `_pending_signoff`, `_note`) are stripped server-side by
`ampy_ec_strip_internal()` before the data reaches the client — use that prefix for any dev-only notes.

## Invariants — do not break these

1. **The oracle is law.** `node assets/engine.test.js` must print `ALL GREEN — 15 passed`. It
   asserts the data weights reproduce the signed archetype verdicts and guards three specific bugs
   (warm-outlet must floor to amber; bränd-lukt must be non-green + akut + escalation; ≥2 "Osäker"
   with no real risk must render "Oklart", not amber). **Never change scoring ids/weights/thresholds
   without re-running it — and a real change must be re-signed by an electrician (README §6.4).**
2. **Honesty moat.** The full verdict is always free — never gate it behind an e-mail wall. A
   broken/truncated `?q=` must fall back to the start screen (step 0), never a fabricated "Säker"
   (see `hydrateFromUrl()`: multi answers must be a non-empty array to count as complete).
3. **Swedish UI strings, never translated; no new strings outside the data file.**
4. **No em-dashes in UI copy.** Brand rule — use a regular hyphen or rewrite.
5. **No Google Fonts.** Fonts are self-hosted woff2 (`assets/fonts/`, `@font-face` in the CSS) for
   GDPR. Verified zero `googleapis`/`gstatic` requests. Keep it that way.
6. **Version + cache-bust on every asset change** (see "The version ritual").
7. **1:1 brand parity** with Elkollen / ampy.se: the rail typography (Plus Jakarta Sans heading,
   Outfit body, exact sizes/colors) and the two gradient CTA pills are deliberate — the canonical
   reference is `ampy-behorighetskollen/preview/hero.html` (and its live form at
   https://julius447.github.io/Elkollen/preview/hero.html). Match values exactly; don't "improve" them.
8. **`Plus Jakarta Sans`** is the intentional brand display font — it's flagged by the design hook
   but confirmed (persisted in `.impeccable/config.json`). Not a defect.

## Common tasks + how to verify

- **Change copy / a question / a link / a CTA:** edit `data/elcentralkollen-data.json`, reload the
  preview. If you touched anything under `scoring` or changed an option `id`/order, run the oracle.
- **Change scoring:** edit `scoring.*`; `node assets/engine.test.js` must stay green; flag for re-sign.
- **Change styling/layout:** edit `assets/elcentralkollen.css`; bump version (below); verify in the
  preview at desktop **and** 360px mobile.
- **Always** finish a previewable change by checking the result screens via the QA bar deep-links
  and confirming **0 console errors**.

### The version ritual (mandatory on any `assets/*` change)
Bump to the same new version in all of:
1. `data/elcentralkollen-data.json` → `meta.version`
2. `elcentral-kollen.php` → `AMPY_EC_VERSION` and the `Version:` header
3. `preview/index.html` → the `?v=` query on **both** the CSS `<link>` and the JS `<script>`

The `?v=` query is what makes the GitHub Pages preview fetch fresh assets — skip it and changes
appear to do nothing because the browser serves the cached file.

### Commands
```bash
node assets/engine.test.js                 # oracle — must be ALL GREEN
python3 -m http.server 5179                # preview → http://localhost:5179/preview/index.html
php -l elcentral-kollen.php                 # lint (needs PHP locally / on staging)
```

## Key files & functions

| File | What's in it |
|---|---|
| `assets/elcentralkollen.js` | `diagnose()` + `computeSafety/Ready/CrossAxis/Cell` (engine); the `Wizard` class: `hydrateFromUrl()`, `decodeVector()`, `render()`, `renderStart/renderQuestion/renderResult()`, `renderLead()` + `submitLead()` (the lead form), `track()` (dataLayer) |
| `assets/elcentralkollen.css` | All styles, scoped to `.ampy-ec`; `html{font-size:62.5%}` so `1rem = 10px`. Two-pane grid ≥1024px, single column below |
| `assets/engine.test.js` | The Node oracle (archetype assertions + the 3 guard bugs) |
| `data/...json` | Everything content/rules (see "Data model") |
| `elcentral-kollen.php` | Shortcode, enqueue, `wp_localize_script`, `ampy_ec_dynamic_og()`, `ampy_ec_strip_internal()` |
| `includes/render.php` | The `.ampy-ec` mount + no-JS crawlable fallback + SEO H1; `lang="sv"` |
| `includes/lead-endpoint.php` | Optional WP REST lead endpoint, **commented out** in the plugin entry |

## Lead flow

- **Primary (active):** the rail/result CTA "Få kostnadsfri rådgivning" (`cta_defs.radgivning`,
  `opens_form:true`) opens the in-tool form (`renderLead()`). On submit, `submitLead()` POSTs
  `{cell, vector, namn, epost, telefon, postnummer, samtycke, webbplats}` to
  `meta.lead_webhook_url`. **That URL is `null` today → the form simulates success and drops the
  lead.** Set it to an n8n/Make webhook to go live. `webbplats` is a honeypot.
- **Secondary (off):** `renderPdfCapture()` adds an "email me the report" expander on the besked,
  gated behind both `meta.pdf_webhook_url` and `meta.privacy_policy_url`; `pdf_webhook_url` is
  `null` so it renders nothing. Optional.
- The two `lead_webhook_url` vs `pdf_webhook_url` channels are independent; the primary form is the
  one that matters for launch.

## Layout notes (desktop, ≥1024px)

- Two-pane grid: left **rail** (brand: H1 + lead + 3 trust bullets + 2 gradient contact CTAs),
  right **stage** (the quiz card). Grid proportions are `44fr / 56fr` to match Elkollen.
- The rail is **frozen-centered**: top-aligned with `min-height: var(--ec-q-minh)` + flex column +
  `justify-content: center`, so its content is centered against the *normal* card height and does
  **not** move when the taller multi-select slides (Q5/Q7) grow. The result/lead views (much taller
  cards) override to top-align + sticky. Don't revert this to plain `align-items: center` — that
  reintroduces the shift between slides.
- Mobile rail visibility is driven by a JS-set `data-view` attribute on `.ampy-ec__shell`
  (`start`/`question`/`result`/`lead`), **not** `:has()`, so the trust bullets + contact CTAs
  survive on older iOS Safari. Keep using `data-view` for view-conditional rail rules.

## Gotchas (learned the hard way)

- **Margin collapse in the lead form:** `.ampy-ec__lead-submit` also carries `.ampy-ec__cta-primary`,
  whose later-defined margin overrides the submit's — put inter-field gaps on the unique-class
  elements (e.g. `.ampy-ec__lead-consent` margin-bottom), not on the shared button class.
- **CSS clamp maxes rarely bind at desktop:** bumping only a `clamp(... , ... , MAX)` ceiling often
  does nothing at common widths (the middle term wins) — change the middle term to actually resize.
- **Our Outfit is a real variable font** (weights 400–600 render distinct widths). Visual weight
  differences vs the live Elkollen come from Google-Fonts-Outfit vs our self-hosted Outfit, not from
  the CSS `font-weight` values — match the *values* to the reference and stop there.
- **Preview is sandboxed to localhost** — it can't load external URLs (e.g. the live Elkollen) to
  measure them; use the reference's source (`hero.html`) for exact values.
- **Always re-set the preview viewport after navigating** (a reload resets it to native size).

## WordPress / Bricks specifics

- Enqueue is shortcode-scoped (no global asset weight). The tool carries its own H1 — **do not add
  a duplicate heading in Bricks**.
- Dynamic OG: `ampy_ec_dynamic_og()` checks `_bricks_page_content_2` postmeta (not just
  `post_content`) so it fires on Bricks pages. Make sure the SEO plugin doesn't also emit OG tags
  for this page (double OG).
- Bump `AMPY_EC_VERSION` on every asset change or WP serves stale cached CSS/JS.
</content>
