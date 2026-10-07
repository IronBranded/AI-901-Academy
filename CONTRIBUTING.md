# Contributing to AI-901 Academy

The Academy has one job: help a beginner understand, retain, distinguish, practise and review what Exam AI-901 measures. Two rules decide every change.

- **The official AI-901 skills measured decide WHAT is taught.** If an objective does not require it, it does not go in the main path. Useful extras are labelled *Beyond the exam*.
- **Beginner-first teaching decides HOW it is taught.** Problem first, then the capability in plain English, then the mental model, then the terminology, then the Microsoft implementation, then practice, then exam reasoning.

## Before you write

1. Find the objective in [`assets/js/content/objectives.js`](assets/js/content/objectives.js). If your change does not support one of the 29 objectives or a prerequisite for one, it probably does not belong.
2. Read the current Microsoft Learn source for it: the [study guide](https://learn.microsoft.com/credentials/certifications/resources/study-guides/ai-901), the AI-901 learning paths, then product documentation. Microsoft Learn decides what is currently true; the Academy decides how it is taught.
3. Compare with what the Academy says now. If they conflict, fix the Academy, record the source, and search for the same assumption in other lessons, questions, comparisons, labs and diagrams.
4. If Microsoft sources disagree with each other, do not pick the one that suits the lesson. Teach the behaviour both agree on and add a visible discrepancy note (see the guardrail threshold note in module 01-01), then log it in [`docs/CONTENT-REVIEW.md`](docs/CONTENT-REVIEW.md).

Never invent objectives, weights, capabilities, API or SDK syntax, CLI flags, limits, prices, availability, responsible-AI requirements or exam questions. If you cannot verify something, mark it *Needs verification* rather than presenting it as fact.

## Lesson anatomy

Module 0 lessons (`assets/js/content/foundations/*.js`) follow the full sequence and the validator enforces it:

| Field | Section the learner sees |
|---|---|
| `outcomes` | What you need to know |
| `problem` | The problem: a real situation, before any terminology |
| `plain` | In plain English |
| `example` | Concrete example |
| `words` | Words you need to know: `[term, "for now, think of it as"]` pairs, introduced just in time |
| `model` | Mental model: a function returning a diagram (use `vIPO` or `vAgent` from `vis.js`), with a text alternative |
| `concept`, `how` | The AI concept, then how it works, adding depth only as needed |
| `ms` | Microsoft translation: which current Microsoft technology implements it |
| `compare`, `distinctions` | Comparison ids from `compare.js`, and what learners confuse |
| `rai` | Responsible AI lens, tied to this example |
| `scenario` | An objective-aligned scenario |
| `explore`, `observe` | Hands-on exploration in the browser (`explore.js` widget), and what to notice |
| `check` | Knowledge check (see below) |
| `teach` | Teach it back: a prompt plus the points a good answer covers |
| `takeaways` | 3 to 5 key points |
| `supports`, `prereq`, `learn`, `mods` | Objectives supported, prerequisite lessons, related Concepts pages and modules (drives breadcrumbs and Next step) |

Exam modules (`modules.js`) open with a problem-first opener from `MODULE_INTRO` at the end of that file (`problem`, `plain`, an `ipo` mental model and its `cap`tion), then the objectives they cover (from the registry), an Exam Lens, "New to this?" links to Module 0, and the comparisons for those objectives. Only after that comes the exam-depth material: why this exists, how it works, configuration, failure modes, scenario clues, validation and sources.

### Writing rules

- Start with what someone is trying to do, not with a product name.
- Name inputs and outputs explicitly: *a photo goes in; a list of objects with their positions comes out*.
- An analogy is a temporary bridge. Always return to the real concept, and never imply that a model thinks, knows, intends or feels. Prefer *the model generates*, *the output*, *the prediction*, *the configured behaviour*.
- Generated output can be wrong. Never present it as factual by default.
- Code is never the barrier: say in plain English what it does, show it complete, explain the important lines, identify input, service call and output, and say what to observe.
- No decorative "futuristic AI" imagery. A visual must make something faster to understand.
- Do not copy Microsoft documentation. Use it to be correct, then teach in original words.

## Knowledge-check questions

Every question needs all of these; `npm run validate` fails otherwise.

```js
{ q: 'A retailer needs to find every product on a shelf photo and where each one is. Which technique?',
  o: ['Image classification', 'Object detection', 'Optical character recognition', 'Image generation'],
  a: 1,                                   // index of the correct option
  obj: 3,                                 // module quizzes: index into the module's objectives
                                          // Module 0 checks: an objective id such as '1.3.4'
  why: 'Location plus label is object detection. Classification labels the image as a whole.',
  not: ['Classification gives one label for the whole image, with no locations.', '',
        'OCR reads printed text, not products.', 'Nothing new should be created.'],   // '' at the correct index
  clue: '"every product" and "where each one is"',   // the words in the scenario that decide it
  misc: 'Image classification can count and locate objects.' }   // optional: the misconception tested
```

- Test a decision (which capability, which input and output, which concern), not a definition.
- Distractors must be plausible and wrong for a real conceptual reason, never because they are absurd.
- Write original scenarios only. Never use exam dumps, recalled exam questions or leaked material.

Practice-exam items live in `exam.js` (`EXAMQ`) and use `mod` plus `obj` (objective index) with the same `why`, `not` and `clue` fields.

## Comparisons and the concept index

- `compare.js`: each comparison lists items with `concept, input, output, purpose, when, diff, not, example`, plus the objectives it supports (`objs`) and a `takeaway`. Add one when learners genuinely confuse two things an objective requires them to distinguish.
- `concepts.js`: one entry per searchable concept with `n` (name), `aka` (acronyms and synonyms), `area`, `in`, `out`, `def`, `objs` and `go` (the route that teaches it). This is what search by input or output type uses.

## Editing the runtime

Edit `assets/js/app/*.js`, never `assets/js/app.js` directly. Then:

```powershell
npm run build
npm test
```

Keep it dependency-free: no frameworks, no CDN scripts, no build step that GitHub Pages would need.

## When the exam changes

The *Objective freshness* workflow runs weekly and opens an issue labelled `objective-drift` when the live study guide differs from `objectives.js`. You can run it yourself with `npm run check:objectives`.

1. Read the new skills measured and note added, removed, reworded and moved objectives.
2. Classify every affected lesson, question, comparison and lab as **Current**, **Needs update**, **Foundation** (no longer measured but needed to understand current material), **Beyond the exam** or **Obsolete**. Do not delete material only because an objective moved.
3. Update `EXAM.outline`, `EXAM.lastChecked`, `GROUPS` and `OBJ`, then the affected content, keeping objective text verbatim.
4. Run `npm run validate` and read the regenerated `docs/coverage-matrix.md`: every objective should be Covered.
5. Record what changed and why in `docs/CONTENT-REVIEW.md`.

## Checks before you push

```powershell
npm test   # build check, content validation, every route renders, accessibility
```

Accessibility expectations are in [`docs/ACCESSIBILITY.md`](docs/ACCESSIBILITY.md).
