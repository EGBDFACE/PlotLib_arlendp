import BaseRenderer from './BaseRenderer';
import Circos from '../Core/Circos/src/circos';
const d3 = Object.assign({}, require('d3-queue'), require('d3-request'), require('d3-collection'), require('d3-array'));
import defaultConfigs from '../Config';

export default class CircularRenderer extends BaseRenderer {
  constructor(elem, options) {
    super(elem, options);
  }
  // draw chords
  chords(layout, data) {
    const width = this.renderer.view.width / this.renderer.resolution
    const height = this.renderer.view.height / this.renderer.resolution
    const circos = new Circos({
      container: this.renderer.view,
      renderer: this.renderer,
      width: width,
      height: height
    })

    const gieStainColor = defaultConfigs.circular.gieStainColor

    var drawCircos = function (error) {
      let layoutData = arguments[1]
      const fileData = [].slice.call(arguments, 2);
      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'heatmap') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.start = parseInt(d.start);
            d.end = parseInt(d.end);
            d.value = parseFloat(d.value || 0);
            return d;
          })
        } else if (data[i].circularType === 'scatter') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.position = (parseInt(d.start) + parseInt(d.end)) / 2;
            d.value = parseFloat(d.value || 0);
            return d;
          })
        }
      })

      let circular = circos
        .layout(layoutData, {
          innerRadius: layout.configs.innerRadius || width / 2 - 100,
          outerRadius: layout.configs.outerRadius || width / 2 - 80,
          labels: {
            display: layout.configs.labels || false,
            radialOffset: 26
          },
          opacity: layout.configs.opacity,
          ticks: {
            display: layout.configs.ticks || false,
            labelDenominator: layout.configs.tickScale || 1000000,
            labelSuffix: layout.configs.labelSuffix || '',
            labelSpacing: layout.configs.labelSpacing || 5,
            labelDisplay0: layout.configs.labelDisplay0 || false
          },
          tooltipContent: layout.configs.tips
        })

      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'heatmap') {
          circular = circular.heatmap(data[i].name, fileData[i], {
            innerRadius: data[i].configs.innerRadius,
            outerRadius: data[i].configs.outerRadius,
            logScale: false,
            color: data[i].configs.color || 'YlOrRd',
            tooltipContent: data[i].configs.tips
          })
        } else if (data[i].circularType === 'chords') {
          circular = circular.chords(data[i].name, fileData[i], {
            radius: data[i].configs.radius,
            logScale: false,
            opacity: data[i].configs.opacity || 0.7,
            color: 'none',
            stroke: data[i].configs.stroke || '#000000',
            strokeWidth: data[i].configs.strokeWidth || 1,
            tooltipContent: data[i].configs.tips
          })
        } else if (data[i].circularType === 'scatter') {
          circular = circular.scatter(data[i].name, fileData[i], {
            innerRadius: data[i].configs.innerRadius,
            outerRadius: data[i].configs.outerRadius,
            color: data[i].configs.color || '#000',
            strokeColor: data[i].configs.stroke || '#000',
            strokeWidth: 0.5,
            fillOpacity: data[i].configs.fillOpacity || 1,
            shape: 'circle',
            size: data[i].configs.size || 14,
            min: data[i].configs.min,
            max: data[i].configs.max,
            axes: data[i].configs.axes,
            backgrounds: data[i].configs.backgrounds,
            tooltipContent: data[i].configs.tips
          })
        }
      })
      circular.render()
      layout.configs.completed && layout.configs.completed()
    }
    let queue = d3.queue()
    queue = queue.defer(d3[layout.fileType], layout.fileUrl)
    data.forEach(function (d) {
      queue = queue.defer(d3[d.fileType], d.fileUrl)
    })
    queue.await(drawCircos)
  }
  // draw highlight
  highlight(layout, data) {
    const width = this.renderer.view.width / this.renderer.resolution
    const height = this.renderer.view.height / this.renderer.resolution
    const circos = new Circos({
      container: this.renderer.view,
      renderer: this.renderer,
      width: width,
      height: height
    })

    const gieStainColor = defaultConfigs.circular.gieStainColor

    var drawCircos = function (error) {
      let layoutData = arguments[1]
      const fileData = [].slice.call(arguments, 2);
      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'highlight') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.start = parseInt(d.start);
            d.end = parseInt(d.end);
            d.value = parseFloat(d.value || 0);
            return d;
          })
        }
      })

      let circular = circos
        .layout(layoutData, {
          innerRadius: layout.configs.innerRadius || width / 2 - 100,
          outerRadius: layout.configs.outerRadius || width / 2 - 80,
          labels: {
            display: layout.configs.labels || false,
            radialOffset: 70
          },
          opacity: layout.configs.opacity,
          ticks: {
            display: layout.configs.ticks || false,
            labelDenominator: layout.configs.tickScale || 1000000,
            labelSuffix: layout.configs.labelSuffix || '',
            labelSpacing: layout.configs.labelSpacing || 5,
            labelDisplay0: layout.configs.labelDisplay0 || false
          },
          // events: {
          //   'click.demo': function (d, i, nodes, event) {
          //     console.log('clicked on layout block', d, event)
          //   }
          // }
          tooltipContent: layout.configs.tips
        })

      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'highlight') {
          circular = circular.highlight(data[i].name, fileData[i], {
            innerRadius: data[i].configs.innerRadius,
            outerRadius: data[i].configs.outerRadius,
            opacity: data[i].configs.opacity || 0.6,
            color: data[i].configs.color || function (d) {
              return gieStainColor[d.gieStain] || '#000'
            }
          })
        }
      })
      circular.render()
      layout.configs.completed && layout.configs.completed()
    }
    let queue = d3.queue()
    queue = queue.defer(d3[layout.fileType], layout.fileUrl)
    data.forEach(function (d) {
      queue = queue.defer(d3[d.fileType], d.fileUrl)
    })
    queue.await(drawCircos)
  }
  // draw heatmap
  heatmap(layout, data) {
    const width = this.renderer.view.width / this.renderer.resolution
    const height = this.renderer.view.height / this.renderer.resolution
    const circos = new Circos({
      container: this.renderer.view,
      renderer: this.renderer,
      width: width,
      height: height
    })
    var drawCircos = function (error) {
      let layoutData = arguments[1]
      const fileData = [].slice.call(arguments, 2);
      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'heatmap') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.start = parseInt(d.start);
            d.end = parseInt(d.end);
            d.value = parseFloat(d.value || 0);
            return d;
          })
        }
      })

      let circular = circos
        .layout(layoutData, {
          innerRadius: layout.configs.innerRadius || width / 2 - 100,
          outerRadius: layout.configs.outerRadius || width / 2 - 80,
          labels: {
            display: layout.configs.labels || false,
            position: 'center',
            size: 14,
            color: '#000',
            radialOffset: 30
          },
          opacity: layout.configs.opacity,
          ticks: {
            display: layout.configs.ticks || false,
            labelDenominator: layout.configs.tickScale || 1000000,
            labelSuffix: layout.configs.labelSuffix || '',
            labelSpacing: layout.configs.labelSpacing || 5,
            labelDisplay0: layout.configs.labelDisplay0 || false
          },
          tooltipContent: layout.configs.tips
        })

      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'heatmap') {
          circular = circular.heatmap(data[i].name, fileData[i], {
            innerRadius: data[i].configs.innerRadius,
            outerRadius: data[i].configs.outerRadius,
            logScale: false,
            color: data[i].configs.color || 'YlOrRd',
            tooltipContent: data[i].configs.tips
          })
        }
      })
      circular.render()
      layout.configs.completed && layout.configs.completed()
    }
    let queue = d3.queue()
    queue = queue.defer(d3[layout.fileType], layout.fileUrl)
    data.forEach(function (d) {
      queue = queue.defer(d3[d.fileType], d.fileUrl)
    })
    queue.await(drawCircos)
  }
  // draw histogram
  histogram(layout, data) {
    const width = this.renderer.view.width / this.renderer.resolution
    const height = this.renderer.view.height / this.renderer.resolution
    const circos = new Circos({
      container: this.renderer.view,
      renderer: this.renderer,
      width: width,
      height: height
    })
    const gieStainColor = defaultConfigs.circular.gieStainColor

    var drawCircos = function (error) {
      let layoutData = arguments[1]
      const fileData = [].slice.call(arguments, 2);
      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'highlight') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.start = parseInt(d.start);
            d.end = parseInt(d.end);
            d.value = parseFloat(d.value || 0);
            return d;
          })
        } else if (data[i].circularType === 'histogram') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.start = parseInt(d.start);
            d.end = parseInt(d.end);
            d.value = parseFloat(d.value || 0);
            return d;
          })
        }
      })

      let circular = circos
        .layout(layoutData, {
          innerRadius: layout.configs.innerRadius || width / 2 - 100,
          outerRadius: layout.configs.outerRadius || width / 2 - 80,
          labels: {
            display: layout.configs.labels || false,
            position: 'center',
            size: 14,
            color: '#000',
            radialOffset: 30
          },
          opacity: layout.configs.opacity,
          ticks: {
            display: layout.configs.ticks || false,
            labelDenominator: layout.configs.tickScale || 1000000,
            labelSuffix: layout.configs.labelSuffix || '',
            labelSpacing: layout.configs.labelSpacing || 5,
            labelDisplay0: layout.configs.labelDisplay0 || false
          },
          tooltipContent: layout.configs.tips
        })

      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'highlight') {
          circular = circular.highlight(data[i].name, fileData[i], {
            innerRadius: data[i].configs.innerRadius,
            outerRadius: data[i].configs.outerRadius,
            opacity: data[i].configs.opacity || 0.6,
            color: data[i].configs.color || function (d) {
              return gieStainColor[d.gieStain] || '#000'
            },
            tooltipContent: data[i].configs.tips
          })
        } else if (data[i].circularType === 'histogram') {
          circular = circular.histogram(data[i].name, fileData[i], {
            innerRadius: data[i].configs.innerRadius,
            outerRadius: data[i].configs.outerRadius,
            color: data[i].configs.color || 'OrRd',
            direction: data[i].configs.direction || 'out',
            tooltipContent: data[i].configs.tips
          })
        }
      })
      circular.render()
      layout.configs.completed && layout.configs.completed()
    }
    let queue = d3.queue()
    queue = queue.defer(d3[layout.fileType], layout.fileUrl)
    data.forEach(function (d) {
      queue = queue.defer(d3[d.fileType], d.fileUrl)
    })
    queue.await(drawCircos)
  }
  // draw line
  line(layout, data) {
    const width = this.renderer.view.width / this.renderer.resolution
    const height = this.renderer.view.height / this.renderer.resolution
    const circos = new Circos({
      container: this.renderer.view,
      renderer: this.renderer,
      width: width,
      height: height
    })

    const gieStainColor = defaultConfigs.circular.gieStainColor

    var drawCircos = function (error) {
      let layoutData = arguments[1]
      const fileData = [].slice.call(arguments, 2);
      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'highlight') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.start = parseInt(d.start);
            d.end = parseInt(d.end);
            d.value = parseFloat(d.value || 0);
            return d;
          })
        } else if (data[i].circularType === 'line') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.position = (parseInt(d.start) + parseInt(d.end)) / 2;
            d.value = parseFloat(d.value || 0);
            return d;
          })
        }
      })

      let circular = circos
        .layout(layoutData, {
          innerRadius: layout.configs.innerRadius || width / 2 - 100,
          outerRadius: layout.configs.outerRadius || width / 2 - 80,
          labels: {
            display: layout.configs.labels || false,
            position: 'center',
            size: 14,
            color: '#000',
            radialOffset: 30
          },
          opacity: layout.configs.opacity,
          ticks: {
            display: layout.configs.ticks || false,
            labelDenominator: layout.configs.tickScale || 1000000,
            labelSuffix: layout.configs.labelSuffix || '',
            labelSpacing: layout.configs.labelSpacing || 5,
            labelDisplay0: layout.configs.labelDisplay0 || false
          },
          tooltipContent: layout.configs.tips
        })

      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'highlight') {
          circular = circular.highlight(data[i].name, fileData[i], {
            innerRadius: data[i].configs.innerRadius,
            outerRadius: data[i].configs.outerRadius,
            opacity: data[i].configs.opacity || 0.6,
            color: data[i].configs.color || function (d) {
              return gieStainColor[d.gieStain] || '#000'
            },
            tooltipContent: data[i].configs.tips
          })
        } else if (data[i].circularType === 'line') {
          circular = circular.line(data[i].name, fileData[i], {
            innerRadius: data[i].configs.innerRadius,
            outerRadius: data[i].configs.outerRadius,
            maxSpace: data[i].configs.maxSpace || 1000000,
            min: data[i].configs.min,
            max: data[i].configs.max,
            color: data[i].configs.color || '#000',
            axes: data[i].configs.axes,
            backgrounds: data[i].configs.backgrounds,
            tooltipContent: data[i].configs.tips
          })
        }
      })
      circular.render()
      layout.configs.completed && layout.configs.completed()
    }
    let queue = d3.queue()
    queue = queue.defer(d3[layout.fileType], layout.fileUrl)
    data.forEach(function (d) {
      queue = queue.defer(d3[d.fileType], d.fileUrl)
    })
    queue.await(drawCircos)
  }
  // draw scatter
  scatter(layout, data) {
    const width = this.renderer.view.width / this.renderer.resolution
    const height = this.renderer.view.height / this.renderer.resolution
    const circos = new Circos({
      container: this.renderer.view,
      renderer: this.renderer,
      width: width,
      height: height
    })

    const gieStainColor = defaultConfigs.circular.gieStainColor

    var drawCircos = function (error) {
      let layoutData = arguments[1]
      const fileData = [].slice.call(arguments, 2);
      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'highlight') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.start = parseInt(d.start);
            d.end = parseInt(d.end);
            d.value = parseFloat(d.value || 0);
            return d;
          })
        } else if (data[i].circularType === 'scatter') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.position = (parseInt(d.start) + parseInt(d.end)) / 2;
            d.value = parseFloat(d.value || 0);
            return d;
          })
        }
      })

      let circular = circos
        .layout(layoutData, {
          innerRadius: layout.configs.innerRadius || width / 2 - 100,
          outerRadius: layout.configs.outerRadius || width / 2 - 80,
          strokeWidth: layout.configs.strokeWidth || 0,
          stroke: layout.configs.stroke || 'none',
          labels: {
            display: layout.configs.labels || false,
            radialOffset: 26
          },
          opacity: layout.configs.opacity,
          ticks: {
            display: layout.configs.ticks || false,
            labelDenominator: layout.configs.tickScale || 1000000,
            labelSuffix: layout.configs.labelSuffix || '',
            labelSpacing: layout.configs.labelSpacing || 5,
            labelDisplay0: layout.configs.labelDisplay0 || false
          },
          tooltipContent: layout.configs.tips
        })

      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'highlight') {
          circular = circular.highlight(data[i].name, fileData[i], {
            innerRadius: data[i].configs.innerRadius,
            outerRadius: data[i].configs.outerRadius,
            opacity: data[i].configs.opacity || 0.6,
            color: data[i].configs.color || function (d) {
              return gieStainColor[d.gieStain] || '#000';
            },
            tooltipContent: data[i].configs.tips
          })
        } else if (data[i].circularType === 'scatter') {
          circular = circular.scatter(data[i].name, fileData[i], {
            innerRadius: data[i].configs.innerRadius,
            outerRadius: data[i].configs.outerRadius,
            color: data[i].configs.color || '#000',
            strokeColor: data[i].configs.stroke || '#000',
            strokeWidth: 0.5,
            fillOpacity: data[i].configs.fillOpacity || 1,
            shape: 'circle',
            size: data[i].configs.size || 14,
            min: data[i].configs.min,
            max: data[i].configs.max,
            axes: data[i].configs.axes,
            backgrounds: data[i].configs.backgrounds,
            tooltipContent: data[i].configs.tips
          })
        }
      })
      circular.render()
      layout.configs.completed && layout.configs.completed()
    }
    let queue = d3.queue()
    queue = queue.defer(d3[layout.fileType], layout.fileUrl)
    data.forEach(function (d) {
      queue = queue.defer(d3[d.fileType], d.fileUrl)
    })
    queue.await(drawCircos)
  }
  // draw stack
  stack(layout, data) {
    const width = this.renderer.view.width / this.renderer.resolution
    const height = this.renderer.view.height / this.renderer.resolution
    const circos = new Circos({
      container: this.renderer.view,
      renderer: this.renderer,
      width: width,
      height: height
    })

    const gieStainColor = defaultConfigs.circular.gieStainColor

    var drawCircos = function (error) {
      let layoutData = arguments[1]
      const fileData = [].slice.call(arguments, 2);
      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'highlight') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.start = parseInt(d.start);
            d.end = parseInt(d.end);
            d.value = parseFloat(d.value || 0);
            return d;
          })
        } else if (data[i].circularType === 'stack') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.start = parseInt(d.start);
            d.end = parseInt(d.end);
            d.value = parseFloat(d.value || 0);
            return d;
          })
        }
      })

      let circular = circos
        .layout(layoutData, {
          innerRadius: layout.configs.innerRadius || width / 2 - 100,
          outerRadius: layout.configs.outerRadius || width / 2 - 80,
          labels: {
            display: layout.configs.labels || false,
            position: 'center',
            size: 14,
            color: '#000',
            radialOffset: 30
          },
          opacity: layout.configs.opacity,
          ticks: {
            display: layout.configs.ticks || false,
            labelDenominator: layout.configs.tickScale || 1000000,
            labelSuffix: layout.configs.labelSuffix || '',
            labelSpacing: layout.configs.labelSpacing || 5,
            labelDisplay0: layout.configs.labelDisplay0 || false
          },
          tooltipContent: layout.configs.tips
        })

      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'highlight') {
          circular = circular.highlight(data[i].name, fileData[i], {
            innerRadius: data[i].configs.innerRadius,
            outerRadius: data[i].configs.outerRadius,
            opacity: data[i].configs.opacity || 0.6,
            color: data[i].configs.color || function (d) {
              return gieStainColor[d.gieStain] || '#000'
            },
            tooltipContent: data[i].configs.tips
          })
        } else if (data[i].circularType === 'stack') {
          circular = circular.stack(data[i].name, fileData[i], {
            innerRadius: data[i].configs.innerRadius,
            outerRadius: data[i].configs.outerRadius,
            thickness: data[i].configs.thickness || 1,
            margin: data[i].configs.margin,
            direction: data[i].configs.direction || 'out',
            strokeWidth: data[i].configs.strokeWidth,
            color: data[i].configs.color || '#000',
            tooltipContent: data[i].configs.tips
          })
        }
      })
      circular.render()
      layout.configs.completed && layout.configs.completed()
    }
    let queue = d3.queue()
    queue = queue.defer(d3[layout.fileType], layout.fileUrl)
    data.forEach(function (d) {
      queue = queue.defer(d3[d.fileType], d.fileUrl)
    })
    queue.await(drawCircos)
  }

  visShare(layout,data){
    const width = this.renderer.view.width / this.renderer.resolution
    const height = this.renderer.view.height / this.renderer.resolution
    // console.log('width visShare',width);
    // console.log('height visShare',height);
    // console.log(document.body.clientHeight);
    // console.log(document.body.clientWidth);
    const circos = new Circos({
      container: this.renderer.view,
      renderer: this.renderer,
      width: width,
      height: height
    })

    const gieStainColor = defaultConfigs.circular.gieStainColor;
    var drawCircos = function (error) {
      let layoutData = arguments[1]
      const fileData = [].slice.call(arguments, 2);
      fileData.forEach(function (d, i) {
        switch(data[i].circularType){
          //draw vep result demo 
          case 'highlight':
            // fileData[i] = fileData[i].map(function (d) {
            //   d.block_id = d.chrom;
            //   d.start = parseInt(d.start);
            //   d.end = parseInt(d.end);
            //   d.value = parseFloat(d.value || 0);
            //   return d;
            // })

            // vep demo
            // fileData[i] = fileData[i].map(function(d){
            //   d.block_id = d.name;
            //   d.start = parseInt(d.txStart);
            //   d.end = parseInt(d.txEnd);
            //   // d.value = parseFloat(d.value || 0);
            //   d.value = 0;
            //   return d;
            // });

            // cancer classifier demo
            fileData[i] = fileData[i].map(function(d) {
              d.block_id = d.gene;
              d.start = parseFloat(d.start);
              d.end = parseFloat(d.end);
              d.value = 0;
              d.score = parseFloat(d.score);
              return d;
            })
            break;
          case 'scatter':
          case 'heatmap':
            // vepDemo 
            // fileData[i] = dataTransformForVep(fileData[i],data[i].name);

            // cancer classifier demo
            // fileData[i] = fileData[i].map(function(d) {
            //   // console.log(d);
            //   // d.block_id = d.gene;
            //   d.block_id = "gene";
            //   // d.position = parseFloat(d.position);
            //   // d.start = parseFloat(d.position);
            //   // d.end = parseFloat(d.position);
            //   d.start = d.end =d.position = parseFloat(d.position);
            //   // d.position = 0;
            //   // d.start = 0;
            //   // d.end = 0;
            //   d.value = 0;
            //   d.score = parseFloat(d.score);
            //   return d;
            // });
            let filterData = [];
            fileData[i].map(function(d) {
              if (parseFloat(d.score) !== 0) {
                filterData.push({
                  block_id: "gene",
                  gene: d.gene,
                  position: parseFloat(d.position),
                  start: parseFloat(d.position),
                  end: parseFloat(d.position),
                  value: 0,
                  score: parseFloat(d.score)
                });
              }
            });
            fileData[i] = filterData;
            break;
          case 'line':
            fileData[i] = fileData[i].map(function(d) {
              // d.block_id = d.gene;
              d.block_id = "gene";
              d.start=d.end=d.position = parseFloat(d.position);
              d.value = parseFloat(d.score);
              return d;
            });
            break;
          case 'histogram':
            fileData[i] = fileData[i].map(function(d) {
              d.block_id = "gene";
              d.position = parseFloat(d.position);
              d.start = d.position-5;
              d.end = d.position+5;
              d.value = parseFloat(d.score);
              return d;
            })
            break;
          /** normal data config
           * case 'highlight':
           * case 'heatmap':
             case 'histogram':
             case 'stack':
              fileData[i] = fileData[i].map(function (d) {
                  d.block_id = d.chrom;
                  d.start = parseInt(d.start);
                  d.end = parseInt(d.end);
                  d.value = parseFloat(d.value || 0);
                  return d;
                });
                break;
             case 'scatter': 
             case 'line':
                fileData[i] = fileData[i].map(function (d) {
                  d.block_id = d.chrom;
                  d.position = (parseInt(d.start) + parseInt(d.end)) / 2;
                  d.value = parseFloat(d.value || 0);
                  return d;
                });
                break; 
            */
        }
        // console.log(fileData[i])
      })

      let circular = circos
        .layout(layoutData, {
          innerRadius: layout.configs.innerRadius || width / 2 - 100,
          outerRadius: layout.configs.outerRadius || width / 2 - 80,
          labels: {
            display: layout.configs.labels.display || false,
            radialOffset: 26,
            size: layout.configs.labels.size || 15,
          },
          opacity: layout.configs.opacity,
          ticks: {
            color: layout.configs.ticks.tickColor,
            labels: layout.configs.ticks.labels || false,
            display: layout.configs.ticks.display || false,
            spacing: layout.configs.ticks.spacing || 1000000,
            labelDenominator: layout.configs.ticks.labelDenominator || 1,
            labelSuffix: layout.configs.ticks.labelSuffix || '',
            labelSpacing: layout.configs.ticks.labelSpacing || 5,
            labelDisplay0: layout.configs.ticks.labelDisplay0 || false,
            labelColor: layout.configs.ticks.labelColor,
            labelSize: layout.configs.ticks.labelSize || '10'
          },
          tooltipContent: layout.configs.tips
        })

      fileData.forEach(function (d, i) {
        switch(data[i].circularType){
          case 'heatmap':
            circular = circular.heatmap(data[i].name, fileData[i], {
              innerRadius: data[i].configs.innerRadius,
              outerRadius: data[i].configs.outerRadius,
              logScale: false,
              color: data[i].configs.color || 'YlOrRd',
              tooltipContent: data[i].configs.tips
            })
            break;
          case 'chords':
            circular = circular.chords(data[i].name, fileData[i], {
              radius: data[i].configs.radius,
              logScale: false,
              opacity: data[i].configs.opacity || 0.7,
              color: 'none',
              stroke: data[i].configs.stroke || '#000000',
              strokeWidth: data[i].configs.strokeWidth || 1,
              tooltipContent: data[i].configs.tips
            });
            break;
          case 'scatter':
            circular = circular.scatter(data[i].name, fileData[i], {
              innerRadius: data[i].configs.innerRadius,
              outerRadius: data[i].configs.outerRadius,
              color: data[i].configs.color || '#000',
              strokeColor: data[i].configs.strokeColor || '#000',
              strokeWidth: data[i].configs.strokeWidth || 0,
              fillOpacity: data[i].configs.fillOpacity || 1,
              shape: 'circle',
              size: data[i].configs.size || 14,
              min: data[i].configs.min,
              max: data[i].configs.max,
              axes: data[i].configs.axes,
              backgrounds: data[i].configs.backgrounds,
              tooltipContent: data[i].configs.tips
            });
            break;
          case 'highlight':
            circular = circular.highlight(data[i].name, fileData[i], {
              innerRadius: data[i].configs.innerRadius,
              outerRadius: data[i].configs.outerRadius,
              opacity: data[i].configs.opacity || 0.6,
              // color: data[i].configs.color || function (d) {
              //    return gieStainColor[d.gieStain] || '#000'
              // },
              // color: '#000',
              strokeWidth: data[i].configs.strokeWidth || 0,
              strokeColor: data[i].configs.strokeColor || '#0xF4F4F4',
              color: function(d) {
                if (d.score === 0) {
                  return '#225AE3';
                }else {
                  console.log(d);
                  return '#FFC2BA';
                }
              },
              tooltipContent: data[i].configs.tips
            });
            break;
          case 'histogram':
            circular = circular.histogram(data[i].name, fileData[i], {
              innerRadius: data[i].configs.innerRadius,
              outerRadius: data[i].configs.outerRadius,
              color: data[i].configs.color || 'OrRd',
              direction: data[i].configs.direction || 'out',
              tooltipContent: data[i].configs.tips
            });
            break;
          case 'line':
            circular = circular.line(data[i].name, fileData[i], {
              innerRadius: data[i].configs.innerRadius,
              outerRadius: data[i].configs.outerRadius,
              maxSpace: data[i].configs.maxSpace || 1000000,
              min: data[i].configs.min,
              max: data[i].configs.max,
              color: data[i].configs.color || '#000',
              axes: data[i].configs.axes,
              backgrounds: data[i].configs.backgrounds,
              tooltipContent: data[i].configs.tips
            });
            break;
          case 'stack':
            circular = circular.stack(data[i].name, fileData[i], {
              innerRadius: data[i].configs.innerRadius,
              outerRadius: data[i].configs.outerRadius,
              thickness: data[i].configs.thickness || 1,
              margin: data[i].configs.margin,
              direction: data[i].configs.direction || 'out',
              strokeWidth: data[i].configs.strokeWidth,
              color: data[i].configs.color || '#000',
              tooltipContent: data[i].configs.tips
            });
            break;
        }
      })
      circular.render()
      layout.configs.completed && layout.configs.completed()
    }
    let queue = d3.queue()
    queue = queue.defer(d3[layout.fileType], layout.fileUrl)
    data.forEach(function (d) {
      queue = queue.defer(d3[d.fileType], d.fileUrl)
    })
    queue.await(drawCircos)

  }
}
function dataTransformForVep(inputArray,valueName){
  let outputArray = [];
  if(valueName === 'snv'){
    for(let j=0;j<inputArray.length;j++){
      let tempObj = {};
      if(inputArray[j].Location.indexOf('-') === -1){
        tempObj.block_id = 'chr' + inputArray[j].Location.slice(0,inputArray[j].Location.indexOf(':'));
        tempObj.position = +inputArray[j].Location.slice(inputArray[j].Location.indexOf(':')+1);
        tempObj.value = 0.005;
        tempObj.start = tempObj.position;
        tempObj.end = tempObj.position;
      }
      if(Object.keys(tempObj).length != 0){
        if(outputArray.length != 0){
          let k;
          for(k =0;k<outputArray.length;k++){
            if(tempObj.position == outputArray[k].position){break;}
          }
          if(k == outputArray.length){
            outputArray.push(tempObj);
          }
        }else{
          outputArray.push(tempObj);
        }
      }
    }
    console.log(outputArray);
    return outputArray;
  }else if(valueName === 'structual_variant'){
    for(let j=0;j<inputArray.length;j++){
      let tempObj = {};
      if(inputArray[j].Location.indexOf('-') != -1){
        tempObj.block_id = 'chr' + inputArray[j].Location.slice(0,inputArray[j].Location.indexOf(':'));
        tempObj.start = parseInt(inputArray[j].Location.slice(inputArray[j].Location.indexOf(':')+1,inputArray[j].Location.indexOf('-')));
        tempObj.end = parseInt(inputArray[j].Location.slice(inputArray[j].Location.indexOf('-')+1));
        tempObj.position = tempObj.start;
        tempObj.value = 0.03;
        outputArray.push(tempObj);
      }
    }
    console.log(outputArray);
    return outputArray;
  }else{
    for(let j=0;j<inputArray.length;j++){
      let tempObj = {};
      if(inputArray[j].MetaLR_rankscore != '-'){
        tempObj.block_id = 'chr'+inputArray[j].Location.slice(0,inputArray[j].Location.indexOf(':'));
        tempObj.position = +inputArray[j].Location.slice(inputArray[j].Location.indexOf(':')+1);
        tempObj.value = +inputArray[j][valueName];
        tempObj.start = tempObj.position - 100000;
        tempObj.end = tempObj.position + 100000;
      }
      if(Object.keys(tempObj).length != 0){
        if(outputArray.length != 0){
          let k;
          for(k =0;k<outputArray.length;k++){
            if(tempObj.position == outputArray[k].position){break;}
          }
          if(k == outputArray.length){
            outputArray.push(tempObj);
          }
        }else{
          outputArray.push(tempObj);
        }
      }
    }
  }
  return outputArray;
}