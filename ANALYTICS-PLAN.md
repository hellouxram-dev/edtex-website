# EDTEX website: measurement plan

The feedback asked three questions: who came to the site, what were they looking for, and did they find it? This plan shows how the site answers each one. The tracking code is already built into the prototype (`js/analytics.js`). It does nothing until the two IDs below are added and the visitor accepts the cookie banner.

## 1. The three questions and where the answers come from

| Question | Where the answer comes from | Tool |
|---|---|---|
| Who came? | Source and landing page for every visit (Google, LinkedIn, email campaign, direct), their country and city, and new or returning visits. Demo requests include the first page and source of the visit as hidden fields. | GA4 |
| Which institution was it? | Company identification from the visitor's network. This works well for corporate networks and only partly for campus networks, because many campuses go online through a regular internet provider. | Dealfront (Leadfeeder), Albacross or HubSpot (optional, paid) |
| What were they looking for? | Questions typed into the assistant, FAQs opened, the path they chose in the assistant, landing pages, and case studies clicked. | GA4 events + assistant events |
| Did they find it? | Whether a visitor rated the assistant's answer as helpful, questions the assistant couldn't answer, how far people scroll and read, 404 pages, recordings of real visits, and whether a visit ended in a demo request. | GA4 + Microsoft Clarity |

## 2. Setup (about an hour)

1. **GA4**: create a property at analytics.google.com, copy the Measurement ID (G-…), and paste it into `GA4_ID` at the top of `js/analytics.js`.
2. **Microsoft Clarity** (free; provides heatmaps and session recordings): create a project at clarity.microsoft.com, copy the project ID, and paste it into `CLARITY_ID`. In Clarity settings, keep masking set to "Balanced" so form fields are never recorded.
3. **Webflow**: add `css/site.css` rules and the four scripts (`site.js`, `analytics.js`, `assistant-data.js`, `assistant.js`) under Project settings → Custom code → Footer. If you prefer Google Tag Manager, leave the IDs empty and use the `dataLayer` events instead.
4. **GA4 conversions**: mark `generate_lead`, `assistant_handoff_complete` and `selfcheck_complete` as key events.
5. **GA4 custom dimensions** (Admin → Custom definitions, event scope): `question`, `matched`, `helpful`, `path`, `score`, `band`, `gaps`, `source`, `via`, `landing`.
6. **Cookie policy**: add GA4 (Google) and Microsoft Clarity to the analytics section of `/cookie-policy`. Visitors can change their choice from "Cookie settings" in the footer.
7. Check everything works by opening any page with `?debug=1`. Each event then appears in the browser console.

## 3. Event dictionary

| Event | When it fires | Useful parameters |
|---|---|---|
| `demo_click` | A link to the demo page is clicked | text, from |
| `demo_form_start` / `generate_lead` | Someone starts / submits the demo form | via (assistant, selfcheck, direct), landing |
| `hero_demo`, `hero_selfcheck`, `home_selfcheck` | A homepage call to action is clicked | text |
| `assistant_teaser_shown` / `assistant_open` | The greeting appears / the assistant is opened | source (teaser, launcher), page |
| `assistant_choice` | A visitor picks a path or a suggested question | choice |
| `assistant_question` | A visitor types a question | question (first 120 characters), page |
| `assistant_answered` / `assistant_unanswered` | The assistant found / didn't find an answer | question, matched |
| `assistant_helpful` | A visitor rates an answer "Yes" or "No" | question, helpful (1/0) |
| `assistant_handoff_start` / `_complete` | A visitor starts / finishes the "Talk to the team" steps | path |
| `selfcheck_start` / `selfcheck_complete` | The self-check is started / finished | score, band, gaps |
| `faq_open` | An FAQ answer is opened anywhere on the site | question |
| `case_study_click`, `engaged_read` | A case study is clicked / an article is read past 75% after 30 seconds | href, title |
| `video_play`, `email_click`, `outbound_click` | A video is played, the email address is clicked, an external link is opened | title, to, url |
| `scroll_depth` | A visitor scrolls past 25, 50, 75 or 90% of a page | percent |
| `page_not_found` | The 404 page is shown | path, referrer |
| `consent_granted` / `consent_denied` | The visitor makes a choice on the cookie banner | |

## 4. A monthly review (30 minutes)

1. **Unanswered questions**: in GA4, look at `assistant_unanswered` by `question`. Each repeated question should become a new FAQ on `/faqs`. The assistant learns it automatically on the next build, because its knowledge is generated from that page.
2. **Answers rated "No"**: `assistant_helpful` where helpful = 0. Rewrite those FAQ answers.
3. **Landing page to demo**: which first pages lead to `generate_lead`? Put more effort into those topics.
4. **Self-check results**: the most common `gaps` show what institutions struggle with. This is good material for guides and for sales conversations.
5. **Clarity**: watch five recordings of visits that reached `/request-a-demo` but didn't submit. Fix whatever stopped them.
6. **404s**: redirect any broken path that appears more than once.

## 5. Moving the assistant to live AI later

Today the assistant is guided. It offers fixed paths and answers from the FAQ page, so it never says anything the team hasn't written. To switch to free-form AI answers, deploy a small server endpoint (for example, a Cloudflare Worker or Vercel function that calls an AI model with the site content as context). Then set the following before `assistant.js` loads:

```html
<script>window.EDTEX_ASSISTANT_ENDPOINT='https://your-endpoint.example.com/ask';</script>
```

The endpoint receives `{question, page, history}` and returns `{answer, links:[{label, href}]}`. If it fails, the assistant falls back to the FAQ answer. Hosted options without a server include Intercom Fin and Chatbase. Both are paid, and both would replace this assistant rather than plug into it.

## 6. Privacy notes

Analytics loads only after consent. Clarity masks form inputs. The assistant's name/institution/email steps don't send anything anywhere: they only fill in the demo form, which the visitor checks and sends. Questions typed into the assistant are logged to GA4 (first 120 characters only), so the cookie policy should say so. Under India's DPDP Act 2023, keep the analytics data retention period short (GA4: 14 months maximum, 2 months is enough for this review).
