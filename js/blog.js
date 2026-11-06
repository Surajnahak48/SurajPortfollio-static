// Blogs page: list, search and category filter.
// Data comes from js/data.js instead of the old Django /api/blogs/ endpoint.
(function () {
    const { esc, formatDate, sortByDate, blogUrl, DEFAULT_BLOG_IMAGE } = window.SiteHelpers;

    const blogs = sortByDate((window.SITE_DATA || {}).blogs).map(b => ({
        ...b,
        image: b.image || DEFAULT_BLOG_IMAGE,
        tags: b.tags || [],
        excerpt: b.excerpt || '',
    }));

    const blogList = document.getElementById('blog-list');
    const blogSearch = document.getElementById('blog-search');
    const categoryFilter = document.getElementById('category-filter');

    function renderBlogs(blogsToRender) {
        if (blogsToRender.length === 0) {
            blogList.innerHTML = `
                <div class="no-results">
                    <h3>No blogs found</h3>
                    <p>Try adjusting your search or filter</p>
                </div>`;
            return;
        }

        blogList.innerHTML = blogsToRender.map(blog => `
            <div class="blog-card">
                <div class="blog-header">
                    <span class="blog-category">${esc(blog.category)}</span>
                    <div class="blog-image" style="background-image: url('${esc(blog.image)}')"></div>
                </div>
                <div class="blog-body">
                    <div class="blog-date">
                        <i class="far fa-calendar"></i> ${formatDate(blog.date)}
                    </div>
                    <h3 class="blog-title">${esc(blog.title)}</h3>
                    <p class="blog-excerpt">${esc(blog.excerpt)}</p>
                    <div class="blog-tags">
                        ${blog.tags.map(tag => `<span class="blog-tag">${esc(tag)}</span>`).join('')}
                    </div>
                    <div class="blog-author">
                        <div class="author-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="author-name">${esc(blog.author)}</div>
                    </div>
                    <a href="${blogUrl(blog)}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>`).join('');
    }

    function filterBlogs() {
        const searchTerm = blogSearch.value.toLowerCase();
        const category = categoryFilter.value;

        renderBlogs(blogs.filter(blog => {
            const matchesSearch =
                blog.title.toLowerCase().includes(searchTerm) ||
                blog.excerpt.toLowerCase().includes(searchTerm) ||
                blog.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            const matchesCategory = category === 'all' || blog.category === category;
            return matchesSearch && matchesCategory;
        }));
    }

    blogSearch.addEventListener('input', filterBlogs);
    categoryFilter.addEventListener('change', filterBlogs);
    renderBlogs(blogs);
})();
