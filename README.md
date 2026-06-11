# Elcentral-kollen

Ampy's lead magnet #4 — a 60–90 s, 6-question, tap-only diagnosis of a home's
electrical panel on **two axes: Säker? / Redo?** → a calibrated 2×2 verdict with
specific findings, indicative cost (ROT/grön teknik exact), and one honest CTA per
outcome routed to a real Ampy service. Arketyp B (diagnostic) — a fork of Elkollen.

## Preview locally
```
# served by .claude/launch.json config "elcentral-kollen" on port 5179
# → http://127.0.0.1:5179/preview/index.html   (QA bar deep-links each outcome)
node assets/engine.test.js   # oracle: must print ALL GREEN
```

## What's here
| File | Role |
|---|---|
| `data/elcentralkollen-data.json` | **Single source of truth** — questions, scoring, matrix, findings, facts, costs, copy |
| `assets/elcentralkollen.js` | Pure engine (scoring + floors + uncertainty + cross-axis) + 6-step wizard renderer |
| `assets/elcentralkollen.css` | v5 craft (forked from Elkollen; dual-status, info-pill, multi-select, mono cost) |
| `assets/engine.test.js` | Node oracle — asserts weights reproduce the signed archetype truth table |
| `elcentral-kollen.php` · `includes/` | WP/Bricks plugin: shortcode `[elcentralkollen]`, crawlable fallback, PDF lead endpoint |
| `preview/index.html` | Standalone preview (QA bar — never ships) |
| `docs/SPEC.md` | The locked build contract (decisions, scoring, 2×2 token map, a11y, archetype table) |
| `docs/HANDOVER.md` · `docs/CHECKLIST.md` | Developer handover + human go-live checklist |
| `research/FACTS.md` | Substantiation dossier — corrected numbers, sources, sign-off gates |

## Status
Built and browser-verified (all 4 cells + akut + oklart, mobile 360px, 0 console errors,
oracle 13/13). **Gated on human sign-off before go-live** — see `docs/CHECKLIST.md`:
electrician signs the archetype table + reconciled costs; owner supplies elbesiktning/JFB
prices; self-host fonts (GDPR). The honesty moat is intact: full verdict shown free, no
e-mail wall, the tool can say "din central ser bra ut" with no sell.
