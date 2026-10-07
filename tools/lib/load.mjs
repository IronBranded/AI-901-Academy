// load.mjs - loads the Academy's content scripts into a sandbox so tools can
// inspect them without a browser. The content files are plain scripts that
// define globals, in the same order index.html loads them.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export const CONTENT_SCRIPTS = [
  'assets/js/content/helpers.js',
  'assets/js/content/objectives.js',
  'assets/js/content/vis.js',
  'assets/js/content/modules.js',
  'assets/js/content/diagrams.js',
  'assets/js/content/learn.js',
  'assets/js/content/exam.js',
  'assets/js/content/foundations/f1-basics.js',
  'assets/js/content/foundations/f2-workloads.js',
  'assets/js/content/foundations/f3-genai.js',
  'assets/js/content/foundations/f4-blocks.js',
  'assets/js/content/foundations/explore-data.js',
  'assets/js/content/compare.js',
  'assets/js/content/concepts.js',
  'assets/js/explore.js'
];

export function loadContent() {
  const ctx = { console };
  ctx.window = ctx;
  vm.createContext(ctx);
  for (const f of CONTENT_SCRIPTS) vm.runInContext(readFileSync(join(root, f), 'utf8'), ctx, { filename: f });
  vm.runInContext(`this.__ = { EXAM, OBJ, GROUPS, AREAS, MODULES, LEARN, EXAMQ, CASES, FOUND, FOUND_STAGES, SORTS, CODEWALK, PYREAD, COMPARE, CONCEPTS, FIGURES,
    objKey, objById, Explore: window.Explore };`, ctx);
  return ctx.__;
}

export function indexScripts() {
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  return [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
}
