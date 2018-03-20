import BaseRenderer from './BaseRenderer';
import Circos from '../Core/Circos/src/circos';
const d3 = Object.assign({}, require('d3-queue'), require('d3-request'));
export default class CircosRenderer extends BaseRenderer {
  constructor(elem, options) {
    super(elem, options);
  }
  chords(data, configs) {
    const gieStainColor = {
      gpos100: 'rgb(0,0,0)',
      gpos: 'rgb(0,0,0)',
      gpos75: 'rgb(130,130,130)',
      gpos66: 'rgb(160,160,160)',
      gpos50: 'rgb(200,200,200)',
      gpos33: 'rgb(210,210,210)',
      gpos25: 'rgb(200,200,200)',
      gvar: 'rgb(220,220,220)',
      gneg: 'rgb(255,255,255)',
      acen: 'rgb(217,47,39)',
      stalk: 'rgb(100,127,164)',
      select: 'rgb(135,177,255)'
    }

    const drawCircos = (error, GRCh37, cytobands, data) => {
      const width = document.getElementsByTagName('canvas')[0].clientWidth
      const height = document.getElementsByTagName('canvas')[0].clientHeight
      const circos = new Circos({
        container: this.renderer.view,
        renderer: this.renderer,
        width: width,
        height: height
      })

      cytobands = cytobands.map(function (d) {
        return {
          block_id: d.chrom,
          start: parseInt(d.chromStart),
          end: parseInt(d.chromEnd),
          gieStain: d.gieStain,
          name: d.name
        }
      })

      data = data.map(function (d) {
        return {
          source: {
            id: d.source_id,
            start: parseInt(d.source_breakpoint) - 2000000,
            end: parseInt(d.source_breakpoint) + 2000000
          },
          target: {
            id: d.target_id,
            start: parseInt(d.target_breakpoint) - 2000000,
            end: parseInt(d.target_breakpoint) + 2000000
          }
        }
      })

      circos
        .layout(
        GRCh37, {
          innerRadius: width / 2 - 80,
          outerRadius: width / 2 - 40,
          labels: {
            radialOffset: 70
          },
          ticks: {
            display: true,
            labelDenominator: 1000000
          },
          events: {
            'click.demo': function (d, i, nodes, event) {
              console.log('clicked on layout block', d, event)
            }
          }
        }
        )
        // .highlight('cytobands', cytobands, {
        //   innerRadius: width / 2 - 80,
        //   outerRadius: width / 2 - 40,
        //   opacity: 0.3,
        //   color: function (d) {
        //     return gieStainColor[d.gieStain]
        //   },
        //   tooltipContent: function (d) {
        //     return d.name
        //   }
        // })
        // .chords(
        // 'l1',
        // data, {
        //   radius: function (d) {
        //     if (d.source.id === 'chr1') {
        //       return 0.5
        //     } else {
        //       return null
        //     }
        //   },
        //   logScale: false,
        //   opacity: 0.7,
        //   color: '#ff5722',
        //   tooltipContent: function (d) {
        //     return '<h3>' + d.source.id + ' ➤ ' + d.target.id + ': ' + d.value +
        //       '</h3><i>(CTRL+C to copy to clipboard)</i>'
        //   },
        //   events: {
        //     'mouseover.demo': function (d, i, nodes, event) {
        //       console.log(d, i, nodes, event.pageX)
        //     }
        //   }
        // }
        // )
        .render()
    }

    d3.queue()
      .defer(d3.json, '/dist/data/GRCh37.json')
      .defer(d3.csv, '/dist/data/cytobands.csv')
      .defer(d3.csv, '/dist/data/fusion-genes.csv')
      .await(drawCircos)
  }
}