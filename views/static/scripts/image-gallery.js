document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider');
    const sliderInner = slider.querySelector('.slider-inner');
    const slides = slider.querySelectorAll('.slide');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    let slideWidth = 0;
    let slideIndex = 0;

    // Check if there are slides before accessing the first slide's offsetWidth
    if (slides.length > 0) {
        slideWidth = slides[0].offsetWidth;
    }

    function slideTo(index) {
        sliderInner.style.transform = `translateX(-${slideWidth * index}px)`;
        slideIndex = index;
    }

    function prevSlide() {
        slideIndex--;
        if (slideIndex < 0) {
            slideIndex = slides.length - 1;
        }
        slideTo(slideIndex);
    }

    function nextSlide() {
        slideIndex++;
        if (slideIndex >= slides.length) {
            slideIndex = 0;
        }
        slideTo(slideIndex);
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
});
