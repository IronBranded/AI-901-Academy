/* explore.js - the hands-on explorations used by Module 0 lessons.

   Every exploration follows Understand > Try > Observe > Change > Compare > Explain.
   Each one runs entirely in the browser. Where a widget runs a real algorithm it
   says so (k-nearest neighbours, a bigram language model, a convolution filter,
   statistical text analysis). Where it shows fixed, illustrative output it says
   that too. None of them call Azure.

   API: Explore.mount(root, onDone)
     Finds [data-widget] elements under root and initialises them. When the
     learner has done enough to have actually observed the behaviour, the widget
     calls onDone(lessonId) once; the app records the lesson as Practiced. */

(function (global) {
  'use strict';

  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var uid = 0; function nid(p) { uid += 1; return (p || 'x') + '-' + uid; }

  function doneOnce(el, onDone) {
    var fired = false;
    return function () {
      if (fired) return; fired = true;
      var badge = el.querySelector('.ex__done');
      if (badge) { badge.hidden = false; }
      if (onDone) onDone(el.dataset.lesson || null);
    };
  }
  function frame(title, body) {
    return '<div class="ex__frame">' + (title ? '<p class="ex__title">' + title + '</p>' : '') + body +
      '<p class="ex__done" role="status" hidden>&#10003; Exploration complete. Recorded as practiced.</p></div>';
  }

  /* ------------------------------------------------------------------ sorter */
  function sorter(el, done) {
    var set = SORTS[el.dataset.set]; if (!set) return;
    var first = {}, answered = {};
    var h = '<p class="ex__score" aria-live="polite"></p><ol class="sort">';
    set.items.forEach(function (it, i) {
      var name = nid('s');
      h += '<li class="sort__item" data-i="' + i + '"><fieldset><legend>' + it.t + '</legend><div class="sort__opts">' +
        set.opts.map(function (o, oi) { return '<label class="sort__opt"><input type="radio" name="' + name + '" value="' + oi + '"><span>' + o + '</span></label>'; }).join('') +
        '</div><p class="sort__fb" aria-live="polite"></p></fieldset></li>';
    });
    el.innerHTML = frame('', h + '</ol>');
    var score = el.querySelector('.ex__score');
    function upd() {
      var n = Object.keys(answered).length, r = Object.keys(first).filter(function (k) { return first[k]; }).length;
      score.textContent = n + ' of ' + set.items.length + ' answered. ' + r + ' right first time.';
      if (n === set.items.length) done();
    }
    el.addEventListener('change', function (e) {
      var inp = e.target; if (inp.type !== 'radio') return;
      var li = inp.closest('.sort__item'), i = +li.dataset.i, it = set.items[i], ok = +inp.value === it.a;
      if (!(i in first)) first[i] = ok;
      answered[i] = true;
      li.dataset.ok = String(ok);
      li.querySelector('.sort__fb').innerHTML = (ok ? '<strong>Right.</strong> ' : '<strong>Not quite - it is ' + set.opts[it.a] + '.</strong> ') + it.why;
      upd();
    });
    upd();
  }

  /* -------------------------------------------------------------- rulesmodel */
  var RULES = [
    { t: 'Subject contains "free"', f: function (s) { return /\bfree\b/i.test(s); } },
    { t: 'Subject contains "winner"', f: function (s) { return /\bwinner\b/i.test(s); } },
    { t: 'Subject contains "$$$"', f: function (s) { return s.indexOf('$$$') !== -1; } }
  ];
  var WEIGHTS = { claim: 1.6, prize: 1.8, free: 0.9, fr3e: 1.5, winner: 1.3, urgent: 1.0, click: 1.1, offer: 0.8, money: 0.9, cash: 1.1, guaranteed: 1.2, act: 0.6, now: 0.5, congratulations: 1.2,
    lunch: -1.4, team: -1.2, friday: -0.6, meeting: -1.5, project: -1.0, thanks: -0.8, agenda: -1.3, invoice: -0.4, report: -0.9, notes: -0.8, tomorrow: -0.5 };
  var BIAS = -1.2;
  function rulesmodel(el, done) {
    var samples = ['Claim your FR3E prize now', 'Free lunch with the team on Friday', 'URGENT: click to claim guaranteed cash', 'Agenda and notes for tomorrow\'s project meeting'];
    var tried = {};
    el.innerHTML = frame('', '<label class="ex__lbl" for="' + nid('rm') + '">Email subject</label>' +
      '<input class="ex__in rm__in" id="rm-' + uid + '" type="text" value="' + esc(samples[0]) + '">' +
      '<div class="ex__chips">' + samples.map(function (s) { return '<button type="button" class="chipbtn" data-s="' + esc(s) + '">' + esc(s) + '</button>'; }).join('') + '</div>' +
      '<div class="rm__cols"><section class="rm__col"><h4>Hand-written rules</h4><ul class="rm__rules"></ul><p class="rm__verdict" aria-live="polite"></p></section>' +
      '<section class="rm__col"><h4>Learned word weights <small>(hand-set for this demo)</small></h4><div class="rm__bars"></div><p class="rm__verdict2" aria-live="polite"></p></section></div>');
    el.querySelector('.ex__lbl').setAttribute('for', 'rm-' + uid);
    var inp = el.querySelector('.rm__in');
    function run() {
      var s = inp.value;
      var hits = RULES.map(function (r) { return r.f(s); });
      el.querySelector('.rm__rules').innerHTML = RULES.map(function (r, i) { return '<li data-hit="' + hits[i] + '">' + (hits[i] ? '&#9679; ' : '&#9675; ') + esc(r.t) + (hits[i] ? ' <strong>matched</strong>' : '') + '</li>'; }).join('');
      var spam = hits.some(Boolean);
      el.querySelector('.rm__verdict').innerHTML = 'Verdict: <strong>' + (spam ? 'Spam' : 'Not spam') + '</strong>. Same input, same answer, every time.';
      var words = s.toLowerCase().match(/[a-z0-9$]+/g) || [], z = BIAS, contrib = [];
      words.forEach(function (w) { if (WEIGHTS[w] !== undefined) { z += WEIGHTS[w]; contrib.push([w, WEIGHTS[w]]); } });
      var p = 1 / (1 + Math.exp(-z));
      el.querySelector('.rm__bars').innerHTML = (contrib.length ? contrib.map(function (c) {
        var pos = c[1] > 0;
        return '<div class="rm__bar"><span>' + esc(c[0]) + '</span><span class="rm__track"><span class="rm__fill" data-pos="' + pos + '" style="width:' + Math.min(100, Math.abs(c[1]) * 45) + '%"></span></span><span>' + (pos ? '+' : '') + c[1].toFixed(1) + '</span></div>';
      }).join('') : '<p class="field__note">No weighted words found; only the starting bias applies.</p>');
      el.querySelector('.rm__verdict2').innerHTML = 'Spam probability: <strong>' + Math.round(p * 100) + '%</strong> &rarr; ' + (p >= 0.5 ? 'Spam' : 'Not spam') + '. The decision is a weighted sum, not a readable rule.';
      tried[s.trim().toLowerCase()] = true;
      if (Object.keys(tried).length >= 3) done();
    }
    inp.addEventListener('input', run);
    el.addEventListener('click', function (e) { var b = e.target.closest('[data-s]'); if (b) { inp.value = b.dataset.s; run(); } });
    run();
  }

  /* --------------------------------------------------------------------- knn */
  function knn(el, done) {
    var pts = [[150, 8.2, 'apple'], [170, 7.5, 'apple'], [135, 8.8, 'apple'], [190, 6.9, 'apple'], [160, 7.9, 'apple'], [180, 7.2, 'apple'],
      [210, 4.2, 'orange'], [230, 3.8, 'orange'], [190, 4.6, 'orange'], [250, 3.5, 'orange'], [220, 4.9, 'orange'], [200, 3.9, 'orange']];
    var test = [195, 5.8], mode = 'test', moves = 0, added = 0;
    var W = 520, H = 300, x0 = 50, y0 = 260, xs = (W - 70) / 200, ys = (y0 - 20) / 10; // weight 100..300, redness 0..10
    function px(w) { return x0 + (w - 100) * xs; } function py(r) { return y0 - r * ys; }
    function wx(x) { return Math.max(100, Math.min(300, 100 + (x - x0) / xs)); } function ry(y) { return Math.max(0, Math.min(10, (y0 - y) / ys)); }
    el.innerHTML = frame('', '<div class="knn__ctl" role="radiogroup" aria-label="What a click on the chart does">' +
      ['test|Move the test point', 'apple|Add an apple example', 'orange|Add an orange example'].map(function (m, i) { var p = m.split('|'); return '<label><input type="radio" name="knnm-' + uid + '" value="' + p[0] + '"' + (i ? '' : ' checked') + '> ' + p[1] + '</label>'; }).join('') + '</div>' +
      '<svg class="knn__svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Scatter chart of fruit examples by weight and redness, with a test point"></svg>' +
      '<div class="knn__keys"><label>Test weight (g) <input type="number" min="100" max="300" step="5" class="knn__w"></label><label>Test redness (0-10) <input type="number" min="0" max="10" step="0.1" class="knn__r"></label>' +
      '<button type="button" class="btn" data-add="apple">Add apple here</button><button type="button" class="btn" data-add="orange">Add orange here</button><button type="button" class="btn" data-reset>Reset data</button></div>' +
      '<p class="knn__out" aria-live="polite"></p>');
    var svg = el.querySelector('svg'), out = el.querySelector('.knn__out'), iw = el.querySelector('.knn__w'), ir = el.querySelector('.knn__r');
    var orig = pts.slice();
    function predict() {
      var d = pts.map(function (p) { var dx = (p[0] - test[0]) / 20, dy = p[1] - test[1]; return [Math.sqrt(dx * dx + dy * dy), p[2]]; }).sort(function (a, b) { return a[0] - b[0]; }).slice(0, 3);
      var a = d.filter(function (x) { return x[1] === 'apple'; }).length;
      var lab = a >= 2 ? 'apple' : 'orange', conf = Math.max(a, 3 - a) / 3;
      return { lab: lab, conf: conf, near: d, far: d[0][0] > 3 };
    }
    function draw() {
      var s = '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (W - 15) + '" y2="' + y0 + '" class="knn__ax"/><line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="15" class="knn__ax"/>' +
        '<text x="' + (W / 2) + '" y="' + (H - 8) + '" class="knn__t" text-anchor="middle">Weight (g), 100 to 300</text><text x="14" y="' + (H / 2) + '" class="knn__t" transform="rotate(-90 14 ' + (H / 2) + ')" text-anchor="middle">Redness 0 to 10</text>';
      var pr = predict();
      pr.near.forEach(function () {});
      pts.forEach(function (p) {
        var c = p[2] === 'apple' ? 'knn__a' : 'knn__o';
        s += p[2] === 'apple' ? '<circle cx="' + px(p[0]) + '" cy="' + py(p[1]) + '" r="7" class="' + c + '"/>' : '<rect x="' + (px(p[0]) - 6) + '" y="' + (py(p[1]) - 6) + '" width="12" height="12" class="' + c + '"/>';
      });
      s += '<circle cx="' + px(test[0]) + '" cy="' + py(test[1]) + '" r="10" class="knn__test"/><text x="' + (px(test[0]) + 14) + '" y="' + (py(test[1]) + 4) + '" class="knn__t">test</text>';
      s += '<g class="knn__legend"><circle cx="' + (W - 120) + '" cy="22" r="6" class="knn__a"/><text x="' + (W - 108) + '" y="26" class="knn__t">apple (circle)</text><rect x="' + (W - 126) + '" y="36" width="12" height="12" class="knn__o"/><text x="' + (W - 108) + '" y="46" class="knn__t">orange (square)</text></g>';
      svg.innerHTML = s;
      iw.value = Math.round(test[0]); ir.value = test[1].toFixed(1);
      out.innerHTML = 'Training examples: <strong>' + pts.length + '</strong>. Prediction for the test point (' + Math.round(test[0]) + ' g, redness ' + test[1].toFixed(1) + '): <strong>' + pr.lab + '</strong>, confidence ' + Math.round(pr.conf * 100) + '% (' + Math.round(pr.conf * 3) + ' of the 3 nearest examples agree).' +
        (pr.far ? ' <em>The nearest example is far away: the model still answers, but it has little evidence.</em>' : '');
      if (moves >= 2 && added >= 1) done();
    }
    svg.addEventListener('click', function (e) {
      var r = svg.getBoundingClientRect(), x = (e.clientX - r.left) * W / r.width, y = (e.clientY - r.top) * H / r.height;
      var pt = [wx(x), ry(y)];
      if (mode === 'test') { test = pt; moves++; } else { pts.push([pt[0], pt[1], mode]); added++; }
      draw();
    });
    el.addEventListener('change', function (e) {
      if (e.target.name && e.target.name.indexOf('knnm') === 0) mode = e.target.value;
      if (e.target === iw || e.target === ir) { test = [Math.max(100, Math.min(300, +iw.value || 200)), Math.max(0, Math.min(10, +ir.value || 0))]; moves++; draw(); }
    });
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-add]'); if (b) { pts.push([test[0], test[1], b.dataset.add]); added++; draw(); }
      if (e.target.closest('[data-reset]')) { pts = orig.slice(); draw(); }
    });
    draw();
  }

  /* ----------------------------------------------------------------- textlab */
  var STOP = {
    en: 'the a an and or but of to in on at for with is are was were be been it this that i you he she we they my your our their me us them as by from not no so if then than too very can will just do does did have has had all any about into over after before again also only same such there here what which who when where why how up down out off more most other some own each few both'.split(' '),
    fr: 'le la les un une des et ou mais de du au aux en dans sur pour par avec est sont etait je tu il elle nous vous ils elles ne pas que qui ce cette ces mon ma mes son sa ses leur leurs tres plus'.split(' '),
    es: 'el la los las un una unos unas y o pero de del al en con por para es son fue yo tu el ella nosotros ellos no que quien este esta estos mi mis su sus muy mas'.split(' ')
  };
  var POS = 'good great excellent love loved amazing happy perfect fast helpful easy recommend best nice wonderful pleased fantastic comfortable reliable'.split(' ');
  var NEG = 'bad terrible awful hate hated slow broken broke disappointed disappointing poor worst late died useless problem problems refund rude angry never cold noisy'.split(' ');
  var SAMPLES = {
    review: 'Ordered the Contoso X2 headphones on 3 May. Delivery to Montreal took two weeks and the battery died in a day. Very disappointed. Support at help@contoso.com never replied. Call me on 514-555-0199 if you want details.',
    sarcasm: 'Oh great, the battery broke again. I just love charging my headphones three times a day. Best purchase ever.',
    french: 'La livraison a Montreal etait tres lente et la batterie ne tient pas une journee. Je suis tres decu du service.',
    article: 'Cloud computing provides on-demand access to computing resources. Computing resources include servers, storage, and networking. Azure is Microsoft\'s cloud computing platform. Organizations use cloud platforms to reduce infrastructure costs. Cloud computing enables scalability and flexibility.'
  };
  function tokens(t) { return (t.toLowerCase().match(/[a-zà-ÿ0-9']+/g) || []); }
  function textlab(el, done) {
    var runs = {};
    el.innerHTML = frame('', '<label class="ex__lbl" for="tl-' + uid + '">Text to analyze</label><textarea id="tl-' + uid + '" class="ex__in tl__in" rows="5"></textarea>' +
      '<div class="ex__chips"><button type="button" class="chipbtn" data-k="review">Product review</button><button type="button" class="chipbtn" data-k="sarcasm">Sarcastic review</button><button type="button" class="chipbtn" data-k="french">French review</button><button type="button" class="chipbtn" data-k="article">Short article</button>' +
      '<button type="button" class="btn" data-run>Analyze</button></div><div class="tl__out" aria-live="polite"></div>');
    var ta = el.querySelector('textarea'), out = el.querySelector('.tl__out');
    ta.value = SAMPLES.review;
    function analyze() {
      var t = ta.value.trim(); if (!t) { out.innerHTML = '<p>Type or paste some text first.</p>'; return; }
      var tk = tokens(t);
      var lang = Object.keys(STOP).map(function (k) { var set = STOP[k]; return [k, tk.filter(function (w) { return set.indexOf(w) !== -1; }).length]; }).sort(function (a, b) { return b[1] - a[1]; });
      var names = { en: 'English', fr: 'French', es: 'Spanish' };
      var stop = STOP[lang[0][0]];
      var pos = tk.filter(function (w) { return POS.indexOf(w) !== -1; }), neg = tk.filter(function (w) { return NEG.indexOf(w) !== -1; });
      var sc = pos.length - neg.length, sent = sc > 0 ? 'positive' : sc < 0 ? 'negative' : 'neutral';
      var freq = {}; tk.forEach(function (w) { if (w.length > 2 && /^[a-zà-ÿ]+$/.test(w) && stop.indexOf(w) === -1 && STOP.en.indexOf(w) === -1) freq[w] = (freq[w] || 0) + 1; });
      var kp = Object.keys(freq).sort(function (a, b) { return freq[b] - freq[a] || a.localeCompare(b); }).slice(0, 6);
      var ents = [];
      (t.match(/\b\d{1,2} (?:January|February|March|April|May|June|July|August|September|October|November|December)\b/g) || []).forEach(function (m) { ents.push([m, 'DateTime']); });
      (t.match(/\b(?:one|two|three|four|five|six|\d+) (?:days?|weeks?|months?|hours?)\b/gi) || []).forEach(function (m) { ents.push([m, 'Duration']); });
      (t.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) || []).forEach(function (m) { ents.push([m, 'Email (PII)']); });
      (t.match(/\b\d{3}-\d{3}-\d{4}\b/g) || []).forEach(function (m) { ents.push([m, 'Phone number (PII)']); });
      (t.match(/(?:[.!?]\s+|^)?\b[A-Z][a-zà-ÿ]+(?:\s[A-Z0-9][\w]*)*/g) || []).forEach(function (m) {
        var w = m.replace(/^[.!?]?\s*/, ''); if (/^(The|I|Oh|Very|La|Je|Support|Call|Ordered|Delivery|Best|Computing|Organizations|Cloud)$/.test(w)) return;
        if (ents.some(function (e) { return e[0].indexOf(w) !== -1; })) return; ents.push([w, 'Proper noun (type unknown)']);
      });
      var red = t.replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '*****').replace(/\b\d{3}-\d{3}-\d{4}\b/g, '************');
      var sents = t.split(/(?<=[.!?])\s+/).filter(function (x) { return x.trim(); });
      var scored = sents.map(function (s, i) { var w = tokens(s); return [i, w.reduce(function (n, x) { return n + (freq[x] || 0); }, 0) / Math.sqrt(w.length || 1)]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, Math.min(2, sents.length)).sort(function (a, b) { return a[0] - b[0]; });
      out.innerHTML = '<dl class="tl__res">' +
        '<div><dt>Language detection</dt><dd><strong>' + (lang[0][1] ? names[lang[0][0]] : 'Unknown') + '</strong> <small>(' + lang.map(function (l) { return names[l[0]] + ' ' + l[1]; }).join(', ') + ' common-word matches)</small></dd></div>' +
        '<div><dt>Sentiment analysis</dt><dd><strong>' + sent + '</strong> <small>(positive words: ' + (pos.join(', ') || 'none') + '; negative words: ' + (neg.join(', ') || 'none') + ')</small></dd></div>' +
        '<div><dt>Key phrase extraction</dt><dd>' + (kp.map(function (k) { return '<span class="tag">' + esc(k) + '</span>'; }).join(' ') || 'none') + ' <small>(most frequent non-common words)</small></dd></div>' +
        '<div><dt>Entity detection</dt><dd>' + (ents.length ? '<ul>' + ents.map(function (e) { return '<li><strong>' + esc(e[0]) + '</strong>: ' + e[1] + '</li>'; }).join('') + '</ul>' : 'none found') + '</dd></div>' +
        '<div><dt>PII redaction</dt><dd>' + esc(red) + '</dd></div>' +
        '<div><dt>Extractive summary</dt><dd>' + esc(scored.map(function (s) { return sents[s[0]].trim(); }).join(' ')) + ' <small>(the sentences with the most frequent terms, copied unchanged)</small></dd></div></dl>' +
        '<p class="field__note">Simple statistical techniques running in your browser. Azure Language uses trained models: it types entities properly, handles sarcasm better and supports many languages.</p>';
      runs[t.slice(0, 40)] = true; if (Object.keys(runs).length >= 2) done();
    }
    el.addEventListener('click', function (e) { var b = e.target.closest('[data-k]'); if (b) { ta.value = SAMPLES[b.dataset.k]; analyze(); } if (e.target.closest('[data-run]')) analyze(); });
    analyze();
  }

  /* ---------------------------------------------------------------- pixellab */
  var VTASKS = {
    classification: { lab: 'Image classification', out: '{ "label": "apple", "confidence": 0.71 }', note: 'One label for the whole image - the most prominent subject. It says nothing about the banana or the orange, or where anything is.' },
    detection: { lab: 'Object detection', out: '[ { "label": "apple",  "box": [40, 70, 90, 90],  "confidence": 0.93 },\n  { "label": "banana", "box": [150, 40, 150, 70], "confidence": 0.88 },\n  { "label": "orange", "box": [320, 75, 85, 85],  "confidence": 0.91 } ]', note: 'Each object with a bounding box (x, y, width, height). You can count items and know where they are.' },
    segmentation: { lab: 'Semantic segmentation', out: 'A mask: every pixel labelled apple, banana, orange or background.', note: 'Exact outlines rather than rectangles - useful for measuring areas or cutting objects out.' },
    description: { lab: 'Image analysis (multimodal)', out: '"An apple, a banana and an orange on a kitchen counter."\nTags: fruit, apple, banana, orange, food, counter', note: 'A multimodal model links what it sees to language and writes a description. The text is generated, so it can be wrong.' }
  };
  function pixellab(el, done) {
    var N = 8, img = [], seen = {}, filtered = false;
    for (var r = 0; r < N; r++) { img.push([]); for (var c = 0; c < N; c++) img[r].push(r >= 2 && r <= 5 && c >= 2 && c <= 5 ? 255 : 0); }
    var K = [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]];
    el.innerHTML = frame('', '<h4 class="ex__h">Part 1: an image is numbers</h4><p class="field__note">Select pixels to switch them between black (0) and white (255). Then apply the filter.</p>' +
      '<div class="px__wrap"><div class="px__grid" role="grid" aria-label="Editable 8 by 8 pixel image"></div><div class="px__side"><button type="button" class="btn" data-f>Apply edge filter</button><button type="button" class="btn" data-clear>Clear</button>' +
      '<p class="field__note">Kernel (Laplace):<br><code>-1 -1 -1<br>-1  8 -1<br>-1 -1 -1</code></p></div><div class="px__fm" aria-live="polite"></div></div>' +
      '<h4 class="ex__h">Part 2: same image, four different questions</h4><div class="vt__tabs" role="tablist" aria-label="Vision task">' +
      Object.keys(VTASKS).map(function (k, i) { return '<button type="button" role="tab" class="vt__tab" data-t="' + k + '" aria-selected="' + (i === 0) + '">' + VTASKS[k].lab + '</button>'; }).join('') + '</div>' +
      '<div class="vt__panel" role="tabpanel"><svg class="vt__svg" viewBox="0 0 440 200" role="img" aria-label="A kitchen counter with an apple, a banana and an orange"></svg><pre class="vt__out"></pre><p class="vt__note"></p></div>' +
      '<p class="field__note">Part 2 shows fixed, illustrative outputs, not a live model.</p>');
    var grid = el.querySelector('.px__grid'), fm = el.querySelector('.px__fm');
    function drawGrid() {
      grid.innerHTML = img.map(function (row, r) { return '<div role="row" class="px__row">' + row.map(function (v, c) { return '<button type="button" role="gridcell" class="px__c" data-r="' + r + '" data-c="' + c + '" style="background:rgb(' + v + ',' + v + ',' + v + ');color:' + (v > 128 ? '#000' : '#fff') + '" aria-label="Row ' + (r + 1) + ' column ' + (c + 1) + ', value ' + v + '">' + v + '</button>'; }).join('') + '</div>'; }).join('');
    }
    function conv() {
      var o = [], mx = 1;
      for (var r = 0; r < N; r++) { o.push([]); for (var c = 0; c < N; c++) { var s = 0; for (var i = -1; i <= 1; i++) for (var j = -1; j <= 1; j++) { var rr = r + i, cc = c + j; s += (rr >= 0 && rr < N && cc >= 0 && cc < N ? img[rr][cc] : 0) * K[i + 1][j + 1]; } o[r].push(s); mx = Math.max(mx, Math.abs(s)); } }
      fm.innerHTML = '<p class="field__note">Feature map (raw values; brighter = stronger response):</p><div class="px__grid px__grid--out" aria-label="Filtered values">' + o.map(function (row) { return '<div class="px__row">' + row.map(function (v) { return '<span class="px__c px__o" style="background:color-mix(in srgb, var(--accent) ' + Math.round(Math.abs(v) / mx * 85) + '%, var(--paper))">' + v + '</span>'; }).join('') + '</div>'; }).join('') + '</div>' +
        '<p>Flat areas became 0; the boundary of your shape lit up. That is edge detection.</p>';
      filtered = true; check();
    }
    function drawTask(k) {
      seen[k] = true;
      var T = VTASKS[k], svg = el.querySelector('.vt__svg');
      var base = '<rect x="0" y="0" width="440" height="200" class="vt__bg"/><rect x="0" y="165" width="440" height="35" class="vt__counter"/>' +
        '<circle cx="85" cy="115" r="42" class="vt__apple"/><path d="M160 90 Q 225 40 295 95 Q 225 75 160 90 Z" class="vt__banana"/><circle cx="362" cy="117" r="40" class="vt__orange"/>';
      var ov = '';
      if (k === 'detection') ov = '<rect x="40" y="70" width="90" height="90" class="vt__box"/><rect x="150" y="40" width="150" height="70" class="vt__box"/><rect x="320" y="75" width="85" height="85" class="vt__box"/>' +
        '<text x="42" y="66" class="vt__lbl">apple 0.93</text><text x="152" y="36" class="vt__lbl">banana 0.88</text><text x="322" y="71" class="vt__lbl">orange 0.91</text>';
      if (k === 'segmentation') ov = '<circle cx="85" cy="115" r="42" class="vt__mask1"/><path d="M160 90 Q 225 40 295 95 Q 225 75 160 90 Z" class="vt__mask2"/><circle cx="362" cy="117" r="40" class="vt__mask3"/>';
      if (k === 'classification') ov = '<text x="12" y="24" class="vt__lbl">apple (0.71)</text>';
      svg.innerHTML = base + ov;
      el.querySelector('.vt__out').textContent = T.out;
      el.querySelector('.vt__note').textContent = T.note;
      el.querySelectorAll('.vt__tab').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.t === k)); });
      check();
    }
    function check() { if (filtered && Object.keys(seen).length === 4) done(); }
    el.addEventListener('click', function (e) {
      var c = e.target.closest('.px__c[data-r]');
      if (c) { var r = +c.dataset.r, cc = +c.dataset.c; img[r][cc] = img[r][cc] ? 0 : 255; drawGrid(); var nb = grid.querySelector('[data-r="' + r + '"][data-c="' + cc + '"]'); if (nb) nb.focus(); if (filtered) conv(); return; }
      if (e.target.closest('[data-f]')) conv();
      if (e.target.closest('[data-clear]')) { img = img.map(function (row) { return row.map(function () { return 0; }); }); drawGrid(); fm.innerHTML = ''; }
      var t = e.target.closest('.vt__tab'); if (t) drawTask(t.dataset.t);
    });
    drawGrid(); drawTask('classification');
  }

  /* --------------------------------------------------------------- speechlab */
  var ONES = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(' ');
  var TENS = ',,twenty,thirty,forty,fifty,sixty,seventy,eighty,ninety'.split(',');
  function words(n) {
    n = Math.floor(n);
    if (n < 20) return ONES[n];
    if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
    if (n < 1000) return ONES[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + words(n % 100) : '');
    if (n < 10000) return words(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + words(n % 1000) : '');
    return String(n);
  }
  var MONTHS = 'January February March April May June July August September October November December'.split(' ');
  function ordinal(n) { var w = words(n); if (/one$/.test(w)) return w.replace(/one$/, 'first'); if (/two$/.test(w)) return w.replace(/two$/, 'second'); if (/three$/.test(w)) return w.replace(/three$/, 'third'); if (/five$/.test(w)) return w.replace(/five$/, 'fifth'); if (/eight$/.test(w)) return w + 'h'; if (/nine$/.test(w)) return w.replace(/nine$/, 'ninth'); if (/twelve$/.test(w)) return w.replace(/twelve$/, 'twelfth'); if (/y$/.test(w)) return w.replace(/y$/, 'ieth'); return w + 'th'; }
  function normalize(t) {
    return t
      .replace(/\bDr\./g, 'Doctor').replace(/\bMr\./g, 'Mister').replace(/\bSt\./g, 'Street').replace(/\bInc\./g, 'Incorporated')
      .replace(/\$(\d+)\.(\d{2})\b/g, function (_, d, c) { return words(+d) + ' dollars and ' + words(+c) + ' cents'; })
      .replace(/\$(\d+)\b/g, function (_, d) { return words(+d) + ' dollars'; })
      .replace(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g, function (_, m, d, y) { return (MONTHS[+m - 1] || m) + ' ' + ordinal(+d) + ', ' + words(+y); })
      .replace(/\b(\d{1,2}):00\s*([AP])\.?M\.?/gi, function (_, h, ap) { return words(+h) + ' o\'clock ' + ap.toUpperCase() + ' M'; })
      .replace(/\b(\d{1,2}):(\d{2})\s*([AP])\.?M\.?/gi, function (_, h, m, ap) { return words(+h) + ' ' + words(+m) + ' ' + ap.toUpperCase() + ' M'; })
      .replace(/(\d+)%/g, function (_, n) { return words(+n) + ' percent'; })
      .replace(/\b\d+\b/g, function (n) { return words(+n); })
      .replace(/&/g, ' and ').replace(/@/g, ' at ');
  }
  function speechlab(el, done) {
    var has = 'speechSynthesis' in global && typeof global.SpeechSynthesisUtterance === 'function', spoken = {};
    el.innerHTML = frame('', '<label class="ex__lbl" for="sp-' + uid + '">Text to speak</label><textarea id="sp-' + uid + '" class="ex__in" rows="3">Dr. Chen\'s appointment is at 3:00 PM on 12/15/2026. The fee is $25.50.</textarea>' +
      '<div class="sp__ctl"><label>Voice <select class="sp__v"></select></label><label>Rate <input type="range" min="0.5" max="2" step="0.1" value="1" class="sp__r"> <output class="sp__ro">1.0</output></label>' +
      '<label>Pitch <input type="range" min="0" max="2" step="0.1" value="1" class="sp__p"> <output class="sp__po">1.0</output></label>' +
      '<button type="button" class="btn" data-say>Speak</button><button type="button" class="btn" data-stop>Stop</button></div>' +
      '<div class="sp__norm"><p class="ex__title">Stage 1, text normalization</p><p class="sp__nt" aria-live="polite"></p></div><p class="sp__msg field__note" aria-live="polite"></p>');
    var ta = el.querySelector('textarea'), vs = el.querySelector('.sp__v'), rr = el.querySelector('.sp__r'), pp = el.querySelector('.sp__p'), msg = el.querySelector('.sp__msg');
    function norm() { el.querySelector('.sp__nt').textContent = normalize(ta.value); }
    function voices() {
      if (!has) return;
      var list = global.speechSynthesis.getVoices();
      vs.innerHTML = list.length ? list.map(function (v, i) { return '<option value="' + i + '">' + esc(v.name + ' (' + v.lang + ')') + '</option>'; }).join('') : '<option>Default voice</option>';
    }
    if (!has) { msg.textContent = 'This browser does not support speech synthesis, so audio is unavailable. The normalization step above still works.'; el.querySelectorAll('[data-say],[data-stop],.sp__v,.sp__r,.sp__p').forEach(function (x) { x.disabled = true; }); }
    else { voices(); global.speechSynthesis.onvoiceschanged = voices; msg.textContent = 'Audio uses your device\'s built-in voices, not Azure Speech.'; }
    ta.addEventListener('input', function () { norm(); if (!has && ta.value.length) done(); });
    rr.addEventListener('input', function () { el.querySelector('.sp__ro').textContent = (+rr.value).toFixed(1); });
    pp.addEventListener('input', function () { el.querySelector('.sp__po').textContent = (+pp.value).toFixed(1); });
    el.addEventListener('click', function (e) {
      if (e.target.closest('[data-say]') && has) {
        global.speechSynthesis.cancel();
        var u = new global.SpeechSynthesisUtterance(normalize(ta.value)), list = global.speechSynthesis.getVoices();
        if (list[+vs.value]) u.voice = list[+vs.value];
        u.rate = +rr.value; u.pitch = +pp.value;
        global.speechSynthesis.speak(u);
        spoken[vs.value + '|' + rr.value + '|' + pp.value] = true;
        if (Object.keys(spoken).length >= 2) done();
      }
      if (e.target.closest('[data-stop]') && has) global.speechSynthesis.cancel();
    });
    norm();
  }

  /* -------------------------------------------------------------- extractlab */
  var RECEIPT = 'FOURTH COFFEE\n123 Main St, Montreal\nDate: 08/15/2024\n\nLatte            4.25\nCroissant        2.23\n\nSubtotal         6.48\nTax              0.49\nTOTAL            6.97\n\nThank you!';
  function money(s) { var m = s && s.match(/(\d+[.,]\d{2})/); return m ? +m[1].replace(',', '.') : null; }
  function extractlab(el, done) {
    var states = {};
    el.innerHTML = frame('', '<div class="xl__cols"><div><label class="ex__lbl" for="xl-' + uid + '">OCR output (editable)</label><textarea id="xl-' + uid + '" class="ex__in xl__in" rows="13" spellcheck="false"></textarea>' +
      '<div class="ex__chips"><button type="button" class="chipbtn" data-x="label">Rename TOTAL to "Amount due"</button><button type="button" class="chipbtn" data-x="total">Change the total to 7.97</button><button type="button" class="chipbtn" data-x="reset">Reset</button></div></div>' +
      '<div><p class="ex__lbl">Extracted fields</p><pre class="xl__json" aria-live="polite"></pre><p class="xl__status" aria-live="polite"></p></div></div>');
    var ta = el.querySelector('textarea'); ta.value = RECEIPT;
    function run() {
      var lines = ta.value.split('\n'), find = function (re) { for (var i = 0; i < lines.length; i++) if (re.test(lines[i])) return lines[i]; return null; };
      var merchant = (lines.filter(function (l) { return l.trim(); })[0] || '').trim();
      var dl = find(/^\s*date\b/i), dm = (dl || ta.value).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      var date = dm ? dm[3] + '-' + ('0' + dm[1]).slice(-2) + '-' + ('0' + dm[2]).slice(-2) : null;
      var sub = money(find(/^\s*subtotal\b/i)), tax = money(find(/^\s*tax\b/i)), tot = money(find(/^\s*total\b/i));
      var f = {
        merchant: { value: merchant || null, confidence: merchant ? 0.82 : 0 },
        date: { value: date, confidence: date ? (dl ? 0.95 : 0.6) : 0 },
        subtotal: { value: sub, confidence: sub !== null ? 0.94 : 0 },
        tax: { value: tax, confidence: tax !== null ? 0.94 : 0 },
        total: { value: tot, confidence: tot !== null ? 0.96 : 0 }
      };
      var why = [];
      Object.keys(f).forEach(function (k) { if (f[k].confidence < 0.7) why.push(k + (f[k].value === null ? ' not found' : ' found with low confidence')); });
      if (sub !== null && tax !== null && tot !== null && Math.abs(sub + tax - tot) > 0.005) why.push('subtotal + tax (' + (sub + tax).toFixed(2) + ') does not equal total (' + tot.toFixed(2) + ')');
      el.querySelector('.xl__json').textContent = JSON.stringify(f, null, 2);
      var st = el.querySelector('.xl__status');
      st.dataset.ok = String(!why.length);
      st.innerHTML = why.length ? '<strong>Send to a person for review:</strong> ' + esc(why.join('; ')) + '.' : '<strong>Auto-approve:</strong> every field found with high confidence and the amounts add up.';
      states[why.length ? 'review' : 'ok'] = true;
      if (states.review && states.ok) done();
    }
    ta.addEventListener('input', run);
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-x]'); if (!b) return;
      if (b.dataset.x === 'label') ta.value = ta.value.replace(/^TOTAL/m, 'Amount due');
      if (b.dataset.x === 'total') ta.value = ta.value.replace(/^(TOTAL\s+)\d+\.\d{2}/m, '$17.97');
      if (b.dataset.x === 'reset') ta.value = RECEIPT;
      run();
    });
    run();
  }

  /* ------------------------------------------------------------------ bigram */
  var CORPORA = {
    support: 'Thank you for contacting us . We are sorry your order arrived late . Your order will arrive on Friday . We have refunded the delivery fee . Please contact us if your order does not arrive . Thank you for your patience . We are sorry for the trouble . Your refund will arrive in five days . Please reply to this message if you need more help . We are happy to help with your order . Your delivery is on the way . Thank you for your order .',
    recipe: 'Heat the oil in a large pan . Add the onion and cook until soft . Add the garlic and cook for one minute . Add the tomatoes and cook until thick . Season the sauce with salt and pepper . Cook the pasta in a large pan of water . Drain the pasta and add the sauce . Serve the pasta with cheese . Add the cheese and serve at once .',
    weather: 'Tomorrow will be cloudy with a chance of rain . The rain will clear in the afternoon . Tomorrow will be cold and windy . The wind will ease in the evening . Expect sunny skies in the afternoon . The evening will be cold with a chance of snow . Expect rain in the morning and sun in the afternoon .'
  };
  function bigram(el, done) {
    var gens = 0, model = {}, starts = [];
    el.innerHTML = frame('', '<div class="bg__ctl"><label>Training text <select class="bg__c"><option value="support">Customer support replies</option><option value="recipe">Recipes</option><option value="weather">Weather forecasts</option></select></label>' +
      '<label>Start word <select class="bg__s"></select></label><label>Temperature <input type="range" class="bg__t" min="0" max="2" step="0.1" value="0.8"> <output class="bg__to">0.8</output></label>' +
      '<button type="button" class="btn" data-gen>Generate</button></div>' +
      '<details class="bg__train"><summary>See the training text</summary><p class="bg__txt"></p></details>' +
      '<p class="ex__lbl">Next-word probabilities after the start word</p><div class="bg__probs"></div><p class="ex__lbl">Generated text</p><ol class="bg__out" aria-live="polite"></ol>');
    var sc = el.querySelector('.bg__c'), ss = el.querySelector('.bg__s'), st = el.querySelector('.bg__t');
    function train() {
      var w = CORPORA[sc.value].toLowerCase().split(/\s+/); model = {};
      for (var i = 0; i < w.length - 1; i++) { var a = w[i], b = w[i + 1]; model[a] = model[a] || {}; model[a][b] = (model[a][b] || 0) + 1; }
      starts = Object.keys(model).filter(function (k) { return k !== '.'; }).sort();
      ss.innerHTML = starts.map(function (s) { return '<option>' + s + '</option>'; }).join('');
      var pick = { support: 'your', recipe: 'add', weather: 'tomorrow' }[sc.value]; ss.value = pick;
      el.querySelector('.bg__txt').textContent = CORPORA[sc.value].replace(/ \./g, '.');
      el.querySelector('.bg__out').innerHTML = '';
      probs();
    }
    function dist(word, T) {
      var nx = model[word] || {}, ks = Object.keys(nx); if (!ks.length) return [];
      if (T === 0) { var best = ks.sort(function (a, b) { return nx[b] - nx[a] || a.localeCompare(b); })[0]; return ks.map(function (k) { return [k, k === best ? 1 : 0]; }); }
      var ws = ks.map(function (k) { return Math.pow(nx[k], 1 / T); }), s = ws.reduce(function (x, y) { return x + y; }, 0);
      return ks.map(function (k, i) { return [k, ws[i] / s]; }).sort(function (a, b) { return b[1] - a[1]; });
    }
    function probs() {
      var d = dist(ss.value, +st.value).slice(0, 6);
      el.querySelector('.bg__probs').innerHTML = d.map(function (p) { return '<div class="rm__bar"><span>' + esc(p[0]) + '</span><span class="rm__track"><span class="rm__fill" data-pos="true" style="width:' + Math.round(p[1] * 100) + '%"></span></span><span>' + Math.round(p[1] * 100) + '%</span></div>'; }).join('') || '<p class="field__note">No word ever followed this one in the training text.</p>';
    }
    function gen() {
      var T = +st.value, w = ss.value, outw = [w];
      for (var i = 0; i < 18; i++) {
        var d = dist(w, T); if (!d.length) break;
        var r = Math.random(), acc = 0, nxt = d[d.length - 1][0];
        for (var j = 0; j < d.length; j++) { acc += d[j][1]; if (r <= acc) { nxt = d[j][0]; break; } }
        outw.push(nxt); w = nxt; if (nxt === '.' && i > 6) break;
      }
      var li = document.createElement('li'); li.textContent = outw.join(' ').replace(/ \./g, '.') + '  (temperature ' + T.toFixed(1) + ')';
      el.querySelector('.bg__out').appendChild(li);
      gens++; if (gens >= 3) done();
    }
    sc.addEventListener('change', train); ss.addEventListener('change', probs);
    st.addEventListener('input', function () { el.querySelector('.bg__to').textContent = (+st.value).toFixed(1); probs(); });
    el.addEventListener('click', function (e) { if (e.target.closest('[data-gen]')) gen(); });
    train();
  }

  /* ------------------------------------------------------------------ prompt */
  var POLICY = 'Contoso leave policy, section 4.2: Full-time employees receive 15 days of paid leave per year, rising to 20 days after three years of service. Part-time employees receive leave in proportion to their contracted hours.';
  function prompt(el, done) {
    var touched = {};
    el.innerHTML = frame('', '<div class="pb__grid"><div>' +
      '<label class="ex__lbl" for="pb1-' + uid + '">System prompt (instructions)</label><textarea id="pb1-' + uid + '" class="ex__in pb__sys" rows="3">You are the HR assistant for Contoso. Answer only from the policy text provided. If the answer is not in it, say you do not know. Reply in at most three bullet points.</textarea>' +
      '<label class="ex__chk"><input type="checkbox" class="pb__hist"> Include conversation history (two earlier turns)</label>' +
      '<label class="ex__chk"><input type="checkbox" class="pb__rag" checked> Include retrieved policy text (grounding)</label>' +
      '<label class="ex__lbl" for="pb2-' + uid + '">User prompt</label><textarea id="pb2-' + uid + '" class="ex__in pb__usr" rows="2">How many days of paid leave do I get after three years? Answer as a short bulleted list.</textarea></div>' +
      '<div><p class="ex__lbl">What the model receives</p><pre class="pb__ctx"></pre><div class="pb__meter"><span>Approximate tokens: <strong class="pb__tok"></strong></span><span class="pb__bar"><span class="pb__fill"></span></span><small>Rough guide: about 4 characters per token in English. The bar is against an illustrative 2,000-token budget, not a real model limit.</small></div>' +
      '<ul class="pb__checks" aria-live="polite"></ul></div></div>');
    var sys = el.querySelector('.pb__sys'), usr = el.querySelector('.pb__usr'), hist = el.querySelector('.pb__hist'), rag = el.querySelector('.pb__rag');
    function run(src) {
      var parts = [['system', sys.value.trim()]];
      if (hist.checked) { parts.push(['user', 'Hi, I started at Contoso three years ago.']); parts.push(['assistant', 'Welcome! How can I help with your HR questions?']); }
      if (rag.checked) parts.push(['system (retrieved data)', POLICY]);
      parts.push(['user', usr.value.trim()]);
      var txt = parts.map(function (p) { return '[' + p[0] + ']\n' + p[1]; }).join('\n\n');
      el.querySelector('.pb__ctx').textContent = txt;
      var tok = Math.ceil(txt.length / 4);
      el.querySelector('.pb__tok').textContent = tok;
      el.querySelector('.pb__fill').style.width = Math.min(100, tok / 20) + '%';
      var u = usr.value.toLowerCase(), wc = u.split(/\s+/).filter(Boolean).length;
      var asksLeave = /leave|holiday|vacation|days off/.test(u);
      var checks = [
        [wc >= 6, 'Clear and specific: the request says exactly what it wants (' + wc + ' words).'],
        [/(for|as) (an?|the) |audience|beginner|manager|employee|format|tone/.test(u) || /bullet|table|list|json|steps|sentences?/.test(u), 'Context: audience, purpose or format is stated.'],
        [/for example|e\.g\.|such as|"/.test(u), 'Examples: shows the kind of answer wanted (optional, often useful).'],
        [/bullet|table|list|json|numbered|steps/.test(u), 'Structure: asks for bullets, a table, JSON or similar.'],
        [!asksLeave || rag.checked, asksLeave ? (rag.checked ? 'Grounded: the policy text the answer depends on is in the context.' : 'Not grounded: the question depends on Contoso\'s policy, and nothing in the context contains it.') : 'Grounding: not needed for this request.']
      ];
      el.querySelector('.pb__checks').innerHTML = checks.map(function (c) { return '<li data-ok="' + c[0] + '">' + (c[0] ? '&#10003; ' : '&#10007; ') + c[1] + '</li>'; }).join('');
      if (src) touched[src] = true;
      if (touched.rag && (touched.usr || touched.sys)) done();
    }
    sys.addEventListener('input', function () { run('sys'); }); usr.addEventListener('input', function () { run('usr'); });
    hist.addEventListener('change', function () { run('hist'); }); rag.addEventListener('change', function () { run('rag'); });
    run();
  }

  /* ----------------------------------------------------------------- request */
  function request(el, done) {
    var changed = {};
    el.innerHTML = frame('', '<div class="rq__ctl"><label>Question <input type="text" class="ex__in rq__q" value="What is an AI application?"></label>' +
      '<label>Deployment name <input type="text" class="ex__in rq__d" value="gpt-4.1-mini"></label>' +
      '<fieldset class="rq__auth"><legend>Authentication</legend><label><input type="radio" name="rqa-' + uid + '" value="entra" checked> Microsoft Entra ID token (project endpoint)</label><label><input type="radio" name="rqa-' + uid + '" value="key"> API key (OpenAI-compatible endpoint)</label></fieldset></div>' +
      '<div class="rq__cols"><div><p class="ex__lbl">Request</p><pre class="rq__req"></pre></div><div><p class="ex__lbl">Response (illustrative)</p><pre class="rq__res"></pre></div></div>' +
      '<p class="field__note">Request shapes follow Microsoft Learn examples; the api-version shown is the one Microsoft Learn used. The response is an example in the documented shape, not a live call. Keys belong in a secure store, never in code.</p>');
    var q = el.querySelector('.rq__q'), d = el.querySelector('.rq__d');
    function run(src) {
      var key = el.querySelector('input[name^="rqa"]:checked').value === 'key';
      var body = JSON.stringify({ model: d.value || '<deployment>', input: q.value }, null, 2);
      var req = key
        ? 'POST https://<resource>.openai.azure.com/openai/v1/responses\nContent-Type: application/json\napi-key: <key from a secure store>\n\n' + body
        : 'POST https://<resource>.services.ai.azure.com/api/projects/<project>/openai/responses?api-version=2025-11-15-preview\nContent-Type: application/json\nAuthorization: Bearer <Microsoft Entra ID access token>\n\n' + body;
      el.querySelector('.rq__req').textContent = req;
      el.querySelector('.rq__res').textContent = JSON.stringify({ object: 'response', status: 'completed', model: d.value || '<deployment>', output: [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text: '(the generated answer to: "' + q.value + '")' }] }] }, null, 2) + '\n\n# An SDK hands you output[0].content[0].text as response.output_text';
      if (src) changed[src] = true;
      if (Object.keys(changed).length >= 2) done();
    }
    q.addEventListener('input', function () { run('q'); }); d.addEventListener('input', function () { run('d'); });
    el.addEventListener('change', function (e) { if (e.target.name && e.target.name.indexOf('rqa') === 0) run('auth'); });
    run();
  }

  /* ------------------------------------------------------------------- agent */
  var AG_TOOLS = [
    { id: 'orders', t: 'Orders API', k: 'knowledge', s: 'read order status' },
    { id: 'address', t: 'Update address', k: 'action', s: 'change a delivery address' },
    { id: 'policy', t: 'Policy knowledge base', k: 'knowledge', s: 'search returns policy documents' },
    { id: 'web', t: 'Web search', k: 'knowledge', s: 'public internet' }
  ];
  var AG_SCEN = [
    { q: 'Where is my order 1042, and can you change the delivery address to my office?', needs: ['orders', 'address'],
      calls: { orders: ['get_order(order_id=1042)', '{ "status": "in transit", "eta": "Thursday" }'], address: ['update_address(order_id=1042, address="office")', '{ "updated": true }'] },
      final: 'Order 1042 is in transit and due Thursday. I have changed the delivery address to your office.', partial: { orders: 'Order 1042 is in transit and due Thursday.' } },
    { q: 'Can I return opened headphones?', needs: ['policy'],
      calls: { policy: ['search_policy(query="return opened headphones")', '"Opened audio products may be returned within 15 days if undamaged." (Returns policy, s.3)'] },
      final: 'Yes, within 15 days if they are undamaged (Returns policy, section 3).', partial: {} },
    { q: 'Is there a storm warning for Montreal tomorrow?', needs: ['web'],
      calls: { web: ['web_search(query="Montreal storm warning tomorrow")', '(current public weather alerts)'] },
      final: 'According to the current public alerts I found, here is tomorrow\'s situation... (with links to the sources)', partial: {} }
  ];
  function agent(el, done) {
    var on = { orders: true, address: true, policy: true, web: false }, approve = true, sc = 0, step = 0, runs = {};
    el.innerHTML = frame('', '<div class="ag__ctl"><label>Request <select class="ag__s">' + AG_SCEN.map(function (s, i) { return '<option value="' + i + '">' + esc(s.q) + '</option>'; }).join('') + '</select></label>' +
      '<fieldset><legend>Tools attached to the agent</legend>' + AG_TOOLS.map(function (t) { return '<label><input type="checkbox" data-tool="' + t.id + '"' + (on[t.id] ? ' checked' : '') + '> ' + t.t + ' <small>(' + t.k + ': ' + t.s + ')</small></label>'; }).join('') + '</fieldset>' +
      '<label class="ex__chk"><input type="checkbox" class="ag__ap" checked> Require a person to approve actions</label>' +
      '<div class="ex__chips"><button type="button" class="btn" data-step>Next step</button><button type="button" class="btn" data-restart>Restart</button></div></div><ol class="ag__log" aria-live="polite"></ol>');
    var log = el.querySelector('.ag__log');
    function tname(n) { return AG_TOOLS.filter(function (t) { return t.id === n; })[0].t; }
    function plan() {
      var S = AG_SCEN[sc], have = S.needs.filter(function (n) { return on[n]; }), miss = S.needs.filter(function (n) { return !on[n]; });
      var att = Object.keys(on).filter(function (k) { return on[k]; });
      var steps = [['User', esc(S.q)], ['Model', 'Reads its instructions and the descriptions of its attached tools: ' + (att.length ? att.map(tname).join(', ') : 'none') + '.' + (have.length ? ' Decides to use ' + have.map(tname).join(' and ') + '.' : '')]];
      if (miss.length) steps.push(['Model', 'No attached tool can do what ' + miss.map(tname).join(' and ') + ' would do. Its instructions say not to guess, so it plans to say what it cannot do.']);
      have.forEach(function (n) {
        var tool = AG_TOOLS.filter(function (t) { return t.id === n; })[0];
        if (tool.k === 'action' && approve) steps.push(['Approval', 'The runtime pauses: a person must approve <code>' + esc(S.calls[n][0]) + '</code> before it runs. (Approved.)']);
        steps.push(['Tool call', 'The model asks for <code>' + esc(S.calls[n][0]) + '</code>; the agent runtime runs it with the agent\'s permissions.']);
        steps.push(['Tool result', 'Returned to the model, not to the user: <code>' + esc(S.calls[n][1]) + '</code>']);
      });
      var fin;
      if (!miss.length) fin = S.final;
      else if (!have.length) fin = 'I am sorry, I cannot help with that. I have no tool that can ' + (S.needs[0] === 'web' ? 'search current public information' : S.needs[0] === 'policy' ? 'look up our policies' : 'reach the order system') + '.';
      else if (have[0] === 'orders') fin = S.partial.orders + ' I cannot change the address: I have no tool that can update it.';
      else fin = 'I have changed the delivery address to your office. I cannot tell you where the order is, because I have no access to the order system.';
      steps.push(['Response', esc(fin)]);
      return steps;
    }
    function render() {
      var steps = plan();
      log.innerHTML = steps.slice(0, step).map(function (s) { return '<li><strong>' + s[0] + ':</strong> ' + s[1] + '</li>'; }).join('');
      el.querySelector('[data-step]').disabled = step >= steps.length;
      if (step >= steps.length) { runs[JSON.stringify(on) + approve + sc] = true; if (Object.keys(runs).length >= 2) done(); }
    }
    el.addEventListener('change', function (e) {
      if (e.target.dataset.tool) on[e.target.dataset.tool] = e.target.checked;
      if (e.target.classList.contains('ag__ap')) approve = e.target.checked;
      if (e.target.classList.contains('ag__s')) sc = +e.target.value;
      step = 0; render();
    });
    el.addEventListener('click', function (e) { if (e.target.closest('[data-step]')) { step++; render(); } if (e.target.closest('[data-restart]')) { step = 0; render(); } });
    render();
  }

  /* --------------------------------------------------------------- codewalk */
  function codewalk(el, done) {
    var set = CODEWALK[el.dataset.set]; if (!set) return;
    var opened = {}, need = set.tabs.reduce(function (n, t) { return n + t.lines.filter(function (l) { return l[0]; }).length; }, 0);
    var h = '<p class="ex__title">' + set.title + '</p>' + (set.tabs.length > 1 ? '<div class="vt__tabs" role="tablist">' + set.tabs.map(function (t, i) { return '<button type="button" role="tab" class="vt__tab" data-tab="' + i + '" aria-selected="' + (i === 0) + '">' + t.name + '</button>'; }).join('') + '</div>' : '');
    set.tabs.forEach(function (t, i) {
      h += '<div class="cw__panel" data-panel="' + i + '"' + (i ? ' hidden' : '') + ' role="tabpanel"><p class="field__note">' + t.note + '</p><ol class="cw">' + t.lines.map(function (l, j) {
        if (!l[0]) return '<li class="cw__blank" aria-hidden="true"></li>';
        return '<li><button type="button" class="cw__line" aria-expanded="false" data-k="' + i + '-' + j + '"><code>' + esc(l[0]) + '</code></button><p class="cw__ex" hidden>' + esc(l[1]) + '</p></li>';
      }).join('') + '</ol><p class="field__note">Select a line to see what it means. <button type="button" class="linkbtn" data-all="' + i + '">Show all explanations</button></p></div>';
    });
    el.innerHTML = '<div class="ex__frame cw__frame">' + h + '</div>';
    function open(btn, force) {
      var ex = btn.nextElementSibling, show = force !== undefined ? force : ex.hidden;
      ex.hidden = !show; btn.setAttribute('aria-expanded', String(show));
      if (show) opened[btn.dataset.k] = true;
      if (Object.keys(opened).length >= Math.min(need, 6)) done();
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('.cw__line'); if (b) { open(b); return; }
      var a = e.target.closest('[data-all]'); if (a) { el.querySelectorAll('[data-panel="' + a.dataset.all + '"] .cw__line').forEach(function (x) { open(x, true); }); return; }
      var t = e.target.closest('[data-tab]'); if (t) { el.querySelectorAll('[data-tab]').forEach(function (x) { x.setAttribute('aria-selected', String(x === t)); }); el.querySelectorAll('[data-panel]').forEach(function (p) { p.hidden = p.dataset.panel !== t.dataset.tab; }); }
    });
  }

  /* ------------------------------------------------------------------ pyread */
  function pyread(el, done) {
    var answered = {};
    el.innerHTML = frame('', '<ol class="py">' + PYREAD.map(function (p, i) {
      var name = nid('py');
      return '<li class="sort__item" data-i="' + i + '"><pre><code class="language-python">' + esc(p.code) + '</code></pre><fieldset><legend>' + p.q + '</legend><div class="sort__opts">' +
        p.o.map(function (o, oi) { return '<label class="sort__opt"><input type="radio" name="' + name + '" value="' + oi + '"><span>' + esc(o) + '</span></label>'; }).join('') + '</div><p class="sort__fb" aria-live="polite"></p></fieldset></li>';
    }).join('') + '</ol>');
    el.addEventListener('change', function (e) {
      if (e.target.type !== 'radio') return;
      var li = e.target.closest('.sort__item'), p = PYREAD[+li.dataset.i], ok = +e.target.value === p.a;
      li.dataset.ok = String(ok); li.querySelector('.sort__fb').innerHTML = (ok ? '<strong>Right.</strong> ' : '<strong>Not quite.</strong> ') + esc(p.why);
      answered[li.dataset.i] = true; if (Object.keys(answered).length === PYREAD.length) done();
    });
  }

  /* --------------------------------------------------------------- hierarchy */
  var LEVELS = [
    ['Tenant', 'Your organization\'s home in Microsoft\'s cloud: users, groups and identities.', 'Who exists and how they sign in.', 'Every request to Foundry with Microsoft Entra ID is authenticated against a tenant.'],
    ['Subscription', 'A billing container with quotas and access control.', 'Who pays; how much model capacity (quota) is available in each region.', 'Deployment failures for "quota" happen here, not in your code.'],
    ['Resource group', 'A folder of related resources with the same lifecycle.', 'What gets deployed, secured and deleted together.', 'Deleting the lab\'s resource group cleans up everything in it.'],
    ['Foundry resource', 'The Azure resource that provides models, the agent service, governance, monitoring and security.', 'Region (which affects available models), networking, keys, access roles.', 'Its endpoints are what client code calls; roles on it decide who can call models.'],
    ['Foundry project', 'A workspace inside the Foundry resource.', 'Agents, evaluations, files, vector indexes and connections for one solution.', 'The project endpoint is what the Foundry SDK connects to; it requires Microsoft Entra ID.'],
    ['Deployments and agents', 'A deployment is a model made callable under a name; an agent is a model plus instructions plus tools.', 'Deployment type, model version, rate limit; agent instructions and tools.', 'Code passes the deployment name as model, or references the agent by name.']
  ];
  function hierarchy(el, done) {
    var seen = {};
    el.innerHTML = frame('', '<div class="hz">' + LEVELS.map(function (l, i) { return '<button type="button" class="hz__lvl" style="--lvl:' + i + '" data-i="' + i + '" aria-pressed="false">' + l[0] + '</button>'; }).join('') +
      '</div><div class="hz__panel" aria-live="polite"><p class="field__note">Select a level.</p></div><p class="ex__score"></p>');
    el.addEventListener('click', function (e) {
      var b = e.target.closest('.hz__lvl'); if (!b) return;
      var l = LEVELS[+b.dataset.i]; seen[b.dataset.i] = true;
      el.querySelectorAll('.hz__lvl').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); if (seen[x.dataset.i]) x.dataset.seen = 'true'; });
      el.querySelector('.hz__panel').innerHTML = '<h4>' + l[0] + '</h4><dl class="hz__dl"><div><dt>What it is</dt><dd>' + l[1] + '</dd></div><div><dt>What you decide here</dt><dd>' + l[2] + '</dd></div><div><dt>Why it matters for AI-901</dt><dd>' + l[3] + '</dd></div></dl>';
      el.querySelector('.ex__score').textContent = Object.keys(seen).length + ' of ' + LEVELS.length + ' levels opened.';
      if (Object.keys(seen).length === LEVELS.length) done();
    });
  }

  /* ------------------------------------------------------------------ picker */
  var P_IN = ['Text', 'An image or photo', 'Spoken audio', 'A document or form', 'A video or recording', 'A goal that needs live data or actions'];
  var P_OUT = ['A category or opinion', 'Named things it mentions', 'Specific named fields', 'New content (text or image)', 'Objects and where they are', 'A description in words', 'A transcript', 'Spoken audio', 'A completed action'];
  var P_MAP = {
    '0|0': ['Text analysis: classification / sentiment analysis', 'Azure Language in Foundry Tools', '00-05', 'text-techniques'],
    '0|1': ['Text analysis: entity detection (and PII detection)', 'Azure Language in Foundry Tools', '00-05', 'text-techniques'],
    '0|2': ['Information extraction from text', 'Azure Content Understanding', '00-08', 'extract-vs-generate'],
    '0|3': ['Generative AI', 'A language model deployed from the Foundry model catalog', '00-09', 'predictive-vs-generative'],
    '0|7': ['Speech synthesis (text to speech)', 'Azure Speech in Foundry Tools', '00-07', 'stt-vs-tts'],
    '1|0': ['Image classification', 'Multimodal model or Azure Vision in Foundry Tools', '00-06', 'vision-tasks'],
    '1|2': ['Information extraction from images (OCR, then fields)', 'Azure Content Understanding', '00-08', 'ocr-vs-fields'],
    '1|3': ['Image generation (editing an existing image)', 'An image-generation model in Foundry Models', '00-06', 'analyze-vs-generate-image'],
    '1|4': ['Object detection', 'Azure Vision in Foundry Tools, or a vision model', '00-06', 'vision-tasks'],
    '1|5': ['Image analysis with a multimodal model', 'A multimodal model deployment (image in the prompt)', '00-06', 'analyze-vs-generate-image'],
    '2|6': ['Speech recognition (speech to text)', 'Azure Speech in Foundry Tools', '00-07', 'stt-vs-tts'],
    '2|3': ['Spoken prompt to an audio-capable model', 'An audio-capable multimodal model, or a voice-based agent', '00-07', 'stt-vs-tts'],
    '2|2': ['Information extraction from audio', 'Azure Content Understanding audio analysis', '00-08', 'ocr-vs-fields'],
    '3|2': ['Information extraction (field extraction)', 'Azure Content Understanding prebuilt or custom analyzers', '00-08', 'ocr-vs-fields'],
    '3|3': ['Generative AI (summarize or draft from the document)', 'A language model, ideally grounded in the document', '00-10', 'extract-vs-generate'],
    '4|2': ['Information extraction from video', 'Azure Content Understanding video analysis', '00-08', 'ocr-vs-fields'],
    '4|6': ['Speech recognition, or extraction of the transcript from video', 'Azure Speech, or Content Understanding video and audio analysis', '00-07', 'ocr-vs-fields'],
    '4|5': ['Video analysis: scenes, key frames and descriptions', 'Azure Content Understanding video analysis', '00-08', 'ocr-vs-fields'],
    '5|8': ['An AI agent with an action tool', 'Foundry Agent Service: a prompt agent with tools', '00-12', 'app-vs-agent'],
    '5|3': ['An AI agent with knowledge tools (grounded answer)', 'Foundry Agent Service with file search or Foundry IQ', '00-12', 'context-vs-grounding']
  };
  function picker(el, done) {
    var looks = {};
    el.innerHTML = frame('Workload picker: what goes in, what must come out?', '<div class="pk"><label>Input <select class="pk__i">' + P_IN.map(function (x, i) { return '<option value="' + i + '">' + x + '</option>'; }).join('') + '</select></label>' +
      '<label>Required output <select class="pk__o">' + P_OUT.map(function (x, i) { return '<option value="' + i + '">' + x + '</option>'; }).join('') + '</select></label></div><div class="pk__res" aria-live="polite"></div>');
    var si = el.querySelector('.pk__i'), so = el.querySelector('.pk__o');
    function run() {
      var k = si.value + '|' + so.value, r = P_MAP[k], res = el.querySelector('.pk__res');
      if (!r) { res.innerHTML = '<p>That combination is unusual. Ask whether a different output is really needed, or whether two capabilities are chained (for example, speech recognition first, then text analysis).</p>'; return; }
      res.innerHTML = '<dl class="hz__dl"><div><dt>Capability</dt><dd><strong>' + r[0] + '</strong></dd></div><div><dt>Microsoft implementation</dt><dd>' + r[1] + '</dd></div><div><dt>Learn it</dt><dd><a href="#/f/' + r[2] + '">Lesson ' + r[2] + '</a> &middot; <a href="#/compare/' + r[3] + '">Comparison: ' + (CMP_BY[r[3]] ? CMP_BY[r[3]].title : r[3]) + '</a></dd></div></dl>';
      looks[k] = true; if (Object.keys(looks).length >= 3) done();
    }
    si.addEventListener('change', run); so.addEventListener('change', run);
    run();
  }

  var REG = { sorter: sorter, rulesmodel: rulesmodel, knn: knn, textlab: textlab, pixellab: pixellab, speechlab: speechlab, extractlab: extractlab, bigram: bigram, prompt: prompt, request: request, agent: agent, codewalk: codewalk, pyread: pyread, hierarchy: hierarchy, picker: picker };

  function mount(root, onDone) {
    root.querySelectorAll('[data-widget]').forEach(function (el) {
      var fn = REG[el.dataset.widget]; if (!fn || el.dataset.mounted) return;
      el.dataset.mounted = 'true';
      try { fn(el, doneOnce(el, onDone)); } catch (err) { el.innerHTML = '<p class="field__note">This exploration could not start in this browser.</p>'; if (global.console) console.error(err); }
    });
  }
  global.Explore = { mount: mount, kinds: Object.keys(REG) };
})(window);
