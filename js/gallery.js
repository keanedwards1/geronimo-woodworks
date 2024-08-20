document.addEventListener('DOMContentLoaded', function() {
    const groups = document.querySelectorAll('.gallery-group');
    
    groups.forEach(group => {
        const scroll = group.querySelector('.gallery-scroll');
        const items = scroll.querySelectorAll('.gallery-item-wrapper');
        const prev = group.querySelector('.prev');
        const next = group.querySelector('.next');
        let currentIndex = 0;

        function updateGallery() {
            const itemWidth = items[0].offsetWidth + 80;
            scroll.style.transform = `translateX(${-currentIndex * itemWidth}px)`;
        }

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

        // Initial update
        updateGallery();

        // Update on window resize
        window.addEventListener('resize', updateGallery);
    });
});