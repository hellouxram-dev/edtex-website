# EDTEX website: design guidelines

One standard per component. The rules live in `css/site.css` (section "CONSISTENCY LAYER"); `_consistency.py` normalises page markup and is safe to re-run.

## Foundations
- Colours: hero #0B0F19, navy #0E1E3C (ink, dark bands, buttons), brand blue #0046CE (links only), amber #E0A030 (small accents: step numbers, quote rules, summary rule). Page background #F5F7FA; white only for cards and inputs.
- Type: Helvetica for headings, Inter for body. Body text at least 17px, dark grey, never light grey on light backgrounds. Quotes use the serif face.
- Section spacing: 104px top and bottom on desktop, 80px on tablet (≤980px), 64px on mobile (≤600px).
- Section header: heading on the left (clamp 1.8–2.4rem), one short intro on the right in muted text, 56px gap before content.

## Page anatomy (inner pages)
1. Hero with breadcrumb (Home / Page), H1 at clamp(2.2rem, 4.2vw, 3.4rem).
2. Summary block (answer first): one paragraph, max 70 characters per line, amber left rule.
3. Content sections.
4. FAQ section (where the page has questions).
5. Standard CTA band (`section.cs-cta`: three steps + Arun card). Every page ends with it, except legal pages, 404 and the demo page.

## FAQ section
Markup:
```
<section class="dm-faq faq-sec" aria-labelledby="h-faq">
  <div class="wrap dm-faq-grid">
    <div class="faq-head"><h2 id="h-faq">Questions about …</h2><p>Short answers from our team. Anything else, ask us on the discovery call.</p>
      <p class="faq-all"><a class="link" href="/faqs">See all questions</a></p></div>
    <div class="faq-list"><details class="faq"><summary>Question?</summary><div class="faq-a"><p>Answer.</p></div></details>…</div>
  </div></section>
```
- Heading pattern "Questions about [topic]". Light band, heading left (4 cols), questions right (8 cols); stacks on tablet.
- 4–6 questions, answers of 2–4 sentences. One open at a time; "Expand all" appears from 4 questions; each question has a copy-link.
- Questions in `<details>` feed the FAQPage structured data automatically, so keep the wording identical to what you want quoted by search and AI engines.
- In-article FAQs inside guides (`.bl-faq`) use the same item style.

## Quotes (three types only)
- `q-feature`: one large serif quote per page, with 52px round photo, name and role.
- `q-card`: quotes in a grid of white cards (testimonials).
- `q-inline`: short quote inside body text, 3px amber left rule.
Always name the person, role and institution. No unattributed quotes.

## Cards
- Case-study and resource cards share: 16:9 image with hover zoom, serif title 1.2rem, muted meta line 0.9rem, short description, blue "Read …" link.
- Three-column grids use `.case-cards.cc-3` (2 columns on tablet, 1 on mobile). No inline grid styles.

## Links and buttons
- Primary button: navy fill, white text ("Request a demo"). Secondary: outline. Text links: brand blue, weight 500.
- One primary action per section.

## Writing
- Plain, specific, verifiable. Numbers only with a named source (institution and year).
- No marketing superlatives; deans and professors should be able to check every claim.

## Motion
- Use motion only where it explains something faster than text: a process, a change over time, or a before/after. Never for decoration.
- Shared script: `js/motion.js`. Add `data-motion` to reveal once on scroll, `data-loop` for illustrations that loop only while visible, `.mc[data-to]` for count-up numbers, `data-sim="tt|d0|bid"` for the scripted product illustrations. Process lists (`ol.pp-steps`, `ol.wy-steps`) play step by step automatically.
- Illustrations of the product are always labelled "Illustration" and use made-up names. Real figures appear only in proof lines with the institution named.
- Keep the full text available behind "Read the detail" or "Read the full timeline" so nothing is lost for readers or search engines.
- Everything respects the visitor's "reduce motion" setting and shows its final state instead.

## Accessibility rules (from the Nov 2026 audit)
- Colour: navy #0E1E3C, brand blue #0046CE, amber #E0A030 on #F5F7FA or white. No other hues, except #B42318 for form errors.
- Reading text at least 14.5px (0.85rem); labels at least 13.6px (0.8rem). Muted text #4A5468 or darker on light; at least 80% white on dark.
- One `h1` per page; headings never skip a level (footer titles are `h2`).
- Focus ring: blue on light backgrounds, amber on dark ones.
- Only one looping animation visible at a time. Nothing pops up within 20 seconds of arriving, and never two notices at once.
