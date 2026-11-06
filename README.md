# Static portfolio (no backend)

A copy of the Django site that is plain HTML, CSS and JS, so it can be hosted for free
(Cloudflare Pages, GitHub Pages, Netlify, Vercel). The original Django project lives in
`../Suraj_Portfollio` and is unchanged.

## Pages

| Django URL          | Static page                   |
|---------------------|-------------------------------|
| `/`                 | `index.html`                  |
| `/projects/`        | `projects.html`               |
| `/blogs/`           | `blogs.html`                  |
| `/read/13/`         | `read.html?id=13`             |
| `/research/`        | `research.html`               |
| `/research/5/`      | `research-detail.html?id=5`   |

## Editing content

All content that used to come from the database / admin panel is in **`js/data.js`**:
site text, social links, categories, clients, projects, certificates, research and blogs.
Add an entry to the right list and refresh the page. Put new images in `uploads/`.

After changing blogs or research, run the SEO build so search engines get readable pages:

```
node tools/build.js
```

It creates `blog/<slug>.html` and `research/<slug>.html`, `sitemap.xml`, `robots.txt`, and the
title / description / social preview tags of every page. Set `site.url` in `js/data.js` to
your real domain first. Commit the generated files with the rest of the site.

Fixed page text (About section, skills, contact details) is in the HTML files,
and the footer is in `js/site.js` (`renderLayout`).

## Run locally

```
cd Suraj_Portfollio-static
python -m http.server 8000
```

Then open http://localhost:8000.

## Deploy (Cloudflare Pages)

Either drag and drop this folder in the Cloudflare Pages dashboard ("Upload assets"),
or push it to its own GitHub repo, connect it, leave the build command empty and
set the output directory to `/`.
