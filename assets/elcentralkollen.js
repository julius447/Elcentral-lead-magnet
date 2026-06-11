/* ============================================================================
   Elcentral-kollen v2 — diagnosmotor + wizard (vanilla ES6, no build)
     1. DATA   — elcentralkollen-data.json (single source of truth)
     2. ENGINE — pure compute (UNCHANGED v1→v2; oracle 13/13) : addition -> golv
                 -> osäkerhet -> 2x2-cell
     3. VIEW   — 6-stegs wizard -> tvåaxlat besked (authored, säkerhets-/redo-medvetet)
   Doktrin: docs/SPEC.md. Fakta: research/FACTS.md. UI-copy är svensk by design.
   ============================================================================ */
(function () {
  'use strict';

  /* ---------- Ikoner (inline SVG) --------------------------------------- */
  const ICONS = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/></svg>',
    ban: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="6" y1="12" x2="18" y2="12"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
    xtwitter: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    reddit: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm5.01 9.21c.026.18.04.365.04.55 0 2.8-3.262 5.07-7.286 5.07-4.024 0-7.286-2.27-7.286-5.07 0-.19.014-.378.042-.562a1.412 1.412 0 0 1-.65-1.187 1.42 1.42 0 0 1 2.408-1.018 7.157 7.157 0 0 1 3.864-1.21l.737-3.468a.3.3 0 0 1 .357-.23l2.434.518a1.01 1.01 0 1 1-.117.562l-2.155-.458-.66 3.11a7.15 7.15 0 0 1 3.806 1.205 1.42 1.42 0 1 1 1.715 2.205zM8.5 11.75a1.06 1.06 0 1 0 2.12 0 1.06 1.06 0 0 0-2.12 0zm5.69 2.92c-.74.74-2.27.8-2.69.8-.42 0-1.95-.06-2.69-.8a.27.27 0 0 1 .38-.38c.46.46 1.45.63 2.31.63.86 0 1.85-.17 2.31-.63a.27.27 0 1 1 .38.38zm-.13-1.86a1.06 1.06 0 1 1 0-2.12 1.06 1.06 0 0 1 0 2.12z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'
  };
  const icon = (name) => ICONS[name] || ICONS.info;

  /* ---------- Element-helper -------------------------------------------- */
  const el = (tag, attrs, children) => {
    const node = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') node.className = attrs[k];
      else if (k === 'html') node.innerHTML = attrs[k];
      else if (k.startsWith('on') && typeof attrs[k] === 'function') node.addEventListener(k.slice(2), attrs[k]);
      else if (k === 'data') for (const dk in attrs[k]) node.dataset[dk] = attrs[k][dk];
      else if (attrs[k] === true) node.setAttribute(k, '');
      else if (attrs[k] !== false && attrs[k] != null) node.setAttribute(k, attrs[k]);
    }
    if (children) (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c == null || c === false) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  };
  const iconSpan = (name, cls) => el('span', { class: cls || null, html: icon(name), 'aria-hidden': 'true', style: 'display:inline-flex' });

  /* =====================================================================
     ENGINE — ren beräkning (oförändrad v1→v2; engine.test.js måste vara grön)
     ===================================================================== */
  const LEVEL_ORDER = { lag: 0, forhojd: 1, hog: 2 };
  const maxLevel = (a, b) => (LEVEL_ORDER[a] >= LEVEL_ORDER[b] ? a : b);

  function computeSafety(answers, data) {
    const w = data.scoring.weights;
    const warn = answers.varningstecken || [];
    let score = 0;
    score += (w.alder[answers.alder] || 0);
    score += (w.sakringstyp[answers.sakringstyp] || 0);
    score += (w.jordfelsbrytare[answers.jordfelsbrytare] || 0);
    warn.forEach(id => { score += (w.varningstecken[id] || 0); });

    const t = data.scoring.thresholds;
    let level = score >= t.hog ? 'hog' : (score >= t.forhojd ? 'forhojd' : 'lag');

    const floors = data.scoring.floors;
    const presentSymptom = floors.present_symptom.trigger_ids.some(id => warn.includes(id));
    if (presentSymptom) level = maxLevel(level, floors.present_symptom.min_level);
    const escalation = warn.includes(floors.escalation.trigger_id);
    if (escalation) level = maxLevel(level, floors.escalation.min_level);

    const unc = data.scoring.uncertainty;
    const uncertaintyCount = unc.counts_fields.filter(f => answers[f] === 'vet_inte').length;

    let state = level;
    if (level === 'lag' && uncertaintyCount >= unc.min_count && !presentSymptom && !escalation) state = 'oklart';
    return { score, level, state, uncertaintyCount, presentSymptom, escalation };
  }

  function pickPrimaryPlan(planer) {
    return ['elbil', 'varmepump', 'solceller', 'renovering'].find(p => (planer || []).includes(p)) || null;
  }
  function computeReady(answers, data) {
    const planer = answers.planer || [];
    if (!planer.length || planer.includes('inget')) return { state: 'ej_bedomd', plan: null };
    const plan = pickPrimaryPlan(planer);
    for (const r of data.scoring.ready.rules) {
      if (r.plan !== plan) continue;
      if (r.huvudsakring && !r.huvudsakring.includes(answers.huvudsakring)) continue;
      return { state: r.state, plan };
    }
    return { state: 'kraver_bedomning', plan };
  }
  function computeCrossAxis(answers, data) {
    const out = {};
    (data.scoring.cross_axis_rules || []).forEach(rule => {
      const c = rule.if; let ok = true;
      if (c.alder_in && !c.alder_in.includes(answers.alder)) ok = false;
      if (c.sakringstyp && answers.sakringstyp !== c.sakringstyp) ok = false;
      if (c.has_any_plan) { const p = answers.planer || []; if (!p.length || (p.length === 1 && p.includes('inget'))) ok = false; }
      if (ok) { out.ready_finding = rule.then.ready_finding; out.strengthen_cell = rule.then.strengthen_cell; }
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
    const safety = computeSafety(answers, data);
    const ready = computeReady(answers, data);
    const crossAxis = computeCrossAxis(answers, data);
    return { answers, safety, ready, crossAxis, cell: computeCell(safety, ready) };
  }

  function findingMatches(when, dx) {
    const a = dx.answers;
    if (when.sakringstyp && a.sakringstyp !== when.sakringstyp) return false;
    if (when.jordfelsbrytare && a.jordfelsbrytare !== when.jordfelsbrytare) return false;
    if (when.huvudsakring && a.huvudsakring !== when.huvudsakring) return false;
    if (when.huvudsakring_in && !when.huvudsakring_in.includes(a.huvudsakring)) return false;
    if (when.alder_in && !when.alder_in.includes(a.alder)) return false;
    if (when.varningstecken_has && !(a.varningstecken || []).includes(when.varningstecken_has)) return false;
    if (when.ready_state && dx.ready.state !== when.ready_state) return false;
    if (when.cross_axis && dx.crossAxis.ready_finding !== when.cross_axis) return false;
    if (when.no_plan) { const p = a.planer || []; if (p.length && !(p.length === 1 && p.includes('inget'))) return false; }
    return true;
  }
  // Rank-aware + grön-cellen leder med lugn (ok först när inga varningar finns).
  function collectFindings(dx, data) {
    const matched = (data.findings || []).filter(f => findingMatches(f.when, dx)).filter(f => f.id !== 'f_brand_lukt');
    const hasWarn = matched.some(f => f.icon === 'warn');
    const order = hasWarn ? { warn: 0, info: 1, ok: 2 } : { ok: 0, info: 1, warn: 2 };
    return matched.sort((x, y) => (order[x.icon] - order[y.icon]) || ((x.rank || 50) - (y.rank || 50)));
  }

  /* =====================================================================
     APP
     ===================================================================== */
  class ElcentralApp {
    constructor(mount, data) {
      this.mount = mount;
      this.data = data;
      this.questions = data.questions;
      this.answers = {};
      this.step = 1;
      this.housingType = 'villa';
      this._flashT = null;
      this.hydrateFromUrl();
      this.bindHistory();
    }

    encodeVector() {
      const pre = this.data.state_schema.prefixes;
      return this.questions.map(q => {
        const ans = this.answers[q.id];
        if (ans == null) return null;
        const idxOf = (id) => q.options.findIndex(o => o.id === id);
        if (q.type === 'multi') { const ids = Array.isArray(ans) ? ans : [ans]; return pre[q.id] + ids.map(idxOf).filter(i => i >= 0).sort((a, b) => a - b).join(''); }
        return pre[q.id] + idxOf(ans);
      }).filter(Boolean).join('.');
    }
    decodeVector(str) {
      if (!str) return {};
      const byPrefix = {};
      Object.entries(this.data.state_schema.prefixes).forEach(([qid, p]) => { byPrefix[p] = qid; });
      const out = {};
      str.split('.').forEach(seg => {
        const qid = byPrefix[seg[0]]; if (!qid) return;
        const q = this.questions.find(qq => qq.id === qid); if (!q) return;
        const digits = seg.slice(1);
        if (q.type === 'multi') out[qid] = digits.split('').map(d => q.options[parseInt(d, 10)]).filter(Boolean).map(o => o.id);
        else { const o = q.options[parseInt(digits, 10)]; if (o) out[qid] = o.id; }
      });
      return out;
    }
    hydrateFromUrl() {
      const vec = new URLSearchParams(window.location.search).get('q');
      if (vec) {
        this.answers = this.decodeVector(vec);
        const complete = this.questions.every(q => this.answers[q.id] != null);
        this.step = complete ? 7 : (this.questions.findIndex(q => this.answers[q.id] == null) + 1 || 7);
      }
    }
    writeResultUrl(push) {
      const p = new URLSearchParams(window.location.search);
      p.set('q', this.encodeVector());
      const url = window.location.pathname + '?' + p.toString() + window.location.hash;
      if (push) history.pushState({ step: 7 }, '', url); else history.replaceState({ step: 7 }, '', url);
    }
    bindHistory() { window.addEventListener('popstate', () => { this.hydrateFromUrl(); this.render(); }); }

    answerSingle(q, optionId) { this.answers[q.id] = optionId; this.advance(); }
    toggleMulti(q, optionId) {
      const opt = q.options.find(o => o.id === optionId);
      let cur = Array.isArray(this.answers[q.id]) ? this.answers[q.id].slice() : [];
      if (opt.exclusive) { cur = cur.includes(optionId) ? [] : [optionId]; }
      else {
        cur = cur.filter(id => { const o = q.options.find(oo => oo.id === id); return !(o && o.exclusive); });
        cur = cur.includes(optionId) ? cur.filter(id => id !== optionId) : cur.concat(optionId);
      }
      this.answers[q.id] = cur;
    }
    advance() { if (this.step >= 6) { this.step = 7; this.writeResultUrl(true); } else { this.step += 1; } this.render(); }
    back() { if (this.step > 1) this.step -= 1; this.render(); }
    restart() { this.answers = {}; this.step = 1; history.pushState({ step: 1 }, '', window.location.pathname + window.location.hash); this.render(); }

    render() {
      const noscript = this.mount.querySelector('.ampy-ec__noscript');
      if (noscript) noscript.remove();
      this.mount.dataset.booted = 'true';
      const block = (this.step >= 7) ? this.renderResult() : this.renderQuestion(this.questions[this.step - 1]);
      this.mount.replaceChildren(block);
      const focusTarget = this.mount.querySelector('[data-focus]');
      if (focusTarget) { try { focusTarget.focus({ preventScroll: false }); } catch (e) { focusTarget.focus(); } }
    }

    /* ---------------- FRÅGESTEG ---------------- */
    renderQuestion(q) {
      const block = el('div', { class: 'ampy-ec__block', role: 'group', 'aria-labelledby': 'ampy-ec-q' });

      if (this.step === 1 && this.data.meta.tool_intro) block.appendChild(el('p', { class: 'ampy-ec__intro' }, this.data.meta.tool_intro));

      const crumb = el('div', { class: 'ampy-ec__crumb' });
      if (this.step > 1) {
        crumb.appendChild(el('button', { class: 'ampy-ec__crumb-back', type: 'button', 'aria-label': 'Tillbaka till föregående fråga', onclick: () => this.back() }, [iconSpan('arrowLeft'), 'Tillbaka']));
        crumb.appendChild(el('span', { class: 'ampy-ec__crumb-sep', 'aria-hidden': 'true' }, '·'));
      }
      const steps = el('div', { class: 'ampy-ec__steps', 'aria-hidden': 'true' });
      for (let i = 1; i <= 6; i++) steps.appendChild(el('span', { class: i < this.step ? 'is-done' : (i === this.step ? 'is-current' : '') }));
      crumb.appendChild(steps);
      crumb.appendChild(el('p', { class: 'ampy-ec__progress' }, this.data.copy.progress.replace('{n}', String(this.step))));
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
        list.appendChild(el('li', {}, el('button', {
          class: 'ampy-ec__option' + (selected ? ' is-selected' : ''), type: 'button', onclick: () => this.answerSingle(q, opt.id)
        }, [
          el('span', { class: 'ampy-ec__option-body' }, [
            el('span', { class: 'ampy-ec__option-title' }, opt.label),
            opt.clarifier ? el('span', { class: 'ampy-ec__option-clarifier' }, opt.clarifier) : null
          ]),
          iconSpan('arrowRight', 'ampy-ec__option-arrow')
        ])));
      });
      return list;
    }

    // In-place mutation (behåller fokus + tillförlitlig live-räkning). Aldrig replaceWith.
    renderMultiOptions(q) {
      const group = el('ul', { class: 'ampy-ec__options', role: 'group', 'aria-labelledby': 'ampy-ec-q' });
      const refs = {};
      q.options.forEach(opt => {
        const checked = (Array.isArray(this.answers[q.id]) ? this.answers[q.id] : []).includes(opt.id);
        const check = el('span', { class: 'ampy-ec__check', 'aria-hidden': 'true' }, checked ? iconSpan('check') : null);
        const btn = el('button', {
          class: 'ampy-ec__option ampy-ec__option--multi' + (checked ? ' is-selected' : ''),
          type: 'button', role: 'checkbox', 'aria-checked': String(checked),
          onclick: () => { this.toggleMulti(q, opt.id); sync(); }
        }, [check, el('span', { class: 'ampy-ec__option-body' }, [
          el('span', { class: 'ampy-ec__option-title' }, opt.label),
          opt.clarifier ? el('span', { class: 'ampy-ec__option-clarifier' }, opt.clarifier) : null
        ])]);
        refs[opt.id] = { btn, check };
        group.appendChild(el('li', {}, btn));
      });

      const countSpan = el('span', { class: 'ampy-ec__multi-count', id: 'ampy-ec-multi-hint', role: 'status', 'aria-live': 'polite' });
      const fortsatt = el('button', {
        class: 'ampy-ec__cta-primary ampy-ec__cta-primary--outline', type: 'button', 'aria-describedby': 'ampy-ec-multi-hint',
        onclick: () => { const cur = Array.isArray(this.answers[q.id]) ? this.answers[q.id] : []; if (cur.length) this.advance(); }
      }, ['Fortsätt', iconSpan('arrowRight')]);

      const sync = () => {
        const cur = Array.isArray(this.answers[q.id]) ? this.answers[q.id] : [];
        q.options.forEach(opt => {
          const on = cur.includes(opt.id); const r = refs[opt.id];
          r.btn.classList.toggle('is-selected', on);
          r.btn.setAttribute('aria-checked', String(on));
          r.check.replaceChildren(); if (on) r.check.appendChild(iconSpan('check'));
        });
        const n = cur.filter(id => id !== 'inget').length;
        countSpan.textContent = cur.length ? (cur.includes('inget') ? '' : (n + (n === 1 ? ' vald' : ' valda'))) : this.data.copy.multi_hint;
        fortsatt.setAttribute('aria-disabled', String(cur.length === 0));
      };
      sync();
      return el('div', { class: 'ampy-ec__multi' }, [group, el('div', { class: 'ampy-ec__multi-foot' }, [countSpan, fortsatt])]);
    }

    /* ---------------- BESKED ---------------- */
    renderResult() {
      const dx = diagnose(this.answers, this.data);
      const data = this.data;
      const m = data.verdict_matrix[dx.cell];
      const block = el('div', { class: 'ampy-ec__block ampy-ec__result', role: 'region', 'aria-labelledby': 'ampy-ec-result-h' });

      block.appendChild(el('div', { class: 'ampy-ec__crumb' }, [
        el('button', { class: 'ampy-ec__crumb-back', type: 'button', 'aria-label': 'Tillbaka till frågorna', onclick: () => this.back() }, [iconSpan('arrowLeft'), 'Tillbaka']),
        el('span', { class: 'ampy-ec__crumb-sep', 'aria-hidden': 'true' }, '·'),
        el('button', { class: 'ampy-ec__crumb-restart', type: 'button', onclick: () => this.restart() }, 'Börja om')
      ]));

      if (dx.safety.escalation) {
        block.appendChild(el('div', { class: 'ampy-ec__akut', role: 'alert' }, [
          iconSpan('alert', 'ampy-ec__akut-icon'),
          el('div', {}, [el('p', { class: 'ampy-ec__akut-label' }, data.akut_notis.label), el('p', { class: 'ampy-ec__akut-text' }, data.akut_notis.text)])
        ]));
      }

      block.appendChild(el('h2', { class: 'ampy-ec__result-h', id: 'ampy-ec-result-h', tabindex: '-1', 'data-focus': 'true' }, this.selectHeadline(dx, m)));
      block.appendChild(this.renderDualStatus(dx));
      if (dx.cell !== 'sr' && m.summary) block.appendChild(el('p', { class: 'ampy-ec__result-lede' }, m.summary));
      block.appendChild(this.renderFindings(dx));

      if (dx.cell === 'rs' || dx.cell === 'rr') {
        block.appendChild(el('div', { class: 'ampy-ec__factnote', role: 'note' }, [
          iconSpan('info', 'ampy-ec__factnote-icon'),
          el('div', {}, [
            el('p', { class: 'ampy-ec__factnote-text' }, data.facts.brand.text),
            el('p', { class: 'ampy-ec__factnote-text ampy-ec__factnote-text--quiet' }, data.facts.insurance.text),
            el('p', { class: 'ampy-ec__factnote-src' }, data.facts.brand.source)
          ])
        ]));
      }

      const cost = this.renderCost(dx);
      if (cost) block.appendChild(cost);
      block.appendChild(this.renderCta(dx));
      block.appendChild(this.renderPdfCapture(dx));
      return block;
    }

    // Säkerhets-nivå vinner (kritiker-fix): 'hog' får alltid en bestämd rubrik.
    selectHeadline(dx, m) {
      if (m.headline_by_safety && m.headline_by_safety[dx.safety.state]) return m.headline_by_safety[dx.safety.state];
      if (m.headline_by_ready && m.headline_by_ready[dx.ready.state]) return m.headline_by_ready[dx.ready.state];
      return m.headline || this.buildSummarySentence(dx);
    }

    buildSummarySentence(dx) {
      const safetyPhrase = { lag: 'säker', forhojd: 'förhöjd risk', hog: 'hög risk', oklart: 'oklart läge' }[dx.safety.state];
      const readyPhrase = { redo_marginal: 'redo för elbil', redo_med_atgard: 'redo för elbil med lastbalansering', inte_redo: 'inte redo för elbil utan åtgärd', kraver_bedomning: 'redo-läget behöver bedömas', ej_bedomd: 'ingen planerad last' }[dx.ready.state];
      return 'Din central: ' + safetyPhrase + ', ' + readyPhrase + '.';
    }

    renderDualStatus(dx) {
      const data = this.data;
      const ss = data.safety_states[dx.safety.state];
      const readyMeta = data.ready_states[dx.ready.state];
      const readyPill = data.scoring.ready.pill_levels[dx.ready.state] || 'neutral';
      const worst = (dx.safety.state === 'forhojd' || dx.safety.state === 'hog') ? ss.pill_level : (readyPill === 'warning' ? 'warning' : ss.pill_level);

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
      return el('div', { class: 'ampy-ec__statusrow' }, [
        el('span', { class: 'ampy-ec__statusrow-axis' }, axisLabel),
        el('span', { class: 'ampy-ec__pill', data: { level: pillLevel } }, [iconSpan(iconName, 'ampy-ec__pill-icon'), el('span', {}, valueLabel)])
      ]);
    }

    renderFindings(dx) {
      const findings = collectFindings(dx, this.data);
      const wrap = el('div', { class: 'ampy-ec__findings-wrap' });
      wrap.appendChild(el('p', { class: 'ampy-ec__findings-head', id: 'ampy-ec-findings-head' }, this.data.copy.findings_head || 'Dina fynd'));
      const list = el('ul', { class: 'ampy-ec__findings', role: 'list', 'aria-labelledby': 'ampy-ec-findings-head' });
      findings.forEach(f => {
        const iconName = f.icon === 'ok' ? 'check' : (f.icon === 'warn' ? 'alert' : 'info');
        list.appendChild(el('li', { class: 'ampy-ec__finding ampy-ec__finding--' + f.icon }, [iconSpan(iconName, 'ampy-ec__finding-icon'), el('p', { class: 'ampy-ec__finding-text' }, f.text)]));
      });
      wrap.appendChild(list);
      return wrap;
    }

    scopeNote() {
      const parts = (this.data.costs.date || '2026-06').split('-');
      const months = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
      const dlabel = ((months[(+parts[1]) - 1] || '') + ' ' + parts[0]).trim();
      return (this.data.meta.scope_note || '').replace('{date}', dlabel);
    }

    renderCost(dx) {
      const c = this.data.costs;
      const cell = dx.cell;
      if (cell === 'sr') return null;
      const hasElbil = (this.answers.planer || []).includes('elbil');
      const labourSigned = c.centralbyte._labour_signed === true;

      const block = el('div', { class: 'ampy-ec__cost' });
      block.appendChild(el('p', { class: 'ampy-ec__cost-head' }, c.cost_head || 'Vad det ungefär kostar'));
      let showedRotRow = false;
      const addRow = (label, value, note) => {
        block.appendChild(el('div', { class: 'ampy-ec__cost-row' }, [el('span', { class: 'ampy-ec__cost-label' }, label), el('span', { class: 'ampy-ec__cost-value' }, value)]));
        if (note) block.appendChild(el('p', { class: 'ampy-ec__cost-note' }, note));
      };

      if (cell === 'si') {
        if (dx.ready.state === 'inte_redo') {
          addRow('Lastbalansering', 'Pris i offert', 'ofta det billigaste alternativet vid kapacitetsbrist.');
          addRow('Uppsäkring eller byte', 'Pris i offert', 'om kapaciteten behöver höjas.');
        } else {
          addRow('Laddbox med installation', 'Pris i offert', c.gron_teknik_note);
          addRow('Lastbalansering', 'Pris i offert', c.gron_teknik_lastbalansering_note);
        }
      }
      if (cell === 'rs' || cell === 'rr') {
        const type = this.housingType || 'villa';
        const typeLabel = { lagenhet: 'lägenhet', radhus: 'radhus', villa: 'villa' }[type];
        const cb = c.centralbyte[type];
        const value = labourSigned ? ('ca ' + cb.efter_rot + ' kr efter ROT') : (cb.fore_rot + ' kr');
        addRow('Byte till modern central (' + typeLabel + ')', value, labourSigned ? null : 'före ROT.');
        showedRotRow = true;
        block.appendChild(this.renderHousingControl(dx));
        if (cell === 'rs') { addRow('Jordfelsbrytare separat', c.jfb.typ_a + ' kr', 'installerad, typ A. ROT 30 % gäller arbetet.'); }
        if (hasElbil) addRow('Laddbox (om du går vidare)', 'Pris i offert', c.gron_teknik_note);
      }

      if (showedRotRow && this.data.meta.rot_note) block.appendChild(el('p', { class: 'ampy-ec__cost-foot' }, this.data.meta.rot_note));
      if (cell === 'si') block.appendChild(el('a', { class: 'ampy-ec__cost-link', href: this.data.meta.laddbox_calc_url }, 'Räkna det gröna avdraget'));
      block.appendChild(el('p', { class: 'ampy-ec__cost-scope' }, this.scopeNote()));
      return block;
    }

    renderHousingControl(dx) {
      const types = [['lagenhet', 'Lägenhet'], ['radhus', 'Radhus'], ['villa', 'Villa']];
      const row = el('div', { class: 'ampy-ec__cost-segmented', role: 'radiogroup', 'aria-label': 'Bostadstyp' });
      types.forEach(([id, label]) => {
        const sel = (this.housingType || 'villa') === id;
        row.appendChild(el('button', {
          class: 'ampy-ec__seg' + (sel ? ' is-selected' : ''), type: 'button', role: 'radio', 'aria-checked': String(sel),
          onclick: () => {
            this.housingType = id;
            const old = this.mount.querySelector('.ampy-ec__cost');
            const fresh = this.renderCost(dx);
            if (old && fresh) { old.replaceWith(fresh); const nb = fresh.querySelector('.ampy-ec__seg.is-selected'); if (nb) nb.focus(); }
          }
        }, label));
      });
      return row;
    }

    resolveCtaUrl(def) {
      if (!def) return '#';
      if (def.url_key) return this.data.meta.service_pages[def.url_key] || this.data.meta.ampy_offert_url;
      if (def.url && this.data.meta[def.url]) return this.data.meta[def.url];
      return def.url || this.data.meta.ampy_offert_url;
    }

    renderCta(dx) {
      const wrap = document.createDocumentFragment();
      const matrix = this.data.verdict_matrix[dx.cell];
      const defs = this.data.cta_defs;
      const cta = matrix.cta;

      if (dx.cell === 'sr') {
        let linkDef = null;
        const planer = this.answers.planer || [];
        const hasPlan = planer.some(p => p !== 'inget') && planer.length;
        const highFuse = ['25', '35'].includes(this.answers.huvudsakring);
        if (hasPlan) linkDef = defs.laddbox_bridge; else if (highFuse) linkDef = defs.nedsakring_hook;
        if (linkDef) wrap.appendChild(el('a', { class: 'ampy-ec__cta-link', href: this.resolveCtaUrl(linkDef) }, [linkDef.label, iconSpan('arrowRight')]));
        wrap.appendChild(this.renderTrustRow(dx));
        return wrap;
      }

      let primaryDef = defs[cta.primary];
      if (dx.cell === 'rr' && dx.safety.state === 'hog') primaryDef = defs.centralbyte_offert;
      const ringSigned = defs.ring && !defs.ring._pending_signoff && defs.ring.url && defs.ring.url !== 'tel:+46812345678';

      if (dx.safety.escalation && ringSigned) {
        wrap.appendChild(el('a', { class: 'ampy-ec__cta-primary ampy-ec__cta-primary--solid', href: defs.ring.url }, [iconSpan('phone'), defs.ring.label]));
        if (primaryDef) wrap.appendChild(el('a', { class: 'ampy-ec__cta-secondary', href: this.resolveCtaUrl(primaryDef) }, [primaryDef.label, iconSpan('arrowRight')]));
      } else {
        if (primaryDef) wrap.appendChild(el('a', { class: 'ampy-ec__cta-primary ampy-ec__cta-primary--solid', href: this.resolveCtaUrl(primaryDef) }, [primaryDef.label, iconSpan('arrowRight')]));
        if (cta.secondary) { const sec = defs[cta.secondary]; wrap.appendChild(el('a', { class: 'ampy-ec__cta-secondary', href: this.resolveCtaUrl(sec) }, [sec.label, iconSpan('arrowRight')])); }
        if (dx.safety.escalation) wrap.appendChild(el('p', { class: 'ampy-ec__akut-phone-note' }, 'Ring oss gärna direkt. Numret bekräftas innan lansering.'));
      }
      wrap.appendChild(this.renderTrustRow(dx));
      return wrap;
    }

    renderTrustRow(dx) {
      const row = el('div', { class: 'ampy-ec__trust-row' });
      row.appendChild(el('p', { class: 'ampy-ec__trust' }, [
        this.data.copy.trust_pre + ' ',
        el('a', { href: this.data.meta.verify_company_url, target: '_blank', rel: 'noopener noreferrer' }, this.data.copy.trust_link),
        '.'
      ]));
      const right = el('div', { class: 'ampy-ec__trust-actions' });
      if (dx.cell === 'sr') right.appendChild(el('span', { class: 'ampy-ec__share-nudge' }, this.data.copy.share_nudge_green));
      right.appendChild(this.renderShareButton(dx));
      row.appendChild(right);
      return row;
    }

    // Feature-flag: dölj hela capture-blocket tills webhook OCH integritetspolicy finns.
    renderPdfCapture(dx) {
      if (!this.data.meta.pdf_webhook_url || !this.data.meta.privacy_policy_url) return document.createComment('pdf-capture dold: webhook/integritetspolicy saknas');
      const label = (dx.cell === 'sr') ? this.data.copy.pdf_capture_green : this.data.copy.pdf_capture;
      const wrap = el('div', { class: 'ampy-ec__pdf' });
      const status = el('p', { class: 'ampy-ec__pdf-status', role: 'status', 'aria-live': 'polite' });
      const hp = el('input', { type: 'text', name: 'webbplats', class: 'ampy-ec__hp', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true' });
      const email = el('input', { type: 'email', id: 'ampy-ec-email', class: 'ampy-ec__pdf-input', placeholder: 'din@epost.se', required: true, autocomplete: 'email' });
      const consentBox = el('input', { type: 'checkbox', required: true });
      const toggle = el('button', { class: 'ampy-ec__pdf-toggle', type: 'button', 'aria-expanded': 'false' }, [iconSpan('mail'), label]);
      const form = el('form', { class: 'ampy-ec__pdf-form', hidden: true, onsubmit: async (e) => {
        e.preventDefault();
        if (hp.value) { status.textContent = 'Tack!'; return; }
        status.textContent = 'Skickar…';
        try {
          await fetch(this.data.meta.pdf_webhook_url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': (window.AmpyEC && window.AmpyEC.restNonce) || '' }, body: JSON.stringify({ epost: email.value, vector: this.encodeVector(), cell: dx.cell, samtycke: consentBox.checked, webbplats: hp.value }) });
          status.textContent = 'Tack! Rapporten är på väg till din inkorg.'; form.hidden = true; toggle.setAttribute('aria-expanded', 'false');
        } catch (err) { status.textContent = 'Kunde inte skicka just nu. Försök igen om en stund.'; }
      } }, [
        el('label', { class: 'ampy-ec__pdf-flabel', for: 'ampy-ec-email' }, 'E-post'), email, hp,
        el('label', { class: 'ampy-ec__pdf-consent' }, [consentBox, el('span', {}, [this.data.copy.pdf_consent + ' ', el('a', { href: this.data.meta.privacy_policy_url, target: '_blank', rel: 'noopener noreferrer' }, 'Integritetspolicy'), '.'])]),
        el('button', { class: 'ampy-ec__cta-primary ampy-ec__cta-primary--outline', type: 'submit' }, 'Mejla rapporten')
      ]);
      toggle.addEventListener('click', () => { const open = form.hidden === false; form.hidden = open; toggle.setAttribute('aria-expanded', String(!open)); if (!open) email.focus(); });
      wrap.appendChild(toggle); wrap.appendChild(form); wrap.appendChild(status);
      return wrap;
    }

    /* ---------------- Dela ---------------- */
    renderShareButton(dx) {
      const status = el('span', { class: 'ampy-ec__share-status', role: 'status', 'aria-live': 'polite' });
      const shareUrl = window.location.origin + window.location.pathname + '?q=' + encodeURIComponent(this.encodeVector());
      const shareTitle = 'Elcentral-kollen';
      const shareText = (dx.cell === 'sr') ? ((dx.ready.state === 'redo_marginal') ? this.data.copy.share_green_marginal : this.data.copy.share_green) : this.buildSummarySentence(dx);
      const anchor = el('span', { class: 'ampy-ec__share-anchor' });
      const menu = el('div', { class: 'ampy-ec__share-menu', role: 'menu', 'aria-label': 'Dela resultatet', hidden: true });
      const enc = encodeURIComponent;
      [
        { label: 'Facebook', icon: 'facebook', href: 'https://www.facebook.com/sharer/sharer.php?u=' + enc(shareUrl) },
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
        if (navigator.share && isTouch) {
          let file = null;
          try { file = await this.generateShareImage(dx, shareUrl, shareText); } catch (e) {}
          try { const payload = { title: shareTitle, text: shareText, url: shareUrl }; if (file && navigator.canShare && navigator.canShare({ files: [file] })) payload.files = [file]; await navigator.share(payload); return; } catch (e) {}
        }
        if (menu.hidden) openMenu(); else closeMenu();
      } }, iconSpan('share'));
      anchor.appendChild(btn); anchor.appendChild(menu); anchor.appendChild(status);
      return anchor;
    }

    async generateShareImage(dx, urlStr, shareText) {
      const W = 1200, H = 630;
      const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext('2d');
      const pal = { success: '#1f8f6b', warning: '#8a6d10', error: '#a32330', info: '#2a4a7a', neutral: '#5a5d7a' };
      const ss = this.data.safety_states[dx.safety.state];
      const rPill = this.data.scoring.ready.pill_levels[dx.ready.state] || 'neutral';
      const worst = (dx.safety.state === 'forhojd' || dx.safety.state === 'hog') ? ss.pill_level : (rPill === 'warning' ? 'warning' : ss.pill_level);

      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = pal[worst] || pal.neutral; ctx.fillRect(0, 0, 16, H);
      ctx.fillStyle = 'rgba(9,11,50,0.55)'; ctx.font = '600 24px "Plus Jakarta Sans", system-ui, sans-serif'; ctx.fillText('AMPY · ELCENTRAL-KOLLEN', 72, 84);
      if (this.data.meta.share_card_authority) { ctx.fillStyle = 'rgba(9,11,50,0.4)'; ctx.font = '500 20px "Outfit", system-ui, sans-serif'; ctx.fillText(this.data.meta.share_card_authority, 72, 120); }

      ctx.fillStyle = '#090b32'; ctx.font = '700 50px "Plus Jakarta Sans", system-ui, sans-serif';
      this._wrap(ctx, shareText, 72, 220, W - 144, 60);

      const drawPill = (x, y, label, value, lvl) => {
        ctx.fillStyle = 'rgba(9,11,50,0.55)'; ctx.font = '500 24px "Outfit", system-ui, sans-serif'; ctx.fillText(label, x, y);
        ctx.fillStyle = pal[lvl] || pal.neutral; ctx.font = '700 34px "Plus Jakarta Sans", system-ui, sans-serif'; ctx.fillText(value, x, y + 44);
      };
      drawPill(72, 430, 'Säkerhet', ss.label, ss.pill_level);
      drawPill(620, 430, this.data.ready_states[dx.ready.state].axis_label, this.data.ready_states[dx.ready.state].label, rPill);

      ctx.fillStyle = 'rgba(9,11,50,0.6)'; ctx.font = '600 22px "Outfit", system-ui, sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(this.data.meta.share_card_cta || 'Gör testet gratis →', 72, H - 52);
      ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(9,11,50,0.45)'; ctx.font = '500 20px "Outfit", system-ui, sans-serif';
      ctx.fillText(urlStr.replace(/^https?:\/\//, '').replace(/\?.*$/, ''), W - 72, H - 52); ctx.textAlign = 'left';

      const blob = await new Promise(res => canvas.toBlob(res, 'image/png', 0.92));
      if (!blob) return null;
      return new File([blob], 'elcentral-kollen.png', { type: 'image/png' });
    }
    _wrap(ctx, text, x, y, maxW, lineH) {
      const words = String(text || '').split(/\s+/); let line = '', yy = y;
      for (let i = 0; i < words.length; i++) { const test = line ? line + ' ' + words[i] : words[i]; if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, yy); line = words[i]; yy += lineH; } else line = test; }
      if (line) ctx.fillText(line, x, yy);
    }
  }

  /* ---------- Boot ------------------------------------------------------ */
  function boot(mount) {
    if (!mount || mount.dataset.booted === 'true') return;
    const injected = (window.AmpyEC && window.AmpyEC.data) || null;
    const start = (data) => {
      // Dev-assertion: bränd lukt MÅSTE vara golv-only (vikt 0) — skyddar invariant #4/#8.
      try { if (data.scoring.weights.varningstecken.brand_lukt !== 0) console.warn('[Elcentral-kollen] VARNING: brand_lukt-vikten är inte 0 — eskaleringen ska vara golv-only, inte en addend.'); } catch (e) {}
      new ElcentralApp(mount, data).render();
    };
    if (injected) { start(injected); return; }
    const dataUrl = mount.dataset.dataUrl || '../data/elcentralkollen-data.json';
    fetch(dataUrl, { credentials: 'same-origin' })
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(start)
      .catch(err => { console.error('[Elcentral-kollen] kunde inte ladda data:', err); mount.innerHTML = '<div class="ampy-ec__block"><p>Kunde inte ladda verktyget just nu.</p></div>'; });
  }

  window.AmpyEC = window.AmpyEC || {};
  window.AmpyEC.diagnose = diagnose;
  window.AmpyEC.computeSafety = computeSafety;
  window.AmpyEC.computeReady = computeReady;
  window.AmpyEC.computeCell = computeCell;
  window.AmpyEC.boot = boot;

  document.addEventListener('DOMContentLoaded', () => { document.querySelectorAll('.ampy-ec').forEach(boot); });
})();
