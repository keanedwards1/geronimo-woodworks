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

function buildInfiniteTrack(scroll, originalItems, visibleCount) {
    const headClones = originalItems.slice(-visibleCount).map(item => item.cloneNode(true));
    const tailClones = originalItems.slice(0, visibleCount).map(item => item.cloneNode(true));

    scroll.innerHTML = '';
    headClones.forEach(node => scroll.appendChild(node));
    originalItems.forEach(node => scroll.appendChild(node));
    tailClones.forEach(node => scroll.appendChild(node));
}

document.addEventListener('DOMContentLoaded', function () {
    const groups = document.querySelectorAll('.gallery-group');

    groups.forEach(group => {
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

        let prev;
        let next;

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
        let visibleCount = getVisibleCount(originalItems.length);
        let logicalIndex = 0;
        let isAnimating = false;

        function setTranslate(trackIndex, animate) {
            const firstItem = scroll.querySelector('.gallery-item-wrapper');
            if (!firstItem) return;

            const styles = window.getComputedStyle(firstItem);
            const itemWidth = firstItem.getBoundingClientRect().width;
            const gap = parseFloat(styles.marginRight) || 0;
            const step = itemWidth + gap;

            scroll.style.transition = animate ? 'transform 0.35s ease' : 'none';
            scroll.style.transform = `translateX(${-trackIndex * step}px)`;
        }

        function initTrack() {
            visibleCount = getVisibleCount(originalItems.length);
            logicalIndex = ((logicalIndex % originalItems.length) + originalItems.length) % originalItems.length;

            if (originalItems.length <= visibleCount) {
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

            buildInfiniteTrack(scroll, originalItems, visibleCount);
            setTranslate(logicalIndex + visibleCount, false);
        }

        function goNext() {
            if (isAnimating || originalItems.length <= visibleCount) return;
            isAnimating = true;
            logicalIndex += 1;
            setTranslate(logicalIndex + visibleCount, true);
        }

        function goPrev() {
            if (isAnimating || originalItems.length <= visibleCount) return;
            isAnimating = true;
            logicalIndex -= 1;
            setTranslate(logicalIndex + visibleCount, true);
        }

        scroll.addEventListener('transitionend', function () {
            if (originalItems.length <= visibleCount) return;

            if (logicalIndex >= originalItems.length) {
                logicalIndex = 0;
                setTranslate(logicalIndex + visibleCount, false);
            } else if (logicalIndex < 0) {
                logicalIndex = originalItems.length - 1;
                setTranslate(logicalIndex + visibleCount, false);
            }

            isAnimating = false;
        });

        if (prev && next) {
            prev.addEventListener('click', function (event) {
                event.preventDefault();
                goPrev();
            });

            next.addEventListener('click', function (event) {
                event.preventDefault();
                goNext();
            });
        }

        group.setAttribute('tabindex', '0');
        group.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                goPrev();
            }
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                goNext();
            }
        });

        let touchStartX = 0;
        let touchEndX = 0;
        group.addEventListener('touchstart', function (event) {
            touchStartX = event.changedTouches[0].screenX;
        }, { passive: true });

        group.addEventListener('touchend', function (event) {
            touchEndX = event.changedTouches[0].screenX;
            const swipeDistance = touchEndX - touchStartX;
            if (Math.abs(swipeDistance) < 45) return;
            if (swipeDistance < 0) goNext();
            if (swipeDistance > 0) goPrev();
        }, { passive: true });

        initTrack();
        window.addEventListener('resize', initTrack);
    });
});
