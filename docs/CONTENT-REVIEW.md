# Content review

Review of the AI-901 Academy content against the current AI-901 skills measured and Microsoft Learn, carried out during the beginner-first redesign (October 2026). Keep this file current: add an entry whenever content is corrected against a source, a discrepancy is found, or the outline changes.

- **Outline reviewed against:** skills measured as of April 15, 2026 ([study guide](https://learn.microsoft.com/credentials/certifications/resources/study-guides/ai-901)), retrieved 2026-10-06 and again 2026-10-07.
- **Technical sources:** the AI-901 Microsoft Learn learning paths and modules, and Microsoft Foundry, Azure AI and Responsible AI documentation, retrieved through the Microsoft Learn MCP server. Each objective in `assets/js/content/objectives.js` lists the pages it was checked against.
- **Criteria:** beginner accessibility, problem first, mental model, vocabulary, progressive depth, technical accuracy, conceptual accuracy, Microsoft mapping, AI-901 alignment, practical learning, assessment quality, retention.

## 1. Objective drift

No drift. The live outline has the same 2 domains (Identify AI concepts and capabilities, 40–45%; Implement AI solutions by using Microsoft Foundry, 55–60%), 7 objective groups and 29 objectives as the Academy's registry, word for word. `npm run check:objectives` and the weekly *Objective freshness* workflow repeat this check.

Notes from the study guide page itself:

- It says it includes two versions of the skills measured "depending on when you are taking the exam", but shows only the April 15, 2026 version. The drift check reports a second version if one appears.
- Its *Study resources* table still links to AI-900-era documentation (Anomaly Detector, Language Understanding, Azure Bot Service, Azure Machine Learning, Computer Vision). These links do not define the exam's scope and are not used as sources. The dashboard tells learners this.

## 2. Changes made

### Critical

| # | Where | Problem | Fix |
|---|---|---|---|
| C1 | 01-01 callout, configuration table and threshold widget | Said that loosening content filters below the default requires Microsoft approval. Current Foundry documentation: every customer can set Low, Medium or High; approval is needed only to turn filtering off or to annotate only. | Corrected in all three places. The teaching now reasons from what each threshold flags (Low flags low, medium and high) instead of from a label. |
| C2 | Practice exam x01 | The explanation relied on the label "strictest" for Low, which current documentation contradicts (see D1). | Explanation rewritten to state the behaviour, which both sources agree on. |

### High value

| # | Problem | Fix |
|---|---|---|
| H1 | No path for beginners: modules started at exam depth with product vocabulary. | Module 0, *Before we build AI*: 17 lessons (00-01 to 00-17) in the full lesson anatomy, each with an in-browser exploration, a knowledge check and Teach it back. |
| H2 | Exam modules opened with mechanism and product names ("Why this exists"). | Every module now opens with **The problem**, **In plain English** and an input → capability → output **Mental model** before any Microsoft terminology. Enforced by the validator. |
| H3 | Lab-environment module used id `00-01`, colliding with Module 0 lesson numbering. | Renamed `ENV`; saved progress migrates automatically (v1 → v2). |
| H4 | Objective text repeated in each module; mappings could drift apart. | One registry (`objectives.js`) with verbatim text, Exam Lens, Microsoft implementation, prerequisites, comparisons, exercises and sources per objective. |
| H5 | Knowledge-check feedback gave only a short "why". | All 104 knowledge-check questions now have why, why not each other option, the scenario clue and the objective, and 31 name the misconception tested. All 37 practice-exam items have a scenario clue, and the 27 single- and multiple-choice items explain why not each other option. 10 questions were added where an objective had thin assessment. |
| H6 | The Readiness page reduced progress to one "% of exam weight verified" figure, easy to read as a pass prediction. | Replaced by per-objective evidence (Studied, Practiced, Knowledge checked, Applied, Retained, Needs review) and a Review page. No score prediction anywhere. |
| H7 | Security-investigation material (KQL tables, investigation notes) sat inline in exam modules. | Kept for practitioners but collapsed under *Beyond the exam* and labelled as outside the AI-901 outline. |
| H8 | No structured comparisons for commonly confused capabilities. | 17 comparison tables, each linked from the objectives they sharpen. |
| H9 | Search found titles only. | Concept index of 66 concepts searchable by name, acronym, Microsoft technology, objective, input type and output type. |

### Enhancement

- Accessibility: contrast of code comments and visual-table keys, focusable scrollable regions, quiz results marked with text and icons, focus moved to the page heading after navigation. axe-core now reports no issues on 22 pages in 3 configurations.
- On tablets and phones the module details card (portal path, SDK, KQL, cost) now follows the lesson instead of preceding it, so the problem comes first.
- Breadcrumbs reduced to a compact line.
- No page scrolls sideways at 360 px: long quiz text, exploration controls and Exam Prep selectors now wrap or shrink. The smoke test enforces this for every route.

## 3. Material status

| Material | Status | Verification | Notes |
|---|---|---|---|
| ENV Lab environment | Foundation | Lab flow checked 2026-09-24 | Not an exam objective; the resource-versus-project idea and Entra ID authentication recur in Domain 2. |
| 01-01 Responsible AI | Current | **Needs verification** (lab) | Guardrail labels: see D1. |
| 01-02 Models, selection and deployment | Current | **Needs verification** (lab) | Check CLI flags and model names before relying on them. |
| 01-03 AI workloads | Current | Lab flow checked 2026-09-24 | |
| 02-01 Prompts, deployments and a chat client | Current | Lab flow checked 2026-09-24 | |
| 02-02 Agents | Current | Lab flow checked 2026-09-24 | |
| 02-03 Text and speech | Current | Lab flow checked 2026-09-24 | |
| 02-04 Vision and image generation | Current | **Needs verification** (lab) | |
| 02-05 Content Understanding | Current | Lab flow checked 2026-09-24 | |
| Module 0 lessons 00-01 to 00-17 | Foundation | Explanations checked against the AI-901 learning paths | Prerequisite knowledge; each maps to the objectives it supports. The 00-13 code walk's REST example uses a preview `api-version`; recheck when it changes. |
| Concepts L1 to L8 | Current | Follow Microsoft's two AI-901 learning paths | L1's brief mention of supervised and unsupervised learning is Foundation context: AI-901 has no machine learning domain. |
| KQL tables and investigation notes | Beyond the exam | | Collapsed and labelled. |
| Cost planner | Supplemental | | Practical lab guidance, not an exam topic. |

No material was classified Obsolete.

## 4. Discrepancy log

| # | Topic | What conflicts | How the Academy handles it | Status |
|---|---|---|---|---|
| D1 | Content filter (guardrail) threshold labels | The classic content-filter documentation calls Low the *strictest* configuration. The current Foundry guardrails overview describes the same behaviour (Low flags low severity and above) but labels Low *least restrictive* and High *most restrictive*. | Teaches the behaviour both agree on, shows a visible discrepancy note in 01-01, and avoids either label in questions. | Open: recheck both pages when either changes. |
| D2 | Study guide *Study resources* links | Links point to AI-900-era services that are not in the skills measured. | Not used as sources; learners are told the skills measured are what count. | Informational |
| D3 | Study guide versions | The page mentions two versions of the skills measured but shows one. | Drift check reports any second version. | Informational |

## 5. Open items

1. Run labs 01-01, 01-02 and 02-04 against the Microsoft exercises (`MicrosoftLearning/mslearn-ai-fundamentals`), correct any differences, and set `verified` with the date in `modules.js`.
2. Recheck preview API versions in REST examples whenever Microsoft publishes a newer one.
3. Spelling is mixed (for example *behaviour*, *colour*, *practise* alongside *analyze*). Microsoft's exam and documentation use US English; align when content is next edited, prioritising terms learners search for.
4. Manual accessibility pass with a screen reader and at 400% zoom (see `docs/ACCESSIBILITY.md`).
