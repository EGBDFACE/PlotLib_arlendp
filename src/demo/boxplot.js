import Plot from '../index.js';
var canvas = document.getElementsByTagName('canvas')[0];
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
// customize the color
const color = {
  'KIRC': '#DC4035',
  'CESC': '#DC4035',
  'SKCM': '#E0619D',
  'SKCM': '#E0619D',
  'PRAD': '#222222',
  'GBM': '#222222',
  'LGG': '#222222'
}
new Plot.chart(canvas, {
  bgColor: 0xf2f2f2
}).boxplot({
  fileUrl: '/dist/boxplot/boxplot.txt',
  fileType: 'tsv'
}, {
  barWidth: 24,
  contentSize: {
    w: 800,
    h: 540
  },
  style: {
    fill: function (key) {
      return color[key] || 'rgb(50, 71, 166)'
    },
    stroke: function (key) {
      return color[key] || 'rgb(50, 71, 166)'
    },
    opacity: 0.6
  },
  zoom: true,
  legends: {
    x: 'cancer',
    xOffset: 38,
    y: 'cytolytic activity',
    yOffset: 45,
    fontSize: 14
  },
  outlierTips: function (key, d) {
    return [{
      title: 'Cancer',
      value: key
    }, {
      title: 'CYT',
      value: d.value
    }, {
      title: 'Histo Subtype',
      value: d.HistoSubtype
    }]
  },
  boxTips: function (key, quartile) {
    return [{
        title: 'Cancer',
        value: key
      },
      {
        title: 'Upper quartile',
        value: quartile[2]
      }, {
        title: 'Median',
        value: quartile[1]
      }, {
        title: 'Lower quartile',
        value: quartile[0]
      }
    ]
  }
})