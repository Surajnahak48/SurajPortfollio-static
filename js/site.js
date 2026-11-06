/*
 * Renders the parts of each page that Django used to fill from the database.
 * Content comes from js/data.js (window.SITE_DATA).
 *
 * Loaded at the end of <body>, before script.js, so everything is in the DOM
 * by the time script.js wires up the menu and tabs.
 */
(function () {
    const DATA = window.SITE_DATA || {};
    const site = DATA.site || {};
    const page = document.body.dataset.page;

    const DEFAULT_BLOG_IMAGE = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';

    const PLATFORM_ICONS = {
        linkedin: 'fab fa-linkedin-in',
        github: 'fab fa-github',
        twitter: 'fab fa-x-twitter',
        instagram: 'fab fa-instagram',
        facebook: 'fab fa-facebook-f',
        youtube: 'fab fa-youtube',
        whatsapp: 'fab fa-whatsapp',
        telegram: 'fab fa-telegram',
        reddit: 'fab fa-reddit-alien',
        other: 'fas fa-link',
    };

    const PROJECT_STATUS = { completed: 'Completed', in_progress: 'In Progress', planned: 'Planned' };
    const RESEARCH_STATUS = { published: 'Published', under_review: 'Under Review', in_progress: 'In Progress' };

    // ─── Helpers ─────────────────────────────────────────────────────────────
    function esc(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // "2026-07-05" -> "July 05, 2026" (same as Django's "F d, Y")
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'];
    function formatDate(iso) {
        const [y, m, d] = String(iso || '').split('-');
        if (!y || !m || !d) return esc(iso);
        return `${MONTHS[Number(m) - 1]} ${d.padStart(2, '0')}, ${y}`;
    }

    // Strip HTML and keep the first n words (Django's striptags|truncatewords)
    function truncateWords(html, n) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html || '';
        const words = tmp.textContent.trim().split(/\s+/).filter(Boolean);
        return words.length > n ? words.slice(0, n).join(' ') + '…' : words.join(' ');
    }

    // Static page address for a blog or research item (pages are made by tools/build.js).
    // Keep slugify in sync with tools/build.js.
    function slugify(text) {
        return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }
    function blogUrl(b) { return `blog/${b.slug || slugify(b.title)}.html`; }
    function researchUrl(r) { return `research/${r.slug || slugify(r.title)}.html`; }

    function byId(list, id) {
        return (list || []).find(item => String(item.id) === String(id));
    }

    function queryId() {
        return new URLSearchParams(window.location.search).get('id');
    }

    function fill(id, html) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
        return el;
    }

    function emptyMessage(text) {
        return `<p style="grid-column: 1/-1; text-align: center; color: var(--gray);">${text}</p>`;
    }

    // ─── Shared cards ────────────────────────────────────────────────────────
    const STATUS_ICONS = { completed: 'fas fa-check', in_progress: 'far fa-clock', planned: 'far fa-calendar' };

    // Icon shown in each tech tag. Unknown names get a generic code icon.
    const TECH_ICONS = {
        'kotlin': 'fab fa-android',
        'android': 'fab fa-android',
        'java': 'fab fa-java',
        'jetpack compose': 'fas fa-cube',
        'room': 'fas fa-layer-group',
        'on-device ai': 'fas fa-brain',
        'ai': 'fas fa-brain',
        'machine learning': 'fas fa-brain',
        'model training': 'fas fa-chart-line',
        'programming': 'fas fa-terminal',
        'google play billing': 'fab fa-google-play',
        'web app': 'fas fa-globe',
        'mobile app development': 'fas fa-mobile-screen',
        'hrms': 'fas fa-users',
        'app maintenance': 'fas fa-wrench',
        'python': 'fab fa-python',
        'django': 'fab fa-python',
        'react': 'fab fa-react',
        'javascript': 'fab fa-js',
        'docker': 'fab fa-docker',
        'aws': 'fab fa-aws',
        'firebase': 'fas fa-fire',
        'database': 'fas fa-database',
    };

    // first = true gives the card the highlighted border (used for the newest project)
    function projectCard(p, first) {
        const media = p.image
            ? `<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">`
            : '<i class="fas fa-laptop-code"></i>';
        const status = PROJECT_STATUS[p.status] || PROJECT_STATUS.completed;
        const statusKey = PROJECT_STATUS[p.status] ? p.status : 'completed';
        const tags = (p.tech || []).map(t =>
            `<span class="work-tag"><i class="${TECH_ICONS[String(t).toLowerCase()] || 'fas fa-code'}"></i>${esc(t)}</span>`
        ).join('');
        // Only show a button when there is somewhere to go (confidential work has no link)
        const link = p.link
            ? `<a href="${esc(p.link)}" class="work-link" target="_blank" rel="noopener">View Project <i class="fas fa-arrow-up-right-from-square"></i></a>`
            : '';
        return `
            <article class="work-card${first ? ' work-card-highlight' : ''}">
                <div class="work-media">${media}</div>
                <div class="work-body">
                    <div class="work-title-row">
                        <h3>${esc(p.title)}</h3>
                        <span class="work-status work-status-${statusKey}"><i class="${STATUS_ICONS[statusKey]}"></i> ${status}</span>
                    </div>
                    <p>${esc(p.description)}</p>
                    <div class="work-tags">${tags}</div>
                    ${link}
                </div>
            </article>`;
    }

    function researchCard(r, words, showAuthorsAndTags) {
        const href = researchUrl(r);
        const image = r.image
            ? `<div class="blog-image" style="background-image: url('${esc(r.image)}')"></div>`
            : `<div class="blog-image" style="background: linear-gradient(135deg, rgba(74,108,247,0.15) 0%, rgba(106,117,249,0.08) 100%); display:flex; align-items:center; justify-content:center;"><i class="fas fa-flask" style="font-size:2.5rem; color:var(--primary); opacity:0.5;"></i></div>`;
        const authors = showAuthorsAndTags && r.authors && r.authors.length
            ? `&nbsp;&nbsp;<i class="fas fa-user"></i> ${esc(r.authors.join(', '))}` : '';
        const tags = showAuthorsAndTags
            ? `<div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px;">
                   ${(r.tags || []).map(t => `<span class="blog-tag">${esc(t)}</span>`).join('')}
               </div>` : '';
        return `
            <div class="blog-card" onclick="window.location='${href}'" style="cursor:pointer;">
                <div class="blog-header">
                    <span class="blog-category">${RESEARCH_STATUS[r.status] || esc(r.status)}</span>
                    ${image}
                </div>
                <div class="blog-body">
                    <div class="blog-date"><i class="far fa-calendar"></i> ${formatDate(r.date)}${authors}</div>
                    <h3 class="blog-title">${esc(r.title)}</h3>
                    <p class="blog-excerpt">${esc(truncateWords(r.abstract, words))}</p>
                    ${tags}
                    <a href="${href}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>`;
    }

    // "2025-02-22" -> "Feb 2025"
    function monthYear(iso) {
        const [y, m] = String(iso || '').split('-');
        return y && m ? `${MONTHS[Number(m) - 1].slice(0, 3)} ${y}` : '';
    }

    function certificateCard(c) {
        const media = c.image
            ? `<img src="${esc(c.image)}" alt="${esc(c.title)} certificate from ${esc(c.issuer)}" loading="lazy">`
            : '<i class="fas fa-certificate"></i>';
        const issued = c.date ? `<span class="work-status work-status-completed"><i class="fas fa-check"></i> Issued ${monthYear(c.date)}</span>` : '';
        const tags = (c.tags || []).map(t =>
            `<span class="work-tag"><i class="${TECH_ICONS[String(t).toLowerCase()] || 'fas fa-graduation-cap'}"></i>${esc(t)}</span>`
        ).join('');
        const link = c.link
            ? `<a href="${esc(c.link)}" class="work-link" target="_blank" rel="noopener">View Certificate <i class="fas fa-arrow-up-right-from-square"></i></a>`
            : '';
        return `
            <article class="work-card">
                <div class="work-media work-media-cert">${media}</div>
                <div class="work-body">
                    <div class="work-title-row">
                        <h3>${esc(c.title)}</h3>
                        ${issued}
                    </div>
                    <p class="work-issuer"><i class="fas fa-award"></i> ${esc(c.issuer)}${c.credentialId ? ` &middot; <span class="work-credential">ID: ${esc(c.credentialId)}</span>` : ''}</p>
                    <p>${esc(c.description)}</p>
                    <div class="work-tags">${tags}</div>
                    ${link}
                </div>
            </article>`;
    }

    function notFound(title, backHref, backLabel) {
        document.title = 'Page not found | Suraj Nahak';
        fill('detail-hero', `<h1>${title}</h1><p>It may have been moved or removed.</p>`);
        fill('detail-body', `<a href="${backHref}" class="btn"><i class="fas fa-arrow-left"></i> ${backLabel}</a>`);
        document.getElementById('related-section').remove();
    }

    // ─── Layout: resume link + footer (every page) ───────────────────────────
    function renderLayout() {
        if (site.resume) {
            const navUl = document.querySelector('nav ul');
            const li = document.createElement('li');
            li.innerHTML = `<a href="${esc(site.resume)}" class="nav-link" download><i class="fas fa-download"></i> Resume</a>`;
            navUl.appendChild(li);
        }

        const footer = document.querySelector('footer');
        if (!footer) return;
        const social = (DATA.socialLinks || []).map(link =>
            `<a href="${esc(link.url)}" target="_blank" rel="noopener"><i class="${PLATFORM_ICONS[link.platform] || PLATFORM_ICONS.other}"></i></a>`
        ).join('');

        footer.innerHTML = `
        <div class="container">
            <div class="footer-container">
                <div class="footer-col">
                    <h3>${esc(site.name || 'Suraj Nahak')}</h3>
                    <p>${esc(site.about || 'AI/ML software engineer and freelancer, working on algorithms, research and the software that ships them.')}</p>
                    <div class="social-icons">${social}</div>
                </div>

                <div class="footer-col">
                    <h3>Quick Links</h3>
                    <ul class="footer-links">
                        <li><a href="index.html#hero"><i class="fas fa-chevron-right"></i> Home</a></li>
                        <li><a href="index.html#about"><i class="fas fa-chevron-right"></i> About</a></li>
                        <li><a href="projects.html"><i class="fas fa-chevron-right"></i> Projects</a></li>
                        <li><a href="index.html#skills"><i class="fas fa-chevron-right"></i> Skills</a></li>
                        <li><a href="blogs.html"><i class="fas fa-chevron-right"></i> Blogs</a></li>
                        <li><a href="index.html#contact"><i class="fas fa-chevron-right"></i> Contact</a></li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h3>Contact Info</h3>
                    <ul class="footer-links">
                        <li><a href="mailto:s.kumarnahak2022@gmail.com"><i class="fas fa-envelope"></i> s.kumarnahak2022@gmail.com</a></li>
                        <li><a href="tel:+919328600537"><i class="fas fa-phone"></i> +91 9328600537</a></li>
                        <li><a href="tel:+919157649819"><i class="fas fa-phone"></i> +91 9157649819</a></li>
                        <li><a href="#"><i class="fas fa-map-marker-alt"></i> Noida, Uttarpradesh</a></li>
                    </ul>
                </div>
            </div>

            <div class="copyright">
                <p>${esc(site.copyright || '© 2025 Suraj Nahak. All Rights Reserved.')}</p>
            </div>
        </div>`;
    }

    // ─── Home page ───────────────────────────────────────────────────────────
    function renderHome() {
        if (site.tagline) fill('hero-title', esc(site.tagline));
        if (site.heroSubtitle) fill('hero-subtitle', esc(site.heroSubtitle));

        const featured = sortByDate(DATA.projects).filter(p => p.featured);
        fill('featured-projects', featured.length
            ? featured.map((p, i) => projectCard(p, i === 0)).join('')
            : '<p>No featured projects yet.</p>');

        const certs = sortByDate(DATA.certificates);
        fill('certificates-grid', certs.length
            ? certs.map(certificateCard).join('')
            : emptyMessage('No certificates yet.'));

        const latest = sortByDate(DATA.blogs).slice(0, 3);
        fill('latest-blogs', latest.length
            ? latest.map(b => `
                <div class="project-card">
                    <div class="project-img" style="background: linear-gradient(135deg, #6a75f9 0%, #4a6cf7 100%);">
                        ${b.image ? `<img src="${esc(b.image)}" alt="${esc(b.title)}">` : '<i class="fas fa-pen-alt"></i>'}
                    </div>
                    <div class="project-content">
                        <h3>${esc(b.title)}</h3>
                        <p>${esc(b.excerpt)}</p>
                        <div class="project-tech">
                            ${(b.tags || []).map(t => `<span class="tech-tag">${esc(t)}</span>`).join('')}
                        </div>
                        <a href="${blogUrl(b)}" class="btn">Read Article</a>
                    </div>
                </div>`).join('')
            : emptyMessage('No blogs yet. Check back soon!'));
    }

    function sortByDate(list) {
        return (list || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
    }

    // ─── Projects page ───────────────────────────────────────────────────────
    function renderProjects() {
        const all = sortByDate(DATA.projects);
        fill('all-projects', all.length ? all.map((p, i) => projectCard(p, i === 0)).join('') : emptyMessage('No projects yet.'));
    }

    // ─── Blogs page: category dropdown (cards are drawn by blog.js) ──────────
    function renderBlogsPage() {
        const select = document.getElementById('category-filter');
        (DATA.categories || []).forEach(name => {
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            select.appendChild(opt);
        });
    }

    // ─── Single blog post ────────────────────────────────────────────────────
    function renderRead() {
        const id = queryId();
        const blog = byId(DATA.blogs, id);
        if (!blog) return notFound('Article not found', 'blogs.html', 'Back to Blogs');
        // Old links (read.html?id=13) go to the static page, which search engines can read.
        return window.location.replace(blogUrl(blog));

        document.title = `${blog.title} | Suraj Nahak`;
        fill('detail-hero', `
            ${blog.category ? `<span class="blog-category">${esc(blog.category)}</span>` : ''}
            <h1>${esc(blog.title)}</h1>
            <p>
                <i class="far fa-calendar"></i> ${formatDate(blog.date)}
                &nbsp;&nbsp;
                <i class="fas fa-user"></i> ${esc(blog.author)}
            </p>`);

        fill('detail-body', `
            ${blog.image ? `<img src="${esc(blog.image)}" alt="${esc(blog.title)}" style="width:100%; border-radius:12px; margin-bottom:2rem;">` : ''}
            <div class="blog-tags" style="margin-bottom:2rem;">
                ${(blog.tags || []).map(t => `<span class="blog-tag">${esc(t)}</span>`).join('')}
            </div>
            <div class="blog-detail-body">${blog.content || ''}</div>
            <div style="margin-top:3rem;">
                <a href="blogs.html" class="btn"><i class="fas fa-arrow-left"></i> Back to Blogs</a>
            </div>`);

        const related = sortByDate(DATA.blogs).filter(b => String(b.id) !== String(id)).slice(0, 3);
        const section = document.getElementById('related-section');
        if (!related.length) return section.remove();
        section.hidden = false;
        fill('related-list', related.map(rb => `
            <div class="blog-card">
                <div class="blog-header">
                    ${rb.category ? `<span class="blog-category">${esc(rb.category)}</span>` : ''}
                    <div class="blog-image" style="background-image: url('${esc(rb.image)}')"></div>
                </div>
                <div class="blog-body">
                    <div class="blog-date"><i class="far fa-calendar"></i> ${formatDate(rb.date)}</div>
                    <h3 class="blog-title">${esc(rb.title)}</h3>
                    <p class="blog-excerpt">${esc(rb.excerpt)}</p>
                    <a href="${blogUrl(rb)}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>`).join(''));
    }

    // ─── Research list ───────────────────────────────────────────────────────
    function renderResearch() {
        const items = sortByDate(DATA.research);
        fill('research-list', items.length
            ? `<div class="blog-grid">${items.map(r => researchCard(r, 25, true)).join('')}</div>`
            : `<div style="text-align:center; padding:80px 0;">
                   <i class="fas fa-flask" style="font-size:4rem; color:var(--primary); opacity:0.3; display:block; margin-bottom:1.5rem;"></i>
                   <h3 style="color:var(--gray); font-weight:500;">Nothing published yet</h3>
                   <p style="color:var(--gray);">Stay tuned — ideas are brewing!</p>
               </div>`);
    }

    // ─── Single research item ────────────────────────────────────────────────
    function renderResearchDetail() {
        const id = queryId();
        const item = byId(DATA.research, id);
        if (!item) return notFound('Research item not found', 'research.html', 'Back to Research');
        return window.location.replace(researchUrl(item));

        document.title = `${item.title} | Suraj Nahak`;
        const authors = item.authors && item.authors.length
            ? `&nbsp;&nbsp; <i class="fas fa-user"></i> ${esc(item.authors.join(', '))}` : '';
        const venue = item.venue ? `&nbsp;&nbsp; <i class="fas fa-landmark"></i> ${esc(item.venue)}` : '';
        fill('detail-hero', `
            <span class="blog-category">${RESEARCH_STATUS[item.status] || esc(item.status)}</span>
            <h1>${esc(item.title)}</h1>
            <p><i class="far fa-calendar"></i> ${formatDate(item.date)} ${authors} ${venue}</p>`);

        fill('detail-body', `
            ${item.image ? `<img src="${esc(item.image)}" alt="${esc(item.title)}" style="width:100%; border-radius:12px; margin-bottom:2rem;">` : ''}
            <div class="blog-tags" style="margin-bottom:2rem;">
                ${(item.tags || []).map(t => `<span class="blog-tag">${esc(t)}</span>`).join('')}
            </div>
            <div class="blog-detail-body">${item.abstract || ''}</div>
            ${item.link ? `
            <div style="margin-top:2rem;">
                <a href="${esc(item.link)}" target="_blank" rel="noopener" class="btn">
                    <i class="fas fa-external-link-alt"></i> View Full Paper
                </a>
            </div>` : ''}
            <div style="margin-top:2rem;">
                <a href="research.html" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back to Research</a>
            </div>`);

        const related = sortByDate(DATA.research).filter(r => String(r.id) !== String(id)).slice(0, 3);
        const section = document.getElementById('related-section');
        if (!related.length) return section.remove();
        section.hidden = false;
        fill('related-list', related.map(r => researchCard(r, 20, false)).join(''));
    }

    // ─── Run ─────────────────────────────────────────────────────────────────
    renderLayout();
    const renderers = {
        home: renderHome,
        projects: renderProjects,
        blogs: renderBlogsPage,
        read: renderRead,
        research: renderResearch,
        'research-detail': renderResearchDetail,
    };
    if (renderers[page]) renderers[page]();

    // Shared with blog.js
    window.SiteHelpers = { esc, formatDate, sortByDate, blogUrl, researchUrl, DEFAULT_BLOG_IMAGE };
})();
