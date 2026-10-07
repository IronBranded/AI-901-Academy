// smoke.mjs - opens every route of the site in Chromium and exercises the main
// learner flows. Fails on any page error, console error, missing <h1> or empty page.
//   node tools/smoke.mjs
// Requires: npm install && npx playwright install chromium
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { root, loadContent } from './lib/load.mjs';

const C = loadContent();
const base = pathToFileURL(join(root, 'index.html')).href;
const routes = ['#/dash', '#/f', '#/learn', '#/obj', '#/compare', '#/prep', '#/review', '#/search', '#/search?q=ocr&in=image', '#/glossary', '#/cost', '#/exam', '#/ready',
  ...C.FOUND.map(f => '#/f/' + f.id), ...C.LEARN.map(l => '#/learn/' + l.id), ...C.MODULES.flatMap(m => ['#/m/' + m.id, '#/lab/' + m.id]),
  ...C.OBJ.map(o => '#/obj/' + o.id), ...C.COMPARE.map(c => '#/compare/' + c.id)];

const problems = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('pageerror', e => problems.push(`page error on ${page.url().split('#')[1]}: ${e.message}`));
page.on('console', m => { if (m.type() === 'error') problems.push(`console error on ${page.url().split('#')[1]}: ${m.text()}`); });

await page.goto(base + '#/dash');
await page.evaluate(() => localStorage.clear());
for (const r of routes) {
  await page.goto(base + r);
  await page.waitForTimeout(60);
  const h1 = await page.locator('#content h1').count();
  const len = (await page.innerText('#content')).length;
  if (!h1) problems.push(`${r}: no h1`);
  if (len < 200) problems.push(`${r}: page looks empty (${len} chars)`);
  if ((r.startsWith('#/m/') || r.startsWith('#/f/')) && !(await page.locator('#content h2[data-shape="problem"]').count())) problems.push(`${r}: lesson does not open with "The problem"`);
}
console.log(`Rendered ${routes.length} routes.`);

/* Phone width: no page may scroll sideways (wide tables and code scroll inside their own boxes).
   320 CSS px is the WCAG 2.1 reflow width (1.4.10) and the narrowest common phone; no
   breakpoint sits between 320 and 360, so passing here covers 360px phones as well.
   Run twice: once with this machine's fonts, and once with a deliberately wide font
   (Verdana on Windows/macOS, DejaVu Sans on Linux). Line breaks depend on glyph widths,
   so a layout that fits with Segoe UI or Inter can still overflow with the wider
   DejaVu Sans that GitHub's Ubuntu runners use. The second pass makes every machine
   catch what CI catches, and it stands in for a reader who has set a wider font. */
const WIDE_FONTS = ':root{--face-ui:Verdana,"DejaVu Sans",sans-serif !important;--face-body:Verdana,"DejaVu Sans",sans-serif !important;' +
  '--face-display:Verdana,"DejaVu Sans",sans-serif !important;--face-serif:Georgia,"DejaVu Serif",serif !important;' +
  '--face-mono:"Courier New","DejaVu Sans Mono",monospace !important}';
const PHONE = 320;
const phoneCtx = await browser.newContext({ viewport: { width: PHONE, height: 800 } });
const phone = await phoneCtx.newPage();
const wideCtx = await browser.newContext({ viewport: { width: PHONE, height: 800 } });
await wideCtx.addInitScript(css => {
  const add = () => { const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); };
  document.head ? add() : document.addEventListener('DOMContentLoaded', add);
}, WIDE_FONTS);
const wide = await wideCtx.newPage();
for (const [label, p] of [['', phone], [' with wide fonts', wide]]) {
  for (const r of routes) {
    await p.goto(base + r);
    await p.waitForTimeout(40);
    const w = await p.evaluate(() => document.documentElement.scrollWidth);
    if (w > PHONE + 1) problems.push(`${r}: page scrolls sideways at ${PHONE}px${label} (${w}px wide)`);
  }
}
await phoneCtx.close(); await wideCtx.close();
console.log(`Checked ${routes.length} routes at ${PHONE}px, with system and wide fonts.`);

/* Flow 1: a foundation knowledge check, with one wrong answer */
await page.goto(base + '#/f/00-01');
const f = C.FOUND[0];
for (let i = 0; i < f.check.length; i++) await page.check(`input[data-set="f:00-01"][data-qi="${i}"][value="${i === 0 ? (f.check[0].a + 1) % 4 : f.check[i].a}"]`);
await page.click('button[data-act="check"][data-set="f:00-01"]');
const fb = await page.locator('.fb').count();
if (fb !== f.check.length) problems.push(`Flow: expected ${f.check.length} feedback blocks, got ${fb}`);
for (const label of ['Correct answer', 'Why', 'Scenario clue', 'Objective']) if (!(await page.locator('.fb dt', { hasText: label }).count())) problems.push(`Flow: feedback lacks "${label}"`);

/* Flow 2: an exploration marks the lesson practiced */
await page.goto(base + '#/f/00-04');
for (const fs of await page.locator('.sort__item').all()) await fs.locator('input[type="radio"]').first().check();
const practiced = await page.evaluate(() => !!JSON.parse(localStorage.getItem('ai901.progress.v2')).practiced['f:00-04']);
if (!practiced) problems.push('Flow: completing the 00-04 sorter did not record Practiced');

/* Flow 3: Exam Prep from Needs review */
await page.goto(base + '#/prep?mode=review');
await page.click('button[data-act="pstart"]');
await page.locator('input[name="pq"]').first().check();
await page.click('button[data-act="panswer"]');
if (!(await page.locator('.fb').count())) problems.push('Flow: Exam Prep did not show feedback');

/* Flow 4: practice exam submit */
await page.goto(base + '#/exam');
await page.click('button[data-act="xstart"][data-mode="d2"]');
await page.click('button[data-act="xsubmit"]'); await page.click('button[data-act="xsubmit"]');
try { await page.waitForSelector('.gauge__big', { timeout: 3000 }); } catch (e) { problems.push('Flow: practice exam results did not render'); }

/* Flow 5: search and palette */
await page.goto(base + '#/search?q=object%20detection');
if (!(await page.locator('.sr').count())) problems.push('Flow: search returned nothing for "object detection"');
await page.keyboard.press('Control+k');
await page.keyboard.type('TTS');
if (!(await page.locator('.pal__item').count())) problems.push('Flow: palette returned nothing for "TTS"');

/* Flow 6: v1 progress migrates. A fresh context seeds only v1 storage before
   the app's scripts run, so nothing from the earlier flows can race it. */
const ctx2 = await browser.newContext();
await ctx2.addInitScript(() => {
  if (sessionStorage.getItem('seeded')) return;
  localStorage.clear();
  localStorage.setItem('ai901.progress.v1', JSON.stringify({ v: 1, read: { '00-01': true }, learned: {}, steps: {}, quiz: {}, misses: {}, exam: { cur: null, hist: [] }, review: false, updatedAt: Date.now() }));
  sessionStorage.setItem('seeded', '1');
});
const page2 = await ctx2.newPage();
page2.on('pageerror', e => problems.push(`page error during migration: ${e.message}`));
await page2.goto(base + '#/dash'); await page2.waitForTimeout(150);
const mig = await page2.evaluate(() => JSON.parse(localStorage.getItem('ai901.progress.v2') || 'null'));
if (!mig || !mig.studied['m:ENV']) problems.push('Flow: v1 progress did not migrate (00-01 read should become ENV studied)');
await ctx2.close();

await browser.close();
problems.forEach(p => console.log('PROBLEM ' + p));
console.log(problems.length ? `${problems.length} problem(s).` : 'Smoke test passed.');
process.exit(problems.length ? 1 : 0);
