/* ============================================================================
   Elcentral-kollen v2.10 — diagnosmotor + wizard (vanilla ES6, no build)
     1. DATA   — elcentralkollen-data.json (single source of truth)
     2. ENGINE — pure compute: effektiv central-ålder (central_alder, hus_alder
                 som proxy) + säkringstyp + JFB + symptom-golv -> 2x2-cell
     3. VIEW   — start -> 7 frågor -> tvåaxlat besked. Tvåpanels-shell på desktop.
   Doktrin: docs/SPEC.md + docs/DESIGN.md. UI-copy är svensk by design.
   ============================================================================ */
(function () {
  'use strict';

  const ICONS = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
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

  // Effektiv central-ålder för poäng: central_alder styr, hus_alder är proxy vid 'original'.
  function effectiveCentralAge(a, data) {
    const c = a.central_alder, hus = a.hus_alder, map = (data.scoring.central_age_map || {});
    if (c === 'recent' || c === 'older') return { bracket: map[c], uncertain: false };
    if (c === 'original') { const known = hus && hus !== 'vet_inte'; return { bracket: known ? hus : null, uncertain: !known }; }
    // c === 'vet_inte' / undefined: proxa hus men markera osäker
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
    // Under akut (bränd lukt): inga muntra OK-rader och aldrig nedsäkrings-tipset bredvid en röd varning.
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
      this.N = this.questions.length;            // antal frågor (7)
      this.answers = {}; this.step = 0;          // 0 = start, 1..N = frågor, N+1 = besked
      this.dir = 'fwd'; this._flashT = null; this.stage = null; this._booted = false; this._tracked = {};
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
        if (q.type === 'multi') { out[qid] = digits.split('').map(d => q.options[parseInt(d, 10)]).filter(Boolean).map(o => o.id); const exq = q.options.find(o => o.exclusive); if (exq && out[qid].includes(exq.id)) out[qid] = [exq.id]; }
        else { const o = q.options[parseInt(digits, 10)]; if (o) out[qid] = o.id; }
      });
      return out;
    }
    hydrateFromUrl() {
      const vec = new URLSearchParams(window.location.search).get('q');
      if (vec) { this.answers = this.decodeVector(vec); const complete = this.questions.every(q => this.answers[q.id] != null); this.step = complete ? (this.N + 1) : 0; }
    }
    writeResultUrl(push) {
      const p = new URLSearchParams(window.location.search); p.set('q', this.encodeVector());
      const url = window.location.pathname + '?' + p.toString() + window.location.hash;
      if (push) history.pushState({ step: this.N + 1 }, '', url); else history.replaceState({ step: this.N + 1 }, '', url);
    }
    bindHistory() { window.addEventListener('popstate', () => { this.hydrateFromUrl(); this.render(); }); }

    answerSingle(q, optionId) { this.answers[q.id] = optionId; this.advance(); }
    toggleMulti(q, optionId) {
      const opt = q.options.find(o => o.id === optionId);
      let cur = Array.isArray(this.answers[q.id]) ? this.answers[q.id].slice() : [];
      if (opt.exclusive) cur = cur.includes(optionId) ? [] : [optionId];
      else { cur = cur.filter(id => { const o = q.options.find(oo => oo.id === id); return !(o && o.exclusive); }); cur = cur.includes(optionId) ? cur.filter(id => id !== optionId) : cur.concat(optionId); }
      this.answers[q.id] = cur;
    }
    track(event, params) { try { const dl = (window.dataLayer = window.dataLayer || []); const key = event + ':' + (params && params.step != null ? params.step : ''); if (this._tracked[key]) return; this._tracked[key] = true; dl.push(Object.assign({ event: 'ampy_ec_' + event }, params || {})); } catch (e) {} }
    advance() { this.dir = 'fwd'; if (this.step === 0) this.track('quiz_start', {}); if (this.step >= this.N) { this.step = this.N + 1; this.writeResultUrl(true); } else this.step += 1; this.render(); }
    back() { this.dir = 'back'; if (this.step > this.N && new URLSearchParams(window.location.search).has('q')) history.replaceState({ step: this.step }, '', window.location.pathname + window.location.hash); if (this.step > 0) this.step -= 1; if (this.step > this.N) this.step = this.N; this.render(); }
    restart() { this.dir = 'back'; this.answers = {}; this.step = 0; this._tracked = {}; history.pushState({ step: 0 }, '', window.location.pathname + window.location.hash); this.render(); }

    buildShell() {
      this.mount.replaceChildren(); this.mount.dataset.booted = 'true';
      const shell = el('div', { class: 'ampy-ec__shell' });
      shell.appendChild(this.renderRail());
      this.stage = el('div', { class: 'ampy-ec__stage' });
      shell.appendChild(this.stage); this.mount.appendChild(shell);
    }
    renderRail() {
      const m = this.data.meta, rail = m.rail || {};
      const aside = el('aside', { class: 'ampy-ec__rail' });
      aside.appendChild(el('h1', { class: 'ampy-ec__rail-heading' }, m.page_heading));
      aside.appendChild(el('p', { class: 'ampy-ec__rail-lead' }, m.page_lead));
      // Två kontakt-CTA (1:1-replika av ampy.se: telefon + gradient-knapp). Desktop-only via CSS.
      const contact = rail.contact || {};
      aside.appendChild(el('div', { class: 'ampy-ec__rail-actions' }, [
        el('a', { class: 'ampy-ec__rail-contact', href: contact.contact_url || m.ampy_offert_url, target: '_blank', rel: 'noopener noreferrer' }, [el('span', {}, (contact.contact_label || 'Kontakta oss')), iconSpan('arrowUpRight', 'ampy-ec__rail-contact-icon')]),
        el('a', { class: 'ampy-ec__rail-phone', href: contact.phone_url || 'tel:+46102657979' }, [el('span', {}, (contact.phone_label || '010-265 79 79')), iconSpan('phoneAmpy', 'ampy-ec__rail-phone-icon')])
      ]));
      aside.appendChild(el('div', { class: 'ampy-ec__rail-cred' }, [
        iconSpan('shield', 'ampy-ec__rail-cred-icon'),
        el('p', { class: 'ampy-ec__rail-cred-text' }, [
          el('a', { class: 'ampy-ec__rail-cred-link', href: m.verify_company_url, target: '_blank', rel: 'noopener noreferrer' }, (rail.credential_link || 'Auktoriserat elinstallationsföretag')),
          (rail.credential_rest || ', registrerat hos Elsäkerhetsverket.')
        ])
      ]));
      return aside;
    }

    render() {
      const noscript = this.mount.querySelector('.ampy-ec__noscript'); if (noscript) noscript.remove();
      if (!this.stage) this.buildShell();
      let block;
      if (this.step <= 0) block = this.renderStart();
      else if (this.step > this.N) { block = this.renderResult(); try { this.track('quiz_complete', { cell: diagnose(this.answers, this.data).cell }); } catch (e) {} }
      else { const q = this.questions[this.step - 1]; block = this.renderQuestion(q); this.track('step_view', { step: this.step, question_id: q.id }); }
      block.dataset.dir = this.dir;
      this.stage.replaceChildren(block);
      const focusTarget = block.querySelector('[data-focus]');
      // Flytta inte fokus vid första paint (annars auto-scrollar en embed under viewporten till widgeten).
      if (focusTarget && this._booted) { try { focusTarget.focus({ preventScroll: true }); } catch (e) { focusTarget.focus(); } }
      this._booted = true;
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
      if (s.body) block.appendChild(el('p', { class: 'ampy-ec__start-body' }, s.body));
      block.appendChild(el('button', { class: 'ampy-ec__cta-primary ampy-ec__cta-primary--solid ampy-ec__start-cta', type: 'button', onclick: () => this.advance() }, [(s.cta || 'Starta test'), iconSpan('arrowRight')]));
      block.appendChild(this.renderCompactCred());
      return block;
    }

    /* ---------------- FRÅGESTEG ---------------- */
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
        list.appendChild(el('li', {}, el('button', { class: 'ampy-ec__option' + (selected ? ' is-selected' : '') + (opt.id === 'vet_inte' ? ' ampy-ec__option--soft' : ''), type: 'button', onclick: () => this.answerSingle(q, opt.id) },
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
      const hint = el('p', { class: 'ampy-ec__multi-hint', id: 'ampy-ec-multi-hint', role: 'status', 'aria-live': 'polite' }, this.data.copy.multi_aria || 'Välj minst ett alternativ.');
      const fortsatt = el('button', { class: 'ampy-ec__cta-primary ampy-ec__cta-primary--outline', type: 'button', 'aria-describedby': 'ampy-ec-multi-hint', onclick: () => { const cur = Array.isArray(this.answers[q.id]) ? this.answers[q.id] : []; if (cur.length) { this.advance(); } else { hint.classList.add('is-shown'); const first = group.querySelector('.ampy-ec__option'); if (first) first.focus(); } } }, ['Fortsätt', iconSpan('arrowRight')]);
      const sync = () => {
        const cur = Array.isArray(this.answers[q.id]) ? this.answers[q.id] : [];
        q.options.forEach(opt => { const on = cur.includes(opt.id), r = refs[opt.id]; r.btn.classList.toggle('is-selected', on); r.btn.setAttribute('aria-checked', String(on)); r.check.replaceChildren(); if (on) r.check.appendChild(iconSpan('check')); });
        fortsatt.setAttribute('aria-disabled', String(cur.length === 0));
      };
      sync();
      return el('div', { class: 'ampy-ec__multi' }, [group, hint, el('div', { class: 'ampy-ec__multi-foot' }, [fortsatt])]);
    }

    /* ---------------- BESKED ---------------- */
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
      if (dx.cell === 'rs' || dx.cell === 'rr') block.appendChild(el('div', { class: 'ampy-ec__factnote', role: 'note' }, [iconSpan('info', 'ampy-ec__factnote-icon'), el('div', {}, [
        el('p', { class: 'ampy-ec__factnote-text' }, data.facts.brand.text),
        el('p', { class: 'ampy-ec__factnote-src' }, [
          (data.facts.brand.source_pre || ''),
          el('a', { class: 'ampy-ec__factnote-src-link', href: data.facts.brand.source_url, target: '_blank', rel: 'noopener noreferrer' }, (data.facts.brand.source_link || '')),
          (data.facts.brand.source_post || '')
        ])
      ])]));
      block.appendChild(this.renderCta(dx));
      block.appendChild(this.renderPdfCapture(dx));
      // Footern avslutas medvetet på "Läs mer om elcentral" (sekundär CTA). Delningsraden,
      // friskrivnings-paragrafen och den slimmade mobil-credentialen är borttagna (ägarbeslut)
      // för ett kompakt avslut. Friskrivningens innebörd bärs av besked-copyn (t.ex. "en kort
      // besiktning ger dig säkerheten") + den crawlbara render.php-fallbacken.
      return block;
    }
    // Slim trust-rad — visas bara på mobil (start + besked), där rail-credentialen är dold.
    renderCompactCred() {
      const m = this.data.meta, rail = m.rail || {};
      return el('div', { class: 'ampy-ec__compact-cred' }, [
        iconSpan('shield', 'ampy-ec__compact-cred-icon'),
        el('p', { class: 'ampy-ec__compact-cred-text' }, [
          el('a', { href: m.verify_company_url, target: '_blank', rel: 'noopener noreferrer' }, (rail.credential_link || 'Auktoriserat elinstallationsföretag')),
          (rail.credential_rest || ', registrerat hos Elsäkerhetsverket.')
        ])
      ]);
    }
    selectHeadline(dx, m) {
      if (m.headline_by_safety && m.headline_by_safety[dx.safety.state]) return m.headline_by_safety[dx.safety.state];
      if (m.headline_by_ready && m.headline_by_ready[dx.ready.state]) return m.headline_by_ready[dx.ready.state];
      return m.headline || this.buildSummarySentence(dx);
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
      // Amber-wash ENDAST vid verklig säkerhetsrisk. Grön/oklart säkerhet + ren kapacitetsåtgärd
      // (readyPill warning) lutar mot info, larmar inte "säkerhetsfel". (Pillret förblir amber.)
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
      if (!findings.length) return null; // ingen tom "Våra fynd"-rubrik (t.ex. akut-eskalering där OK-fynd undertrycks)
      const wrap = el('div', { class: 'ampy-ec__findings-wrap' });
      wrap.appendChild(el('p', { class: 'ampy-ec__findings-head', id: 'ampy-ec-findings-head' }, this.data.copy.findings_head || 'Våra fynd'));
      const list = el('ul', { class: 'ampy-ec__findings', role: 'list', 'aria-labelledby': 'ampy-ec-findings-head' });
      findings.forEach((f, i) => { const iconName = f.icon === 'ok' ? 'check' : (f.icon === 'warn' ? 'alert' : 'info'); list.appendChild(el('li', { class: 'ampy-ec__finding ampy-ec__finding--' + f.icon, style: { '--i': String(i) } }, [iconSpan(iconName, 'ampy-ec__finding-icon'), el('p', { class: 'ampy-ec__finding-text' }, f.text)])); });
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
        // Grön-bara-länkar (klarar-en-laddbox / nedsäkring) får ENDAST visas vid säkert läge (lag).
        // Vid 'oklart' (sr-cell men osäkra svar) hade de hävdat mer än svaren ger → faller igenom till rådgivning.
        if (hasPlan && dx.safety.state === 'lag') linkDef = defs.laddbox_bridge; else if (highFuse && dx.safety.state === 'lag') linkDef = defs.nedsakring_hook;
        if (linkDef) {
          if (linkDef.lead) wrap.appendChild(el('p', { class: 'ampy-ec__cta-lead' }, linkDef.lead));
          wrap.appendChild(el('a', { class: 'ampy-ec__cta-link', href: this.resolveCtaUrl(linkDef) }, [linkDef.label, iconSpan('arrowRight')]));
        }
        else if (dx.safety.state === 'oklart') { const d = defs.radgivning; wrap.appendChild(el('a', { class: 'ampy-ec__cta-secondary', href: this.resolveCtaUrl(d) }, [d.label, iconSpan('arrowRight')])); }
        return wrap;
      }
      const primaryDef = defs[cta.primary];
      const ringSigned = defs.ring && typeof defs.ring.url === 'string' && /^tel:\+?\d{6,}$/.test(defs.ring.url);
      if (dx.safety.escalation && ringSigned) {
        wrap.appendChild(el('a', { class: 'ampy-ec__cta-primary ampy-ec__cta-primary--solid', href: defs.ring.url }, [iconSpan('phone'), defs.ring.label]));
        if (primaryDef) wrap.appendChild(el('a', { class: 'ampy-ec__cta-secondary', href: this.resolveCtaUrl(primaryDef) }, [primaryDef.label, iconSpan('arrowRight')]));
      } else {
        if (primaryDef) wrap.appendChild(el('a', { class: 'ampy-ec__cta-primary ampy-ec__cta-primary--solid', href: this.resolveCtaUrl(primaryDef) }, [primaryDef.label, iconSpan('arrowRight')]));
        if (cta.secondary) { const sec = defs[cta.secondary]; wrap.appendChild(el('a', { class: 'ampy-ec__cta-secondary', href: this.resolveCtaUrl(sec) }, [sec.label, iconSpan('arrowRight')])); }
      }
      return wrap;
    }
    renderShareRow(dx) {
      const row = el('div', { class: 'ampy-ec__share-row' });
      if (dx.cell === 'sr' && dx.safety.state === 'lag') row.appendChild(el('span', { class: 'ampy-ec__share-nudge' }, this.data.copy.share_nudge_green));
      row.appendChild(this.renderShareButton(dx));
      return row;
    }
    renderPdfCapture(dx) {
      if (!this.data.meta.pdf_webhook_url || !this.data.meta.privacy_policy_url) return document.createComment('pdf-capture dold: webhook/integritetspolicy saknas');
      const label = (dx.cell === 'sr') ? this.data.copy.pdf_capture_green : this.data.copy.pdf_capture;
      const wrap = el('div', { class: 'ampy-ec__pdf' });
      const status = el('p', { class: 'ampy-ec__pdf-status', role: 'status', 'aria-live': 'polite' });
      const hp = el('input', { type: 'text', name: 'webbplats', class: 'ampy-ec__hp', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true' });
      const email = el('input', { type: 'email', id: 'ampy-ec-email', class: 'ampy-ec__pdf-input', placeholder: 'din@epost.se', required: true, autocomplete: 'email', inputmode: 'email', enterkeyhint: 'send', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false' });
      const consentBox = el('input', { type: 'checkbox', required: true });
      const toggle = el('button', { class: 'ampy-ec__pdf-toggle', type: 'button', 'aria-expanded': 'false' }, [iconSpan('mail'), label]);
      const form = el('form', { class: 'ampy-ec__pdf-form', hidden: true, onsubmit: async (e) => {
        e.preventDefault(); if (hp.value) { status.textContent = 'Tack!'; return; } status.textContent = 'Skickar…';
        try { await fetch(this.data.meta.pdf_webhook_url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': (window.AmpyEC && window.AmpyEC.restNonce) || '' }, body: JSON.stringify({ epost: email.value, vector: this.encodeVector(), cell: dx.cell, samtycke: consentBox.checked, webbplats: hp.value }) }); status.textContent = 'Tack! Rapporten är på väg till din inkorg.'; form.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }
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
      // share_green_marginal ("...redo för elbil") gäller bara så länge redo_marginal är elbil-exklusivt (scoring.ready).
      // Icke-grönt besked delar en neutral mening (aldrig den telegrafiska buildSummarySentence i offentlig delning).
      const shareText = (dx.cell === 'sr' && dx.safety.state === 'lag') ? ((dx.ready.state === 'redo_marginal') ? this.data.copy.share_green_marginal : this.data.copy.share_green) : (this.data.copy.share_neutral || this.buildSummarySentence(dx));
      const anchor = el('span', { class: 'ampy-ec__share-anchor' });
      const menu = el('div', { class: 'ampy-ec__share-menu', role: 'menu', 'aria-label': 'Dela resultatet', hidden: true });
      const enc = encodeURIComponent;
      [{ label: 'Facebook', icon: 'facebook', href: 'https://www.facebook.com/sharer/sharer.php?u=' + enc(shareUrl) },
       { label: 'X', icon: 'xtwitter', href: 'https://twitter.com/intent/tweet?url=' + enc(shareUrl) + '&text=' + enc(shareText) },
       { label: 'Reddit', icon: 'reddit', href: 'https://www.reddit.com/submit?url=' + enc(shareUrl) + '&title=' + enc(shareText) },
       { label: 'E-post', icon: 'mail', href: 'mailto:?subject=' + enc(shareTitle) + '&body=' + enc(shareText + ' ' + shareUrl) }
      ].forEach(t => menu.appendChild(el('a', { class: 'ampy-ec__share-item', role: 'menuitem', href: t.href, target: '_blank', rel: 'noopener noreferrer', onclick: () => closeMenu() }, [iconSpan(t.icon, 'ampy-ec__share-item-icon'), el('span', {}, t.label)])));
      menu.appendChild(el('button', { class: 'ampy-ec__share-item', type: 'button', role: 'menuitem', onclick: async () => { try { await navigator.clipboard.writeText(shareUrl); flash('Länk kopierad.'); } catch (e) { flash('Kopiera URL:en manuellt.'); } closeMenu(); } }, [iconSpan('link', 'ampy-ec__share-item-icon'), el('span', {}, 'Kopiera länk')]));
      const flash = (msg) => { status.textContent = msg; status.dataset.visible = 'true'; clearTimeout(this._flashT); this._flashT = setTimeout(() => { status.dataset.visible = 'false'; }, 2400); };
      const closeMenu = () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); document.removeEventListener('click', onDoc, true); document.removeEventListener('keydown', onKey, true); };
      const openMenu = () => { menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); document.addEventListener('click', onDoc, true); document.addEventListener('keydown', onKey, true); };
      const onDoc = (e) => { if (!anchor.contains(e.target)) closeMenu(); };
      const onKey = (e) => { if (e.key === 'Escape') { closeMenu(); btn.focus(); } };
      const btn = el('button', { class: 'ampy-ec__share', type: 'button', 'aria-label': 'Dela resultatet', 'aria-haspopup': 'menu', 'aria-expanded': 'false', title: 'Dela resultatet', onclick: async () => {
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
      const worst = (dx.safety.state === 'forhojd' || dx.safety.state === 'hog') ? ss.pill_level : (rPill === 'warning' ? 'warning' : ss.pill_level);
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
  document.addEventListener('DOMContentLoaded', () => { document.querySelectorAll('.ampy-ec').forEach(boot); });
})();
