/* js/about-series-marquee.js */

function buildAboutSeriesMarquees() {
    if (typeof MarqueeKit === 'undefined') return;

    const deskTarget = document.querySelector('#desk-series-marquee');
    const rockersTarget = document.querySelector('#rockers-series-marquee');
    if (!deskTarget || !rockersTarget) return;

    const viewportHeight = window.innerHeight || 900;
    const marqueeHeight = window.innerWidth <= 768
        ? Math.max(250, Math.round(viewportHeight * 0.42))
        : Math.max(320, Math.round(viewportHeight * 0.56));

    const deskImages = [
        '/images/about-historic/archive-photos/desk-series/michael-bock-vintage-desk-table.webp',
        '/images/about-historic/archive-photos/desk-series/michael-bock-table-on-carpet.webp',
        '/images/about-historic/archive-photos/desk-series/michael-bock-blank-and-white-table.webp',
        '/images/about-historic/archive-photos/desk-series/michael-bock-desk-drawers.webp',
        '/images/about-historic/archive-photos/desk-series/michael-bock-desk-outside.webp',
        '/images/about-historic/archive-photos/desk-series/michael-bock-desk-shining.webp',
        '/images/about-historic/archive-photos/desk-series/michael-bock-desk-sleek.webp',
        '/images/about-historic/archive-photos/desk-series/michael-bock-table-with-chair.webp',
        '/images/about-historic/archive-photos/desk-series/michael-bock-vintage-drawer-detail.webp',
        '/images/about-historic/archive-photos/desk-series/michael-bock-vintage-woodworking.webp',
        '/images/about-historic/archive-photos/desk-series/michael-bock-big-desk-front.webp',
        '/images/about-historic/archive-photos/desk-series/michael-bock-big-desk-back.webp'
    ];

    const rockerImages = [
        { src: '/images/about-historic/archive-photos/chairs-and-rocking-chairs/series-reference/michael-bock-kitchen-chair-leather-seat.webp' },
        { src: '/images/about-historic/archive-photos/chairs-and-rocking-chairs/series-reference/michael-bock-kitchen-chair-side.webp' },
        { src: '/images/about-historic/archive-photos/chairs-and-rocking-chairs/series-reference/michael-bock-kitchen-chair.webp' },
        { src: '/images/about-historic/archive-photos/chairs-and-rocking-chairs/series-reference/michael-bock-kitchen-stool-detail.webp' },
        { src: '/images/about-historic/archive-photos/chairs-and-rocking-chairs/series-reference/michael-bock-kitchen-stool.webp' },
        { src: '/images/about-historic/archive-photos/chairs-and-rocking-chairs/series-reference/michael-bock-original-rocking-chair.webp' },
        { src: '/images/about-historic/archive-photos/chairs-and-rocking-chairs/series-reference/michael-bock-two-rocking-chairs.webp' },
        { src: '/images/about-historic/archive-photos/chairs-and-rocking-chairs/series-reference/michael-bock-chair-side.webp' },
        { src: '/images/about-historic/archive-photos/chairs-and-rocking-chairs/series-reference/michael-bock-chair-up-close.webp' },
        { src: '/images/about-historic/archive-photos/chairs-and-rocking-chairs/series-reference/michael-bock-single-chair.webp' },
        { src: '/images/about-historic/archive-photos/chairs-and-rocking-chairs/series-reference/michael-bock-chairs-back-to-back.webp' }
    ];

    new MarqueeKit(deskTarget, {
        images: deskImages,
        height: marqueeHeight,
        imageWidth: 'auto',
        speed: 46,
        gap: 20,
        reverse: false,
        imageScale: 1.015,
        pauseOnHover: false,
        borderRadius: 6
    });

    new MarqueeKit(rockersTarget, {
        images: rockerImages,
        height: marqueeHeight,
        imageWidth: 'auto',
        speed: 42,
        gap: 20,
        reverse: true,
        imageScale: 1.015,
        pauseOnHover: false,
        borderRadius: 6
    });
}

document.addEventListener('DOMContentLoaded', buildAboutSeriesMarquees);
