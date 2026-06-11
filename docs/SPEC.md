# Elcentral-kollen — Locked product spec (build contract)

> Authored as CPO after an 8-agent dissection (5 role-lenses + 2 fact-checkers + adversarial
> red-team) of the A-grade report. This spec **supersedes** the report wherever they differ;
> the rationale for each change is the agents' adjudicated findings. Facts/numbers live in
> [research/FACTS.md](../research/FACTS.md). Architecture forks Elkollen (`ampy-behorighetskollen`).
>
> **One-line product:** a 60–90 s, 6-question, tap-only diagnosis of a home's elcentral on two
> axes — **Säker?** and **Redo?** — ending in a calibrated 2×2 verdict with specific findings,
> indicative cost (ROT/grön teknik exact), and one honest CTA per outcome routed to a real Ampy service.

---

## 0. CPO DECISIONS (locked)

| # | Decision | Rationale (agent consensus) |
|---|---|---|
| D1 | **Redo axis splits by PLAN, not just capacity.** A "Säker & redo" user who picked Elbil/laddbox in F6 gets a *confident-but-calm* bridge into the Laddbox-kalkylatorn; the true no-sell is reserved for "Säker & redo + Inget särskilt." | UVP **critical** + CRO + architect converged. Highest single lever on lead yield; invariant-safe because it serves a *stated* plan, not an invented problem. |
| D2 | **Exactly ONE solid-teal primary CTA per cell.** Second action = outline; third = inline text link. Green cell = **no solid teal at all**. | UVP + UI + CRO independently. Restores doctrine + diagnosis-before-quote honesty. |
| D3 | **Keep ≤6 questions (invariant #8). Scope the Redo verdict honestly** when current load/heating is unknown ("din central klarar X kapacitetsmässigt; exakt marginal räknar en besiktning ut"). | UVP flagged the heating gap; CPO keeps the 60–90 s promise sacred and resolves via honest scoping instead of a 7th question. |
| D4 | **Prices are NATIONAL (hela Sverige).** Owner directive (2026-06-11) — supersedes the earlier Stockholm scope. Numbers re-researched to riksrepresentative spans (FACTS §D1), shown as **före-ROT + ROT rule** (no unsigned efter-ROT figure) until the electrician signs the labour split. | Ampy works across Sweden. The tool shows a national scope line + a post-verdict housing-type control for correct per-type pricing. |
| D5 | **Uncertainty ≠ risk.** "Vet inte" never alone pushes to amber; an uncertainty-dominated result renders **"Oklart — det svarar en besiktning på"** (info, not risk). | Architect + a11y + UVP. Protects honesty moat (invariant #2). |
| D6 | **Escalation + present-symptom rules are hard FLOORS, not addends.** | Architect **critical**. A "pure addition" build otherwise ships GREEN for a stated fire-precursor. |
| D7 | **Fourth, non-risk INFO pill state** for "Redo med lastbalansering" / "kräver bedömning". Amber/red spent only on real risk. | UI designer. Protects the amber/red signal. |
| D8 | **Fear ad is NOT a build blocker; recommend the question-framed primary** ("Är din elcentral säker — och redo?"), keep pure-fear as a guard-railed secondary test judged on *qualified-lead-per-impression + green-bounce-share*, not CTR. **Owner signs off on whether pure-fear runs at all** (suite-wide brand stake). | UVP + CRO. The one genuinely owner-level call; deferred to campaign, does not gate the tool. |

**Human sign-off gates** (do not go live until cleared): see [FACTS.md §E](../research/FACTS.md).

---

## 1. THE SIX QUESTIONS (final)

Tap-only, no free text, "Vet inte" always a first-class equal-weight answer. Each question has a
title + clarifier subrows + ONE always-visible calm info-note (never an expander). The user never
opens the central.

- **F1 — Ålder** *(single)* · "Hur gammalt är huset — eller elcentralen om du vet?"
  `Före 1970 · 1970–1990 · 1990–2010 · Efter 2010 · Vet inte`
  note: "Centralens ålder är den starkaste enskilda indikatorn på både säkerhet och kapacitet."
- **F2 — Säkringstyp** *(single)* · "Vilka säkringar har du i centralen?"
  `Skruvsäkringar/proppar (runda, skruvas i) · Automatsäkringar (vippknappar) · Blandat · Vet inte`
  note: "Skruvsäkringar tyder ofta på en central som är 30+ år."
- **F3 — Jordfelsbrytare** *(single)* · "Finns det en jordfelsbrytare i centralen?"
  `Ja (brytare med testknapp, ofta märkt T) · Nej · Vet inte`
  note: "Jordfelsbrytaren är det moderna skyddet mot felströmmar — den bryter mycket snabbt, inom bråkdelar av en sekund."
- **F4 — Varningstecken** *(MULTI — välj alla som stämmer)* · "Känner du igen något av det här hemma?"
  `Säkringar som löser ut ofta · Uttag/strömbrytare som blir varma · Lampor som flimrar · Bränd lukt eller missfärgade uttag · Inget av detta`
  note: "Värme och missfärgning är klassiska tecken på glappkontakt." · "Inget av detta" is mutually exclusive.
- **F5 — Huvudsäkring** *(single)* · "Hur stor är din huvudsäkring?"
  `16 A · 20 A · 25 A · 35 A eller större · Vet inte`
  note: "Vet du inte? Det är vanligt — välj Vet inte, vi räknar ändå. Siffran står ofta som t.ex. 20 A på elnätsfakturan under Elnät." → **F5 must never gate the result.**
- **F6 — Planer** *(MULTI)* · "Vad planerar du de närmaste åren?"
  `Elbil/laddbox · Värmepump · Solceller eller batteri · Renovera kök/badrum · Inget särskilt`
  note: "Ditt svar avgör hur mycket kapacitet centralen behöver ha." · "Inget särskilt" is mutually exclusive.

F1–F4 = safety axis. F5–F6 = ready axis. F4/F6 are checkbox groups with an explicit **"Fortsätt"** button (outline, not solid teal).

---

## 2. SCORING ENGINE (pure: addition → floors → uncertainty → cross-axis). Weights are sign-off defaults.

### 2.1 Safety — known-risk additive score (uncertainty handled separately)
```
ageRisk        Före1970=3 · 1970–1990=2 · 1990–2010=1 · Efter2010=0 · Vetinte=0(→uncertainty)
fuseRisk       Skruv=2 · Blandat=1 · Automat=0 · Vetinte=0(→uncertainty)
rcdRisk        Nej=3 · Ja=0 · Vetinte=0(→uncertainty)
symptomRisk    each of {löser ut ofta, varma uttag, flimrar} = +1  (bränd lukt handled by floor)
riskScore = ageRisk + fuseRisk + rcdRisk + symptomRisk
uncertaintyCount = count of Vet inte over {F1,F2,F3,F5}
```
### 2.2 Map to level, then apply FLOORS (floors win)
```
base level: 0–2 Låg(green) · 3–5 Förhöjd(amber) · 6+ Hög(red)
FLOOR a (present symptom): if ANY of {löser ut ofta, varma uttag, flimrar} → level ≥ Förhöjd
FLOOR b (ESCALATION, hard): if "bränd lukt/missfärgade uttag" →
        level ≥ Förhöjd · forces akut finding · overrides_green=true · always append electrician note
        (floor-only, not an addend — avoids double-count)
```
### 2.3 Uncertainty rendering (D5)
```
if final level == Låg AND uncertaintyCount ≥ 2 AND no present symptom/escalation:
        safetyBadge = "Oklart" (INFO pill, not amber) ·
        copy = "Vi kan inte bedöma säkerheten på dina svar — det är precis vad en elbesiktning svarar på" ·
        routes to besiktning honestly (NOT asserted as risk)
```
### 2.4 Ready state (ordered enum) — vs F6 plan + F5 huvudsäkring
```
ej_bedomd        F6 = Inget särskilt → Redo axis SUPPRESSED ("Ingen planerad last — ej bedömd")
redo_marginal    plan=Elbil & huvudsäkring ≥25A → "Redo — klarar en laddbox med marginal"   (success pill)
redo_med_atgard  plan=Elbil & 20A → "Redo med lastbalansering"                                (INFO pill)
inte_redo        plan=Elbil & 16A → "Kräver åtgärd: lastbalansering + ev. uppsäkring/byte"    (amber pill)
kraver_bedomning plan=Elbil & Vet inte  OR  Värmepump/Solceller/Renovering → "En besiktning räknar exakt" (INFO pill)
```
Heating scope (D3): when a plan needs exact margin and current load is unknown, the finding says
"exakt marginal beror på din nuvarande förbrukning (t.ex. elvärme) — det räknar en besiktning/lastbalanseringsbedömning ut."

### 2.5 2×2 collapse (one-directional)
```
SAFE column  = level Låg (or "Oklart")          RISK column = level Förhöjd/Hög
REDO row     = redo_marginal                    INTE-REDO row = anything needing a purchase
ej_bedomd → collapse to the SAFE/RISK cell with NO Redo badge (show safety only)
Nuance (lastbalansering / bedömning) is preserved in the FINDING row + the info pill, even though the cell is "Inte redo".
```
### 2.6 Cross-axis rule (the §20 "byte löser båda" case)
```
if ageRisk≥2 (Före1970/1970–1990) AND fuse=Skruv AND F6 has any plan:
   ready_finding = "Centralen är sannolikt fullbelagd — ett byte frigör grupper och löser både säkerhet och kapacitet"
   strengthen cell rir (Varken säker eller redo) toward the centralbyte case
```

---

## 3. THE 2×2 CELLS — token map + CTA (D1/D2/D7)

The bränd-lukt **akut-notis** renders FIRST (`role="alert"`, top of result DOM) in ANY cell when triggered.

| Cell | Safety / Ready pills | Fact-note | Cost block | **ONE** solid-teal primary | Secondary | Text link |
|---|---|---|---|---|---|---|
| **1 Säker & redo** | green / green (or "ej bedömd") | reassuring, calm | "Inga åtgärder behövs nu" | **none** (green never sells) | — | *if EV plan satisfied:* "Din central klarar en laddbox — räkna din besparing" → Laddbox-kalkylatorn. *if Inget särskilt & ≥25A:* honest down-sell "Du kanske kan säkra ned och spara — fråga oss" |
| **2 Säker, inte redo** | green / info-or-amber | — | laddbox + lastbalansering range, grön teknik 50 % "kan", separate line items | **Få offert: laddbox med lastbalansering** | outline "Läs om uppsäkring" | "Räkna grönt avdrag" inline in cost block |
| **3 Redo, men säkerhetsbrist** | amber/red / green | the single amber fact-note (Elsäkerhetsverket + försäkring "kan") | besiktning / JFB / centralbyte, **ROT 30 %** (not grön teknik) | **Boka elbesiktning** | outline "Läs om jordfelsbrytare" | — |
| **4 Varken säker eller redo** | red / red | amber fact-note (+ akut-notis if bränd lukt) | centralbyte range, ROT; cross-axis "byte löser båda" | **Boka elbesiktning** (Hög-risk may use "Få offert: centralbyte") | outline "Läs om centralbyte" | "Ring oss" on acute path |

**Amber budget:** at most ONE amber left-accent block per screen (the fact-note). Pills may be amber/red as computed; cost is **plain text, never a colored box**.

---

## 4. DATA CONTRACT (`data/elcentralkollen-data.json`)

Single source of truth; non-technician fills/dates/signs; engine stays pure addition + flat if/then.
```
meta            { version, product_name, page_heading, page_lead, last_reviewed, reviewed_by,
                  _pending_signoff, scope_note (Stockholm), disclaimer, verify_company_url,
                  ampy_offert_url, laddbox_calc_url, service_pages{}, rot_rate, rot_date }
questions[]     { id, type:single|multi, title, clarifier, options[{id,label,clarifier,exclusive?}], note }
scoring         { weights{age{},fuse{},rcd{},symptom{}}, thresholds{forhojd,hog},
                  floors{ present_symptom:[ids], escalation:{trigger,min_level,forces_finding,overrides_green} },
                  uncertainty{ counts_fields:[...], min_count, oklart_copy },
                  ready{ rules… }, cross_axis_rules[{if,then}] }
verdict_matrix  { cellId(sr|si|rs|rr) : { headline, tone, safety_pill_levels, ready_pill_levels,
                  cta:{primary,secondary,link}, copy } }
findings[]      { when (answer condition), icon:warn|ok|info, text }
facts           { brand:{text,source,date}, insurance:{text}, age_rule:{text} }
costs           { centralbyte{lagenhet,radhus,villa:{fore,efter}}, jfb{typA,typB}, besiktning,
                  laddbox, lastbalansering, gron_teknik_pct, gron_teknik_lastbalansering_note,
                  nedsakring{ellevio_table,note}, currency, date, _pending_signoff }
cta_routing     { cellId : {...} }   copy { ad disclaimers, friskrivning }
state_schema    { segment decode table for the URL answer-vector }
```

---

## 5. WIZARD STATE / URL ENCODING (architect)

Elkollen's `?jobb=&svar=<int>` is single-answer — insufficient. Use a **self-sufficient answer vector**:
`?q=a2.s1.j0.w13.h2.p04` — segment per question (multi-select segments concatenate option indices, e.g. `w13` = warnings 1 & 3). Engine decodes → `answers{}` → `computeRisk()` + `computeReady()` → `cellId`. Back = pop one segment; progress "Fråga X/6" from segment count; deep-link to a full vector recomputes the result; resumability is free. OG-per-cell maps 4 cells → 4 base images (`sr/si/rs/rr`). Decode table lives in `data.state_schema` (signable).

**No-JS / crawler fallback (`render.php`):** NOT a computed result. It is the static value-prop + the
6 questions as readable text + a strong internal-link block to the four service pages
(/elbesiktning/, /jordfelsbrytare/, /lastbalansering/, /elservice/elcentral/). The scoring engine is
**JS-only — no PHP twin.** (Documented so no build agent ports the scoring model to PHP.) SEO note:
unlike Elkollen's 26 indexable verdicts, per-outcome pages are not crawlable — the SEO contribution
is the explainer + service links; the embed-per-service-page presets carry the rest.

---

## 6. ARCHETYPE TRUTH TABLE (the thing the electrician signs — not the weights)

Representative archetypes; full enumerated set generated at build time as the test fixture
(`engine.test.js` asserts the data-file weights reproduce these). Electrician signs the verdicts.

| # | F1 | F2 | F3 | F4 | F5 | F6 | → Safety | → Ready | Cell | Akut? |
|---|----|----|----|----|----|----|---|---|---|---|
| A1 | Efter2010 | Automat | Ja | inget | 25A | Inget | **Låg** | ej_bedomd | 1 Säker & redo | – |
| A2 | Efter2010 | Automat | Ja | inget | 25A | Elbil | **Låg** | redo_marginal | 1 (confident bridge) | – |
| A3 | 1990–2010 | Automat | Ja | inget | 20A | Elbil | **Låg** | redo_med_atgard | 2 Säker, inte redo (info) | – |
| A4 | 1990–2010 | Automat | Ja | inget | 16A | Elbil | **Låg** | inte_redo | 2 (amber ready) | – |
| A5 | 1990–2010 | Automat | Ja | **varma uttag** | 25A | Inget | **Förhöjd** (symptom floor) | ej_bedomd | 3 Redo m. brist | – |
| A6 | Efter2010 | Automat | Ja | **bränd lukt** | 25A | Inget | **Förhöjd** (escalation floor) | ej_bedomd | 3 + **AKUT** | **yes** |
| A7 | Före1970 | Skruv | Nej | inget | 20A | Inget | **Hög** (3+2+3=8) | ej_bedomd | 3/4 safety-first | – |
| A8 | Före1970 | Skruv | Nej | löser ut ofta | 16A | Elbil | **Hög** | inte_redo + cross-axis | 4 Varken (byte löser båda) | – |
| A9 | Vetinte | Vetinte | Vetinte | inget | Vetinte | Inget | **Oklart** (unc=4, no risk) | ej_bedomd | "Oklart"→besiktning (info, NOT amber) | – |
| A10 | 1970–1990 | Blandat | Vetinte | inget | 20A | Värmepump | **Förhöjd** (2+1=3) | kraver_bedomning | 4 / 3 per safety | – |

---

## 7. ACCESSIBILITY (WCAG 2.2 AA) — flödesspecifik (a11y reviewer: this is `significant-rework`, bake it in)
1. **Focus management:** on each step change move focus to the new question heading (`tabindex=-1` + `.focus()`); on result, focus the combined two-axis summary `<h2>`. (Elkollen's `replaceChildren` drops focus to `<body>` — confirmed in source; a 6× WCAG 2.4.3 failure.)
2. **One announcement channel per screen:** focus-move OR aria-live, never both. Result `<h2>` receives focus; remove aria-live from the individual pills. Keep the polite share-status region.
3. **Combined summary sentence** = the audio squint test: "Din central: säker, men inte redo för elbil utan åtgärd." First thing announced on result.
4. **Akut-notis** = `role="alert"`, FIRST in result DOM, icon + word "Viktigt" (not color-only), exact text.
5. **Multi-select F4/F6:** checkbox-group (`role=group`, `aria-labelledby`), each option a real checkbox with label, selected state announced, "Inget" mutually-exclusive reset, explicit "Fortsätt", Space toggles.
6. **Status never by color alone** (1.4.1): every pill = icon + word; color decorative. Measured contrast: badge text ≥ 4.5:1, pill border/fill ≥ 3:1, focus ring ≥ 3:1. Reuse Elkollen's dark-on-light verdict pairings; **never bind `--state-warning` as text.**
7. **Targets ≥ 44px** (audit: inherited `.ampy-bk__room` 36px, `.share-item` 40px are under — fix), ≥ 8px gaps at 360px.
8. **Reduced-motion:** prefers-reduced-motion → instant swap, focus move only.
9. **Plain-language gloss** on every jargon term that appears in a RESULT: "lastbalansering (en box som fördelar strömmen så inget överbelastas)" — via the info-note style, never a tooltip. Electrician signs the glosses.
10. **F5 never gates;** "Vet inte" completes and yields an honest result.

---

## 8. DESIGN / UI (v5 craft + Ampy design system) — UI reviewer spec
- **New component `.ampy-bk__dualstatus`:** one shared left accent = color of the WORSE axis; two stacked rows, each = [axis label `--text-secondary` 13/500] + [status pill]. Labels fixed-width-aligned so pills form a tidy column — that alignment IS the squint cue. No card/border/fill on the container. Two scoped modifiers `--ec-safe-level` / `--ec-ready-level` so the two pills differ.
- **Fourth pill `--info`** (calm blue-grey `--bg-secondary` / `--text-info`) for lastbalansering / bedömning.
- **Multi-select `.ampy-bk__option--multi`:** left checkbox-square affordance (not chevron), checked = filled `--action-primary` + white check; tap toggles, doesn't advance; "Fortsätt" = OUTLINE primary (reserve solid teal for the verdict conversion only).
- **Cost typography:** kr-ranges + ROT figures in **JetBrains Mono** 400 (quiet "this is data" authority); everything else Outfit.
- **Type tokens:** inherit Elkollen's fixed `--fs-*` rem tokens verbatim for suite parity (documented decision — do not "helpfully" clamp-ify and break parity).
- **Spacing:** between-block 22px, within-block 12px — identical to Elkollen (one hand).
- **Share card** = third mandatory approval artifact: white/neutral bg, two small pills, accent stripe = worse axis — **do NOT flood red**; mixed "Säker ✓ / Redo ✗" must not unfurl as alarmist on social.
- **Mockup gate (the law):** reference mockups of (a) a question screen, (b) the result screen, (c) the share card — approved BEFORE production code.

---

## 9. INVARIANT CHECKLIST (binary — extends the report's §17)
1. Full verdict + findings + cost shown **free, no e-mail wall** (PDF e-mail optional extra).
2. Tool can say **"din central ser bra ut"** with no sell.
3. All fear = **cited facts** (Elsäkerhetsverket by name; insurance with "kan"); brandstatistik attributed precisely (FACTS B1), no "växande brandrisk".
4. **Bränd lukt/missfärgning → akut floor**, role="alert", first in DOM, overrides green.
5. **Present symptom → amber floor.**
6. **Uncertainty ≠ risk** → "Oklart" rendering (D5).
7. Costs = **spann + "Exakt pris kräver offert"**, dated, **national (Sverige)**; show före-ROT + ROT rule until labour split signed.
8. **ROT vs grön teknik exact**; grön teknik never on centralbyte; lastbalansering "kan"; **double-discount guard** (two line items, two bases).
9. **Exactly one solid-teal primary CTA per cell**; green cell has none.
10. ≤6 questions, ≤90 s; "Vet inte" first-class; F5 never gates.
11. **Max one amber-accented block per screen.**
12. Squint test: two axes in a tidy aligned column.
13. Focus moves on every step + on result; akut alert announced first; multi-select keyboard-operable; 44px targets; reduced-motion.
14. Friskrivning: "Vägledande bedömning — ersätter inte en besiktning på plats."
15. Electrician signs the **archetype truth table + reconciled costs + Redo claims**.
16. Every **ad headline + search trigger** substantiated (marknadsföringslagen applies to ads).
17. Fonts self-hosted (GDPR); lead-endpoint consent + privacy-policy URL.

---

## 10. BUILD PLAN
1. `preview/index.html` + `data/…json` + `assets/elcentralkollen.js` (engine + wizard renderer) + `assets/elcentralkollen.css` (fork Elkollen + dualstatus/info-pill/multi-select) — standalone, browser-verifiable.
2. `engine.test.js` — asserts weights reproduce the archetype truth table (§6).
3. WP wrapper: `elcentral-kollen.php` (shortcode `[elcentralkollen]`, wp_localize_script, dynamic OG per cell) + `includes/render.php` (crawlable fallback §5) + `includes/lead-endpoint.php` (reuse Elkollen's, for the PDF capture).
4. Docs: HANDOVER.md + CHECKLIST.md (human) + this SPEC + FACTS.
5. Verify: browser at 1280 + 360px, squint test, keyboard-only completion incl. F4/F6, no console errors, math reconciles to the truth table.

## 11. DISTRIBUTION / MEASUREMENT (roadmap — not MVP-blocking)
- **Ad headlines (A/B):** primary question-framed "Är din elcentral säker — och redo? Kolla på 60 sekunder, gratis." + future "Klarar din elcentral framtiden (elbil, värmepump, solceller)?"; pure-fear only if owner approves, guard-railed (D8). De-narrow "elbil" → "elektrifiera".
- **Keyword clusters:** insurance (hemförsäkring elfel), transaction (elbesiktning innan husköp), renovation, in-market-laddbox. Meta life-event "recently moved" for nyinflyttade. Never bid the authority's brand name (but cite it on the page).
- **KPI:** top metric = cost per SEK of *weighted* pipeline (tag each outcome with est. order value); wire offline conversion import (CRM → Meta CAPI/GA4) so the A/B optimizes to revenue, not clicks.
- **Owned nurture** after PDF capture (not just ad retargeting): seasonal JFB-test reminder, "du funderar på elbil — så här gör centralen redo".
- **Share loop** is user→user (the card), not company→subreddit; disclose, never fake.
