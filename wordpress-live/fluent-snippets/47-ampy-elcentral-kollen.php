<?php
// <Internal Doc Start>
/*
*
* @description: 
* @tags: 
* @group: 
* @name: Ampy - Elcentral-kollen - JS Engine
* @type: js
* @status: published
* @created_by: 13
* @created_at: 2026-06-18 08:45:31
* @updated_at: 2026-07-21 22:59:56
* @is_valid: 1
* @updated_by: 13
* @priority: 10
* @run_at: wp_footer
* @load_as_file: yes
* @load_in_block_editor: 
* @condition: {"status":"no","run_if":"assertive","items":[[]]}
*/
?>
<?php if (!defined("ABSPATH")) { return;} // <Internal Doc End> ?>
/* Elcentral-kollen - Fluent Snippet 3/3 (type: JS).
   BYTE-IDENTICAL to assets/elcentralkollen.js. The data is injected by the PHP snippet as
   window.AmpyEC.data (the plugin's own boot() reads it), so nothing here is modified. */
/* ============================================================================
   Elcentral-kollen v2.17 — diagnosis engine + wizard (vanilla ES6, no build)
     1. DATA   — elcentralkollen-data.json (single source of truth)
     2. ENGINE — pure compute: effective panel age (central_alder, hus_alder
                 as proxy) + fuse type + RCD + symptom floor -> 2x2 cell
     3. VIEW   — start -> 7 questions -> two-axis verdict. Two-pane shell on desktop.
   Doctrine: docs/SPEC.md + docs/DESIGN.md. UI copy is Swedish by design.
   ============================================================================ */
(function () {
  'use strict';
  // Double-load guard (live): the snippet may be enqueued inline AND as a cached file
  // by the lead-magnet asset gate; boot the engine only once.
  if (window._AmpyEcLoaded) { return; }
  window._AmpyEcLoaded = true;

  // Safari/iOS <14 (old FB/IG webviews) lacks replaceChildren — without this the tool never boots there.
  if (typeof Element !== 'undefined' && !Element.prototype.replaceChildren) {
    Element.prototype.replaceChildren = function () {
      while (this.firstChild) this.removeChild(this.firstChild);
      for (var i = 0; i < arguments.length; i++) this.appendChild(arguments[i]);
    };
  }

  const ICONS = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
    checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/></svg>',
    ban: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="6" y1="12" x2="18" y2="12"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    arrowUpRight: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.13916 12.75L12.4808 5.25M12.4808 5.25H5.13916M12.4808 5.25V12.75"/></svg>',
    phoneAmpy: '<svg viewBox="0 0 19 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11.9146 4.16668C12.6878 4.32548 13.3984 4.72356 13.9555 5.30996C14.5126 5.89635 14.8908 6.6444 15.0416 7.45834M11.9146 0.833344C13.5211 1.02121 15.0191 1.77849 16.1628 2.98085C17.3065 4.18321 18.0278 5.75918 18.2083 7.45001M17.4166 14.1V16.6C17.4175 16.8321 17.3724 17.0618 17.284 17.2745C17.1957 17.4871 17.0662 17.678 16.9037 17.8349C16.7412 17.9918 16.5494 18.1112 16.3406 18.1856C16.1317 18.26 15.9104 18.2876 15.6908 18.2667C13.2547 17.988 10.9147 17.1118 8.85872 15.7083C6.94591 14.4289 5.32419 12.7218 4.10872 10.7083C2.77078 8.53435 1.93816 6.05917 1.6783 3.48334C1.65852 3.2529 1.68454 3.02064 1.7547 2.80136C1.82486 2.58208 1.93763 2.38058 2.08582 2.20969C2.23402 2.0388 2.4144 1.90227 2.61547 1.80878C2.81654 1.71529 3.0339 1.66689 3.25372 1.66668H5.62872C6.01292 1.6627 6.38539 1.80591 6.6767 2.06962C6.968 2.33333 7.15828 2.69955 7.21205 3.10001C7.31229 3.90007 7.4982 4.68562 7.76622 5.44168C7.87273 5.73995 7.89578 6.06411 7.83264 6.37574C7.7695 6.68738 7.62282 6.97344 7.40997 7.20001L6.40455 8.25834C7.53153 10.3446 9.17258 12.072 11.1546 13.2583L12.16 12.2C12.3752 11.976 12.647 11.8216 12.943 11.7551C13.2391 11.6886 13.547 11.7129 13.8304 11.825C14.5486 12.1071 15.2949 12.3028 16.055 12.4083C16.4395 12.4655 16.7907 12.6693 17.0418 12.9813C17.2929 13.2932 17.4263 13.6913 17.4166 14.1Z"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
    xtwitter: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    reddit: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm5.01 9.21c.026.18.04.365.04.55 0 2.8-3.262 5.07-7.286 5.07-4.024 0-7.286-2.27-7.286-5.07 0-.19.014-.378.042-.562a1.412 1.412 0 0 1-.65-1.187 1.42 1.42 0 0 1 2.408-1.018 7.157 7.157 0 0 1 3.864-1.21l.737-3.468a.3.3 0 0 1 .357-.23l2.434.518a1.01 1.01 0 1 1-.117.562l-2.155-.458-.66 3.11a7.15 7.15 0 0 1 3.806 1.205 1.42 1.42 0 1 1 1.715 2.205zM8.5 11.75a1.06 1.06 0 1 0 2.12 0 1.06 1.06 0 0 0-2.12 0zm5.69 2.92c-.74.74-2.27.8-2.69.8-.42 0-1.95-.06-2.69-.8a.27.27 0 0 1 .38-.38c.46.46 1.45.63 2.31.63.86 0 1.85-.17 2.31-.63a.27.27 0 1 1 .38.38zm-.13-1.86a1.06 1.06 0 1 1 0-2.12 1.06 1.06 0 0 1 0 2.12z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'
  };
  const icon = (name) => ICONS[name] || ICONS.info;

  const START_ILLU = '<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    + '<circle cx="60" cy="60" r="56" fill="#f0f9f5"/>'
    + '<rect x="40" y="30" width="40" height="62" rx="6" fill="#ffffff" stroke="#090b32" stroke-width="2.5"/>'
    + '<line x1="40" y1="45" x2="80" y2="45" stroke="#090b32" stroke-width="2"/>'
    + '<rect x="46" y="54" width="12" height="6" rx="2" fill="#00a991"/><rect x="62" y="54" width="12" height="6" rx="2" fill="#e3e5ed"/>'
    + '<rect x="46" y="66" width="12" height="6" rx="2" fill="#e3e5ed"/><rect x="62" y="66" width="12" height="6" rx="2" fill="#00a991"/>'
    + '<rect x="46" y="78" width="12" height="6" rx="2" fill="#00a991"/><rect x="62" y="78" width="12" height="6" rx="2" fill="#e3e5ed"/>'
    + '<circle cx="83" cy="37" r="14" fill="#007a69"/><path d="M77 37l4 4 8-8" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const el = (tag, attrs, children) => {
    const node = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') node.className = attrs[k];
      else if (k === 'html') node.innerHTML = attrs[k];
      else if (k.startsWith('on') && typeof attrs[k] === 'function') node.addEventListener(k.slice(2), attrs[k]);
      else if (k === 'data') for (const dk in attrs[k]) node.dataset[dk] = attrs[k][dk];
      else if (k === 'style' && typeof attrs[k] === 'object') for (const sk in attrs[k]) node.style.setProperty(sk, attrs[k][sk]);
      else if (attrs[k] === true) node.setAttribute(k, '');
      else if (attrs[k] !== false && attrs[k] != null) node.setAttribute(k, attrs[k]);
    }
    if (children) (Array.isArray(children) ? children : [children]).forEach(c => { if (c == null || c === false) return; node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return node;
  };
  const iconSpan = (name, cls) => el('span', { class: cls || null, html: icon(name), 'aria-hidden': 'true', style: 'display:inline-flex' });

  /* ===================== ENGINE ===================== */
  const LEVEL_ORDER = { lag: 0, forhojd: 1, hog: 2 };
  const maxLevel = (a, b) => (LEVEL_ORDER[a] >= LEVEL_ORDER[b] ? a : b);

  // Effective panel age for scoring: central_alder drives it, hus_alder is the proxy when 'original'.
  function effectiveCentralAge(a, data) {
    const c = a.central_alder, hus = a.hus_alder, map = (data.scoring.central_age_map || {});
    if (c === 'recent' || c === 'older') return { bracket: map[c], uncertain: false };
    if (c === 'original') { const known = hus && hus !== 'vet_inte'; return { bracket: known ? hus : null, uncertain: !known }; }
    // c === 'vet_inte' / undefined: proxy off the house but mark as uncertain
    const known = hus && hus !== 'vet_inte';
    return { bracket: known ? hus : null, uncertain: true };
  }

  function computeSafety(answers, data) {
    const w = data.scoring.weights, warn = answers.varningstecken || [];
    const eca = effectiveCentralAge(answers, data);
    let score = (w.alder[eca.bracket] || 0) + (w.sakringstyp[answers.sakringstyp] || 0) + (w.jordfelsbrytare[answers.jordfelsbrytare] || 0);
    warn.forEach(id => { score += (w.varningstecken[id] || 0); });
    const t = data.scoring.thresholds;
    let level = score >= t.hog ? 'hog' : (score >= t.forhojd ? 'forhojd' : 'lag');
    const floors = data.scoring.floors;
    const presentSymptom = floors.present_symptom.trigger_ids.some(id => warn.includes(id));
    if (presentSymptom) level = maxLevel(level, floors.present_symptom.min_level);
    const escalation = warn.includes(floors.escalation.trigger_id);
    if (escalation) level = maxLevel(level, floors.escalation.min_level);
    const unc = data.scoring.uncertainty;
    const uncertaintyCount = (eca.uncertain ? 1 : 0) + unc.counts_fields.filter(f => answers[f] === 'vet_inte').length;
    let state = level;
    if (level === 'lag' && uncertaintyCount >= unc.min_count && !presentSymptom && !escalation) state = 'oklart';
    return { score, level, state, uncertaintyCount, presentSymptom, escalation, ecaBracket: eca.bracket };
  }
  const pickPrimaryPlan = (planer) => ['elbil', 'varmepump', 'solceller', 'renovering'].find(p => (planer || []).includes(p)) || null;
  function computeReady(answers, data) {
    const planer = answers.planer || [];
    if (!planer.length || planer.includes('inget')) return { state: 'ej_bedomd', plan: null };
    const plan = pickPrimaryPlan(planer);
    for (const r of data.scoring.ready.rules) { if (r.plan !== plan) continue; if (r.huvudsakring && !r.huvudsakring.includes(answers.huvudsakring)) continue; return { state: r.state, plan }; }
    return { state: 'kraver_bedomning', plan };
  }
  function computeCrossAxis(answers, data) {
    const out = {}, eca = effectiveCentralAge(answers, data);
    (data.scoring.cross_axis_rules || []).forEach(rule => {
      const c = rule.if; let ok = true;
      if (c.central_age_in && !c.central_age_in.includes(eca.bracket)) ok = false;
      if (c.sakringstyp && answers.sakringstyp !== c.sakringstyp) ok = false;
      if (c.has_any_plan) { const p = answers.planer || []; if (!p.length || (p.length === 1 && p.includes('inget'))) ok = false; }
      if (ok) { out.ready_finding = rule.then.ready_finding; }
    });
    return out;
  }
  function computeCell(safety, ready) {
    const safe = (safety.state === 'lag' || safety.state === 'oklart');
    if (ready.state === 'ej_bedomd') return safe ? 'sr' : 'rs';
    const redo = (ready.state === 'redo_marginal');
    if (safe) return redo ? 'sr' : 'si';
    return redo ? 'rs' : 'rr';
  }
  function diagnose(answers, data) {
    const safety = computeSafety(answers, data), ready = computeReady(answers, data), crossAxis = computeCrossAxis(answers, data);
    return { answers, safety, ready, crossAxis, cell: computeCell(safety, ready) };
  }
  function findingMatches(when, dx, data) {
    const a = dx.answers;
    if (when.sakringstyp && a.sakringstyp !== when.sakringstyp) return false;
    if (when.jordfelsbrytare && a.jordfelsbrytare !== when.jordfelsbrytare) return false;
    if (when.central_alder && a.central_alder !== when.central_alder) return false;
    if (when.huvudsakring && a.huvudsakring !== when.huvudsakring) return false;
    if (when.huvudsakring_in && !when.huvudsakring_in.includes(a.huvudsakring)) return false;
    if (when.central_age_in) { const b = effectiveCentralAge(a, data).bracket; if (!when.central_age_in.includes(b)) return false; }
    if (when.varningstecken_has && !(a.varningstecken || []).includes(when.varningstecken_has)) return false;
    if (when.ready_state && dx.ready.state !== when.ready_state) return false;
    if (when.cross_axis && dx.crossAxis.ready_finding !== when.cross_axis) return false;
    if (when.no_plan) { const p = a.planer || []; if (p.length && !(p.length === 1 && p.includes('inget'))) return false; }
    return true;
  }
  function collectFindings(dx, data) {
    let matched = (data.findings || []).filter(f => findingMatches(f.when, dx, data)).filter(f => f.id !== 'f_brand_lukt');
    // During akut (burnt smell): no cheery OK rows and never the fuse-downsizing tip next to a red warning.
    if (dx.safety.escalation) matched = matched.filter(f => f.icon !== 'ok' && f.id !== 'f_nedsakring');
    if (matched.some(f => f.icon === 'warn')) matched = matched.filter(f => f.id !== 'f_nedsakring');
    const hasWarn = matched.some(f => f.icon === 'warn');
    const order = hasWarn ? { warn: 0, info: 1, ok: 2 } : { ok: 0, info: 1, warn: 2 };
    return matched.sort((x, y) => (order[x.icon] - order[y.icon]) || ((x.rank || 50) - (y.rank || 50)));
  }

  /* ===================== APP ===================== */
  class ElcentralApp {
    constructor(mount, data) {
      this.mount = mount; this.data = data; this.questions = data.questions;
      this.N = this.questions.length;            // number of questions (7)
      this.answers = {}; this.step = 0;          // 0 = start, 1..N = questions, N+1 = verdict
      this.dir = 'fwd'; this._flashT = null; this.stage = null; this._booted = false; this._tracked = {}; this.leadOpen = false;
      this.hydrateFromUrl(); this.bindHistory();
    }

    encodeVector() {
      const pre = this.data.state_schema.prefixes;
      return this.questions.map(q => {
        const ans = this.answers[q.id]; if (ans == null) return null;
        const idxOf = (id) => q.options.findIndex(o => o.id === id);
        if (q.type === 'multi') { const ids = Array.isArray(ans) ? ans : [ans]; return pre[q.id] + ids.map(idxOf).filter(i => i >= 0).sort((a, b) => a - b).join(''); }
        return pre[q.id] + idxOf(ans);
      }).filter(Boolean).join('.');
    }
    decodeVector(str) {
      if (!str) return {};
      const byPrefix = {}; Object.entries(this.data.state_schema.prefixes).forEach(([qid, p]) => { byPrefix[p] = qid; });
      const out = {};
      str.split('.').forEach(seg => {
        const qid = byPrefix[seg[0]]; if (!qid) return;
        const q = this.questions.find(qq => qq.id === qid); if (!q) return;
        const digits = seg.slice(1);
        if (q.type === 'multi') { out[qid] = Array.from(new Set(digits.split('').map(d => q.options[parseInt(d, 10)]).filter(Boolean).map(o => o.id))); const exq = q.options.find(o => o.exclusive); if (exq && out[qid].includes(exq.id)) out[qid] = [exq.id]; } // Set-dedupe: a crafted ?q= with repeated digits must not double-count symptom weights
        else { const idx = parseInt(digits, 10); const o = (digits.length === 1 && idx >= 0 && idx < q.options.length) ? q.options[idx] : null; if (o) out[qid] = o.id; }
      });
      return out;
    }
    hydrateFromUrl() {
      const vec = new URLSearchParams(window.location.search).get('q');
      // Honesty moat: a truncated/broken ?q= must NEVER show a fabricated verdict. Multi must be a
      // non-empty array (decodeVector returns []=empty for out-of-range digits, and [] != null) → otherwise start.
      if (vec) { this.answers = this.decodeVector(vec); const complete = this.questions.every(q => { const v = this.answers[q.id]; return q.type === 'multi' ? (Array.isArray(v) && v.length > 0) : v != null; }); this.step = complete ? (this.N + 1) : 0; }
    }
    writeResultUrl(push) {
      const p = new URLSearchParams(window.location.search); p.set('q', this.encodeVector());
      const url = window.location.pathname + '?' + p.toString() + window.location.hash;
      if (push) history.pushState({ step: this.N + 1 }, '', url); else history.replaceState({ step: this.N + 1 }, '', url);
    }
    bindHistory() { window.addEventListener('popstate', () => {
      this.leadOpen = false;
      // Back from a fresh verdict pops to the clean URL (no ?q=): reset explicitly — otherwise
      // hydrateFromUrl no-ops and the view stays frozen on the result (dead back press).
      if (!new URLSearchParams(window.location.search).has('q')) { this.answers = {}; this.step = (window.history.state && typeof window.history.state.step === 'number') ? window.history.state.step : 0; }
      else this.hydrateFromUrl();
      this.render();
    }); }

    answerSingle(q, optionId) { this.answers[q.id] = optionId; this.advance(); }
    toggleMulti(q, optionId) {
      const opt = q.options.find(o => o.id === optionId);
      let cur = Array.isArray(this.answers[q.id]) ? this.answers[q.id].slice() : [];
      if (opt.exclusive) cur = cur.includes(optionId) ? [] : [optionId];
      else { cur = cur.filter(id => { const o = q.options.find(oo => oo.id === id); return !(o && o.exclusive); }); cur = cur.includes(optionId) ? cur.filter(id => id !== optionId) : cur.concat(optionId); }
      this.answers[q.id] = cur;
    }
    track(event, params) { try { const dl = (window.dataLayer = window.dataLayer || []); const key = event + ':' + (params && params.step != null ? params.step : ''); if (this._tracked[key]) return; this._tracked[key] = true; dl.push(Object.assign({ event: 'ampy_ec_' + event }, params || {})); } catch (e) {} }
    advance() { this.dir = 'fwd'; this.leadOpen = false; this._navScroll = true; if (this.step === 0) this.track('quiz_start', {}); if (this.step >= this.N) { this.step = this.N + 1; this.writeResultUrl(true); } else this.step += 1; this.render(); }
    openLead(source) { this.leadOpen = true; this._navScroll = true; try { this.track('lead_form_open', Object.assign({ cell: diagnose(this.answers, this.data).cell }, source ? { cta_source: source } : {})); } catch (e) {} this.render(); }
    closeLead() { this.leadOpen = false; this._navScroll = true; this.render(); }
    back() { this.dir = 'back'; this.leadOpen = false; this._navScroll = true; if (this.step > this.N && new URLSearchParams(window.location.search).has('q')) history.replaceState({ step: this.step }, '', window.location.pathname + window.location.hash); if (this.step > 0) this.step -= 1; if (this.step > this.N) this.step = this.N; this.render(); }
    restart() { this.dir = 'back'; this.answers = {}; this.step = 0; this._tracked = {}; this.leadOpen = false; this._navScroll = true; history.pushState({ step: 0 }, '', window.location.pathname + window.location.hash); this.render(); }
    // Every in-widget navigation (answer tap, Fortsätt, Tillbaka, open/close the lead form, Börja om)
    // scrolls the NEW view's top into view — otherwise a tap at the bottom of a tall step leaves the
    // next title above the viewport. Guarded: skips when the top is already comfortably visible
    // (no desktop micro-jumps) and never fires on first paint (no embed hijack).
    _scrollToStage() {
      try {
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const behavior = reduce ? 'auto' : 'smooth';
        const twoPane = typeof window.matchMedia === 'function' && window.matchMedia('(min-width: 1024px)').matches;

        // DESKTOP QUESTION SLIDE: FIT the whole card below the fixed header, so the bottom (the info
        // note / "Fortsätt" button) is visible without scrolling. Move the card UP (scroll down) only
        // when the bottom is cut off, and never push the card top under the header — a card that fits
        // becomes fully visible; a card taller than the viewport top-aligns (best effort). No jump
        // when the card is already fully on-screen. (owner: "verktyget flyttas upp lite så att man ser allt".)
        if (twoPane && this.step > 0 && this.step <= this.N) {
          const card = this.stage.querySelector('.ampy-ec__block');
          if (!card) return;
          const offset = parseFloat(getComputedStyle(this.stage).scrollMarginTop) || 0;
          const fit = (smooth) => {
            const cr = card.getBoundingClientRect();
            const curY = window.scrollY || window.pageYOffset || 0;
            const margin = 16;
            let targetY = null;
            if (cr.top < offset - 2) {
              targetY = cr.top + curY - offset;                                   // top hidden under header → bring it down
            } else if (cr.bottom > vh - margin) {
              const delta = Math.min(cr.bottom - (vh - margin), cr.top - offset); // bottom cut → move card up, capped at top hitting header
              if (delta > 2) targetY = curY + delta;
            }
            if (targetY != null) { targetY = Math.max(0, targetY); if (Math.abs(targetY - curY) > 4) window.scrollTo({ top: targetY, behavior: smooth ? behavior : 'auto' }); }
          };
          fit(true);
          clearTimeout(this._scrollT); this._scrollT = setTimeout(() => { try { fit(false); } catch (e2) {} }, 650); // settle guard vs cancelled smooth scroll
          return;
        }

        // MOBILE / start / result / lead: align the tool (or the mount, on the start view where the
        // H1 + lead sit above it) top just below the header.
        const target = (this.step <= 0 && !this.leadOpen) ? this.mount : this.stage;
        const r = target.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;               // tool not in play → leave the page alone
        if (r.top >= 0 && r.top < vh * 0.4) return;            // top already visible near the top → no jump
        target.scrollIntoView({ behavior, block: 'start' });
        clearTimeout(this._scrollT);
        this._scrollT = setTimeout(() => {
          try {
            const want = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
            const top = target.getBoundingClientRect().top;
            if (top < want - 8) target.scrollIntoView({ behavior: 'auto', block: 'start' });
          } catch (e2) {}
        }, 650);
      } catch (e) {}
    }

    buildShell() {
      this.mount.replaceChildren(); this.mount.dataset.booted = 'true';
      this.mount.lang = 'sv'; // Swedish tool — pronounced correctly even if the host page is lang="en" (WCAG 3.1.2)
      const shell = el('div', { class: 'ampy-ec__shell' });
      this.shell = shell;
      const rail = this.renderRail();
      shell.appendChild(rail);
      this.stage = el('div', { class: 'ampy-ec__stage' });
      shell.appendChild(this.stage); this.mount.appendChild(shell);
      // Keyboard/SR order must MATCH the visual order. On mobile the stat + contact CTAs render
      // BELOW the tool (CSS order), so reparent the real DOM nodes after the stage there — and back
      // into the rail on desktop. Purely structural; the CSS order/visibility rules still apply.
      try {
        const stat = rail.querySelector('.ampy-ec__rail-stat'), actions = rail.querySelector('.ampy-ec__rail-actions'), ask = rail.querySelector('.ampy-ec__rail-ask');
        const place = (mobile) => {
          // Mobile below-tool block order: "Hellre prata…" heading → contact CTAs → stat line.
          if (mobile) { if (ask) shell.appendChild(ask); if (actions) shell.appendChild(actions); if (stat) shell.appendChild(stat); }
          else { if (ask) rail.appendChild(ask); if (actions) rail.appendChild(actions); if (stat) rail.appendChild(stat); }
        };
        const mq = window.matchMedia('(max-width: 1023px)');
        let placed = mq.matches; place(placed);
        const sync = () => { if (mq.matches !== placed) { placed = mq.matches; place(placed); } if (this._booted) this.syncStickyCta(); };
        if (mq.addEventListener) mq.addEventListener('change', sync); else if (mq.addListener) mq.addListener(sync);
        // Belt & braces: some environments don't fire matchMedia change on resize/emulation.
        window.addEventListener('resize', () => { clearTimeout(this._mqT); this._mqT = setTimeout(sync, 120); });
      } catch (e) {}
    }
    renderRail() {
      const m = this.data.meta, rail = m.rail || {};
      const aside = el('aside', { class: 'ampy-ec__rail' });
      aside.appendChild(el('h1', { class: 'ampy-ec__rail-heading' }, m.page_heading));
      aside.appendChild(el('p', { class: 'ampy-ec__rail-lead' }, m.page_lead));
      // Trust bullets (replace the credential box) — icon + text, optionally a verifiable link.
      const bullets = rail.bullets || [];
      if (bullets.length) {
        const ul = el('ul', { class: 'ampy-ec__rail-bullets', role: 'list' });
        bullets.forEach(b => {
          const textNode = b.link
            ? el('a', { class: 'ampy-ec__rail-bullet-link', href: b.link, target: '_blank', rel: 'noopener noreferrer' }, b.text)
            : document.createTextNode(b.text);
          ul.appendChild(el('li', { class: 'ampy-ec__rail-bullet' }, [iconSpan(b.icon || 'check', 'ampy-ec__rail-bullet-icon'), el('span', {}, [textNode])]));
        });
        aside.appendChild(ul);
      }
      // Mobile-only "talk to an electrician" heading above the contact CTAs (desktop: hidden via CSS).
      if (rail.contact_heading) aside.appendChild(el('p', { class: 'ampy-ec__rail-ask' }, rail.contact_heading));
      // Two contact CTAs (1:1 replica of ampy.se: Contact us + phone, gradient pills).
      const contact = rail.contact || {};
      aside.appendChild(el('div', { class: 'ampy-ec__rail-actions' }, [
        el('a', { class: 'ampy-ec__rail-contact', href: contact.contact_url || m.ampy_offert_url, target: '_blank', rel: 'noopener noreferrer' }, [el('span', {}, (contact.contact_label || 'Kontakta oss')), iconSpan('arrowUpRight', 'ampy-ec__rail-contact-icon')]),
        el('a', { class: 'ampy-ec__rail-phone', href: contact.phone_url || 'tel:+46102657979' }, [el('span', {}, (contact.phone_label || '010-265 79 79')), iconSpan('phoneAmpy', 'ampy-ec__rail-phone-icon')])
      ]));
      // Sourced stakes line (real Elsäkerhetsverket stat) — under the CTAs on desktop, under the tool on mobile.
      if (rail.stat && rail.stat.rest) {
        aside.appendChild(el('p', { class: 'ampy-ec__rail-stat' }, [
          el('a', { class: 'ampy-ec__rail-stat-link', href: rail.stat.url, target: '_blank', rel: 'noopener noreferrer' }, (rail.stat.link || 'Elsäkerhetsverket')),
          rail.stat.rest
        ]));
      }
      return aside;
    }

    render() {
      const noscript = this.mount.querySelector('.ampy-ec__noscript'); if (noscript) noscript.remove();
      if (!this.stage) this.buildShell();
      this._stickyDef = null; // reset each render; renderResult sets it fresh (never reuse a stale def on a non-result view)
      if (this._closeShareMenu) { try { this._closeShareMenu(); } catch (e) {} this._closeShareMenu = null; } // an open share menu must release its document listeners before the stage is replaced
      // JS-set view state → CSS fallback for :has() (rail bullets + contact CTAs on mobile) on iOS Safari <15.4.
      this.shell.dataset.view = this.step <= 0 ? 'start' : (this.step > this.N ? (this.leadOpen ? 'lead' : 'result') : 'question');
      let block;
      if (this.step <= 0) block = this.renderStart();
      else if (this.step > this.N) {
        if (this.leadOpen) block = this.renderLead();
        else { block = this.renderResult(); try { this.track('quiz_complete', { cell: diagnose(this.answers, this.data).cell }); } catch (e) {} }
      }
      else { const q = this.questions[this.step - 1]; block = this.renderQuestion(q); this.track('step_view', { step: this.step, question_id: q.id }); }
      block.dataset.dir = this.dir;
      this.stage.replaceChildren(block);
      const focusTarget = block.querySelector('[data-focus]');
      // Don't move focus on the first paint (otherwise an embed below the viewport auto-scrolls to the widget).
      if (focusTarget && this._booted) { try { focusTarget.focus({ preventScroll: true }); } catch (e) { focusTarget.focus(); } }
      if (this._navScroll) { const nav = this._booted; this._navScroll = false; if (nav) this._scrollToStage(); }
      this._booted = true;
      this.syncStickyCta(); // mobile-only sticky verdict CTA — hide/build/observe from the single render chokepoint
    }
    /* ---------------- STICKY VERDICT CTA (mobile only) ---------------- */
    // What the bar should mirror for this verdict, or null (green no-ask). Matches renderCta()'s branches.
    stickyCtaDef(dx) {
      const defs = this.data.cta_defs, cta = this.data.verdict_matrix[dx.cell].cta;
      const ringSigned = defs.ring && typeof defs.ring.url === 'string' && /^tel:\+?\d{6,}$/.test(defs.ring.url);
      if (dx.safety.escalation && ringSigned) return { mode: 'tel', label: defs.ring.label, href: defs.ring.url };
      if (dx.cell === 'sr') return (dx.safety.state === 'oklart' && defs.radgivning && defs.radgivning.opens_form) ? { mode: 'lead', label: defs.radgivning.label } : null;
      const p = defs[cta.primary];
      return (p && p.opens_form) ? { mode: 'lead', label: p.label } : null;
    }
    _ensureStickyBar() {
      // Portal the bar under a fresh .ampy-ec wrapper on <body> — robust by default: a transformed/
      // filter/contain ancestor of the shortcode mount (common in Bricks) would otherwise trap
      // position:fixed. The wrapper re-establishes the token scope (--bg-primary etc.) + lang="sv".
      if (!this._stickyBar) {
        const portal = el('div', { class: 'ampy-ec ampy-ec__sticky-portal', lang: 'sv', data: { booted: 'true' } }); // booted flag: a re-scanning boot() must never instantiate a wizard inside the portal
        this._stickyBar = el('div', { class: 'ampy-ec__stickycta', hidden: true });
        portal.appendChild(this._stickyBar);
        (document.body || document.documentElement).appendChild(portal);
      }
      return this._stickyBar;
    }
    _buildStickyButton(def) {
      // Never cloneNode the in-card node (onclick is a property, not an attribute) — rebuild identically.
      if (def.mode === 'tel') return el('a', { class: 'ampy-ec__cta-primary ampy-ec__cta-primary--solid', href: def.href }, [iconSpan('phone'), def.label]);
      return el('button', { class: 'ampy-ec__cta-primary ampy-ec__cta-primary--solid', type: 'button', onclick: () => this.openLead('sticky') }, [def.label, iconSpan('arrowRight')]);
    }
    syncStickyCta() {
      if (this._stickyIO) { this._stickyIO.disconnect(); this._stickyIO = null; } // teardown FIRST → exactly one live observer, leak-free
      const bar = this._ensureStickyBar();
      const onMobile = typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 1023px)').matches;
      const def = (this.shell && this.shell.dataset.view === 'result') ? this._stickyDef : null;
      if (!onMobile || !def) { bar.hidden = true; bar.classList.remove('is-visible'); bar.replaceChildren(); return; }
      bar.replaceChildren(el('div', { class: 'ampy-ec__stickycta-inner' }, [this._buildStickyButton(def)]));
      bar.hidden = false; bar.classList.remove('is-visible');
      const askEl = this.stage.querySelector('[data-ec-sticky-src]');
      const contactEl = this.shell.querySelector('.ampy-ec__rail-actions');
      if (!('IntersectionObserver' in window)) { bar.classList.add('is-visible'); return; } // graceful fallback: always-on
      // Show only when BOTH the in-card CTA and the bottom contact block are OUT of view (no twin button, never covers contact).
      this._stk = { ask: !!askEl, contact: false }; // pessimistic → stays hidden until the observer confirms the CTA is off-screen
      const update = () => bar.classList.toggle('is-visible', !this._stk.ask && !this._stk.contact);
      this._stickyIO = new IntersectionObserver((entries) => {
        for (const e of entries) { if (e.target === askEl) this._stk.ask = e.isIntersecting; else if (e.target === contactEl) this._stk.contact = e.isIntersecting; }
        update();
      }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
      if (askEl) this._stickyIO.observe(askEl);
      if (contactEl) this._stickyIO.observe(contactEl);
      update();
    }

    renderSteps() {
      const steps = el('div', { class: 'ampy-ec__steps', 'aria-hidden': 'true' });
      for (let i = 1; i <= this.N; i++) steps.appendChild(el('span', { class: this.step > i ? 'is-done' : (this.step === i ? 'is-current' : '') }));
      return steps;
    }

    /* ---------------- START ---------------- */
    renderStart() {
      const s = this.data.meta.start || {};
      const block = el('div', { class: 'ampy-ec__block ampy-ec__start' });
      block.appendChild(el('div', { class: 'ampy-ec__start-illu', html: START_ILLU, 'aria-hidden': 'true' }));
      block.appendChild(el('h2', { class: 'ampy-ec__start-heading', tabindex: '-1', 'data-focus': 'true' }, s.heading || 'Då sätter vi igång'));
      // Owner decision: no paragraph — the CTA sits where the body used to be, with a thin time note under it.
      block.appendChild(el('button', { class: 'ampy-ec__cta-primary ampy-ec__cta-primary--solid ampy-ec__start-cta', type: 'button', onclick: () => this.advance() }, [(s.cta || 'Starta test'), iconSpan('arrowRight')]));
      if (s.time_note) block.appendChild(el('p', { class: 'ampy-ec__start-time' }, s.time_note));
      return block;
    }

    /* ---------------- QUESTION STEP ---------------- */
    renderQuestion(q) {
      const block = el('div', { class: 'ampy-ec__block', role: 'group', 'aria-labelledby': 'ampy-ec-q' });
      const crumb = el('div', { class: 'ampy-ec__crumb' });
      const left = el('div', { class: 'ampy-ec__crumb-left' });
      left.appendChild(this.renderSteps());
      left.appendChild(el('span', { class: 'ampy-ec__sr' }, this.data.copy.progress.replace('{n}', String(this.step)).replace('{total}', String(this.N))));
      crumb.appendChild(left);
      crumb.appendChild(el('button', { class: 'ampy-ec__crumb-back', type: 'button', 'aria-label': (this.step === 1 ? 'Tillbaka till start' : 'Tillbaka till föregående fråga'), onclick: () => this.back() }, [iconSpan('arrowLeft'), 'Tillbaka']));
      block.appendChild(crumb);

      block.appendChild(el('h2', { class: 'ampy-ec__q-title', id: 'ampy-ec-q', tabindex: '-1', 'data-focus': 'true' }, q.title));
      if (q.subtitle) block.appendChild(el('p', { class: 'ampy-ec__q-subtitle' }, q.subtitle));
      block.appendChild(q.type === 'multi' ? this.renderMultiOptions(q) : this.renderSingleOptions(q));
      block.appendChild(el('div', { class: 'ampy-ec__info', role: 'note' }, [iconSpan('info', 'ampy-ec__info-icon'), el('p', { class: 'ampy-ec__info-text' }, q.note)]));
      return block;
    }
    renderSingleOptions(q) {
      const list = el('ul', { class: 'ampy-ec__options', role: 'list' });
      q.options.forEach(opt => {
        const selected = this.answers[q.id] === opt.id;
        list.appendChild(el('li', {}, el('button', { class: 'ampy-ec__option' + (selected ? ' is-selected' : ''), type: 'button', 'aria-pressed': String(selected), onclick: () => this.answerSingle(q, opt.id) },
          [el('span', { class: 'ampy-ec__option-body' }, [el('span', { class: 'ampy-ec__option-title' }, opt.label), opt.clarifier ? el('span', { class: 'ampy-ec__option-clarifier' }, opt.clarifier) : null])])));
      });
      return list;
    }
    renderMultiOptions(q) {
      const group = el('ul', { class: 'ampy-ec__options', role: 'group', 'aria-labelledby': 'ampy-ec-q' });
      const refs = {};
      q.options.forEach(opt => {
        const checked = (Array.isArray(this.answers[q.id]) ? this.answers[q.id] : []).includes(opt.id);
        const check = el('span', { class: 'ampy-ec__check', 'aria-hidden': 'true' }, checked ? iconSpan('check') : null);
        const btn = el('button', { class: 'ampy-ec__option ampy-ec__option--multi' + (checked ? ' is-selected' : ''), type: 'button', role: 'checkbox', 'aria-checked': String(checked), onclick: () => { this.toggleMulti(q, opt.id); sync(); } },
          [check, el('span', { class: 'ampy-ec__option-body' }, [el('span', { class: 'ampy-ec__option-title' }, opt.label), opt.clarifier ? el('span', { class: 'ampy-ec__option-clarifier' }, opt.clarifier) : null])]);
        refs[opt.id] = { btn, check }; group.appendChild(el('li', {}, btn));
      });
      const hintCopy = this.data.copy.multi_aria || 'Välj minst ett alternativ.';
      const hint = el('p', { class: 'ampy-ec__multi-hint', id: 'ampy-ec-multi-hint', role: 'status', 'aria-live': 'polite' }, hintCopy);
      const fortsatt = el('button', { class: 'ampy-ec__cta-primary ampy-ec__cta-primary--outline', type: 'button', 'aria-describedby': 'ampy-ec-multi-hint', onclick: () => { const cur = Array.isArray(this.answers[q.id]) ? this.answers[q.id] : []; if (cur.length) { this.advance(); } else {
        hint.classList.add('is-shown');
        // Re-set the text so the live region actually ANNOUNCES (a class toggle on unchanged text is silent in SRs).
        hint.textContent = ''; requestAnimationFrame(() => { hint.textContent = hintCopy; });
        const first = group.querySelector('.ampy-ec__option'); if (first) first.focus();
      } } }, ['Fortsätt', iconSpan('arrowRight')]);
      const sync = () => {
        const cur = Array.isArray(this.answers[q.id]) ? this.answers[q.id] : [];
        q.options.forEach(opt => { const on = cur.includes(opt.id), r = refs[opt.id]; r.btn.classList.toggle('is-selected', on); r.btn.setAttribute('aria-checked', String(on)); r.check.replaceChildren(); if (on) r.check.appendChild(iconSpan('check')); });
        fortsatt.setAttribute('aria-disabled', String(cur.length === 0));
      };
      sync();
      return el('div', { class: 'ampy-ec__multi' }, [group, hint, el('div', { class: 'ampy-ec__multi-foot' }, [fortsatt])]);
    }

    /* ---------------- VERDICT ---------------- */
    renderResult() {
      const dx = diagnose(this.answers, this.data), data = this.data, m = data.verdict_matrix[dx.cell];
      const block = el('div', { class: 'ampy-ec__block ampy-ec__result', role: 'region', 'aria-labelledby': 'ampy-ec-result-h' });
      block.appendChild(el('div', { class: 'ampy-ec__crumb ampy-ec__crumb--result' }, [
        el('button', { class: 'ampy-ec__crumb-back', type: 'button', 'aria-label': 'Tillbaka till frågorna', onclick: () => this.back() }, [iconSpan('arrowLeft'), 'Tillbaka']),
        el('button', { class: 'ampy-ec__crumb-restart', type: 'button', onclick: () => this.restart() }, 'Börja om')
      ]));
      if (dx.safety.escalation) block.appendChild(el('div', { class: 'ampy-ec__akut', role: 'alert' }, [iconSpan('alert', 'ampy-ec__akut-icon'), el('div', {}, [el('p', { class: 'ampy-ec__akut-label' }, data.akut_notis.label), el('p', { class: 'ampy-ec__akut-text' }, data.akut_notis.text)])]));
      block.appendChild(el('h2', { class: 'ampy-ec__sr', id: 'ampy-ec-result-h', tabindex: '-1', 'data-focus': 'true' }, this.buildSummarySentence(dx)));
      block.appendChild(el('p', { class: 'ampy-ec__result-eyebrow' }, 'Ditt besked'));
      block.appendChild(this.renderDualStatus(dx));
      const lede = (m.summary_by_safety && m.summary_by_safety[dx.safety.state]) || (m.summary_by_ready && m.summary_by_ready[dx.ready.state]) || m.summary;
      if (lede) block.appendChild(el('p', { class: 'ampy-ec__result-lede' }, lede));
      const findingsEl = this.renderFindings(dx); if (findingsEl) block.appendChild(findingsEl);
      // The Elsäkerhetsverket factnote moved to the rail (meta.rail.stat, owner decision) — the result
      // now runs verdict → findings → ONE primary CTA, with the real credential at the ask moment.
      const ctaFrag = this.renderCta(dx);
      const hasAsk = !!ctaFrag.querySelector('.ampy-ec__cta-primary, .ampy-ec__cta-secondary');
      block.appendChild(ctaFrag);
      // Directly under the booking CTA (owner decision, v2.18): a quiet "read more about elcentraler"
      // text link — the education path for researchers not ready to book. Replaces the old credential
      // line here and the old bottom-of-card research link. Only when there is a real ask.
      const rm = this.data.meta.result_readmore;
      if (hasAsk && rm && rm.label) {
        block.appendChild(el('p', { class: 'ampy-ec__readmore' }, [
          (rm.pre || ''),
          el('a', { class: 'ampy-ec__readmore-link', href: this.resolveCtaUrl(rm), onclick: () => this.track('research_link', { cell: dx.cell }) }, rm.label)
        ]));
      }
      block.appendChild(this.renderShareRow(dx));
      block.appendChild(this.renderPdfCapture(dx));
      // Mobile sticky CTA (see syncStickyCta): stash what to mirror + tag the in-card source element
      // as the observer's top sentinel. Normal/AKUT → the primary--solid node; sr-oklart → the secondary.
      this._stickyDef = this.stickyCtaDef(dx);
      if (this._stickyDef) {
        const sel = this._stickyDef.mode === 'tel' ? 'a.ampy-ec__cta-primary--solid[href^="tel:"]' : 'button.ampy-ec__cta-primary--solid, button.ampy-ec__cta-secondary';
        const src = block.querySelector(sel); if (src) src.dataset.ecStickySrc = '1';
      }
      return block;
    }
    buildSummarySentence(dx) {
      const planNoun = { elbil: 'elbil', varmepump: 'värmepump', solceller: 'solceller eller batteri', renovering: 'din renovering' }[dx.ready.plan] || 'dina planer';
      const parts = [];
      parts.push({
        lag: 'Din central ser säker ut.',
        forhojd: 'Din central har en förhöjd risk som bör ses över.',
        hog: 'Din central har en hög risk som bör åtgärdas.',
        oklart: 'Vi ser inga tydliga risker, men några svar var osäkra.'
      }[dx.safety.state]);
      const r = {
        redo_marginal: 'Den är redo för ' + planNoun + '.',
        redo_med_atgard: 'Den är redo för ' + planNoun + ' med en lastbalansering.',
        inte_redo: 'Den behöver en åtgärd innan den klarar ' + planNoun + '.',
        kraver_bedomning: 'Vad ' + planNoun + ' kräver avgörs av en kort bedömning.',
        ej_bedomd: ''
      }[dx.ready.state];
      if (r) parts.push(r);
      return parts.join(' ');
    }
    renderDualStatus(dx) {
      const data = this.data, ss = data.safety_states[dx.safety.state], readyMeta = data.ready_states[dx.ready.state];
      const readyPill = data.scoring.ready.pill_levels[dx.ready.state] || 'neutral';
      // Amber wash ONLY on a real safety risk. Green/unclear safety + a pure capacity action
      // (readyPill warning) leans toward info, doesn't alarm "safety fault". (The pill stays amber.)
      let worst;
      if (dx.safety.state === 'forhojd' || dx.safety.state === 'hog') worst = ss.pill_level;
      else if (readyPill === 'warning') worst = 'info';
      else worst = ss.pill_level;
      const wrap = el('div', { class: 'ampy-ec__dualstatus', data: { worst } });
      wrap.appendChild(el('div', { class: 'ampy-ec__dualstatus-accent', 'aria-hidden': 'true' }));
      const rows = el('div', { class: 'ampy-ec__dualstatus-rows' });
      rows.appendChild(this.statusRow('Säkerhet', ss.label, ss.pill_level, ss.icon));
      const readyIcon = { success: 'check', warning: 'alert', info: 'info', neutral: 'minus' }[readyPill] || 'minus';
      rows.appendChild(this.statusRow(readyMeta.axis_label, readyMeta.label, readyPill, readyIcon));
      wrap.appendChild(rows);
      return wrap;
    }
    statusRow(axisLabel, valueLabel, pillLevel, iconName) {
      return el('div', { class: 'ampy-ec__statusrow' }, [el('span', { class: 'ampy-ec__statusrow-axis' }, axisLabel), el('span', { class: 'ampy-ec__pill', data: { level: pillLevel } }, [iconSpan(iconName, 'ampy-ec__pill-icon'), el('span', {}, valueLabel)])]);
    }
    renderFindings(dx) {
      const findings = collectFindings(dx, this.data);
      if (!findings.length) return null; // no empty "Våra fynd" heading (e.g. akut escalation where OK findings are suppressed)
      const wrap = el('div', { class: 'ampy-ec__findings-wrap' });
      wrap.appendChild(el('p', { class: 'ampy-ec__findings-head', id: 'ampy-ec-findings-head' }, this.data.copy.findings_head || 'Våra fynd'));
      const list = el('ul', { class: 'ampy-ec__findings', role: 'list', 'aria-labelledby': 'ampy-ec-findings-head' });
      const mkItem = (f, i) => { const iconName = f.icon === 'ok' ? 'check' : (f.icon === 'warn' ? 'alert' : 'info'); return el('li', { class: 'ampy-ec__finding ampy-ec__finding--' + f.icon, style: { '--i': String(i) } }, [iconSpan(iconName, 'ampy-ec__finding-icon'), el('p', { class: 'ampy-ec__finding-text' }, f.text)]); };
      // Cap: show 3 + a quiet expander so the CTA stays a thumb-reach from the verdict. CANDOUR
      // GUARD: a risk (warn) finding is NEVER behind the tap — the cap extends past the last warn,
      // so only trailing ok/info rows collapse. Nothing is hidden for good. (≤ cap+1 → show all.)
      const lastWarn = findings.reduce((acc, f, i) => (f.icon === 'warn' ? i : acc), -1);
      const cap = Math.max(3, lastWarn + 1);
      if (findings.length <= cap + 1) {
        findings.forEach((f, i) => list.appendChild(mkItem(f, i)));
      } else {
        findings.slice(0, cap).forEach((f, i) => list.appendChild(mkItem(f, i)));
        const rest = findings.slice(cap);
        const more = el('button', { class: 'ampy-ec__findings-more', type: 'button', onclick: () => {
          // Reveal, then move focus INTO the new content before removing the trigger (keyboard/SR
          // focus must not drop to <body>).
          let first = null;
          rest.forEach((f, i) => { const it = mkItem(f, i); if (!first) { first = it; it.tabIndex = -1; } list.appendChild(it); });
          more.remove();
          if (first) { try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); } }
        } }, 'Visa ' + rest.length + ' fynd till');
        wrap.appendChild(list); wrap.appendChild(more); return wrap;
      }
      wrap.appendChild(list); return wrap;
    }
    resolveCtaUrl(def) {
      if (!def) return '#';
      if (def.url_key) return this.data.meta.service_pages[def.url_key] || this.data.meta.ampy_offert_url;
      if (def.url && this.data.meta[def.url]) return this.data.meta[def.url];
      return def.url || this.data.meta.ampy_offert_url;
    }
    renderCta(dx) {
      const wrap = document.createDocumentFragment(), matrix = this.data.verdict_matrix[dx.cell], defs = this.data.cta_defs, cta = matrix.cta;
      if (dx.cell === 'sr') {
        let linkDef = null; const planer = this.answers.planer || [];
        const hasPlan = planer.some(p => p !== 'inget') && planer.length, highFuse = ['25', '35'].includes(this.answers.huvudsakring);
        // Green-only links (handles-a-laddbox / fuse-downsizing) may ONLY show in the safe state (lag).
        // On 'oklart' (sr cell but uncertain answers) they would claim more than the answers give → fall through to advice.
        if (hasPlan && dx.safety.state === 'lag') linkDef = defs.laddbox_bridge; else if (highFuse && dx.safety.state === 'lag') linkDef = defs.nedsakring_hook;
        if (linkDef) {
          if (linkDef.lead) wrap.appendChild(el('p', { class: 'ampy-ec__cta-lead' }, linkDef.lead));
          wrap.appendChild(el('a', { class: 'ampy-ec__cta-link', href: this.resolveCtaUrl(linkDef) }, [linkDef.label, iconSpan('arrowRight')]));
        }
        else if (dx.safety.state === 'oklart') { wrap.appendChild(this.renderCtaDef(defs.radgivning, 'ampy-ec__cta-secondary')); }
        return wrap;
      }
      const primaryDef = defs[cta.primary];
      const ringSigned = defs.ring && typeof defs.ring.url === 'string' && /^tel:\+?\d{6,}$/.test(defs.ring.url);
      if (dx.safety.escalation && ringSigned) {
        wrap.appendChild(el('a', { class: 'ampy-ec__cta-primary ampy-ec__cta-primary--solid', href: defs.ring.url }, [iconSpan('phone'), defs.ring.label]));
        if (primaryDef) wrap.appendChild(this.renderCtaDef(primaryDef, 'ampy-ec__cta-secondary'));
      } else {
        if (primaryDef) wrap.appendChild(this.renderCtaDef(primaryDef, 'ampy-ec__cta-primary ampy-ec__cta-primary--solid'));
        if (cta.secondary) wrap.appendChild(this.renderCtaDef(defs[cta.secondary], 'ampy-ec__cta-secondary'));
      }
      return wrap;
    }
    // A CTA def → link (outbound) OR button that opens the in-tool lead form (opens_form).
    renderCtaDef(def, cls) {
      if (!def) return document.createComment('cta saknas');
      if (def.opens_form) return el('button', { class: cls, type: 'button', onclick: () => this.openLead() }, [def.label, iconSpan('arrowRight')]);
      return el('a', { class: cls, href: this.resolveCtaUrl(def) }, [def.label, iconSpan('arrowRight')]);
    }
    /* ---------------- LEAD FORM (in-tool capture, Elkollen parity) ---------------- */
    renderLead() {
      const dx = diagnose(this.answers, this.data), f = this.data.meta.lead_form || {};
      const block = el('div', { class: 'ampy-ec__block ampy-ec__lead', role: 'region', 'aria-labelledby': 'ampy-ec-lead-h' });
      block.appendChild(el('button', { class: 'ampy-ec__lead-back', type: 'button', onclick: () => this.closeLead() }, [iconSpan('arrowLeft'), (f.back || 'Tillbaka till beskedet')]));
      block.appendChild(el('h2', { class: 'ampy-ec__lead-title', id: 'ampy-ec-lead-h', tabindex: '-1', 'data-focus': 'true' }, (f.title || 'Få kostnadsfri rådgivning')));
      block.appendChild(el('p', { class: 'ampy-ec__lead-intro' }, (f.intro || 'Ampys behöriga elektriker hör av sig med ett förslag, oftast inom en arbetsdag.')));
      const form = el('form', { class: 'ampy-ec__lead-form', novalidate: 'true' });
      const field = (name, label, type, inputmode, ac, extra) => {
        const id = 'ampy-ec-lf-' + name;
        const input = el('input', Object.assign({ class: 'ampy-ec__lead-input', id: id, name: name, type: type, required: true, autocomplete: ac || 'on' }, inputmode ? { inputmode: inputmode } : {}, extra || {}));
        // All fields are required → a black asterisk after each label (owner decision).
        return { w: el('div', { class: 'ampy-ec__lead-field' }, [el('label', { class: 'ampy-ec__lead-label', for: id }, [label, el('span', { class: 'ampy-ec__lead-req', 'aria-hidden': 'true' }, '*')]), input]), input: input };
      };
      const namn = field('namn', 'Namn', 'text', null, 'name', { enterkeyhint: 'next', autocapitalize: 'words' }),
            epost = field('epost', 'E-post', 'email', 'email', 'email', { enterkeyhint: 'next', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false' }),
            tel = field('telefon', 'Telefon', 'tel', 'tel', 'tel', { enterkeyhint: 'next' }),
            post = field('postnummer', 'Postnummer', 'text', 'numeric', 'postal-code', { enterkeyhint: 'done' });
      form.appendChild(el('div', { class: 'ampy-ec__lead-grid' }, [namn.w, epost.w, tel.w, post.w]));
      // Honeypot INPUT NAME is a non-word ("webbplats" invited browser URL-autofill → silent lead drops);
      // the webhook payload key stays `webbplats` (documented contract).
      const honey = el('input', { type: 'text', name: 'hp_extra', class: 'ampy-ec__lead-hp', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true' });
      form.appendChild(honey);
      const errorBox = el('p', { class: 'ampy-ec__lead-error', role: 'alert', hidden: true });
      form.appendChild(errorBox);
      const submit = el('button', { class: 'ampy-ec__cta-primary ampy-ec__cta-primary--solid ampy-ec__lead-submit', type: 'submit' }, (f.submit || 'Boka rådgivning'));
      form.appendChild(submit);
      // Button-press consent (owner decision): no checkbox — the notice sits under the CTA.
      form.appendChild(el('p', { class: 'ampy-ec__lead-consent-note' }, [
        (f.consent || 'Genom att trycka på "Boka rådgivning" samtycker jag till att Ampy behandlar mina personuppgifter enligt vår '),
        el('a', { href: this.data.meta.privacy_policy_url || 'https://ampy.se/integritetspolicy/', target: '_blank', rel: 'noopener noreferrer' }, (f.consent_link || 'integritetspolicy')), '.'
      ]));
      form.addEventListener('submit', (e) => {
        e.preventDefault(); errorBox.hidden = true;
        if (honey.value) return;
        if (!namn.input.value.trim() || !epost.input.value.trim() || !tel.input.value.trim() || !post.input.value.trim()) {
          errorBox.hidden = false; errorBox.textContent = ''; requestAnimationFrame(() => { errorBox.textContent = f.error_required || 'Fyll i alla fält.'; }); return; // unhide FIRST, set text next frame → the role=alert reliably announces (VoiceOver/Safari miss text set while display:none)
        }
        submit.disabled = true; submit.textContent = f.submitting || 'Skickar…';
        this.submitLead(dx, { namn: namn.input.value.trim(), epost: epost.input.value.trim(), telefon: tel.input.value.trim(), postnummer: post.input.value.trim(), samtycke: true, webbplats: honey.value }).then(() => {
          // The conversion is pushed outside the track() dedupe (lead_submitted has no step → otherwise the 2nd submit is lost).
          try { (window.dataLayer = window.dataLayer || []).push({ event: 'ampy_ec_lead_submitted', cell: dx.cell }); } catch (e3) {}
          block.replaceChildren(el('div', { class: 'ampy-ec__lead-success', tabindex: '-1', 'data-focus': 'true' }, [
            iconSpan('check', 'ampy-ec__lead-success-icon'),
            el('h2', {}, (f.success_title || 'Tack! Vi hör av oss inom kort.')),
            el('p', {}, (f.success_body || 'En behörig elektriker återkommer med ett förslag, oftast inom en arbetsdag.')),
            el('button', { class: 'ampy-ec__lead-back', type: 'button', onclick: () => this.closeLead() }, [iconSpan('arrowLeft'), (f.success_back || 'Tillbaka till beskedet')])
          ]));
          const t = block.querySelector('[data-focus]'); if (t) { try { t.focus({ preventScroll: true }); } catch (e2) {} }
        }).catch(() => {
          submit.disabled = false; submit.textContent = f.submit || 'Boka rådgivning';
          errorBox.hidden = false; errorBox.textContent = ''; requestAnimationFrame(() => { errorBox.textContent = f.error_send || 'Något gick fel. Ring oss på 010-265 79 79 så hjälper vi dig.'; });
        });
      });
      block.appendChild(form);
      return block;
    }
    submitLead(dx, fields) {
      // Server-side delivery (live): POST to the WP REST endpoint, which reaches the webhook
      // server-side — the webhook URL is never exposed in the client. Honeypot (webbplats) + validation
      // travel in the payload and are verified both here and in the flow.
      const url = (window.AmpyEC && window.AmpyEC.restUrl) || '';
      const payload = Object.assign({ cell: dx.cell, vector: this.encodeVector() }, fields);
      if (!url || !(window.AmpyEC && window.AmpyEC.leadEnabled)) return new Promise((res) => setTimeout(res, 600)); // preview (no webhook) → simulate success
      // 10s timeout: a hung endpoint must never leave the form stuck on "Skickar…" — the catch path
      // shows the "Ring oss" fallback so the lead is never silently lost.
      const opts = { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': (window.AmpyEC && window.AmpyEC.restNonce) || '' }, body: JSON.stringify(payload) };
      let timer = null;
      if (typeof AbortController === 'function') { const ac = new AbortController(); opts.signal = ac.signal; timer = setTimeout(() => ac.abort(), 10000); }
      return fetch(url, opts).then(r => { if (timer) clearTimeout(timer); if (!r.ok) throw new Error('bad status'); return r.json().catch(() => ({})); }).catch(e => { if (timer) clearTimeout(timer); throw e; });
    }
    renderShareRow(dx) {
      const row = el('div', { class: 'ampy-ec__share-row' });
      if (dx.cell === 'sr' && dx.safety.state === 'lag') row.appendChild(el('span', { class: 'ampy-ec__share-nudge' }, this.data.copy.share_nudge_green));
      row.appendChild(this.renderShareButton(dx));
      return row;
    }
    renderPdfCapture(dx) {
      if (!(window.AmpyEC && window.AmpyEC.pdfEnabled) || !this.data.meta.privacy_policy_url) return document.createComment('pdf-capture dold: webhook/integritetspolicy saknas');
      const label = (dx.cell === 'sr') ? this.data.copy.pdf_capture_green : this.data.copy.pdf_capture;
      const wrap = el('div', { class: 'ampy-ec__pdf' });
      const status = el('p', { class: 'ampy-ec__pdf-status', role: 'status', 'aria-live': 'polite' });
      const hp = el('input', { type: 'text', name: 'hp_extra', class: 'ampy-ec__hp', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true' });
      const email = el('input', { type: 'email', id: 'ampy-ec-email', class: 'ampy-ec__pdf-input', placeholder: 'din@epost.se', required: true, autocomplete: 'email', inputmode: 'email', enterkeyhint: 'send', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false' });
      const consentBox = el('input', { type: 'checkbox', required: true });
      const toggle = el('button', { class: 'ampy-ec__pdf-toggle', type: 'button', 'aria-expanded': 'false' }, [iconSpan('mail'), label]);
      const form = el('form', { class: 'ampy-ec__pdf-form', hidden: true, onsubmit: async (e) => {
        e.preventDefault(); if (hp.value) { status.textContent = 'Tack!'; return; } status.textContent = 'Skickar…';
        try { await fetch(((window.AmpyEC && window.AmpyEC.pdfUrl) || ''), { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': (window.AmpyEC && window.AmpyEC.restNonce) || '' }, body: JSON.stringify({ epost: email.value, vector: this.encodeVector(), cell: dx.cell, samtycke: consentBox.checked, webbplats: hp.value }) }); status.textContent = 'Tack! Rapporten är på väg till din inkorg.'; form.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }
        catch (err) { status.textContent = 'Kunde inte skicka just nu. Försök igen om en stund.'; }
      } }, [
        el('label', { class: 'ampy-ec__pdf-flabel', for: 'ampy-ec-email' }, 'E-post'), email, hp,
        el('label', { class: 'ampy-ec__pdf-consent' }, [consentBox, el('span', {}, [this.data.copy.pdf_consent + ' ', el('a', { href: this.data.meta.privacy_policy_url, target: '_blank', rel: 'noopener noreferrer' }, 'Integritetspolicy'), '.'])]),
        el('button', { class: 'ampy-ec__cta-primary ampy-ec__cta-primary--outline', type: 'submit' }, 'Mejla rapporten')
      ]);
      toggle.addEventListener('click', () => { const open = form.hidden === false; form.hidden = open; toggle.setAttribute('aria-expanded', String(!open)); if (!open) email.focus(); });
      wrap.appendChild(toggle); wrap.appendChild(form); wrap.appendChild(status); return wrap;
    }
    renderShareButton(dx) {
      const status = el('span', { class: 'ampy-ec__share-status', role: 'status', 'aria-live': 'polite' });
      const shareUrl = window.location.origin + window.location.pathname + '?q=' + encodeURIComponent(this.encodeVector());
      const shareTitle = 'Elcentral-kollen';
      // share_green_marginal ("...redo för elbil") only holds as long as redo_marginal is EV-exclusive (scoring.ready).
      // A non-green verdict shares a neutral sentence (never the telegraphic buildSummarySentence in public sharing).
      const shareText = (dx.cell === 'sr' && dx.safety.state === 'lag') ? ((dx.ready.state === 'redo_marginal') ? this.data.copy.share_green_marginal : this.data.copy.share_green) : (this.data.copy.share_neutral || this.buildSummarySentence(dx));
      const anchor = el('span', { class: 'ampy-ec__share-anchor' });
      // Plain DISCLOSURE (not role=menu): a real menu requires roving arrow-key focus that a simple
      // list of links doesn't implement — SRs handle button[aria-expanded] + links honestly.
      const menu = el('div', { class: 'ampy-ec__share-menu', 'aria-label': 'Dela resultatet', hidden: true });
      const enc = encodeURIComponent;
      // Channels that matter for a Swedish homeowner arriving from Facebook — Facebook + e-post +
      // copy link. (X/Reddit dropped: negligible for this audience and mixed the icon set.)
      [{ label: 'Facebook', icon: 'facebook', href: 'https://www.facebook.com/sharer/sharer.php?u=' + enc(shareUrl) },
       { label: 'E-post', icon: 'mail', href: 'mailto:?subject=' + enc(shareTitle) + '&body=' + enc(shareText + ' ' + shareUrl) }
      ].forEach(t => menu.appendChild(el('a', { class: 'ampy-ec__share-item', href: t.href, target: '_blank', rel: 'noopener noreferrer', onclick: () => closeMenu() }, [iconSpan(t.icon, 'ampy-ec__share-item-icon'), el('span', {}, t.label)])));
      menu.appendChild(el('button', { class: 'ampy-ec__share-item', type: 'button', onclick: async () => { try { await navigator.clipboard.writeText(shareUrl); flash('Länk kopierad.'); } catch (e) { flash('Kopiera URL:en manuellt.'); } closeMenu(); } }, [iconSpan('link', 'ampy-ec__share-item-icon'), el('span', {}, 'Kopiera länk')]));
      const flash = (msg) => { status.textContent = msg; status.dataset.visible = 'true'; clearTimeout(this._flashT); this._flashT = setTimeout(() => { status.dataset.visible = 'false'; setTimeout(() => { status.textContent = ''; }, 250); }, 2400); }; // empty the live region after the fade so SR users never re-encounter a stale toast
      const closeMenu = () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); document.removeEventListener('click', onDoc, true); document.removeEventListener('keydown', onKey, true); if (this._closeShareMenu === closeMenu) this._closeShareMenu = null; };
      this._closeShareMenu = null;
      const openMenu = () => { menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); document.addEventListener('click', onDoc, true); document.addEventListener('keydown', onKey, true); this._closeShareMenu = closeMenu; };
      const onDoc = (e) => { if (!anchor.contains(e.target)) closeMenu(); };
      const onKey = (e) => { if (e.key === 'Escape') { closeMenu(); btn.focus(); } };
      const btn = el('button', { class: 'ampy-ec__share', type: 'button', 'aria-label': 'Dela resultatet', 'aria-expanded': 'false', title: 'Dela resultatet', onclick: async () => {
        const isTouch = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
        if (navigator.share && isTouch) { let file = null; try { file = await this.generateShareImage(dx, shareUrl, shareText); } catch (e) {} try { const payload = { title: shareTitle, text: shareText, url: shareUrl }; if (file && navigator.canShare && navigator.canShare({ files: [file] })) payload.files = [file]; await navigator.share(payload); return; } catch (e) {} }
        if (menu.hidden) openMenu(); else closeMenu();
      } }, iconSpan('share'));
      anchor.appendChild(btn); anchor.appendChild(menu); anchor.appendChild(status); return anchor;
    }
    async generateShareImage(dx, urlStr, shareText) {
      const W = 1200, H = 630, canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext('2d');
      const pal = { success: '#1f8f6b', warning: '#8a6d10', error: '#a32330', info: '#2a4a7a', neutral: '#5a5d7a' };
      const ss = this.data.safety_states[dx.safety.state], rPill = this.data.scoring.ready.pill_levels[dx.ready.state] || 'neutral';
      const worst = (dx.safety.state === 'forhojd' || dx.safety.state === 'hog') ? ss.pill_level : (rPill === 'warning' ? 'info' : ss.pill_level); // matches renderDualStatus: capacity-only ≠ amber alarm
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = pal[worst] || pal.neutral; ctx.fillRect(0, 0, 16, H);
      ctx.fillStyle = 'rgba(9,11,50,0.55)'; ctx.font = '600 24px "Plus Jakarta Sans", system-ui, sans-serif'; ctx.fillText('AMPY · ELCENTRAL-KOLLEN', 72, 84);
      if (this.data.meta.share_card_authority) { ctx.fillStyle = 'rgba(9,11,50,0.4)'; ctx.font = '500 20px "Outfit", system-ui, sans-serif'; ctx.fillText(this.data.meta.share_card_authority, 72, 120); }
      ctx.fillStyle = '#090b32'; ctx.font = '700 50px "Plus Jakarta Sans", system-ui, sans-serif'; this._wrap(ctx, shareText, 72, 220, W - 144, 60);
      const drawPill = (x, y, label, value, lvl) => { ctx.fillStyle = 'rgba(9,11,50,0.55)'; ctx.font = '500 24px "Outfit", system-ui, sans-serif'; ctx.fillText(label, x, y); ctx.fillStyle = pal[lvl] || pal.neutral; ctx.font = '700 34px "Plus Jakarta Sans", system-ui, sans-serif'; ctx.fillText(value, x, y + 44); };
      drawPill(72, 430, 'Säkerhet', ss.label, ss.pill_level); drawPill(620, 430, this.data.ready_states[dx.ready.state].axis_label, this.data.ready_states[dx.ready.state].label, rPill);
      ctx.fillStyle = 'rgba(9,11,50,0.6)'; ctx.font = '600 22px "Outfit", system-ui, sans-serif'; ctx.textAlign = 'left'; ctx.fillText(this.data.meta.share_card_cta || 'Gör testet gratis →', 72, H - 52);
      ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(9,11,50,0.45)'; ctx.font = '500 20px "Outfit", system-ui, sans-serif'; ctx.fillText(urlStr.replace(/^https?:\/\//, '').replace(/\?.*$/, ''), W - 72, H - 52); ctx.textAlign = 'left';
      const blob = await new Promise(res => canvas.toBlob(res, 'image/png', 0.92)); if (!blob) return null;
      return new File([blob], 'elcentral-kollen.png', { type: 'image/png' });
    }
    _wrap(ctx, text, x, y, maxW, lineH) { const words = String(text || '').split(/\s+/); let line = '', yy = y; for (let i = 0; i < words.length; i++) { const test = line ? line + ' ' + words[i] : words[i]; if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, yy); line = words[i]; yy += lineH; } else line = test; } if (line) ctx.fillText(line, x, yy); }
  }

  function boot(mount) {
    if (!mount || mount.dataset.booted === 'true') return;
    const injected = (window.AmpyEC && window.AmpyEC.data) || null;
    const start = (data) => { try { if (data.scoring.weights.varningstecken.brand_lukt !== 0) console.warn('[Elcentral-kollen] VARNING: brand_lukt-vikten är inte 0.'); } catch (e) {} new ElcentralApp(mount, data).render(); };
    if (injected) { start(injected); return; }
    const dataUrl = mount.dataset.dataUrl || '../data/elcentralkollen-data.json';
    fetch(dataUrl, { credentials: 'same-origin' }).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }).then(start)
      .catch(err => { console.error('[Elcentral-kollen] kunde inte ladda data:', err); mount.innerHTML = '<div class="ampy-ec__block"><p>Kunde inte ladda verktyget just nu.</p></div>'; });
  }
  window.AmpyEC = window.AmpyEC || {};
  window.AmpyEC.diagnose = diagnose; window.AmpyEC.computeSafety = computeSafety; window.AmpyEC.computeReady = computeReady; window.AmpyEC.computeCell = computeCell; window.AmpyEC.boot = boot;
  // Boot immediately if the DOM is already parsed (WP Rocket delay-JS / Autoptimize defer / late
  // injection fire the script AFTER DOMContentLoaded — a bare listener would never run).
  const init = () => { document.querySelectorAll('.ampy-ec').forEach(boot); };
  if (document.readyState !== 'loading') init(); else document.addEventListener('DOMContentLoaded', init);
})();
