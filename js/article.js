let currentPage = 1;
const totalPages = 6;

function changePage(direction) {
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    updatePage();
}

function updatePage() {
    const imageElement = document.getElementById('articleImage');
    imageElement.src = `images/about-historic/article/article-page-${currentPage}.webp`;
    imageElement.alt = `Article page ${currentPage}`;
    document.getElementById('pageNumber').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prevBtn').disabled = (currentPage === 1);
    document.getElementById('nextBtn').disabled = (currentPage === totalPages);
}

updatePage();