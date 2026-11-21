# EDTEX website: design and accessibility audit (22 Nov 2026)

All 64 pages and the sign-in pages were checked against DESIGN-GUIDELINES.md and WCAG 2.2 AA (automated structure checks, colour and type review, desktop and phone screenshots).

## Fixed

| Area | Finding | Fix |
|---|---|---|
| Headings | Footer column titles were `h4`, so every page skipped from `h2` to `h4` | Footer titles are now `h2` with the same look |
| Headings | The sign-in page had two `h1`s | One `h1` that reads "Sign in" or "Welcome back" |
| Links | The featured image on Case studies repeated the title link for screen readers | Hidden from screen readers and the tab order |
| Focus | Blue focus rings were hard to see on dark bands (hero, page heroes, CTA, solver) | Amber focus ring on dark backgrounds; skip link added to the sign-in page |
| Contrast | Placeholder and "Select…" text at 3.9:1 | Darkened to 5.6:1 |
| Contrast | R&D solver time labels and caption at 55% white | Raised to 80% white and a larger size |
| Type size | Menu group labels, assistant subtitle and sign-in tags under 14px | Raised to at least 13.6px for labels, 14.5px for reading text |
| Colour | Green, red and teal had crept in (live dots, clash states, Admito icon) | Back to the three-colour system: navy, brand blue, amber |
| Motion | Six homepage illustrations looped at once | One plays at a time; the others rest on their resolved state; hover or keyboard focus plays a tile |
| Motion | Tall sections (problem tiles, tables) never animated in on phones | Reveal now triggers as soon as the section enters the screen |
| Phones | Comparison table scrolled sideways and hid the EDTEX column | Each row becomes a card with the EDTEX answer first |
| Phones | Timetable illustration squashed course names | Keeps its proportions and scrolls sideways inside its frame |
| Phones | "Ask EDTEX" pill covered text at the bottom right | Small round button on phones |
| Interruptions | Assistant greeting could appear together with the cookie notice | Greeting only on desktop, after 20 seconds, never alongside the cookie notice, not on the demo or self-check pages |
| Interruptions | Cookie notice was large | Compact notice |

## Checked and passing

Page language set on every page; one `main` landmark per page; skip link on every page; every image has alt text (decorative images use empty alt); no duplicate ids; every `aria-controls` / `for` reference resolves; form fields labelled; no positive `tabindex`; all external links safe; buttons and links have accessible names; all animation respects "reduce motion"; touch targets at least 44px for primary actions; no broken links or missing assets.

## Left as they are, by decision

- Labels inside the product illustrations (timetable, Day 0 board, bidding round) are 12 to 13px. These illustrations are hidden from screen readers, and each has a full-size caption explaining it.
- Error red (#B42318) stays on the demo form, as it is the conventional, accessible signal for a field error.
