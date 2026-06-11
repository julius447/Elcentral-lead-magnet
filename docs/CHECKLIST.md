# Elcentral-kollen — Human checklist (go-live)

The build is done and browser-verified. These are the **human** steps before public launch.
Nothing here is code — it is sign-off and data. Order = highest-uncertainty first.

## A. Electrician sign-off (auktoriserad elinstallatör) — the diagnosis
- [ ] **A1. Archetype truth table** (docs/SPEC.md §6). Review the 10 archetypes + the verdict each produces. Sign the *verdicts*, not the weights. Run `node assets/engine.test.js` after any weight change — it must print `ALL GREEN`.
- [ ] **A2. Reconcile ONE dated centralbyte range.** Ampy's three own PDFs disagree (research/FACTS.md D1). Pick one villa/radhus/lägenhet range (före + efter ROT), date it, sign it. Update `costs.centralbyte` in the data file and remove `_pending_signoff`.
- [ ] **A3. JFB-separat price** (typ A / typ B installerad) — confirm `costs.jfb`.
- [ ] **A4. Redo-axis claims** — lastbalansering thresholds, uppsäkring/nätavgift, grön-teknik-on-lastbalansering wording ("kan … bedöms av Skatteverket").
- [ ] **A5. Brandstatistik** — confirm 298 / 78 % / 66 % against the Elsäkerhetsverket report (`facts.brand`).
- [ ] **A6. JFB millisekunder wording** and the "30–50 år" tumregel framing (industry rule, not authority).

## B. Owner data
- [ ] **B1. Elbesiktning price** — supply Ampy's list price into `costs.besiktning` (currently TBD).
- [ ] **B2. Ellevio 2026 nätavgift** figures — confirm if the nedsäkring hook ships (`costs.nedsakring`).
- [ ] **B3. Real service-page URLs** — verify the four `meta.service_pages` + `laddbox_calc_url` resolve.
- [ ] **B4. Geographic scope** — confirmed Stockholm/Ellevio (matches Ampy's service area). Keep the scope line, or widen if Ampy expands.

## C. The one CPO decision that's yours
- [ ] **C1. Fear ad permitted at all?** Recommendation: run the **question-framed** primary ("Är din elcentral säker — och redo?"); keep pure-fear ("brandrisk?") as a guard-railed secondary test judged on *qualified-lead-per-impression + green-bounce-share*, never CTR. Decide whether pure-fear runs given the suite-wide brand stake. (Does not block the tool — only the campaign.)

## D. Compliance / GDPR
- [ ] **D1. Self-host fonts** — replace the Google Fonts `@import` in `assets/elcentralkollen.css` with local `@font-face` (assets/fonts/). EU/GDPR.
- [ ] **D2. Privacy-policy URL + retention/DPA** — if the PDF-capture endpoint is enabled, set the consent text's policy link and document retention.
- [ ] **D3. Ad-copy substantiation** — every ad headline + search trigger pre-cleared to the same standard as in-tool copy (marknadsföringslagen applies to the ads).

## E. Design gate (the law from the Elkollen journey)
- [ ] **E1. Reference mockups approved** — (a) a question screen, (b) the result screen, (c) the share card — signed off before production code was the rule; the built prototype now *is* the reference. Confirm the owner approves the built result screen + the canvas share card.

## F. Install (WordPress / Bricks)
- [ ] **F1.** Upload the plugin folder, activate. Bump `AMPY_EC_VERSION` on any later asset change.
- [ ] **F2.** Add the H1/H2 + lead as Bricks elements ABOVE the `[elcentralkollen]` shortcode.
- [ ] **F3.** Run `php -l` on the 3 PHP files on staging.
- [ ] **F4.** Drop `assets/og/elcentral-kollen.png` (1200×630, neutral) for social unfurls.
- [ ] **F5.** Embed presets on /elservice/elcentral/, /elbesiktning/, /jordfelsbrytare/, /lastbalansering/.
- [ ] **F6.** Remove `_pending_signoff` from the data file once A–B are done. **Do not publish before that.**

## G. Measurement (roadmap — SPEC §11)
- [ ] GA4/Meta events (start, per-question drop-off, cell+level, CTA-per-type, share, PDF). Value-weight by est. order value; wire offline-conversion import (CRM → CAPI) so the A/B optimizes to revenue, not clicks.
