/* app.js - AI-901 Academy runtime.
   Built from assets/js/app/*.js by tools/build.mjs (plain concatenation, one closure).
   Edit the parts, not the generated file.

   Progress model (stored in this browser's localStorage):
     studied    the learner chose "Mark as studied" on a page
     practiced  an exploration was completed, or a lab's steps and teardown were ticked
     checked    a knowledge-check answer for the objective is currently correct
     applied    answered correctly in Exam Prep or the practice exam (away from the lesson)
     retained   answered correctly on two different days
     needs review  the latest answer to any question on that objective is wrong
   Page views are never counted as progress. No pass prediction is computed. */
(function () {
  'use strict';

  var STORE_KEY = 'ai901.progress.v2', LEGACY_KEY = 'ai901.progress.v1', THEME_KEY = 'ai901.theme', PASS = 80;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- state ---------------- */
  function blank() {
    return { v: 2, studied: {}, practiced: {}, steps: {}, quiz: {}, ans: {}, bm: {}, tb: {}, exam: { cur: null, hist: [] }, prep: null, review: false, last: null, updatedAt: 0 };
  }
  function obj(x) { return x && typeof x === 'object' ? x : {}; }
  function normalize(s) {
    var b = blank();
    if (!s) return b;
    if (s.v === 1) return migrateV1(s);
    if (s.v !== 2) return b;
    ['studied', 'practiced', 'steps', 'quiz', 'ans', 'bm', 'tb'].forEach(function (k) { b[k] = obj(s[k]); });
    if (s.exam && typeof s.exam === 'object') b.exam = { cur: s.exam.cur || null, hist: Array.isArray(s.exam.hist) ? s.exam.hist : [] };
    b.prep = s.prep || null; b.review = !!s.review; b.last = s.last || null; b.updatedAt = s.updatedAt || 0;
    return b;
  }
  /* v1 kept read/learned/steps/quiz/misses/exam. Module 00-01 is now ENV. */
  function migrateV1(s) {
    var b = blank(), ren = function (id) { return id === '00-01' ? 'ENV' : id; }, t = s.updatedAt || Date.now();
    Object.keys(obj(s.read)).forEach(function (id) { b.studied['m:' + ren(id)] = t; });
    Object.keys(obj(s.learned)).forEach(function (id) { b.studied['l:' + id] = t; });
    Object.keys(obj(s.steps)).forEach(function (id) { b.steps[ren(id)] = s.steps[id]; });
    Object.keys(obj(s.quiz)).forEach(function (id) {
      var q = s.quiz[id], mid = ren(id);
      b.quiz['m:' + mid] = { answers: obj(q.answers), marked: !!q.marked, last: q.last || null };
      if (q.last && Array.isArray(q.last.correct)) q.last.correct.forEach(function (ok, i) { b.ans['m:' + mid + ':' + i] = [{ t: q.last.at || t, ok: !!ok, s: 'check' }]; });
    });
    if (s.exam && typeof s.exam === 'object') b.exam = { cur: null, hist: (Array.isArray(s.exam.hist) ? s.exam.hist : []).map(function (h) {
      var w = {}; Object.keys(obj(h.wrongObjs)).forEach(function (k) { w[k.replace(/^00-01:/, 'ENV:')] = h.wrongObjs[k]; }); h.wrongObjs = w; return h; }) };
    b.review = !!s.review; b.updatedAt = t;
    return b;
  }
  function loadLocal() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) return normalize(JSON.parse(raw));
      var old = localStorage.getItem(LEGACY_KEY);
      if (old) return normalize(JSON.parse(old));
    } catch (e) { /* storage unavailable or corrupt */ }
    return blank();
  }
  var state = loadLocal();
  function save() {
    state.updatedAt = Date.now();
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage may be unavailable */ }
    scheduleSync();
  }

  /* ---------------- optional sync, only inside the claude.ai artifact viewer ---------------- */
  var syncRef = null, syncTimer = null;
  function setSync(text, st) { var el = $('#sync'); if (el) { el.textContent = text; el.dataset.state = st || ''; } }
  function scheduleSync() {
    if (!syncRef) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(function () {
      syncRef.set({ json: JSON.stringify(state), updatedAt: state.updatedAt })
        .then(function () { setSync('Synced to your account', 'synced'); })
        .catch(function () { setSync('Saved in this browser', ''); });
    }, 1200);
  }
  function initSync() {
    if (!window.claude || typeof window.claude.use !== 'function') return;
    Promise.all([window.claude.use('db'), window.claude.use('user')]).then(function (caps) {
      var db = caps[0], user = caps[1];
      if (!db || !user) return null;
      return user.id().then(function (uid) {
        if (!uid) return null;
        var ref = db.doc('data/users/' + uid + '/progress');
        return ref.get().then(function (snap) {
          syncRef = ref;
          var remote = snap.exists ? snap.data() : null;
          if (remote && remote.json && (remote.updatedAt || 0) > (state.updatedAt || 0)) {
            try { state = normalize(JSON.parse(remote.json)); localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
            render(true); setSync('Synced to your account', 'synced');
          } else if (state.updatedAt) scheduleSync();
          else setSync('Synced to your account', 'synced');
        });
      });
    }).catch(function () { /* stay local */ });
  }

  /* ---------------- content lookups ---------------- */
  function byId(id) { for (var i = 0; i < MODULES.length; i++) if (MODULES[i].id === id) return MODULES[i]; return null; }
  function lById(id) { for (var i = 0; i < LEARN.length; i++) if (LEARN[i].id === id) return LEARN[i]; return null; }
  function fById(id) { for (var i = 0; i < FOUND.length; i++) if (FOUND[i].id === id) return FOUND[i]; return null; }
  function dom(id) { for (var i = 0; i < EXAM.domains.length; i++) if (EXAM.domains[i].id === id) return EXAM.domains[i]; return null; }
  function mods(d) { return MODULES.filter(function (m) { return m.domain === d; }); }
  function stageOf(fid) { for (var i = 0; i < FOUND_STAGES.length; i++) if (FOUND_STAGES[i].lessons.indexOf(fid) !== -1) return FOUND_STAGES[i]; return null; }
  function objsOfGroup(g) { return OBJ.filter(function (o) { return o.g === g; }); }
  function objsOfMod(mid) { return OBJ.filter(function (o) { return o.mod === mid; }); }
  function learnFor(modId) { return LEARN.filter(function (L) { return L.mods.indexOf(modId) !== -1; }); }
  function foundFor(objId) { return FOUND.filter(function (f) { return f.supports.indexOf(objId) !== -1; }); }

  /* ---------------- labs ---------------- */
  function labKeys(m) {
    var k = m.lab.steps.map(function (_, i) { return 's' + i; });
    m.lab.teardown.forEach(function (b, bi) { b.items.forEach(function (_, i) { k.push('t' + bi + '-' + i); }); });
    return k;
  }
  function labTotal(m) { return labKeys(m).length; }
  function labDone(m) { var s = state.steps[m.id] || {}; return labKeys(m).filter(function (k) { return s[k]; }).length; }
  function labComplete(m) { return labDone(m) === labTotal(m); }

  /* ---------------- question bank ----------------
     Every single-answer question in one shape, so checks, Exam Prep and review
     share one engine. Keys: m:<module>:<i>, f:<lesson>:<i>. */
  var QB = [], QBK = {};
  MODULES.forEach(function (m) {
    m.quiz.forEach(function (q, i) {
      var oid = q.obj >= 0 ? objKey(m.id, q.obj) : null, o = oid ? objById(oid) : null;
      var it = { key: 'm:' + m.id + ':' + i, set: 'm:' + m.id, home: '#/m/' + m.id, homeLabel: m.id + ' ' + m.short, q: q.q, o: q.o, a: q.a, why: q.why, not: q.not || [], clue: q.clue || '', misc: q.misc || '', obj: oid, area: o ? o.area : 'foundry' };
      QB.push(it); QBK[it.key] = it;
    });
  });
  FOUND.forEach(function (f) {
    f.check.forEach(function (q, i) {
      var it = { key: 'f:' + f.id + ':' + i, set: 'f:' + f.id, home: '#/f/' + f.id, homeLabel: f.id + ' ' + f.short, q: q.q, o: q.o, a: q.a, why: q.why, not: q.not || [], clue: q.clue || '', misc: q.misc || '', obj: q.obj || null, area: q.area || f.area };
      QB.push(it); QBK[it.key] = it;
    });
  });
  function questionsOfSet(set) { return QB.filter(function (q) { return q.set === set; }); }

  /* Practice exam questions touch objectives through mod + obj, or per part (pm). */
  var XQ = {}; EXAMQ.forEach(function (q) { XQ[q.id] = q; });
  function xObjs(q) {
    var list = q.pm ? q.pm.map(function (p) { return objKey(p[0], p[1]); }) : [objKey(q.mod, q.obj)];
    return list.filter(Boolean).filter(function (v, i, a) { return a.indexOf(v) === i; });
  }

  /* ---------------- answer log and evidence ---------------- */
  function logAnswer(key, ok, src, outcomes) {
    var arr = state.ans[key] || (state.ans[key] = []);
    arr.push({ t: Date.now(), ok: !!ok, s: src, o: outcomes || undefined });
    if (arr.length > 6) arr.splice(0, arr.length - 6);
  }
  function latest(key) { var a = state.ans[key]; return a && a.length ? a[a.length - 1] : null; }
  function dayOf(t) { var d = new Date(t); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }

  /* For each objective: which questions touch it and what their latest outcome was. */
  function evidence(oid) {
    var ev = { latest: [], correctDays: {}, checkOk: false, applyOk: false, wrong: [], answered: 0 };
    function take(key, entries, outcomeFor) {
      if (!entries || !entries.length) return;
      var last = null;
      entries.forEach(function (e) {
        var ok = outcomeFor(e); if (ok === undefined) return;
        last = { ok: ok, s: e.s, t: e.t };
        if (ok) { ev.correctDays[dayOf(e.t)] = true; if (e.s === 'check') ev.checkOk = true; if (e.s === 'prep' || e.s === 'exam') ev.applyOk = true; }
      });
      if (last) { ev.answered++; ev.latest.push({ key: key, ok: last.ok, s: last.s }); if (!last.ok) ev.wrong.push(key); }
    }
    QB.forEach(function (q) { if (q.obj === oid) take(q.key, state.ans[q.key], function (e) { return e.ok; }); });
    EXAMQ.forEach(function (q) {
      if (xObjs(q).indexOf(oid) === -1) return;
      take('x:' + q.id, state.ans['x:' + q.id], function (e) { return e.o && e.o[oid] !== undefined ? e.o[oid] : undefined; });
    });
    return ev;
  }
  function exerciseApplicable(o) { return !!(o.ex && ((o.ex.labs && o.ex.labs.length) || (o.ex.explore && o.ex.explore.length))); }
  function objStatus(oid) {
    var o = objById(oid), ev = evidence(oid), st = {};
    st.studied = !!state.studied['m:' + o.mod];
    st.exApplicable = exerciseApplicable(o);
    st.practiced = st.exApplicable && ((o.ex.labs || []).some(function (id) { var m = byId(id); return m && labComplete(m); }) || (o.ex.explore || []).some(function (id) { return !!state.practiced['f:' + id]; }));
    st.needsReview = ev.wrong.length > 0;
    st.checked = ev.checkOk && !st.needsReview;
    st.applied = ev.applyOk && !st.needsReview;
    st.retained = Object.keys(ev.correctDays).length >= 2 && !st.needsReview;
    st.ev = ev;
    return st;
  }
  var STATE_LABEL = { studied: 'Studied', practiced: 'Practiced', checked: 'Knowledge checked', applied: 'Applied', retained: 'Retained', needsReview: 'Needs review' };

  /* ---------------- small utilities ---------------- */
  function pct(x) { return Math.round(x * 100); }
  function slug(s) { return 'h-' + s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function fmtDate(t) { var d = new Date(t); return d.toISOString().slice(0, 10) + ' ' + d.toTimeString().slice(0, 5); }
  function fmtDur(s) { return Math.floor(s / 60) + ' min ' + (s % 60) + ' s'; }
  function costChip(level, label) { return '<span class="cost" data-level="' + level + '">' + label + '</span>'; }
  function meter(level) { return '<span class="meter" data-level="' + level + '">' + '<span class="meter__step"></span>'.repeat(5) + '</span>'; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function objLink(oid, withText) { var o = objById(oid); return o ? '<a href="#/obj/' + oid + '" class="oref">' + oid + '</a>' + (withText ? ' ' + o.text : '') : ''; }
