let canvasX = 400;
let canvasY = 400;

  let shapes = [
    {sphere: true, c: [2, 1, -3], r: 1, color: [200, 100, 100]},
    {sphere: true, c: [-1, 0, -5], r: 2, color: [0, 0, 255]},
  ];


class Canvas {
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

let canvas = new Canvas(canvasX, canvasY);


//screen/viewport functions
function screen_to_viewport(x, y) {
  return [x / canvasX * 2 - 1, 1 - y / canvasY * 2];
}

function screen_to_viewportX(x) {
  return x / canvasX * 2 - 1;
}

function screen_to_viewportY(y) {
  return 1 - y / canvasY * 2;
}

function viewport_to_screen(x, y) {
  return [(canvasX + 1) * x / 2, -(canvasY - 1) * y / 2];
}

//vector functions
function scale(v, s) {
  return [s * v[0], s * v[1], s * v[2]];
}

function add(u, v) {
  return [u[0] + v[0], u[1] + v[1], u[2] + v[2]];
}

function sub(u, v) {
  return [u[0] - v[0], u[1] - v[1], u[2] - v[2]];
}

function len(v) {
  return Math.sqrt(v[0]**2 + v[1]**2 + v[2]**2);
}

function norm(v) {
  return scale(v, 1/len(v));
}

function dot(u,v) {
  return u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
}


//misc functions
function multiplyColor(color, factor) {
  return [color[0]*factor, color[1]*factor, color[2]*factor]
}


//2D shape functions
function rectangle(i, j, x, y, w, h) {
  if (x <= i && i < x + w && y <= j && j < y + h) return true;
  return false;
}

function checker(i, j) {
  if ((i % 2) == (j % 2)) return [255, 255, 255];
  return [0, 0, 0];
}

function circle(i, j, x, y, r) {
  let c2 = (-x + i - ((r-1)/2))**2 + (-y + j - ((r-1)/2))**2;

  if (c2 > (r/2)**2) return false;
  return true;
}

//3D shape functions
function ray_intersect_sphere(g, d, s, r) {
  let x = sub(g, s);
  let a = dot(d, d);
  let b = 2 * dot(x, d);
  let c = dot(x,x) - r**2;
  let discr = b**2 - 4 * a * c;
  if (discr < 0) return Infinity;
  let t = (-b - Math.sqrt(discr)) / (2 * a);
  return t;
}


function pixel(x, y) {
  for (let i = 0; i < shapes.length; i++) {
    let shape = shapes[i];
    if (shape.rect) {
      if (rectangle(x, y, shape.x, shape.y, shape.w, shape.h)){
        return shape.color;
      }
    }
    if (shape.circle) {
      if (circle(x, y, shape.x, shape.y, shape.r)){
       return shape.color;
      }
    }
    if (shape.sphere) {
      let g = [0, 0, 0];
      let d = norm([x, y, -1]);

      let t = ray_intersect_sphere(g, d, shape.c, shape.r)

      if(t != Infinity) {
        let poi = add(g, scale(d, t));
        let n = norm(sub(poi, shape.c));
        let light = [10, 10, 10];
        let m = norm(sub(light, poi));
        let b = dot(n, m);
        return multiplyColor(shape.color, b);
      }
    }
  }
  return [0, 0, 0];
}

//loops through all pixels
for (let i = 0; i < canvas.h; i++) {
  for (let j = 0; j < canvas.w; j++) {
    let [r, g, b] = pixel(screen_to_viewportX(i), screen_to_viewportX(j), 40, 90, 360);
    canvas.setPixel(j, i, r, g, b, 255);
  }
}

//updates canvas
canvas.setPixels();