window.addEventListener('scroll', function() {
    var header = document.querySelector('header');
    if (window.scrollY > 50) { // Adjust this value as needed
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});