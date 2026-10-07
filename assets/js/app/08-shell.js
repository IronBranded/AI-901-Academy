
  /* ================================================================
     Shell: routing, sidebar, meta column, rendering, events, palette
     ================================================================ */
  function parseHash() {
    var raw = location.hash.replace(/^#/, ''), anchor = null, i = raw.indexOf('#', 1);
    if (i !== -1) { anchor = raw.slice(i + 1); raw = raw.slice(0, i); }
    var path = raw.split('?')[0].replace(/^\//, '');
    return { parts: path.split('/'), anchor: anchor };
  }
  function route() {
    var ph = parseHash(), p = ph.parts, r;
    if (p[0] === 'f') r = fById(p[1]) ? { view: 'found', id: p[1] } : { view: 'foundindex' };
    else if (p[0] === 'm' && byId(p[1])) r = { view: 'module', id: p[1] };
    else if (p[0] === 'lab' && byId(p[1])) r = { view: 'lab', id: p[1] };
    else if (p[0] === 'learn') r = lById(p[1]) ? { view: 'learn', id: p[1] } : { view: 'learnindex' };
    else if (p[0] === 'obj') r = objById(p[1]) ? { view: 'obj', id: p[1] } : { view: 'objmap' };
    else if (p[0] === 'compare') r = CMP_BY[p[1]] ? { view: 'compare', id: p[1] } : { view: 'compareindex' };
    else if (p[0] === 'prep') r = { view: 'prep' };
    else if (p[0] === 'review' || p[0] === 'ready') r = { view: 'review' };
    else if (p[0] === 'search') r = { view: 'search' };
    else if (p[0] === 'glossary') r = { view: 'glossary' };
    else if (p[0] === 'cost') r = { view: 'cost' };
    else if (p[0] === 'exam') r = { view: p[1] === 'review' ? 'examreview' : 'exam' };
    else r = { view: 'dash' };
    r.anchor = ph.anchor;
    return r;
  }
  function go(h) { if (location.hash === h) render(); else location.hash = h; }

  /* ---------------- sidebar ---------------- */
  var closedGroups = { L: true };
  function renderSidebar(r) {
    var cur = location.hash.split('?')[0].replace(/#[^/].*$/, '') || '#/dash';
    function link(h, t, id, done, sub) { return '<a class="nav-link" href="' + h + '"' + (done ? ' data-done="true"' : '') + (cur === h ? ' aria-current="page"' : '') + '><span class="nav-link__id">' + (id || '&mdash;') + '</span><span class="nav-link__title">' + t + (sub ? '<span class="nav-sub">' + sub + '</span>' : '') + '</span></a>'; }
    var h = '<div class="nav-group">' + link('#/dash', 'Dashboard') + link('#/obj', 'Objectives') + link('#/prep', 'Exam Prep') + link('#/review', 'Review') + link('#/exam', 'Practice exam') + link('#/compare', 'Comparisons') + link('#/glossary', 'Glossary') + link('#/search', 'Search') + link('#/cost', 'Cost planner') + '</div>';
    function group(key, title, weight, done, total, tint, inner) {
      return '<details class="nav-group" data-domain="' + key + '" style="--domain-tint:' + tint + '"' + (closedGroups[key] ? '' : ' open') + '><summary class="nav-group__head"><div class="nav-group__top"><span class="nav-group__name">' + title + '</span><span class="nav-group__weight">' + weight + '</span></div>' +
        '<div class="nav-group__bar"><span class="nav-group__fill" style="width:' + pct(total ? done / total : 0) + '%"></span></div></summary><ul class="nav-list">' + inner + '</ul></details>';
    }
    var fd = FOUND.filter(function (f) { return state.studied['f:' + f.id]; }).length;
    h += group('F', 'Module 0: Before we build AI', fd + '/' + FOUND.length, fd, FOUND.length, 'var(--cost-none)', FOUND.map(function (f) { return '<li>' + link('#/f/' + f.id, f.short, f.id, state.studied['f:' + f.id]) + '</li>'; }).join(''));
    var lr = LEARN.filter(function (L) { return state.studied['l:' + L.id]; }).length;
    h += group('L', 'Concepts', lr + '/' + LEARN.length, lr, LEARN.length, 'var(--accent)', LEARN.map(function (L) { return '<li>' + link('#/learn/' + L.id, L.short, L.id, state.studied['l:' + L.id]) + '</li>'; }).join(''));
    ['01', '02', '00'].forEach(function (d) {
      var D = dom(d), list = mods(d), done = 0;
      list.forEach(function (m) { if (state.studied['m:' + m.id]) done++; if (labComplete(m)) done++; });
      h += group(d, D.name, d === '00' ? 'setup' : D.weight, done, list.length * 2, D.tint, list.map(function (m) {
        return '<li>' + link('#/m/' + m.id, m.short, m.id, state.studied['m:' + m.id]) + link('#/lab/' + m.id, m.short, m.id, labComplete(m), 'Lab ' + labDone(m) + '/' + labTotal(m)) + '</li>';
      }).join(''));
    });
    var sb = $('#sidebar');
    sb.innerHTML = h;
    $$('details.nav-group[data-domain]', sb).forEach(function (el) { el.addEventListener('toggle', function () { closedGroups[el.dataset.domain] = !el.open; }); });
  }

  /* ---------------- meta column ---------------- */
  function fieldRow(k, v) { return '<div class="field__row"><span class="field__key">' + k + '</span><span class="field__val">' + v + '</span></div>'; }
  function outlineNav() { return '<nav class="outline" aria-label="On this page"><h2 class="field__title">On this page</h2><ul class="outline__list" id="outline"></ul></nav>'; }
  function renderMeta(r) {
    var h;
    if (r.view === 'found') {
      var f = fById(r.id), k = 'f:' + f.id;
      h = '<aside class="field" aria-label="Lesson at a glance"><h2 class="field__title">Lesson at a glance</h2>' +
        fieldRow('Stage', stageOf(f.id).title) + fieldRow('Scope', f.scope === 'foundation' ? 'Foundation' : f.supports.join(', ')) +
        fieldRow('Area', areaById(f.area).name) + fieldRow('Exploration', f.explore ? (state.practiced[k] ? 'Complete' : 'Not yet') : 'None') +
        fieldRow('Check', checkPct(k) === null ? 'Not taken' : checkPct(k) + '%') +
        '<p class="field__note">Written for the Academy from Microsoft Learn\'s AI-901 learning paths. Microsoft technology claims were checked against Microsoft Learn on ' + EXAM.lastChecked + '.</p></aside>' + outlineNav();
    } else if (r.view === 'learn') {
      var L = lById(r.id);
      h = '<aside class="field" aria-label="Concept page at a glance"><h2 class="field__title">Concept page at a glance</h2>' +
        fieldRow('Microsoft Learn', L.ms.map(function (x) { return '<a href="' + x.u + '" target="_blank" rel="noopener">' + x.t + '</a>'; }).join('<br>')) +
        fieldRow('Feeds', L.mods.map(function (id) { return '<a href="#/m/' + id + '">' + id + '</a>'; }).join(', ')) + fieldRow('Units', L.units.length) + fieldRow('Key terms', termCount(L)) +
        '<p class="field__note">Explanations written for the Academy, following the same syllabus as the Microsoft Learn modules above.</p></aside>' + outlineNav();
    } else if (r.view === 'module' || r.view === 'lab') {
      var m = byId(r.id), D = dom(m.domain);
      h = '<aside class="field" aria-label="Module at a glance"><h2 class="field__title">' + (r.view === 'lab' ? 'Lab' : 'Module') + ' at a glance</h2>' +
        fieldRow('Domain', D.name + (m.domain === '00' ? '' : ', ' + D.weight)) + fieldRow('Status', '<span class="status" data-status="' + m.status + '">' + m.status + '</span>') +
        fieldRow('Cost', costChip(m.cost.level, m.cost.label) + meter(m.cost.level)) + fieldRow('Portal', m.portal) + fieldRow('SDK', m.sdk) +
        fieldRow('KQL tables', m.kql + ' <small>(beyond the exam)</small>') +
        fieldRow('Prerequisites', m.prereq.length ? m.prereq.map(function (id) { return '<a href="#/m/' + id + '">' + id + '</a>'; }).join(', ') : 'None') +
        fieldRow('Lab verified', m.verified ? m.verified : '<span class="status" data-status="Preview">Not yet</span>') +
        '<p class="field__note">' + m.cost.est + '</p>' +
        (m.verified ? '<p class="field__note">Lab flow checked against Microsoft\'s own exercise on ' + m.verified + '.</p>' : '<p class="field__note">Written from product documentation and not yet run against a Microsoft exercise. Check commands and model names before relying on them.</p>') +
        '<div class="field__links">' + (r.view === 'lab' ? '<a href="#/m/' + m.id + '">Back to the module</a>' : '<a href="#/lab/' + m.id + '">Go to the lab</a>') + '</div></aside>' + outlineNav();
    } else {
      h = '<aside class="field" aria-label="Exam at a glance"><h2 class="field__title">Exam at a glance</h2>' +
        fieldRow('Exam', EXAM.code) + fieldRow('Passing', EXAM.passing + ', scaled') + fieldRow('Outline', EXAM.outline) +
        fieldRow('Concepts', '40-45%') + fieldRow('Foundry', '55-60%') +
        fieldRow('Code', 'Python; REST, SDKs, CLIs') + fieldRow('Features', 'Mostly GA') +
        '<p class="field__note">The outline has no machine learning domain, unlike AI-900. The study guide\'s list of documentation links still includes older AI-900-era services (for example Language Understanding, Anomaly Detector and Azure Bot Service); the skills measured are what count.</p>' +
        '<div class="field__links"><a href="' + EXAM.studyGuide + '" target="_blank" rel="noopener">Official study guide</a> &middot; <a href="https://microsoftlearning.github.io/mslearn-ai-fundamentals/" target="_blank" rel="noopener">Foundry labs</a> &middot; <a href="https://microsoftlearning.github.io/mslearn-ai-concepts/" target="_blank" rel="noopener">Concept labs</a></div></aside>' +
        '<aside class="field" aria-label="Progress storage"><h2 class="field__title">Your progress</h2><p class="field__note">Stored only in this browser (local storage), separately for each site address. Clearing site data clears it.</p>' +
        '<div class="field__links"><button class="btn" data-act="export" type="button">Export progress</button> <button class="btn" data-act="wipe" data-variant="danger" type="button">Reset all progress</button></div></aside>';
    }
    $('#meta').innerHTML = h;
  }
  function buildOutline() {
    var ol = $('#outline'); if (!ol) return;
    ol.innerHTML = $$('#content h2').filter(function (h2) { return !h2.closest('.cmp'); }).map(function (h2) {
      if (!h2.id) h2.id = slug(h2.textContent);
      return '<li data-depth="2"><a class="outline__link" href="#" data-target="' + h2.id + '">' + h2.textContent + '</a></li>';
    }).join('');
  }

  /* ---------------- chrome ---------------- */
  function addCopyButtons() {
    $$('#content pre').forEach(function (pre) {
      if ($('.copy-btn', pre) || pre.classList.contains('xq__code') || pre.closest('.ex__frame') || !$('code', pre)) return;
      var b = document.createElement('button');
      b.className = 'copy-btn'; b.type = 'button'; b.textContent = 'Copy';
      b.addEventListener('click', function () {
        var text = $('code', pre).textContent;
        var done = function () { b.dataset.state = 'copied'; b.textContent = 'Copied'; setTimeout(function () { b.dataset.state = ''; b.textContent = 'Copy'; }, 1500); };
        try { navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); }); } catch (e) { fallbackCopy(text); done(); }
      });
      pre.appendChild(b);
    });
  }
  /* Wide tables and figures scroll sideways on small screens. A scrollable region
     must be reachable by keyboard, so it gets focus, a role and a name. */
  function markScrollables() {
    $$('#content .table-scroll, #content figure, #content .v, #content .ex__frame pre').forEach(function (el) {
      var scrolls = el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1;
      if (scrolls && !el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '0');
        if (!el.getAttribute('role') && el.tagName !== 'FIGURE') el.setAttribute('role', 'region');
        if (!el.getAttribute('aria-label')) {
          var cap = el.querySelector('figcaption, caption, .cmp__t') || (el.closest('figure') && el.closest('figure').querySelector('figcaption'));
          el.setAttribute('aria-label', (cap ? cap.textContent.slice(0, 80) : 'Scrollable content') + ' (scrollable)');
        }
      } else if (!scrolls && el.dataset.scrollMarked) { el.removeAttribute('tabindex'); }
      if (scrolls) el.dataset.scrollMarked = 'true';
    });
  }
  var resizeTimer = null;
  window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(markScrollables, 200); });
  function fallbackCopy(text) {
    var t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
    document.body.appendChild(t); t.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(t);
  }
  var TOPBAR = { dash: ['dash'], found: ['f'], foundindex: ['f'], learn: ['learn'], learnindex: ['learn'], glossary: ['learn'], objmap: ['obj'], obj: ['obj'], prep: ['prep'], review: ['prep'], exam: ['exam'], examreview: ['exam'] };
  function setTopbar(r) { $$('.viewbtn[data-go]').forEach(function (b) { b.setAttribute('aria-pressed', String((TOPBAR[r.view] || []).indexOf(b.dataset.go) !== -1)); }); }

  /* ---------------- render ---------------- */
  var lastRouteKey = '', pendingFig = null;
  function pageTitle(r) {
    var t = { dash: 'Dashboard', foundindex: 'Module 0', learnindex: 'Concepts', glossary: 'Glossary', objmap: 'Objectives', compareindex: 'Comparisons', prep: 'Exam Prep', review: 'Review', search: 'Search', cost: 'Cost planner', exam: 'Practice exam', examreview: 'Practice exam results' }[r.view];
    if (r.view === 'found') t = r.id + ' ' + fById(r.id).title;
    if (r.view === 'learn') t = r.id + ' ' + lById(r.id).title;
    if (r.view === 'module') t = r.id + ' ' + byId(r.id).title;
    if (r.view === 'lab') t = 'Lab ' + r.id + ' ' + byId(r.id).short;
    if (r.view === 'obj') t = 'Objective ' + r.id;
    if (r.view === 'compare') t = CMP_BY[r.id].title;
    return t;
  }
  function render(keepScroll) {
    var r = route(), key = r.view + ':' + (r.id || ''), y = window.scrollY;
    document.body.dataset.review = String(state.review && r.view === 'module');
    $('#content').dataset.flash = 'false';
    renderSidebar(r);
    switch (r.view) {
      case 'found': renderFound(fById(r.id)); break;
      case 'foundindex': renderFoundIndex(); break;
      case 'module': renderModule(byId(r.id)); break;
      case 'lab': renderLab(byId(r.id)); break;
      case 'learn': renderLearn(lById(r.id)); break;
      case 'learnindex': renderLearnIndex(); break;
      case 'glossary': renderGlossary(); break;
      case 'objmap': renderObjMap(); break;
      case 'obj': renderObj(objById(r.id)); break;
      case 'compareindex': renderCompareIndex(); break;
      case 'compare': renderCompare(CMP_BY[r.id]); break;
      case 'prep': renderPrep(); break;
      case 'review': renderReview(); break;
      case 'search': renderSearch(); break;
      case 'cost': renderCost(); break;
      case 'exam': if (state.exam.cur) renderExamSession(); else renderExamStart(); break;
      case 'examreview': renderExamReview(); break;
      default: renderDash();
    }
    renderMeta(r);
    var c = $('#content');
    if (window.Explore) Explore.mount(c, function (lessonKey) { if (lessonKey && !state.practiced[lessonKey]) { state.practiced[lessonKey] = Date.now(); save(); renderSidebar(route()); } });
    window.AI901Highlight.mount(c);
    addCopyButtons();
    markScrollables();
    buildOutline();
    setTopbar(r);
    var title = pageTitle(r);
    document.title = title + ' - AI-901 Academy';
    if (['found', 'learn', 'module', 'lab', 'obj', 'compare'].indexOf(r.view) !== -1) { state.last = { href: location.hash.split('#').slice(0, 2).join('#'), label: title }; try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {} }
    if (keepScroll === true && key === lastRouteKey) window.scrollTo(0, y);
    else window.scrollTo(0, 0);
    if (key !== lastRouteKey && keepScroll !== true) { var h1 = $('#content h1'); if (h1) { h1.setAttribute('tabindex', '-1'); if (lastRouteKey) h1.focus({ preventScroll: true }); } }
    lastRouteKey = key;
    var target = pendingFig || r.anchor;
    if (target) { pendingFig = null; var pf = document.getElementById(target); if (pf) pf.scrollIntoView({ block: 'start' }); }
    closeNav();
    startTimer();
  }

  /* ---------------- events ---------------- */
  var armed = null;
  function arm(btn, fn, text) {
    if (armed === btn) { armed = null; fn(); return; }
    if (armed) { armed.removeAttribute('data-confirm'); armed.textContent = armed.dataset.label; }
    armed = btn; btn.dataset.label = btn.textContent; btn.dataset.confirm = 'armed'; btn.textContent = text || 'Select again to confirm';
    setTimeout(function () { if (armed === btn) { armed = null; btn.removeAttribute('data-confirm'); btn.textContent = btn.dataset.label; } }, 4000);
  }
  function exportProgress() {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'ai901-academy-progress.json'; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  document.addEventListener('click', function (e) {
    var tm = e.target.closest('#content[data-flash="true"] .term');
    if (tm) { tm.dataset.shown = String(tm.dataset.shown !== 'true'); return; }
    var tl = e.target.closest('a[data-term]');
    if (tl) { pendingFig = tl.dataset.term; return; }
    var t = e.target.closest('[data-act], [data-go], .outline__link, #palbtn, #theme-toggle, #nav-toggle, .pal__item');
    if (!t) return;
    var r = route(), m = r.view === 'module' || r.view === 'lab' ? byId(r.id) : null;
    if (t.matches('.outline__link')) { e.preventDefault(); var el = document.getElementById(t.dataset.target); if (el) { el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); } return; }
    if (t.id === 'palbtn') { openPal(); return; }
    if (t.id === 'theme-toggle') { cycleTheme(); return; }
    if (t.id === 'nav-toggle') { var sb = $('#sidebar'), open = sb.dataset.open !== 'true'; sb.dataset.open = String(open); t.setAttribute('aria-expanded', String(open)); return; }
    if (t.matches('.pal__item')) { runPal(+t.dataset.i); return; }
    if (t.dataset.go) { go('#/' + t.dataset.go); return; }
    var act = t.dataset.act;
    if (act === 'study') { var k = t.dataset.key; if (state.studied[k]) delete state.studied[k]; else state.studied[k] = Date.now(); save(); render(true); }
    else if (act === 'bm') { var bk = t.dataset.key; if (state.bm[bk]) delete state.bm[bk]; else state.bm[bk] = { label: t.dataset.label, href: t.dataset.href, t: Date.now() }; save(); var on = !!state.bm[bk]; t.setAttribute('aria-pressed', String(on)); t.innerHTML = on ? '&#9733; In Review later' : '&#9734; Review later'; }
    else if (act === 'unbm') { e.preventDefault(); delete state.bm[t.dataset.key]; save(); render(true); }
    else if (act === 'review') { state.review = !state.review; save(); render(true); }
    else if (act === 'reset' && m) { arm(t, function () { if (r.view === 'lab') delete state.steps[m.id]; else { delete state.studied['m:' + m.id]; delete state.quiz['m:' + m.id]; } save(); render(true); }); }
    else if (act === 'wipe') { arm(t, function () { state = blank(); save(); render(true); }); }
    else if (act === 'export') exportProgress();
    else if (act === 'check') { if (markCheck(t.dataset.set)) { render(true); var qz = $('#quiz'); if (qz) qz.scrollIntoView({ block: 'start' }); } }
    else if (act === 'retry') { var q2 = state.quiz[t.dataset.set]; q2.marked = false; q2.answers = {}; save(); render(true); var qz2 = $('#quiz'); if (qz2) qz2.scrollIntoView({ block: 'start' }); }
    else if (act === 'tbreveal') { var tbk = t.dataset.key, tb = state.tb[tbk] || (state.tb[tbk] = {}); tb.revealed = true; save(); }
    else if (act === 'lflip') { var onf = t.getAttribute('aria-pressed') !== 'true'; t.setAttribute('aria-pressed', String(onf)); t.textContent = onf ? 'Show definitions' : 'Quiz me on the terms'; $('#content').dataset.flash = String(onf); }
    else if (act === 'pstart') startPrep();
    else if (act === 'panswer') { var sel = $('input[name="pq"]:checked'); if (!sel) { $('.pq__msg').textContent = 'Choose an answer first.'; return; } var P = state.prep, pk = P.ids[P.idx], pq = QBK[pk]; P.ans[pk] = +sel.value; logAnswer(pk, +sel.value === pq.a, 'prep'); save(); render(true); }
    else if (act === 'pnext') { state.prep.idx++; save(); render(false); }
    else if (act === 'pquit') { arm(t, function () { state.prep.ids = state.prep.ids.slice(0, state.prep.idx + (state.prep.ans[state.prep.ids[state.prep.idx]] !== undefined ? 1 : 0)); state.prep.idx = state.prep.ids.length; save(); render(false); }, 'Select again to end'); }
    else if (act === 'pretry') { var Pp = state.prep, miss = Pp.ids.filter(function (k2) { return Pp.ans[k2] !== QBK[k2].a; }); state.prep = { ids: shuffle(miss), idx: 0, ans: {}, label: 'Retry of missed questions', started: Date.now() }; save(); render(false); }
    else if (act === 'pnew') { state.prep = null; save(); go('#/prep'); }
    else if (act === 'xstart') startExam(t.dataset.mode);
    else if (act === 'xprev' || act === 'xnext' || act === 'xjump') { var cx = state.exam.cur; if (!cx) return; cx.idx = act === 'xjump' ? +t.dataset.i : Math.max(0, Math.min(cx.ids.length - 1, cx.idx + (act === 'xnext' ? 1 : -1))); save(); render(false); }
    else if (act === 'xflag') { var cf = state.exam.cur; if (!cf) return; var fid = cf.ids[cf.idx]; if (cf.flags[fid]) delete cf.flags[fid]; else cf.flags[fid] = true; save(); render(true); }
    else if (act === 'xmove') { var cm = state.exam.cur; if (!cm) return; var mid = cm.ids[cm.idx], perm = cm.answers[mid], i0 = +t.dataset.i, i1 = i0 + (+t.dataset.d); if (i1 < 0 || i1 >= perm.length) return; var tmp = perm[i0]; perm[i0] = perm[i1]; perm[i1] = tmp; save(); render(true); var mv = $('[data-act="xmove"][data-i="' + i1 + '"][data-d="' + t.dataset.d + '"]') || $('[data-act="xmove"][data-i="' + i1 + '"]'); if (mv) mv.focus(); }
    else if (act === 'xsubmit') { var cs = state.exam.cur; if (!cs) return; var left = cs.ids.filter(function (x) { return !isAnswered(XQ[x], cs.answers[x]); }).length; arm(t, submitExam, left ? left + ' unanswered: select again to submit' : 'Select again to submit'); }
    else if (act === 'xabandon') { arm(t, function () { state.exam.cur = null; save(); render(false); }, 'Select again to abandon'); }
  });

  var tbTimer = null;
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.id === 'glq') { filterGlossary(); return; }
    if (t.id === 'sq') { drawSearch(); return; }
    if (t.dataset && t.dataset.tb) { clearTimeout(tbTimer); var key = t.dataset.tb, v = t.value; tbTimer = setTimeout(function () { var tb = state.tb[key] || (state.tb[key] = {}); tb.text = v; tb.t = Date.now(); save(); }, 500); }
  });
  document.addEventListener('change', function (e) {
    var t = e.target, r = route();
    if (t.id === 'xonlywrong') { var xr = $('#xr'); if (xr) xr.dataset.onlyWrong = String(t.checked); return; }
    if (t.id === 'glflash') { $$('#gl .gl__t').forEach(function (d) { d.open = !t.checked; }); return; }
    if (t.closest && t.closest('#srch')) { drawSearch(); return; }
    if (t.dataset && t.dataset.tbtick) { var tb = state.tb[t.dataset.tbtick] || (state.tb[t.dataset.tbtick] = {}); tb.ticks = tb.ticks || {}; tb.ticks[t.value] = t.checked; save(); return; }
    if (t.dataset && t.dataset.set && t.dataset.qi !== undefined) { var qs = state.quiz[t.dataset.set] || (state.quiz[t.dataset.set] = {}); qs.answers = qs.answers || {}; qs.answers[+t.dataset.qi] = +t.value; save(); return; }
    if (t.dataset && t.dataset.x && state.exam.cur) {
      var c = state.exam.cur, q = XQ[c.ids[c.idx]], a = c.answers[q.id];
      if (t.dataset.x === 'single') c.answers[q.id] = +t.value;
      else if (t.dataset.x === 'multi') { a = (a || []).filter(function (v) { return v !== +t.value; }); if (t.checked) a.push(+t.value); c.answers[q.id] = a; }
      else if (t.dataset.x === 'yesno') a[+t.dataset.i] = t.value === '1';
      else if (t.dataset.x === 'code') a[+t.dataset.i] = t.value === '' ? null : +t.value;
      save(); refreshExamStrip(); return;
    }
    var m = r.view === 'lab' ? byId(r.id) : null;
    if (m && t.matches('input[type="checkbox"][data-step]')) {
      var s = state.steps[m.id] || (state.steps[m.id] = {});
      if (t.checked) s[t.dataset.step] = true; else delete s[t.dataset.step];
      var li = t.closest('li'); if (li) li.dataset.done = String(t.checked);
      save();
      var st = $('#stripText'), sbar = $('#stripBar');
      if (st) st.textContent = labDone(m) + ' of ' + labTotal(m) + ' steps';
      if (sbar) sbar.style.width = pct(labDone(m) / labTotal(m)) + '%';
      renderSidebar(r);
    }
  });
  window.addEventListener('hashchange', function () { render(false); });
  function closeNav() { var sb = $('#sidebar'); if (sb) sb.dataset.open = 'false'; var nt = $('#nav-toggle'); if (nt) nt.setAttribute('aria-expanded', 'false'); }

  /* ---------------- theme ---------------- */
  var THEMES = ['system', 'dark', 'light'], GLYPH = { system: '◑ System', dark: '◐ Dark', light: '○ Light' };
  function applyTheme(t) { document.documentElement.setAttribute('data-theme', t); var b = $('#theme-toggle'); if (b) { b.textContent = GLYPH[t]; b.setAttribute('aria-label', 'Colour theme: ' + t + '. Select to change.'); } }
  function cycleTheme() {
    var cur = document.documentElement.getAttribute('data-theme') || 'system', next = THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length];
    applyTheme(next); try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  }

  /* ---------------- command palette (Ctrl/Cmd+K) ---------------- */
  var palItems = [], palShown = [], palActive = 0, palReturn = null;
  function buildPalItems() {
    var items = [
      { kind: 'Go', label: 'Dashboard', sub: 'What to study next', run: function () { go('#/dash'); } },
      { kind: 'Go', label: 'Module 0: Before we build AI', sub: FOUND.length + ' foundation lessons', run: function () { go('#/f'); } },
      { kind: 'Go', label: 'Objectives', sub: 'All 29, with your evidence', run: function () { go('#/obj'); } },
      { kind: 'Go', label: 'Exam Prep', sub: 'Practise by objective, area or what needs review', run: function () { go('#/prep'); } },
      { kind: 'Go', label: 'Review', sub: 'Needs review and Review later', run: function () { go('#/review'); } },
      { kind: 'Go', label: 'Practice exam', sub: EXAMQ.length + ' questions in exam formats', run: function () { go('#/exam'); } },
      { kind: 'Go', label: 'Comparisons', sub: COMPARE.length + ' side-by-side tables', run: function () { go('#/compare'); } },
      { kind: 'Go', label: 'Full search page', sub: 'Filter by input, output and area', run: function () { go('#/search'); } },
      { kind: 'Action', label: 'Cycle theme', sub: 'System, dark, light', run: cycleTheme }
    ];
    searchIndex().forEach(function (it) { items.push({ kind: it.kind, label: it.title, sub: it.inp ? 'In: ' + it.inp + ' | Out: ' + it.out : (it.sub || ''), run: function () { if (it.anchor) pendingFig = it.anchor; go(it.href.split('#').slice(0, 2).join('#')); } }); });
    $$('#content h2').forEach(function (h2) { items.push({ kind: 'On this page', label: h2.textContent, sub: 'Current page', run: function () { h2.scrollIntoView({ block: 'start' }); } }); });
    return items;
  }
  function filterPal() {
    var q = $('#palinput').value.trim();
    if (!q) palShown = palItems.filter(function (it) { return it.kind === 'Go'; });
    else { var hits = runSearch(q, {}), seen = {}; palShown = []; palItems.forEach(function (it) { if (it.kind === 'Go' || it.kind === 'Action' || it.kind === 'On this page') { var hay = (it.label + ' ' + it.sub).toLowerCase(); if (q.toLowerCase().split(/\s+/).every(function (t) { return hay.indexOf(t) !== -1; })) palShown.push(it); } });
      hits.forEach(function (h) { var it = palItems.filter(function (p) { return p.label === h.title && p.kind === h.kind; })[0]; if (it && !seen[h.kind + h.title]) { seen[h.kind + h.title] = true; palShown.push(it); } }); }
    palShown = palShown.slice(0, 16); palActive = 0; drawPal();
  }
  function drawPal() {
    var list = $('#pallist'), inp = $('#palinput');
    if (!palShown.length) { list.innerHTML = '<li class="pal__empty" role="presentation">No matches.</li>'; inp.removeAttribute('aria-activedescendant'); return; }
    list.innerHTML = palShown.map(function (it, i) {
      return '<li class="pal__item" role="option" id="pal-o-' + i + '" data-i="' + i + '" aria-selected="' + (i === palActive) + '"' + (i === palActive ? ' data-active="true"' : '') + '><span class="pal__kind">' + it.kind + '</span><span class="pal__body"><span class="pal__label">' + escH(it.label) + '</span><span class="pal__sub">' + escH(it.sub) + '</span></span></li>';
    }).join('');
    inp.setAttribute('aria-activedescendant', 'pal-o-' + palActive);
    var a = $('.pal__item[data-active="true"]', list); if (a) a.scrollIntoView({ block: 'nearest' });
  }
  function openPal() {
    palReturn = document.activeElement; palItems = buildPalItems();
    var p = $('#pal'); p.hidden = false; $('#palbtn').setAttribute('aria-expanded', 'true');
    var inp = $('#palinput'); inp.value = ''; filterPal(); inp.focus();
  }
  function closePal() { $('#pal').hidden = true; $('#palbtn').setAttribute('aria-expanded', 'false'); if (palReturn && palReturn.focus) palReturn.focus(); }
  function runPal(i) { var it = palShown[i]; $('#pal').hidden = true; $('#palbtn').setAttribute('aria-expanded', 'false'); if (it) it.run(); }
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if ($('#pal').hidden) openPal(); else closePal(); return; }
    if (e.key === '/' && $('#pal').hidden && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); openPal(); return; }
    if ($('#pal').hidden) { if (e.key === 'Escape') closeNav(); return; }
    if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); closePal(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); palActive = Math.min(palActive + 1, palShown.length - 1); drawPal(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); palActive = Math.max(palActive - 1, 0); drawPal(); }
    else if (e.key === 'Enter') { e.preventDefault(); runPal(palActive); }
    else if (e.key === 'Tab') { e.preventDefault(); $('#palinput').focus(); }
  }, true);

  /* ---------------- boot ---------------- */
  function boot() {
    var t = 'system'; try { t = localStorage.getItem(THEME_KEY) || 'system'; } catch (e) {}
    applyTheme(THEMES.indexOf(t) === -1 ? 'system' : t);
    $('#palinput').addEventListener('input', filterPal);
    $('#pal').addEventListener('click', function (e) { if (e.target.id === 'pal') closePal(); });
    try { if (!localStorage.getItem(STORE_KEY) && localStorage.getItem(LEGACY_KEY)) save(); } catch (e) {}
    render(false);
    initSync();
  }
  window.Academy = { state: function () { return state; }, objStatus: objStatus, QB: QB, coverage: coverage, PATH: PATH };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
