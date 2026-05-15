/* js/marquee.js */

class MarqueeKit {
    constructor(selector, options = {}) {
        this.options = {
            images: [],
            speed: 100,
            height: 300,
            imageWidth: 250,
            imageFit: 'cover',
            gap: 20,
            lazyLoad: false,
            pauseOnHover: false,
            reverse: false,
            imageScale: 1,
            borderRadius: 8,
            ...options
        };

        this.container = typeof selector === 'string'
            ? document.querySelector(selector)
            : selector;

        if (!this.container) {
            console.error('MarqueeKit: Container element not found');
            return;
        }

        this.isAnimating = false;
        this.lastTimestamp = null;
        this.currentTranslate = 0;
        this.contentWidth = 0;
        this.animationFrame = null;
        this.targetSpeed = this.options.speed;
        this.currentSpeed = this.options.speed;

        this.boundAnimate = this.animate.bind(this);
        this.visibilityChangeHandler = this.handleVisibilityChange.bind(this);

        this.init();
    }

    init() {
        this.setupContainer();
        this.createContent();
    }

    setupContainer() {
        this.container.classList.add('marquee-container');
        this.container.style.height = `${this.options.height}px`;
        this.container.style.overflow = 'hidden';
        this.container.style.position = 'relative';
        this.container.style.setProperty('--marquee-scale', `${this.options.imageScale}`);

        this.loadingOverlay = document.createElement('div');
        this.loadingOverlay.classList.add('marquee-loading');
        this.container.appendChild(this.loadingOverlay);
    }

    normalizeImageEntry(entry) {
        if (typeof entry === 'string') {
            return { src: entry, alt: '' };
        }
        return {
            src: entry.src,
            alt: entry.alt || '',
            className: entry.className || ''
        };
    }

    createContent() {
        this.track = document.createElement('div');
        this.track.classList.add('marquee-track');

        this.items = this.options.images.map(rawEntry => {
            const entry = this.normalizeImageEntry(rawEntry);
            const item = document.createElement('div');
            item.classList.add('marquee-item');
            item.style.marginRight = `${this.options.gap}px`;

            const img = document.createElement('img');
            img.src = entry.src;
            img.alt = entry.alt;
            img.classList.add('marquee-image');
            if (entry.className) {
                img.classList.add(...entry.className.split(' ').filter(Boolean));
            }
            // Keep widths stable on mobile Safari by eagerly loading marquee images.
            img.loading = this.options.lazyLoad ? 'lazy' : 'eager';
            img.decoding = 'async';

            if (this.options.imageWidth === 'auto') {
                img.style.width = 'auto';
                img.style.height = '100%';
                img.style.objectFit = 'contain';
            } else {
                img.style.width = `${this.options.imageWidth}px`;
                img.style.height = '100%';
                img.style.objectFit = this.options.imageFit;
            }

            img.style.display = 'block';
            img.style.backfaceVisibility = 'hidden';
            img.style.transform = 'translateZ(0)';
            img.style.borderRadius = `${this.options.borderRadius}px`;

            item.appendChild(img);
            return item;
        });

        this.items.forEach(item => this.track.appendChild(item));
        this.items.forEach(item => this.track.appendChild(item.cloneNode(true)));

        this.container.appendChild(this.track);

        this.waitForImages().then(() => {
            if (this.loadingOverlay) {
                this.container.removeChild(this.loadingOverlay);
                this.loadingOverlay = null;
            }

            // Safari/iOS can mis-measure auto-width flex items; set explicit widths.
            this.applyAutoItemWidths();
            this.calculateDimensions();
            this.setupIntersectionObserver();
            this.setupEventListeners();
            this.startAnimation();
        });
    }

    waitForImages() {
        const images = this.items
            .map(item => item.querySelector('img'))
            .filter(Boolean);
        const promises = images.map(img => new Promise(resolve => {
            if (img.complete) {
                resolve();
            } else {
                img.onload = img.onerror = resolve;
            }
        }));
        return Promise.all(promises);
    }

    applyAutoItemWidths() {
        if (this.options.imageWidth !== 'auto') return;

        const containerHeight = this.container.clientHeight || this.options.height;
        this.items.forEach(item => {
            const img = item.querySelector('img');
            if (!img) return;

            const naturalWidth = img.naturalWidth || 1;
            const naturalHeight = img.naturalHeight || 1;
            const ratio = naturalWidth / naturalHeight;
            const width = Math.max(1, Math.round(containerHeight * ratio));

            item.style.width = `${width}px`;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
        });
    }

    calculateDimensions() {
        this.contentWidth = this.items.reduce((total, item) => {
            const style = window.getComputedStyle(item);
            const marginRight = parseFloat(style.marginRight) || 0;
            return total + item.offsetWidth + marginRight;
        }, 0);

        this.track.style.width = `${this.contentWidth * 2}px`;
        if (this.options.reverse) {
            this.currentTranslate = -this.contentWidth;
        }
    }

    animate(timestamp) {
        if (!this.isAnimating) return;

        if (!this.lastTimestamp) {
            this.lastTimestamp = timestamp;
        }

        const elapsed = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;

        const speedDiff = this.targetSpeed - this.currentSpeed;
        if (Math.abs(speedDiff) > 0.1) {
            this.currentSpeed += speedDiff * 0.03;
        } else {
            this.currentSpeed = this.targetSpeed;
        }

        const distance = (this.currentSpeed * elapsed) / 1000;
        this.currentTranslate += this.options.reverse ? distance : -distance;

        const totalWidth = this.contentWidth || 1;
        if (this.options.reverse) {
            this.currentTranslate = ((this.currentTranslate + totalWidth) % totalWidth) - totalWidth;
        } else {
            this.currentTranslate = this.currentTranslate % totalWidth;
        }

        this.track.style.transform = `translate3d(${this.currentTranslate}px, 0, 0)`;
        this.animationFrame = requestAnimationFrame(this.boundAnimate);
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.startAnimation();
                    } else {
                        this.stopAnimation();
                    }
                });
            },
            { threshold: 0.1 }
        );

        this.observer.observe(this.container);
    }

    setupEventListeners() {
        if (this.options.pauseOnHover) {
            this.container.addEventListener('mouseenter', () => this.slowDown());
            this.container.addEventListener('mouseleave', () => {
                if (document.visibilityState === 'visible') {
                    this.speedUp();
                }
            });
        }

        document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    }

    handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            this.startAnimation();
        } else {
            this.stopAnimation();
        }
    }

    startAnimation() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.lastTimestamp = null;
            this.animationFrame = requestAnimationFrame(this.boundAnimate);
        }
    }

    stopAnimation() {
        this.isAnimating = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    slowDown() {
        this.targetSpeed = 0;
    }

    speedUp() {
        this.targetSpeed = this.options.speed;
        this.startAnimation();
    }

    destroy() {
        this.stopAnimation();
        this.container.innerHTML = '';
        if (this.observer) {
            this.observer.disconnect();
        }
        document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarqueeKit;
} else {
    window.MarqueeKit = MarqueeKit;
}
