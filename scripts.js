// Functionality for the upload form
document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('upload');
    const uploadModal = document.getElementById('uploadModal');
    const closeModal = document.querySelector('.modal .close');

    // Open the modal
    uploadButton.addEventListener('click', () => {
        uploadModal.style.display = 'block';
    });

    // Close the modal
    closeModal.addEventListener('click', () => {
        uploadModal.style.display = 'none';
    });

    // Close the modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === uploadModal) {
            uploadModal.style.display = 'none';
        }
    });
});

// Functionality for the moving images
document.addEventListener("DOMContentLoaded", function() {
    const images = document.querySelectorAll(".moving-image");

    images.forEach(image => {
        resetPosition(image);

        image.addEventListener("animationiteration", function() {
            resetPosition(image);
        });
    });

    function resetPosition(image) {
        const randomX = Math.floor(Math.random() * window.innerWidth) - 150;
        const randomY = Math.floor(Math.random() * window.innerHeight) - 150;
        const duration = Math.floor(Math.random() * 20) + 10;

        image.style.left = `${randomX}px`;
        image.style.top = `${randomY}px`;
        image.style.animationDuration = `${duration}s`; // Changed to random duration
    }
});

// Functionality for the image slider
let slideIndex = 0;
showSlides();

function showSlides() {
    let i;
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    slideIndex++;
    
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    
    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].classList.add("active");
    
    setTimeout(showSlides, 3000); // Change image every 3 seconds
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}
