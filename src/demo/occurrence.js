import Plot from '../index.js';
import * as d3 from 'd3';
var canvas = document.getElementsByTagName('canvas')[0];
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
d3.tsv('/dist/occurrence/Fig_Partial_SCC_PanCancer_PurityAdjusted_ImmGenes_data.txt', function (data) {
  console.log(data);
  var orderedArr = ['CD96_P', 'KLRK1_N', 'CD48_N', 'CD28_N', 'BTLA_P', 'CD40LG_N', 'PRF1_O', 'GZMA_O', 'CD244_P', 'CD27_N', 'LTA_N', 'PDCD1_P', 'TIGIT_P', 'ICOS_N', 'CTLA4_P', 'LAG3_P', 'TNFRSF9_N', 'IL2RA_N', 'CD80_N', 'PDCD1LG2_N', 'IL10_P', 'CD274_N', 'CD86_N', 'TNFSF13B_N', 'HAVCR2_P', 'CSF1R_P', 'CXCR4_N', 'ADORA2A_P', 'CD160_P', 'ENTPD1_N', 'TGFB1_P', 'IL6R_N', 'C10orf54_P', 'CD40_N', 'CD70_N', 'KIR2DL3_P', 'KIR2DL1_P', 'TNFRSF4_N', 'IDO1_P', 'TNFSF14_N', 'TNFRSF8_N', 'TMIGD2_N', 'TNFRSF13B_N', 'TNFRSF17_N', 'MICB_N', 'TNFRSF13C_N', 'TMEM173_N', 'IL10RB_P', 'LGALS9_P', 'TNFRSF14_N', 'TNFSF9_N', 'HHLA2_N', 'TNFSF18_N', 'TGFBR1_P', 'TNFSF4_N', 'CXCL12_N', 'KDR_P', 'ICOSLG_N', 'BTNL2_N', 'TNFSF13_N', 'IL6_N', 'TNFSF15_N', 'MICA_N', 'NT5E_N', 'RAET1E_N', 'TNFRSF18_N', 'TNFRSF25_N', 'PVR_N', 'ULBP1_N', 'CD276_N', 'VTCN1_P', 'PVRL2_P'];
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
    h: 120,
    v: 120
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
  console.log(contentSize)
  new Plot.chart(document.getElementsByTagName('canvas')[0], {
    bgColor: 0xffffff
  }).occurrence(blocks, {
    contentSize,
    canvasMargin: margin,
    range: {
      x: xAxisLabel,
      y: yAxisLabel
    },
    unitSize,
    gap: gap,
    zoom: true
  })
})
