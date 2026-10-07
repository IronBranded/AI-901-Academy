
  /* ================================================================
     Reusable components
     ================================================================ */

  /* You are here. items: [[label, href]] - last item is the current page. */
  function crumbs(items) {
    return '<nav class="crumbs" aria-label="You are here"><ol>' + items.map(function (it, i) {
      var last = i === items.length - 1;
      return '<li>' + (last || !it[1] ? '<span' + (last ? ' aria-current="page"' : '') + '>' + it[0] + '</span>' : '<a href="' + it[1] + '">' + it[0] + '</a>') + '</li>';
    }).join('') + '</ol></nav>';
  }

  /* Review Later bookmark toggle. */
  function bmButton(key, label, href) {
    var on = !!state.bm[key];
    return '<button type="button" class="btn bm" data-act="bm" data-key="' + key + '" data-label="' + escH(label) + '" data-href="' + href + '" aria-pressed="' + on + '">' + (on ? '&#9733; In Review later' : '&#9734; Review later') + '</button>';
  }

  /* State chips. Text always states the meaning; colour is only a second cue. */
  function chip(on, label, na) {
    return '<span class="st" data-on="' + (na ? 'na' : !!on) + '">' + (na ? label + ': not applicable' : (on ? '&#10003; ' : '') + label) + '</span>';
  }
  function objChips(st) {
    return '<span class="sts">' + chip(st.studied, 'Studied') + chip(st.practiced, 'Practiced', !st.exApplicable) + chip(st.checked, 'Checked') +
      (st.applied ? chip(true, 'Applied') : '') + (st.retained ? chip(true, 'Retained') : '') + (st.needsReview ? '<span class="st" data-on="warn">Needs review</span>' : '') + '</span>';
  }

  /* AI-901 Exam Lens: what to be able to do, per objective, in the outline's verbs. */
  function lensBox(oids, note) {
    oids = oids.filter(function (id) { return objById(id); });
    if (!oids.length) return '';
    return '<section class="lens" aria-labelledby="lens-' + oids[0].replace(/\./g, '') + '"><h2 id="lens-' + oids[0].replace(/\./g, '') + '">AI-901 Exam Lens</h2>' +
      (note ? '<p class="lens__note">' + note + '</p>' : '') + '<p class="lens__lead">For AI-901, make sure you can:</p>' +
      oids.map(function (id) {
        var o = objById(id);
        return '<div class="lens__obj"><p class="lens__o">' + objLink(id) + ' <span>' + o.text + '</span></p><ul>' + o.lens.map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ul></div>';
      }).join('') + '</section>';
  }

  /* Comparison table: rows are the fields, columns the concepts. */
  var CMP_FIELDS = [['input', 'Input'], ['output', 'Output'], ['purpose', 'Purpose'], ['when', 'When to use'], ['diff', 'Key difference'], ['not', 'What it does not do'], ['example', 'Example']];
  function compareTable(c, opts) {
    opts = opts || {};
    var head = '<th scope="col">' + (opts.compact ? '' : '') + '</th>' + c.items.map(function (it) { return '<th scope="col">' + it.concept + '</th>'; }).join('');
    var rows = CMP_FIELDS.map(function (f) { return '<tr><th scope="row">' + f[1] + '</th>' + c.items.map(function (it) { return '<td>' + it[f[0]] + '</td>'; }).join('') + '</tr>'; }).join('');
    return '<figure class="cmp" id="cmp-' + c.id + '"><figcaption class="cmp__cap"><span class="cmp__t">' + c.title + '</span>' +
      '<span class="scope" data-scope="' + c.scope + '">' + (c.scope === 'exam' ? 'In the AI-901 outline' : 'Foundation') + '</span></figcaption>' +
      '<div class="table-scroll"><table class="cmp__tbl"><thead><tr>' + head + '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="cmp__take"><strong>AI-901 takeaway.</strong> ' + c.takeaway + '</p>' +
      (opts.links === false ? '' : '<p class="cmp__links">' + (c.objs.length ? 'Objectives: ' + c.objs.map(function (o) { return objLink(o); }).join(', ') + ' &middot; ' : '') + '<a href="#/compare/' + c.id + '">Open this comparison</a></p>') + '</figure>';
  }

  /* ---------------- knowledge checks ----------------
     One engine for module and foundation checks. Every answer shows: correct
     answer, why, why not the others, the scenario clue, the objective and, where
     defined, the misconception being tested. */
  function feedback(q, chosen) {
    var right = chosen === q.a, letters = 'ABCDEFG';
    var nots = q.o.map(function (o, i) { return i === q.a || !q.not[i] ? '' : '<li><strong>' + letters[i] + '. ' + o + '</strong> - ' + q.not[i] + '</li>'; }).join('');
    return '<div class="fb" data-right="' + right + '"><p class="fb__verdict"><strong>' + (right ? 'Correct.' : 'Not quite.') + '</strong></p><dl class="fb__dl">' +
      '<div><dt>Correct answer</dt><dd>' + letters[q.a] + '. ' + q.o[q.a] + '</dd></div>' +
      '<div><dt>Why</dt><dd>' + q.why + '</dd></div>' +
      (nots ? '<div><dt>Why not the others</dt><dd><ul>' + nots + '</ul></dd></div>' : '') +
      (q.clue ? '<div><dt>Scenario clue</dt><dd>' + q.clue + '</dd></div>' : '') +
      '<div><dt>Objective</dt><dd>' + (q.obj ? objLink(q.obj, true) : 'Foundation: supports the objectives listed on this page') + '</dd></div>' +
      (q.misc ? '<div><dt>Misconception tested</dt><dd>' + q.misc + '</dd></div>' : '') +
      '</dl><p class="fb__more">' + bmButton('q:' + q.key, 'Question: ' + q.q.slice(0, 70), q.home) + '</p></div>';
  }
  function checkBlock(set, title) {
    var qs = questionsOfSet(set), st = state.quiz[set] || {}, ans = st.answers || {}, marked = !!st.marked, last = st.last, letters = 'ABCDEFG';
    var h = '<p>' + qs.length + ' questions. Answer all of them, then check. ' + PASS + '% passes. Each question is tied to an objective, so a wrong answer appears under Needs review.</p>';
    qs.forEach(function (q, qi) {
      var chosen = ans[qi];
      h += '<fieldset class="quiz__q"' + (marked ? ' data-marked="true" data-result="' + (chosen === q.a ? 'right' : 'wrong') + '"' : '') + '>' +
        '<legend><span class="quiz__num">Question ' + (qi + 1) + (q.obj ? ' &middot; Objective ' + q.obj : ' &middot; Foundation') + '</span>' + q.q + '</legend>';
      q.o.forEach(function (opt, oi) {
        var mark = marked ? (oi === q.a ? ' data-mark="right"' : (oi === chosen ? ' data-mark="wrong"' : '')) : '';
        h += '<label class="quiz__opt"' + mark + '><input type="radio" name="' + set + '-q' + qi + '" data-set="' + set + '" data-qi="' + qi + '" value="' + oi + '"' + (chosen === oi ? ' checked' : '') + (marked ? ' disabled' : '') + '><span><b class="quiz__l">' + letters[oi] + '.</b> ' + opt + '</span></label>';
      });
      if (marked) h += feedback(q, chosen);
      h += '</fieldset>';
    });
    h += '<div class="quiz__bar">';
    if (marked && last) {
      var p = Math.round(100 * last.score / last.total);
      h += '<span class="quiz__score" data-pass="' + (p >= PASS) + '">' + last.score + ' / ' + last.total + ' &middot; ' + p + '%' + (p >= PASS ? ' &middot; passed' : ' &middot; not yet passed') + '</span><button class="btn" type="button" data-act="retry" data-set="' + set + '">Try again</button>';
    } else {
      h += '<button class="btn btn--primary" type="button" data-act="check" data-set="' + set + '">Check answers</button><span class="quiz__msg field__note" aria-live="polite"></span>';
      if (last) h += '<span class="field__note">Last attempt: ' + last.score + '/' + last.total + '</span>';
    }
    h += '</div>';
    return '<section class="shape quiz" data-shape="selfcheck" id="quiz"><h2 data-shape="selfcheck">' + (title || 'Knowledge check') + '</h2><form class="quiz__form" onsubmit="return false">' + h + '</form></section>';
  }
  function markCheck(set) {
    var qs = questionsOfSet(set), st = state.quiz[set] || (state.quiz[set] = {}), ans = st.answers || {};
    var missing = qs.filter(function (_, i) { return ans[i] === undefined; }).length;
    if (missing) { var m = $('.quiz__msg'); if (m) m.textContent = 'Answer all ' + qs.length + ' first (' + missing + ' left).'; return false; }
    var correct = qs.map(function (q, i) { return ans[i] === q.a; });
    qs.forEach(function (q, i) { logAnswer(q.key, correct[i], 'check'); });
    st.marked = true;
    st.last = { correct: correct, score: correct.filter(Boolean).length, total: qs.length, at: Date.now() };
    save();
    return true;
  }
  function checkPassed(set) { var l = state.quiz[set] && state.quiz[set].last; return !!(l && 100 * l.score / l.total >= PASS); }
  function checkPct(set) { var l = state.quiz[set] && state.quiz[set].last; return l ? Math.round(100 * l.score / l.total) : null; }

  /* ---------------- teach it back ---------------- */
  function teachBlock(key, t) {
    var saved = state.tb[key] || {}, ticks = saved.ticks || {};
    return '<section class="shape teach" data-shape="teach"><h2 data-shape="teach">Teach it back</h2><p>' + t.prompt + '</p>' +
      '<label class="ex__lbl" for="tb-' + key.replace(/[^a-z0-9]/gi, '') + '">Your explanation (saved in this browser only)</label>' +
      '<textarea class="ex__in tb__in" id="tb-' + key.replace(/[^a-z0-9]/gi, '') + '" rows="5" data-tb="' + key + '">' + escH(saved.text || '') + '</textarea>' +
      '<details class="tb__key"' + (saved.revealed ? ' open' : '') + '><summary data-act="tbreveal" data-key="' + key + '">Compare with the key points</summary><p>A good explanation covers:</p><ul class="tb__pts">' +
      t.points.map(function (p, i) { return '<li><label><input type="checkbox" data-tbtick="' + key + '" value="' + i + '"' + (ticks[i] ? ' checked' : '') + '> ' + p + '</label></li>'; }).join('') +
      '</ul><p class="field__note">Tick the points your explanation covered. Anything unticked is worth a second look.</p></details></section>';
  }

  /* ---------------- generic list rows ---------------- */
  function row(id, title, sub, href, extra) {
    return '<a class="ready__row" href="' + href + '"><span class="drill__id">' + id + '</span><span class="plan__body"><span class="plan__title">' + title + '</span>' + (sub ? '<span class="plan__est">' + sub + '</span>' : '') + '</span>' + (extra || '') + '</a>';
  }
  function empty(strong, rest) { return '<div class="empty"><strong>' + strong + '</strong>' + (rest ? ' ' + rest : '') + '</div>'; }
