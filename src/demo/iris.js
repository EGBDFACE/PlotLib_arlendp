import Plot from '../index.js';
const color = ['red', 'blue', 'green'];
const range = {
  x: [0, 7],
  y: [0, 3]
}
const count = 5000;
const data = [];
for (let i = 0; i < count; i++) {
  data.push(generateData(range, color));
}

function drawing() {
  new Plot.chart(document.getElementsByTagName('canvas')[0], {bgColor: 0xffffff}).iris(data, {
    range: range,
    zoom: true
  })
}
// start drawing
drawing();

// const addCount = 2000;
// document.getElementById('addData').addEventListener('click', function (d) {
//   for (let i = 0; i < addCount; i++) {
//     data.push(generateData(range, color));
//   }
//   drawing();
// }, false)

function generateData(range, color) {
  var randomColor = color[Math.floor(getRandom.apply(null, [0, color.length]))];
  return {
    x: getRandom.apply(null, range.x),
    y: getRandom.apply(null, range.y),
    r: 5,
    fill: randomColor,
    stroke: randomColor,
    strokeWidth: 1,
    fillOpacity: 0.3
  }
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}
