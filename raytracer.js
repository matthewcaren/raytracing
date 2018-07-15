class Canvas {
  // This class creates a canvas for drawing an image, one pixel at a time. Use it like this:
  //   let canvas = new Canvas(400, 300);
  // will create a new canvas that is 400 pixels by 300 pixels.
  //   canvas.setPixel(x, y, r, g, b, a);
  // sets the pixel at (x,y) to the color (r,g,b,a).
  //   canvas.setPixels();
  // updates the canvas to show the new pixels. You could call setPixels() after each setPixel()
  // call, but it will be much slower than updating a bunch of pixels with multiple setPixel()
  // calls and then calling setPixels() once.
  constructor(w, h) {
    [this.w, this.h] = [w, h];
    this.canvas = document.createElement("canvas");
    $(this.canvas).attr({width: this.w, height: this.h});
    $('body').append(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.imageData = this.ctx.getImageData(0, 0, this.w, this.h);
    this.data = this.imageData.data;
  }
  setPixel(x, y, r, g, b, a) {
    let index = 4 * (y * this.w + x);
    [this.data[index + 0], this.data[index + 1], this.data[index + 2], this.data[index + 3]] = [r, g, b, a];
  }
  setPixels() {
    this.ctx.putImageData(this.imageData, 0, 0);
  }
}

let canvas = new Canvas(500, 500);


//shape functions
function rectangle(i, j, x, y, w, h) {
  let rect = {x: x, y: y, w: w, h: h};

  if (rect.x <= i && i < rect.x + rect.w && rect.y <= j && j < rect.y + rect.h) return [255, 0, 0];
  return [0, 0, 255];
}

function checker(i, j) {
  if ((i % 2) == (j % 2)) return [255, 255, 255];
  return [0, 0, 0];
}

function circle(i, j, x, y, r) {
  let c2 = (-x + i - ((r-1)/2))**2 + (-y + j - ((r-1)/2))**2;

  if (c2 > (r/2)**2) return [0, 0, 0];
  return [0, 0, 255];
}

function randomRGB() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  return String([r, g, b]);
}

//loops through all pixels
for (let i = 0; i < canvas.h; i++) {
  for (let j = 0; j < canvas.w; j++) {
    let [r, g, b] = circle(i, j, 40, 90, 360);
    canvas.setPixel(j, i, r, g, b, 255);
  }
}

//updates canvas
canvas.setPixels();