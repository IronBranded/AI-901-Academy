
  /* ================================================================
     Study path, recommendations and the dashboard
     ================================================================ */

  /* The recommended order. Labs are part of the path but optional (they need an
     Azure subscription), so "Continue learning" never waits on one. */
  var PATH = (function () {
    var p = [];
    FOUND.forEach(function (f) { p.push({ kind: 'f', id: f.id, stage: 1, label: f.id + ' ' + f.title, href: '#/f/' + f.id }); });
    var plan = [['L1', ['01-01']], ['L3', ['01-02']], ['L4', []], ['L5', []], ['L6', []], ['L7', ['01-03']], ['L2', ['ENV', '02-01']], ['L8', ['02-02']], [null, ['02-03', '02-04', '02-05']]];
    plan.forEach(function (pp) {
      if (pp[0]) { var L = lById(pp[0]); p.push({ kind: 'l', id: L.id, stage: 2, label: L.id + ' ' + L.title, href: '#/learn/' + L.id }); }
      pp[1].forEach(function (mid) {
        var m = byId(mid);
        if (mid !== 'ENV') p.push({ kind: 'm', id: mid, stage: 3, label: 'Module ' + mid + ' ' + m.title, href: '#/m/' + mid });
        p.push({ kind: 'lab', id: mid, stage: 3, label: 'Lab ' + mid + ' ' + m.short, href: '#/lab/' + mid, optional: true });
        if (mid !== 'ENV') p.push({ kind: 'check', id: mid, stage: 4, label: 'Knowledge check ' + mid, href: '#/m/' + mid + '#quiz' });
      });
    });
    p.push({ kind: 'exam', id: 'exam', stage: 4, label: 'Practice exam', href: '#/exam' });
    return p;
  })();
  function stepDone(s) {
    if (s.kind === 'f') return !!state.studied['f:' + s.id];
    if (s.kind === 'l') return !!state.studied['l:' + s.id];
    if (s.kind === 'm') return !!state.studied['m:' + s.id];
    if (s.kind === 'lab') return labComplete(byId(s.id));
    if (s.kind === 'check') return checkPassed('m:' + s.id);
    if (s.kind === 'exam') return state.exam.hist.length > 0;
    return false;
  }
  function nextStep() { for (var i = 0; i < PATH.length; i++) if (!PATH[i].optional && !stepDone(PATH[i])) return PATH[i]; return null; }
  var STAGES = [
    { n: 1, t: 'Foundations', s: 'Module 0: AI explained from the ground up', href: '#/f' },
    { n: 2, t: 'Concepts', s: 'Microsoft\'s two AI-901 learning paths, explained', href: '#/learn' },
    { n: 3, t: 'Exam modules and labs', s: 'Objective-by-objective depth in Microsoft Foundry', href: '#/obj' },
    { n: 4, t: 'Check and practise', s: 'Knowledge checks, Exam Prep and the practice exam', href: '#/prep' }
  ];

  function needsReviewList() {
    var out = [];
    OBJ.forEach(function (o) { var st = objStatus(o.id); if (st.needsReview) out.push({ o: o, n: st.ev.wrong.length }); });
    return out.sort(function (a, b) { return dom(GROUPS_BY[b.o.g].domain).mid - dom(GROUPS_BY[a.o.g].domain).mid || b.n - a.n; });
  }
  var GROUPS_BY = {}; GROUPS.forEach(function (g) { GROUPS_BY[g.id] = g; });
  function bookmarks() { return Object.keys(state.bm).map(function (k) { var b = state.bm[k]; return { key: k, label: b.label, href: b.href, t: b.t }; }).sort(function (a, b) { return b.t - a.t; }); }

  function groupCounts(g) {
    var os = objsOfGroup(g.id), c = { n: os.length, studied: 0, practiced: 0, exN: 0, checked: 0, review: 0 };
    os.forEach(function (o) { var st = objStatus(o.id); if (st.studied) c.studied++; if (st.exApplicable) { c.exN++; if (st.practiced) c.practiced++; } if (st.checked) c.checked++; if (st.needsReview) c.review++; });
    return c;
  }

  function renderDash() {
    var nx = nextStep(), last = state.last && state.last.href !== location.hash ? state.last : null;
    var h = '<h1>AI-901 Academy</h1><p class="lede">From "what is AI?" to building with Microsoft Foundry, mapped to the official AI-901 skills outline of ' + EXAM.outline + '.</p>';
    h += '<section class="next" aria-labelledby="next-h"><h2 id="next-h" class="next__h">' + (nx ? 'Continue learning' : 'Path complete') + '</h2>' +
      (nx ? '<p class="next__step"><a class="btn btn--primary" href="' + nx.href + '">' + nx.label + '</a></p><p class="next__why">' + nextWhy(nx) + '</p>' :
        '<p>Every step of the path is done. Keep your knowledge fresh with <a href="#/prep">Exam Prep</a> and the <a href="#/exam">practice exam</a>.</p>') +
      (last ? '<p class="next__last">Last visited: <a href="' + last.href + '">' + last.label + '</a></p>' : '') + '</section>';

    h += '<section aria-labelledby="path-h"><h2 id="path-h">Your path</h2><ol class="path">';
    STAGES.forEach(function (S) {
      var steps = PATH.filter(function (p) { return p.stage === S.n; }), req = steps.filter(function (p) { return !p.optional; }), done = req.filter(stepDone).length;
      var labs = steps.filter(function (p) { return p.kind === 'lab'; }), labsDone = labs.filter(stepDone).length;
      h += '<li class="path__s"><a href="' + S.href + '" class="path__a"><span class="path__n">' + S.n + '</span><span class="path__b"><strong>' + S.t + '</strong><span>' + S.s + '</span></span>' +
        '<span class="path__p"><span class="bar" role="img" aria-label="' + done + ' of ' + req.length + ' done"><span class="bar__fill" style="width:' + pct(req.length ? done / req.length : 0) + '%"></span></span><span>' + done + ' / ' + req.length + (labs.length ? ' &middot; labs ' + labsDone + '/' + labs.length : '') + '</span></span></a></li>';
    });
    h += '</ol></section>';

    h += '<section aria-labelledby="areas-h"><h2 id="areas-h">AI-901 objective areas</h2><p class="field__note">Counts are objectives, not pages. Practiced counts only objectives where an exercise applies. Nothing here predicts an exam result.</p>' +
      '<div class="table-scroll"><table class="areas"><thead><tr><th scope="col">Objective area</th><th scope="col">Studied</th><th scope="col">Practiced</th><th scope="col">Knowledge checked</th><th scope="col">Needs review</th></tr></thead><tbody>';
    ['01', '02'].forEach(function (d) {
      var D = dom(d);
      h += '<tr class="areas__d" style="--domain-tint:' + D.tint + '"><th scope="rowgroup" colspan="5">' + D.name + ' <span class="areas__w">' + D.weight + ' of the exam</span></th></tr>';
      GROUPS.filter(function (g) { return g.domain === d; }).forEach(function (g) {
        var c = groupCounts(g);
        h += '<tr><th scope="row"><a href="#/obj#g-' + g.id.replace('.', '-') + '">' + g.id + ' ' + g.title + '</a></th><td>' + c.studied + ' / ' + c.n + '</td><td>' + (c.exN ? c.practiced + ' / ' + c.exN : 'n/a') + '</td><td>' + c.checked + ' / ' + c.n + '</td><td>' + (c.review ? '<a href="#/review">' + c.review + '</a>' : '0') + '</td></tr>';
      });
    });
    h += '</tbody></table></div></section>';

    var nr = needsReviewList(), bms = bookmarks();
    h += '<div class="duo"><section aria-labelledby="nr-h"><h2 id="nr-h">Needs review</h2>' + (nr.length ? nr.slice(0, 5).map(function (x) {
      return row(x.o.id, x.o.text, 'Missed ' + x.n + ' question' + (x.n > 1 ? 's' : '') + ' &middot; ' + areaById(x.o.area).name, '#/obj/' + x.o.id);
    }).join('') + (nr.length > 5 ? '<p><a href="#/review">All ' + nr.length + ' &rarr;</a></p>' : '') : empty('Nothing needs review yet.', 'Wrong answers in checks, Exam Prep or the practice exam appear here until you answer them correctly.')) + '</section>';
    h += '<section aria-labelledby="rl-h"><h2 id="rl-h">Review later</h2>' + (bms.length ? bms.slice(0, 5).map(function (b) { return row('&#9733;', b.label, '', b.href); }).join('') + (bms.length > 5 ? '<p><a href="#/review">All ' + bms.length + ' &rarr;</a></p>' : '') :
      empty('No bookmarks.', 'Use "Review later" on any lesson, comparison or question.')) + '</section></div>';

    var ans = QB.filter(function (q) { return latest(q.key); }).length;
    h += '<section aria-labelledby="ep-h" class="ep"><h2 id="ep-h">Exam preparation</h2><p>' + ans + ' of ' + QB.length + ' review questions answered at least once. ' +
      (state.exam.hist[0] ? 'Last practice exam: <a href="#/exam/review">' + state.exam.hist[0].pct + '% correct</a> (a practice score, not a predicted exam score).' : 'No practice exam taken yet.') + '</p>' +
      '<div class="xs__btns"><a class="btn" href="#/prep">Exam Prep</a><a class="btn" href="#/prep?mode=review">Practise what needs review</a><a class="btn" href="#/exam">Practice exam (' + EXAMQ.length + ' questions)</a><a class="btn" href="#/compare">Comparisons</a></div></section>';
    $('#content').innerHTML = h;
  }
  function nextWhy(s) {
    if (s.kind === 'f') { var f = fById(s.id), st = stageOf(s.id); return 'Module 0, "' + st.title + '". ' + (f.scope === 'foundation' ? 'Foundation knowledge that later objectives build on.' : 'Prepares objective' + (f.supports.length > 1 ? 's ' : ' ') + f.supports.join(', ') + '.'); }
    if (s.kind === 'l') return 'Concept page that follows Microsoft\'s AI-901 learning path, before the exam module it feeds.';
    if (s.kind === 'm') return 'Exam module covering ' + objsOfMod(s.id).map(function (o) { return o.id; }).join(', ') + '.';
    if (s.kind === 'check') return 'Answer the module\'s knowledge check. ' + PASS + '% passes; misses go to Needs review.';
    return 'A full practice exam across both domains.';
  }

  /* ================================================================
     Module 0: foundation lessons
     ================================================================ */
  function lessonStates(f) {
    var k = 'f:' + f.id;
    return '<span class="sts">' + chip(state.studied[k], 'Studied') + chip(state.practiced[k], 'Practiced', !f.explore) + chip(checkPassed(k), 'Checked') + '</span>';
  }
  function renderFoundIndex() {
    var done = FOUND.filter(function (f) { return state.studied['f:' + f.id]; }).length;
    var h = crumbs([['AI-901', '#/dash'], ['Module 0: Before we build AI', '']]) +
      '<h1>Module 0: Before We Build AI</h1><p class="lede">Seventeen short lessons for people new to AI. Each starts with a real problem, explains it in plain English, builds a mental model, and only then names the Microsoft technology.</p>' +
      '<div class="progress-strip"><span>' + done + ' of ' + FOUND.length + ' lessons studied</span><div class="bar"><span class="bar__fill" style="width:' + pct(done / FOUND.length) + '%"></span></div></div>' +
      vIPO([{ r: 'Real-world problem', t: 'What needs doing?' }, { r: 'Type of data', t: 'Text, image, speech or documents' }, { r: 'AI capability', t: 'What kind of AI fits' }, { r: 'Model', t: 'Learned from data', k: 'd2' }, { r: 'Application', t: 'Calls the model' }, { r: 'Output', t: 'Label, fields, text, audio, action', k: 'ok' }, { r: 'Used by', t: 'A person or another system' }],
        'The central mental model. Every lesson in this Academy fills in these boxes, and every exam scenario can be read through them.') +
      Q('note', '<strong>Scope.</strong> Lessons marked <em>Foundation</em> teach background the AI-901 outline does not measure directly but other objectives depend on. Lessons marked <em>Supports</em> teach part of the objectives they list.');
    FOUND_STAGES.forEach(function (S, si) {
      h += '<section class="fstage" aria-labelledby="fs-' + S.id + '"><h2 id="fs-' + S.id + '">' + (si + 1) + '. ' + S.title + '</h2><ol class="flist">';
      S.lessons.forEach(function (id) {
        var f = fById(id);
        h += '<li><a class="fcard" href="#/f/' + f.id + '"><span class="fcard__id">' + f.id + '</span><span class="fcard__b"><strong>' + f.title + '</strong><span class="fcard__o">' + f.outcomes[0] + '</span>' +
          '<span class="fcard__m"><span class="scope" data-scope="' + (f.scope === 'foundation' ? 'foundation' : 'exam') + '">' + (f.scope === 'foundation' ? 'Foundation' : 'Supports ' + f.supports.join(', ')) + '</span>' + lessonStates(f) + '</span></span></a></li>';
      });
      h += '</ol></section>';
    });
    $('#content').innerHTML = h;
  }

  function renderFound(f) {
    var k = 'f:' + f.id, idx = FOUND.indexOf(f), prev = FOUND[idx - 1], next = FOUND[idx + 1], S = stageOf(f.id);
    var h = crumbs([['AI-901', '#/dash'], ['Module 0', '#/f'], [S.title, '#/f#fs-' + S.id], [f.short, '']]) +
      '<h1><span class="h1__id">' + f.id + '</span> ' + f.title + '</h1>';
    /* topic header */
    h += '<dl class="thead">' +
      '<div><dt>Objective area</dt><dd>' + areaById(f.area).name + '</dd></div>' +
      '<div><dt>' + (f.scope === 'foundation' ? 'Foundation for' : 'Official objectives') + '</dt><dd>' + f.supports.map(function (o) { return objLink(o) + ' ' + objById(o).text; }).join('<br>') +
        (f.scope === 'foundation' ? '<br><span class="field__note">Not measured directly by the AI-901 outline; needed to understand the objectives above.</span>' : '') + '</dd></div>' +
      '<div><dt>Prerequisites</dt><dd>' + (f.prereq.length ? f.prereq.map(function (p) { return '<a href="#/f/' + p + '">' + p + ' ' + fById(p).short + '</a>'; }).join(', ') : 'None') + '</dd></div>' +
      '<div><dt>Related exercise</dt><dd>' + (f.explore ? 'In-browser exploration below' : 'None for this lesson') + (f.mods.length ? '; Microsoft Foundry labs: ' + f.mods.map(function (m) { return '<a href="#/lab/' + m + '">' + m + '</a>'; }).join(', ') : '') + '</dd></div>' +
      '</dl>';
    h += '<div class="progress-strip">' + lessonStates(f) +
      '<button class="btn" data-act="study" data-key="' + k + '" aria-pressed="' + !!state.studied[k] + '">' + (state.studied[k] ? 'Studied &#10003;' : 'Mark as studied') + '</button>' +
      bmButton('p:' + k, 'Lesson ' + f.id + ' ' + f.title, '#/f/' + f.id) + '</div>';

    h += S2('outcomes', 'What you need to know', '<ul class="outcomes">' + f.outcomes.map(function (o) { return '<li>' + o + '</li>'; }).join('') + '</ul>');
    h += S2('problem', 'The problem', f.problem);
    h += S2('plain', 'In plain English', f.plain);
    h += S2('example', 'A concrete example', f.example);
    h += S2('words', 'Words you need to know', T('compare', ['Term', 'For now, think of it as'], f.words.map(function (w) { return ['<strong>' + w[0] + '</strong>', w[1]]; })) + '<p class="field__note">These are working definitions. Later lessons and the exam modules make them more precise.</p>');
    h += S2('model', 'Mental model', f.model());
    h += S2('concept', 'The AI concept', f.concept);
    h += S2('how', 'How it works', f.how);
    h += S2('ms', 'Microsoft translation', f.ms);
    if (f.visual) h += S2('visual', 'Visualize', typeof f.visual === 'function' ? f.visual() : f.visual);
    h += S2('distinct', 'Important distinctions', f.distinctions + (f.compare || []).map(function (c) { return CMP_BY[c] ? compareTable(CMP_BY[c]) : ''; }).join(''));
    h += S2('rai', 'Responsible AI lens', f.rai);
    h += S2('scenario', 'Example scenario', f.scenario);
    if (f.explore) h += S2('explore', 'Hands-on exploration', '<p>' + f.explore.intro + '</p>' + '<div data-widget="' + f.explore.widget + '"' + (f.explore.data ? ' data-set="' + f.explore.data + '"' : '') + ' data-lesson="' + k + '"></div>' +
      '<h3>Observe the result</h3>' + f.observe);
    h += lensBox(f.supports, f.scope === 'foundation' ? 'This lesson is foundation knowledge. These are the objectives it prepares you for.' : '');
    h += checkBlock(k);
    h += teachBlock(k, f.teach);
    h += S2('takeaways', 'Key takeaways', '<ul class="take">' + f.takeaways.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>');
    /* next step */
    var go = [];
    if (next) go.push('<a class="btn btn--primary" href="#/f/' + next.id + '">Next: ' + next.id + ' ' + next.title + '</a>');
    else go.push('<a class="btn btn--primary" href="#/learn/L1">Next: Concepts, L1 What AI Is</a>');
    h += S2('next', 'Next step', '<div class="nextnav"><div class="nextnav__main">' + go.join('') + (prev ? '<a class="btn" href="#/f/' + prev.id + '">Previous: ' + prev.id + ' ' + prev.short + '</a>' : '') + '</div>' +
      '<p><strong>Go deeper:</strong> ' + f.learn.map(function (L) { return '<a href="#/learn/' + L + '">' + L + ' ' + lById(L).short + '</a>'; }).join(', ') +
      (f.mods.length ? ' &middot; <strong>Exam modules:</strong> ' + f.mods.map(function (m) { return '<a href="#/m/' + m + '">' + m + ' ' + byId(m).short + '</a>'; }).join(', ') : '') + '</p>' +
      '<p><strong>Related objectives:</strong> ' + f.supports.map(function (o) { return objLink(o); }).join(', ') + '</p></div>');
    $('#content').innerHTML = h;
  }
  /* A lesson section. Uses the shared "shape" styling. */
  function S2(shape, title, html) { return '<section class="shape lesson" data-shape="' + shape + '"><h2 data-shape="' + shape + '">' + title + '</h2>' + html + '</section>'; }
