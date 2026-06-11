/* ============================================================================
   Elcentral-kollen — diagnosmotor + wizard (vanilla ES6, no build)
   Forkad från Elkollen (ampy-behorighetskollen) men anpassad för:
     1. DATA   — elcentralkollen-data.json (single source of truth)
     2. ENGINE — pure compute: addition -> golv -> osäkerhet -> 2x2-cell
     3. VIEW   — 6-stegs wizard (single + multi) -> tvåaxlat besked
   Doktrin: docs/SPEC.md. Fakta: research/FACTS.md. UI-copy är svensk by design.
   ============================================================================ */
(function () {
  'use strict';

  /* ---------- Ikoner (inline SVG, stroke-baserade) ---------------------- */
  const ICONS = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/></svg>',
    ban: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
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
     ENGINE — ren beräkning. Inga DOM-beroenden. Testbar i isolering.
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

    // GOLV (vinner över additionen) ------------------------------------
    const floors = data.scoring.floors;
    const presentSymptom = floors.present_symptom.trigger_ids.some(id => warn.includes(id));
    if (presentSymptom) level = maxLevel(level, floors.present_symptom.min_level);

    const escalation = warn.includes(floors.escalation.trigger_id);
    if (escalation) level = maxLevel(level, floors.escalation.min_level);

    // OSÄKERHET ≠ RISK -------------------------------------------------
    const unc = data.scoring.uncertainty;
    const uncertaintyCount = unc.counts_fields.filter(f => answers[f] === 'vet_inte').length;

    let state = level;
    if (level === 'lag' && uncertaintyCount >= unc.min_count && !presentSymptom && !escalation) {
      state = 'oklart';
    }
    return { score, level, state, uncertaintyCount, presentSymptom, escalation };
  }

  function pickPrimaryPlan(planer) {
    const order = ['elbil', 'varmepump', 'solceller', 'renovering'];
    return order.find(p => (planer || []).includes(p)) || null;
  }

  function computeReady(answers, data) {
    const planer = answers.planer || [];
    if (!planer.length || planer.includes('inget')) return { state: 'ej_bedomd', plan: null };
    const plan = pickPrimaryPlan(planer);
    const rules = data.scoring.ready.rules;
    for (const r of rules) {
      if (r.plan !== plan) continue;
      if (r.huvudsakring && !r.huvudsakring.includes(answers.huvudsakring)) continue;
      return { state: r.state, plan };
    }
    return { state: 'kraver_bedomning', plan };
  }

  function computeCrossAxis(answers, data) {
    const out = {};
    (data.scoring.cross_axis_rules || []).forEach(rule => {
      const c = rule.if;
      let ok = true;
      if (c.alder_in && !c.alder_in.includes(answers.alder)) ok = false;
      if (c.sakringstyp && answers.sakringstyp !== c.sakringstyp) ok = false;
      if (c.has_any_plan) {
        const p = answers.planer || [];
        if (!p.length || (p.length === 1 && p.includes('inget'))) ok = false;
      }
      if (ok) { out.ready_finding = rule.then.ready_finding; out.strengthen_cell = rule.then.strengthen_cell; }
    });
    return out;
  }

  // 2x2-kollaps (enkelriktad). ej_bedomd -> ingen Redo-claim (säkerhet styr cellen).
  function computeCell(safety, ready) {
    const safe = (safety.state === 'lag' || safety.state === 'oklart');
    if (ready.state === 'ej_bedomd') return safe ? 'sr' : 'rs';
    const redo = (ready.state === 'redo_marginal');
    if (safe) return redo ? 'sr' : 'si';
    return redo ? 'rs' : 'rr';
  }

  // Hela diagnosen i ett objekt.
  function diagnose(answers, data) {
    const safety = computeSafety(answers, data);
    const ready = computeReady(answers, data);
    const crossAxis = computeCrossAxis(answers, data);
    const cell = computeCell(safety, ready);
    return { answers, safety, ready, crossAxis, cell };
  }

  /* ---------- Findings: matcha when-villkor mot svar + states ----------- */
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
    if (when.no_plan) {
      const p = a.planer || [];
      if (p.length && !(p.length === 1 && p.includes('inget'))) return false;
    }
    return true;
  }

  function collectFindings(dx, data) {
    const order = { warn: 0, info: 1, ok: 2 };
    return (data.findings || [])
      .filter(f => findingMatches(f.when, dx))
      // bränd lukt visas som akut-alert överst, inte som dubblerad fyndrad
      .filter(f => f.id !== 'f_brand_lukt')
      .sort((x, y) => order[x.icon] - order[y.icon]);
  }

  /* =====================================================================
     APP — wizard + besked
     ===================================================================== */
  class ElcentralApp {
    constructor(mount, data) {
      this.mount = mount;
      this.data = data;
      this.questions = data.questions;
      this.answers = {};        // { questionId: optionId | [optionIds] }
      this.step = 1;            // 1..6 = fråga, 7 = besked
      this.activeTab = 'fynd';
      this._flashT = null;
      this.hydrateFromUrl();
      this.bindHistory();
    }

    /* ---- URL = state (svarsvektor) ---- */
    encodeVector() {
      const pre = this.data.state_schema.prefixes;
      return this.questions.map(q => {
        const ans = this.answers[q.id];
        if (ans == null) return null;
        const idxOf = (id) => q.options.findIndex(o => o.id === id);
        if (q.type === 'multi') {
          const ids = Array.isArray(ans) ? ans : [ans];
          return pre[q.id] + ids.map(idxOf).filter(i => i >= 0).sort((a, b) => a - b).join('');
        }
        return pre[q.id] + idxOf(ans);
      }).filter(Boolean).join('.');
    }

    decodeVector(str) {
      if (!str) return {};
      const byPrefix = {};
      Object.entries(this.data.state_schema.prefixes).forEach(([qid, p]) => { byPrefix[p] = qid; });
      const out = {};
      str.split('.').forEach(seg => {
        const p = seg[0]; const digits = seg.slice(1);
        const qid = byPrefix[p]; if (!qid) return;
        const q = this.questions.find(qq => qq.id === qid); if (!q) return;
        if (q.type === 'multi') {
          out[qid] = digits.split('').map(d => q.options[parseInt(d, 10)]).filter(Boolean).map(o => o.id);
        } else {
          const o = q.options[parseInt(digits, 10)];
          if (o) out[qid] = o.id;
        }
      });
      return out;
    }

    hydrateFromUrl() {
      const p = new URLSearchParams(window.location.search);
      const vec = p.get('q');
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

    bindHistory() {
      window.addEventListener('popstate', () => { this.hydrateFromUrl(); this.activeTab = 'fynd'; this.render(); });
    }

    /* ---- navigation ---- */
    answerSingle(q, optionId) {
      this.answers[q.id] = optionId;
      this.advance();
    }
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
    advance() {
      if (this.step >= 6) { this.step = 7; this.writeResultUrl(true); }
      else { this.step += 1; }
      this.activeTab = 'fynd';
      this.render();
    }
    back() {
      if (this.step > 1) this.step -= 1;
      this.activeTab = 'fynd';
      this.render();
    }
    restart() {
      this.answers = {}; this.step = 1;
      const url = window.location.pathname + window.location.hash;
      history.pushState({ step: 1 }, '', url);
      this.render();
    }

    /* ---- render dispatcher + fokushantering ---- */
    render() {
      const noscript = this.mount.querySelector('.ampy-ec__noscript');
      if (noscript) noscript.remove();
      this.mount.dataset.booted = 'true';

      const block = (this.step >= 7) ? this.renderResult() : this.renderQuestion(this.questions[this.step - 1]);
      this.mount.replaceChildren(block);

      // En enda announcement-kanal: flytta fokus till stegets/beskedets rubrik.
      const focusTarget = this.mount.querySelector('[data-focus]');
      if (focusTarget) { try { focusTarget.focus({ preventScroll: false }); } catch (e) { focusTarget.focus(); } }
    }

    /* =================================================================
       FRÅGESTEG (single + multi)
       ================================================================= */
    renderQuestion(q) {
      const block = el('div', { class: 'ampy-ec__block', role: 'group', 'aria-labelledby': 'ampy-ec-q' });

      // Förloppsrad + tillbaka
      const crumb = el('div', { class: 'ampy-ec__crumb' });
      if (this.step > 1) {
        crumb.appendChild(el('button', {
          class: 'ampy-ec__crumb-back', type: 'button',
          'aria-label': 'Tillbaka till föregående fråga', onclick: () => this.back()
        }, [iconSpan('arrowLeft'), 'Tillbaka']));
        crumb.appendChild(el('span', { class: 'ampy-ec__crumb-sep', 'aria-hidden': 'true' }, '·'));
      }
      crumb.appendChild(el('p', { class: 'ampy-ec__progress' }, this.data.copy.progress.replace('{n}', String(this.step))));
      block.appendChild(crumb);

      // Frågetitel (fokusmål)
      block.appendChild(el('h2', { class: 'ampy-ec__q-title', id: 'ampy-ec-q', tabindex: '-1', 'data-focus': 'true' }, q.title));
      if (q.subtitle) block.appendChild(el('p', { class: 'ampy-ec__q-subtitle' }, q.subtitle));

      if (q.type === 'multi') block.appendChild(this.renderMultiOptions(q));
      else block.appendChild(this.renderSingleOptions(q));

      // Alltid synlig lugn infonotis (aldrig expansion)
      block.appendChild(el('div', { class: 'ampy-ec__info', role: 'note' }, [
        iconSpan('info', 'ampy-ec__info-icon'),
        el('p', { class: 'ampy-ec__info-text' }, q.note)
      ]));

      return block;
    }

    renderSingleOptions(q) {
      const list = el('ul', { class: 'ampy-ec__options', role: 'list' });
      q.options.forEach(opt => {
        const selected = this.answers[q.id] === opt.id;
        const btn = el('button', {
          class: 'ampy-ec__option' + (selected ? ' is-selected' : ''),
          type: 'button', onclick: () => this.answerSingle(q, opt.id)
        }, [
          el('span', { class: 'ampy-ec__option-body' }, [
            el('span', { class: 'ampy-ec__option-title' }, opt.label),
            opt.clarifier ? el('span', { class: 'ampy-ec__option-clarifier' }, opt.clarifier) : null
          ]),
          iconSpan('arrowRight', 'ampy-ec__option-arrow')
        ]);
        list.appendChild(el('li', {}, btn));
      });
      return list;
    }

    renderMultiOptions(q) {
      const wrap = document.createDocumentFragment();
      const group = el('ul', { class: 'ampy-ec__options', role: 'group', 'aria-labelledby': 'ampy-ec-q' });
      const cur = Array.isArray(this.answers[q.id]) ? this.answers[q.id] : [];
      q.options.forEach(opt => {
        const checked = cur.includes(opt.id);
        const btn = el('button', {
          class: 'ampy-ec__option ampy-ec__option--multi' + (checked ? ' is-selected' : ''),
          type: 'button', role: 'checkbox', 'aria-checked': String(checked),
          onclick: () => {
            this.toggleMulti(q, opt.id);
            // Re-rendera bara gruppen + fortsätt-knappens disabled-läge (behåll fokus i flödet)
            const fresh = this.renderMultiOptions(q);
            wrapNode.replaceWith(fresh);
          }
        }, [
          el('span', { class: 'ampy-ec__check', 'aria-hidden': 'true' }, checked ? iconSpan('check') : null),
          el('span', { class: 'ampy-ec__option-body' }, [
            el('span', { class: 'ampy-ec__option-title' }, opt.label),
            opt.clarifier ? el('span', { class: 'ampy-ec__option-clarifier' }, opt.clarifier) : null
          ])
        ]);
        group.appendChild(el('li', {}, btn));
      });

      const count = cur.filter(id => id !== 'inget').length;
      const fortsatt = el('div', { class: 'ampy-ec__multi-foot' }, [
        el('span', { class: 'ampy-ec__multi-count', role: 'status', 'aria-live': 'polite' },
          cur.length ? (cur.includes('inget') ? '' : (count + ' valda')) : ''),
        el('button', {
          class: 'ampy-ec__cta-primary ampy-ec__cta-primary--outline',
          type: 'button',
          disabled: cur.length === 0,
          onclick: () => { if (cur.length) this.advance(); }
        }, ['Fortsätt', iconSpan('arrowRight')])
      ]);

      const wrapNode = el('div', { class: 'ampy-ec__multi' }, [group, fortsatt]);
      wrap.appendChild(wrapNode);
      return wrap;
    }

    /* =================================================================
       BESKED — tvåaxlat
       ================================================================= */
    renderResult() {
      const dx = diagnose(this.answers, this.data);
      const data = this.data;
      const block = el('div', { class: 'ampy-ec__block ampy-ec__result', role: 'region', 'aria-labelledby': 'ampy-ec-result-h' });

      // Tillbaka
      block.appendChild(el('div', { class: 'ampy-ec__crumb' }, [
        el('button', { class: 'ampy-ec__crumb-back', type: 'button', 'aria-label': 'Tillbaka till frågorna', onclick: () => this.back() },
          [iconSpan('arrowLeft'), 'Tillbaka']),
        el('span', { class: 'ampy-ec__crumb-sep', 'aria-hidden': 'true' }, '·'),
        el('button', { class: 'ampy-ec__crumb-restart', type: 'button', onclick: () => this.restart() }, 'Börja om')
      ]));

      // AKUT-notis (role=alert, FÖRST i DOM) — om bränd lukt
      if (dx.safety.escalation) {
        block.appendChild(el('div', { class: 'ampy-ec__akut', role: 'alert' }, [
          iconSpan('alert', 'ampy-ec__akut-icon'),
          el('div', {}, [
            el('p', { class: 'ampy-ec__akut-label' }, data.akut_notis.label),
            el('p', { class: 'ampy-ec__akut-text' }, data.akut_notis.text)
          ])
        ]));
      }

      // Kombinerad summeringsmening = ljud-motsvarighet till squint-testet (fokusmål)
      const summary = this.buildSummarySentence(dx);
      block.appendChild(el('h2', { class: 'ampy-ec__result-h', id: 'ampy-ec-result-h', tabindex: '-1', 'data-focus': 'true' }, summary));

      // DUAL-STATUS (en delad accent = värsta axeln; två justerade rader)
      block.appendChild(this.renderDualStatus(dx));

      // FYND
      block.appendChild(this.renderFindings(dx));

      // FAKTANOTIS (den enda amber-accenten på skärmen)
      if (dx.cell === 'rs' || dx.cell === 'rr') {
        block.appendChild(el('div', { class: 'ampy-ec__factnote', role: 'note' }, [
          iconSpan('info', 'ampy-ec__factnote-icon'),
          el('div', {}, [
            el('p', { class: 'ampy-ec__factnote-text' }, data.facts.brand.text + ' ' + data.facts.insurance.text),
            el('p', { class: 'ampy-ec__factnote-src' }, data.facts.brand.source)
          ])
        ]));
      }

      // KOSTNAD (plain text, mono på kr-spann; två separata avdragsbaser)
      const cost = this.renderCost(dx);
      if (cost) block.appendChild(cost);

      // CTA-zon
      block.appendChild(this.renderCta(dx));

      // PDF-capture (lugn textlänk, aldrig en mur)
      block.appendChild(this.renderPdfCapture(dx));

      return block;
    }

    buildSummarySentence(dx) {
      const safetyPhrase = { lag: 'säker', forhojd: 'förhöjd risk', hog: 'hög risk', oklart: 'oklart läge' }[dx.safety.state];
      const readyPhrase = {
        redo_marginal: 'redo för elbil',
        redo_med_atgard: 'redo för elbil med lastbalansering',
        inte_redo: 'inte redo för elbil utan åtgärd',
        kraver_bedomning: 'redo-läget behöver bedömas',
        ej_bedomd: 'ingen planerad last'
      }[dx.ready.state];
      return 'Din central: ' + safetyPhrase + ', ' + readyPhrase + '.';
    }

    renderDualStatus(dx) {
      const data = this.data;
      const ss = data.safety_states[dx.safety.state];
      const rsState = dx.ready.state;
      const readyMeta = data.ready_states[rsState];
      const readyPill = data.scoring.ready.pill_levels[rsState] || 'neutral';

      // Accent = värsta axeln (säkerhet styr om risk; annars ready-nivå)
      const worst = (dx.safety.state === 'forhojd' || dx.safety.state === 'hog')
        ? ss.pill_level
        : (readyPill === 'warning' ? 'warning' : ss.pill_level);

      const wrap = el('div', { class: 'ampy-ec__dualstatus', data: { worst } });
      wrap.appendChild(el('div', { class: 'ampy-ec__dualstatus-accent', 'aria-hidden': 'true' }));

      const rows = el('div', { class: 'ampy-ec__dualstatus-rows' });
      // Rad 1: Säkerhet
      rows.appendChild(this.statusRow('Säkerhet', ss.label, ss.pill_level, ss.icon));
      // Rad 2: Redo
      const readyIcon = { success: 'check', warning: 'alert', info: 'info', neutral: 'info' }[readyPill] || 'info';
      rows.appendChild(this.statusRow(readyMeta.axis_label, readyMeta.label, readyPill, readyIcon));
      wrap.appendChild(rows);
      return wrap;
    }

    statusRow(axisLabel, valueLabel, pillLevel, iconName) {
      return el('div', { class: 'ampy-ec__statusrow' }, [
        el('span', { class: 'ampy-ec__statusrow-axis' }, axisLabel),
        el('span', { class: 'ampy-ec__pill', data: { level: pillLevel } }, [
          iconSpan(iconName, 'ampy-ec__pill-icon'),
          el('span', {}, valueLabel)
        ])
      ]);
    }

    renderFindings(dx) {
      const findings = collectFindings(dx, this.data);
      const list = el('ul', { class: 'ampy-ec__findings', role: 'list' });
      findings.forEach(f => {
        const iconName = f.icon === 'ok' ? 'check' : (f.icon === 'warn' ? 'alert' : 'info');
        list.appendChild(el('li', { class: 'ampy-ec__finding ampy-ec__finding--' + f.icon }, [
          iconSpan(iconName, 'ampy-ec__finding-icon'),
          el('p', { class: 'ampy-ec__finding-text' }, f.text)
        ]));
      });
      return list;
    }

    renderCost(dx) {
      const c = this.data.costs;
      const rows = [];
      const cell = dx.cell;
      const hasElbil = (this.answers.planer || []).includes('elbil');

      if (cell === 'sr') return null; // inga åtgärder

      if (cell === 'si') {
        rows.push({ label: 'Laddbox med installation', value: 'Pris i offert', note: c.gron_teknik_note });
        rows.push({ label: 'Lastbalansering', value: 'Pris i offert', note: c.gron_teknik_lastbalansering_note });
      }
      if (cell === 'rs' || cell === 'rr') {
        rows.push({ label: 'Byte till modern central (villa)', value: c.centralbyte.villa.efter_rot + ' kr', note: 'efter ROT (' + c.centralbyte.villa.fore_rot + ' kr före). ' + this.data.meta.rot_note });
        if (cell === 'rs') rows.push({ label: 'Jordfelsbrytare separat', value: c.jfb.typ_a + ' kr', note: 'installerad, typ A' });
        // Dubbel-avdrag-skydd: laddbox med EGEN bas (grön teknik), separat rad
        if (hasElbil) rows.push({ label: 'Laddbox (om du går vidare)', value: 'Pris i offert', note: c.gron_teknik_note });
      }

      const block = el('div', { class: 'ampy-ec__cost' });
      block.appendChild(el('p', { class: 'ampy-ec__cost-head' }, 'Indikativ kostnad'));
      rows.forEach(r => {
        block.appendChild(el('div', { class: 'ampy-ec__cost-row' }, [
          el('span', { class: 'ampy-ec__cost-label' }, r.label),
          el('span', { class: 'ampy-ec__cost-value' }, r.value)
        ]));
        if (r.note) block.appendChild(el('p', { class: 'ampy-ec__cost-note' }, r.note));
      });
      // Grönt avdrag som inline textlänk (cell si)
      if (cell === 'si') {
        block.appendChild(el('a', { class: 'ampy-ec__cost-link', href: this.data.meta.laddbox_calc_url }, 'Räkna det gröna avdraget'));
      }
      block.appendChild(el('p', { class: 'ampy-ec__cost-scope' }, this.data.meta.scope_note));
      return block;
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

      // Grön cell: dynamisk lugn brygga (plan-styrd, D1) — aldrig solid teal
      if (dx.cell === 'sr') {
        let linkDef = null;
        const planer = this.answers.planer || [];
        const hasPlan = planer.some(p => p !== 'inget') && planer.length;
        const highFuse = ['25', '35'].includes(this.answers.huvudsakring);
        if (hasPlan) linkDef = defs.laddbox_bridge;
        else if (highFuse) linkDef = defs.nedsakring_hook;
        if (linkDef) wrap.appendChild(el('a', { class: 'ampy-ec__cta-link', href: this.resolveCtaUrl(linkDef) }, [linkDef.label, iconSpan('arrowRight')]));
        wrap.appendChild(this.renderTrustRow(dx));
        return wrap;
      }

      // Övriga celler: exakt EN solid-teal primär
      if (cta.primary) {
        let primaryDef = defs[cta.primary];
        // Hög risk i rr → centralbyte-offert istället för besiktning
        if (dx.cell === 'rr' && dx.safety.state === 'hog') primaryDef = defs.centralbyte_offert;
        wrap.appendChild(el('a', { class: 'ampy-ec__cta-primary ampy-ec__cta-primary--solid', href: this.resolveCtaUrl(primaryDef) },
          [primaryDef.label, iconSpan('arrowRight')]));
      }
      if (cta.secondary) {
        const sec = defs[cta.secondary];
        wrap.appendChild(el('a', { class: 'ampy-ec__cta-secondary', href: this.resolveCtaUrl(sec) }, [sec.label, iconSpan('arrowRight')]));
      }
      // Akut-väg: telefon-CTA
      if (dx.safety.escalation) {
        wrap.appendChild(el('a', { class: 'ampy-ec__cta-link', href: defs.ring.url }, [iconSpan('phone'), defs.ring.label]));
      }
      wrap.appendChild(this.renderTrustRow(dx));
      return wrap;
    }

    renderTrustRow(dx) {
      const row = el('div', { class: 'ampy-ec__trust-row' });
      row.appendChild(el('p', { class: 'ampy-ec__trust' }, [
        'Ampy är registrerat hos Elsäkerhetsverket — ',
        el('a', { href: this.data.meta.verify_company_url, target: '_blank', rel: 'noopener noreferrer' }, 'verifiera oss'),
        '.'
      ]));
      row.appendChild(this.renderShareButton(dx));
      return row;
    }

    renderPdfCapture(dx) {
      const green = (dx.cell === 'sr');
      const label = green ? this.data.copy.pdf_capture_green : this.data.copy.pdf_capture;
      const wrap = el('div', { class: 'ampy-ec__pdf' });
      wrap.appendChild(el('button', {
        class: 'ampy-ec__pdf-toggle', type: 'button', 'aria-expanded': 'false',
        onclick: (e) => {
          const open = wrap.dataset.open === 'true';
          wrap.dataset.open = open ? 'false' : 'true';
          e.currentTarget.setAttribute('aria-expanded', String(!open));
          form.hidden = open;
          if (!open) { const i = form.querySelector('input[type=email]'); if (i) i.focus(); }
        }
      }, [iconSpan('mail'), label]));
      const form = el('form', { class: 'ampy-ec__pdf-form', hidden: true, onsubmit: (e) => { e.preventDefault(); status.textContent = 'Tack! Rapporten är på väg till din inkorg.'; } }, [
        el('label', { class: 'ampy-ec__pdf-flabel', for: 'ampy-ec-email' }, 'E-post'),
        el('input', { type: 'email', id: 'ampy-ec-email', class: 'ampy-ec__pdf-input', placeholder: 'din@epost.se', required: true, autocomplete: 'email' }),
        el('input', { type: 'text', name: 'webbplats', class: 'ampy-ec__hp', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true' }),
        el('label', { class: 'ampy-ec__pdf-consent' }, [
          el('input', { type: 'checkbox', required: true }),
          el('span', {}, 'Jag godkänner att Ampy mejlar min rapport. Ingen spam — bara rapporten och relevanta tips.')
        ]),
        el('button', { class: 'ampy-ec__cta-primary ampy-ec__cta-primary--outline', type: 'submit' }, 'Mejla rapporten')
      ]);
      const status = el('p', { class: 'ampy-ec__pdf-status', role: 'status', 'aria-live': 'polite' });
      wrap.appendChild(form);
      wrap.appendChild(status);
      return wrap;
    }

    /* ---- Dela (touch: native share; desktop: popover) ---- */
    renderShareButton(dx) {
      const data = this.data;
      const status = el('span', { class: 'ampy-ec__share-status', role: 'status', 'aria-live': 'polite' });
      const shareUrl = window.location.origin + window.location.pathname + '?q=' + encodeURIComponent(this.encodeVector());
      const shareTitle = 'Elcentral-kollen';
      const shareText = this.buildSummarySentence(dx);
      const anchor = el('span', { class: 'ampy-ec__share-anchor' });
      const menu = el('div', { class: 'ampy-ec__share-menu', role: 'menu', 'aria-label': 'Dela resultatet', hidden: true });
      const enc = encodeURIComponent;
      [
        { label: 'Facebook', icon: 'facebook', href: 'https://www.facebook.com/sharer/sharer.php?u=' + enc(shareUrl) },
        { label: 'X', icon: 'xtwitter', href: 'https://twitter.com/intent/tweet?url=' + enc(shareUrl) + '&text=' + enc(shareText) },
        { label: 'Reddit', icon: 'reddit', href: 'https://www.reddit.com/submit?url=' + enc(shareUrl) + '&title=' + enc(shareText) },
        { label: 'E-post', icon: 'mail', href: 'mailto:?subject=' + enc(shareTitle) + '&body=' + enc(shareText + ' ' + shareUrl) }
      ].forEach(t => menu.appendChild(el('a', { class: 'ampy-ec__share-item', role: 'menuitem', href: t.href, target: '_blank', rel: 'noopener noreferrer', onclick: () => closeMenu() },
        [iconSpan(t.icon, 'ampy-ec__share-item-icon'), el('span', {}, t.label)])));
      menu.appendChild(el('button', { class: 'ampy-ec__share-item', type: 'button', role: 'menuitem', onclick: async () => {
        try { await navigator.clipboard.writeText(shareUrl); flash('Länk kopierad.'); } catch (e) { flash('Kopiera URL:en manuellt.'); }
        closeMenu();
      } }, [iconSpan('link', 'ampy-ec__share-item-icon'), el('span', {}, 'Kopiera länk')]));

      const flash = (msg) => { status.textContent = msg; status.dataset.visible = 'true'; clearTimeout(this._flashT); this._flashT = setTimeout(() => { status.dataset.visible = 'false'; }, 2400); };
      const closeMenu = () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); document.removeEventListener('click', onDoc, true); document.removeEventListener('keydown', onKey, true); };
      const openMenu = () => { menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); document.addEventListener('click', onDoc, true); document.addEventListener('keydown', onKey, true); };
      const onDoc = (e) => { if (!anchor.contains(e.target)) closeMenu(); };
      const onKey = (e) => { if (e.key === 'Escape') { closeMenu(); btn.focus(); } };

      const btn = el('button', { class: 'ampy-ec__share', type: 'button', 'aria-label': 'Dela resultatet', 'aria-haspopup': 'menu', 'aria-expanded': 'false', title: 'Dela resultatet',
        onclick: async () => {
          const isTouch = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
          if (navigator.share && isTouch) {
            let file = null;
            try { file = await this.generateShareImage(dx, shareUrl); } catch (e) {}
            try {
              const payload = { title: shareTitle, text: shareText, url: shareUrl };
              if (file && navigator.canShare && navigator.canShare({ files: [file] })) payload.files = [file];
              await navigator.share(payload); return;
            } catch (e) {}
          }
          if (menu.hidden) openMenu(); else closeMenu();
        }
      }, iconSpan('share'));
      anchor.appendChild(btn); anchor.appendChild(menu); anchor.appendChild(status);
      return anchor;
    }

    /* ---- Delningskort (1200x630). Vit bakgrund, två små pillar, accent = värsta axeln. Aldrig röd-flödad. ---- */
    async generateShareImage(dx, urlStr) {
      const W = 1200, H = 630;
      const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext('2d');
      const pal = { success: '#1f8f6b', warning: '#8a6d10', error: '#a32330', info: '#2a4a7a', neutral: '#5a5d7a' };
      const ss = this.data.safety_states[dx.safety.state];
      const rPill = this.data.scoring.ready.pill_levels[dx.ready.state] || 'neutral';
      const worst = (dx.safety.state === 'forhojd' || dx.safety.state === 'hog') ? ss.pill_level : (rPill === 'warning' ? 'warning' : ss.pill_level);

      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = pal[worst] || pal.neutral; ctx.fillRect(0, 0, 16, H); // accent-stripe
      ctx.fillStyle = 'rgba(9,11,50,0.55)'; ctx.font = '600 24px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillText('AMPY · ELCENTRAL-KOLLEN', 72, 92);

      ctx.fillStyle = '#090b32'; ctx.font = '700 52px "Plus Jakarta Sans", system-ui, sans-serif';
      this._wrap(ctx, this.buildSummarySentence(dx), 72, 200, W - 144, 60);

      const drawPill = (x, y, label, value, lvl) => {
        ctx.fillStyle = 'rgba(9,11,50,0.55)'; ctx.font = '500 24px "Outfit", system-ui, sans-serif'; ctx.fillText(label, x, y);
        ctx.fillStyle = pal[lvl] || pal.neutral; ctx.font = '700 34px "Plus Jakarta Sans", system-ui, sans-serif'; ctx.fillText(value, x, y + 44);
      };
      drawPill(72, 420, 'Säkerhet', ss.label, ss.pill_level);
      drawPill(620, 420, this.data.ready_states[dx.ready.state].axis_label, this.data.ready_states[dx.ready.state].label, rPill);

      ctx.fillStyle = 'rgba(9,11,50,0.5)'; ctx.font = '500 22px "Outfit", system-ui, sans-serif';
      ctx.fillText(urlStr.replace(/^https?:\/\//, ''), 72, H - 56);

      const blob = await new Promise(res => canvas.toBlob(res, 'image/png', 0.92));
      if (!blob) return null;
      return new File([blob], 'elcentral-kollen.png', { type: 'image/png' });
    }
    _wrap(ctx, text, x, y, maxW, lineH) {
      const words = String(text || '').split(/\s+/); let line = '', yy = y;
      for (let i = 0; i < words.length; i++) { const test = line ? line + ' ' + words[i] : words[i];
        if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, yy); line = words[i]; yy += lineH; } else line = test; }
      if (line) ctx.fillText(line, x, yy);
    }
  }

  /* ---------- Boot ------------------------------------------------------ */
  function boot(mount) {
    if (!mount || mount.dataset.booted === 'true') return;
    const injected = (window.AmpyEC && window.AmpyEC.data) || null;
    if (injected) { new ElcentralApp(mount, injected).render(); return; }
    const dataUrl = mount.dataset.dataUrl || '../data/elcentralkollen-data.json';
    fetch(dataUrl, { credentials: 'same-origin' })
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(data => new ElcentralApp(mount, data).render())
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
