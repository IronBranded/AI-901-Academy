
  /* ================================================================
     Exam modules, labs, concept pages, glossary, cost planner
     ================================================================ */
  function modCrumbs(m, lab) {
    if (m.domain === '00') return crumbs([['AI-901', '#/dash'], ['Lab environment', ''], [lab ? 'Lab' : 'Module', '']]);
    var D = dom(m.domain), g = GROUPS_BY[objsOfMod(m.id)[0].g];
    return crumbs([['AI-901', '#/dash'], [D.name, '#/obj#d-' + m.domain], [g.id + ' ' + g.title, '#/obj#g-' + g.id.replace('.', '-')], [lab ? 'Lab ' + m.id : m.id + ' ' + m.short, lab ? '' : '']]);
  }
  function modStrip(m) {
    var k = 'm:' + m.id, q = checkPct(k);
    return '<div class="progress-strip" id="strip"><span>' + (state.studied[k] ? 'Studied' : 'Not studied') + ' &middot; Lab ' + labDone(m) + '/' + labTotal(m) + ' &middot; Check ' + (q === null ? 'not taken' : q + '%') + '</span>' +
      '<button class="btn" data-act="study" data-key="' + k + '" aria-pressed="' + !!state.studied[k] + '">' + (state.studied[k] ? 'Studied &#10003;' : 'Mark as studied') + '</button>' +
      bmButton('p:' + k, 'Module ' + m.id + ' ' + m.title, '#/m/' + m.id) +
      '<button class="btn" data-act="review" aria-pressed="' + state.review + '">Review pass</button>' +
      '<button class="btn" data-variant="danger" data-act="reset">Reset this page</button></div>' +
      '<p class="review-note field__note">Review pass is on: explanation is folded; objectives, exam lens, scenario clues and the knowledge check stay open.</p>';
  }
  function objectivesBlock(m) {
    var os = objsOfMod(m.id);
    if (!os.length) return '';
    var found = [], cmps = [];
    os.forEach(function (o) { o.found.forEach(function (f) { if (found.indexOf(f) === -1) found.push(f); }); o.cmp.forEach(function (c) { if (cmps.indexOf(c) === -1) cmps.push(c); }); });
    found.sort();
    return S('objectives', 'Objectives covered', '<ul class="objlist">' + os.map(function (o) {
      var st = objStatus(o.id);
      return '<li class="objlist__i"><span class="objlist__t">' + objLink(o.id) + ' ' + o.text + '</span>' + objChips(st) + '</li>';
    }).join('') + '</ul>' +
      '<p class="prepare"><strong>New to this?</strong> Start with ' + found.map(function (f) { return '<a href="#/f/' + f + '">' + f + ' ' + fById(f).short + '</a>' + (state.studied['f:' + f] ? ' &#10003;' : ''); }).join(', ') +
      (learnFor(m.id).length ? '; then ' + learnFor(m.id).map(function (L) { return '<a href="#/learn/' + L.id + '">' + L.id + ' ' + L.short + '</a>' + (state.studied['l:' + L.id] ? ' &#10003;' : ''); }).join(', ') : '') + '.</p>' +
      (cmps.length ? '<p class="prepare"><strong>Comparisons for these objectives:</strong> ' + cmps.map(function (c) { return '<a href="#/compare/' + c + '">' + CMP_BY[c].title + '</a>'; }).join(' &middot; ') + '</p>' : '')) +
      lensBox(os.map(function (o) { return o.id; }));
  }
  /* Problem first: the situation, the idea in plain English and the
     input -> capability -> output model, before any product terminology. */
  function opener(m) {
    var o = m.intro;
    if (!o) return '';
    return S2('problem', 'The problem', '<p>' + o.problem + '</p>') +
      S2('plain', 'In plain English', o.plain) +
      S2('model', 'Mental model', vIPO(o.ipo, o.cap));
  }
  function beyond(m) {
    return '<details class="beyond"><summary>Beyond the exam: how this shows up in a security investigation</summary><p>' + m.tactical + '</p><p class="field__note">Context for practitioners. AI security engineering and KQL are not in the AI-901 skills outline.</p></details>';
  }
  function renderModule(m) {
    var D = dom(m.domain);
    var html = modCrumbs(m) + '<h1><span class="h1__id">' + m.id + '</span> ' + m.title + '</h1>' + modStrip(m) +
      (m.domain === '00' ? Q('note', '<strong>Not an exam objective.</strong> The environment every Foundry lab reuses. Read it before your first lab; the resource-versus-project idea and Microsoft Entra ID authentication come up inside Domain 2 questions.') :
        Q('note', '<strong>Objective group:</strong> ' + m.group + '<br><strong>Domain:</strong> ' + D.name + ' (' + D.weight + ')')) +
      opener(m) + objectivesBlock(m) + m.body() + beyond(m) +
      '<p><a href="#/lab/' + m.id + '">Go to lab ' + m.id + ' &rarr;</a></p>';
    var c = $('#content');
    c.innerHTML = html;
    var src = $('.shape[data-shape="sources"]', c), wrap = document.createElement('div');
    wrap.innerHTML = m.quiz.length ? checkBlock('m:' + m.id) : '';
    if (wrap.firstChild) { if (src) src.parentNode.insertBefore(wrap.firstChild, src); else c.appendChild(wrap.firstChild); }
    (FIGURES[m.id] || []).forEach(function (f, i) {
      var sec = $('.shape[data-shape="' + f.shape + '"]', c);
      if (!sec) return;
      var w = document.createElement('div'); w.innerHTML = f.html;
      var el = w.firstElementChild; el.id = 'fig-' + m.id + '-' + i;
      if (f.at === 'start') { var h2 = $('h2', sec); sec.insertBefore(el, h2.nextSibling); }
      else if (f.at && f.at.indexOf('afterH3:') === 0) {
        var want = f.at.slice(8), h3 = $$('h3', sec).filter(function (x) { return x.textContent === want; })[0];
        if (!h3) { sec.appendChild(el); return; }
        var nx = h3.nextElementSibling, ref = nx && nx.classList.contains('table-scroll') ? nx : h3;
        ref.parentNode.insertBefore(el, ref.nextSibling);
      } else sec.appendChild(el);
    });
    if (typeof initWidgets === 'function') initWidgets(c);
  }

  function renderLab(m) {
    var s = state.steps[m.id] || {};
    var html = modCrumbs(m, true) + '<h1>Lab ' + m.id + ': ' + m.title + '</h1>' +
      '<div class="progress-strip" id="strip"><span id="stripText">' + labDone(m) + ' of ' + labTotal(m) + ' steps</span>' +
      '<div class="bar"><span class="bar__fill" id="stripBar" style="width:' + pct(labDone(m) / labTotal(m)) + '%"></span></div>' +
      '<button class="btn" data-variant="danger" data-act="reset">Reset this page</button></div>' +
      '<p class="lede">' + m.lab.intro + '</p>' +
      (m.cost.level === 'mid' || m.cost.level === 'high' ? Q('warn', '<strong>Cost warning.</strong> ' + m.cost.est) : Q('note', '<strong>Cost:</strong> ' + m.cost.est)) +
      (m.verified ? '' : Q('warn', '<strong>Not yet verified.</strong> This lab was written from product documentation and has not been run against a Microsoft exercise. Check commands and model names against Microsoft Learn before relying on them.')) +
      Q('note', '<strong>Ticking a step is not proof.</strong> Each lab ends with a validation step: confirm the result you expected actually happened before you tick it.');
    var pre = m.prereq.length ? '<ul>' + m.prereq.map(function (id) { var p = byId(id); return '<li><a href="#/lab/' + id + '">' + id + ' ' + p.short + '</a>' + (labComplete(p) ? ' &#10003;' : '') + '</li>'; }).join('') + '</ul>' : '<p>None.</p>';
    html += S('prereq', 'Prerequisites', pre);
    html += S('steps', 'Steps', '<ol class="steps">' + m.lab.steps.map(function (st, i) {
      var k = 's' + i;
      return '<li data-done="' + !!s[k] + '"><label class="step__tick"><input type="checkbox" data-step="' + k + '"' + (s[k] ? ' checked' : '') + ' aria-label="Step ' + (i + 1) + ' done"></label><div class="step__body">' + st + '</div></li>';
    }).join('') + '</ol>');
    var td = '<p><strong>Mandatory.</strong> Tick each item as you do it; unticked items keep this lab out of Practiced.</p>';
    m.lab.teardown.forEach(function (b, bi) {
      td += '<h3 class="bucket" data-bucket="' + b.bucket + '">' + b.title + '</h3><ul>';
      b.items.forEach(function (it, i) {
        var k = 't' + bi + '-' + i;
        td += '<li class="task-list-item" data-done="' + !!s[k] + '"><label><input type="checkbox" data-step="' + k + '"' + (s[k] ? ' checked' : '') + '> ' + it + '</label></li>';
      });
      td += '</ul>';
    });
    html += S('teardown', 'Teardown', td);
    html += '<p><a href="#/m/' + m.id + '">&larr; Back to module ' + m.id + '</a></p>';
    $('#content').innerHTML = html;
  }

  /* ---------------- concept pages (Learn) ---------------- */
  function tId(term) { return 't-' + term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function termCount(L) { return L.units.reduce(function (n, u) { return n + u.terms.length; }, 0); }
  function learnObjs(L) { var out = []; L.mods.forEach(function (m) { objsOfMod(m).forEach(function (o) { if (out.indexOf(o.id) === -1) out.push(o.id); }); }); return out; }
  var GLOSS = (function () {
    var seen = {}, out = [];
    LEARN.forEach(function (L) {
      L.units.forEach(function (u, ui) {
        u.terms.forEach(function (t) {
          var k = t[0].toLowerCase(); if (seen[k]) return; seen[k] = true;
          out.push({ term: t[0], def: t[1], href: '#/learn/' + L.id, src: L.id + ' ' + L.short, anchor: tId(t[0]) });
        });
      });
    });
    FOUND.forEach(function (f) {
      f.words.forEach(function (w) {
        var k = w[0].toLowerCase(); if (seen[k]) return; seen[k] = true;
        out.push({ term: w[0], def: w[1], href: '#/f/' + f.id, src: f.id + ' ' + f.short, anchor: null });
      });
    });
    return out.sort(function (a, b) { return a.term.toLowerCase().localeCompare(b.term.toLowerCase()); });
  })();
  function termsHTML(terms) {
    return '<div class="terms"><div class="terms__lbl">Key terms</div><dl>' + terms.map(function (t) {
      return '<div class="term" id="' + tId(t[0]) + '"><dt>' + t[0] + '</dt><dd>' + t[1] + '</dd></div>';
    }).join('') + '</dl></div>';
  }
  function renderLearnIndex() {
    var read = LEARN.filter(function (L) { return state.studied['l:' + L.id]; }).length;
    var h = crumbs([['AI-901', '#/dash'], ['Concepts', '']]) + '<h1>Concepts</h1><p class="lede">Eight pages that follow Microsoft\'s two AI-901 learning paths, with a diagram on every unit. If a page assumes something you have not met, the Module 0 lesson linked at the top covers it.</p>' +
      '<div class="progress-strip"><span>' + read + ' of ' + LEARN.length + ' pages studied &middot; ' + GLOSS.length + ' terms in the <a href="#/glossary">glossary</a></span><div class="bar"><span class="bar__fill" style="width:' + pct(read / LEARN.length) + '%"></span></div></div>' +
      vFlow([
        { t: 'Module 0', s: 'plain-English foundations', k: 'ok' },
        { t: 'Concept page', s: 'Microsoft\'s terms, explained', k: 'acc' },
        { t: 'Exam module', s: 'objective depth', k: 'd2' },
        { t: 'Lab', s: 'do it in Foundry', k: 'd2' },
        { t: 'Check and review', s: 'per objective', k: 'd1' }
      ], 'The study order the Academy is built around.') +
      '<div class="lcards">' + LEARN.map(function (L) {
        return '<a class="lcard" href="#/learn/' + L.id + '" data-read="' + !!state.studied['l:' + L.id] + '"><span class="lcard__id">' + L.id + '</span><strong>' + L.title + '</strong><span class="lcard__s">' + L.summary + '</span>' +
          '<span class="lcard__m">' + L.units.length + ' units, ' + termCount(L) + ' terms. Objectives ' + learnObjs(L).join(', ') + (state.studied['l:' + L.id] ? '. <b>Studied</b>' : '') + '</span></a>';
      }).join('') + '</div>';
    $('#content').innerHTML = h;
  }
  function renderLearn(L) {
    var idx = LEARN.indexOf(L), prev = LEARN[idx - 1], next = LEARN[idx + 1], n = L.units.length, k = 'l:' + L.id;
    var found = []; learnObjs(L).forEach(function (o) { objById(o).found.forEach(function (f) { if (found.indexOf(f) === -1) found.push(f); }); }); found.sort();
    var h = crumbs([['AI-901', '#/dash'], ['Concepts', '#/learn'], [L.id + ' ' + L.short, '']]) + '<h1><span class="h1__id">' + L.id + '</span> ' + L.title + '</h1>' +
      '<div class="progress-strip"><span>' + n + ' units &middot; ' + termCount(L) + ' key terms</span>' +
      '<button class="btn" data-act="study" data-key="' + k + '" aria-pressed="' + !!state.studied[k] + '">' + (state.studied[k] ? 'Studied &#10003;' : 'Mark as studied') + '</button>' +
      bmButton('p:' + k, 'Concept page ' + L.id + ' ' + L.title, '#/learn/' + L.id) +
      '<button class="btn" data-act="lflip" aria-pressed="false">Quiz me on the terms</button></div>' +
      '<p class="lede">' + L.summary + '</p>' +
      Q('note', '<strong>New to this?</strong> Plain-English foundations: ' + found.map(function (f) { return '<a href="#/f/' + f + '">' + f + ' ' + fById(f).short + '</a>'; }).join(', ') + '.' +
        '<br><strong>Microsoft Learn:</strong> ' + L.ms.map(function (x) { return '<a href="' + x.u + '" target="_blank" rel="noopener">' + x.t + '</a>'; }).join(' &middot; ') +
        '<br><strong>Objectives:</strong> ' + learnObjs(L).map(function (o) { return objLink(o); }).join(', ') +
        '<br><strong>Exam modules:</strong> ' + L.mods.map(function (id) { return '<a href="#/m/' + id + '">' + id + ' ' + byId(id).short + '</a>'; }).join(' &middot; '));
    L.units.forEach(function (u, i) {
      h += '<section class="shape learn-unit" data-shape="unit" id="u-' + L.id + '-' + i + '"><h2 data-shape="unit" data-label="Unit ' + (i + 1) + ' of ' + n + '">' + u.t + '</h2>' + u.body + (u.vis || '') + termsHTML(u.terms) + '</section>';
    });
    h += '<div class="lnav">' + (prev ? '<a class="btn" href="#/learn/' + prev.id + '">&larr; ' + prev.title + '</a>' : '<a class="btn" href="#/f">&larr; Module 0</a>') +
      '<span class="lnav__mods">' + L.mods.map(function (id) { return '<a class="btn" href="#/m/' + id + '">Module ' + id + ' &rarr;</a>'; }).join('') + '</span>' +
      (next ? '<a class="btn" href="#/learn/' + next.id + '">' + next.title + ' &rarr;</a>' : '<a class="btn" href="#/glossary">Glossary &rarr;</a>') + '</div>';
    $('#content').innerHTML = h;
    if (typeof initWidgets === 'function') initWidgets($('#content'));
  }

  function renderGlossary() {
    var h = crumbs([['AI-901', '#/dash'], ['Glossary', '']]) + '<h1>Glossary</h1><p class="lede">' + GLOSS.length + ' terms, alphabetically. Each links to the page that explains it. Terms first met in Module 0 carry their beginner definition.</p>' +
      '<div class="gl__bar"><label class="vh" for="glq">Filter terms</label><input class="gl__q" id="glq" type="search" placeholder="Filter terms and definitions" autocomplete="off">' +
      '<label class="xs__timed"><input type="checkbox" id="glflash"> Flashcards: hide definitions until opened</label></div><div class="gl" id="gl">';
    var letter = '';
    GLOSS.forEach(function (g) {
      var L0 = g.term.charAt(0).toUpperCase();
      if (/[A-Z]/.test(L0) && L0 !== letter) { letter = L0; h += '<h2 class="gl__letter" data-letter="' + letter + '">' + letter + '</h2>'; }
      h += '<details class="gl__t" open data-text="' + escH((g.term + ' ' + g.def).toLowerCase()) + '"><summary><strong>' + g.term + '</strong><span class="gl__src">' + g.src + '</span></summary>' +
        '<p>' + g.def + ' <a href="' + g.href + '"' + (g.anchor ? ' data-term="' + g.anchor + '"' : '') + '>See it explained &rarr;</a></p></details>';
    });
    $('#content').innerHTML = h + '</div>';
  }
  function filterGlossary() {
    var q = ($('#glq').value || '').toLowerCase().trim();
    $$('#gl .gl__t').forEach(function (d) { d.hidden = !!q && d.dataset.text.indexOf(q) === -1; });
    $$('#gl .gl__letter').forEach(function (hd) {
      var el = hd.nextElementSibling, any = false;
      while (el && !el.classList.contains('gl__letter')) { if (!el.hidden) any = true; el = el.nextElementSibling; }
      hd.hidden = !any;
    });
  }

  /* ---------------- cost planner (unchanged in substance) ---------------- */
  function renderCost() {
    var groups = [
      { level: 'mid', label: 'Medium', note: 'Consumption plus one standing meter. Delete what the teardown lists in the same session.' },
      { level: 'low', label: 'Low', note: 'Per-token or per-call only. Nothing bills while idle.' },
      { level: 'none', label: 'No Azure cost', note: 'No billable resource, or no Azure at all.' }
    ];
    var h = crumbs([['AI-901', '#/dash'], ['Cost planner', '']]) + '<h1>Cost planner</h1><p class="lede">Every lab, ordered by what it will cost you to run. Pay-as-you-go has no spending cap, so this is a planning aid, not a guarantee. Prices are not quoted: check the Azure pricing pages for your region.</p>' +
      '<p>No lab deploys anything that bills by the hour. The risk is elsewhere: standing storage you forget, options you should read about and not select, and keys someone else uses on your bill. Module 0 explorations cost nothing; they run in your browser.</p><div class="plan">';
    groups.forEach(function (g) {
      var list = MODULES.filter(function (m) { return m.cost.level === g.level; });
      if (!list.length) return;
      h += '<section class="plan__group"><div class="plan__head">' + costChip(g.level, g.label) + '<span class="plan__note">' + g.note + '</span><span class="plan__count">' + list.length + ' lab' + (list.length > 1 ? 's' : '') + '</span></div>';
      list.forEach(function (m) {
        h += '<a class="plan__row" href="#/lab/' + m.id + '"><span class="drill__id">' + m.id + '</span><span class="plan__body"><span class="plan__title">' + m.title + '</span><span class="plan__est">' + m.cost.est + '</span></span>' + (m.cost.level === 'mid' ? '<span class="plan__meter">' + m.cost.meter + '</span>' : '') + '</a>';
      });
      h += '</section>';
    });
    h += '<section class="plan__group"><div class="plan__head">' + costChip('max', 'Traps') + '<span class="plan__note">Not used by any lab. Each one can run up charges while you are not watching.</span><span class="plan__count">4</span></div>' +
      '<div class="plan__row"><span class="drill__id">01-02</span><span class="plan__body"><span class="plan__title">Provisioned throughput deployments</span><span class="plan__est">Reserved capacity billed whether or not you send a request. The one option in the deployment dialog to leave alone.</span></span><span class="plan__meter">reserved capacity</span></div>' +
      '<div class="plan__row"><span class="drill__id">02-02</span><span class="plan__body"><span class="plan__title">Azure AI Search above the Free tier</span><span class="plan__est">Foundry IQ knowledge is built on Azure AI Search; paid tiers bill from creation.</span></span><span class="plan__meter">search units</span></div>' +
      '<div class="plan__row"><span class="drill__id">02-02</span><span class="plan__body"><span class="plan__title">Forgotten vector stores</span><span class="plan__est">File search storage bills for as long as the store exists, long after the lab.</span></span><span class="plan__meter">storage</span></div>' +
      '<div class="plan__row"><span class="drill__id">ENV</span><span class="plan__body"><span class="plan__title">A leaked resource key</span><span class="plan__est">Someone else\'s tokens on your bill, up to the deployment\'s rate limit. Keep capacity low and regenerate keys after 02-03.</span></span><span class="plan__meter">per token, not yours</span></div></section>';
    var z = MODULES.filter(function (m) { return m.cost.level === 'none'; }).length;
    h += '</div><p class="field__note">' + MODULES.length + ' labs, of which ' + z + ' cost nothing in Azure. The traps are the only line items that can grow without you.</p>';
    $('#content').innerHTML = h;
  }
