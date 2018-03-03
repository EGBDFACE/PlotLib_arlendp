const d3 = Object.assign({}, require('d3-selection'), require('d3-zoom'), require('d3-scale'), require('d3-axis'), require('../lib/d3-svg2webgl'));
// deal with d3.event is null error
import {
  event as currentEvent
} from 'd3-selection';

import * as PIXI from 'pixi.js';

const defaultConfigs = {
  base: {
    canvasSize: {
      w: 1200,
      h: 800
    },
    canvasMargin: {
      h: 100,
      v: 100
    },
  },
  candleStick: {
    blockWidth: 10
  },
  occurrence: {
    unitSize: { // unit block size
      width: 8,
      height: 8
    },
    gap: 0 // gap between blocks
  },
  zoom: false
}

export default class Plot {
  constructor(elem, options) {
    this.renderer = new PIXI.autoDetectRenderer({
      width: elem.width,
      height: elem.height,
      view: elem,
      backgroundColor: options.bgColor || 0xffffff,
      antialias: true
    })
  }

  // draw iris chart
  iris(data, elem, configs) {
    const options = Object.assign({}, defaultConfigs.base, configs);
    const canvasSize = options.canvasSize;
    const margin = options.canvasMargin;
    const contentSize = {
      width: 600,
      height: 600
    };
    const range = options.range;

    const container = d3.select(this.renderer.view)
      .canvasResolution(d3.resolution())
      .canvas(true);
      
    options.zoom && container.call(d3.zoom().on('zoom', zoom));

    const x = d3.scaleLinear()
      .domain(range.x)
      .range([0, contentSize.width]);

    const y = d3.scaleLinear()
      .domain(range.y)
      .range([contentSize.height, 0]);

    const clip = container.append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', contentSize.width)
      .attr('height', contentSize.height);

    const content = container.append('g')
      .classed('content', true)
      .attr('transform', 'translate(' + margin.h + ', ' + margin.v + ')')
      .attr('clip-path', 'url(#clip)')
      .attr('width', contentSize.width)
      .attr('height', contentSize.height)
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', function (d) {
        return x(d.x);
      })
      .attr('cy', function (d) {
        return y(d.y);
      })
      .attr('r', function (d) {
        return d.r;
      })
      .style('stroke-width', 1)
      .style('stroke', function (d) {
        return d.color;
      })
      .style('fill', function (d) {
        return d.color;
      })
      .style('fill-opacity', 0.3);

    const xAxis = d3.axisBottom(x).ticks(6);
    const yAxis = d3.axisLeft(y).ticks(6);

    const cX = container.append('g')
      .attr('transform', 'translate(' + margin.h + ', ' + (contentSize.height + margin.v) + ')')
      .call(xAxis);
    const cY = container.append('g')
      .attr('transform', 'translate(' + margin.h + ', ' + margin.v + ')')
      .call(yAxis);

    function zoom() {
      content.attr('transform', currentEvent.transform);
      cX.call(xAxis.scale(currentEvent.transform.rescaleX(x)));
      cY.call(yAxis.scale(currentEvent.transform.rescaleY(y)));
    }
  }
}