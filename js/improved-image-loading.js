// Function to handle image load
function handleImageLoad(wrapper) {
    wrapper.classList.add('loaded');
}

// Use Intersection Observer to only load images when they're close to the viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const wrapper = entry.target;
            const img = wrapper.querySelector('.gallery-item');
            
            if (img.complete) {
                handleImageLoad(wrapper);
            } else {
                img.addEventListener('load', () => handleImageLoad(wrapper));
            }
            
            // Stop observing after loading
            observer.unobserve(wrapper);
        }
    });
}, {
    root: null,
    rootMargin: '200px', // Start loading images when they're 200px from viewport
    threshold: 0.1
});

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const galleryItemWrappers = document.querySelectorAll('.gallery-item-wrapper');
    
    galleryItemWrappers.forEach(wrapper => {
        observer.observe(wrapper);
    });
});