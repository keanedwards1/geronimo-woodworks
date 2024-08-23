document.addEventListener('DOMContentLoaded', function() {
    const galleryItemWrappers = document.querySelectorAll('.gallery-item-wrapper');
    
    galleryItemWrappers.forEach(wrapper => {
        const img = wrapper.querySelector('.gallery-item');
        
        if (img.complete) {
            wrapper.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                wrapper.classList.add('loaded');
            });
        }
    });
});