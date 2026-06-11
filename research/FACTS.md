# Elcentral-kollen — Substantiation dossier (faktabas)

> **Status:** research-signed (juni 2026), **pending human sign-off**. Every number
> below is what goes in `data/elcentralkollen-data.json`. Under marknadsföringslagen
> the burden of proof is reversed — nothing ships until an **auktoriserad elinstallatör**
> (and, for the avdrag lines, an accountant) signs the rows marked ⚠ SIGN-OFF.
>
> Sources: Ampy's own fact-reviewed PDFs (primary, on the owner's Desktop), plus
> Elsäkerhetsverket, Skatteverket, Ellevio. Two independent fact-checker agents
> verified each claim; the adversarial red-team adjudicated the conflicts.

---

## A. SCOPE DECISION (locked by CPO)

**All prices and the nedsäkring-saving are scoped to Stockholm-området / Ellevio.**
Rationale: Ampy's `service_zones` (in the Elkollen data file) are the entire greater-
Stockholm region (stockholm, solna, nacka, huddinge, …). Every Ampy source PDF is
explicitly Stockholm/Ellevio-priced (~10–15 % over riksgenomsnitt). A national claim
would be indefensible; a Stockholm scope is both honest and accurate to Ampy's market.
→ Cost copy carries the line: **"Priser avser normalpris i Stockholm-området, juni 2026. Exakt pris kräver offert."**

---

## B. SAFETY AXIS — corrected facts

### B1. Brandstatistik — DROP the generic superlative, use the on-topic Elsäkerhetsverket figures
- ❌ **Do NOT** use "el är en av de vanligaste brandorsakerna" as a general claim. Fixed
  electrical installations are only **28 %** of electrical residential fires (elprodukter 48 %;
  felaktig användning of e.g. spis alone exceeds all equipment faults). The fixed-installation
  trend is *decreasing* (~9 %), so any "växande brandrisk" framing is **indefensible**.
- ✅ **Use the dedicated elcentral figures (defensible, on-topic, stronger):**
  > *Elsäkerhetsverket, "Elrelaterade bostadsbränder 2018–2022": elcentralen orsakade **298** registrerade händelser, varav **78 %** ledde till brand. Villa/radhus är **starkt överrepresenterade** (66 %).*
- Citation string for the fact-note: **"Källa: Elsäkerhetsverket, Elrelaterade bostadsbränder 2018–2022."**
- ⚠ SIGN-OFF: confirm the 298 / 78 % / 66 % figures against the published report table before launch.

### B2. Riskfaktorer (verified)
- Skruvsäkringar/porslinsproppar → ofta 30+ år, ofta underdimensionerad. ✅
- Saknad jordfelsbrytare → saknar modernt personskydd. ✅ **but legal nuance (B5).**
- Säkringar som löser ut ofta → tecken på överbelastning/fel. ✅ → **present symptom (floors to amber).**
- Varma uttag/strömbrytare, missfärgning, bränd lukt, flimmer → glappkontakt, en av de
  vanligaste orsakerna till värme/brand. ✅ → bränd lukt/missfärgning = **akut floor**.

### B3. Jordfelsbrytare wording — soften the superlative
- ❌ "bryter på millisekunder" overstates the standard.
- ✅ **"bryter mycket snabbt — inom bråkdelar av en sekund"** (regulatory max trip at 30 mA is **0,3 s**).
- JFB typ A vs B for laddbox, 30 mA / 32 A (SS 436 40 00), IEC 62955, avsnitt 722 distinction: **verified correct** (source: Ampy's "Jordfelsbrytare typ A eller B" PDF). Keep as-is.

### B4. Age rule-of-thumb — label it honestly
- "30–50 år → byte bör övervägas" is an **industry tumregel, NOT an Elsäkerhetsverket figure**
  (the authority makes no age breakdown). Present as branschens tumregel, never as authority-backed.
- Reconcile with Ampy's own anti-slentrian-byte stance ("överinstallation är inte säkerhet"):
  age raises a *question*, it is not a verdict.

### B5. Insurance + legality — keep "kan", never categorical
- ✅ **"Hemförsäkringen *kan* sätta ned eller neka ersättning om en skada beror på arbete som inte gjorts fackmannamässigt."** Every instance keeps "kan". A categorical "försäkringen gäller inte" reverses the burden of proof — forbidden.
- ⚠ A missing JFB in an **existing** old central is **NOT illegal** (no retroactive requirement; the 30 mA/32 A rule applies at nyinstallation/centralbyte). Copy says "saknar modernt personskydd / rekommenderas" — **never** "olagligt" or "du bryter mot lagen".

---

## C. READY AXIS — corrected facts (verified)
- Villa huvudsäkring typically **20 A**, common span **16–25 A**. ✅
- Laddbox kräver minst **16 A** huvudsäkring. ✅
- Lastbalansering tumregel: rekommenderas vid huvudsäkring **< 25 A**, vid **elvärme/värmepump**, och vid **flera laddfordon**. ✅
- Worked example (20 A + 11 kW / 16 A trefas laddbox → litet kvar till hushållet utan lastbalansering). ✅
- Grupper: gammal central ofta **6–10**, modern **16–24**. (Modern verified; old floor is a tumregel — ⚠ SIGN-OFF.)
- **Lastbalansering är en kapacitetsåtgärd, INTE en säkerhetsrisk** → renders as an **info pill**, never amber.

### C1. Nedsäkring saving — scope to Ellevio, use "kan", use the exact 2026 table
- ❌ Generic "1 500–3 000 kr/år" unscoped is indefensible.
- ✅ **"Hos Ellevio i Stockholm-området (fasta säkringsabonnemang återinförda 1 juni 2026) *kan* en nedsäkring sänka den fasta nätavgiften."** Examples from Ampy's Fasadmätarskåp-PDF: 20A→16A ≈ **1 600 kr/år**, 25A→16A ≈ **3 700 kr/år**.
- Ellevio 2026 årskostnad (for reference / the data file if shown): 16A = 3 200, 20A = 4 800, 25A = 6 900, 35A = 11 200 kr/år.
- ⚠ SIGN-OFF: confirm Ellevio 2026 figures; this is a money-SAVING honesty hook (high trust) so it must be exactly right.

---

## D. COST & AVDRAG — ⚠ HARD BLOCKER until reconciled

### D1. Centralbyte cost — the report's §8 math is WRONG and Ampy's own PDFs disagree
- ❌ Report's "15 000–35 000 före ROT / 10 500–24 500 efter ROT" derives efter-ROT by taking
  30 % off the **whole sum**. **ROT is 30 % on LABOUR only.** The result is both wrong and
  *lower than* Ampy's own published efter-ROT figure.
- Ampy's own three sources give **three conflicting** efter-ROT villa ranges:
  - "Byta elcentral 2026" matrix: **22 000–35 000 före ROT / 18 700–30 200 efter ROT**
  - "Byta elcentral 2026" body text: **18 000–35 000 före ROT / 12 600–24 500 efter ROT**
  - "Elcentral 2026 komplett guide": efter-ROT **18 000–35 000**
- **⚠ HARD BLOCKER (marknadsföringslagen):** the electrician must reconcile these into **ONE dated, signed range**. The data file ships with the matrix figures as the working default, flagged `_pending_signoff: true`, and **cannot go live** until signed.
- Working defaults for the data file (Stockholm, efter ROT, pending sign-off):
  - **Lägenhet:** 10 200–15 300 kr efter ROT (12 000–18 000 före)
  - **Radhus / mindre villa:** 13 600–22 400 kr efter ROT (16 000–26 000 före)
  - **Större villa:** 18 700–30 200 kr efter ROT (22 000–35 000 före)
  - Always shown as **spann + "Exakt pris kräver offert."**

### D2. ROT vs Grön teknik — the load-bearing legal claim (VERIFIED vs Skatteverket)
- ✅ **ROT = 30 % på arbetskostnaden**, tak **50 000 kr/person/år.** Gäller centralbyte, jordfelsbrytare. (ROT reverted to 30 % on **1 jan 2026**; the temporary 50 % ended 31 dec 2025 — **date-stamp it**.)
- ✅ **Grön teknik gäller INTE centralbyte.** This firewall is absolute (Skatteverket explicit).
- ✅ **Grön teknik gäller laddbox-delen: 50 %** (laddningspunkt, kabel till elcentral, laddkabel).
- ⚠ **Lastbalansering grön teknik is CONDITIONAL, not guaranteed.** Skatteverket allows it
  "i många fall" only when it is an **integral part of the laddbox installation**, case-by-case.
  Copy: **"Lastbalansering *kan* omfattas av grön teknik när den ingår som en del av laddboxinstallationen — bedöms av Skatteverket."** Never a flat 50 % guarantee.
- ⚠ **DOUBLE-DISCOUNT GUARD (invariant):** the Säker-inte-redo and Risk-inte-redo cells often show
  centralbyte (ROT, labour-base) AND laddbox (grön teknik, its own base) together. The cost block
  must render them as **two separate line items with two separate bases** and **never apply both avdrag to the same krona.** (This is the exact double-deduction bug class from the laddbox build.)

### D3. Jordfelsbrytare separat (replace "några tusenlappar")
- Typ A ≈ **1 500–2 500 kr/st installerad**; typ B (laddbox utan inbyggt DC-skydd) ≈ **4 500–5 400 kr installerad.** (Source: Ampy JFB PDF.) ⚠ SIGN-OFF the exact figures.

### D4. Elbesiktning price — MISSING, owner must supply
- Report defers to "Ampys egen lista". Not in any source. **Owner must supply the figure** for the data file.

---

## E. SIGN-OFF GATE (what blocks go-live)
1. ⚠ Reconciled, dated **villa/radhus/lägenhet centralbyte ranges** (D1) — electrician.
2. ⚠ The **scoring archetype truth table** (see SPEC §6) — electrician signs the verdicts, not the weights.
3. ⚠ **Elbesiktning price + JFB separat price** (D3, D4) — owner/electrician.
4. ⚠ **Brandstatistik figures** 298/78 %/66 % (B1) — confirm against the report.
5. ⚠ **Ellevio 2026 nätavgift** figures if the nedsäkring hook ships (C1).
6. ⚠ **Ad-copy substantiation**: every ad headline + search-trigger claim pre-cleared to the same standard (marknadsföringslagen applies to the ads too).
7. ⚠ **GDPR**: self-host fonts (no Google Fonts @import on an EU site) + lead-endpoint consent/DPA + privacy-policy URL.
