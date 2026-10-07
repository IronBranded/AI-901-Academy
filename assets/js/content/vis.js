/* vis.js - AI-901 guide
   A small kit of theme-aware visual components, so every concept unit can carry
   a diagram without hand-placing SVG coordinates. HTML where layout should
   reflow on a phone; SVG where geometry is the point. */

function vFig(inner, cap, cls) {
  return '<figure class="diagram v ' + (cls || '') + '">' + inner + (cap ? '<figcaption>' + cap + '</figcaption>' : '') + '</figure>';
}

/* Steps joined by arrows. steps: [{t, s, k}]; k = acc | d1 | d2 | warn | ok */
function vFlow(steps, cap, opts) {
  opts = opts || {};
  var h = '<div class="vf">';
  steps.forEach(function (s, i) {
    if (i) h += '<span class="vf__ar" aria-hidden="true"></span>';
    h += '<div class="vf__st" data-k="' + (s.k || '') + '"><strong>' + s.t + '</strong>' + (s.s ? '<span>' + s.s + '</span>' : '') + '</div>';
  });
  h += '</div>' + (opts.loop ? '<div class="vf__loop">&#8634; ' + opts.loop + '</div>' : '');
  return vFig(h, cap);
}

/* A grid of concept cards. cards: [{t, s, k, tag}] */
function vCards(cards, cap) {
  return vFig('<div class="vc">' + cards.map(function (c) {
    return '<div class="vc__c" data-k="' + (c.k || '') + '">' + (c.tag ? '<span class="vc__tag">' + c.tag + '</span>' : '') + '<strong>' + c.t + '</strong><span>' + c.s + '</span></div>';
  }).join('') + '</div>', cap);
}

/* Nested boxes, outermost first. layers: [{t, s, k}]; last layer may carry chips: [] */
function vNest(layers, cap) {
  function build(i) {
    var L = layers[i];
    var inner = i + 1 < layers.length ? build(i + 1) : (L.chips ? '<div class="vn__chips">' + L.chips.map(function (c) { return '<span>' + c + '</span>'; }).join('') + '</div>' : '');
    return '<div class="vn" data-k="' + (L.k || '') + '"><div class="vn__l"><strong>' + L.t + '</strong>' + (L.s ? ' <span>' + L.s + '</span>' : '') + '</div>' + inner + '</div>';
  }
  return vFig(build(0), cap);
}

/* Two columns compared. a, b: {t, k, items: []} */
function vVs(a, b, cap) {
  function col(c) { return '<div class="vv__c" data-k="' + (c.k || '') + '"><strong>' + c.t + '</strong><ul>' + c.items.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>'; }
  return vFig('<div class="vv">' + col(a) + '<div class="vv__x">vs</div>' + col(b) + '</div>', cap);
}

/* Labelled bands, e.g. the anatomy of a request. parts: [{l, t, k}] */
function vAnat(parts, cap, title) {
  return vFig((title ? '<div class="va__title">' + title + '</div>' : '') + '<div class="va">' + parts.map(function (p) {
    return '<div class="va__r" data-k="' + (p.k || '') + '"><span class="va__l">' + p.l + '</span><span class="va__t">' + p.t + '</span></div>';
  }).join('') + '</div>', cap);
}

/* Tokens as chips with illustrative IDs. toks: [[text, id]] */
function vTokens(toks, cap) {
  return vFig('<div class="vt">' + toks.map(function (t, i) {
    return '<span class="vt__k" data-i="' + (i % 4) + '"><b>' + t[0].replace(/ /g, '&middot;') + '</b><small>' + t[1] + '</small></span>';
  }).join('') + '</div>', cap);
}

/* Horizontal bars. items: [{l, v (0..1), k, note}] */
function vBars(items, cap) {
  return vFig('<div class="wg-bars">' + items.map(function (it) {
    return '<div class="wg-bar vb"><span>' + it.l + '</span><div class="wg-track"><div class="wg-fill" data-k="' + (it.k || '') + '" style="width:' + Math.round(it.v * 100) + '%"></div></div><span class="wg-p">' + (it.note || Math.round(it.v * 100) + '%') + '</span></div>';
  }).join('') + '</div>', cap);
}

/* Four pillars on a two-part foundation. */
function vPillars(pillars, base, cap) {
  return vFig('<div class="vp"><div class="vp__cols">' + pillars.map(function (p) {
    return '<div class="vp__p"><strong>' + p.t + '</strong><span>' + p.s + '</span></div>';
  }).join('') + '</div><div class="vp__base">' + base.map(function (b) { return '<div><strong>' + b.t + '</strong><span>' + b.s + '</span></div>'; }).join('') + '</div></div>', cap);
}

/* Two-dimensional sketch of an embedding space. points: [{x, y, l, g}], query optional */
function vScatter(points, cap, query) {
  var W = 560, H = 300, s = '<svg class="dg vs" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Words plotted as points; similar meanings sit close together">';
  s += '<rect class="dg-zone" x="10" y="10" width="' + (W - 20) + '" height="' + (H - 20) + '" rx="10"/>';
  if (query) {
    var near = points.map(function (p) { return { p: p, d: Math.hypot(p.x - query.x, p.y - query.y) }; }).sort(function (a, b) { return a.d - b.d; }).slice(0, query.k || 3);
    s += '<circle class="vs__r" cx="' + query.x + '" cy="' + query.y + '" r="' + (near[near.length - 1].d + 12) + '"/>';
    near.forEach(function (n) { s += '<line class="vs__nl" x1="' + query.x + '" y1="' + query.y + '" x2="' + n.p.x + '" y2="' + n.p.y + '"/>'; });
  }
  points.forEach(function (p) {
    s += '<circle class="vs__pt vs__g' + (p.g || 0) + '" cx="' + p.x + '" cy="' + p.y + '" r="6"/><text class="dg-s" x="' + (p.x + 10) + '" y="' + (p.y + 4) + '">' + p.l + '</text>';
  });
  if (query) s += '<rect class="vs__q" x="' + (query.x - 7) + '" y="' + (query.y - 7) + '" width="14" height="14" rx="2"/><text class="dg-t" x="' + (query.x + 12) + '" y="' + (query.y - 8) + '">' + query.l + '</text>';
  return vFig(s + '</svg>', cap);
}

/* Attention from one token to the others. weights: one per token (0..1) */
function vAttn(tokens, from, weights, cap) {
  var W = 640, H = 190, gap = W / tokens.length, s = '<svg class="dg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Attention weights from one word to the others">';
  var x0 = gap / 2 + gap * from;
  tokens.forEach(function (t, i) {
    var x = gap / 2 + gap * i;
    if (i !== from) {
      var w = weights[i], mid = (x + x0) / 2, lift = 40 + Math.abs(i - from) * 16;
      s += '<path class="va__arc" d="M' + x0 + ',140 Q' + mid + ',' + (140 - lift) + ' ' + x + ',140" style="stroke-width:' + (1 + w * 9).toFixed(1) + ';opacity:' + (0.25 + w * 0.75).toFixed(2) + '"/>';
      s += '<text class="dg-lb" x="' + x + '" y="' + (182) + '" text-anchor="middle">' + w.toFixed(2) + '</text>';
    }
    s += '<text class="' + (i === from ? 'dg-t t-acc' : 'dg-t') + '" x="' + x + '" y="160" text-anchor="middle">' + t + '</text>';
  });
  return vFig(s + '</svg>', cap);
}

/* A numeric grid (pixels, kernels). cells: 2-D array. mode: 'gray' | 'kernel' | 'heat' */
function vGrid(cells, mode, label) {
  var mx = 1; cells.forEach(function (r) { r.forEach(function (v) { mx = Math.max(mx, Math.abs(v)); }); });
  var n = cells[0].length, h = '<div class="vg"><div class="vg__lbl">' + label + '</div><div class="vg__g" style="grid-template-columns:repeat(' + n + ', var(--cell))">';
  cells.forEach(function (row) {
    row.forEach(function (v) {
      var style;
      if (mode === 'gray') style = 'background:rgb(' + v + ',' + v + ',' + v + ');color:' + (v > 128 ? '#000' : '#fff');
      else if (mode === 'kernel') style = v > 0 ? 'background:color-mix(in srgb, var(--cost-none) 45%, var(--paper))' : v < 0 ? 'background:color-mix(in srgb, var(--cost-high) 35%, var(--paper))' : '';
      else style = 'background:color-mix(in srgb, var(--accent) ' + Math.round(Math.abs(v) / mx * 85) + '%, var(--paper))';
      h += '<span style="' + style + '">' + v + '</span>';
    });
  });
  return h + '</div></div>';
}
function vConv(img, kernel, out, cap) {
  return vFig('<div class="vconv">' + vGrid(img, 'gray', 'Image (pixel values)') + '<span class="vconv__op">&#8859;</span>' + vGrid(kernel, 'kernel', 'Filter (kernel)') + '<span class="vconv__op">=</span>' + vGrid(out, 'heat', 'Feature map') + '</div>', cap);
}

/* Waveform to spectrogram, for how speech becomes features. */
function vWave(cap) {
  var s = '<svg class="dg" viewBox="0 0 680 170" role="img" aria-label="An audio waveform converted into a spectrogram">';
  var d = 'M10,80';
  for (var x = 0; x <= 280; x += 2) {
    var env = Math.sin(x / 280 * Math.PI) * (0.6 + 0.4 * Math.sin(x / 23));
    var y = 80 - env * 55 * Math.sin(x * 0.55) * Math.cos(x * 0.13);
    d += ' L' + (10 + x) + ',' + y.toFixed(1);
  }
  s += '<path class="vw__path" d="' + d + '"/>' + '<text class="dg-t" x="150" y="160" text-anchor="middle">Waveform: amplitude over time</text>';
  s += '<path class="dg-ln" d="M305,80 L352,80" marker-end="url(#vwA)"/><defs><marker id="vwA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="dg-ah" d="M0,0L10,5L0,10z"/></marker></defs>';
  for (var c = 0; c < 28; c++) {
    for (var r = 0; r < 10; r++) {
      var e = Math.max(0, Math.sin(c / 27 * Math.PI) * (0.5 + 0.5 * Math.cos((r - 2 - (c % 7) * 0.5) / 1.6)) * (r < 7 ? 1 : 0.35));
      s += '<rect class="vw__cell" x="' + (365 + c * 11) + '" y="' + (20 + (9 - r) * 12) + '" width="10" height="11" style="opacity:' + (0.08 + e * 0.9).toFixed(2) + '"/>';
    }
  }
  s += '<text class="dg-t" x="518" y="160" text-anchor="middle">Spectrogram: energy by frequency</text>';
  s += '<text class="dg-lb" x="358" y="30" text-anchor="end">high</text><text class="dg-lb" x="358" y="138" text-anchor="end">low</text>';
  return vFig(s + '</svg>', cap);
}

/* Diffusion: noise refined into an image over steps. */
function vDiffusion(cap) {
  var s = '<svg class="dg" viewBox="0 0 680 190" role="img" aria-label="Random noise refined over several steps into a picture of a sun over hills">';
  var seed = 11;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  var steps = [1, 0.7, 0.42, 0.18, 0];
  steps.forEach(function (noise, i) {
    var x = 10 + i * 136;
    s += '<rect class="dg-box" x="' + x + '" y="20" width="116" height="116" rx="6"/>';
    s += '<g style="opacity:' + (1 - noise).toFixed(2) + '"><circle class="vd__sun" cx="' + (x + 80) + '" cy="58" r="16"/><path class="vd__hill" d="M' + (x + 4) + ',120 Q' + (x + 40) + ',70 ' + (x + 70) + ',104 T' + (x + 112) + ',92 L' + (x + 112) + ',132 L' + (x + 4) + ',132 Z"/></g>';
    var dots = Math.round(noise * 170);
    for (var k = 0; k < dots; k++) s += '<rect class="vd__n" x="' + (x + 4 + rnd() * 106).toFixed(1) + '" y="' + (24 + rnd() * 106).toFixed(1) + '" width="4" height="4"/>';
    s += '<text class="dg-s" x="' + (x + 58) + '" y="156" text-anchor="middle">' + (i === 0 ? 'pure noise' : i === 4 ? 'final image' : 'step ' + i) + '</text>';
    if (i < 4) s += '<path class="dg-ln" d="M' + (x + 118) + ',78 L' + (x + 134) + ',78"/>';
  });
  s += '<text class="dg-lb" x="340" y="182" text-anchor="middle">each step removes some noise, steered by the prompt "sun over green hills"</text>';
  return vFig(s + '</svg>', cap);
}

/* Unstructured in, structured out. */
function vReceipt(lines, json, cap) {
  return vFig('<div class="vr"><pre class="vr__doc">' + lines.join('\n') + '</pre><span class="vr__ar" aria-hidden="true"></span><pre class="vr__json">' + json + '</pre></div>', cap);
}

/* A page with its layout regions labelled. */
function vLayout(cap) {
  return vFig('<div class="vl"><div class="vl__page">' +
    '<div class="vl__rg" data-r="title"><span>Title</span><b style="width:55%"></b></div>' +
    '<div class="vl__rg" data-r="para"><span>Paragraph</span><b></b><b></b><b style="width:70%"></b></div>' +
    '<div class="vl__rg" data-r="table"><span>Table</span><div class="vl__tbl">' + '<i></i>'.repeat(9) + '</div></div>' +
    '<div class="vl__rg" data-r="mark"><span>Selection marks</span><em>&#9745; Paid</em><em>&#9744; Pending</em></div>' +
    '</div></div>', cap);
}

/* Reuse a figure defined for a module page. */
function FIG(mod, i) { return (FIGURES[mod] && FIGURES[mod][i]) ? FIGURES[mod][i].html : ''; }

/* Input -> capability -> output -> consumer, the Academy's recurring mental model.
   parts: [{r: role, t: text, s: detail, k}] ; always labelled as a simplified model. */
function vIPO(parts, cap) {
  var h = '<div class="vf vipo" role="list">';
  parts.forEach(function (p, i) {
    if (i) h += '<span class="vf__ar" aria-hidden="true"></span>';
    h += '<div class="vf__st" role="listitem" data-k="' + (p.k || (i === 1 ? 'acc' : '')) + '"><span class="vipo__r">' + p.r + '</span><strong>' + p.t + '</strong>' + (p.s ? '<span>' + p.s + '</span>' : '') + '</div>';
  });
  h += '</div>';
  return vFig('<p class="vipo__tag">Simplified teaching model</p>' + h, cap, 'vipo-fig');
}

/* A model in the middle, tools around it: the agent mental model.
   tools: [{t, s}] */
function vAgent(tools, cap) {
  return vFig('<p class="vipo__tag">Simplified teaching model</p><div class="vag">' +
    '<div class="vag__row"><div class="vf__st"><span class="vipo__r">User</span><strong>Goal or request</strong></div></div>' +
    '<span class="vag__down" aria-hidden="true"></span>' +
    '<div class="vag__row"><div class="vf__st" data-k="acc"><span class="vipo__r">Agent</span><strong>Model + instructions</strong><span>decides whether a tool is needed</span></div></div>' +
    '<span class="vag__down" aria-hidden="true"></span>' +
    '<div class="vag__tools" role="list">' + tools.map(function (t) { return '<div class="vf__st" role="listitem" data-k="d2"><span class="vipo__r">Tool</span><strong>' + t.t + '</strong>' + (t.s ? '<span>' + t.s + '</span>' : '') + '</div>'; }).join('') + '</div>' +
    '<span class="vag__down" aria-hidden="true"></span>' +
    '<div class="vag__row"><div class="vf__st" data-k="ok"><span class="vipo__r">Result</span><strong>Answer or completed action</strong><span>tool results go back to the model first</span></div></div>' +
    '</div>', cap, 'vipo-fig');
}
