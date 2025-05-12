
document.addEventListener('DOMContentLoaded', () => {
    const url = `https://raw.githubusercontent.com/JacquiM/Tap4Impact/refs/heads/main/Numbers.txt`;

    fetch(url, { cache: "no-store" }) // Prevents browser caching
        .then(response => response.text())
        .then(data => {
            const lines = data.split("\n");
            document.getElementById('total-raised').innerText = lines[0].trim();
            document.getElementById('donor-count').innerText = lines[1]?.trim();
        })
        .catch(error => console.error("Error fetching file:", error));
});




let currentIndex = 0;
//Functions
function moveSlide(step) {
    const slides = document.querySelector('.carousel-slide');
    const totalSlides = slides.children.length;
    currentIndex = (currentIndex + step + totalSlides) % totalSlides;
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
}
