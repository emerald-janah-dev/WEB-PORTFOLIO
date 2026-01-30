(function () {
    var themeKey = 'codewave-theme';
    var html = document.documentElement;
    var themeToggle = document.getElementById('themeToggle');
    var iconSun = document.getElementById('iconSun');
    var iconMoon = document.getElementById('iconMoon');

    function setTheme(dark) {
        if (dark) {
            html.setAttribute('data-theme', 'dark');
            if (iconSun) iconSun.style.display = 'none';
            if (iconMoon) iconMoon.style.display = 'block';
        } else {
            html.removeAttribute('data-theme');
            if (iconSun) iconSun.style.display = 'block';
            if (iconMoon) iconMoon.style.display = 'none';
        }
        try { localStorage.setItem(themeKey, dark ? 'dark' : 'light'); } catch (e) {}
    }

    var saved = null;
    try { saved = localStorage.getItem(themeKey); } catch (e) {}
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = saved === 'dark' || (!saved && prefersDark);
    setTheme(isDark);

    if (themeToggle) themeToggle.addEventListener('click', function () {
        isDark = html.getAttribute('data-theme') === 'dark';
        setTheme(!isDark);
    });

    var backToTop = document.getElementById('backToTop');
    if (backToTop) backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    var form = document.getElementById('contactForm');
    if (form) form.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Thanks! We\'ll get back to you soon.');
        form.reset();
    });

    /* Scroll reveal: animate in when entering viewport (scroll down or up) */
    var revealEls = document.querySelectorAll('.reveal-on-scroll');
    if (revealEls.length && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                } else {
                    entry.target.classList.remove('revealed');
                }
            });
        }, { rootMargin: '-80px 0px 0px 0px', threshold: 0.01 });
        revealEls.forEach(function (el) { observer.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('revealed'); });
    }

    /* Team hover: show fullscreen GIF behind the team section when any member-card is hovered.
       Each .member-card may define a `data-hover-gif` attribute with the GIF URL. */
    (function () {
        var team = document.getElementById('team');
        if (!team) return;
        var cards = document.querySelectorAll('.team-grid .member-card');
        if (!cards || !cards.length) return;

        cards.forEach(function (card) {
            // support per-mode GIFs: use data-hover-gif-light and data-hover-gif-dark
            var gifLight = card.getAttribute('data-hover-gif-light');
            var gifDark = card.getAttribute('data-hover-gif-dark');
            var gifFallback = card.getAttribute('data-hover-gif');

            card.addEventListener('mouseenter', function () {
                var isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
                var chosen = isDarkMode ? (gifDark || gifFallback) : (gifLight || gifFallback);
                if (chosen) {
                    // ensure it's wrapped as url("path") for CSS var
                    var urlValue = chosen.trim();
                    // if the attribute already contains url(...), use as-is
                    if (!/^url\(/i.test(urlValue)) urlValue = 'url("' + urlValue.replace(/"/g, '\\"') + '")';
                    team.style.setProperty('--team-hover-gif', urlValue);
                    team.classList.add('team-gif-active');
                }
            });

            card.addEventListener('mouseleave', function () {
                team.classList.remove('team-gif-active');
                setTimeout(function () { team.style.removeProperty('--team-hover-gif'); }, 400);
            });
        });
    })();

})();
