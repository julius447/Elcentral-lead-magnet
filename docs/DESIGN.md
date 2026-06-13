# Elcentral-kollen — Design system (v3)

Outcome of a Jony-Ive/Rams-caliber 10-agent design review (macro + micro, desktop + mobile,
first principles) → director synthesis → adversarial perfection critic. This is the design
contract on top of [SPEC.md](SPEC.md). All decisions were made by the owner-delegated expert call.

## The one idea
This is a **verdict instrument**: 90 seconds → an honest, glanceable two-axis judgment (Säker? / Redo?)
from a Swedish authority you can trust. Authority comes from **the precision of the readout**, not ornament.
"Less, but better" — fewer competing elements, one of them unmistakably the point, in a room that knows its size.

## Layout — two-pane shell (desktop) / one column (mobile)
- `.ampy-ec__shell` wraps a sticky **rail** (left) + the **stage** (right). At `≥1024px` it is a CSS grid
  `minmax(28rem,36rem) minmax(0,58rem)`; below 1024px it collapses to one column.
- **The void became a frame.** The rail carries what the card cannot hold persistently: the brand mark,
  the page H1 + lead, the **Säker?/Redo? thesis** (which previously evaporated after step 1), and the
  **verifiable Elsäkerhetsverket credential** (shield + "Verifiera oss" → the company register). On mobile
  the rail collapses to H1 + lead; the thesis is desktop-only. The credential shows in the desktop rail always,
  and on mobile as a slim line (`.ampy-ec__compact-cred`) inside the START card and the RESULT block only —
  never on the question steps (frees mobile chrome). The old card trust row was removed (replaced by the share
  row); the credential is the persistent trust mark on both viewports.
- **Material canvas:** a soft top radial vignette (page-level; set the Bricks section background in prod);
  the card lifts off it with `--shadow-md`.

## The verdict is the hero (duplication resolved)
The old result had **two heroes** saying the same thing — a prose headline AND the dual-status pills.
Resolved: the **dual-status pills are the hero** (scaled up, weight 600, in a tinted worst-axis verdict
zone — a wash, NOT a bordered card, so the squint-test has presence), and the single prose line is a
**complementary lede** (the implication / next step, not a restatement). The cell prose headline is retired
from the UI (kept for share text via `selectHeadline`). Reading order/SR: a visually-hidden `<h2>` carries
the combined two-axis sentence and is the focus target.

## Subtraction pass (Ive)
- **Chevron removed entirely** — the whole option row is the affordance (hover border + lift + selected tint).
  This deletes the stranded-chevron desktop problem rather than animating around it.
- **Progress = the bar only** (current segment wider + full teal; done = 55% teal; upcoming = border).
  The "Fråga n/6" numeral is `sr-only` (a11y) — one indicator, not two.
- **One canvas-depth device** (the vignette), not a stack of effects.

## Craft tokens (suite-shared — flag to Elkollen for parity)
- **Two-tier rhythm:** `--rhythm-section` (2.4rem) / `--rhythm-group` (1.2rem) / `--rhythm-label` (0.8rem)
  routes every section / intra-group / heading-to-content gap. Kills the 18/20/22 wobble.
- **Hero type uses `clamp()`** (`--fs-title`, `--fs-display`, rail heading) — the canonical Ampy design
  system mandates fluid type, so this **returns the hero roles to canon**; body/options/cost stay fixed-rem.
  → Elkollen should adopt the same hero clamps in lockstep.
- **`--action-primary-strong` rgb(0,122,105)** for white-on-solid CTAs (white-on ≈ 5.3:1, AA). The lighter
  `--action-primary` stays for borders/links/focus/progress (non-text). (Old solid CTA was 2.97:1 — a real defect.)
- **Pills:** dark-on-light, AA ≥6.8:1, weight 600, icon tinted to fg.
- **Selected state** uses `--action-tint` (teal wash), distinct from the grey `--bg-subtle` hover.
- **Reading-measure cap** `62ch` on running text; **mono only on numeric** cost values (`--num`), prose values stay body face.
- **Motion tokens** + reduced-motion guard: directional step transition (translateX ±10px by `this.dir`),
  verdict rise + findings stagger (`--i`), tap `:active` scale. All disabled under `prefers-reduced-motion`.

## Mobile
- Collapsed shell = the proven single column. Cost rows stack label-over-value ≤480px; multi-select checkbox
  top-aligns on wrap; a ≤360px padding/gap tier. 16px email input (no iOS zoom) + `viewport-fit=cover`.

## Held / parked (owner's earlier call)
- Result-only two-column (Direction C): A's rail gives enough desktop presence; revisit only if the result feels tall.
- Mobile sticky CTA dock: the critic flagged share-menu collision + it's chrome; relying on tightened layout for now.
- Dark mode: a suite-wide decision, parked until Elkollen ships it in lockstep.
