const d3 = Object.assign({}, require('d3-random'), require('d3-scale'), require('d3-array'));
import Plot from '../index.js';
var width = 600;
var height = 400;
var barWidth = 15;

var margin = {
  top: 20,
  right: 10,
  bottom: 20,
  left: 10
};

var width = width - margin.left - margin.right,
  height = height - margin.top - margin.bottom;

var totalWidth = width + margin.left + margin.right;
var totalheight = height + margin.top + margin.bottom;
var count = 7;
barWidth = width / (count + 2) * 2 / 3;
// Generate five 100 count, normal distributions with random means
var groupCounts = {};
var globalCounts = [];
var meanGenerator = d3.randomUniform(10);
for (var i = 0; i < count; i++) {
  var randomMean = meanGenerator();
  var generator = d3.randomNormal(randomMean);
  var key = i.toString();
  groupCounts[key] = [];

  for (var j = 0; j < 100; j++) {
    var entry = generator();
    groupCounts[key].push(entry);
    globalCounts.push(entry);
  }
}

// Sort group counts so quantile methods work
for (var key in groupCounts) {
  var groupCount = groupCounts[key];
  groupCounts[key] = groupCount.sort(sortNumber);
}

// Setup a color scale for filling each box
var colorScale = d3.scaleOrdinal(d3.schemeCategory20)
  .domain(Object.keys(groupCounts));

// Prepare the data for the box plots
var boxPlotData = [];
for (var [key, groupCount] of Object.entries(groupCounts)) {

  var record = {};
  var localMin = d3.min(groupCount);
  var localMax = d3.max(groupCount);

  record["key"] = key;
  record["counts"] = groupCount;
  record["quartile"] = boxQuartiles(groupCount);
  record["whiskers"] = [localMin, localMax];
  record["color"] = colorScale(key);

  boxPlotData.push(record);
}
console.log(groupCounts, globalCounts, boxPlotData);
// Compute an ordinal xScale for the keys in boxPlotData
// var xScale = d3.scalePoint()
// .domain(Object.keys(groupCounts))
// .rangeRound([0, width])
// .padding([0.5]);
var groupKeys = Object.keys(groupCounts);
var xScale = d3.scaleLinear()
  .domain([-1, +groupKeys[groupKeys.length - 1] + 1])
  .range([0, width]);

// Compute a global y scale based on the global counts
var min = d3.min(globalCounts);
var max = d3.max(globalCounts);
var yScale = d3.scaleLinear()
  .domain([min - 1, max + 1])
  .range([height, 0]);

new Plot.bokeh(document.getElementsByTagName('canvas')[0]).boxplot(boxPlotData, {
  barWidth: barWidth,
  range: {
    x: [-1, +groupKeys[groupKeys.length - 1] + 1],
    y: [min - 1, max + 1]
  },
  ticks: {
    x: {
      values: Object.keys(groupCounts),
      format: '.0f'
    }
  },
  contentSize: {
    w: width,
    h: height
  },
  zoom: true
})
function boxQuartiles(d) {
  return [
    d3.quantile(d, .25),
    d3.quantile(d, .5),
    d3.quantile(d, .75)
  ];
}

// Perform a numeric sort on an array
function sortNumber(a, b) {
  return a - b;
}