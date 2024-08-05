function Button(anchor, cb, inner, classes) {
  this.button = document.createElement('button');
  this.button.type = 'button';
  this.button.innerHTML = inner;
  anchor.appendChild(this.button);
  this.button.onclick = cb;
  classes.forEach(element => {
    this.button.classList.add(element);
  });
  return this.button;
}

export { Button };
