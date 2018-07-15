let n = 300;
let m = 300;
let x = '';

for (let i = 0; i < n; i++) {
  x += '<tr>';
  for (let j = 0; j < m; j++) {
    x+= '<td style="background: rgb(' + circle(i, j, 20, 120, 150, 150) + ');"></td>';
  }
  x += '</tr>';
}

console.log(x);

function rectangle(i, j, x, y, w, h) {
  let rect = {x: x, y: y, w: w, h: h};

  if (rect.x <= i && i < rect.x + rect.w && rect.y <= j && j < rect.y + rect.h) return [255, 0, 0];
  return [0, 0, 255];
}

function checker(i, j, s) {
  if ((i % 2) == (j % 2)) return [255, 255, 255];
  return [0, 0, 0];
}

function circle(i, j, x, y, w, h) {
  let c2 = (-x + i - ((w-1)/2))**2 + (-y + j - ((h-1)/2))**2;

  if (c2 > (w/2)**2) return [255, 0, 0];
  return [0, 0, 255];
}

function randomRGB() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  return String([r, g, b]);
}

jQuery('table').html(x);