document.addEventListener('DOMContentLoaded', function() {
    const groups = document.querySelectorAll('.gallery-group');
    
    groups.forEach(group => {
        const scroll = group.querySelector('.gallery-scroll');
        const items = scroll.querySelectorAll('.gallery-item-wrapper');
        const prev = group.querySelector('.prev');
        const next = group.querySelector('.next');
        let currentIndex = 0;

        if (items.length > 1) {
            function updateGallery() {
                const itemWidth = items[0].offsetWidth;
                const itemMargin = parseInt(window.getComputedStyle(items[0]).marginRight);
                const fullItemWidth = itemWidth + itemMargin * 2; // Account for left and right margins
                scroll.style.transform = `translateX(${-currentIndex * fullItemWidth}px)`;
                
                prev.classList.toggle('disabled', currentIndex === 0);
                next.classList.toggle('disabled', currentIndex === items.length - 1);
            }

            if (prev && next) {
                prev.addEventListener('click', e => {
                    e.preventDefault();
                    if (currentIndex > 0) {
                        currentIndex--;
                        updateGallery();
                    }
                });

                next.addEventListener('click', e => {
                    e.preventDefault();
                    if (currentIndex < items.length - 1) {
                        currentIndex++;
                        updateGallery();
                    }
                });
            }

            updateGallery();
            window.addEventListener('resize', updateGallery);
        } else {
            scroll.classList.add('single-item');
            if (prev) prev.style.display = 'none';
            if (next) next.style.display = 'none';
        }
    });
});