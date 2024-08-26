/* document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.snap-section');
    const navLinks = document.querySelectorAll('.section-nav a');
    const snapContainer = document.querySelector('.snap-container');

    function updateActiveLink() {
        const currentSection = [...sections].find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom > 100;
        });

        if (currentSection) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${currentSection.id}`);
            });
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    snapContainer.addEventListener('scroll', updateActiveLink);
    window.addEventListener('resize', updateActiveLink);

    // Initial call to set correct active link on page load
    updateActiveLink();
}); */