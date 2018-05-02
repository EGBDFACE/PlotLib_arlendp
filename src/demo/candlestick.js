const d3 = Object.assign({}, require('d3-selection'), require('d3-array'));
import Plot from '../index.js';
const data = [{
    x: "2017-03-01",
    value: [89, 90, 92, 96],
    fill: '#D5E1DD'
  },
  {
    x: "2017-03-02",
    value: [91, 92, 94, 99],
    fill: '#D5E1DD'
  },
  {
    x: "2017-03-03",
    value: [94, 95, 97, 99],
    fill: '#D5E1DD'
  },
  {
    x: "2017-03-06",
    value: [82, 84, 87, 90],
    fill: '#F2583E'
  },
  {
    x: "2017-03-10",
    value: [100, 102, 106, 107],
    fill: '#D5E1DD'
  },
  {
    x: "2017-03-15",
    value: [89, 90, 92, 96]
  },
  {
    x: "2017-03-20",
    value: [91, 92, 94, 99]
  },
  {
    x: "2017-03-23",
    value: [94, 95, 97, 99],
    fill: '#F2583E'
  },
  {
    x: "2017-04-02",
    value: [82, 84, 87, 90],
    fill: '#D5E1DD'
  },
  {
    x: "2017-04-10",
    value: [100, 102, 106, 107],
    fill: '#F2583E'
  },
  {
    x: "2017-04-15",
    value: [89, 90, 92, 96],
    fill: '#D5E1DD'
  },
  {
    x: "2017-04-22",
    value: [91, 92, 94, 99],
    fill: '#F2583E'
  },
  {
    x: "2017-04-25",
    value: [94, 95, 97, 99],
    fill: '#F2583E'
  },
  {
    x: "2017-04-28",
    value: [83, 84, 87, 90],
    fill: '#D5E1DD'
  },
  {
    x: "2017-05-05",
    value: [100, 102, 106, 107],
    fill: '#F2583E'
  }
];

new Plot.chart(d3.select('canvas').node(), {bgColor: 0xffffff}).candleStick(data, {
  contentSize: {
    w: 600,
    h: 600
  },
  range: {
    x: getTimeRange(data),
    y: getMinAndMax(data)
  },
  style: {
    fill: '#d5e1dd',
    strokeWidth: 1,
    stroke: '#000000'
  },
  zoom: true
});

function getMinAndMax(data) {
  const minArr = data.map(function (v) {
    return v.value[0];
  });
  const maxArr = data.map(function (v) {
    return v.value[v.value.length - 1];
  })
  return [d3.min(minArr), d3.max(maxArr)];
}

function getTimeRange(data) {
  const timeArr = data.map(function (v) {
    return new Date(v.x);
  });
  return [d3.min(timeArr), d3.max(timeArr)];
}