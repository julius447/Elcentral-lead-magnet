/* Engine oracle — asserts the data-file weights reproduce the signed archetype
   truth table (docs/SPEC.md §6). Run: node assets/engine.test.js
   Loads the REAL browser engine in a vm sandbox (pure functions only). */
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/elcentralkollen-data.json'), 'utf8'));

const sandbox = {
  console,
  navigator: {},
  window: { matchMedia: () => ({ matches: false }) },
  document: { addEventListener() {}, createElement: () => ({ getContext: () => ({}) }), querySelectorAll: () => [] },
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'assets/elcentralkollen.js'), 'utf8'), sandbox);
const { diagnose } = sandbox.window.AmpyEC;

// answer shorthand
const A = (alder, sakringstyp, jordfelsbrytare, varningstecken, huvudsakring, planer) =>
  ({ alder, sakringstyp, jordfelsbrytare, varningstecken, huvudsakring, planer });

const cases = [
  { id: 'A1', a: A('efter_2010', 'automat', 'ja', ['inget'], '25', ['inget']),                     safety: 'lag',     ready: 'ej_bedomd',        cell: 'sr', akut: false },
  { id: 'A2', a: A('efter_2010', 'automat', 'ja', ['inget'], '25', ['elbil']),                      safety: 'lag',     ready: 'redo_marginal',    cell: 'sr', akut: false },
  { id: 'A3', a: A('1990_2010', 'automat', 'ja', ['inget'], '20', ['elbil']),                        safety: 'lag',     ready: 'redo_med_atgard',  cell: 'si', akut: false },
  { id: 'A4', a: A('1990_2010', 'automat', 'ja', ['inget'], '16', ['elbil']),                        safety: 'lag',     ready: 'inte_redo',        cell: 'si', akut: false },
  { id: 'A5', a: A('1990_2010', 'automat', 'ja', ['varma_uttag'], '25', ['inget']),                  safety: 'forhojd', ready: 'ej_bedomd',        cell: 'rs', akut: false },
  { id: 'A6', a: A('efter_2010', 'automat', 'ja', ['brand_lukt'], '25', ['inget']),                  safety: 'forhojd', ready: 'ej_bedomd',        cell: 'rs', akut: true  },
  { id: 'A7', a: A('fore_1970', 'skruv', 'nej', ['inget'], '20', ['inget']),                          safety: 'hog',     ready: 'ej_bedomd',        cell: 'rs', akut: false },
  { id: 'A8', a: A('fore_1970', 'skruv', 'nej', ['loser_ut'], '16', ['elbil']),                       safety: 'hog',     ready: 'inte_redo',        cell: 'rr', akut: false },
  { id: 'A9', a: A('vet_inte', 'vet_inte', 'vet_inte', ['inget'], 'vet_inte', ['inget']),             safety: 'oklart',  ready: 'ej_bedomd',        cell: 'sr', akut: false },
  { id: 'A10', a: A('1970_1990', 'blandat', 'vet_inte', ['inget'], '20', ['varmepump']),              safety: 'forhojd', ready: 'kraver_bedomning', cell: 'rr', akut: false },
];

let pass = 0, fail = 0;
for (const c of cases) {
  const dx = diagnose(c.a, data);
  const got = { safety: dx.safety.state, ready: dx.ready.state, cell: dx.cell, akut: dx.safety.escalation };
  const ok = got.safety === c.safety && got.ready === c.ready && got.cell === c.cell && got.akut === c.akut;
  if (ok) { pass++; console.log(`  PASS ${c.id}  safety=${got.safety} ready=${got.ready} cell=${got.cell} akut=${got.akut} (score=${dx.safety.score}, unc=${dx.safety.uncertaintyCount})`); }
  else { fail++; console.log(`  FAIL ${c.id}\n    expected ${JSON.stringify(c)}\n    got      ${JSON.stringify(got)} score=${dx.safety.score}`); }
}

// Invariant guards (the bugs the red-team found)
function guard(name, cond) { if (cond) { pass++; console.log(`  PASS ${name}`); } else { fail++; console.log(`  FAIL ${name}`); } }
const warmOutlet = diagnose(A('1990_2010', 'automat', 'ja', ['varma_uttag'], '25', ['inget']), data);
guard('GUARD warm-outlet floors to amber (not green)', warmOutlet.safety.state === 'forhojd');
const brandLukt = diagnose(A('efter_2010', 'automat', 'ja', ['brand_lukt'], '25', ['inget']), data);
guard('GUARD brand-lukt overrides green + sets akut', brandLukt.safety.state !== 'lag' && brandLukt.safety.escalation === true);
const ignorant = diagnose(A('vet_inte', 'vet_inte', 'vet_inte', ['inget'], 'vet_inte', ['inget']), data);
guard('GUARD uncertainty renders oklart, NOT amber risk', ignorant.safety.state === 'oklart');

console.log(`\n${fail === 0 ? 'ALL GREEN' : 'FAILURES'} — ${pass} passed, ${fail} failed.`);
process.exit(fail === 0 ? 0 : 1);
