// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function () {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Check if it's an anchor link (starts with #)
            if (href.startsWith('#')) {
                e.preventDefault();

                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    // Calculate offset for fixed header
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;

                    // Smooth scroll to target
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
            // For Django URL links (projects, blogs), let them navigate normally
        });
    });

    // Tab functionality for skills/certificates
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Mobile menu functionality
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const closeBtn = document.querySelector('.close-menu-btn');
    const navUl = document.querySelector('nav ul');

    function closeMenu() {
        navUl.classList.remove('open');
        navUl.classList.add('closing');
        setTimeout(() => {
            navUl.classList.remove('closing');
        }, 300); // Match your CSS transition duration
        menuBtn.classList.remove('hide');
        closeBtn.classList.remove('show');
    }

    menuBtn.addEventListener('click', function () {
        if (navUl.classList.contains('open')) {
            closeMenu();
        } else {
            navUl.classList.add('open');
            menuBtn.classList.add('hide');
            closeBtn.classList.add('show');
        }
    });

    closeBtn.addEventListener('click', closeMenu);

    // Optional: Close menu when a link is clicked
    navUl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Hero "live workflow" panel: run the steps one by one, then start over
    const flowList = document.querySelector('.flow-steps');
    if (flowList) {
        const flowSteps = flowList.querySelectorAll('.flow-step');
        const STEP_MS = 1500;
        const RESTART_MS = 2800;
        let doneCount = 0;

        function showFlow() {
            flowSteps.forEach((step, i) => {
                step.classList.toggle('is-done', i < doneCount);
                step.classList.toggle('is-running', i === doneCount);
            });
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            doneCount = flowSteps.length;
            showFlow();
        } else {
            flowList.classList.add('is-live');
            (function runFlow() {
                showFlow();
                const finished = doneCount === flowSteps.length;
                doneCount = finished ? 0 : doneCount + 1;
                setTimeout(runFlow, finished ? RESTART_MS : STEP_MS);
            })();
        }
    }
});
