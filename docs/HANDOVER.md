# Elcentral-kollen — Technical handover

> Reader: the implementation developer (and anyone who touches the code). This is a
> standalone WordPress plugin forked from Elkollen (`ampy-behorighetskollen`). It
> explains the architecture, the engine, the data contract, the WP/Bricks integration,
> and the launch gates. Product/strategy rationale: [SPEC.md](SPEC.md). Facts: [../research/FACTS.md](../research/FACTS.md).
> Dev docs are English; the UI strings in the data file are Swedish by design — do not translate them.

## 0. TL;DR
- Standalone plugin exposing the shortcode `[elcentralkollen]`. Drop it in Bricks, done.
- **All copy, all rules, all weights, all links live in `data/elcentralkollen-data.json`.** Never edit text in PHP/JS/CSS.
- No build step, no npm, no external runtime API. Pure PHP + vanilla ES6 + CSS.
- **The diagnosis engine is JS-only — there is NO PHP twin.** Do not port the scoring to PHP.
- **Launch gate:** an auktoriserad elinstallatör signs the archetype truth table (SPEC §6) + the reconciled costs (FACTS) before go-live. See `meta._pending_signoff`.
- **Bump `AMPY_EC_VERSION`** in `elcentral-kollen.php` on every CSS/JS change (cache-busting).

## 1. What it does
A homeowner answers 7 tap-only questions and gets a **two-axis verdict — Säker? / Redo?** — from a calibrated 2×2 matrix, plus their specific findings (⚠/✓/ⓘ) and exactly one honest primary CTA routed to a real Ampy service (soft "Få kostnadsfri rådgivning"; the kr/ROT cost block was removed per owner feedback — see CHECKLIST A2). It can honestly say "din central ser bra ut" with no sell — that honesty is the moat.

## 2. File tree
```
elcentral-kollen/
├── elcentral-kollen.php          Plugin entry: shortcode, enqueue, wp_localize_script, dynamic OG
├── data/elcentralkollen-data.json  SINGLE SOURCE OF TRUTH (questions, scoring, matrix, findings, facts, costs, copy)
├── assets/
│   ├── elcentralkollen.css        v5 craft (tokens scoped to .ampy-ec; dual-status/pill/multi-select/akut/cost)
│   ├── elcentralkollen.js         The whole tool: engine (pure) + 6-step wizard renderer
│   ├── engine.test.js             Node oracle — asserts weights reproduce the archetype truth table
│   └── og/                        OG share image (designer drops elcentral-kollen.png, 1200×630, neutral)
├── includes/
│   ├── render.php                 Server-rendered mount + crawlable fallback (NOT a computed result)
│   └── lead-endpoint.php          REST endpoint for the PDF capture (DISABLED by default)
├── preview/index.html             Local standalone preview (QA bar — NEVER ships to prod)
├── docs/SPEC.md · HANDOVER.md · CHECKLIST.md
└── research/FACTS.md              Substantiation dossier + sign-off gates
```

## 3. Architecture — engine / view / PHP shell
```
DATA (truth)                ENGINE (pure, JS-only)            VIEW (wizard)
elcentralkollen-data.json → computeSafety()  ─┐            6 question steps (single + multi)
weights, thresholds,        computeReady()    ├─ diagnose() → dual-status verdict (2 axes)
floors, uncertainty,        computeCrossAxis()─┘            findings + factnote + cost + CTA + share/PDF
ready rules, matrix         computeCell()                  URL = answer-vector (?q=a2.s1.j0.w13.h2.p04)
        ▲                                          PHP: shortcode + wp_localize_script (injects data) +
  edited after sign-off                            render.php (crawlable fallback) + dynamic OG
```
**Data flow in WP:** the page has `[elcentralkollen]` → `ampy_ec_shortcode()` enqueues CSS+JS and `wp_localize_script` injects the entire data file as `window.AmpyEC.data` (no extra HTTP round-trip) → `render.php` prints `<div class="ampy-ec">` with a crawlable fallback inside → JS boots on DOMContentLoaded, reads `window.AmpyEC.data`, removes the fallback, renders the wizard.

## 4. The engine (the load-bearing correctness)
Pure functions in `assets/elcentralkollen.js`, exposed on `window.AmpyEC` for the oracle:
- `computeSafety(answers, data)` — known-risk addition → level by threshold → **hard floors** (present symptom → amber; bränd lukt → escalation floor + akut + overrides green) → **uncertainty rendering** ("Oklart" when ≥2 "Vet inte" and no real risk).
- `computeReady(answers, data)` — ordered enum vs plan + huvudsäkring; `ej_bedomd` suppresses the Redo claim.
- `computeCrossAxis` — the "byte löser båda" rule (old + skruv + any plan).
- `computeCell` — one-directional 2×2 collapse (anything needing a purchase → "Inte redo"; nuance preserved in the finding + an **info pill**, not amber).
- **`engine.test.js` is the oracle.** Run `node assets/engine.test.js` — it must print `ALL GREEN`. It asserts the data-file weights reproduce the signed archetype table (SPEC §6) and guards the three red-team bugs (warm-outlet→amber, bränd-lukt→non-green+akut, uncertainty→oklart). **A weight edit that breaks an archetype fails the oracle loudly — re-sign before shipping.**

## 5. The data contract
See SPEC §4. Key invariants the engine relies on:
- `scoring.floors.escalation` is a **floor** (`overrides_green:true`), not an addend.
- `scoring.uncertainty` separates "Vet inte" from risk.
- `scoring.ready.pill_levels` — `info`/`neutral` for non-risk states (lastbalansering/bedömning); amber only for the 16A hard block.
- `costs.double_discount_guard` — centralbyte (ROT base) and laddbox (grön teknik base) are **two line items with two bases**; never both avdrag on one krona.
- Every `_pending_signoff` field is a launch gate.

## 6. WordPress / Bricks
- Shortcode `[elcentralkollen]` (optional `embed="elbesiktning"` for per-service-page context). Enqueue only on pages with the shortcode.
- **Heading:** add the H1/H2 + lead as separate Bricks elements ABOVE the shortcode (SEO — the tool never carries its own page heading).
- **Dynamic OG:** neutral/branded only (NOT per-cell). A personal "Säker ✓ / Redo ✗" image can unfurl alarmist in a Facebook group and undermine the honesty moat; the personal card is the canvas share-card instead. Drop `assets/og/elcentral-kollen.png` (1200×630).
- **Embed presets:** /elservice/elcentral/, /elbesiktning/, /jordfelsbrytare/, /lastbalansering/.

## 7. The lead flow
All CTAs are plain links to the service pages / `https://ampy.se/offert/` + the rail contact CTAs (phone `tel:+46102657979`, "Kontakta oss" → offert). The full verdict is ALWAYS shown free — the email capture is a calm, expand-on-click text link, never a wall (invariant #1).

### ⚠️ DEV TODO — activate the e-post/PDF lead-capture (#5, owner-requested, NOT live yet)
`renderPdfCapture()` (assets/elcentralkollen.js) is fully built and GDPR-correct: email field + consent checkbox + honeypot + WP nonce. On submit it POSTs JSON `{ epost, vector, cell, samtycke, webbplats }` to `meta.pdf_webhook_url` with header `X-WP-Nonce`. It is **gated**: it renders ONLY when BOTH `meta.pdf_webhook_url` AND `meta.privacy_policy_url` are non-null (else it emits an HTML comment and nothing shows).
- `meta.privacy_policy_url` is ALREADY set → `https://ampy.se/integritetspolicy/`.
- **What's left:** set `meta.pdf_webhook_url` to a real endpoint. Two options:
  1. **n8n/Make webhook** (matches the other Ampy calculators): paste the webhook URL into `meta.pdf_webhook_url`. Add a UTM/source field to the payload if you want campaign attribution.
  2. **Built-in WP REST endpoint:** uncomment `require_once AMPY_EC_DIR . 'includes/lead-endpoint.php';` in `elcentral-kollen.php` (it's a finished nonce + honeypot + consent endpoint) and set `meta.pdf_webhook_url` to the printed `rest_url('ampy-ec/v1/lead')` (already injected to JS as `restUrl`).
- Once a webhook is set, the capture link appears automatically on the besked. Differentiated copy already exists (`copy.pdf_capture` vs `copy.pdf_capture_green`). This is the tool's ONLY owned lead-capture — until wired, every CTA is an anonymous outbound link and the tool builds no email list.
- Related quick win: `cta_defs.ring.url` is still `null`, so the akut ("bränd lukt") "Ring oss" button stays hidden. The real number now exists — set it to `tel:+46102657979` to give the highest-intent user a one-tap call.

### Analytics (live since v2.9)
The wizard pushes `window.dataLayer` events: `ampy_ec_quiz_start`, `ampy_ec_step_view` `{step, question_id}`, `ampy_ec_quiz_complete` `{cell}`. Wire GTM/GA4 (and a Meta/Ads pixel) to consume them for funnel drop-off + retargeting. No IDs are hard-coded in the tool.

## 8. Accessibility (WCAG 2.2 AA) — built in, not inherited
Elkollen's renderer dropped focus on every view change — fixed here: `render()` moves focus to `[data-focus]` (the step heading / the result summary `<h2>`) on every transition. One announcement channel per screen (focus, not aria-live on pills). The bränd-lukt akut-notis is `role="alert"`, first in result DOM. Multi-select F4/F6 are `role="checkbox"` groups with exclusive "Inget", explicit "Fortsätt", and a live count. Pills are dark-on-light (never `--state-warning` as text). Targets ≥44px. Reduced-motion respected. Full spec: SPEC §7.

## 9. Known pre-launch notes
1. **GDPR fonts:** the CSS `@import`s Google Fonts. Self-host before an EU launch (download to `assets/fonts/`, replace the `@import` with `@font-face`). System-ui fallback exists so it never breaks.
2. **`AMPY_EC_VERSION`** must be bumped on every asset change.
3. **PHP lint** could not run in the build env (php unavailable). Run `php -l` on the 3 PHP files on staging.
4. **Launch gate:** do not publish until the electrician signs the archetype table + reconciled costs (FACTS §E), and the owner supplies the elbesiktning + JFB prices.
5. **QA bar** in `preview/index.html` must never reach production (preview-only).
6. **Lead-capture (#5) — owner-requested, action required:** set `meta.pdf_webhook_url` to turn on the (already-built, GDPR-correct) e-post/PDF capture. Full steps in §7 "DEV TODO". Until then the tool captures no leads.
7. **Akut "Ring oss":** set `cta_defs.ring.url = "tel:+46102657979"` to surface the one-tap call for the bränd-lukt result (currently `null` → hidden). See §7.
8. **Analytics:** connect GTM/GA4 + ad pixel to the `ampy_ec_*` dataLayer events (§7) for funnel + retargeting.

## 10. Verify after install (essentials)
- Wizard: all 7 steps; F5/F7 multi-select with exclusive "Inget" + "Fortsätt"; "Vet inte" completes and never gates.
- Each cell: sr (green, no solid teal, calm bridge) · si (laddbox + lastbalansering, grön teknik "kan") · rs (besiktning, amber fact-note) · rr (centralbyte, cross-axis "byte löser båda", two cost bases).
- Akut: select bränd lukt → role=alert first; "Ring oss" surfaces.
- Oklart: 3× "Vet inte" on a modern home → "Oklart" info, NOT amber risk.
- `node assets/engine.test.js` → ALL GREEN.
- Mobile 360px: nothing clipped; keyboard-only completion; focus lands on each step + the result heading.
- Links: CTAs → the right /elservice/ pages; "verifiera oss" → Ampy's register entry.
