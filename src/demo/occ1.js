import Plot from '../index.js';
const xAxisLabel = [];
const yAxisLabel = [];
const range = [0, 15];
const color = ["#f0ecf5", "#805aa9", "#ffd2a6", "#ff7f00", "#fff5f5", "#fb9a99", "#b8deb5", "#33a02c", "#79aed2",
  "#408cbf"
];
let count = 50;

plot(count);

function plot(n) {
  for (var i = 0; i < count; i++) {
    xAxisLabel.push('a' + i);
    yAxisLabel.push('b' + i);
  }
  const blocks = [];
  for (let x = 0; x < yAxisLabel.length; x++) {
    for (let y = 0; y < xAxisLabel.length; y++) {
      const block = {
        x: x,
        y: y,
        label: yAxisLabel[x] + ', ' + xAxisLabel[y],
        // 对称分布
        count: blocks[y * yAxisLabel.length + x] ? blocks[y * yAxisLabel.length + x].count : Math.floor(Math.random() * (range[1] - range[0])) + range[0]
      };
      block.color = getColor(block);
      block.label = [{
        title: 'Name',
        value: block.label
      }, {
        title: 'Count',
        value: block.count
      }]
      blocks.push(block);
    }
  }
  const unitSize = {
    w: 12,
    h: 12
  };
  const gap = 1;
  new Plot.chart(document.getElementsByTagName('canvas')[0], {bgColor: 0xffffff}).occurrence(blocks, {
    contentSize: {
      w: xAxisLabel.length * unitSize.w + (xAxisLabel.length - 1) * gap,
      h: yAxisLabel.length * unitSize.h + (yAxisLabel.length - 1) * gap
    },
    range: {
      x: xAxisLabel,
      y: yAxisLabel
    },
    gap: gap,
    zoom: true
  })
}

function getColor(d) {
  if (d.count === 0) {
    return '#fbfbfb';
  } else if (d.x < 10 && d.y < 10) {
    if (d.count < (range[0] + range[1]) / 2) return color[0];
    return color[1];
  } else if (d.x >= 10 && d.x < 20 && d.y >= 10 && d.y < 20) {
    if (d.count < (range[0] + range[1]) / 2) return color[2];
    return color[3];
  } else if (d.x >= 20 && d.x < 30 && d.y >= 20 && d.y < 30) {
    if (d.count < (range[0] + range[1]) / 2) return color[4];
    return color[5];
  } else if (d.x >= 30 && d.x < 40 && d.y >= 30 && d.y < 40) {
    if (d.count < (range[0] + range[1]) / 2) return color[6];
    return color[7];
  } else if (d.x >= 40 && d.x < 50 && d.y >= 40 && d.y < 50) {
    if (d.count < (range[0] + range[1]) / 2) return color[8];
    return color[9];
  } else {
    return Math.random() < 0.05 ? '#e5e5e5' : '#fbfbfb';
  }
}