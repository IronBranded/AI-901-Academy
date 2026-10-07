
  /* ================================================================
     Exam Prep mode
     ================================================================ */
  var PREP_MODES = [
    ['mixed', 'Mixed: questions from every objective'],
    ['group', 'One objective area'],
    ['obj', 'One objective'],
    ['area', 'One concept area (for example, vision)'],
    ['review', 'Needs review: questions you currently have wrong'],
    ['unanswered', 'Questions you have not answered yet'],
    ['wrong', 'Questions you have ever got wrong'],
    ['bm', 'Questions saved for Review later']
  ];
  function params() { var q = (location.hash.split('?')[1] || ''), o = {}; q.split('&').forEach(function (kv) { if (!kv) return; var p = kv.split('='); o[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ''); }); return o; }
  function prepPool(mode, val) {
    return QB.filter(function (q) {
      var l = latest(q.key);
      if (mode === 'group') return q.obj && objById(q.obj).g === val;
      if (mode === 'obj') return q.obj === val;
      if (mode === 'area') return q.area === val;
      if (mode === 'review') return l && !l.ok;
      if (mode === 'unanswered') return !l;
      if (mode === 'wrong') return (state.ans[q.key] || []).some(function (e) { return !e.ok; });
      if (mode === 'bm') return !!state.bm['q:' + q.key];
      return true;
    });
  }
  function renderPrep() {
    if (state.prep && state.prep.ids && state.prep.idx < state.prep.ids.length && !params().new) return renderPrepSession();
    if (state.prep && state.prep.ids && state.prep.idx >= state.prep.ids.length && !params().new) return renderPrepResult();
    var pr = params(), mode = pr.mode || (pr.obj ? 'obj' : pr.area ? 'area' : pr.group ? 'group' : 'mixed');
    var h = crumbs([['AI-901', '#/dash'], ['Exam Prep', '']]) + '<h1>Exam Prep</h1><p class="lede">Choose what to practise. Each question shows the full explanation as soon as you answer, and links back to the lesson and comparison that teach it.</p>' +
      Q('note', 'Exam Prep draws on the ' + QB.length + ' knowledge-check questions. The ' + EXAMQ.length + '-question <a href="#/exam">practice exam</a> is kept separate so it stays unseen. Answers here count as <em>Applied</em> on the Objectives page.') +
      '<form class="prep" id="prepform" onsubmit="return false"><fieldset><legend>What do you want to practise?</legend>' +
      PREP_MODES.map(function (m) {
        var n = m[0] === 'group' || m[0] === 'obj' || m[0] === 'area' ? '' : ' <span class="prep__n">(' + prepPool(m[0]).length + ')</span>';
        return '<label class="prep__m"><input type="radio" name="pmode" value="' + m[0] + '"' + (m[0] === mode ? ' checked' : '') + '> ' + m[1] + n + '</label>';
      }).join('') + '</fieldset>' +
      '<div class="prep__sel"><label>Objective area <select name="pgroup">' + GROUPS.map(function (g) { return '<option value="' + g.id + '"' + (pr.group === g.id ? ' selected' : '') + '>' + g.id + ' ' + g.title + ' (' + prepPool('group', g.id).length + ')</option>'; }).join('') + '</select></label>' +
      '<label>Objective <select name="pobj">' + OBJ.map(function (o) { return '<option value="' + o.id + '"' + (pr.obj === o.id ? ' selected' : '') + '>' + o.id + ' ' + o.text.slice(0, 70) + (o.text.length > 70 ? '&hellip;' : '') + ' (' + prepPool('obj', o.id).length + ')</option>'; }).join('') + '</select></label>' +
      '<label>Concept area <select name="parea">' + AREAS.map(function (a) { return '<option value="' + a.id + '"' + (pr.area === a.id ? ' selected' : '') + '>' + a.name + ' (' + prepPool('area', a.id).length + ')</option>'; }).join('') + '</select></label>' +
      '<label>How many <select name="psize"><option value="10">10</option><option value="20">20</option><option value="999">All matching</option></select></label></div>' +
      '<p class="prep__go"><button class="btn btn--primary" type="button" data-act="pstart">Start</button> <span class="field__note prep__msg" aria-live="polite"></span></p></form>';
    var stats = areaStats().filter(function (s) { return s.answered; });
    if (stats.length) h += '<h2>Where you stand by concept area</h2><div class="table-scroll"><table class="areas"><thead><tr><th scope="col">Concept area</th><th scope="col">Latest answers right</th><th scope="col">Practise</th></tr></thead><tbody>' +
      stats.map(function (s) { return '<tr' + (s.wrong ? ' data-warn="true"' : '') + '><th scope="row">' + s.a.name + '</th><td>' + s.right + ' / ' + s.answered + '</td><td><a href="#/prep?area=' + s.a.id + '">Practise ' + s.a.name.toLowerCase() + '</a></td></tr>'; }).join('') + '</tbody></table></div>';
    $('#content').innerHTML = h;
  }
  function startPrep() {
    var f = $('#prepform'), mode = (f.querySelector('input[name="pmode"]:checked') || {}).value || 'mixed';
    var val = mode === 'group' ? f.pgroup.value : mode === 'obj' ? f.pobj.value : mode === 'area' ? f.parea.value : null;
    var pool = shuffle(prepPool(mode, val)).slice(0, +f.psize.value);
    if (!pool.length) { $('.prep__msg').textContent = 'No questions match that choice yet.'; return; }
    var label = PREP_MODES.filter(function (m) { return m[0] === mode; })[0][1] + (val ? ': ' + (mode === 'group' ? val + ' ' + GROUPS_BY[val].title : mode === 'obj' ? val : areaById(val).name) : '');
    state.prep = { ids: pool.map(function (q) { return q.key; }), idx: 0, ans: {}, label: label, started: Date.now() };
    save(); go('#/prep');
  }
  function renderPrepSession() {
    var P = state.prep, key = P.ids[P.idx], q = QBK[key], chosen = P.ans[key], answered = chosen !== undefined, letters = 'ABCDEFG';
    if (!q) { P.idx++; save(); return renderPrep(); }
    var h = crumbs([['AI-901', '#/dash'], ['Exam Prep', '#/prep'], [P.label, '']]) + '<h1>Exam Prep</h1>' +
      '<div class="progress-strip"><span>Question ' + (P.idx + 1) + ' of ' + P.ids.length + ' &middot; ' + P.label + '</span><div class="bar"><span class="bar__fill" style="width:' + pct(P.idx / P.ids.length) + '%"></span></div>' +
      '<button class="btn" data-variant="danger" data-act="pquit" type="button">End this set</button></div>' +
      '<article class="xq pq"><p class="xq__meta">' + areaById(q.area).name + (q.obj ? ' &middot; Objective ' + q.obj : ' &middot; Foundation') + '</p><fieldset class="quiz__q"' + (answered ? ' data-marked="true"' : '') + '><legend>' + q.q + '</legend>' +
      q.o.map(function (o, i) {
        var mark = answered ? (i === q.a ? ' data-mark="right"' : (i === chosen ? ' data-mark="wrong"' : '')) : '';
        return '<label class="quiz__opt"' + mark + '><input type="radio" name="pq" value="' + i + '"' + (chosen === i ? ' checked' : '') + (answered ? ' disabled' : '') + '><span><b class="quiz__l">' + letters[i] + '.</b> ' + o + '</span></label>';
      }).join('') + '</fieldset>' + (answered ? feedback(q, chosen) + '<p class="fb__learn">Learn it: <a href="' + q.home + '">' + q.homeLabel + '</a>' + (q.obj ? ' &middot; ' + objById(q.obj).cmp.slice(0, 2).map(function (c) { return '<a href="#/compare/' + c + '">' + CMP_BY[c].title + '</a>'; }).join(' &middot; ') : '') + '</p>' : '') + '</article>' +
      '<div class="xq__nav">' + (answered ? '<button class="btn btn--primary" type="button" data-act="pnext">' + (P.idx + 1 < P.ids.length ? 'Next question' : 'See results') + '</button>' : '<button class="btn btn--primary" type="button" data-act="panswer">Check answer</button><span class="field__note pq__msg" aria-live="polite"></span>') + '</div>';
    $('#content').innerHTML = h;
  }
  function renderPrepResult() {
    var P = state.prep, keys = P.ids, right = keys.filter(function (k) { return P.ans[k] === QBK[k].a; }), wrong = keys.filter(function (k) { return P.ans[k] !== QBK[k].a; });
    var byArea = {};
    keys.forEach(function (k) { var a = QBK[k].area; byArea[a] = byArea[a] || [0, 0]; byArea[a][1]++; if (P.ans[k] === QBK[k].a) byArea[a][0]++; });
    var h = crumbs([['AI-901', '#/dash'], ['Exam Prep', '#/prep'], ['Results', '']]) + '<h1>Exam Prep results</h1><p class="lede">' + right.length + ' of ' + keys.length + ' right first time in "' + P.label + '".</p>' +
      '<div class="table-scroll"><table class="areas"><thead><tr><th scope="col">Concept area</th><th scope="col">Right</th><th scope="col">Revisit</th></tr></thead><tbody>' +
      Object.keys(byArea).map(function (a) { var A = areaById(a), b = byArea[a], cm = COMPARE.filter(function (c) { return c.area === a; })[0];
        return '<tr' + (b[0] < b[1] ? ' data-warn="true"' : '') + '><th scope="row">' + A.name + '</th><td>' + b[0] + ' / ' + b[1] + '</td><td>' + A.found.map(function (f) { return '<a href="#/f/' + f + '">' + f + '</a>'; }).join(', ') + (cm ? ' &middot; <a href="#/compare/' + cm.id + '">' + cm.title + '</a>' : '') + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      (wrong.length ? '<h2>Missed</h2>' + wrong.map(function (k) { var q = QBK[k]; return row(q.obj || 'F', q.q, q.homeLabel, q.home); }).join('') : '') +
      '<div class="xs__btns">' + (wrong.length ? '<button class="btn btn--primary" type="button" data-act="pretry">Retry the ' + wrong.length + ' missed</button>' : '') + '<button class="btn" type="button" data-act="pnew">New set</button><a class="btn" href="#/review">Review page</a></div>';
    $('#content').innerHTML = h;
  }

  /* ================================================================
     Search: concepts with input and output, lessons, objectives, terms
     ================================================================ */
  var IN_TYPES = [['text', 'Text'], ['image', 'Image'], ['audio', 'Audio or speech'], ['document', 'Document or form'], ['video', 'Video'], ['prompt', 'Prompt or request']];
  var OUT_TYPES = [['categor', 'Category or label'], ['number', 'Number'], ['field', 'Fields'], ['text', 'Text'], ['image', 'Image'], ['audio', 'Audio'], ['location', 'Objects and locations'], ['action', 'Action']];
  function matchesType(s, t) {
    s = (s || '').toLowerCase();
    if (t === 'audio') return /audio|speech|spoken|recording/.test(s);
    if (t === 'document') return /document|form|scan|receipt|invoice/.test(s);
    if (t === 'video') return /video|recording/.test(s);
    if (t === 'prompt') return /prompt|goal|request|question/.test(s);
    if (t === 'location') return /location|box|where|pixel/.test(s);
    if (t === 'action') return /action/.test(s);
    if (t === 'field') return /field/.test(s);
    if (t === 'categor') return /categor|label|positive|negative/.test(s);
    return s.indexOf(t) !== -1;
  }
  var SIDX = null;
  function searchIndex() {
    if (SIDX) return SIDX;
    var x = [];
    CONCEPTS.forEach(function (c) { x.push({ kind: 'Concept', title: c.n, sub: areaById(c.area).name, area: c.area, inp: c.in, out: c.out, objs: c.objs, href: c.go, aka: c.aka, text: [c.n, c.aka.join(' '), c.def, c.in, c.out, c.ms || ''].join(' '), def: c.def, ms: c.ms }); });
    FOUND.forEach(function (f) { x.push({ kind: 'Lesson', title: f.id + ' ' + f.title, sub: 'Module 0, ' + stageOf(f.id).title, area: f.area, objs: f.supports, href: '#/f/' + f.id, text: [f.id, f.title, f.outcomes.join(' '), f.words.map(function (w) { return w[0]; }).join(' ')].join(' ') }); });
    LEARN.forEach(function (L) { L.units.forEach(function (u, i) { x.push({ kind: 'Concept page', title: u.t, sub: L.id + ' ' + L.title, href: '#/learn/' + L.id, anchor: 'u-' + L.id + '-' + i, objs: [], text: u.t + ' ' + u.terms.map(function (t) { return t[0]; }).join(' ') }); }); });
    MODULES.forEach(function (m) { x.push({ kind: 'Exam module', title: m.id + ' ' + m.title, sub: dom(m.domain).name, href: '#/m/' + m.id, objs: objsOfMod(m.id).map(function (o) { return o.id; }), text: m.id + ' ' + m.title + ' ' + m.group }); });
    OBJ.forEach(function (o) { x.push({ kind: 'Objective', title: o.id + ' ' + o.text, sub: GROUPS_BY[o.g].title, area: o.area, href: '#/obj/' + o.id, objs: [o.id], text: o.id + ' ' + o.text + ' ' + o.lens.join(' ') + ' ' + o.ms }); });
    COMPARE.forEach(function (c) { x.push({ kind: 'Comparison', title: c.title, sub: c.items.map(function (i) { return i.concept; }).join(' vs '), area: c.area, href: '#/compare/' + c.id, objs: c.objs, text: c.title + ' ' + c.items.map(function (i) { return i.concept + ' ' + i.input + ' ' + i.output; }).join(' ') }); });
    GLOSS.forEach(function (g) { x.push({ kind: 'Term', title: g.term, sub: g.def, href: g.href, anchor: g.anchor, objs: [], text: g.term + ' ' + g.def }); });
    SIDX = x; return x;
  }
  function runSearch(q, f) {
    var terms = (q || '').toLowerCase().split(/\s+/).filter(Boolean);
    return searchIndex().filter(function (it) {
      if (f.kind && it.kind !== f.kind) return false;
      if (f.area && it.area !== f.area) return false;
      if (f.inp && !(it.inp && matchesType(it.inp, f.inp))) return false;
      if (f.out && !(it.out && matchesType(it.out, f.out))) return false;
      if (!terms.length) return !!(f.kind || f.area || f.inp || f.out);
      var hay = (it.title + ' ' + it.text + ' ' + it.kind).toLowerCase();
      return terms.every(function (t) { return hay.indexOf(t) !== -1; });
    }).map(function (it) {
      var tl = it.title.toLowerCase(), s = 0;
      terms.forEach(function (t) { if (tl.indexOf(t) === 0) s += 6; else if (tl.indexOf(t) !== -1) s += 3; if (it.aka && it.aka.some(function (a) { return a.toLowerCase() === t; })) s += 8; });
      s += { Concept: 4, Comparison: 3, Lesson: 2, Objective: 2, 'Exam module': 1 }[it.kind] || 0;
      return [s, it];
    }).sort(function (a, b) { return b[0] - a[0]; }).map(function (x) { return x[1]; });
  }
  function resultCard(it) {
    return '<li class="sr"><a href="' + it.href + '"' + (it.anchor ? ' data-term="' + it.anchor + '"' : '') + '><span class="sr__k">' + it.kind + '</span><strong class="sr__t">' + escH(it.title) + '</strong><span class="sr__s">' + escH(it.sub || '') + '</span></a>' +
      (it.inp ? '<dl class="sr__io"><div><dt>Input</dt><dd>' + it.inp + '</dd></div><div><dt>Output</dt><dd>' + it.out + '</dd></div>' + (it.ms ? '<div><dt>Microsoft</dt><dd>' + it.ms + '</dd></div>' : '') + '</dl>' : '') +
      (it.def ? '<p class="sr__d">' + it.def + '</p>' : '') +
      (it.objs && it.objs.length ? '<p class="sr__o">AI-901 objective' + (it.objs.length > 1 ? 's' : '') + ': ' + it.objs.map(function (o) { return objLink(o); }).join(', ') + '</p>' : (it.kind === 'Concept' ? '<p class="sr__o">Foundation: not an AI-901 objective by itself</p>' : '')) + '</li>';
  }
  function renderSearch() {
    var p = params(), f = { kind: p.kind || '', area: p.area || '', inp: p.in || '', out: p.out || '' };
    var kinds = ['Concept', 'Lesson', 'Concept page', 'Exam module', 'Objective', 'Comparison', 'Term'];
    var h = crumbs([['AI-901', '#/dash'], ['Search', '']]) + '<h1>Search</h1>' +
      '<form class="srch" id="srch" role="search" onsubmit="return false"><label class="vh" for="sq">Search the Academy</label><input id="sq" class="gl__q" type="search" placeholder="Concept, product, objective, acronym (OCR, NER, TTS, RAG...)" value="' + escH(p.q || '') + '" autocomplete="off">' +
      '<div class="srch__f"><label>Kind <select name="kind"><option value="">Any</option>' + kinds.map(function (k) { return '<option' + (f.kind === k ? ' selected' : '') + '>' + k + '</option>'; }).join('') + '</select></label>' +
      '<label>Concept area <select name="area"><option value="">Any</option>' + AREAS.map(function (a) { return '<option value="' + a.id + '"' + (f.area === a.id ? ' selected' : '') + '>' + a.name + '</option>'; }).join('') + '</select></label>' +
      '<label>Input <select name="in"><option value="">Any</option>' + IN_TYPES.map(function (t) { return '<option value="' + t[0] + '"' + (f.inp === t[0] ? ' selected' : '') + '>' + t[1] + '</option>'; }).join('') + '</select></label>' +
      '<label>Output <select name="out"><option value="">Any</option>' + OUT_TYPES.map(function (t) { return '<option value="' + t[0] + '"' + (f.out === t[0] ? ' selected' : '') + '>' + t[1] + '</option>'; }).join('') + '</select></label></div></form>' +
      '<div id="sres" aria-live="polite"></div>';
    $('#content').innerHTML = h;
    drawSearch();
  }
  function drawSearch() {
    var form = $('#srch'); if (!form) return;
    var q = $('#sq').value, f = { kind: form.kind.value, area: form.area.value, inp: form['in'].value, out: form.out.value };
    var res = runSearch(q, f), box = $('#sres');
    if (!q.trim() && !f.kind && !f.area && !f.inp && !f.out) { box.innerHTML = '<p class="field__note">Try "object detection", "OCR", "agent", "1.3.2", or set Input to Image to see every capability that takes images.</p>'; return; }
    box.innerHTML = '<p class="field__note">' + res.length + ' result' + (res.length === 1 ? '' : 's') + '</p><ol class="srl">' + res.slice(0, 60).map(resultCard).join('') + '</ol>' + (res.length ? '' : empty('No matches.', 'Try a shorter term or clear a filter.'));
  }
