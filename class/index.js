import config from './config.js';
import imageList from './images.js';
import { Button } from './button.js';

const container = document.getElementById('container');

class Slider {
  constructor(container, imagesSrcList) {
    this.arrImages = [];
    this.currentImage = 0;
    this.mainContainer = container;
    this.imagesSrcList = imagesSrcList;
    this.pauseKey = null;
    this.pause = false;
    this.buttons = {
      next: null,
      prev: null
    };
    this.create();
    this.createPauseKey();
    this.autoSlide();
  }

  autoSlide() {
    if (config.autoSlide) setInterval(() => {
      if (!this.pause) this.slideImage('next');
    }, config.autoSlideInterval);
  }

  create() {
    this.sliderElement = document.createElement('div');
    this.sliderElement.classList.add('slider');
    this.mainContainer.appendChild(this.sliderElement);

    this.buttons.prev = new Button(this.sliderElement, () => this.slideImage('prev'), "&#10094", ['btn', 'prev']);

    this.imageContainer = document.createElement('div');
    this.imageContainer.id = 'image-container';
    this.sliderElement.appendChild(this.imageContainer);

    this.imageBox = document.createElement('div');
    this.imageBox.classList.add('image-list');
    this.imageBox.id = 'imageBox';
    this.imageContainer.appendChild(this.imageBox);

    this.buttons.next = new Button(this.sliderElement, () => this.slideImage('next'), "&#10095", ['btn', 'next']);

    this.loadImages();
  }

  loadImages() {
    this.imagesSrcList.forEach((element, i) => {
      this.arrImages[i] = document.createElement('img');
      this.arrImages[i].src = element;
      this.arrImages[i].draggable = false;
      this.imageBox.appendChild(this.arrImages[i]);
      this.arrImages[i].style.transform = `translateX(-${this.currentImage * 100}%)`;
      this.arrImages[i].style.left = `${i * 100}%`;
    });
  }

  createPauseKey() {
    if (!config.pauseKey) return;
    const pauseDiv = document.createElement('div');
    this.mainContainer.appendChild(pauseDiv);
    pauseDiv.classList.add('pause-button');

    this.pauseKey = new Button(pauseDiv, () => this.pauseSlide(), "Pause", ['btn', 'btn-outline-secondary']);
    this.pauseKey.id = 'pauseButton';
  }

  pauseSlide() {
    this.pause = !this.pause;
    this.updatePauseText();
  }

  updatePauseText() {
    if (this.pause) this.pauseKey.textContent = 'Play';
    else this.pauseKey.textContent = 'Pause';
  }

  slideImage(type) {
    switch (type) {
      case 'prev': {
        if (this.currentImage > 0) this.currentImage--;
        else this.currentImage = this.arrImages.length - 1;
        break;
      }
      case 'next': {
        if (this.currentImage < (this.arrImages.length - 1)) this.currentImage++;
        else this.currentImage = 0;
        break;
      }
      default: {
        console.log('error');
        break;
      }
    }
    this.arrImages.forEach(e => {
      e.style.transform = `translateX(-${this.currentImage * 100}%)`;
    });
    if (indicator) indicator.updateIndicator();
  }
}

class Indicator {
  constructor(container, imagesSrcList) {
    this.mainContainer = container;
    this.imagesSrcList = imagesSrcList;
    this.create();
  }

  create() {
    if (config.showIndicator) {
      if (this.imagesSrcList.length <= 0) return;
      const slideIndicator = document.createElement('div');
      slideIndicator.id = 'slideIndicator';
      this.mainContainer.appendChild(slideIndicator);
      this.imagesSrcList.forEach((element, i) => {
        const el = document.createElement('div');
        el.id = `indicator_${i}`;
        el.classList.add('indicator-style');
        slideIndicator.appendChild(el);
        el.addEventListener('click', () => this.slideToImage(i));
      });
    }
    this.updateIndicator();
  }

  updateIndicator() {
    this.imagesSrcList.forEach((element, i) => {
      const indicator = document.getElementById(`indicator_${i}`);
      if (slider.currentImage === i) {
        indicator.style.background = 'white';
        indicator.style.scale = '1.2';
      }
      else {
        indicator.style.background = 'grey';
        indicator.style.scale = '1';
      }
    });
  }

  slideToImage(index) {
    slider.currentImage = index;
    slider.arrImages.forEach(e => {
      e.style.transform = `translateX(-${slider.currentImage * 100}%)`;
    });
    this.updateIndicator();
  }
}

const slider = new Slider(container, imageList);
const indicator = new Indicator(container, imageList);

createListeners();

function createListeners() {
  window.addEventListener('keydown', (e) => {
    if (e.keyCode === 39) slider.slideImage('next');
    else if (e.keyCode === 37) slider.slideImage('prev');
    else if (e.keyCode === 80) slider.pauseSlide();
  });
  window.addEventListener('touchstart', (e) => dragStart(e, 'touch'));
  window.addEventListener('touchend', (e) => dragEnd(e, 'touch'));
  window.addEventListener('mousedown', (e) => dragStart(e));
  window.addEventListener('mouseup', (e) => dragEnd(e));
  slider.imageBox.addEventListener('mouseover', (e) => mouseOver(e));
  slider.imageBox.addEventListener('mouseout', (e) => mouseOut(e));
}

function mouseOver(e, type = 'mouse') {
  slider.pause = true;
  slider.updatePauseText();
}

function mouseOut(e, type = 'mouse') {
  if (!slider.pauseKey || slider.pauseKey.textContent === 'Pause') {
    slider.pause = false;
    slider.updatePauseText();
  }
  clientX = [];
}

let clientX = [];
function dragStart(e, type = 'mouse') {
  if (e.type === 'touchstart') {
    clientX[0] = e.touches[0].clientX;
  }
  else clientX[0] = e.clientX;
}
function dragEnd(e, type = 'mouse') {
  if (e.type === 'touchend') {
    clientX[1] = e.changedTouches[0].clientX;
  }
  else clientX[1] = e.clientX;
  if (clientX[1] > clientX[0] + 100) slider.slideImage('prev');
  if (clientX[1] < clientX[0] - 100) slider.slideImage('next');
  clientX = [];
}
