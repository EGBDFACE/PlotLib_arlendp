import Plot from '../index.js';
import * as d3 from 'd3';
var canvas = document.getElementsByTagName('canvas')[0];
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
d3.tsv('/dist/occurrence/Fig_Partial_SCC_PanCancer_PurityAdjusted_ImmGenes_data.txt', function (data) {
  console.log(data);
  var orderedArr = ['CD96', 'KLRK1', 'CD48', 'CD28', 'BTLA', 'CD40LG', 'PRF1_O', 'GZMA_O', 'CD244', 'CD27', 'LTA', 'PDCD1', 'TIGIT', 'ICOS', 'CTLA4', 'LAG3', 'TNFRSF9', 'IL2RA', 'CD80', 'PDCD1LG2', 'IL10', 'CD274', 'CD86', 'TNFSF13B', 'HAVCR2', 'CSF1R', 'CXCR4', 'ADORA2A', 'CD160', 'ENTPD1', 'TGFB1', 'IL6R', 'C10orf54', 'CD40', 'CD70', 'KIR2DL3', 'KIR2DL1', 'TNFRSF4', 'IDO1', 'TNFSF14', 'TNFRSF8', 'TMIGD2', 'TNFRSF13B', 'TNFRSF17', 'MICB', 'TNFRSF13C', 'TMEM173', 'IL10RB', 'LGALS9', 'TNFRSF14', 'TNFSF9', 'HHLA2', 'TNFSF18', 'TGFBR1', 'TNFSF4', 'CXCL12', 'KDR', 'ICOSLG', 'BTNL2', 'TNFSF13', 'IL6', 'TNFSF15', 'MICA', 'NT5E', 'RAET1E', 'TNFRSF18', 'TNFRSF25', 'PVR', 'ULBP1', 'CD276', 'VTCN1', 'PVRL2'];
  data.columns = orderedArr;
  data.sort(function (a, b) {
    return data.columns.indexOf(a.Name) - data.columns.indexOf(b.Name);
  });
  const yAxisLabel = data.columns;
  const xAxisLabel = [].slice.call(yAxisLabel).reverse();

  const unitSize = {
    w: 8,
    h: 8
  }
  // scale color
  const scaleColor = d3.scaleLinear()
    .domain([-0.5, 0, 0.5])
    .range(['#1B71E7', 'white', '#E04026'])
    .clamp(true);

  const gap = 1;
  const contentSize = {
    w: xAxisLabel.length * unitSize.w + (xAxisLabel.length - 1) * gap,
    h: yAxisLabel.length * unitSize.h + (yAxisLabel.length - 1) * gap
  }
  const margin = {
    h: 100,
    v: 100
  }
  // text color
  const textColor = {
    P: '#E04026',
    N: '#1B71E7'
  }
  const blocks = [];
  for (var x = 0; x < yAxisLabel.length; x++) {
    for (var y = 0; y < xAxisLabel.length; y++) {
      const v = data[x][xAxisLabel[y]];
      const block = {
        x: x,
        y: y,
        value: v,
        color: v === 'NA' ? '#ffffff' : scaleColor(+v)
      }
      block.label = [{
        title: 'X',
        value: xAxisLabel[y]
      }, {
        title: 'Y',
        value: yAxisLabel[x]
      }, {
        title: 'Value',
        value: block.value
      }]
      blocks.push(block)
    }
  }
  new Plot.chart(canvas, {
    bgColor: 0xF2F2F2
  }).occurrence(blocks, {
    contentSize,
    // canvasMargin: margin,
    range: {
      x: xAxisLabel,
      y: yAxisLabel
    },
    unitSize,
    gap: gap,
    zoom: true
  })
})
