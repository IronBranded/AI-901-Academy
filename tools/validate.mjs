// validate.mjs - content integrity checks and the objective coverage matrix.
//
//   node tools/validate.mjs            check everything, write docs/coverage-matrix.{json,md}
//   node tools/validate.mjs --no-write check only
//
// Exit code 1 when any ERROR is found. WARNINGS are printed but do not fail.
// What is checked:
//   - 29 objectives with unique ids, valid groups, modules, areas, lens lines,
//     foundation lessons, comparisons, exercises and Microsoft Learn sources
//   - every knowledge-check and practice-exam question: answer index in range,
//     "why", "why not the others" for every wrong option, a scenario clue, and a
//     valid objective mapping
//   - Module 0: 17 lessons with the full lesson anatomy and valid cross-links
//   - comparisons, concept index routes, exploration data, external link domains
//   - index.html loads every content script, and assets/js/app.js is built
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { root, loadContent, CONTENT_SCRIPTS, indexScripts } from './lib/load.mjs';

const C = loadContent();
const errors = [], warnings = [];
const err = (m) => errors.push(m), warn = (m) => warnings.push(m);
const write = !process.argv.includes('--no-write');

const modIds = new Set(C.MODULES.map(m => m.id));
const learnIds = new Set(C.LEARN.map(l => l.id));
const foundIds = new Set(C.FOUND.map(f => f.id));
const groupIds = new Set(C.GROUPS.map(g => g.id));
const areaIds = new Set(C.AREAS.map(a => a.id));
const cmpIds = new Set(C.COMPARE.map(c => c.id));
const objIds = new Set(C.OBJ.map(o => o.id));
const widgetKinds = new Set(C.Explore.kinds);

/* ---------------- objectives ---------------- */
if (C.OBJ.length !== 29) err(`Expected 29 objectives, found ${C.OBJ.length}`);
const seenObj = new Set(), seenModIdx = new Set();
for (const o of C.OBJ) {
  const at = `Objective ${o.id}`;
  if (seenObj.has(o.id)) err(`${at}: duplicate id`); seenObj.add(o.id);
  if (!/^\d\.\d\.\d$/.test(o.id)) err(`${at}: id must look like 1.2.3`);
  if (!groupIds.has(o.g) || !o.id.startsWith(o.g + '.')) err(`${at}: group ${o.g} invalid`);
  if (!modIds.has(o.mod)) err(`${at}: module ${o.mod} does not exist`);
  if (seenModIdx.has(o.mod + ':' + o.i)) err(`${at}: duplicate module index`); seenModIdx.add(o.mod + ':' + o.i);
  if (!areaIds.has(o.area)) err(`${at}: unknown area ${o.area}`);
  if (!o.text || o.text.length < 20) err(`${at}: missing verbatim text`);
  if (!Array.isArray(o.lens) || o.lens.length < 2) err(`${at}: Exam Lens needs at least two lines`);
  if (!o.ms) err(`${at}: missing Microsoft implementation line`);
  for (const f of o.found) if (!foundIds.has(f)) err(`${at}: foundation lesson ${f} missing`);
  if (!o.found.length) err(`${at}: no foundation lesson prepares it`);
  for (const c of o.cmp) if (!cmpIds.has(c)) err(`${at}: comparison ${c} missing`);
  for (const l of (o.ex.labs || [])) if (!modIds.has(l)) err(`${at}: lab ${l} missing`);
  for (const x of (o.ex.explore || [])) { const f = C.FOUND.find(z => z.id === x); if (!f || !f.explore) err(`${at}: exploration ${x} missing`); }
  if (!o.src.length || o.src.some(u => !/^https:\/\/learn\.microsoft\.com\//.test(u))) err(`${at}: sources must be Microsoft Learn URLs`);
  if (o.lens.some(l => /exam will|you will be asked|on the exam you/i.test(l))) err(`${at}: lens must not speculate about live exam questions`);
}

/* ---------------- questions ---------------- */
function checkQ(q, at, opts) {
  if (!q.q || q.q.length < 15) err(`${at}: question text missing`);
  if (!Array.isArray(q.o) || q.o.length < 3) err(`${at}: needs at least 3 options`);
  if (!(q.a >= 0 && q.a < q.o.length)) err(`${at}: answer index out of range`);
  if (!q.why) err(`${at}: missing "why"`);
  if (!Array.isArray(q.not) || q.not.length !== q.o.length) err(`${at}: "why not the others" must have one entry per option`);
  else q.not.forEach((n, i) => { if (i === q.a && n) err(`${at}: why-not entry for the correct option must be empty`); if (i !== q.a && !n) err(`${at}: option ${i} has no why-not explanation`); });
  if (!q.clue) err(`${at}: missing scenario clue`);
  if (new Set(q.o).size !== q.o.length) err(`${at}: duplicate options`);
  if (opts && opts.objId !== undefined && opts.objId !== null && !objIds.has(opts.objId)) err(`${at}: objective ${opts.objId} unknown`);
}
for (const m of C.MODULES) {
  if (m.domain !== '00' && !m.objectives.length) err(`Module ${m.id}: no objectives`);
  const intro = m.intro;
  if (!intro || !intro.problem || !intro.plain || !Array.isArray(intro.ipo) || intro.ipo.length < 3 || !intro.cap)
    err(`Module ${m.id}: needs a problem-first opener (MODULE_INTRO: problem, plain, ipo with at least 3 parts, cap)`);
  m.quiz.forEach((q, i) => {
    const oid = q.obj >= 0 ? C.objKey(m.id, q.obj) : null;
    if (q.obj >= 0 && !oid) err(`Module ${m.id} question ${i + 1}: objective index ${q.obj} not mapped`);
    if (q.obj < 0 && m.domain !== '00') err(`Module ${m.id} question ${i + 1}: exam modules must map every question to an objective`);
    checkQ(q, `Module ${m.id} question ${i + 1}`, { objId: oid });
  });
  if (!m.verified) warn(`Module ${m.id}: lab not yet verified against a Microsoft exercise (shown to learners as "Not yet verified")`);
}
const xIds = new Set();
for (const q of C.EXAMQ) {
  const at = `Practice exam ${q.id}`;
  if (xIds.has(q.id)) err(`${at}: duplicate id`); xIds.add(q.id);
  if (!modIds.has(q.mod)) err(`${at}: module ${q.mod} missing`);
  if (q.obj >= 0 && !C.objKey(q.mod, q.obj)) err(`${at}: objective not mapped`);
  (q.pm || []).forEach(p => { if (!C.objKey(p[0], p[1])) err(`${at}: part mapping ${p} invalid`); });
  if (!q.why) err(`${at}: missing why`);
  if (!q.clue) err(`${at}: missing scenario clue`);
  if (q.case && !C.CASES[q.case]) err(`${at}: case ${q.case} missing`);
  if (q.type === 'single' || q.type === 'multi') {
    const ans = Array.isArray(q.a) ? q.a : [q.a];
    if (!Array.isArray(q.not) || q.not.length !== q.o.length) err(`${at}: why-not entries must match options`);
    else q.not.forEach((n, i) => { if (ans.includes(i) && n) err(`${at}: correct option ${i} has a why-not`); if (!ans.includes(i) && !n) err(`${at}: option ${i} lacks a why-not`); });
    if (q.type === 'multi' && ans.length !== q.pick) err(`${at}: pick count does not match answers`);
  }
  if (q.type === 'yesno' && q.s.length !== q.a.length) err(`${at}: statements and answers differ in length`);
  if (q.type === 'code') q.blanks.forEach((b, i) => { if (!(b.a >= 0 && b.a < b.o.length)) err(`${at}: blank ${i} answer out of range`); });
}

/* ---------------- Module 0 ---------------- */
const REQUIRED = ['title', 'short', 'scope', 'supports', 'area', 'prereq', 'learn', 'mods', 'outcomes', 'problem', 'plain', 'example', 'words', 'model', 'concept', 'how', 'ms', 'distinctions', 'rai', 'scenario', 'explore', 'observe', 'check', 'teach', 'takeaways'];
if (C.FOUND.length !== 17) err(`Module 0 should have 17 lessons, found ${C.FOUND.length}`);
C.FOUND.forEach((f, i) => {
  const at = `Lesson ${f.id}`;
  const want = '00-' + String(i + 1).padStart(2, '0');
  if (f.id !== want) err(`${at}: expected id ${want} in this position`);
  for (const k of REQUIRED) if (f[k] === undefined || f[k] === '' || (Array.isArray(f[k]) && !f[k].length && !['prereq'].includes(k))) err(`${at}: missing ${k}`);
  if (!['foundation', 'supports'].includes(f.scope)) err(`${at}: scope must be foundation or supports`);
  for (const o of f.supports) if (!objIds.has(o)) err(`${at}: supports unknown objective ${o}`);
  for (const p of f.prereq) if (!foundIds.has(p) || p >= f.id) err(`${at}: prerequisite ${p} must be an earlier lesson`);
  for (const l of f.learn) if (!learnIds.has(l)) err(`${at}: concept page ${l} missing`);
  for (const m of f.mods) if (!modIds.has(m)) err(`${at}: module ${m} missing`);
  for (const c of (f.compare || [])) if (!cmpIds.has(c)) err(`${at}: comparison ${c} missing`);
  if (!areaIds.has(f.area)) err(`${at}: unknown area`);
  if (f.takeaways.length < 3 || f.takeaways.length > 5) err(`${at}: 3 to 5 key takeaways expected`);
  if (f.check.length < 3) err(`${at}: at least 3 knowledge-check questions`);
  if (!f.teach || !f.teach.prompt || f.teach.points.length < 3) err(`${at}: teach-it-back needs a prompt and 3+ key points`);
  if (f.words.length < 3) warn(`${at}: fewer than 3 vocabulary entries`);
  if (f.explore) {
    if (!widgetKinds.has(f.explore.widget)) err(`${at}: unknown exploration widget ${f.explore.widget}`);
    if (f.explore.widget === 'sorter' && !C.SORTS[f.explore.data]) err(`${at}: sorter data ${f.explore.data} missing`);
  }
  try { const html = f.model(); if (typeof html !== 'string' || html.length < 50) err(`${at}: mental model did not render`); } catch (e) { err(`${at}: mental model threw ${e.message}`); }
  f.check.forEach((q, qi) => { checkQ(q, `${at} question ${qi + 1}`, { objId: q.obj }); if (!areaIds.has(q.area)) err(`${at} question ${qi + 1}: unknown area ${q.area}`); });
  const text = [f.problem, f.plain, f.concept, f.how, f.observe].join(' ');
  if (/\b(the model|AI) (thinks|wants|feels|believes|understands exactly)\b/i.test(text)) warn(`${at}: possible anthropomorphism in prose`);
});
const staged = C.FOUND_STAGES.flatMap(s => s.lessons);
if (staged.length !== C.FOUND.length || new Set(staged).size !== staged.length || staged.some(id => !foundIds.has(id))) err('Module 0 stages must list every lesson exactly once');

/* ---------------- comparisons, concepts, explorations ---------------- */
const FIELDS = ['concept', 'input', 'output', 'purpose', 'when', 'diff', 'not', 'example'];
for (const c of C.COMPARE) {
  const at = `Comparison ${c.id}`;
  if (c.items.length < 2 || c.items.length > 4) err(`${at}: 2 to 4 concepts expected`);
  for (const it of c.items) for (const f of FIELDS) if (!it[f]) err(`${at}: ${it.concept || '?'} missing ${f}`);
  if (!['exam', 'foundation'].includes(c.scope)) err(`${at}: scope must be exam or foundation`);
  if (c.scope === 'exam' && !c.objs.length) err(`${at}: exam-scope comparisons must name objectives`);
  for (const o of c.objs) if (!objIds.has(o)) err(`${at}: objective ${o} unknown`);
  if (!foundIds.has(c.lesson)) err(`${at}: lesson ${c.lesson} missing`);
  if (!c.takeaway) err(`${at}: missing AI-901 takeaway`);
}
function routeOk(r) {
  const m = r.match(/^#\/(f|m|learn|compare|obj)\/([\w.-]+)$/);
  if (!m) return false;
  return ({ f: foundIds, m: modIds, learn: learnIds, compare: cmpIds, obj: objIds })[m[1]].has(m[2]);
}
const cNames = new Set();
for (const c of C.CONCEPTS) {
  const at = `Concept "${c.n}"`;
  if (cNames.has(c.n)) err(`${at}: duplicate`); cNames.add(c.n);
  if (!areaIds.has(c.area)) err(`${at}: unknown area`);
  for (const o of c.objs) if (!objIds.has(o)) err(`${at}: objective ${o} unknown`);
  if (!routeOk(c.go)) err(`${at}: route ${c.go} does not resolve`);
  if (!c.in || !c.out || !c.def) err(`${at}: input, output and definition required`);
}
for (const [k, s] of Object.entries(C.SORTS)) s.items.forEach((it, i) => { if (!(it.a >= 0 && it.a < s.opts.length)) err(`Sorter ${k} item ${i}: answer out of range`); if (!it.why) err(`Sorter ${k} item ${i}: missing why`); });
C.PYREAD.forEach((p, i) => { if (!(p.a >= 0 && p.a < p.o.length)) err(`Python reading ${i}: answer out of range`); });

/* ---------------- links and wiring ---------------- */
const ALLOWED = /^https:\/\/(learn\.microsoft\.com|azure\.microsoft\.com|www\.microsoft\.com|ai\.azure\.com|portal\.azure\.com|aka\.ms|microsoftlearning\.github\.io|github\.com|aiskillsnavigator\.microsoft\.com|code\.visualstudio\.com|ncv\.microsoft\.com)(\/|$)/;
const urls = new Set();
for (const f of CONTENT_SCRIPTS) for (const m of readFileSync(join(root, f), 'utf8').matchAll(/https?:\/\/[^\s'"<>)`\\]+/g)) urls.add(m[0].replace(/[.,;]+$/, ''));
for (const u of urls) {
  if (u.length < 12 || /^http:\/\/www\.w3\.org\//.test(u)) continue; // fragments and XML namespaces, not links
  if (u.startsWith('http://')) err(`Insecure link: ${u}`);
  else if (!ALLOWED.test(u) && !/<resource>|&lt;|YOUR|<project>/.test(u)) warn(`Link outside the Microsoft allowlist: ${u}`);
}
const loaded = indexScripts();
for (const f of CONTENT_SCRIPTS) if (!loaded.includes(f)) err(`index.html does not load ${f}`);
if (!loaded.includes('assets/js/app.js')) err('index.html does not load assets/js/app.js');
try { execFileSync(process.execPath, [join(root, 'tools/build.mjs'), '--check'], { stdio: 'pipe' }); }
catch (e) { err('assets/js/app.js is out of date. Run: node tools/build.mjs'); }

/* ---------------- coverage matrix ---------------- */
const qsFor = (oid) => ({
  checks: [...C.MODULES.flatMap(m => m.quiz.map((q, i) => q.obj >= 0 && C.objKey(m.id, q.obj) === oid ? `m:${m.id}:${i}` : null)),
    ...C.FOUND.flatMap(f => f.check.map((q, i) => q.obj === oid ? `f:${f.id}:${i}` : null))].filter(Boolean),
  exam: C.EXAMQ.filter(q => [q.obj >= 0 ? C.objKey(q.mod, q.obj) : null, ...(q.pm || []).map(p => C.objKey(p[0], p[1]))].includes(oid)).map(q => q.id)
});
const matrix = C.OBJ.map(o => {
  const g = C.GROUPS.find(x => x.id === o.g), m = C.MODULES.find(x => x.id === o.mod), q = qsFor(o.id);
  const concepts = C.LEARN.filter(L => L.mods.includes(o.mod)).map(L => L.id);
  const exercise = (o.ex.labs || []).length || (o.ex.explore || []).length ? { labs: o.ex.labs || [], explorations: o.ex.explore || [] } : 'Exercise not applicable';
  let status = 'Covered';
  if (!m || !o.found.length) status = 'Missing';
  else if (!q.checks.length || !o.cmp.length) status = 'Partial';
  const review = (o.ex.labs || []).filter(l => { const mm = C.MODULES.find(x => x.id === l); return mm && !mm.verified; });
  return { id: o.id, objective: o.text, domain: g.domain, group: `${g.id} ${g.title}`, area: o.area, foundations: o.found, concepts, module: o.mod,
    microsoft: o.ms, comparisons: o.cmp, exercise, questions: q, status, needsReview: review.length ? `Lab ${review.join(', ')} not yet verified against a Microsoft exercise` : null, sources: o.src };
});
for (const r of matrix) if (r.status !== 'Covered') warn(`Objective ${r.id}: coverage ${r.status}`);
if (write) {
  mkdirSync(join(root, 'docs'), { recursive: true });
  writeFileSync(join(root, 'docs/coverage-matrix.json'), JSON.stringify({ exam: C.EXAM.code, outline: C.EXAM.outline, lastChecked: C.EXAM.lastChecked, objectives: matrix }, null, 2) + '\n');
  const md = ['# AI-901 objective coverage matrix', '', `Generated by \`node tools/validate.mjs\` from the content files. Skills outline: ${C.EXAM.outline}. Last checked against the live study guide: ${C.EXAM.lastChecked}.`, '',
    'Status: **Covered** = taught in an exam module, prepared by a Module 0 lesson, assessed by at least one knowledge-check question and linked to a comparison. **Partial** = one of those is missing. **Missing** = not taught.', '',
    '| ID | Objective | Foundations | Concepts | Module | Exercise | Checks | Exam items | Status | Needs review |', '|---|---|---|---|---|---|---|---|---|---|',
    ...matrix.map(r => `| ${r.id} | ${r.objective} | ${r.foundations.join(', ')} | ${r.concepts.join(', ') || '-'} | ${r.module} | ${typeof r.exercise === 'string' ? r.exercise : [...r.exercise.labs.map(l => 'Lab ' + l), ...r.exercise.explorations.map(x => 'Explore ' + x)].join(', ')} | ${r.questions.checks.length} | ${r.questions.exam.length} | ${r.status} | ${r.needsReview || '-'} |`), ''];
  writeFileSync(join(root, 'docs/coverage-matrix.md'), md.join('\n'));
}

/* ---------------- report ---------------- */
const qCount = C.MODULES.reduce((n, m) => n + m.quiz.length, 0) + C.FOUND.reduce((n, f) => n + f.check.length, 0);
console.log(`Objectives ${C.OBJ.length} | Module 0 lessons ${C.FOUND.length} | concept pages ${C.LEARN.length} | modules ${C.MODULES.length} | check questions ${qCount} | practice exam ${C.EXAMQ.length} | comparisons ${C.COMPARE.length} | concepts ${C.CONCEPTS.length}`);
console.log(`Coverage: ${matrix.filter(r => r.status === 'Covered').length} covered, ${matrix.filter(r => r.status === 'Partial').length} partial, ${matrix.filter(r => r.status === 'Missing').length} missing`);
warnings.forEach(w => console.log('WARNING ' + w));
errors.forEach(e => console.log('ERROR   ' + e));
console.log(errors.length ? `\n${errors.length} error(s).` : '\nNo errors.');
process.exit(errors.length ? 1 : 0);
