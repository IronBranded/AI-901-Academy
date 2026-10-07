// check-objectives.mjs - compares the Academy's objective registry
// (assets/js/content/objectives.js) with the live AI-901 study guide and reports drift:
// a new "skills measured" date, changed domain weights, and objectives that were
// added, removed, reworded or moved to another group.
//
//   node tools/check-objectives.mjs                 fetch the live study guide
//   node tools/check-objectives.mjs --file page.html  check a saved copy (HTML or Markdown)
//   node tools/check-objectives.mjs --report drift.md  also write the report to a file
//
// Exit codes: 0 no drift, 1 drift found (review needed), 2 the page could not be read
// or parsed (the page layout may have changed: check by hand).
//
// The script never edits content. Drift is a prompt for a person to review the
// study guide and update objectives.js, the lessons and the questions deliberately
// (see CONTRIBUTING.md, "When the exam changes").
import { readFileSync, writeFileSync } from 'node:fs';
import { loadContent } from './lib/load.mjs';

const args = process.argv.slice(2);
const opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const C = loadContent();
const url = opt('--url') || 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-901';

/* ---------- read the page ---------- */
let raw;
try {
  if (opt('--file')) raw = readFileSync(opt('--file'), 'utf8');
  else {
    const res = await fetch(url, { headers: { 'user-agent': 'ai-901-academy-objective-check', 'accept-language': 'en-US' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    raw = await res.text();
  }
} catch (e) {
  console.error(`Could not read the study guide (${e.message}). Check ${url} by hand.`);
  process.exit(2);
}

/* ---------- HTML or Markdown -> lines of "#..# heading" and "- bullet" ---------- */
function toLines(src) {
  if (/<html|<h2|<li/i.test(src)) {
    src = src
      .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, '')
      .replace(/<h([1-6])[^>]*>/gi, (m, n) => '\n' + '#'.repeat(+n) + ' ')
      .replace(/<\/h[1-6]>/gi, '\n')
      .replace(/<li[^>]*>/gi, '\n- ')
      .replace(/<\/(li|p|div|ul|ol|tr|table|section)>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"').replace(/&#39;|&#x27;|&rsquo;/g, "'").replace(/&ndash;/g, '–')
      .replace(/&#(\d+);/g, (m, n) => String.fromCharCode(+n));
  }
  return src.split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean);
}
const norm = s => s.toLowerCase().replace(/[‐-―]/g, '-').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').replace(/[.\s]+$/, '').trim();

const lines = toLines(raw);
const start = lines.findIndex(l => /^#+ .*skills measured as of /i.test(l));
if (start < 0) { console.error('Could not find a "Skills measured as of ..." heading. The page layout may have changed: check by hand.'); process.exit(2); }
const liveDate = lines[start].replace(/^#+ .*skills measured as of /i, '').trim();
const otherVersions = lines.filter((l, i) => i !== start && /^#+ .*skills measured/i.test(l));

const live = { domains: [], groups: [], objectives: [] };
let domain = null, group = null;
for (let i = start + 1; i < lines.length; i++) {
  const l = lines[i];
  if (/^#+ .*(skills measured|study resources|change log)/i.test(l)) break;
  const h = l.match(/^(#+) (.+)$/);
  if (h) {
    const text = h[2];
    const w = text.match(/^(.+?)\s*\((\d+)\s*[–-]\s*(\d+)\s*%\)\s*$/);
    if (w) { domain = { name: w[1].trim(), weight: `${w[2]}-${w[3]}%` }; live.domains.push(domain); group = null; }
    else if (domain && !/audience profile|skills at a glance/i.test(text)) { group = { title: text, domain: domain.name }; live.groups.push(group); }
    else group = null;
    continue;
  }
  if (l.startsWith('- ') && group) live.objectives.push({ text: l.slice(2).trim(), group: group.title });
}
if (live.domains.length < 2 || live.objectives.length < 10) {
  console.error(`Parsed only ${live.domains.length} domain(s) and ${live.objectives.length} objective(s). The page layout may have changed: check by hand.`);
  process.exit(2);
}

/* ---------- compare ---------- */
const report = [];
const add = s => report.push(s);
const ours = {
  domains: C.EXAM.domains.filter(d => d.id !== '00'),
  groups: C.GROUPS,
  objectives: C.OBJ.map(o => ({ id: o.id, text: o.text, group: C.GROUPS.find(g => g.id === o.g).title }))
};
const words = s => new Set(norm(s).split(/[^a-z0-9]+/).filter(w => w.length > 2));
const sim = (a, b) => { const A = words(a), B = words(b); let n = 0; A.forEach(w => { if (B.has(w)) n++; }); return n / Math.max(1, new Set([...A, ...B]).size); };

if (norm(liveDate) !== norm(C.EXAM.outline)) add(`- **Outline date changed:** the study guide now says "Skills measured as of ${liveDate}"; the Academy is built on ${C.EXAM.outline}.`);
if (otherVersions.length) add(`- **Note:** the page lists more than one version of the skills measured (${otherVersions.map(v => `"${v.replace(/^#+ /, '')}"`).join(', ')}). Check which one applies to learners and when.`);

for (const d of live.domains) {
  const m = ours.domains.find(o => norm(o.name) === norm(d.name));
  if (!m) add(`- **Domain added or renamed:** "${d.name}" (${d.weight}).`);
  else if (norm(m.weight) !== norm(d.weight)) add(`- **Domain weight changed:** "${d.name}" is now ${d.weight} (Academy: ${m.weight}).`);
}
for (const d of ours.domains) if (!live.domains.some(l => norm(l.name) === norm(d.name))) add(`- **Domain removed or renamed:** "${d.name}".`);

for (const g of live.groups) if (!ours.groups.some(o => norm(o.title) === norm(g.title))) add(`- **Objective group added or renamed:** "${g.title}" (in "${g.domain}").`);
for (const g of ours.groups) if (!live.groups.some(l => norm(l.title) === norm(g.title))) add(`- **Objective group removed or renamed:** ${g.id} "${g.title}".`);

const liveBy = new Map(live.objectives.map(o => [norm(o.text), o]));
const oursBy = new Map(ours.objectives.map(o => [norm(o.text), o]));
for (const o of ours.objectives) {
  const l = liveBy.get(norm(o.text));
  if (!l) {
    const best = live.objectives.filter(x => !oursBy.has(norm(x.text))).map(x => ({ x, s: sim(o.text, x.text) })).sort((a, b) => b.s - a.s)[0];
    add(best && best.s >= 0.5
      ? `- **Objective reworded:** ${o.id} "${o.text}"\n  now reads "${best.x.text}" (in "${best.x.group}").`
      : `- **Objective removed:** ${o.id} "${o.text}". Classify its lessons and questions (Current, Needs update, Foundation, Beyond the exam or Obsolete) before changing them.`);
  } else if (norm(l.group) !== norm(o.group)) add(`- **Objective moved:** ${o.id} "${o.text}" is now under "${l.group}" (Academy: "${o.group}").`);
}
for (const l of live.objectives) {
  if (oursBy.has(norm(l.text))) continue;
  const reworded = ours.objectives.some(o => !liveBy.has(norm(o.text)) && sim(o.text, l.text) >= 0.5);
  if (!reworded) add(`- **Objective added:** "${l.text}" (in "${l.group}"). It needs a lesson, an Exam Lens, a check and a coverage entry.`);
}

/* ---------- output ---------- */
const head = `# AI-901 objective check\n\nSource: ${opt('--file') || url}\nChecked: ${new Date().toISOString().slice(0, 10)}\nLive outline: skills measured as of ${liveDate} (${live.domains.length} domains, ${live.groups.length} groups, ${live.objectives.length} objectives)\nAcademy outline: ${C.EXAM.outline} (${ours.domains.length} domains, ${ours.groups.length} groups, ${ours.objectives.length} objectives)\n`;
const body = report.length
  ? `\n## Drift found\n\n${report.join('\n')}\n\nNext: read the study guide, then update assets/js/content/objectives.js, the affected lessons, questions and comparisons, and run \`npm test\`. Do not delete material only because an objective moved; classify it first.\n`
  : `\nNo drift: every domain, group and objective matches the Academy's registry.\n`;
console.log(head + body);
if (opt('--report')) writeFileSync(opt('--report'), head + body);
process.exit(report.length ? 1 : 0);
