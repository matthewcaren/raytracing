let n = 300;
let m = 300;
let x = '';

for (let i = 0; i < n; i++) {
  x += '<tr>';
  for (let j = 0; j < m; j++) {
    x+= '<td style="background: rgb(' + checker(i, j, 10) + ');"></td>';
  }
  x += '</tr>';
}

console.log(x);

function rectangle(i, j, x, y, w, h) {
  let rect = {x: rectx, y: recty, w: rectw, h: recth};

  if (rect.x <= i && i < rect.x + rect.w && rect.y <= j && j < rect.y + rect.h) return [255, 0, 0];
  return [0, 0, 255];
}

function randomRGB() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  return String([r, g, b]);
}

jQuery('table').html(x);