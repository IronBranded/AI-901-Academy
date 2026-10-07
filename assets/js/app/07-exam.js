
  /* ================================================================
     Practice exam (formats: single, multi, yes/no, code completion, ordering, case study)
     ================================================================ */
  function xExplain(q) {
    var letters = 'ABCDEFG', h = '<dl class="fb__dl"><div><dt>Why</dt><dd>' + q.why + '</dd></div>';
    if (q.not && q.o) {
      var nots = q.o.map(function (o, i) { return q.not[i] ? '<li><strong>' + letters[i] + '. ' + o + '</strong> - ' + q.not[i] + '</li>' : ''; }).join('');
      if (nots) h += '<div><dt>Why not the others</dt><dd><ul>' + nots + '</ul></dd></div>';
    }
    if (q.clue) h += '<div><dt>Scenario clue</dt><dd>' + q.clue + '</dd></div>';
    return h + '</dl>';
  }

  var MODE = { full: 'Full exam', d1: 'Domain 1 only', d2: 'Domain 2 only', missed: 'Missed questions' };
  var TYPE_NAME = { single: 'Multiple choice', multi: 'Multiple response', yesno: 'Yes / No set', code: 'Code completion', order: 'Build a list (ordering)' };
  var examTimer = null;
  function qDom(q) { return byId(q.mod).domain; }
  function hashStr(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  function scramble(n, seed) {
    var p = [], h = hashStr(seed), i;
    for (i = 0; i < n; i++) p.push(i);
    for (i = n - 1; i > 0; i--) { h = (h * 1103515245 + 12345) >>> 0; var k = h % (i + 1), t = p[i]; p[i] = p[k]; p[k] = t; }
    if (p.every(function (v, j) { return v === j; })) p.reverse();
    return p;
  }
  function ids(list) { return list.map(function (q) { return q.id; }); }
  function initAns(q) {
    if (q.type === 'multi') return [];
    if (q.type === 'yesno') return q.s.map(function () { return null; });
    if (q.type === 'code') return q.blanks.map(function () { return null; });
    if (q.type === 'order') return scramble(q.items.length, q.id);
    return null;
  }
  function isAnswered(q, a) {
    if (q.type === 'single') return a !== null && a !== undefined;
    if (q.type === 'multi') return !!a && a.length > 0;
    if (q.type === 'order') return true;
    return !!a && a.every(function (x) { return x !== null; });
  }
  function scoreQ(q, a) {
    if (q.type === 'single') return a === q.a ? 1 : 0;
    if (q.type === 'multi') return (a || []).slice().sort().join(',') === q.a.slice().sort().join(',') ? 1 : 0;
    if (q.type === 'yesno') return q.a.filter(function (v, i) { return a && a[i] === v; }).length / q.a.length;
    if (q.type === 'code') return q.blanks.filter(function (b, i) { return a && a[i] === b.a; }).length / q.blanks.length;
    if (q.type === 'order') return a && a.every(function (v, i) { return v === i; }) ? 1 : 0;
    return 0;
  }
  function wrongParts(q, a) {
    if (q.type === 'yesno' || q.type === 'code') {
      var out = [], n = q.type === 'yesno' ? q.a.length : q.blanks.length;
      for (var i = 0; i < n; i++) {
        var ok = q.type === 'yesno' ? (a && a[i] === q.a[i]) : (a && a[i] === q.blanks[i].a);
        if (!ok) out.push(q.pm ? q.pm[i] : [q.mod, q.obj]);
      }
      return out;
    }
    return scoreQ(q, a) === 1 ? [] : [[q.mod, q.obj]];
  }
  function instr(q) {
    return q.type === 'single' ? 'Choose one.' :
      q.type === 'multi' ? 'Choose ' + ['', 'one', 'two', 'three'][q.pick] + '. Each correct selection presents part of the solution.' :
      q.type === 'yesno' ? 'For each statement, select Yes if the statement is true. Otherwise, select No.' :
      q.type === 'code' ? 'Select the correct option for each blank in the code.' :
      'Move the items into the correct order.';
  }

  function startExam(mode) {
    var base = EXAMQ.filter(function (q) { return !q.case; }), cases = EXAMQ.filter(function (q) { return q.case; }), list;
    if (mode === 'd1' || mode === 'd2') list = ids(shuffle(base.filter(function (q) { return qDom(q) === (mode === 'd1' ? '01' : '02'); })));
    else if (mode === 'missed') {
      var last = state.exam.hist[0], wrong = last ? last.ids.filter(function (id) { return last.scores[id] < 1 && XQ[id]; }) : [];
      list = shuffle(wrong.filter(function (id) { return !XQ[id].case; })).concat(wrong.filter(function (id) { return XQ[id].case; }));
    } else list = ids(shuffle(base)).concat(ids(cases));
    if (!list.length) return;
    var answers = {};
    list.forEach(function (id) { answers[id] = initAns(XQ[id]); });
    var tm = $('#xtimed');
    state.exam.cur = { mode: mode, ids: list, answers: answers, flags: {}, idx: 0, started: Date.now(), timed: !!(tm && tm.checked) };
    save();
    go('#/exam');
  }
  function submitExam() {
    var c = state.exam.cur, scores = {}, byD = { '01': [0, 0], '02': [0, 0] }, wrongObjs = {}, total = 0;
    c.ids.forEach(function (id) {
      var q = XQ[id], a = c.answers[id], s = scoreQ(q, a), d = qDom(q);
      scores[id] = s; total += s; byD[d][0] += s; byD[d][1] += 1;
      var wp = wrongParts(q, a), outcomes = {};
      xObjs(q).forEach(function (oid) { outcomes[oid] = true; });
      wp.forEach(function (p) {
        var k = p[0] + ':' + p[1], oid = objKey(p[0], p[1]);
        wrongObjs[k] = (wrongObjs[k] || 0) + 1;
        if (oid) outcomes[oid] = false;
      });
      logAnswer('x:' + id, s === 1, 'exam', outcomes);
    });
    state.exam.hist.unshift({ at: Date.now(), mode: c.mode, ids: c.ids, answers: c.answers, scores: scores,
      pct: Math.round(100 * total / c.ids.length), byD: byD, wrongObjs: wrongObjs, secs: Math.round((Date.now() - c.started) / 1000) });
    state.exam.hist = state.exam.hist.slice(0, 8);
    state.exam.cur = null;
    save();
    go('#/exam/review');
  }

  function answerUI(q, a, lock) {
    var dis = lock ? ' disabled' : '';
    if (q.type === 'single' || q.type === 'multi') {
      var multi = q.type === 'multi';
      return '<div class="xq__opts">' + q.o.map(function (o, i) {
        var on = multi ? (a || []).indexOf(i) !== -1 : a === i, mark = '';
        if (lock) { var right = multi ? q.a.indexOf(i) !== -1 : q.a === i; mark = right ? ' data-mark="right"' : (on ? ' data-mark="wrong"' : ''); }
        return '<label class="quiz__opt"' + mark + '><input type="' + (multi ? 'checkbox' : 'radio') + '" name="xopt" data-x="' + q.type + '" value="' + i + '"' + (on ? ' checked' : '') + dis + '><span>' + o + '</span></label>';
      }).join('') + '</div>';
    }
    if (q.type === 'yesno') {
      return '<div class="table-scroll"><table class="xq__yn"><thead><tr><th>Statement</th><th>Yes</th><th>No</th>' + (lock ? '<th>Key</th>' : '') + '</tr></thead><tbody>' +
        q.s.map(function (st, i) {
          var v = a ? a[i] : null;
          function cell(val) { return '<td class="xq__ync"><input type="radio" name="yn' + i + '" data-x="yesno" data-i="' + i + '" value="' + (val ? 1 : 0) + '"' + (v === val ? ' checked' : '') + dis + ' aria-label="' + (val ? 'Yes' : 'No') + '"></td>'; }
          return '<tr' + (lock ? ' data-ok="' + (v === q.a[i]) + '"' : '') + '><td>' + st + '</td>' + cell(true) + cell(false) + (lock ? '<td class="xq__key">' + (q.a[i] ? 'Yes' : 'No') + '</td>' : '') + '</tr>';
        }).join('') + '</tbody></table></div>';
    }
    if (q.type === 'code') {
      var out = '';
      q.code.split(/\[\[(\d+)\]\]/).forEach(function (p, i) {
        if (i % 2 === 0) { out += escH(p); return; }
        var k = +p, b = q.blanks[k], v = a ? a[k] : null;
        if (lock) {
          var ok = v === b.a;
          out += '<span class="xq__blank" data-ok="' + ok + '">' + escH(v === null || v === undefined ? '(blank)' : b.o[v]) + '</span>' + (ok ? '' : '<span class="xq__fix"> &rarr; ' + escH(b.o[b.a]) + '</span>');
        } else {
          out += '<select class="xq__sel" data-x="code" data-i="' + k + '" aria-label="Blank ' + (k + 1) + '"><option value="">&mdash; select &mdash;</option>' +
            b.o.map(function (o, oi) { return '<option value="' + oi + '"' + (v === oi ? ' selected' : '') + '>' + escH(o) + '</option>'; }).join('') + '</select>';
        }
      });
      return '<pre class="xq__code"><code>' + out + '</code></pre>';
    }
    if (q.type === 'order') {
      var perm = a || q.items.map(function (_, i) { return i; });
      if (lock) {
        return '<div class="xq__ord2"><div><h4>Your order</h4><ol>' + perm.map(function (ix, pos) { return '<li data-ok="' + (ix === pos) + '">' + q.items[ix] + '</li>'; }).join('') +
          '</ol></div><div><h4>Correct order</h4><ol>' + q.items.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ol></div></div>';
      }
      return '<ol class="xq__order">' + perm.map(function (ix, pos) {
        return '<li><span>' + q.items[ix] + '</span><span class="xq__mv">' +
          '<button class="btn" type="button" data-act="xmove" data-i="' + pos + '" data-d="-1" aria-label="Move up"' + (pos === 0 ? ' disabled' : '') + '>&uarr;</button>' +
          '<button class="btn" type="button" data-act="xmove" data-i="' + pos + '" data-d="1" aria-label="Move down"' + (pos === perm.length - 1 ? ' disabled' : '') + '>&darr;</button></span></li>';
      }).join('') + '</ol>';
    }
    return '';
  }

  function examCounts(c) {
    return {
      ans: c.ids.filter(function (x) { return isAnswered(XQ[x], c.answers[x]); }).length,
      flag: c.ids.filter(function (x) { return c.flags[x]; }).length
    };
  }
  function refreshExamStrip() {
    var c = state.exam.cur, el = $('#xstat');
    if (!c || !el) return;
    var k = examCounts(c);
    el.textContent = 'Question ' + (c.idx + 1) + ' of ' + c.ids.length + ' \u00b7 ' + k.ans + ' answered' + (k.flag ? ' \u00b7 ' + k.flag + ' flagged' : '');
    var bar = $('#xbar'); if (bar) bar.style.width = pct(k.ans / c.ids.length) + '%';
    var cell = $('.xq__cell[data-i="' + c.idx + '"]'); if (cell) cell.dataset.done = String(isAnswered(XQ[c.ids[c.idx]], c.answers[c.ids[c.idx]]));
  }
  function startTimer() {
    clearInterval(examTimer);
    var c = state.exam.cur;
    if (!c || !c.timed || !$('#xtimer')) return;
    function tick() {
      var el = $('#xtimer');
      if (!el || !state.exam.cur) { clearInterval(examTimer); return; }
      var rem = c.ids.length * 60 - Math.round((Date.now() - c.started) / 1000), neg = rem < 0, r = Math.abs(rem);
      el.textContent = (neg ? '-' : '') + Math.floor(r / 60) + ':' + ('0' + (r % 60)).slice(-2) + (neg ? ' over' : ' left');
      el.dataset.over = String(neg);
    }
    tick();
    examTimer = setInterval(tick, 1000);
  }

  function renderExamStart() {
    var base = EXAMQ.filter(function (q) { return !q.case; });
    var n1 = base.filter(function (q) { return qDom(q) === '01'; }).length, n2 = base.length - n1;
    var last = state.exam.hist[0], missed = last ? last.ids.filter(function (id) { return last.scores[id] < 1; }).length : 0;
    var counts = {};
    EXAMQ.forEach(function (q) { counts[q.type] = (counts[q.type] || 0) + 1; });
    var h = crumbs([['AI-901', '#/dash'], ['Practice exam', '']]) + '<h1>Practice exam</h1><p class="lede">' + EXAMQ.length + ' scenario questions across both domains, including a ' + (EXAMQ.length - base.length) + '-question case study. Questions give no hint of which module they come from until you submit.</p>' +
      Q('note', '<strong>Formats.</strong> Microsoft exams use item types like these; the exact mix on AI-901 is not published. Here, Yes/No sets and code completions earn credit per part; every other item is all-or-nothing.') +
      T('compare', ['Format', 'What you do', 'Here'], [
        ['Multiple choice', 'Pick the one best answer to a scenario', counts.single || 0],
        ['Multiple response', 'Pick exactly the stated number of answers', counts.multi || 0],
        ['Yes / No set', 'Judge three statements about one scenario independently', counts.yesno || 0],
        ['Code completion', 'Choose the right token for each blank in a code sample', counts.code || 0],
        ['Build a list', 'Put steps in the right order', counts.order || 0],
        ['Case study', 'Several questions against one longer business scenario', EXAMQ.length - base.length]
      ]) +
      '<div class="xs"><label class="xs__timed"><input type="checkbox" id="xtimed"> Pace myself at one minute per question. This is a drill, not the official time limit.</label>' +
      '<div class="xs__btns"><button class="btn" type="button" data-act="xstart" data-mode="full">Full exam (' + EXAMQ.length + ')</button>' +
      '<button class="btn" type="button" data-act="xstart" data-mode="d1">Domain 1 only (' + n1 + ')</button>' +
      '<button class="btn" type="button" data-act="xstart" data-mode="d2">Domain 2 only (' + n2 + ')</button>' +
      (missed ? '<button class="btn" type="button" data-act="xstart" data-mode="missed">Retry the ' + missed + ' missed</button>' : '') + '</div></div>';
    if (state.exam.hist.length) {
      h += '<h2>Your attempts</h2>' + T('compare', ['When', 'Mode', 'Questions', 'Score'], state.exam.hist.map(function (x, i) {
        return [fmtDate(x.at), MODE[x.mode] || x.mode, x.ids.length, (i === 0 ? '<a href="#/exam/review">' + x.pct + '%</a>' : x.pct + '%')];
      }));
    }
    $('#content').innerHTML = h;
  }

  function renderExamSession() {
    var c = state.exam.cur, n = c.ids.length;
    if (c.idx >= n) c.idx = n - 1;
    var id = c.ids[c.idx], q = XQ[id], a = c.answers[id], k = examCounts(c);
    var h = '<h1>Practice exam</h1><div class="progress-strip"><span id="xstat">Question ' + (c.idx + 1) + ' of ' + n + ' &middot; ' + k.ans + ' answered' + (k.flag ? ' &middot; ' + k.flag + ' flagged' : '') + '</span>' +
      '<div class="bar"><span class="bar__fill" id="xbar" style="width:' + pct(k.ans / n) + '%"></span></div>' + (c.timed ? '<span class="xtimer" id="xtimer"></span>' : '') +
      '<button class="btn" type="button" data-act="xsubmit">Submit exam</button><button class="btn" type="button" data-variant="danger" data-act="xabandon">Abandon</button></div>';
    if (q.case) h += '<details class="xcase" open><summary>' + CASES[q.case].title + '</summary><div class="xcase__body">' + CASES[q.case].html + '</div></details>';
    h += '<article class="xq" data-type="' + q.type + '"><p class="xq__meta">' + TYPE_NAME[q.type] + (q.case ? ' &middot; Case study' : '') + '</p>' +
      '<div class="xq__stem"><p>' + q.stem + '</p></div><p class="xq__instr">' + instr(q) + '</p>' + answerUI(q, a, false) + '</article>';
    h += '<div class="xq__nav"><button class="btn" type="button" data-act="xprev"' + (c.idx === 0 ? ' disabled' : '') + '>&larr; Previous</button>' +
      '<button class="btn" type="button" data-act="xflag" aria-pressed="' + !!c.flags[id] + '">' + (c.flags[id] ? 'Flagged for review' : 'Flag for review') + '</button>' +
      '<button class="btn" type="button" data-act="xnext"' + (c.idx === n - 1 ? ' disabled' : '') + '>Next &rarr;</button></div>';
    h += '<div class="xq__grid" aria-label="Question navigator">' + c.ids.map(function (x, i) {
      return '<button class="xq__cell" type="button" data-act="xjump" data-i="' + i + '" data-done="' + isAnswered(XQ[x], c.answers[x]) + '"' +
        (c.flags[x] ? ' data-flag="true"' : '') + (i === c.idx ? ' aria-current="true"' : '') + (XQ[x].case ? ' data-case="true"' : '') + '>' + (i + 1) + '</button>';
    }).join('') + '</div><p class="field__note">Filled: answered. Orange ring: flagged. Dashed: case study.</p>';
    $('#content').innerHTML = h;
  }

  function renderExamReview() {
    var last = state.exam.hist[0];
    if (!last) { renderExamStart(); return; }
    var missed = last.ids.filter(function (id) { return last.scores[id] < 1; }).length;
    var h = '<h1>Practice exam results</h1><div class="gauge"><div><span class="gauge__big">' + last.pct + '%</span><span class="gauge__cap">' +
      last.ids.length + ' questions &middot; ' + (MODE[last.mode] || last.mode) + ' &middot; ' + fmtDate(last.at) + ' &middot; ' + fmtDur(last.secs) + '</span></div>';
    ['01', '02'].forEach(function (d) {
      var b = last.byD[d]; if (!b || !b[1]) return;
      var D = dom(d);
      h += '<div class="gauge__row" style="--domain-tint:' + D.tint + '"><span>' + D.name + '</span><div class="gauge__track"><div class="gauge__fill" style="width:' + pct(b[0] / b[1]) + '%"></div></div><span>' + Math.round(100 * b[0] / b[1]) + '%</span></div>';
    });
    h += '<p class="field__note">This is a practice score: the share of these questions you got right. Microsoft reports a scaled score where 700 passes, which is not the same as 70% correct, and no practice score predicts an exam result.</p></div>';
    var wk = Object.keys(last.wrongObjs).map(function (k) { var p = k.split(':'); return { m: byId(p[0]), obj: +p[1], n: last.wrongObjs[k] }; })
      .filter(function (x) { return x.m; })
      .sort(function (a, b) { return dom(b.m.domain).mid - dom(a.m.domain).mid || b.n - a.n; });
    h += '<div class="ready"><section class="ready__block"><h2>Objectives to revisit</h2>' + (wk.length ? wk.map(function (x) {
      return '<a class="ready__row" href="#/m/' + x.m.id + '" data-weight="high"><span class="drill__id">' + x.m.id + '</span><span class="plan__body"><span class="plan__title">' +
        (x.obj >= 0 ? x.m.objectives[x.obj] : x.m.title) + '</span><span class="plan__est">' + dom(x.m.domain).name + '</span></span><span class="chip">missed &times;' + x.n + '</span></a>';
    }).join('') : '<div class="empty"><strong>Nothing to revisit.</strong> Every part of every question was right.</div>') + '</section></div>';
    h += '<div class="xs__btns">' + (missed ? '<button class="btn" type="button" data-act="xstart" data-mode="missed">Retry the ' + missed + ' missed</button>' : '') +
      '<button class="btn" type="button" data-act="xstart" data-mode="full">New full exam</button><button class="btn" type="button" data-go="exam">Exam home</button></div>' +
      '<label class="xs__timed"><input type="checkbox" id="xonlywrong"> Show only questions that were not fully correct</label>';
    var caseShown = {};
    h += '<div class="xr" id="xr">' + last.ids.map(function (id, i) {
      var q = XQ[id]; if (!q) return '';
      var s = last.scores[id], st = s === 1 ? 'right' : s === 0 ? 'wrong' : 'partial', m = byId(q.mod), pre = '';
      if (q.case && !caseShown[q.case]) { caseShown[q.case] = true; pre = '<details class="xcase"><summary>' + CASES[q.case].title + '</summary><div class="xcase__body">' + CASES[q.case].html + '</div></details>'; }
      return pre + '<article class="xq xr__q" data-ok="' + (s === 1) + '" data-result="' + st + '"><p class="xq__meta"><span class="xr__chip" data-result="' + st + '">' +
        (st === 'right' ? 'Correct' : st === 'wrong' ? 'Incorrect' : 'Partly correct, ' + Math.round(s * 100) + '%') + '</span> Question ' + (i + 1) + ' &middot; ' + TYPE_NAME[q.type] + (q.case ? ' &middot; Case study' : '') + '</p>' +
        '<div class="xq__stem"><p>' + q.stem + '</p></div>' + answerUI(q, last.answers[id], true) +
        xExplain(q) + '<p class="xr__study">Study: <a href="#/m/' + q.mod + '">' + q.mod + ' ' + m.short + '</a>' +
        xObjs(q).map(function (oid) { return ' &middot; ' + objLink(oid, true); }).join('') + '</p></article>';
    }).join('') + '</div>';
    $('#content').innerHTML = h;
  }

