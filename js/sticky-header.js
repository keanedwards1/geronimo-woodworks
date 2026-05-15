// js/sticky-header.js

(function () {
    var header = document.querySelector('header');
    if (!header) return;

    // Use hysteresis so header height changes cannot flip the class repeatedly
    // while scroll is near the threshold.
    var ENTER_SCROLLED_Y = 64;
    var EXIT_SCROLLED_Y = 32;
    var isScrolled = header.classList.contains('scrolled');
    var ticking = false;

    function updateHeaderState() {
        var y = window.scrollY || window.pageYOffset || 0;

        if (!isScrolled && y >= ENTER_SCROLLED_Y) {
            isScrolled = true;
            header.classList.add('scrolled');
        } else if (isScrolled && y <= EXIT_SCROLLED_Y) {
            isScrolled = false;
            header.classList.remove('scrolled');
        }

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeaderState);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateHeaderState();
})();
