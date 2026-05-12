function formatProjectLabel(rawLabel) {
    if (!rawLabel) return '';
    return rawLabel
        .replace(/michael bock/ig, '')
        .replace(/\s*\d+\s*$/g, '')
        .replace(/[_-]+/g, ' ')
        .replace(/\b(side|left|right|front|back|detail|closeup|angle)\b/ig, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function ensureCaption(group, label) {
    if (!label || group.querySelector('.project-caption')) return;
    const caption = document.createElement('p');
    caption.className = 'project-caption';
    caption.textContent = label;
    group.appendChild(caption);
}

function getVisibleCount(totalItems) {
    if (!totalItems) return 1;
    if (window.innerWidth <= 620) return Math.min(2, totalItems);
    return Math.min(3, totalItems);
}

// ─── Reel page gallery (cabinets / furniture) ────────────────────────────────
// Triple-track layout: [copy1][originalItems][copy3]
// Snapping back to the middle copy (always decoded) prevents flash on loop reset.

function buildTripleTrack(scroll, originalItems) {
    const copy1 = originalItems.map(item => item.cloneNode(true));
    const copy3 = originalItems.map(item => item.cloneNode(true));

    scroll.innerHTML = '';
    copy1.forEach(node => scroll.appendChild(node));
    originalItems.forEach(node => scroll.appendChild(node));
    copy3.forEach(node => scroll.appendChild(node));

    [...copy1, ...copy3].forEach(wrapper => {
        wrapper.classList.add('loaded');
        wrapper.querySelectorAll('img').forEach(img => {
            img.loading = 'eager';
            img.decode && img.decode().catch(() => {});
        });
    });
}

function initReelGallery(group) {
    const scroll = group.querySelector('.gallery-scroll');
    if (!scroll) return;

    const legacyPrev = group.querySelector('.gallery-nav.prev');
    const legacyNext = group.querySelector('.gallery-nav.next');

    function createControl(direction) {
        const isPrev = direction === 'previous';
        const wrapper = document.createElement('div');
        wrapper.className = `gallery-reel-control ${isPrev ? 'prev' : 'next'}`;
        const button = document.createElement('button');
        button.className = `gallery-reel-control-btn gallery-nav ${isPrev ? 'prev' : 'next'}`;
        button.type = 'button';
        button.setAttribute('aria-label', isPrev ? 'Previous Slide' : 'Next Slide');
        button.setAttribute(isPrev ? 'data-previous' : 'data-next', '');
        button.dataset.test = isPrev ? 'gallery-reel-control-btn-previous' : 'gallery-reel-control-btn-next';
        const icon = document.createElement('div');
        icon.className = 'gallery-reel-control-btn-icon';
        icon.innerHTML = "<svg viewBox='0 0 60 30'><path d='M44.1,6.3l8.7,8.7l-8.7,8.7' fill='none'></path><path d='M7.1,15h44.4' fill='none'></path></svg>";
        button.appendChild(icon);
        wrapper.appendChild(button);
        return { wrapper, button };
    }

    let prev, next;

    if (legacyPrev || legacyNext) {
        if (legacyPrev) legacyPrev.remove();
        if (legacyNext) legacyNext.remove();
        const prevControl = createControl('previous');
        const nextControl = createControl('next');
        group.appendChild(prevControl.wrapper);
        group.appendChild(nextControl.wrapper);
        prev = prevControl.button;
        next = nextControl.button;
    } else {
        prev = group.querySelector('[data-previous]');
        next = group.querySelector('[data-next]');
    }

    const firstImage = scroll.querySelector('.gallery-item');
    const fallbackLabel = firstImage ? firstImage.getAttribute('alt') : '';
    const projectLabel = formatProjectLabel(group.dataset.projectTitle || fallbackLabel);
    ensureCaption(group, projectLabel);

    const originalItems = Array.from(scroll.querySelectorAll('.gallery-item-wrapper'));
    const N = originalItems.length;
    let visibleCount = getVisibleCount(N);
    let logicalIndex = 0;
    let isAnimating = false;

    function getItemWidth(item) {
        const w = item.getBoundingClientRect().width;
        if (w > 0) return w;
        const src = item.querySelector('img') && item.querySelector('img').src;
        if (src) {
            for (const other of scroll.querySelectorAll('.gallery-item-wrapper')) {
                const img = other.querySelector('img');
                if (img && img.src === src) {
                    const ow = other.getBoundingClientRect().width;
                    if (ow > 0) return ow;
                }
            }
        }
        return 0;
    }

    function setTranslate(absoluteIndex, animate) {
        const items = Array.from(scroll.querySelectorAll('.gallery-item-wrapper'));
        if (!items.length) return;
        let offset = 0;
        for (let i = 0; i < absoluteIndex; i++) {
            if (!items[i]) break;
            const gap = parseFloat(window.getComputedStyle(items[i]).marginRight) || 0;
            offset += getItemWidth(items[i]) + gap;
        }
        scroll.style.transition = animate ? 'transform 0.35s ease' : 'none';
        scroll.style.transform = `translateX(${-offset}px)`;
    }

    function preloadCopyEdge(fromCopyStart, count) {
        const trackItems = Array.from(scroll.querySelectorAll('.gallery-item-wrapper'));
        for (let i = 0; i < count; i++) {
            const item = trackItems[fromCopyStart + i];
            if (item) item.querySelectorAll('img').forEach(img => img.decode && img.decode().catch(() => {}));
        }
    }

    function initTrack() {
        visibleCount = getVisibleCount(N);
        logicalIndex = ((logicalIndex % N) + N) % N;

        if (N <= visibleCount) {
            scroll.innerHTML = '';
            originalItems.forEach(node => scroll.appendChild(node));
            scroll.classList.add('single-item');
            setTranslate(0, false);
            if (prev) prev.parentElement.style.display = 'none';
            if (next) next.parentElement.style.display = 'none';
            return;
        }

        scroll.classList.remove('single-item');
        if (prev) prev.parentElement.style.display = '';
        if (next) next.parentElement.style.display = '';

        buildTripleTrack(scroll, originalItems);
        setTranslate(N + logicalIndex, false);
    }

    function goNext() {
        if (isAnimating || N <= visibleCount) return;
        isAnimating = true;
        logicalIndex = (logicalIndex + 1) % N;
        const currentAbsolute = N + ((logicalIndex - 1 + N) % N);
        if (logicalIndex === N - 1) preloadCopyEdge(2 * N, visibleCount + 1);
        setTranslate(currentAbsolute + 1, true);
    }

    function goPrev() {
        if (isAnimating || N <= visibleCount) return;
        isAnimating = true;
        logicalIndex = (logicalIndex - 1 + N) % N;
        const currentAbsolute = N + ((logicalIndex + 1) % N);
        if (logicalIndex === 0) preloadCopyEdge(N - visibleCount - 1, visibleCount + 1);
        setTranslate(currentAbsolute - 1, true);
    }

    scroll.addEventListener('transitionend', function () {
        if (N <= visibleCount) return;
        setTranslate(N + logicalIndex, false);
        isAnimating = false;
    });

    if (prev && next) {
        prev.addEventListener('click', e => { e.preventDefault(); goPrev(); });
        next.addEventListener('click', e => { e.preventDefault(); goNext(); });
    }

    group.setAttribute('tabindex', '0');
    group.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
    });

    let touchStartX = 0;
    group.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    group.addEventListener('touchend', function (e) {
        const swipeDistance = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(swipeDistance) < 45) return;
        if (swipeDistance < 0) goNext(); else goPrev();
    }, { passive: true });

    initTrack();
    window.addEventListener('resize', initTrack);
}

// ─── About page gallery (slide with peek, no cloning, wraps to start) ────────

function initLegacyGallery(group) {
    const scroll = group.querySelector('.gallery-scroll');
    if (!scroll) return;

    const prev = group.querySelector('.gallery-nav.prev');
    const next = group.querySelector('.gallery-nav.next');
    const items = Array.from(scroll.querySelectorAll('.gallery-item-wrapper'));
    const N = items.length;
    let currentIndex = 0;
    let isAnimating = false;

    function getStep() {
        const item = items[0];
        if (!item) return 0;
        const style = window.getComputedStyle(item);
        return item.getBoundingClientRect().width
            + parseFloat(style.marginLeft || 0)
            + parseFloat(style.marginRight || 0);
    }

    function slideTo(index, animate) {
        scroll.style.transition = animate ? 'transform 0.3s ease' : 'none';
        scroll.style.transform = `translateX(${-index * getStep()}px)`;
    }

    slideTo(0, false);

    if (prev) prev.addEventListener('click', e => {
        e.preventDefault();
        if (isAnimating) return;
        isAnimating = true;
        currentIndex = (currentIndex - 1 + N) % N;
        slideTo(currentIndex, true);
    });

    if (next) next.addEventListener('click', e => {
        e.preventDefault();
        if (isAnimating) return;
        isAnimating = true;
        currentIndex = (currentIndex + 1) % N;
        slideTo(currentIndex, true);
    });

    scroll.addEventListener('transitionend', () => { isAnimating = false; });

    group.setAttribute('tabindex', '0');
    group.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); prev && prev.click(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); next && next.click(); }
    });

    let touchStartX = 0;
    group.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    group.addEventListener('touchend', function (e) {
        const swipeDistance = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(swipeDistance) < 45) return;
        if (swipeDistance < 0) next && next.click();
        else prev && prev.click();
    }, { passive: true });

    window.addEventListener('resize', () => slideTo(currentIndex, false));
}

// ─── Entry point ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
    const isReelPage = document.body.classList.contains('project-reel-page');

    document.querySelectorAll('.gallery-group').forEach(group => {
        if (isReelPage) {
            initReelGallery(group);
        } else {
            initLegacyGallery(group);
        }
    });
});
