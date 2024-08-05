const slides = document.getElementById('slides');
const indicators = document.getElementById('indicators').children;
const slideCount = slides.children.length;
let currentIndex = 0;
let intervalId;
let isPaused = false;

document.getElementById('next').addEventListener('click', () => {
    goToSlide(currentIndex + 1);
});

document.getElementById('prev').addEventListener('click', () => {
    goToSlide(currentIndex - 1);
});

document.getElementById('toggle').addEventListener('click', () => {
    if (isPaused) {
        startAutoSlide();
        isPaused = false;
        document.getElementById('toggle').innerText = 'Pause';
    } else {
        stopAutoSlide();
        isPaused = true;
        document.getElementById('toggle').innerText = 'Play';
    }
});

Array.from(indicators).forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        goToSlide(index);
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        goToSlide(currentIndex + 1);
    } else if (e.key === 'ArrowLeft') {
        goToSlide(currentIndex - 1);
    }
});

let touchStartX = 0;
let touchEndX = 0;
let isDragging = false;

slides.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    console.log(touchStartX);
  
});

slides.addEventListener('touchmove', (e) => {
  touchEndX = e.changedTouches[0].screenX;
});

slides.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
});

slides.addEventListener('mousedown', (e) => {
    touchStartX = e.clientX;
    isDragging = true;
});

slides.addEventListener('mousemove', (e) => {
  if (isDragging) {
      touchEndX = e.clientX;
  }
});

slides.addEventListener('mouseup', () => {
  if (isDragging) {
      handleGesture();
      isDragging = false;
  }
});

slides.addEventListener('mouseleave', () => {
  if (isDragging) {
      handleGesture();
      isDragging = false;
  }
});

function handleGesture() {
    if (touchEndX < touchStartX) goToSlide(currentIndex + 1);
    if (touchEndX > touchStartX) goToSlide(currentIndex - 1);
}

function goToSlide(index) {
    if (index < 0) index = slideCount - 1;
    if (index >= slideCount) index = 0;
    slides.style.transform = `translateX(${-index * 100}%)`;
    currentIndex = index;
    updateIndicators();
}

function updateIndicators() {
    Array.from(indicators).forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
    });
}

function startAutoSlide() {
    intervalId = setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 3000);
}

function stopAutoSlide() {
    clearInterval(intervalId);
}

startAutoSlide();