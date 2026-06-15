# Elcentral-kollen — Developer handover

**Reader: Chris (implementation developer).** This is everything you need to take
Elcentral-kollen from this repo into Ampy's **Bricks / WordPress** site and go live.

- Companion doc for your AI agent (Claude): [`CLAUDE.md`](CLAUDE.md) — architecture, conventions, and the invariants that must not break.
- Deeper references: [`docs/SPEC.md`](docs/SPEC.md) (the locked product + scoring contract), [`docs/HANDOVER.md`](docs/HANDOVER.md) (architecture detail), [`docs/CHECKLIST.md`](docs/CHECKLIST.md) (human go-live checklist), [`research/FACTS.md`](research/FACTS.md) (sources behind the claims).

> **Language:** all developer docs are English. **All UI strings are Swedish by design — do not translate them.** They live in one data file (below).

---

## 1. What it is

A self-contained WordPress plugin that renders a lead-generation tool via the shortcode
**`[elcentralkollen]`**. A homeowner answers **7 tap-only questions** and gets a **two-axis
verdict — _Säker?_ / _Redo?_** from a calibrated 2×2 matrix, plus their specific findings and
exactly one honest call-to-action. The full verdict is always shown for free (no e-mail wall) —
that honesty is the point. It is a fork of Ampy's earlier "Elkollen" tool and matches it 1:1
visually.

- **No build step. No npm. No external runtime API.** Pure PHP + vanilla ES6 + CSS.
- The scoring engine is **JavaScript-only** — there is no PHP twin. Do not port it.
- **One file holds all content, rules, copy, weights and links:** `data/elcentralkollen-data.json`.

## 2. Current status

| | |
|---|---|
| **Version** | `2.16.5` (kept in sync across `data.meta.version`, `AMPY_EC_VERSION` in the PHP, and the JS header) |
| **Live preview** | https://julius447.github.io/Elcentral-lead-magnet/ (GitHub Pages, from `main`) |
| **Repo** | https://github.com/julius447/Elcentral-lead-magnet (`main`) |
| **Tests** | `node assets/engine.test.js` → **ALL GREEN (15/15)** |
| **Verified** | All 4 verdict cells + akut + oklart paths, desktop + mobile (360px) + iPad, 0 console errors |
| **Fonts** | Self-hosted woff2 (Outfit + Plus Jakarta Sans) — **no Google Fonts requests** (GDPR) |

**Done and shippable as code.** What remains before public launch is **configuration and
sign-off** (Section 6) — not code changes.

## 3. Repo layout

```
elcentral-kollen/                     ← this folder IS the WordPress plugin
├── elcentral-kollen.php              Plugin entry: shortcode, asset enqueue, data injection, dynamic OG
├── includes/
│   ├── render.php                    Server-rendered mount node + crawlable (no-JS) fallback + SEO H1
│   └── lead-endpoint.php             Optional built-in WP REST lead endpoint (DISABLED by default)
├── data/
│   └── elcentralkollen-data.json     ★ SINGLE SOURCE OF TRUTH — questions, scoring, copy, links, gates
├── assets/
│   ├── elcentralkollen.js            The whole tool: pure engine + wizard renderer (vanilla ES6)
│   ├── elcentralkollen.css           All styling, scoped to .ampy-ec
│   ├── engine.test.js                Node oracle — proves the weights reproduce the signed verdicts
│   ├── fonts/                        Self-hosted woff2 (Outfit, Plus Jakarta Sans) — keep these
│   └── og/                           Open Graph share image goes here (see 6.2) + a README
├── preview/index.html                Local/standalone preview with a QA deep-link bar — NEVER a prod page
├── index.html                        Root redirect → preview/ (only used by the GitHub Pages preview)
├── docs/                             SPEC, HANDOVER, CHECKLIST, DESIGN (reference)
├── research/FACTS.md                 Substantiation dossier (sources + sign-off gates)
└── CLAUDE.md  README.md              Agent guide + this file
```

In production WordPress, only `elcentral-kollen.php`, `includes/`, `assets/` and `data/` do
anything. `preview/`, `index.html`, `docs/`, `research/`, `.claude/`, `.impeccable/` are inert dev
files — harmless to ship but never loaded by WP. (The QA bar lives only in `preview/index.html`
and is never rendered by the plugin.)

## 4. Run it locally

```bash
# Any static server works; the repo ships a config for the in-house preview runner:
#   .claude/launch.json → "elcentral-kollen" on port 5179
python3 -m http.server 5179        # then open http://localhost:5179/preview/index.html

# The oracle — must pass before you commit any data/engine change:
node assets/engine.test.js          # → "ALL GREEN — 15 passed, 0 failed."
```

The preview's top QA bar deep-links every outcome (green / förhöjd / hög / oklart / akut /
lead-form) via `?q=` answer-vectors — use it to eyeball each result screen quickly.

## 5. Deploy into Bricks / WordPress

1. **Install the plugin.** Either zip this folder and upload it under
   *WP Admin → Plugins → Add New → Upload Plugin*, or copy the folder to
   `wp-content/plugins/elcentral-kollen/`. Activate it.
2. **Place the shortcode.** On the target Bricks page, add a **Shortcode** element (or a Code
   element) containing exactly:
   ```
   [elcentralkollen]
   ```
   The plugin enqueues its CSS/JS only on pages that contain the shortcode — no global weight.
3. **Do NOT add a separate heading above it.** The tool renders its own `<h1>` + lead in the left
   rail, and `render.php` also writes that H1 server-side for crawlers. Adding a Bricks heading
   would duplicate the H1. Let the shortcode stand alone.
4. **Avoid double Open Graph tags.** The plugin writes `og:*` / `twitter:*` from the data file
   (Section 6.2). If your SEO plugin (Yoast / RankMath) also outputs social tags for this page,
   blank its social fields for this page so there's only one set.
5. **Optional per-service embeds.** The shortcode accepts `embed="elbesiktning"` (or
   `centralbyte` / `jordfelsbrytare` / `lastbalansering`) — currently a context hint only; the tool
   always starts on question 1.

## 6. Go-live configuration — the gates

Each item below is the only thing standing between "deployed" and "launched." Most are a single
value in the data file or a one-time asset.

### 6.1 Lead webhook — **the most important gate** (data file)
The in-tool contact form ("Få kostnadsfri rådgivning") is the tool's **only owned lead channel.**
It currently posts to `meta.lead_webhook_url`, which is `null` → **the form simulates a "Tack!"
success and silently drops every lead.**

- **Action:** create an n8n / Make webhook (same pattern as Ampy's other calculators) and paste
  its URL into `data/elcentralkollen-data.json` → `meta.lead_webhook_url`.
- The form POSTs JSON: `{ cell, vector, namn, epost, telefon, postnummer, samtycke, webbplats }`
  (`webbplats` is a honeypot — real submissions leave it empty; reject non-empty in your flow).
- Verify a test submission lands in your flow on staging before launch.
- *Alternative (built-in):* uncomment `require_once AMPY_EC_DIR . 'includes/lead-endpoint.php';`
  in `elcentral-kollen.php` to use a WordPress REST endpoint instead — see `CLAUDE.md` §"Lead flow"
  for the trade-offs (you'd point the JS at the REST URL and harden the endpoint).

### 6.2 Open Graph image (asset, owner-supplied)
Drop **`assets/og/elcentral-kollen.png`** (exactly that name, **1200×630**, neutral/branded — *not*
a per-result image). The PHP already gates on `file_exists`, so it's safe to deploy without it; you
just won't get a social thumbnail until it's added. Verify with the Facebook Sharing Debugger.
The Bricks-page detection for OG is already handled in `render.php` (it reads
`_bricks_page_content_2`, since `has_shortcode()` alone doesn't see Bricks content).

### 6.3 Analytics (GTM / GA4 / Meta)
The wizard pushes a `window.dataLayer` event stream — no IDs are hard-coded:
`ampy_ec_quiz_start`, `ampy_ec_step_view {step, question_id}`, `ampy_ec_quiz_complete {cell}`,
`ampy_ec_lead_form_open {cell}`, `ampy_ec_lead_submitted {cell}`. Wire a GTM container + GA4 and
the Meta pixel to consume them (funnel drop-off + retargeting). Confirm firing in GTM Preview.

### 6.4 Electrician sign-off (the real launch gate, human)
An auktoriserad elinstallatör must sign the **archetype truth table** (`docs/SPEC.md` §6) and the
diagnostic claims (`docs/CHECKLIST.md` §A): the verdict each of the ~10 archetypes produces, the
Redo-axis wording, and the brand-statistic ("298 händelser 2018–2022" — `facts.brand`). Sign the
**verdicts**, not the weights. The previously-coded `_pending_signoff` gate has been removed from
the data, so this is now a manual checklist gate — **do not publish before it's done.**

### 6.5 PHP lint (staging)
The PHP could not be linted in the build environment. On staging (PHP 7.4+) run, and confirm "No
syntax errors" on all three, **before** activating the plugin (a parse error white-screens the site):
```bash
php -l elcentral-kollen.php && php -l includes/render.php && php -l includes/lead-endpoint.php
```

### 6.5b Already done (no action)
- `cta_defs.ring.url` = `tel:+46102657979` — the akut "Ring oss" one-tap call is wired and shows on the bränd-lukt result.
- Fonts self-hosted (GDPR), cost/price block removed, `meta.privacy_policy_url` set.

## 7. Making changes

**Golden rule: content, copy, rules, weights and links live in `data/elcentralkollen-data.json`.
Never hard-code UI text in PHP/JS/CSS.**

| You want to change… | Edit | Then |
|---|---|---|
| Any visible text, a question, an option, a link, a CTA | `data/elcentralkollen-data.json` | Re-open the preview; if you touched scoring, run the oracle |
| Scoring (weights, thresholds, floors) | `data/...json` `scoring.*` | **`node assets/engine.test.js` must stay ALL GREEN**, then re-sign (6.4) |
| Styling / layout | `assets/elcentralkollen.css` | Bump version (below); verify in the preview |
| Engine / wizard behaviour | `assets/elcentralkollen.js` | Run the oracle; verify in the preview |

**On ANY change to `assets/*.css` or `assets/*.js`, bump the version in three places (keep them
identical):**
1. `data/elcentralkollen-data.json` → `meta.version`
2. `elcentral-kollen.php` → `AMPY_EC_VERSION` **and** the `Version:` header
3. `preview/index.html` → the `?v=` query on the CSS **and** JS `<link>/<script>` tags

`AMPY_EC_VERSION` cache-busts the assets in WordPress; the `?v=` query cache-busts them on the
GitHub Pages preview. **If you skip the `?v=` bump, the preview keeps serving the old cached
CSS/JS and your change appears to do nothing.** (This bit us; it's why the preview links are
versioned.)

## 8. Verify before publish

- `node assets/engine.test.js` → **ALL GREEN**.
- Walk all 7 steps; the two multi-selects (Q5 "varningstecken", Q7 "planer") have an exclusive
  "Inget" option + a "Fortsätt" button; "Osäker" always completes and never blocks.
- Check each verdict via the QA bar: green (sr), capacity-only (si), safety-gap (rs), both (rr),
  the **akut** path (pick "Bränd lukt" → a red "Kontrollera detta först" alert appears first and
  the "Ring oss" call button shows), and **oklart** (3× "Osäker" on a modern home → an "Oklart"
  info verdict, *not* a red risk).
- Mobile 360px: no horizontal scroll; keyboard-only completion; focus lands on each step heading.
- Submit the lead form on staging → confirm it reaches your webhook.
- Links resolve: CTAs → the right `ampy.se` pages; the credential link → Ampy's Elsäkerhetsverket entry.

## 9. Architecture at a glance

```
data/elcentralkollen-data.json   →   assets/elcentralkollen.js                →   the rendered tool
(weights, thresholds, floors,        ENGINE (pure, JS-only):                       two-pane shell:
 ready rules, 2×2 matrix,            computeSafety → computeReady →                left rail (H1+lead+
 findings, facts, copy, links,       computeCrossAxis → computeCell →              trust bullets+CTAs)
 the go-live gates)                  diagnose()  ──────────────────►              right stage (start →
        ▲                                                                          7 questions → besked)
   edit here                         WIZARD class: renders each slide,            URL carries the
        │                            tracks answers, posts the lead form          answer-vector ?q=...
 elcentral-kollen.php  →  wp_localize_script injects the whole data file as window.AmpyEC.data,
 includes/render.php   →  prints <div class="ampy-ec"> + a crawlable no-JS fallback (with the SEO H1),
                          and dynamic OG tags in <head>.
```

Full detail (engine functions, the data contract, accessibility) is in
[`docs/HANDOVER.md`](docs/HANDOVER.md) and [`docs/SPEC.md`](docs/SPEC.md). Hard rules for any code
change are in [`CLAUDE.md`](CLAUDE.md).

## 10. Don't-break-these (invariants)

1. **The oracle is law.** `node assets/engine.test.js` must print ALL GREEN. It proves the data
   weights still produce the signed verdicts. A weight/threshold/id change that fails it must be
   re-signed by the electrician before shipping.
2. **The honesty moat.** The full verdict is always shown for free — never put it behind an e-mail
   wall. A broken/truncated `?q=` must fall back to the start screen, never a fabricated "Säker."
3. **Swedish UI, English code.** Never translate the UI strings; never hard-code new ones outside
   the data file.
4. **No em-dashes in UI copy** (brand rule), and **no Google Fonts** — keep fonts self-hosted.
5. **Version + cache-bust** on every asset change (Section 7).
6. Keep the visual styling 1:1 with Elkollen / ampy.se (the rail typography and the gradient CTA
   pills are deliberate brand parity).
</content>
