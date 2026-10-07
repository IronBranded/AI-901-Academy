/* diagrams.js - AI-901 guide
   Hand-built SVG so every figure uses the same tokens as the page and follows
   the theme. A figure earns its place only where the idea is spatial: where a
   request goes, what wraps what, which direction data travels. */

var DGN = 0;
function dgFig(w, h, label, body, caption) {
  var id = 'dg' + (++DGN);
  function mk(suffix, cls) {
    return '<marker id="' + id + suffix + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-ah ' + cls + '" d="M0,0L10,5L0,10z"/></marker>';
  }
  return '<figure class="diagram dg-fig"><svg class="dg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '">' +
    '<defs>' + mk('a', '') + mk('w', 'dg-ah--warn') + mk('k', 'dg-ah--ok') + '</defs>' +
    body.split('#M').join('#' + id) + '</svg><figcaption>' + caption + '</figcaption></figure>';
}
function bx(x, y, w, h, lines, cls) {
  var s = '<rect class="dg-box ' + (cls || '') + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6"/>';
  var n = lines.length, lh = 15, cy = y + h / 2 - (n - 1) * lh / 2;
  lines.forEach(function (t, i) {
    s += '<text class="' + (i === 0 ? 'dg-t' : 'dg-s') + '" x="' + (x + w / 2) + '" y="' + (cy + i * lh) + '" text-anchor="middle" dominant-baseline="middle">' + t + '</text>';
  });
  return s;
}
function zn(x, y, w, h, label, cls) {
  return '<rect class="dg-zone ' + (cls || '') + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10"/>' +
    '<text class="dg-zl" x="' + (x + 12) + '" y="' + (y + 17) + '">' + label + '</text>';
}
function ar(pts, cls, both) {
  var m = cls === 'warn' ? 'w' : cls === 'ok' ? 'k' : 'a';
  return '<path class="dg-ln ' + (cls || '') + '" d="M' + pts.map(function (p) { return p.join(','); }).join(' L') + '" marker-end="url(#M' + m + ')"' + (both ? ' marker-start="url(#M' + m + ')"' : '') + '/>';
}
function tx(x, y, t, cls, anchor) {
  return '<text class="' + (cls || 'dg-lb') + '" x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '">' + t + '</text>';
}

var FIGURES = {};

/* ENV ------------------------------------------------------------------ */
FIGURES['ENV'] = [{ shape: 'mechanism', at: 'start', cap: 'Foundry resource, project and the three endpoints', html: dgFig(680, 350, 'Foundry resource containing deployments, tools and a project, with three endpoints below',
  zn(15, 15, 650, 185, 'Foundry resource · kind AIServices') +
  tx(652, 32, 'key1 / key2: resource-wide, bypass Entra', 'dg-lb t-warn', 'end') +
  bx(35, 70, 150, 80, ['Model deployments', 'gpt-5-mini, image models']) +
  bx(200, 70, 150, 80, ['Foundry Tools', 'Speech · Language', 'Content Understanding']) +
  zn(365, 45, 285, 140, 'Project', 'acc') +
  bx(380, 80, 125, 80, ['Agents', 'versions, identity']) +
  bx(515, 80, 125, 80, ['Files and indexes', 'vector stores']) +
  bx(20, 250, 180, 64, ['OpenAI-compatible', '&#8230;/openai/v1/', 'Entra ID or key']) +
  bx(215, 250, 150, 64, ['Foundry Tools', '&#8230;cognitiveservices&#8230;', 'Entra ID or key']) +
  bx(400, 250, 230, 64, ['Project endpoint', '&#8230;/api/projects/&lt;project&gt;', 'Entra ID only'], 'ok') +
  ar([[110, 248], [110, 152]]) + ar([[290, 248], [290, 152]]) + ar([[515, 248], [515, 187]], 'ok') +
  tx(340, 340, 'Control plane (Owner, Contributor) creates these. Data plane (Foundry User) calls them.'),
  'The project endpoint is the only one that refuses keys. Anything built on <code>AIProjectClient</code> - chat clients, agent clients - therefore needs an Entra identity with a data-plane role.') }];

/* 01-01 --------------------------------------------------------------- */
FIGURES['01-01'] = [
  { shape: 'mechanism', at: 'end', cap: 'Where guardrails sit on a request', html: dgFig(680, 235, 'A prompt passes input filters, the model, then output filters; either filter can stop it',
    bx(10, 40, 80, 80, ['Prompt', 'user input']) +
    bx(110, 30, 165, 100, ['Input filters', 'hate · sexual', 'violence · self-harm', 'Prompt Shields'], 'd1') +
    bx(295, 40, 90, 80, ['Model', 'deployment'], 'acc') +
    bx(405, 30, 165, 100, ['Output filters', 'harm categories', 'protected material', 'groundedness'], 'd1') +
    bx(590, 40, 80, 80, ['Response']) +
    ar([[90, 80], [108, 80]]) + ar([[275, 80], [293, 80]]) + ar([[385, 80], [403, 80]]) + ar([[570, 80], [588, 80]]) +
    bx(110, 172, 165, 50, ['Rejected', 'content_filter error'], 'warn') +
    bx(395, 172, 190, 50, ['Withheld', 'content_filter finish reason'], 'warn') +
    ar([[192, 130], [192, 170]], 'warn') + ar([[490, 130], [490, 170]], 'warn') +
    tx(200, 155, 'at or above threshold', 'dg-lb', 'start') + tx(498, 155, 'at or above threshold', 'dg-lb', 'start'),
    'Guardrails screen both directions. Prompt Shields catch jailbreaks in the prompt; indirect-attack detection catches instructions hidden in documents the model is given to read.') },
  { shape: 'config', at: 'start', cap: 'Interactive: what a threshold actually blocks', html:
    '<figure class="diagram widget" data-widget="threshold"><div class="wg-row"><span class="wg-lbl">Threshold for one harm category</span>' +
    '<button class="btn" type="button" data-th="1">Low</button><button class="btn" type="button" data-th="2">Medium</button><button class="btn" type="button" data-th="3">High</button></div>' +
    '<div class="wg-sev">' + ['Safe', 'Low', 'Medium', 'High'].map(function (s, i) { return '<div class="wg-cell" data-sev="' + i + '"><strong>' + s + '</strong><span></span></div>'; }).join('') + '</div>' +
    '<p class="wg-out"></p><figcaption>Detected content is scored by severity. The threshold names the lowest severity that is flagged, so <em>Low</em> blocks the most. (Microsoft\'s documentation labels the settings inconsistently; reason from this behaviour.)</figcaption></figure>' }
];

/* 01-02 --------------------------------------------------------------- */
FIGURES['01-02'] = [
  { shape: 'concept', at: 'end', cap: 'How a language model generates text, one token at a time', html: dgFig(680, 225, 'Text is tokenized, embedded, passed through a transformer, turned into probabilities and sampled; the chosen token is appended and the loop repeats',
    bx(10, 50, 98, 90, ['Text', '"The cat sat', 'on the"']) +
    bx(122, 50, 98, 90, ['Tokens', 'The | cat | sat', 'on | the']) +
    bx(234, 50, 98, 90, ['Embeddings', 'one vector', 'per token']) +
    bx(346, 50, 98, 90, ['Transformer', 'attention weighs', 'every token'], 'acc') +
    bx(458, 50, 98, 90, ['Probabilities', 'mat 0.65', 'floor 0.19 &#8230;']) +
    bx(570, 50, 100, 90, ['Sample', 'temperature', 'picks one'], 'd1') +
    ar([[108, 95], [120, 95]]) + ar([[220, 95], [232, 95]]) + ar([[332, 95], [344, 95]]) + ar([[444, 95], [456, 95]]) + ar([[556, 95], [568, 95]]) +
    ar([[620, 140], [620, 185], [171, 185], [171, 143]]) +
    tx(395, 210, 'append " mat" and repeat until a stop sequence or the output-token limit'),
    'Nothing is looked up. Every token in the answer is a sample from a probability distribution, which is why the same prompt can produce different answers and why grounding matters.') },
  { shape: 'concept', at: 'end', cap: 'Interactive: temperature and the next-token distribution', html:
    '<figure class="diagram widget" data-widget="temperature"><div class="wg-row"><label class="wg-lbl" for="wg-t">Temperature <strong id="wg-tv">1.0</strong></label>' +
    '<input class="wg-slider" id="wg-t" type="range" min="0" max="2" step="0.1" value="1"></div><div class="wg-bars"></div><p class="wg-out"></p>' +
    '<figcaption>Next-token candidates after <em>"The cat sat on the"</em>. Temperature rescales the distribution before sampling: near 0 the top token always wins; high values give unlikely tokens a real chance. Reasoning models do not accept this parameter.</figcaption></figure>' },
  { shape: 'config', at: 'start', cap: 'Choosing a deployment type', html: dgFig(680, 365, 'Decision tree for deployment types',
    bx(20, 20, 280, 56, ['Need guaranteed throughput?', 'sustained volume, predictable latency']) +
    bx(400, 20, 260, 56, ['Provisioned', 'reserved units, billed hourly, used or not'], 'warn') +
    bx(20, 115, 280, 56, ['Can results wait up to 24 hours?', 'large offline jobs']) +
    bx(400, 115, 260, 56, ['Batch (Global or Data Zone)', 'discounted, asynchronous'], 'ok') +
    bx(20, 210, 280, 56, ['Where may prompts be processed?', 'residency requirement']) +
    bx(20, 300, 190, 52, ['Global Standard', 'any region, highest quota'], 'acc') +
    bx(245, 300, 190, 52, ['Data Zone Standard', 'inside the EU or US zone'], 'acc') +
    bx(470, 300, 190, 52, ['Standard', 'one region only'], 'acc') +
    ar([[300, 48], [398, 48]], 'warn') + tx(349, 41, 'yes') +
    ar([[300, 143], [398, 143]], 'ok') + tx(349, 136, 'yes') +
    ar([[160, 76], [160, 113]]) + tx(168, 99, 'no', 'dg-lb', 'start') +
    ar([[160, 171], [160, 208]]) + tx(168, 194, 'no', 'dg-lb', 'start') +
    ar([[100, 266], [100, 298]]) + tx(108, 287, 'anywhere', 'dg-lb', 'start') +
    ar([[300, 250], [340, 250], [340, 298]]) + tx(348, 287, 'EU or US zone', 'dg-lb', 'start') +
    ar([[300, 228], [565, 228], [565, 298]]) + tx(573, 287, 'one region', 'dg-lb', 'start'),
    'Exam stems usually contain exactly one of these constraints. Find it and the deployment type follows.') }
];

/* 01-03 --------------------------------------------------------------- */
function scene(x, y, mode) {
  var s = '';
  var carCls = mode === 'seg' ? 'dg-fill-a' : 'dg-fill-n', perCls = mode === 'seg' ? 'dg-fill-b' : 'dg-fill-n', grd = mode === 'seg' ? 'dg-fill-c' : 'dg-fill-g';
  s += '<rect class="' + grd + '" x="' + (x + 1) + '" y="' + (y + 118) + '" width="153" height="31" rx="0"/>';
  s += '<rect class="' + carCls + '" x="' + (x + 20) + '" y="' + (y + 88) + '" width="72" height="26" rx="6"/>';
  s += '<rect class="' + carCls + '" x="' + (x + 36) + '" y="' + (y + 72) + '" width="40" height="20" rx="5"/>';
  s += '<circle class="' + carCls + '" cx="' + (x + 38) + '" cy="' + (y + 116) + '" r="8"/><circle class="' + carCls + '" cx="' + (x + 76) + '" cy="' + (y + 116) + '" r="8"/>';
  s += '<circle class="' + perCls + '" cx="' + (x + 121) + '" cy="' + (y + 62) + '" r="8"/>';
  s += '<rect class="' + perCls + '" x="' + (x + 114) + '" y="' + (y + 72) + '" width="14" height="44" rx="4"/>';
  return s;
}
function panel(x, title, sub, inner) {
  return '<rect class="dg-box" x="' + x + '" y="30" width="155" height="150" rx="6"/>' + inner +
    tx(x + 77, 202, title, 'dg-t') + tx(x + 77, 220, sub, 'dg-s');
}
FIGURES['01-03'] = [
  { shape: 'mechanism', at: 'afterH3:Text analysis techniques', cap: 'One sentence, five text analysis techniques', html:
    '<figure class="diagram ann"><p class="ann__s">The <span class="ann-asp">keyboard</span> on the <span class="ann-ent" data-cat="Product">Contoso X200</span> feels <span class="ann-neg">cheap</span>, but <span class="ann-asp">support</span> at the <span class="ann-ent" data-cat="Location">Seattle</span> store was <span class="ann-pos">excellent</span>.</p>' +
    '<div class="table-scroll"><table class="ann__t"><tbody>' +
    '<tr><th>Key phrases</th><td>keyboard &middot; Contoso X200 &middot; support &middot; Seattle store</td></tr>' +
    '<tr><th>Entities</th><td><span class="ann-ent">Contoso X200</span> &rarr; Product &middot; <span class="ann-ent">Seattle</span> &rarr; Location</td></tr>' +
    '<tr><th>Sentiment</th><td>Mixed: one negative clause, one positive</td></tr>' +
    '<tr><th>Opinion mining</th><td><span class="ann-asp">keyboard</span> &rarr; <span class="ann-neg">cheap</span> (negative) &middot; <span class="ann-asp">support</span> &rarr; <span class="ann-pos">excellent</span> (positive)</td></tr>' +
    '<tr><th>Abstractive summary</th><td>"Disappointing keyboard; excellent in-store support."</td></tr>' +
    '</tbody></table></div><figcaption>The same input, five different outputs. Key phrases are untyped topics; entities are typed; sentiment is one verdict; opinion mining ties each verdict to the thing it is about.</figcaption></figure>' },
  { shape: 'mechanism', at: 'afterH3:Vision and image generation', cap: 'Classification, detection, segmentation and OCR on one image', html: dgFig(680, 235, 'Four panels contrasting image classification, object detection, semantic segmentation and OCR',
    panel(10, 'Classification', 'what is it?', scene(10, 30, 'n') + '<rect class="dg-tag" x="20" y="40" width="96" height="22" rx="4"/>' + tx(68, 55, 'label: car', 'dg-s')) +
    panel(177, 'Object detection', 'what, and where?', scene(177, 30, 'n') +
      '<rect class="dg-bbox" x="191" y="96" width="82" height="64" rx="2"/>' + tx(193, 91, 'car 0.97', 'dg-lb t-acc', 'start') +
      '<rect class="dg-bbox" x="284" y="80" width="30" height="70" rx="2"/>' + tx(316, 74, 'person 0.91', 'dg-lb t-acc', 'end')) +
    panel(344, 'Segmentation', 'which pixels?', scene(344, 30, 'seg')) +
    panel(511, 'OCR', 'what text?', '<rect class="dg-fill-n" x="526" y="70" width="125" height="70" rx="4"/>' +
      '<text class="dg-mono" x="588" y="110" text-anchor="middle">ASSY 250425</text><rect class="dg-bbox" x="536" y="95" width="104" height="24" rx="2"/>'),
    'Same photo, different questions. The output the scenario asks for - one label, labelled boxes, a pixel mask, or text - tells you which task it is.') }
];

/* 02-01 --------------------------------------------------------------- */
function segs(x, y, list) {
  var s = '';
  list.forEach(function (k, i) {
    var faded = k.charAt(0) === '~', t = faded ? k.slice(1) : k;
    s += '<rect class="dg-seg ' + (faded ? 'dg-seg--stored' : 'dg-seg--' + t.charAt(0)) + '" x="' + (x + i * 22) + '" y="' + y + '" width="20" height="24" rx="3"/>' +
      '<text class="dg-segt" x="' + (x + i * 22 + 10) + '" y="' + (y + 16) + '" text-anchor="middle">' + t + '</text>';
  });
  return s;
}
FIGURES['02-01'] = [{ shape: 'mechanism', at: 'end', cap: 'Conversation state: resending history versus previous_response_id', html: dgFig(680, 250, 'Input tokens per turn under two conversation strategies',
  tx(180, 30, 'Turn 1', 'dg-t') + tx(340, 30, 'Turn 2', 'dg-t') + tx(530, 30, 'Turn 3', 'dg-t') +
  tx(10, 72, 'Client resends', 'dg-s', 'start') + tx(10, 88, 'the history', 'dg-s', 'start') +
  segs(158, 62, ['I', 'U']) + segs(296, 62, ['I', 'U', 'A', 'U']) + segs(464, 62, ['I', 'U', 'A', 'U', 'A', 'U']) +
  tx(10, 142, 'previous_', 'dg-s', 'start') + tx(10, 158, 'response_id', 'dg-s', 'start') +
  segs(158, 132, ['I', 'U']) + segs(296, 132, ['~U', '~A', 'I', 'U']) + segs(464, 132, ['~U', '~A', '~U', '~A', 'I', 'U']) +
  segs(150, 190, ['I']) + tx(176, 207, 'instructions (resend every turn)', 'dg-lb', 'start') +
  segs(380, 190, ['U', 'A']) + tx(428, 207, 'user / assistant', 'dg-lb', 'start') +
  segs(540, 190, ['~U']) + tx(566, 207, 'stored, still billed', 'dg-lb', 'start') +
  tx(340, 240, 'Either way, input tokens grow every turn. previous_response_id saves code, not tokens.'),
  'The service keeps the chain for you, but earlier turns are still billed as input on every request, and <code>instructions</code> is not carried forward.') }];

/* 02-02 --------------------------------------------------------------- */
FIGURES['02-02'] = [{ shape: 'concept', at: 'end', cap: 'What an agent wraps, and how a client reaches it', html: dgFig(680, 285, 'Client app calls an agent by reference; the agent holds model, instructions and tools and decides which tools to call',
  bx(10, 108, 120, 70, ['Client app', 'Entra ID token']) +
  ar([[130, 132], [198, 132]]) + tx(164, 124, 'agent_reference') +
  ar([[198, 158], [132, 158]]) + tx(164, 174, 'response') +
  zn(200, 35, 250, 225, 'Agent · name + version', 'acc') +
  bx(220, 65, 210, 46, ['Model', 'a deployment, e.g. gpt-5-mini']) +
  bx(220, 121, 210, 46, ['Instructions', 'role, scope, when to use tools']) +
  bx(220, 177, 210, 46, ['Tool definitions', 'what it is allowed to call']) +
  tx(325, 247, 'its own Microsoft Entra agent identity') +
  bx(500, 30, 170, 46, ['Web search', 'public, current']) +
  bx(500, 86, 170, 46, ['File search', 'your indexed documents']) +
  bx(500, 142, 170, 46, ['Code interpreter', 'runs Python']) +
  bx(500, 198, 170, 46, ['Your own APIs', 'function, OpenAPI, MCP']) +
  ar([[452, 53], [498, 53]], '', true) + ar([[452, 109], [498, 109]], '', true) + ar([[452, 165], [498, 165]], '', true) + ar([[452, 221], [498, 221]], '', true) +
  tx(585, 272, 'the agent decides which to call'),
  'The client sends no system prompt and does no retrieval: it names the agent and version. Saving the agent again creates a new version that clients do not see until they reference it.') }];

/* 02-03 --------------------------------------------------------------- */
FIGURES['02-03'] = [{ shape: 'concept', at: 'end', cap: 'Three ways to handle a spoken prompt', html: dgFig(680, 255, 'Three speech architectures: pipeline, audio-capable model, Voice Live',
  tx(10, 60, 'Pipeline', 'dg-t', 'start') +
  bx(100, 30, 75, 50, ['Mic']) + bx(190, 30, 110, 50, ['Speech-to-text', 'Azure Speech']) + bx(315, 30, 100, 50, ['Model', 'text in, out'], 'acc') + bx(430, 30, 110, 50, ['Text-to-speech', 'neural voice']) + bx(555, 30, 110, 50, ['Speaker']) +
  ar([[175, 55], [188, 55]]) + ar([[300, 55], [313, 55]]) + ar([[415, 55], [428, 55]]) + ar([[540, 55], [553, 55]]) +
  tx(10, 140, 'Audio model', 'dg-t', 'start') +
  bx(100, 110, 75, 50, ['Audio']) + bx(190, 110, 350, 50, ['Audio-capable multimodal model', 'audio in; text or audio out'], 'acc') + bx(555, 110, 110, 50, ['Answer']) +
  ar([[175, 135], [188, 135]]) + ar([[540, 135], [553, 135]]) +
  tx(10, 220, 'Voice Live', 'dg-t', 'start') +
  bx(100, 190, 75, 50, ['Mic']) + bx(190, 190, 350, 50, ['Voice Live session (agent voice mode)', 'managed recognition + agent + synthesis, streaming'], 'd1') + bx(555, 190, 110, 50, ['Speaker']) +
  ar([[175, 215], [188, 215]], '', true) + ar([[540, 215], [553, 215]], '', true),
  'The pipeline gives you the most control and the most code. An audio-capable model skips transcription. Voice Live is the managed real-time option behind an agent\'s voice mode.') }];

/* 02-04 --------------------------------------------------------------- */
FIGURES['02-04'] = [{ shape: 'concept', at: 'end', cap: 'Interpretation versus generation', html: dgFig(680, 195, 'Image in, text out versus text in, image out',
  bx(10, 30, 170, 56, ['Image + question', 'input_image + input_text']) + bx(250, 30, 180, 56, ['Multimodal model', 'interprets'], 'acc') + bx(500, 30, 170, 56, ['Text answer', 'description, OCR, reasoning']) +
  ar([[180, 58], [248, 58]]) + ar([[430, 58], [498, 58]]) + tx(214, 50, 'interpret') +
  bx(10, 120, 170, 56, ['Text prompt', 'optionally an image to edit']) + bx(250, 120, 180, 56, ['Image model', 'generates'], 'd1') + bx(500, 120, 170, 56, ['New image', 'with Content Credentials']) +
  ar([[180, 148], [248, 148]]) + ar([[430, 148], [498, 148]]) + tx(214, 140, 'generate'),
  'Read the direction of travel in the scenario first. Most wrong options on this objective are the right model pointed the wrong way.') }];

/* 02-05 --------------------------------------------------------------- */
function cell(x, y, t, cls) {
  return '<rect class="dg-box ' + (cls || '') + '" x="' + x + '" y="' + y + '" width="135" height="52" rx="6"/>' +
    '<text class="dg-s dg-cell" x="' + (x + 67.5) + '" y="' + (y + 26) + '" text-anchor="middle" dominant-baseline="middle">' + t + '</text>';
}
FIGURES['02-05'] = [{ shape: 'concept', at: 'end', cap: 'The extraction ladder across four modalities', html: dgFig(680, 305, 'Read, structure and fields for documents, images, audio and video',
  tx(177, 26, 'Document', 'dg-t') + tx(320, 26, 'Image', 'dg-t') + tx(463, 26, 'Audio', 'dg-t') + tx(606, 26, 'Video', 'dg-t') +
  tx(10, 110, 'Fields', 'dg-t', 'start') + tx(10, 180, 'Structure', 'dg-t', 'start') + tx(10, 250, 'Read', 'dg-t', 'start') +
  ar([[92, 272], [92, 82]]) +
  cell(110, 80, 'vendor, date, total', 'd2') + cell(253, 80, 'fields in the image', 'd2') + cell(396, 80, 'summary, actions', 'd2') + cell(539, 80, 'per-segment fields', 'd2') +
  cell(110, 150, 'paragraphs, tables') + cell(253, 150, 'regions, layout') + cell(396, 150, 'speakers, segments') + cell(539, 150, 'scenes, key frames') +
  cell(110, 220, 'OCR text') + cell(253, 220, 'OCR text') + cell(396, 220, 'transcript') + cell(539, 220, 'transcript') +
  tx(395, 296, 'Each field carries a confidence score and grounding. Field extraction runs on models you deploy.'),
  'Each rung adds interpretation. OCR never knows which number is the total; that is the top rung, and it is the one that needs model deployments.') }];

/* ---------------- widgets ---------------- */
function initWidgets(root) {
  root.querySelectorAll('[data-widget="threshold"]').forEach(function (w) {
    function set(t) {
      w.querySelectorAll('[data-th]').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.dataset.th === t)); });
      w.querySelectorAll('.wg-cell').forEach(function (c) {
        var s = +c.dataset.sev, blocked = s > 0 && s >= t;
        c.dataset.blocked = String(blocked);
        c.querySelector('span').textContent = blocked ? 'blocked' : 'passes';
      });
      w.querySelector('.wg-out').textContent = t === 1 ? 'Low: blocks low, medium and high. Blocks the most content.' :
        t === 2 ? 'Medium: blocks medium and high. The default.' :
        'High: blocks only high. Lets more through than the default. Any customer can choose it; only turning filtering off needs approval.';
    }
    w.querySelectorAll('[data-th]').forEach(function (b) { b.addEventListener('click', function () { set(+b.dataset.th); }); });
    set(2);
  });
  root.querySelectorAll('[data-widget="temperature"]').forEach(function (w) {
    var toks = ['mat', 'floor', 'sofa', 'roof', 'moon'], logits = [3.0, 1.75, 1.2, 0.3, -1.5];
    var bars = w.querySelector('.wg-bars'), inp = w.querySelector('input'), out = w.querySelector('.wg-out'), tv = w.querySelector('#wg-t') && w.querySelector('strong');
    bars.innerHTML = toks.map(function (t) { return '<div class="wg-bar"><span>' + t + '</span><div class="wg-track"><div class="wg-fill"></div></div><span class="wg-p"></span></div>'; }).join('');
    function draw() {
      var T = +inp.value, p;
      if (T === 0) p = logits.map(function (_, i) { return i === 0 ? 1 : 0; });
      else {
        var e = logits.map(function (l) { return Math.exp(l / T); }), s = e.reduce(function (a, b) { return a + b; }, 0);
        p = e.map(function (x) { return x / s; });
      }
      bars.querySelectorAll('.wg-bar').forEach(function (b, i) {
        b.querySelector('.wg-fill').style.width = (p[i] * 100).toFixed(1) + '%';
        b.querySelector('.wg-p').textContent = (p[i] * 100).toFixed(p[i] < 0.01 && p[i] > 0 ? 1 : 0) + '%';
      });
      if (tv) tv.textContent = T.toFixed(1);
      out.textContent = T === 0 ? 'Always "mat". Fully repeatable, and fully predictable.' :
        T < 0.7 ? 'Strongly favours "mat". Good for extraction and classification.' :
        T <= 1.2 ? 'The model\'s natural distribution. "mat" usually, not always.' :
        'Flattened: "roof" and even "moon" now come up. More varied, more likely to drift off-task.';
    }
    inp.addEventListener('input', draw);
    draw();
  });
}
