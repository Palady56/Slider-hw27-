import config from './config.js';
import imageList from './images.js';
import { Button } from './button.js';

const container = document.getElementById('container');

function Slider(container, listOfImages) {
  this.arrImages = [];
  this.currentImage = 0;
  this.mainContainer = container;
  this.listOfImages = listOfImages;
  this.pauseKey = null;
  this.pause = false;
  this.buttons = {
    next: null,
    prev: null
  };
}

const sliderPrototype = {
  loadImages: function () {
    this.listOfImages.forEach((element, i) => {
      this.arrImages[i] = document.createElement('img');
      this.arrImages[i].draggable = false;
      this.arrImages[i].src = element;
      this.imageBox.appendChild(this.arrImages[i]);
      this.arrImages[i].style.left = `${i * 100}%`;
      this.arrImages[i].style.transform = `translateX(-${this.currentImage * 100}%)`;
    });
  },

  autoSlide: function () {
    if (config.autoSlide) setInterval(() => {
      if (!this.pause) this.slideImage('next')
      }, config.autoSlideInterval);
  },

  create: function () {
    this.sliderItem = document.createElement('div');
    this.sliderItem.classList.add('slider');
    container.appendChild(this.sliderItem);

    this.buttons.prev = new Button(this.sliderItem, () => this.slideImage('prev'), "&#10094", ['btn', 'prev']);
    this.imageContainer = document.createElement('div');
    this.imageContainer.id = 'image-container';
    this.sliderItem.appendChild(this.imageContainer);

    this.imageBox = document.createElement('div');
    this.imageBox.classList.add('image-list');
    this.imageBox.id = 'imageBox';
    this.imageContainer.appendChild(this.imageBox);
    this.buttons.next = new Button(this.sliderItem, () => this.slideImage('next'), "&#10095", ['btn', 'next']);

    this.loadImages();
    this.autoSlide();
  },

  createPauseKey: function () {
    if (!config.pauseKey) return;
    const pauseDiv = document.createElement('div');
    container.appendChild(pauseDiv);
    pauseDiv.classList.add('pause-button');

    this.pauseKey = new Button(pauseDiv, () => this.pauseSlide(), "Pause", ['btn']);
    this.pauseKey.id = 'pauseButton';
  },

  pauseSlide: function () {
    this.pause = !this.pause;
    this.updatePauseText();
  },

  updatePauseText: function () {
    if (!this.pause) this.pauseKey.textContent = 'Pause';
    else this.pauseKey.textContent = 'Play';
  },

  slideImage: function (type) {
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
    this.arrImages.forEach(
      (e) => {
        e.style.transform = `translateX(-${this.currentImage * 100}%)`;
      }
    );
    if (indicator) indicator.updateIndicator();
  }
};

Slider.prototype = sliderPrototype;

function Indicator(container, listOfImages) {
  this.mainContainer = container;
  this.listOfImages = listOfImages;
  this.create = () => {
    if (config.showIndicator) {
      if (this.listOfImages.length <= 0) return;
      const slideIndicator = document.createElement('div');
      slideIndicator.id = 'slideIndicator';
      container.appendChild(slideIndicator);
      this.listOfImages.forEach((element, i) => {
        const el = document.createElement('div');
        el.id = `indicator_${i}`;
        el.classList.add('indicator-style');
        slideIndicator.appendChild(el);
        el.addEventListener('click', () => slideToImage(i));
      });
    }
    this.updateIndicator();
  };
}

const indicatorPrototype = {
  updateIndicator: function () {
    this.listOfImages.forEach((element, i) => {
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
};

Indicator.prototype = indicatorPrototype;

const slider = new Slider(container, imageList);
const indicator = new Indicator(container, imageList);

slider.create();
indicator.create();
slider.createPauseKey();

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

// automatic pause
function mouseOver(e, type = 'mouse') {
  slider.pause = true;
  slider.updatePauseText();
}

function mouseOut(e, type = 'mouse') {
  if (!slider.pauseKey || slider.pauseKey.textContent === 'Pause') {
    slider.pause = false;
    slider.updatePauseText();
    clientX = [];
  }
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

function slideToImage(index) {
  slider.currentImage = index;
  slider.arrImages.forEach((e) => {
    e.style.transform = `translateX(-${slider.currentImage * 100}%)`;
  });
  indicator.updateIndicator();
}
