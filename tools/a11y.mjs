// a11y.mjs - automated accessibility checks with axe-core (WCAG 2.1 A and AA rules)
// across representative pages, both colour themes, desktop and phone widths, and
// interactive states (marked knowledge check, open search palette).
//   node tools/a11y.mjs
// Fails on "serious" or "critical" violations; lists "moderate" ones as warnings.
// Automated checks find only part of the accessibility picture: keyboard and
// screen-reader passes are still needed (see docs/ACCESSIBILITY.md).
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { root } from './lib/load.mjs';

const axeSrc = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const base = pathToFileURL(join(root, 'index.html')).href;
const routes = ['#/dash', '#/f', '#/f/00-01', '#/f/00-03', '#/f/00-05', '#/f/00-06', '#/f/00-09', '#/f/00-12', '#/f/00-13', '#/f/00-15', '#/learn/L3', '#/m/01-03', '#/m/02-01', '#/lab/02-02',
  '#/obj', '#/obj/1.3.4', '#/compare/vision-tasks', '#/prep', '#/review', '#/search?q=speech', '#/glossary', '#/exam'];
const configs = [{ theme: 'dark', width: 1280 }, { theme: 'light', width: 1280 }, { theme: 'light', width: 390 }];

let fail = 0, warnN = 0;
const seen = new Map();
const browser = await chromium.launch();
async function audit(page, label) {
  await page.addScriptTag({ content: axeSrc });
  const res = await page.evaluate(async () => await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } }));
  for (const v of res.violations) {
    const key = v.id + '|' + v.nodes.map(n => n.target.join(' ')).slice(0, 3).join(',');
    if (seen.has(key)) continue; seen.set(key, true);
    const serious = v.impact === 'serious' || v.impact === 'critical';
    if (serious) fail++; else warnN++;
    console.log(`${serious ? 'FAIL' : 'WARN'} [${v.impact}] ${v.id} on ${label}: ${v.help}`);
    v.nodes.slice(0, 3).forEach(n => console.log('       ' + n.target.join(' ') + (n.failureSummary ? ' :: ' + n.failureSummary.split('\n').slice(1, 2).join(' ').trim() : '')));
  }
}
for (const cfg of configs) {
  const ctx = await browser.newContext({ viewport: { width: cfg.width, height: 900 }, colorScheme: cfg.theme });
  const page = await ctx.newPage();
  for (const r of routes) {
    await page.goto(base + r); await page.waitForTimeout(80);
    await audit(page, `${r} (${cfg.theme}, ${cfg.width}px)`);
  }
  if (cfg.width > 800) {
    await page.goto(base + '#/f/00-05');
    for (let i = 0; i < 3; i++) await page.check(`input[data-set="f:00-05"][data-qi="${i}"][value="0"]`);
    await page.click('button[data-act="check"][data-set="f:00-05"]');
    await audit(page, `marked knowledge check (${cfg.theme})`);
    await page.keyboard.press('Control+k'); await page.keyboard.type('vision');
    await audit(page, `search palette open (${cfg.theme})`);
  }
  await ctx.close();
}
await browser.close();
console.log(`\n${fail} serious/critical, ${warnN} moderate/minor issue(s) across ${routes.length} routes x ${configs.length} configurations.`);
process.exit(fail ? 1 : 0);
