import Plot from '../index.js';
new Plot.chart(document.getElementsByTagName('canvas')[0], {
  bgColor: 0xffffff
}).boxplot({
  fileUrl: '/dist/boxplot/boxplot.txt',
  fileType: 'tsv'
}, {
  barWidth: 20,
  contentSize: {
    w: 600,
    h: 600
  },
  style: {
    fill: 'rgb(225, 123, 109)',
    stroke: 'rgb(225, 123, 109)'
  },
  zoom: true
})

// new Plot.chart(document.getElementsByTagName('canvas')[0], {
//   bgColor: 0xffffff
// }).boxplot(boxPlotData, {
//   barWidth: barWidth,
//   range: {
//     x: [-1, +groupKeys[groupKeys.length - 1] + 1],
//     y: [min - 1, max + 1]
//   },
//   ticks: {
//     x: {
//       values: Object.keys(groupCounts),
//       format: '.0f'
//     }
//   },
//   contentSize: {
//     w: width,
//     h: height
//   },
//   zoom: true
// })

// function boxQuartiles(d) {
//   return [
//     d3.quantile(d, .25),
//     d3.quantile(d, .5),
//     d3.quantile(d, .75)
//   ];
// }

// // Perform a numeric sort on an array
// function sortNumber(a, b) {
//   return a - b;
// }