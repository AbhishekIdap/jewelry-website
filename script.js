const track = document.querySelector('.slider-track');
const slides = document.querySelectorAll('.slider-track img');

let index = 0;
let startX = 0;
let currentTranslate = 0;
let isDragging = false;
let autoSlide;

// ====== SET SLIDE WIDTH CORRECTLY ======
function getSlideWidth() {
    return slides[0].clientWidth;
}

function updateSlide() {
    const slideWidth = getSlideWidth();
    currentTranslate = -index * slideWidth;
    track.style.transform = `translateX(${currentTranslate}px)`;
}

// ====== AUTO SLIDE ======
function nextSlide() {
    index = (index + 1) % slides.length;
    updateSlide();
}

function startAuto() {
    autoSlide = setInterval(nextSlide, 4000);
}

function stopAuto() {
    clearInterval(autoSlide);
}
window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});
startAuto();

// ====== DRAG EVENTS ======
track.addEventListener("mousedown", startDrag);
track.addEventListener("touchstart", startDrag);

track.addEventListener("mouseup", endDrag);
track.addEventListener("mouseleave", endDrag);
track.addEventListener("touchend", endDrag);

track.addEventListener("mousemove", drag);
track.addEventListener("touchmove", drag);

function startDrag(e) {
    stopAuto();
    isDragging = true;
    startX = getPositionX(e);
    track.style.transition = "none";
}

function drag(e) {
    if (!isDragging) return;

    const currentPosition = getPositionX(e);
    const diff = currentPosition - startX;
    track.style.transform = `translateX(${currentTranslate + diff}px)`;
}

function endDrag(e) {
    if (!isDragging) return;

    isDragging = false;
    track.style.transition = "transform 0.5s ease";

    const endX = getPositionX(e);
    const diff = endX - startX;

    if (diff < -80) {
        index = (index + 1) % slides.length;
    } else if (diff > 80) {
        index = (index - 1 + slides.length) % slides.length;
    }

    updateSlide();
    startAuto();
}

function getPositionX(e) {
    return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
}

// ====== FIX ON WINDOW RESIZE ======
window.addEventListener("resize", updateSlide);

/* ============================= */
/* INTERACTIVE BEFORE AFTER */
/* ============================= */

const container = document.querySelector(".compare-container");
const beforeWrapper = document.querySelector(".before-wrapper");
const slider = document.querySelector(".slider-handle");

let active = false;

container.addEventListener("mousedown", () => active = true);
window.addEventListener("mouseup", () => active = false);

container.addEventListener("mousemove", (e) => {
    if (!active) return;

    const rect = container.getBoundingClientRect();
    let x = e.clientX - rect.left;

    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    beforeWrapper.style.width = x + "px";
    slider.style.left = x + "px";
});