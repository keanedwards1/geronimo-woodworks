/* js/home-variants.js
   Drives the homepage variant switcher (a 5-step slider) and the video
   behaviour for V3 (cinematic intro) and V4/V5 (background loops). */

(function () {
    'use strict';

    var STORAGE_KEY = 'hv-active-variant';
    var variants = Array.prototype.slice.call(
        document.querySelectorAll('.home-variant')
    );
    if (!variants.length) return;

    var slider = document.querySelector('.variant-slider__input');
    var scaleMarks = Array.prototype.slice.call(
        document.querySelectorAll('.variant-slider__scale span')
    );

    function getSaved() {
        try { return window.localStorage.getItem(STORAGE_KEY); }
        catch (e) { return null; }
    }
    function save(id) {
        try { window.localStorage.setItem(STORAGE_KEY, id); }
        catch (e) { /* ignore */ }
    }

    // Pause every video, then resume the auto-looping ones in the active variant.
    function syncVideos(activeEl) {
        variants.forEach(function (v) {
            v.querySelectorAll('video').forEach(function (vid) {
                if (v === activeEl) {
                    if (vid.dataset.autoloop === 'true') {
                        var p = vid.play();
                        if (p && p.catch) p.catch(function () {});
                    }
                } else {
                    vid.pause();
                }
            });
        });
    }

    function activate(id, opts) {
        opts = opts || {};
        var activeEl = null;

        variants.forEach(function (v) {
            var match = v.getAttribute('data-variant') === id;
            v.classList.toggle('is-active', match);
            if (match) activeEl = v;
        });
        if (!activeEl) {
            activeEl = variants[0];
            id = activeEl.getAttribute('data-variant');
            activeEl.classList.add('is-active');
        }

        var num = parseInt(id.replace('v', ''), 10) || 1;
        if (slider && parseInt(slider.value, 10) !== num) slider.value = String(num);
        scaleMarks.forEach(function (m, i) {
            m.classList.toggle('is-active', i === num - 1);
        });

        save(id);
        syncVideos(activeEl);

        if (id === 'v3') runIntro(activeEl, opts.replayIntro !== false);
        window.scrollTo({ top: 0, behavior: 'auto' });
    }

    /* ---- V3 cinematic intro ---- */
    var introTimer = null;
    function runIntro(v3El, doRun) {
        var intro = v3El.querySelector('.v3-intro');
        if (!intro) return;
        var video = intro.querySelector('video');

        function finish() {
            if (introTimer) { clearTimeout(introTimer); introTimer = null; }
            intro.classList.add('is-hiding');
            window.setTimeout(function () {
                intro.classList.add('is-done');
                if (video) video.pause();
            }, 800);
        }

        intro.classList.remove('is-hiding', 'is-done');
        if (!doRun) { intro.classList.add('is-done'); return; }

        if (video) {
            video.currentTime = 0;
            var pr = video.play();
            if (pr && pr.catch) pr.catch(function () { /* autoplay blocked */ });
            video.onended = finish;
        }
        // Safety timeout so the site is always revealed even if autoplay
        // is blocked or the video stalls.
        introTimer = window.setTimeout(finish, 9000);

        var skip = intro.querySelector('.v3-intro__skip');
        if (skip) skip.onclick = finish;
        intro.onclick = function (e) {
            if (e.target === intro || e.target.tagName === 'VIDEO') finish();
        };
    }

    /* ---- slider control ---- */
    if (slider) {
        slider.addEventListener('input', function () {
            activate('v' + slider.value, { replayIntro: true });
        });
    }

    // Initial variant: ?home=vN override, then saved choice, then first (V1).
    var urlVariant = null;
    try {
        var m = /[?&]home=(v[1-5])/i.exec(window.location.search);
        if (m) urlVariant = m[1].toLowerCase();
    } catch (e) { /* ignore */ }
    var initial = urlVariant || getSaved() || variants[0].getAttribute('data-variant');
    activate(initial, { replayIntro: true });
})();
