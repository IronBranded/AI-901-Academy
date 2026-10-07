
  /* ================================================================
     Objectives map, objective detail, comparisons, review
     ================================================================ */

  /* Content coverage of an objective, from the Academy's side (not the learner's):
     covered = taught in a module, prepared by a foundation lesson, has an exercise
     or is marked exercise-not-applicable, and has at least one question. */
  function coverage(o) {
    var qs = QB.filter(function (q) { return q.obj === o.id; }).length + EXAMQ.filter(function (q) { return xObjs(q).indexOf(o.id) !== -1; }).length;
    var parts = { module: !!byId(o.mod), foundation: o.found.length > 0, concept: learnFor(o.mod).length > 0, comparison: o.cmp.length > 0, exercise: exerciseApplicable(o) ? 'yes' : 'n/a', questions: qs };
    var status = parts.module && parts.foundation && qs > 0 ? 'Covered' : parts.module ? 'Partial' : 'Missing';
    return { parts: parts, status: status, qs: qs };
  }

  function renderObjMap() {
    var h = crumbs([['AI-901', '#/dash'], ['Objectives', '']]) + '<h1>AI-901 objectives</h1>' +
      '<p class="lede">All 29 sub-objectives, verbatim from the study guide (skills measured as of ' + EXAM.outline + '), with where each is taught and your evidence for it. Last checked against the live study guide on ' + EXAM.lastChecked + '.</p>' +
      Q('note', '<strong>Reading the states.</strong> <em>Studied</em>: you marked the exam module studied. <em>Practiced</em>: a related lab or exploration is complete (some objectives have no exercise). <em>Checked</em>: your latest knowledge-check answers on it are right. <em>Applied</em>: answered correctly in Exam Prep or the practice exam. <em>Retained</em>: answered correctly on two different days. <em>Needs review</em>: your latest answer to one of its questions was wrong. Identifiers such as 2.1.3 are the Academy\'s, numbered in outline order.') +
      '<p><a href="' + EXAM.studyGuide + '" target="_blank" rel="noopener">Official study guide</a> &middot; <a href="https://github.com/IronBranded/AI-901-Academy/blob/main/docs/coverage-matrix.md" target="_blank" rel="noopener">Coverage matrix (generated)</a></p>';
    ['01', '02'].forEach(function (d) {
      var D = dom(d);
      h += '<section class="omap" id="d-' + d + '" style="--domain-tint:' + D.tint + '"><h2>' + D.name + ' <span class="areas__w">' + D.weight + '</span></h2>';
      GROUPS.filter(function (g) { return g.domain === d; }).forEach(function (g) {
        h += '<section class="omap__g" id="g-' + g.id.replace('.', '-') + '"><h3>' + g.id + ' ' + g.title + '</h3><ul class="omap__list">';
        objsOfGroup(g.id).forEach(function (o) {
          var st = objStatus(o.id), cv = coverage(o);
          h += '<li class="omap__o"><a class="omap__a" href="#/obj/' + o.id + '"><span class="drill__id">' + o.id + '</span><span class="omap__t">' + o.text + '</span></a>' +
            '<span class="omap__teach">Taught in <a href="#/m/' + o.mod + '">' + o.mod + '</a>; foundations ' + o.found.map(function (f) { return '<a href="#/f/' + f + '">' + f + '</a>'; }).join(', ') + '; ' + cv.qs + ' question' + (cv.qs === 1 ? '' : 's') + '</span>' + objChips(st) + '</li>';
        });
        h += '</ul></section>';
      });
      h += '</section>';
    });
    $('#content').innerHTML = h;
  }

  function renderObj(o) {
    var g = GROUPS_BY[o.g], D = dom(g.domain), st = objStatus(o.id), cv = coverage(o), m = byId(o.mod);
    var qs = QB.filter(function (q) { return q.obj === o.id; });
    var h = crumbs([['AI-901', '#/dash'], ['Objectives', '#/obj'], [D.name, '#/obj#d-' + g.domain], [g.id + ' ' + g.title, '#/obj#g-' + g.id.replace('.', '-')], [o.id, '']]) +
      '<h1><span class="h1__id">' + o.id + '</span> ' + o.text + '</h1>' +
      '<div class="progress-strip">' + objChips(st) + bmButton('o:' + o.id, 'Objective ' + o.id + ' ' + o.text, '#/obj/' + o.id) + '</div>' +
      '<dl class="thead"><div><dt>Domain</dt><dd>' + D.name + ' (' + D.weight + ')</dd></div><div><dt>Objective group</dt><dd>' + g.title + '</dd></div>' +
      '<div><dt>Concept area</dt><dd>' + areaById(o.area).name + '</dd></div><div><dt>Content coverage</dt><dd>' + cv.status + '</dd></div></dl>';
    h += lensBox([o.id]);
    h += S2('ms', 'How Microsoft implements it', '<p>' + o.ms + '</p>');
    h += S2('next', 'Where it is taught', '<ol class="otrail">' +
      '<li><strong>Foundations:</strong> ' + o.found.map(function (f) { return '<a href="#/f/' + f + '">' + f + ' ' + fById(f).title + '</a>' + (state.studied['f:' + f] ? ' &#10003;' : ''); }).join(', ') + '</li>' +
      (learnFor(o.mod).length ? '<li><strong>Concepts:</strong> ' + learnFor(o.mod).map(function (L) { return '<a href="#/learn/' + L.id + '">' + L.id + ' ' + L.title + '</a>' + (state.studied['l:' + L.id] ? ' &#10003;' : ''); }).join(', ') + '</li>' : '') +
      '<li><strong>Exam module:</strong> <a href="#/m/' + m.id + '">' + m.id + ' ' + m.title + '</a>' + (st.studied ? ' &#10003;' : '') + '</li>' +
      '<li><strong>Practice:</strong> ' + (exerciseApplicable(o) ? ((o.ex.labs || []).map(function (l) { return '<a href="#/lab/' + l + '">Lab ' + l + '</a>' + (labComplete(byId(l)) ? ' &#10003;' : ''); }).concat((o.ex.explore || []).map(function (x) { return '<a href="#/f/' + x + '">Exploration in ' + x + '</a>' + (state.practiced['f:' + x] ? ' &#10003;' : ''); })).join(', ')) : 'Exercise not applicable') + '</li>' +
      '<li><strong>Comparisons:</strong> ' + o.cmp.map(function (c) { return '<a href="#/compare/' + c + '">' + CMP_BY[c].title + '</a>'; }).join(', ') + '</li>' +
      '<li><strong>Questions:</strong> ' + qs.length + ' in checks, ' + (cv.qs - qs.length) + ' in the practice exam. <a href="#/prep?obj=' + o.id + '">Practise this objective</a></li></ol>');
    var ev = st.ev;
    h += S2('outcomes', 'Your evidence', ev.answered ? '<p>' + ev.answered + ' question' + (ev.answered > 1 ? 's' : '') + ' answered. ' + (ev.wrong.length ? ev.wrong.length + ' currently wrong: ' + ev.wrong.map(function (k) { var q = QBK[k]; return q ? '<a href="' + q.home + '">' + q.homeLabel + '</a>' : '<a href="#/exam/review">practice exam ' + k.slice(2) + '</a>'; }).join(', ') + '.' : 'All latest answers correct.') +
      ' Correct answers recorded on ' + Object.keys(ev.correctDays).length + ' different day(s).</p>' : '<p>No answers recorded yet for this objective.</p>');
    h += S2('sources', 'Sources this teaching was checked against', '<ul>' + o.src.map(function (u) { return '<li><a href="' + u + '" target="_blank" rel="noopener">' + u.replace('https://learn.microsoft.com/', '') + '</a></li>'; }).join('') + '<li><a href="' + EXAM.studyGuide + '" target="_blank" rel="noopener">AI-901 study guide</a></li></ul>');
    $('#content').innerHTML = h;
  }

  function renderCompareIndex() {
    var h = crumbs([['AI-901', '#/dash'], ['Comparisons', '']]) + '<h1>Comparisons</h1><p class="lede">Side-by-side tables for the concepts learners mix up. Each one lines up input, output, purpose, when to use it, the key difference and what it does not do.</p>';
    ['exam', 'foundation'].forEach(function (sc) {
      var list = COMPARE.filter(function (c) { return c.scope === sc; });
      h += '<h2>' + (sc === 'exam' ? 'Inside the AI-901 outline' : 'Foundations') + '</h2><div class="ccards">' + list.map(function (c) {
        return '<a class="ccard" href="#/compare/' + c.id + '"><strong>' + c.title + '</strong><span>' + c.items.map(function (i) { return i.concept; }).join(' &middot; ') + '</span><span class="ccard__m">' + (c.objs.length ? 'Objectives ' + c.objs.join(', ') : '') + (state.bm['c:' + c.id] ? ' &middot; &#9733;' : '') + '</span></a>';
      }).join('') + '</div>';
    });
    $('#content').innerHTML = h;
  }
  function renderCompare(c) {
    var f = fById(c.lesson);
    var h = crumbs([['AI-901', '#/dash'], ['Comparisons', '#/compare'], [c.title, '']]) + '<h1>' + c.title + '</h1>' +
      '<div class="progress-strip">' + bmButton('c:' + c.id, 'Comparison: ' + c.title, '#/compare/' + c.id) + '</div>' + compareTable(c, { links: false }) +
      '<p><strong>Learn it:</strong> <a href="#/f/' + f.id + '">' + f.id + ' ' + f.title + '</a>' + (c.objs.length ? ' &middot; <strong>Objectives:</strong> ' + c.objs.map(function (o) { return objLink(o, true); }).join('; ') : '') + '</p>';
    var related = COMPARE.filter(function (x) { return x !== c && x.area === c.area; });
    if (related.length) h += '<p><strong>Related:</strong> ' + related.map(function (x) { return '<a href="#/compare/' + x.id + '">' + x.title + '</a>'; }).join(' &middot; ') + '</p>';
    $('#content').innerHTML = h;
  }

  /* ---------------- Review: needs review + review later ---------------- */
  function areaStats() {
    var by = {};
    AREAS.forEach(function (a) { by[a.id] = { a: a, answered: 0, wrong: 0, right: 0 }; });
    QB.forEach(function (q) { var l = latest(q.key); if (!l) return; var b = by[q.area]; if (!b) return; b.answered++; if (l.ok) b.right++; else b.wrong++; });
    return AREAS.map(function (a) { return by[a.id]; });
  }
  function renderReview() {
    var nr = needsReviewList(), bms = bookmarks(), stats = areaStats().filter(function (s) { return s.answered; });
    var h = crumbs([['AI-901', '#/dash'], ['Review', '']]) + '<h1>Review</h1><p class="lede">What your answers say to revisit, and what you saved for later. Everything here comes from your own answers; nothing is estimated.</p>';
    h += '<section><h2>By concept area</h2>' + (stats.length ? '<div class="table-scroll"><table class="areas"><thead><tr><th scope="col">Concept area</th><th scope="col">Latest answers right</th><th scope="col">Currently wrong</th><th scope="col">Revisit</th></tr></thead><tbody>' +
      stats.map(function (s) {
        var cm = COMPARE.filter(function (c) { return c.area === s.a.id; })[0];
        return '<tr' + (s.wrong ? ' data-warn="true"' : '') + '><th scope="row">' + s.a.name + '</th><td>' + s.right + ' / ' + s.answered + '</td><td>' + s.wrong + '</td><td>' +
          s.a.found.map(function (f) { return '<a href="#/f/' + f + '">' + f + '</a>'; }).join(', ') + (cm ? ' &middot; <a href="#/compare/' + cm.id + '">comparison</a>' : '') + (s.wrong ? ' &middot; <a href="#/prep?area=' + s.a.id + '">practise</a>' : '') + '</td></tr>';
      }).join('') + '</tbody></table></div>' : empty('No answers yet.', 'Take a knowledge check or an Exam Prep set; results by concept area appear here.')) + '</section>';
    h += '<section><h2>Objectives that need review</h2>' + (nr.length ? nr.map(function (x) {
      return row(x.o.id, x.o.text, areaById(x.o.area).name + ' &middot; ' + x.n + ' question' + (x.n > 1 ? 's' : '') + ' currently wrong', '#/obj/' + x.o.id);
    }).join('') + '<p><a class="btn" href="#/prep?mode=review">Practise these now</a></p>' : empty('Nothing needs review.', '')) + '</section>';
    var wrongQs = QB.filter(function (q) { var l = latest(q.key); return l && !l.ok; });
    if (wrongQs.length) h += '<section><h2>Questions to retry</h2>' + wrongQs.map(function (q) { return row(q.obj || 'F', q.q, q.homeLabel, q.home); }).join('') + '</section>';
    h += '<section><h2>Review later</h2>' + (bms.length ? bms.map(function (b) { return row('&#9733;', b.label, '', b.href, '<button type="button" class="btn" data-act="unbm" data-key="' + b.key + '">Remove</button>'); }).join('') : empty('No bookmarks.', 'Use "Review later" on lessons, modules, comparisons, objectives and questions.')) + '</section>';
    var lx = state.exam.hist[0];
    if (lx) {
      var ex = Object.keys(lx.wrongObjs).map(function (k) { var p = k.split(':'); return { id: objKey(p[0], +p[1]), n: lx.wrongObjs[k] }; }).filter(function (x) { return x.id; });
      h += '<section><h2>Missed on your last practice exam</h2>' + (ex.length ? ex.map(function (x) { return row(x.id, objById(x.id).text, 'last exam ' + lx.pct + '%', '#/obj/' + x.id, '<span class="chip">&times;' + x.n + '</span>'); }).join('') : empty('Nothing missed.', '')) + '</section>';
    }
    $('#content').innerHTML = h;
  }
