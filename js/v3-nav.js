/* js/v3-nav.js
   Standalone driver for the V3 site header + mobile hamburger drawer on the
   interior pages (furniture, about, cabinets). The homepage runs its own copy
   of this logic inside js/home-variants.js, gated behind the V3 variant; this
   file is the decoupled version for pages that always show the V3 header. */

(function () {
    'use strict';

    function initV3Nav(header) {
        var toggle = header.querySelector('.v3-nav-toggle');
        var nav = header.querySelector('.v3-nav');
        if (!toggle || !nav || toggle.dataset.bound) return;
        toggle.dataset.bound = '1';

        // Backdrop that sits behind the open drawer and closes it on tap.
        var backdrop = document.createElement('div');
        backdrop.className = 'v3-nav-backdrop';
        header.appendChild(backdrop);

        // Reveal the drawer (visibility) only after JS has run and positioned
        // it, so it can't flash as an inline row before CSS/JS take over. The
        // slide transition itself is enabled separately, on first open.
        requestAnimationFrame(function () {
            requestAnimationFrame(function () { header.classList.add('is-ready'); });
        });

        function setOpen(open) {
            // Enable the slide transition on the first real open, so the drawer
            // never animates when it first appears or on a window resize into
            // the mobile breakpoint (it just sits off-screen until tapped).
            if (open) nav.classList.add('v3-nav--animated');
            toggle.classList.toggle('is-open', open);
            nav.classList.toggle('is-open', open);
            backdrop.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            // Lock the page behind the drawer so only the menu scrolls.
            document.body.classList.toggle('v3-nav-lock', open);
            // Move focus into the drawer on open (to the close button) and
            // back to the hamburger on close, for keyboard/AT users.
            if (open) {
                var first = nav.querySelector('.v3-nav-close');
                if (first) first.focus();
            } else {
                toggle.focus();
            }
        }

        toggle.addEventListener('click', function () {
            setOpen(!nav.classList.contains('is-open'));
        });
        backdrop.addEventListener('click', function () { setOpen(false); });
        var closeBtn = nav.querySelector('.v3-nav-close');
        if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); });
        // Close after choosing a destination or pressing Escape.
        nav.addEventListener('click', function (e) {
            if (e.target.closest('a')) setOpen(false);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setOpen(false);
        });
    }

    // Mark the link for the current page so its underline / active style shows.
    function markCurrent(header) {
        var here = window.location.pathname.replace(/\/index\.html$/, '/');
        var links = header.querySelectorAll('.v3-nav__links a');
        Array.prototype.forEach.call(links, function (a) {
            var path = a.getAttribute('href');
            if (!path) return;
            // Compare on the final filename (e.g. "furniture.html").
            var target = path.split('/').pop();
            var current = here.split('/').pop();
            if (target && current && target === current) {
                a.setAttribute('aria-current', 'page');
            }
        });
    }

    function init() {
        var headers = document.querySelectorAll('.v3-header');
        Array.prototype.forEach.call(headers, function (h) {
            initV3Nav(h);
            markCurrent(h);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
