import BaseRenderer from './BaseRenderer';
import Circos from '../Core/Circos/src/circos';
const d3 = Object.assign({}, require('d3-queue'), require('d3-request'), require('d3-collection'), require('d3-array'));
import defaultConfigs from '../Config';
import {
  defaultCipherList
} from 'constants';

export default class CircosRenderer extends BaseRenderer {
  constructor(elem, options) {
    super(elem, options);
  }
  // draw chords
  chords(data, configs) {
    const gieStainColor = defaultConfigs.circos.gieStainColor

    const drawCircos = (error, GRCh37, cytobands, data) => {
      const width = document.getElementsByTagName('canvas')[0].clientWidth
      const height = document.getElementsByTagName('canvas')[0].clientHeight
      const circos = new Circos({
        container: this.renderer.view,
        renderer: this.renderer,
        width: width,
        height: height
      })

      cytobands = cytobands.map(d => ({
        block_id: d.chrom,
        start: parseInt(d.chromStart),
        end: parseInt(d.chromEnd),
        gieStain: d.gieStain,
        name: d.name
      }))

      data = data.map(d => ({
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
      }))

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
              'click.demo': (d, i, nodes, event) => {
                console.log('clicked on layout block', d, event)
              }
            }
          }
        )
        .highlight('cytobands', cytobands, {
          innerRadius: width / 2 - 80,
          outerRadius: width / 2 - 40,
          opacity: 0.3,
          color: d => gieStainColor[d.gieStain],
          tooltipContent: d => d.name
        })
        .chords(
          'l1',
          data, {
            radius: d => {
              if (d.source.id === 'chr1') {
                return 0.5
              } else {
                return null
              }
            },
            logScale: false,
            opacity: 0.7,
            color: '#ff5722',
            tooltipContent: d => `<h3>${d.source.id} ➤ ${d.target.id} : ${d.value}</h3>`,
            events: {
              'mouseover.demo': (d, i, nodes, event) => {
                console.log(d, i, nodes, event.pageX)
              }
            }
          }
        )
        .render()
    }

    d3.queue()
      .defer(d3.json, '/dist/data/GRCh37.json')
      .defer(d3.csv, '/dist/data/cytobands.csv')
      .defer(d3.csv, '/dist/data/fusion-genes.csv')
      .await(drawCircos)
  }
  // draw highlight
  highlight(data, configs) {
    const width = document.getElementsByTagName('canvas')[0].clientWidth
    const height = document.getElementsByTagName('canvas')[0].clientHeight
    const circos = new Circos({
      container: this.renderer.view,
      renderer: this.renderer,
      width: width,
      height: height
    })

    const gieStainColor = defaultConfigs.circos.gieStainColor

    const drawCircos = (error, GRCh37, cytobands) => {
      data = cytobands.map(d => ({
        block_id: d.chrom,
        start: parseInt(d.chromStart),
        end: parseInt(d.chromEnd),
        gieStain: d.gieStain
      }))

      circos
        .layout(
          GRCh37, {
            innerRadius: width / 2 - 100,
            outerRadius: width / 2 - 50,
            labels: {
              display: false
            },
            ticks: {
              display: false
            }
          }
        )
        .highlight('cytobands', data, {
          innerRadius: width / 2 - 100,
          outerRadius: width / 2 - 50,
          opacity: 0.5,
          color: d => gieStainColor[d.gieStain]
        })
        .render()
    }

    d3.queue()
      .defer(d3.json, '/dist/data/GRCh37.json')
      .defer(d3.csv, '/dist/data/cytobands.csv')
      .await(drawCircos)
  }
  // draw heatmap
  heatmap(data, configs) {
    const drawCircos = (error, months, electricalConsumption, daysOff) => {
      const width = document.getElementsByTagName('canvas')[0].clientWidth
      const height = document.getElementsByTagName('canvas')[0].clientHeight
      const circos = new Circos({
        container: this.renderer.view,
        renderer: this.renderer,
        width: width,
        height: height
      })

      electricalConsumption = electricalConsumption.map(d => ({
        block_id: d.month,
        start: parseInt(d.start),
        end: parseInt(d.end),
        value: parseFloat(d.value)
      }))
      daysOff = daysOff.map(d => ({
        block_id: d.month,
        start: parseInt(d.start),
        end: parseInt(d.end),
        value: parseFloat(d.value)
      }))
      circos
        .layout(
          months, {
            innerRadius: width / 2 - 80,
            outerRadius: width / 2 - 30,
            ticks: {
              display: false
            },
            labels: {
              position: 'center',
              display: true,
              size: 14,
              color: '#000',
              radialOffset: 15
            }
          }
        )
        .heatmap('electricalConsumption', electricalConsumption, {
          innerRadius: 0.8,
          outerRadius: 0.98,
          logScale: false,
          color: 'YlOrRd',
          events: {
            'mouseover.demo': (d, i, nodes, event) => {
              console.log(d, i, nodes, event)
            }
          }
        })
        .heatmap('days-off', daysOff, {
          innerRadius: 0.7,
          outerRadius: 0.79,
          logScale: false,
          color: 'Blues'
        })
        .render()
    }

    d3.queue()
      .defer(d3.json, '/dist/data/months.json')
      .defer(d3.csv, '/dist/data/electrical-consumption.csv')
      .defer(d3.csv, '/dist/data/days-off.csv')
      .await(drawCircos)
  }
  // draw histogram
  histogram(data, configs) {
    const gieStainColor = defaultConfigs.circos.gieStainColor

    const buildData = (rawData1, rawData2, karyotype) => {
      const binLength = 10000000
      const data = []
      const rawDataByChr1 = d3.nest().key(d => d.chr).entries(rawData1)
      const rawDataByChr2 = d3.nest().key(d => d.chr).entries(rawData2)
      karyotype.forEach(chr => {
        const raw1 = rawDataByChr1.filter(d => d.key === chr.id)[0].values
        const raw2 = rawDataByChr2.filter(d => d.key === chr.id)[0].values
        d3.range(0, chr.len, binLength).forEach(position => {
          let counter = 0
          raw1.forEach(datum => {
            const start = parseInt(datum.start)
            const end = parseInt(datum.end)
            if ((start < position && end > position) || (start > position && start < position + binLength)) {
              counter++
            }
          })
          raw2.forEach(datum => {
            let start = parseInt(datum.start)
            let end = parseInt(datum.end)
            if ((start < position && end > position) || (start > position && start < position + binLength)) {
              counter++
            }
          })
          data.push({
            block_id: chr.id,
            start: position,
            end: Math.min(position + binLength - 1, chr.len),
            value: counter
          })
        })
      })
      return data
    }

    var drawCircos = (error, GRCh37, cytobands, es, ips) => {
      const width = document.getElementsByTagName('canvas')[0].clientWidth
      const height = document.getElementsByTagName('canvas')[0].clientHeight
      const circos = new Circos({
        container: this.renderer.view,
        renderer: this.renderer,
        width: width,
        height: height
      })

      cytobands = cytobands.map(d => ({
        block_id: d.chrom,
        start: parseInt(d.chromStart),
        end: parseInt(d.chromEnd),
        gieStain: d.gieStain,
        name: d.name
      }))

      circos
        .layout(
          GRCh37, {
            innerRadius: width / 2 - 150,
            outerRadius: width / 2 - 120,
            labels: {
              display: false
            },
            ticks: {
              display: false,
              labelDenominator: 1000000
            }
          }
        )
        .highlight('cytobands', cytobands, {
          innerRadius: width / 2 - 150,
          outerRadius: width / 2 - 120,
          opacity: 0.6,
          color: d => gieStainColor[d.gieStain],
          tooltipContent: d => d.name
        })
        .histogram('es', buildData(es, ips, GRCh37), {
          innerRadius: 1.01,
          outerRadius: 1.4,
          color: 'OrRd'
        })
        .render()
    }

    d3.queue()
      .defer(d3.json, '/dist/data/GRCh37.json')
      .defer(d3.csv, '/dist/data/cytobands.csv')
      .defer(d3.csv, '/dist/data/es.csv')
      .defer(d3.csv, '/dist/data/ips.csv')
      .await(drawCircos)
  }
  // draw line
  line(data, configs) {
    const width = document.getElementsByTagName('canvas')[0].clientWidth
    const height = document.getElementsByTagName('canvas')[0].clientHeight
    const circos = new Circos({
      container: this.renderer.view,
      renderer: this.renderer,
      width: width,
      height: height
    })

    const gieStainColor = defaultConfigs.circos.gieStainColor

    var drawCircos = (error, GRCh37, cytobands, snp250, snp, snp1m) => {
      GRCh37 = GRCh37.filter(function (d) {
        return d.id === 'chr1' || d.id === 'chr2' || d.id === 'chr3'
      })

      cytobands = cytobands
        .filter(function (d) {
          return d.chrom === 'chr1' || d.chrom === 'chr2' || d.chrom === 'chr3'
        })
        .map(function (d) {
          return {
            block_id: d.chrom,
            start: parseInt(d.chromStart),
            end: parseInt(d.chromEnd),
            gieStain: d.gieStain,
            name: d.name
          }
        })

      snp250 = snp250.map(function (d) {
        return {
          block_id: d.chromosome,
          position: (parseInt(d.start) + parseInt(d.end)) / 2,
          value: d.value
        }
      })

      snp = snp.map(function (d) {
        return {
          block_id: d.chromosome,
          position: (parseInt(d.start) + parseInt(d.end)) / 2,
          value: d.value
        }
      })

      snp1m = snp1m.map(function (d) {
        return {
          block_id: d.chromosome,
          position: (parseInt(d.start) + parseInt(d.end)) / 2,
          value: d.value
        }
      })

      circos
        .layout(
          GRCh37, {
            innerRadius: width / 2 - 100,
            outerRadius: width / 2 - 80,
            labels: {
              display: false
            },
            ticks: {
              display: false
            }
          }
        )
        .highlight('cytobands', cytobands, {
          innerRadius: width / 2 - 100,
          outerRadius: width / 2 - 80,
          opacity: 0.3,
          color: function (d) {
            return gieStainColor[d.gieStain]
          },
          tooltipContent: function (d) {
            return d.name
          }
        })
        .line('snp-250', snp250, {
          innerRadius: 0.5,
          outerRadius: 0.8,
          maxGap: 1000000,
          min: 0,
          max: 0.015,
          color: '#222222',
          axes: [{
            spacing: 0.001,
            thickness: 1,
            color: '#666666'
          }],
          backgrounds: [{
              start: 0,
              end: 0.002,
              color: '#f44336',
              opacity: 0.5
            },
            {
              start: 0.006,
              end: 0.015,
              color: '#4caf50',
              opacity: 0.5
            }
          ],
          tooltipContent: null
        })
        .scatter('snp-250-tooltip', snp250, {
          innerRadius: 0.5,
          outerRadius: 0.8,
          min: 0,
          max: 0.015,
          fill: false,
          strokeWidth: 0,
          tooltipContent: function (d, i) {
            return `${d.block_id}:${Math.round(d.position)} ➤ ${d.value}`
          }
        })
        .line('snp', snp, {
          innerRadius: 1.01,
          outerRadius: 1.15,
          maxGap: 1000000,
          min: 0,
          max: 0.015,
          color: '#222222',
          axes: [{
              position: 0.002,
              color: '#f44336'
            },
            {
              position: 0.006,
              color: '#4caf50'
            }
          ],
          tooltipContent: null
        })
        .line('snp1m', snp1m, {
          innerRadius: 1.01,
          outerRadius: 1.15,
          maxGap: 1000000,
          min: 0,
          max: 0.015,
          color: '#f44336',
          tooltipContent: null
        })
        .line('snp-in', snp, {
          innerRadius: 0.85,
          outerRadius: 0.95,
          maxGap: 1000000,
          direction: 'in',
          min: 0,
          max: 0.015,
          color: '#222222',
          axes: [{
              position: 0.01,
              color: '#4caf50'
            },
            {
              position: 0.008,
              color: '#4caf50'
            },
            {
              position: 0.006,
              color: '#4caf50'
            },
            {
              position: 0.002,
              color: '#f44336'
            }
          ],
          tooltipContent: null
        })
        .line('snp1m-in', snp1m, {
          innerRadius: 0.85,
          outerRadius: 0.95,
          maxGap: 1000000,
          direction: 'in',
          min: 0,
          max: 0.015,
          color: '#f44336',
          tooltipContent: null
        })
        .render()
    }

    d3.queue()
      .defer(d3.json, '/dist/data/GRCh37.json')
      .defer(d3.csv, '/dist/data/cytobands.csv')
      .defer(d3.csv, '/dist/data/snp.density.250kb.txt')
      .defer(d3.csv, '/dist/data/snp.density.txt')
      .defer(d3.csv, '/dist/data/snp.density.1mb.txt')
      .await(drawCircos)
  }
  // draw scatter
  scatter(data, configs) {
    const width = document.getElementsByTagName('canvas')[0].clientWidth
    const height = document.getElementsByTagName('canvas')[0].clientHeight
    const circos = new Circos({
      container: this.renderer.view,
      renderer: this.renderer,
      width: width,
      height: height
    })

    const gieStainColor = defaultConfigs.circos.gieStainColor

    var drawCircos = function (error, GRCh37, cytobands, snp250, snp, snp1m) {
      GRCh37 = GRCh37.filter(function (d) {
        return d.id === 'chr1' || d.id === 'chr2' || d.id === 'chr3'
      })

      cytobands = cytobands
        .filter(function (d) {
          return d.chrom === 'chr1' || d.chrom === 'chr2' || d.chrom === 'chr3'
        })
        .map(function (d) {
          return {
            block_id: d.chrom,
            start: parseInt(d.chromStart),
            end: parseInt(d.chromEnd),
            gieStain: d.gieStain,
            name: d.name
          }
        })

      snp250 = snp250.map(function (d) {
        return {
          block_id: d.chromosome,
          position: (parseInt(d.start) + parseInt(d.end)) / 2,
          value: d.value
        }
      })

      snp = snp.map(function (d) {
        return {
          block_id: d.chromosome,
          position: (parseInt(d.start) + parseInt(d.end)) / 2,
          value: d.value
        }
      })

      snp1m = snp1m.map(function (d) {
        return {
          block_id: d.chromosome,
          position: (parseInt(d.start) + parseInt(d.end)) / 2,
          value: d.value
        }
      })

      circos
        .layout(
        GRCh37,
        {
          innerRadius: width / 2 - 150,
          outerRadius: width / 2 - 130,
          ticks: {
            display: false,
            spacing: 1000000,
            labelSuffix: ''
          },
          labels: {
            position: 'center',
            display: true,
            size: 14,
            color: '#000',
            radialOffset: 30
          }
        }
        )
        .highlight('cytobands', cytobands, {
          innerRadius: width / 2 - 150,
          outerRadius: width / 2 - 130,
          opacity: 0.8,
          color: function (d) {
            return gieStainColor[d.gieStain]
          },
          tooltipContent: function (d) {
            return d.name
          }
        })
        .scatter('snp-250', snp250, {
          innerRadius: 0.65,
          outerRadius: 0.95,
          color: function (d) {
            if (d.value > 0.006) { return '#4caf50' }
            if (d.value < 0.002) { return '#f44336' }
            return '#d3d3d3'
          },
          strokeColor: 'grey',
          strokeWidth: 1,
          shape: 'circle',
          size: 14,
          min: 0,
          max: 0.013,
          axes: [
            {
              spacing: 0.001,
              start: 0.006,
              thickness: 1,
              color: '#4caf50',
              opacity: 0.3
            },
            {
              spacing: 0.002,
              start: 0.006,
              thickness: 1,
              color: '#4caf50',
              opacity: 0.5
            },
            {
              spacing: 0.002,
              start: 0.002,
              end: 0.006,
              thickness: 1,
              color: '#666',
              opacity: 0.5
            },
            {
              spacing: 0.001,
              end: 0.002,
              thickness: 1,
              color: '#f44336',
              opacity: 0.5
            }
          ],
          backgrounds: [
            {
              start: 0.006,
              color: '#4caf50',
              opacity: 0.1
            },
            {
              start: 0.002,
              end: 0.006,
              color: '#d3d3d3',
              opacity: 0.1
            },
            {
              end: 0.002,
              color: '#f44336',
              opacity: 0.1
            }
          ],
          tooltipContent: function (d, i) {
            return `${d.block_id}:${Math.round(d.position)} ➤ ${d.value}`
          }
        })
        .scatter('snp-250-2', snp250.filter(function (d) { return d.value > 0.007 }), {
          color: '#4caf50',
          strokeColor: 'green',
          strokeWidth: 1,
          shape: 'rectangle',
          size: 10,
          min: 0.007,
          max: 0.013,
          innerRadius: 1.075,
          outerRadius: 1.175,
          axes: [
            {
              spacing: 0.001,
              thickness: 1,
              color: '#4caf50',
              opacity: 0.3
            },
            {
              spacing: 0.002,
              thickness: 1,
              color: '#4caf50',
              opacity: 0.5
            }
          ],
          backgrounds: [
            {
              start: 0.007,
              color: '#4caf50',
              opacity: 0.1
            },
            {
              start: 0.009,
              color: '#4caf50',
              opacity: 0.1
            },
            {
              start: 0.011,
              color: '#4caf50',
              opacity: 0.1
            },
            {
              start: 0.013,
              color: '#4caf50',
              opacity: 0.1
            }
          ],
          tooltipContent: function (d, i) {
            return `${d.block_id}:${Math.round(d.position)} ➤ ${d.value}`
          }
        })
        .scatter('snp-250-3', snp250.filter(function (d) { return d.value < 0.002 }), {
          color: '#f44336',
          strokeColor: 'red',
          strokeWidth: 1,
          shape: 'triangle',
          size: 10,
          min: 0,
          max: 0.002,
          innerRadius: 0.35,
          outerRadius: 0.60,
          axes: [
            {
              spacing: 0.0001,
              thickness: 1,
              color: '#f44336',
              opacity: 0.3
            },
            {
              spacing: 0.0005,
              thickness: 1,
              color: '#f44336',
              opacity: 0.5
            }
          ],
          backgrounds: [
            {
              end: 0.0004,
              color: '#f44336',
              opacity: 0.1
            },
            {
              end: 0.0008,
              color: '#f44336',
              opacity: 0.1
            },
            {
              end: 0.0012,
              color: '#f44336',
              opacity: 0.1
            },
            {
              end: 0.0016,
              color: '#f44336',
              opacity: 0.1
            },
            {
              end: 0.002,
              color: '#f44336',
              opacity: 0.1
            }
          ],
          tooltipContent: function (d, i) {
            return `${d.block_id}:${Math.round(d.position)} ➤ ${d.value}`
          }
        })
        .render()
    }

    d3.queue()
      .defer(d3.json, '/dist/data/GRCh37.json')
      .defer(d3.csv, '/dist/data/cytobands.csv')
      .defer(d3.csv, '/dist/data/snp.density.250kb.txt')
      .defer(d3.csv, '/dist/data/snp.density.txt')
      .defer(d3.csv, '/dist/data/snp.density.1mb.txt')
      .await(drawCircos)
  }
  // draw stack
  stack(data, configs) {
    const width = document.getElementsByTagName('canvas')[0].clientWidth
    const height = document.getElementsByTagName('canvas')[0].clientHeight
    const circos = new Circos({
      container: this.renderer.view,
      renderer: this.renderer,
      width: width,
      height: height
    })

    const gieStainColor = defaultConfigs.circos.gieStainColor
    var drawCircos = function (error, GRCh37, cytobands, segdup) {
      cytobands = cytobands
        .filter(function (d) {
          return d.chrom === 'chr9'
        })
        .map(function (d) {
          return {
            block_id: d.chrom,
            start: parseInt(d.chromStart),
            end: parseInt(d.chromEnd),
            gieStain: d.gieStain
          }
        })

      var start = 39000000
      var length = 8000000
      data = segdup.filter(function (d) {
        return d.chr === 'chr9' && d.start >= start && d.end <= start + length
      }).filter(function (d) {
        return d.end - d.start > 30000
      }).map(function (d) {
        d.block_id = d.chr
        d.start -= start
        d.end -= start
        return d
      })

      circos
        .layout(
        [{
          id: 'chr9',
          len: length,
          label: 'chr9',
          color: '#FFCC00'
        }], {
          innerRadius: width / 2 - 50,
          outerRadius: width / 2 - 30,
          labels: {
            display: false
          },
          ticks: {
            display: true,
            labels: false,
            spacing: 10000
          }
        }
        )
        .highlight('cytobands', cytobands, {
          innerRadius: width / 2 - 50,
          outerRadius: width / 2 - 30,
          opacity: 0.8,
          color: function (d) {
            return gieStainColor[d.gieStain]
          }
        })
        .stack('stack', data, {
          innerRadius: 0.7,
          outerRadius: 1,
          thickness: 4,
          margin: 0.01 * length,
          direction: 'out',
          strokeWidth: 0,
          color: function (d) {
            if (d.end - d.start > 150000) {
              return 'red'
            } else if (d.end - d.start > 120000) {
              return '#333'
            } else if (d.end - d.start > 90000) {
              return '#666'
            } else if (d.end - d.start > 60000) {
              return '#999'
            } else if (d.end - d.start > 30000) {
              return '#BBB'
            }
          },
          tooltipContent: function (d) {
            return `${d.block_id}:${d.start}-${d.end}`
          }
        })
        .render()
    }

    d3.queue()
      .defer(d3.json, '/dist/data/GRCh37.json')
      .defer(d3.csv, '/dist/data/cytobands.csv')
      .defer(d3.csv, '/dist/data/segdup.csv')
      .await(drawCircos)
  }
}