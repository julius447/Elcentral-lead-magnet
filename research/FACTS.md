# Elcentral-kollen — Substantiation dossier (fact base)

> **Status:** research-signed (June 2026), **pending human sign-off**. Every number
> below is what goes in `data/elcentralkollen-data.json`. Under marknadsföringslagen
> the burden of proof is reversed — nothing ships until an **auktoriserad elinstallatör**
> (and, for the avdrag lines, an accountant) signs the rows marked ⚠ SIGN-OFF.
>
> Sources: Ampy's own fact-reviewed PDFs (primary, on the owner's Desktop), plus
> Elsäkerhetsverket, Skatteverket, Ellevio. Two independent fact-checker agents
> verified each claim; the adversarial red-team adjudicated the conflicts.

---

## A. SCOPE DECISION (locked by CPO — NATIONAL)

**Ampy works across all of Sweden — prices are NATIONAL (nationally representative), not Stockholm.**
(Owner directive, 2026-06-11. This supersedes the earlier Stockholm scope.) The original
Ampy source PDFs are Stockholm-priced (~10–15 % above the national average), so the shipped numbers
were **re-researched to national spans** (research-signed, electrician confirms — see §D1).
→ Cost copy carries: **"Riktpriser för Sverige, {date}. De varierar med region, elnätsområde och anläggningens skick. Exakt pris kräver alltid en offert."**
→ To stay bulletproof under marknadsföringslagen, the UI shows the **pre-ROT span + the ROT rule**,
NOT a computed post-ROT kr figure, until the electrician signs the labour-share split (`costs.centralbyte._labour_signed`).

---

## B. SAFETY AXIS — corrected facts

### B1. Brandstatistik — DROP the generic superlative, use the on-topic Elsäkerhetsverket figures
- ❌ **Do NOT** use "el är en av de vanligaste brandorsakerna" as a general claim. Fixed
  electrical installations are only **28 %** of electrical residential fires (electrical products 48 %;
  incorrect use of e.g. the stove alone exceeds all equipment faults). The fixed-installation
  trend is *decreasing* (~9 %), so any "växande brandrisk" framing is **indefensible**.
- ✅ **Use the dedicated elcentral figures (defensible, on-topic, stronger):**
  > *Elsäkerhetsverket, "Elrelaterade bostadsbränder 2018–2022": elcentralen orsakade **298** registrerade händelser, varav **78 %** ledde till brand. Villa/radhus är **starkt överrepresenterade** (66 %).*
- Citation string for the fact-note: **"Källa: Elsäkerhetsverket, Elrelaterade bostadsbränder 2018–2022."**
- ⚠ SIGN-OFF: confirm the 298 / 78 % / 66 % figures against the published report table before launch.

### B2. Risk factors (verified)
- Screw-in fuses / porcelain plugs → often 30+ years old, often underdimensioned. ✅
- Missing jordfelsbrytare → lacks modern personal protection. ✅ **but legal nuance (B5).**
- Fuses that trip often → a sign of overload/fault. ✅ → **present symptom (floors to amber).**
- Warm outlets/switches, discolouration, burnt smell, flicker → loose contact, one of the
  most common causes of heat/fire. ✅ → burnt smell/discolouration = **akut floor**.

### B3. Jordfelsbrytare wording — soften the superlative
- ❌ "bryter på millisekunder" overstates the standard.
- ✅ **"bryter mycket snabbt — inom bråkdelar av en sekund"** (regulatory max trip at 30 mA is **0,3 s**).
- JFB type A vs B for laddbox, 30 mA / 32 A (SS 436 40 00), IEC 62955, section 722 distinction: **verified correct** (source: Ampy's "Jordfelsbrytare typ A eller B" PDF). Keep as-is.

### B4. Age rule-of-thumb — label it honestly
- "30–50 år → byte bör övervägas" is an **industry tumregel (rule of thumb), NOT an Elsäkerhetsverket figure**
  (the authority makes no age breakdown). Present it as an industry rule of thumb, never as authority-backed.
- Reconcile with Ampy's own anti-routine-replacement stance ("överinstallation är inte säkerhet"):
  age raises a *question*, it is not a verdict.

### B5. Insurance + legality — keep "kan", never categorical
- ✅ **"Hemförsäkringen *kan* sätta ned eller neka ersättning om en skada beror på arbete som inte gjorts fackmannamässigt."** Every instance keeps "kan". A categorical "försäkringen gäller inte" reverses the burden of proof — forbidden.
- ⚠ A missing JFB in an **existing** old central is **NOT illegal** (no retroactive requirement; the 30 mA/32 A rule applies at new installation/centralbyte). Copy says "saknar modernt personskydd / rekommenderas" — **never** "olagligt" or "du bryter mot lagen".

---

## C. READY AXIS — corrected facts (verified)
- Villa main fuse typically **20 A**, common span **16–25 A**. ✅
- A laddbox requires at least a **16 A** main fuse. ✅
- Load-balancing rule of thumb: recommended when the main fuse is **< 25 A**, with **electric heating / heat pump**, and with **multiple charging vehicles**. ✅
- Worked example (20 A + 11 kW / 16 A three-phase laddbox → little left for the household without load balancing). ✅
- Circuit groups: an old central often **6–10**, a modern one **16–24**. (Modern verified; the old-central floor is a rule of thumb — ⚠ SIGN-OFF.)
- **Load balancing is a capacity measure, NOT a safety risk** → renders as an **info pill**, never amber.

### C1. Fuse-downgrade (nedsäkring) saving — scope to Ellevio, use "kan", use the exact 2026 table
- ❌ A generic, unscoped "1 500–3 000 kr/år" is indefensible.
- ✅ **"Hos Ellevio i Stockholm-området (fasta säkringsabonnemang återinförda 1 juni 2026) *kan* en nedsäkring sänka den fasta nätavgiften."** Examples from Ampy's Fasadmätarskåp PDF: 20A→16A ≈ **1 600 kr/år**, 25A→16A ≈ **3 700 kr/år**.
- Ellevio 2026 annual cost (for reference / the data file if shown): 16A = 3 200, 20A = 4 800, 25A = 6 900, 35A = 11 200 kr/år.
- ⚠ SIGN-OFF: confirm the Ellevio 2026 figures; this is a money-SAVING honesty hook (high trust) so it must be exactly right.

---

## D. COST & AVDRAG — ⚠ HARD BLOCKER until reconciled

### D1. Centralbyte cost — the report's §8 math is WRONG and Ampy's own PDFs disagree
- ❌ The report's "15 000–35 000 före ROT / 10 500–24 500 efter ROT" derives the post-ROT figure by taking
  30 % off the **whole sum**. **ROT is 30 % on LABOUR only.** The result is both wrong and
  *lower than* Ampy's own published post-ROT figure.
- Ampy's own three sources give **three conflicting** post-ROT villa ranges:
  - "Byta elcentral 2026" matrix: **22 000–35 000 före ROT / 18 700–30 200 efter ROT**
  - "Byta elcentral 2026" body text: **18 000–35 000 före ROT / 12 600–24 500 efter ROT**
  - "Elcentral 2026 komplett guide": efter-ROT **18 000–35 000**
- **⚠ HARD BLOCKER (marknadsföringslagen):** the electrician must reconcile these into **ONE dated, signed range**. The data file ships with the matrix figures as the working default, flagged `_pending_signoff: true`, and **cannot go live** until signed.
- Working defaults for the data file (Stockholm, post-ROT, pending sign-off):
  - **Apartment:** 10 200–15 300 kr after ROT (12 000–18 000 before)
  - **Terraced house / smaller villa:** 13 600–22 400 kr after ROT (16 000–26 000 before)
  - **Larger villa:** 18 700–30 200 kr after ROT (22 000–35 000 before)
  - Always shown as a **span + "Exakt pris kräver offert."**

### D2. ROT vs Grön teknik — the load-bearing legal claim (VERIFIED against Skatteverket)
- ✅ **ROT = 30 % of the labour cost**, cap **50 000 kr/person/year.** Applies to centralbyte, jordfelsbrytare. (ROT reverted to 30 % on **1 Jan 2026**; the temporary 50 % ended 31 Dec 2025 — **date-stamp it**.)
- ✅ **Grön teknik does NOT apply to centralbyte.** This firewall is absolute (Skatteverket explicit).
- ✅ **Grön teknik applies to the laddbox portion: 50 %** (charging point, cable to the elcentral, charging cable).
- ⚠ **Load-balancing grön teknik is CONDITIONAL, not guaranteed.** Skatteverket allows it
  "in many cases" only when it is an **integral part of the laddbox installation**, case-by-case.
  Copy: **"Lastbalansering *kan* omfattas av grön teknik när den ingår som en del av laddboxinstallationen — bedöms av Skatteverket."** Never a flat 50 % guarantee.
- ⚠ **DOUBLE-DISCOUNT GUARD (invariant):** the Säker-inte-redo and Risk-inte-redo cells often show
  centralbyte (ROT, labour base) AND laddbox (grön teknik, its own base) together. The cost block
  must render them as **two separate line items with two separate bases** and **never apply both avdrag to the same krona.** (This is the exact double-deduction bug class from the laddbox build.)

### D3. Jordfelsbrytare as a standalone item (replace "några tusenlappar")
- Type A ≈ **1 500–2 500 kr each installed**; type B (laddbox without built-in DC protection) ≈ **4 500–5 400 kr installed.** (Source: Ampy JFB PDF.) ⚠ SIGN-OFF the exact figures.

### D4. Elbesiktning price — MISSING, owner must supply
- The report defers to "Ampys egen lista". Not in any source. **The owner must supply the figure** for the data file.

---

## E. SIGN-OFF GATE (what blocks go-live)
1. ⚠ Reconciled, dated **villa / terraced-house / apartment centralbyte ranges** (D1) — electrician.
2. ⚠ The **scoring archetype truth table** (see SPEC §6) — the electrician signs the verdicts, not the weights.
3. ⚠ **Elbesiktning price + standalone JFB price** (D3, D4) — owner/electrician.
4. ⚠ **Brandstatistik figures** 298/78 %/66 % (B1) — confirm against the report.
5. ⚠ **Ellevio 2026 nätavgift** figures if the nedsäkring hook ships (C1).
6. ⚠ **Ad-copy substantiation**: every ad headline + search-trigger claim pre-cleared to the same standard (marknadsföringslagen applies to the ads too).
7. ⚠ **GDPR**: self-host fonts (no Google Fonts @import on an EU site) + lead-endpoint consent/DPA + privacy-policy URL.
