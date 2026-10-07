# Accessibility

The Academy aims to meet WCAG 2.1 AA. Learners use it on phones, with keyboards, with screen readers and at large text sizes, and the content has to be just as clear in each.

## What the site does

- **Structure:** one `<h1>` per page and a logical heading order; landmarks for the top bar, sidebar navigation, main content and the contextual panel; a *Skip to content* link.
- **Keyboard:** every control is a native button, link or form control. <kbd>Ctrl</kbd>+<kbd>K</kbd> or <kbd>/</kbd> opens search; arrow keys move through results, <kbd>Enter</kbd> opens one, <kbd>Esc</kbd> closes it and returns focus to where it was. <kbd>Esc</kbd> also closes the mobile navigation. After every navigation, focus moves to the new page's heading so screen-reader users hear where they are.
- **Focus:** visible focus outlines on every interactive element in both themes.
- **Scrollable regions:** wide tables and code blocks that scroll sideways are made focusable and labelled, so keyboard users can scroll them.
- **Quizzes:** answers are radio buttons or checkboxes inside fieldsets with legends. Feedback is announced through a polite live region, and correct and incorrect answers are marked with text and icons, never by colour alone.
- **Diagrams:** every teaching diagram has a caption, and SVG diagrams carry a text label or an equivalent list. The input → model → output visuals are built as lists, so they read in order.
- **Themes and contrast:** light and dark themes, following the system setting by default, with both checked for AA contrast, including code highlighting.
- **Motion:** transitions and animations are switched off when the system asks for reduced motion.
- **Text size and mobile:** layouts reflow to a single column on phones without horizontal page scrolling (the smoke test checks every route at 360 px); text scales with browser settings.

## Automated checks

`npm run test:a11y` (`tools/a11y.mjs`) runs axe-core with the WCAG 2.0 and 2.1 A and AA rules against 22 representative pages in three configurations (dark desktop, light desktop, light phone at 390 px), plus a marked knowledge check and the open search palette. It fails on any serious or critical violation and lists moderate ones. It runs on every push in the *Validate* workflow.

## What automated checks cannot find

Run these by hand before a significant release:

1. **Keyboard only:** go from the dashboard to a Module 0 lesson, complete its exploration and knowledge check, open Exam Prep, answer a question, and run a search, without a mouse. Focus should always be visible and never trapped.
2. **Screen reader:** with NVDA (Windows) or VoiceOver (macOS, iOS), check that page changes are announced, quiz feedback is read after answering, and diagrams make sense from their text.
3. **Zoom:** at 200% and 400% browser zoom, nothing is cut off and nothing needs sideways scrolling except tables and code.
4. **Phone:** at 360 px wide, the navigation opens and closes, explorations are usable by touch, and tap targets are comfortable.
5. **Language:** plain-English explanations come before terms; abbreviations are expanded on first use in each lesson.

Report problems as GitHub issues with the page address (for example `#/f/00-06`), the browser, and the assistive technology used.
