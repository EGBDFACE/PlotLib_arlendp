import Plot from '../index.js';
import {
  scaleLinear
} from 'd3-scale';
new Plot.circular(document.getElementsByTagName('canvas')[0], {
  bgColor: 0xffffff
}).scatter({
  fileUrl: '/dist/scatter/GRCh37.json',
  fileType: 'json',
  configs: {
    innerRadius: 320 * 0.95,
    outerRadius: 320,
    labels: true,
    ticks: true,
    labelSuffix: 'M',
    opacity: 0
  }
}, [{
  circularType: 'highlight',
  name: 'cytobands',
  fileUrl: '/dist/scatter/cytobands.csv',
  fileType: 'csv',
  configs: {
    innerRadius: 320 * 0.95,
    outerRadius: 320,
    opacity: 1,
    tips: function (d, i) {
      return [{
        title: 'Name',
        value: d.name
      }, {
        title: 'Chrom',
        value: d.chrom
      }, {
        title: 'Gie Stain',
        value: d.gieStain
      }]
    }
  }
}, {
  circularType: 'scatter',
  name: 'snp_250kb',
  fileUrl: '/dist/scatter/snp1.txt',
  fileType: 'json',
  configs: {
    innerRadius: 0.65 / 0.95,
    outerRadius: 0.85 / 0.95,
    color: '#3475b1',
    stroke: '#999999',
    size: 9 * Math.PI,
    fillOpacity: function (d) {
      var i = scaleLinear().domain([0, 0.01]).range([0.5, 1]).clamp(true)(d.value)
      return i;
    },
    min: 0,
    max: 0.01,
    axes: [{
      position: 0.000001,
      thickness: 1,
      color: '#3475b1',
      opacity: 0.3
    }, {
      position: 0.005,
      thickness: 1,
      color: '#3475b1',
      opacity: 0.5
    }, {
      position: 0.01,
      thickness: 1,
      color: '#3475b1',
      opacity: 0.7
    }],
    backgrounds: [{
      start: 0,
      end: 0.01,
      color: '#3475b1',
      opacity: 0.15
    }],
    tips: function (d, i) {
      return [{
        title: 'Chrom',
        value: d.chrom
      }, {
        title: 'Value',
        value: d.value
      }]
    }
  }
}, {
  circularType: 'scatter',
  name: 'snp_1mb',
  fileUrl: '/dist/scatter/snp3.txt',
  fileType: 'json',
  configs: {
    color: '#f28527',
    stroke: '#999999',
    size: 9 * Math.PI,
    fillOpacity: function (d) {
      var i = scaleLinear().domain([0.001, 0.002]).range([0.5, 1]).clamp(true)(d.value)
      return i;
    },
    min: 0.001,
    max: 0.002,
    innerRadius: 0.4 / 0.95,
    outerRadius: 0.6 / 0.95,
    axes: [{
        position: 0.001,
        thickness: 1,
        color: '#f28527',
        opacity: 0.3
      },
      {
        position: 0.0015,
        thickness: 1,
        color: '#f28527',
        opacity: 0.5
      }, {
        position: 0.002,
        thickness: 1,
        color: '#f28527',
        opacity: 0.7
      }
    ],
    backgrounds: [{
      start: 0.001,
      end: 0.002,
      color: '#f28527',
      opacity: 0.15
    }],
    tips: function (d, i) {
      return [{
        title: 'Chrom',
        value: d.chrom
      }, {
        title: 'Value',
        value: d.value
      }]
    }
  }
}, {
  circularType: 'scatter',
  name: 'snp',
  fileUrl: '/dist/scatter/snp2.txt',
  fileType: 'json',
  configs: {
    color: '#4f9139',
    stroke: '#999999',
    size: 9 * Math.PI,
    min: 0.007,
    max: 0.01,
    fillOpacity: function (d) {
      var i = scaleLinear().domain([0.007, 0.01]).range([0.5, 1]).clamp(true)(d.value)
      return i;
    },
    innerRadius: 0.15 / 0.95,
    outerRadius: 0.35 / 0.95,
    axes: [{
        position: 0.007,
        thickness: 1,
        color: '#4f9139',
        opacity: 0.3
      },
      {
        position: 0.0085,
        thickness: 1,
        color: '#4f9139',
        opacity: 0.5
      }, {
        position: 0.01,
        thickness: 1,
        color: '#4f9139',
        opacity: 0.7
      }
    ],
    backgrounds: [{
      start: 0.007,
      end: 0.01,
      color: '#4f9139',
      opacity: 0.15
    }],
    tips: function (d, i) {
      return [{
        title: 'Chrom',
        value: d.chrom
      }, {
        title: 'Value',
        value: d.value
      }]
    }
  }
}]);