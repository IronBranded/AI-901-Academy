# Architecture

AI-901 Academy is a static single-page site. GitHub Pages serves the repository root exactly as committed (`.nojekyll` turns off Jekyll processing). There is no server, no bundler and no runtime dependency: the browser loads plain scripts from `index.html`, and everything the learner does is stored in the browser.

## Files

```
index.html                     page shell: top bar, sidebar, content area, search palette
assets/css/
  tokens.css                   colour, type and spacing tokens, light and dark themes
  layout.css                   page grid, sidebar, top bar, mobile layout
  components.css               callouts, tables, quizzes, labs, diagrams (original components)
  app.css                      dashboard, cost planner, practice exam, visual tables
  academy.css                  Module 0, objectives, Exam Lens, comparisons, prep, search, review
assets/js/
  highlight.js                 tiny syntax highlighter for code samples
  content/                     ALL learner-facing content, as plain data
    helpers.js                 escH, C (code), S (section), Q (callout), T (table), L (link)
    objectives.js              EXAM, AREAS, GROUPS, SRC, OBJ: the single source of objective truth
    vis.js                     small SVG/HTML visual builders (input-process-output, agent loop)
    modules.js                 MODULES: ENV plus the 8 exam modules, their labs and checks
    diagrams.js                FIGURES and the interactive widgets (threshold, temperature)
    learn.js                   LEARN: the 8 Concepts pages, 49 units
    exam.js                    EXAMQ and CASES: the practice exam
    foundations/f1..f4-*.js    FOUND: Module 0 lessons 00-01 to 00-17
    foundations/explore-data.js data for the in-browser explorations (sorters, code walks)
    compare.js                 COMPARE: reusable comparison tables
    concepts.js                CONCEPTS: searchable concept index with input and output types
  explore.js                   window.Explore: the in-browser exploration widgets
  app/01-state.js .. 08-shell.js   the runtime, in parts (edit these)
  app.js                       GENERATED from app/*.js by tools/build.mjs (commit it)
tools/                         Node scripts for development and CI only
docs/                          architecture, review notes and the generated coverage matrix
.github/workflows/             validate.yml (every push) and freshness.yml (weekly)
```

Content files define globals (`var MODULES = [...]`) and must load in the order `index.html` lists them, because later files use helpers and the objective registry from earlier ones. `tools/lib/load.mjs` loads the same files in the same order into a Node sandbox so the tools can inspect content without a browser.

## The objective registry

`assets/js/content/objectives.js` is the only place that stores objective text. Each of the 29 entries in `OBJ` holds the verbatim objective, its group, the module that teaches it, its concept area, its Exam Lens bullets, its Microsoft implementation in one line, the Module 0 lessons that prepare for it, the comparisons that sharpen it, its exercises (or why none fits) and the Microsoft Learn pages it was checked against.

Academy objective IDs such as `2.1.3` are built from the order of the outline (domain, group, item). Microsoft does not publish identifiers. Modules call `objectivesFor(moduleId)` instead of repeating objective text, questions refer to objectives by module and index (`objKey`), and the validator fails if anything points at an objective that does not exist.

## Runtime

The runtime in `assets/js/app/` is one closure split across eight files, concatenated in file-name order by `tools/build.mjs` into `assets/js/app.js`. Edit the parts, then run `npm run build`; CI fails if `app.js` is out of date.

| Part | Responsibility |
|---|---|
| `01-state.js` | progress state, storage, v1 migration, the question bank `QB`, answer log, evidence and objective status |
| `02-components.js` | shared HTML builders: chips, Exam Lens, knowledge checks with full explanations, Teach it back |
| `03-path.js` | the learning path, "what to study next", dashboard, Module 0 lessons |
| `04-modules.js` | exam modules, labs, Concepts pages, glossary, cost planner |
| `05-objectives.js` | objective map, objective pages, comparisons, coverage, Review page |
| `06-prep-search.js` | Exam Prep sessions and search (concepts, input/output types, acronyms, objectives) |
| `07-exam.js` | practice exam |
| `08-shell.js` | routing, sidebar, contextual meta panel, events, search palette, theme, boot |

`window.Academy` exposes `state`, `objStatus`, `QB`, `coverage` and `PATH` for debugging and for the browser tests.

### Routes

Hash routes, so GitHub Pages needs no server configuration:

`#/dash`, `#/f` and `#/f/00-01`, `#/learn` and `#/learn/L1`, `#/m/01-03`, `#/lab/01-03`, `#/obj` and `#/obj/1.3.4`, `#/compare` and `#/compare/vision-tasks`, `#/prep` (optionally `?obj=1.3.4`, `?area=vision` or `?mode=review`), `#/review`, `#/search?q=ocr&in=image&out=text`, `#/glossary`, `#/cost`, `#/exam`. The old `#/ready` route redirects to `#/review`. A `#anchor` after a route scrolls to a section.

### Progress model

Stored under the local-storage key `ai901.progress.v2`. Older `ai901.progress.v1` records are migrated on load (module `00-01` became `ENV`). When the page runs inside a host that provides `window.claude` storage (a claude.ai artifact), `initSync` also mirrors progress there; on GitHub Pages that code does nothing and progress stays in the browser.

| Field | Meaning |
|---|---|
| `studied` | lessons the learner marked as studied (`f:00-03`, `l:L2`, `m:01-03`) |
| `practiced` | explorations completed (`f:00-04`) |
| `steps` | lab steps ticked |
| `ans` | answer log per question key, each entry `{ ok, s: source, t: time }` |
| `quiz` | last submitted answers per knowledge check |
| `bm` | Review later bookmarks |
| `tb` | Teach it back reveals |
| `exam` | practice exam in progress and history |
| `prep` | Exam Prep session in progress |

Objective status is computed from evidence, never from page views:

- **Studied**: the module that teaches the objective was marked studied.
- **Practiced**: a lab for it is complete or one of its explorations was done (not applicable where no exercise fits).
- **Knowledge checked**: a knowledge-check answer for it is correct and none is currently wrong.
- **Applied**: answered correctly in Exam Prep or the practice exam.
- **Retained**: answered correctly on two different days.
- **Needs review**: the latest answer to any of its questions is wrong.

## Tooling

| Command | What it does |
|---|---|
| `npm run build` | rebuilds `assets/js/app.js` from its parts |
| `npm run validate` | checks content structure, objective links, question explanations, links and HTML, and writes `docs/coverage-matrix.json` and `.md` |
| `npm run test:smoke` | opens every route in Chromium, checks that no page scrolls sideways at 360 px, and exercises the main flows |
| `npm run test:a11y` | axe-core WCAG 2.1 A/AA checks in both themes, desktop and phone |
| `npm run check:objectives` | compares `objectives.js` with the live study guide |
| `npm test` | build check, validation, smoke and accessibility |
