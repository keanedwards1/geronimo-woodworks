document.addEventListener('DOMContentLoaded', function() {
    const imgContainers = document.querySelectorAll('.img-container');
    
    imgContainers.forEach(container => {
        const img = container.querySelector('img');
        
        if (img.complete) {
            container.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                container.classList.add('loaded');
            });
        }
    });
});