/*
 * SEO build step. Run after editing js/data.js:
 *
 *     node tools/build.js
 *
 * It creates:
 *   - blog/<slug>.html and research/<slug>.html: full static pages that search
 *     engines and link previews can read without running JavaScript
 *   - sitemap.xml and robots.txt
 *   - title, description, canonical, social preview tags and structured data
 *     in the head of the main pages (between <!-- SEO:START --> and <!-- SEO:END -->)
 *
 * No packages needed, just Node.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const write = (f, s) => {
    fs.mkdirSync(path.dirname(path.join(ROOT, f)), { recursive: true });
    fs.writeFileSync(path.join(ROOT, f), s);
};

global.window = {};
require(path.join(ROOT, 'js', 'data.js'));
const DATA = window.SITE_DATA;
const site = DATA.site || {};
const SITE_URL = String(site.url || 'https://example.com').replace(/\/+$/, '');
const NAME = site.name || 'Suraj Nahak';
const DEFAULT_IMAGE = 'img/og-image.png';

// ─── Per-page settings for the main pages ───────────────────────────────────
const PAGES = {
    'index.html': {
        path: '/',
        title: `${NAME} | AI/ML Software Engineer | Algorithms & Research`,
        description: `${NAME} is an AI/ML software engineer at Copilot Networks and a freelancer, building machine learning systems, mobile apps and automation tools.`,
        priority: '1.0',
    },
    'blogs.html': {
        path: '/blogs.html',
        title: `Blog: Machine Learning, Algorithms & MLOps | ${NAME}`,
        description: `Practical articles by ${NAME} on machine learning, algorithms and MLOps: baselines, data leakage, dynamic programming and model deployment.`,
        priority: '0.9',
    },
    'projects.html': {
        path: '/projects.html',
        title: `Projects | ${NAME}, AI/ML Software Engineer`,
        description: `AI/ML and software projects by ${NAME}, from research prototypes to production machine learning systems.`,
        priority: '0.8',
    },
    'research.html': {
        path: '/research.html',
        title: `Research | ${NAME}`,
        description: `Research papers and ongoing work by ${NAME} in machine learning, algorithms and applied AI.`,
        priority: '0.8',
    },
    // Old JavaScript-only pages: they now redirect to the static pages, so keep them out of search.
    'read.html': { noindex: true, title: `Blog | ${NAME}` },
    'research-detail.html': { noindex: true, title: `Research | ${NAME}` },
    '404.html': { noindex: true, title: `Page not found | ${NAME}` },
};

// ─── Helpers (keep slugify in sync with js/site.js) ─────────────────────────
function esc(v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
const slugify = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const blogUrl = b => `blog/${b.slug || slugify(b.title)}.html`;
const researchUrl = r => `research/${r.slug || slugify(r.title)}.html`;
const abs = p => /^https?:\/\//.test(p) ? p : `${SITE_URL}/${String(p).replace(/^\/+/, '')}`;
const stripTags = html => String(html || '').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
const shorten = (text, max = 158) => text.length <= max ? text : text.slice(0, text.lastIndexOf(' ', max - 1)) + '…';
const sortByDate = list => (list || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function formatDate(iso) {
    const [y, m, d] = String(iso || '').split('-');
    return y && m && d ? `${MONTHS[Number(m) - 1]} ${d.padStart(2, '0')}, ${y}` : esc(iso);
}
const jsonLd = obj => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

// Only real profile links (not bare "https://linkedin.com") go into structured data.
const profiles = (DATA.socialLinks || []).map(l => l.url)
    .filter(u => { try { return new URL(u).pathname.replace(/\/+$/, '') !== ''; } catch { return false; } });

const person = {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: NAME,
    url: `${SITE_URL}/`,
    jobTitle: ['Software Engineer', 'Freelance AI/ML Engineer'],
    worksFor: { '@type': 'Organization', name: 'Copilot Networks LLP' },
    description: 'Software engineer and freelance AI/ML engineer, available for freelance projects.',
    knowsAbout: ['Machine Learning', 'Artificial Intelligence', 'Algorithms', 'MLOps', 'Python', 'Research'],
    ...(profiles.length ? { sameAs: profiles } : {}),
};

function seoBlock({ title, description, url, image, type = 'website', noindex, extra = '' }) {
    const lines = [`<title>${esc(title)}</title>`];
    if (description) lines.push(`<meta name="description" content="${esc(description)}">`);
    if (noindex) {
        lines.push('<meta name="robots" content="noindex, follow">');
    } else {
        lines.push(
            `<meta name="robots" content="index, follow, max-image-preview:large">`,
            `<meta name="author" content="${esc(NAME)}">`,
            `<link rel="canonical" href="${esc(url)}">`,
            `<meta property="og:site_name" content="${esc(NAME)}">`,
            `<meta property="og:type" content="${type}">`,
            `<meta property="og:title" content="${esc(title)}">`,
            `<meta property="og:description" content="${esc(description)}">`,
            `<meta property="og:url" content="${esc(url)}">`,
            `<meta property="og:image" content="${esc(abs(image || DEFAULT_IMAGE))}">`,
            `<meta name="twitter:card" content="summary_large_image">`,
            `<meta name="twitter:title" content="${esc(title)}">`,
            `<meta name="twitter:description" content="${esc(description)}">`,
            `<meta name="twitter:image" content="${esc(abs(image || DEFAULT_IMAGE))}">`,
        );
        if (extra) lines.push(extra);
    }
    return ['<!-- SEO:START (made by tools/build.js, edit there) -->', ...lines, '<!-- SEO:END -->']
        .map(l => '    ' + l).join('\n').trimStart();
}

// Puts the SEO block in a page head, replacing the old title/description or an earlier block.
function applySeo(html, block) {
    if (html.includes('<!-- SEO:START')) {
        return html.replace(/<!-- SEO:START[\s\S]*?<!-- SEO:END -->/, () => block);
    }
    html = html.replace(/^[ \t]*<title>[\s\S]*?<\/title>\r?\n/m, '')
        .replace(/^[ \t]*<meta name="description"[^>]*>\r?\n/m, '');
    return html.replace(/(<meta name="viewport"[^>]*>\r?\n)/, (m) => `${m}    ${block}\n`);
}

// ─── Main pages ─────────────────────────────────────────────────────────────
const blogs = sortByDate(DATA.blogs);
const research = sortByDate(DATA.research);

for (const [file, cfg] of Object.entries(PAGES)) {
    let extra = '';
    if (file === 'index.html') {
        extra = jsonLd({
            '@context': 'https://schema.org',
            '@graph': [
                person,
                { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: NAME, author: { '@id': person['@id'] } },
            ],
        });
    } else if (file === 'blogs.html') {
        extra = jsonLd({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: `${NAME}'s Blog`,
            url: abs(cfg.path),
            author: { '@type': 'Person', name: NAME, url: `${SITE_URL}/` },
            blogPost: blogs.map(b => ({ '@type': 'BlogPosting', headline: b.title, url: abs(blogUrl(b)), datePublished: b.date })),
        });
    }
    const block = seoBlock({ ...cfg, url: cfg.path ? abs(cfg.path) : '', extra });
    write(file, applySeo(read(file), block));
}

// ─── Article pages ──────────────────────────────────────────────────────────
function cardHtml(item, href, label, excerpt) {
    const image = item.image
        ? `<div class="blog-image" style="background-image: url('${esc(item.image)}')"></div>`
        : `<div class="blog-image" style="background: linear-gradient(135deg, rgba(74,108,247,0.15) 0%, rgba(106,117,249,0.08) 100%);"></div>`;
    return `
            <div class="blog-card">
                <div class="blog-header">
                    ${label ? `<span class="blog-category">${esc(label)}</span>` : ''}
                    ${image}
                </div>
                <div class="blog-body">
                    <div class="blog-date"><i class="far fa-calendar"></i> ${formatDate(item.date)}</div>
                    <h3 class="blog-title"><a href="${href}" style="color:inherit; text-decoration:none;">${esc(item.title)}</a></h3>
                    <p class="blog-excerpt">${esc(excerpt)}</p>
                    <a href="${href}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>`;
}

function buildArticle({ template, item, url, label, metaLine, body, related, description, schema }) {
    let html = read(template);
    const block = seoBlock({
        title: `${item.title} | ${NAME}`,
        description,
        url: abs(url),
        image: item.image,
        type: 'article',
        extra: [
            `<meta property="article:published_time" content="${esc(item.date)}">`,
            ...(item.tags || []).map(t => `<meta property="article:tag" content="${esc(t)}">`),
            jsonLd(schema),
        ].join('\n    '),
    });
    html = applySeo(html, block)
        // Pages live one folder down; this keeps every relative link (css/, js/, uploads/) working.
        .replace(/(<meta charset="UTF-8">)/, '$1\n    <base href="../">')
        .replace(/<body data-page="[^"]*">/, '<body data-page="article">')
        .replace('<div class="hero-content" id="detail-hero"></div>', `<div class="hero-content" id="detail-hero">
                ${label ? `<span class="blog-category">${esc(label)}</span>` : ''}
                <h1>${esc(item.title)}</h1>
                <p>${metaLine}</p>
            </div>`)
        .replace(/(<div class="container" style="max-width: 800px;" id="detail-body">)(<\/div>)/, `$1
            ${body}
        $2`);
    if (related.length) {
        html = html.replace(/(id="related-section") hidden/, '$1')
            .replace('<div class="blog-grid" id="related-list"></div>', `<div class="blog-grid" id="related-list">${related.join('')}
            </div>`);
    } else {
        html = html.replace(/\s*<section[^>]*id="related-section"[\s\S]*?<\/section>/, '');
    }
    write(url, html);
}

const tagsHtml = tags => `<div class="blog-tags" style="margin-bottom:2rem;">
                ${(tags || []).map(t => `<span class="blog-tag">${esc(t)}</span>`).join('')}
            </div>`;
const coverHtml = item => item.image
    ? `<img src="${esc(item.image)}" alt="${esc(item.title)}" style="width:100%; border-radius:12px; margin-bottom:2rem;">` : '';

// Remove pages left over from deleted or renamed posts.
for (const dir of ['blog', 'research']) {
    const full = path.join(ROOT, dir);
    if (fs.existsSync(full)) fs.readdirSync(full).filter(f => f.endsWith('.html')).forEach(f => fs.unlinkSync(path.join(full, f)));
}

for (const b of blogs) {
    const url = blogUrl(b);
    const description = shorten(b.excerpt || stripTags(b.content));
    buildArticle({
        template: 'read.html',
        item: b,
        url,
        label: b.category,
        description,
        metaLine: `<i class="far fa-calendar"></i> <time datetime="${esc(b.date)}">${formatDate(b.date)}</time>
                    &nbsp;&nbsp;
                    <i class="fas fa-user"></i> ${esc(b.author || NAME)}`,
        body: `${coverHtml(b)}
            ${tagsHtml(b.tags)}
            <article class="blog-detail-body">${b.content || ''}</article>
            <div style="margin-top:3rem;">
                <a href="blogs.html" class="btn"><i class="fas fa-arrow-left"></i> Back to Blogs</a>
            </div>`,
        related: blogs.filter(x => x !== b).slice(0, 3).map(x => cardHtml(x, blogUrl(x), x.category, x.excerpt)),
        schema: {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: b.title,
            description,
            datePublished: b.date,
            dateModified: b.updated || b.date,
            url: abs(url),
            mainEntityOfPage: abs(url),
            ...(b.image ? { image: abs(b.image) } : {}),
            articleSection: b.category,
            keywords: (b.tags || []).join(', '),
            wordCount: stripTags(b.content).split(' ').length,
            author: { '@type': 'Person', name: b.author || NAME, url: `${SITE_URL}/` },
            publisher: { '@type': 'Person', name: NAME, url: `${SITE_URL}/` },
        },
    });
}

const STATUS = { published: 'Published', under_review: 'Under Review', in_progress: 'In Progress' };
for (const r of research) {
    const url = researchUrl(r);
    const description = shorten(stripTags(r.abstract));
    const authors = (r.authors && r.authors.length ? r.authors : [NAME]);
    buildArticle({
        template: 'research-detail.html',
        item: r,
        url,
        label: STATUS[r.status] || r.status,
        description,
        metaLine: `<i class="far fa-calendar"></i> <time datetime="${esc(r.date)}">${formatDate(r.date)}</time>
                    &nbsp;&nbsp; <i class="fas fa-user"></i> ${esc(authors.join(', '))}
                    ${r.venue ? `&nbsp;&nbsp; <i class="fas fa-landmark"></i> ${esc(r.venue)}` : ''}`,
        body: `${coverHtml(r)}
            ${tagsHtml(r.tags)}
            <article class="blog-detail-body">${r.abstract || ''}</article>
            ${r.link ? `<div style="margin-top:2rem;">
                <a href="${esc(r.link)}" target="_blank" rel="noopener" class="btn"><i class="fas fa-external-link-alt"></i> View Full Paper</a>
            </div>` : ''}
            <div style="margin-top:2rem;">
                <a href="research.html" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back to Research</a>
            </div>`,
        related: research.filter(x => x !== r).slice(0, 3)
            .map(x => cardHtml(x, researchUrl(x), STATUS[x.status] || x.status, shorten(stripTags(x.abstract), 140))),
        schema: {
            '@context': 'https://schema.org',
            '@type': 'ScholarlyArticle',
            headline: r.title,
            description,
            datePublished: r.date,
            url: abs(url),
            ...(r.image ? { image: abs(r.image) } : {}),
            ...(r.link ? { sameAs: abs(r.link) } : {}),
            keywords: (r.tags || []).join(', '),
            author: authors.map(a => ({ '@type': 'Person', name: a })),
        },
    });
}

// ─── sitemap.xml and robots.txt ─────────────────────────────────────────────
const latest = list => sortByDate(list)[0]?.date;
const urls = [
    ...Object.values(PAGES).filter(p => !p.noindex).map(p => ({
        loc: abs(p.path),
        lastmod: p.path === '/blogs.html' ? latest(blogs) : p.path === '/research.html' ? latest(research) : undefined,
        priority: p.priority,
    })),
    ...blogs.map(b => ({ loc: abs(blogUrl(b)), lastmod: b.updated || b.date, priority: '0.7' })),
    ...research.map(r => ({ loc: abs(researchUrl(r)), lastmod: r.date, priority: '0.7' })),
];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${esc(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`);
write('robots.txt', `User-agent: *
Allow: /
Disallow: /tools/

Sitemap: ${SITE_URL}/sitemap.xml
`);

console.log(`Built ${blogs.length} blog page(s), ${research.length} research page(s), sitemap.xml, robots.txt`);
if (SITE_URL.includes('example.com')) {
    console.warn('WARNING: site.url in js/data.js is still https://example.com. Set your real domain and run this again.');
}
