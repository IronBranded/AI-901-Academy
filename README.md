# AI-901 Academy

A free, interactive study site for **Microsoft Exam AI-901: Microsoft Azure AI Fundamentals**, built against the skills measured as of **April 15, 2026**.

<h3 align="center">
  <a href="https://ironbranded.github.io/AI-901-Academy/" target="_blank" rel="noopener noreferrer">
    🟢 TRY THE ACADEMY 🟢
  </a>
</h3>

**Beginner-first in how it explains AI. Certification-first in what it teaches.** You do not need AI-900, a machine learning background or programming fluency to start. Every topic begins with a real problem, explains the idea in plain English, shows what goes in and what comes out, and only then names the Microsoft technology and the exam objective.

## How the Academy is organised

| Part | What it gives you |
|---|---|
| **Module 0: Before we build AI** | 17 short foundation lessons (00-01 to 00-17): what AI is, data and models, language, vision, speech, documents, generative AI, LLMs, applications, agents, APIs/SDKs/CLIs, a Python reading primer, Azure resources, responsible AI, and one end-to-end mental model. Each has a hands-on exploration that runs in the browser, a knowledge check and a Teach-it-back prompt. |
| **Concepts** | 8 pages, 49 units, following Microsoft's two AI-901 learning paths, each unit with a diagram and its key terms. |
| **Exam modules and labs** | 9 modules mapped to all 29 official sub-objectives, each with an AI-901 Exam Lens, scenario clues, a Microsoft translation, and a lab with tracked steps and teardown. |
| **Objectives** | All 29 objectives in outline order, with your evidence per objective (Studied, Practiced, Knowledge checked, Applied, Retained, Needs review) and every lesson, comparison and question that covers it. |
| **Comparisons** | 17 side-by-side tables for the things beginners confuse: classification vs regression, OCR vs field extraction, app vs agent, speech recognition vs synthesis, resource vs project and more. |
| **Exam Prep** | Practise by objective, by concept area ("I keep confusing vision"), by Needs review, Review later, unanswered or previously wrong questions, or a mixed set. |
| **Practice exam** | 37 original scenario questions in exam-style formats, including a case study. |
| **Search** | Search by concept, acronym, Microsoft technology, objective, or by input type and output type (for example: input *image*, output *text*). Press <kbd>Ctrl</kbd>+<kbd>K</kbd> anywhere. |
| **Review** | What needs review and what you saved for later, each linked to the lesson and comparison that fixes it. |

Every knowledge-check answer explains the **correct answer**, **why**, **why not the others**, the **scenario clue**, the **objective** it tests and, where useful, the **misconception** it targets. All questions are original; none come from exam dumps or recalled exam content.

## Progress

Progress is stored only in your browser (local storage), separately for each site address: the file opened from disk and the GitHub Pages site keep separate records. Use **Export progress** on the dashboard to keep a copy. Reading a page never counts as mastery: objectives are marked from your answers and exercises, and the site never predicts a pass score.

## Accuracy and sources

- Objective text is stored verbatim from the [official study guide](https://learn.microsoft.com/credentials/certifications/resources/study-guides/ai-901) in one file, [`assets/js/content/objectives.js`](assets/js/content/objectives.js). A weekly GitHub Action compares it with the live study guide and opens an issue when Microsoft changes the outline.
- Microsoft product claims were checked against Microsoft Learn documentation; each objective records the pages it was checked against.
- Modules **01-01**, **01-02** and **02-04** are marked *Not yet verified* in the page: written from product documentation, not yet run against a Microsoft exercise.
- Known documentation discrepancies are shown to learners where they matter and listed in [`docs/CONTENT-REVIEW.md`](docs/CONTENT-REVIEW.md).
- Foundry, its SDKs and model names change often. The authority is always Microsoft Learn.

Not affiliated with or endorsed by Microsoft.

## For contributors

The site is plain HTML, CSS and JavaScript served by GitHub Pages from the repository root. There is no build server; Node.js is only used for the development checks.

```powershell
npm install                       # tooling only: Playwright and axe-core
npx playwright install chromium   # browser for the smoke and accessibility tests
npm run build                     # rebuild assets/js/app.js after editing assets/js/app/*.js
npm test                          # build check, content validation, smoke test, accessibility
npm run check:objectives          # compare objectives.js with the live study guide
```

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): how the files fit together, routes and progress storage.
- [`CONTRIBUTING.md`](CONTRIBUTING.md): lesson anatomy, writing rules, adding questions, and what to do when the exam changes.
- [`docs/coverage-matrix.md`](docs/coverage-matrix.md): objective → lesson → exercise → check, generated by `npm run validate`.
- [`docs/ACCESSIBILITY.md`](docs/ACCESSIBILITY.md): what is tested automatically and what to test by hand.
