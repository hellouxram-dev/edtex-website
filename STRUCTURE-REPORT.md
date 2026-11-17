# EDTEX website v2: structure, SEO, AEO and GEO report

Open `prototype.html` in this folder to click through every page. v1 (85 pages) is untouched in `edtex-website/`.

## 1. What the scan of all 85 pages found

| Finding | Detail |
|---|---|
| Duplicate page | `testimonials` was 97% identical to `customer-stories` |
| Three competing hubs | `insights`, `blogs`, `videos` (and `primers`) all listed the same resources |
| Thin pages | 5 of 6 video pages had about 250 words and shared 45 to 63% of their text; `primers` repeated product pages |
| Overlapping articles | 4 groups of guides answered the same question; two guides were product pitches that belonged on product pages |
| Overlapping pitch pages | `solutions` ("four problems") and `why-edtex` ("five problems") made the same argument |
| Technical SEO | No canonical tags; structured data on 1 page of 85; 37 titles over 60 characters; 13 meta descriptions outside 130 to 160 characters |
| Navigation | Flat menu that did not follow how a buyer decides |

## 2. How deans and academic offices decide (behaviour model)

They arrive with a problem, check whether institutions like theirs trust the vendor, look for proof on their specific process, then ask risk questions (deployment time, integrations, data protection, support) before agreeing to a call. IT joins at the integration and security step. The v2 structure follows that sequence.

## 3. Navigation (pitch order)

**Why EDTEX** (problem) -> **Platform** (solution) -> **Customers** (proof) -> **Resources** (education) -> **Company** (trust: About us, Research and development, Newsroom) -> **Request a demo** (action)

Homepage order: hero with proof numbers -> institution logos -> problem section -> solutions and integrations -> why EDTEX is different -> case studies -> what deans say -> founders -> story video -> FAQ -> demo CTA.

## 4. Pages removed or merged (85 -> 62, including site map and 404)

Every old URL 301-redirects to the page that now answers the same question: `_REDIRECTS.csv` (Webflow: Site settings -> Publishing -> 301 redirects) and `_redirects` (Netlify format).

| Old page | Now | Why |
|---|---|---|
| /testimonials | /customer-stories | duplicate |
| /solutions | /why-edtex | same pitch, merged |
| /blogs, /videos | /insights (Resources hub) | one hub instead of three |
| /primers | /products | primer facts moved onto product pages |
| 6 video pages | embedded on About us, the 4 Registro product pages, and R&D | thin pages |
| 7 overlapping guides | merged into 4 guides and 2 product pages | one page per search intent |
| /careers and 4 job pages | /about-us | careers section removed on request |

Removed source files are kept in `edtex-site-v2/_removed/`.

## 5. SEO, AEO and GEO on every page

- Canonical URL, robots and Open Graph/Twitter tags (404 is noindex).
- JSON-LD: Organization and WebSite, BreadcrumbList, SoftwareApplication (6 products), Article (17 guides, 22 case studies), FAQPage (from visible FAQs), VideoObject (6 videos), ContactPage, CollectionPage.
- Answer-first summaries naming EDTEX Registro or Skynet with a concrete fact; question-style headings; self-contained FAQ answers.
- `llms.txt` for AI assistants; `robots.txt` welcomes AI crawlers and points to `sitemap.xml`.
- Titles 60 characters or fewer; meta descriptions 130 to 160 characters; one h1 per page.
- Topic clusters: product pages link to 2+ case studies and 2+ guides; guides link to their product and a case study.

## 6. To confirm before going live

- "Webhooks" in the homepage integrations section is not stated elsewhere (FAQ says APIs and scheduled import/export).
- Data protection wording: v2 says "designed to support" GDPR and DPDP everywhere.
- Deployment times: timetabling "4 to 15 weeks" vs "a few weeks"; course bidding "one to four weeks".
- No student exchange case study; no Skynet walkthrough video; Admito has no product page.
- Every case-study figure needs its source and comparison period.
- Upload a social share image per page in Webflow.
