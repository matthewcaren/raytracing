let debug = false;


let canvasX = 400;
let canvasY = 400;

let shapes = [
  {sphere: true, c: [2, 1, -3], r: 1, color: [200, 100, 100]},
  {sphere: true, c: [-1, 0, -5], r: 2, color: [0, 0, 255]},
  {plane: true, n: [0, 1, 0], dist: -1, color: [100, 100, 2]}
];

let lights = [
  {pos: [10, 10, 10]}
];

let camera =[0, 0, 0];


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



$('canvas').click(function (event) {
  console.clear();
  debug = true;
  console.log("@ pixel (" + [event.offsetX, event.offsetY] + ")");
  console.log("@ viewport (" + screen_to_viewport(event.offsetX, event.offsetY) + ")");
  pixel(...screen_to_viewport(event.offsetX, event.offsetY));
  debug = false;

});


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
function intersect_ray_sphere(g, d, s, r) {
  let x = sub(g, s);
  let a = dot(d, d);
  let b = 2 * dot(x, d);
  let c = dot(x,x) - r**2;
  let discr = b**2 - 4 * a * c;
  if (discr < 0) return {t: Infinity};
  let t = (-b - Math.sqrt(discr)) / (2 * a);
  let poi = add(g, scale(d, t));
  let n = norm(sub(poi, shape.c));
  let intersection = {t: t, poi: poi, n: n};
  return intersection;
}

function intersect_ray_plane(g, d, n, dist) {
	let t = (dist - dot(n, g))/dot(n, d);
	if (t < 0) return {t: Infinity};
  let poi = scale(d, t);
  let intersection = {t: t, poi: poi, n: n};
  return intersection;
}

function intersect(g, d) {
  // The intersect(g,d) function goes through each shape in the scene and figures
  // out which one is seen by the ray.
  // Make sure that intersect_ray_*() return a "hit" object that contains t, poi, and n.
  let nearest = {t: Infinity};
  for (let i = 0; i < shapes.length; i++) {
    shape = shapes[i];
    let hit;

    if (shape.sphere) {
      hit = intersect_ray_sphere(g, d, shape.c, shape.r);
    }
    if (shape.plane) {
      hit = intersect_ray_plane(g, d, shape.n, shape.dist);
    }

    if (hit.t < nearest.t) {
      nearest = hit;
      nearest.shape = shape;
    }
  }
  if (debug) console.log(nearest);
  return nearest;
}
function ray_color(g, d) {
  // The ray_color(g,d) function figures out which object the ray g+td hits
  // by calling intersect(g,d).
  // It then goes through each light, computes the shading, and adds it into
  // the accumulated ray color.
  hit = intersect(g, d);

  if(hit.t == Infinity) return [0, 0, 255];

  color = [0, 0, 0];

  if (hit.t < Infinity) {
    for (let i = 0; i < lights.length; i++) {
      let light = lights[i];

      shading = shade(hit, light);
      color = add(color, shading);
    }
  }

  return color;
}

function shade(hit, light) {
  let m = norm(sub(light.pos, hit.poi));
  let b = dot(hit.n, m);
  return scale(hit.shape.color, b);
}

function pixel(x, y) {
  // The only thing pixel(x,y) does is convert from an x,y coordinate to a ray g+td
  // then call ray_color. The reason for this change is that, then, we have
  // ray_color(g,d) which can be called when we have rays that don't start at the viewer.
  let g = camera;
  let d = norm(sub([...screen_to_viewport(x, y), -1], g));

  if (debug == true) console.log("with ray g= (" + g + "), d=(" + d + ")");

  return ray_color(g, d);
}


//loops through all pixels
for (let i = 0; i < canvas.h; i++) {
  for (let j = 0; j < canvas.w; j++) {
    let [r, g, b] = pixel(i, j);
    canvas.setPixel(i, j, r, g, b, 255);
  }
}

//updates canvas
canvas.setPixels();