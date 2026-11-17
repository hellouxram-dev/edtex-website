# EDTEX website (v2 redesign)

Static HTML version of the redesigned www.edtex.in: 62 pages, no build step needed.

## View it

- **Homepage:** `index.html`
- **Clickable prototype of every page** (with desktop, laptop, tablet and mobile preview): `prototype.html`
- **What changed and why:** `STRUCTURE-REPORT.md`

## Host on GitHub Pages

1. Create a new repository on GitHub (for example `edtex-website`).
2. Upload **all files and folders in this folder** to the root of the repository (drag them into "Add file > Upload files", or push with git). Keep the folder structure (`assets/`, `css/`, `js/`).
3. In the repository, open **Settings > Pages**. Under "Build and deployment", choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. After about a minute the site is live at `https://<your-username>.github.io/<repository-name>/`.
   - Prototype: `https://<your-username>.github.io/<repository-name>/prototype.html`

All links and image paths are relative, so the site works from the repository sub-folder. The `.nojekyll` file makes GitHub serve every file as-is. `404.html` is used automatically for missing pages.

## Notes

- Every page has a canonical tag pointing to `https://www.edtex.in/...`, so search engines treat the GitHub copy as a preview of the real site, not a duplicate.
- `robots.txt`, `sitemap.xml` and `llms.txt` are written for www.edtex.in. They only take effect when the site runs at the domain root.
- `_REDIRECTS.csv` lists the 301 redirects to set up in Webflow (Site settings > Publishing > 301 redirects) when this design goes live. `_redirects` is the same list in Netlify format.
- Fonts load from Google Fonts and videos from YouTube (click to play), so an internet connection is needed for those.
