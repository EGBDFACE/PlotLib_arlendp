const d3 = Object.assign({}, require('d3-selection'), require('d3-zoom'), require('d3-scale'), require('d3-axis'), require('../lib/d3-svg2webgl'));
// deal with d3.event is null error
import {
  event as currentEvent
} from 'd3-selection';

import * as PIXI from 'pixi.js';

const defaultConfigs = {
  base: {
    canvasSize: {
      w: 800,
      h: 800
    },
    contentSize: {
      w: 600,
      h: 600
    },
    canvasMargin: {
      h: 100,
      v: 100
    },
    style: {
      strokeWidth: 1,
      stroke: '#000000',
      fill: '#000000',
      fillOpacity: 1
    }
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
      width: elem.width || defaultConfigs.base.canvasSize.w,
      height: elem.height || defaultConfigs.base.canvasSize.h,
      resolution: d3.resolution(),
      view: elem,
      backgroundColor: options.bgColor || 0xffffff,
      antialias: true
    });
    console.log(elem);
    this.renderer.view.style.width = elem.width / 2 + 'px';
    this.renderer.view.style.height = elem.height / 2 + 'px';
  }

  // draw iris chart
  iris(data, configs) {
    const options = Object.assign({}, defaultConfigs.base, configs);
    const margin = options.canvasMargin;
    const contentSize = options.contentSize;
    const range = options.range;

    const container = d3.select(this.renderer.view)
      .toCanvas(this.renderer);

    options.zoom && container.call(d3.zoom().on('zoom', zoom));

    const x = d3.scaleLinear()
      .domain(range.x)
      .range([0, contentSize.w]);

    const y = d3.scaleLinear()
      .domain(range.y)
      .range([contentSize.h, 0]);

    const clip = container.append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', contentSize.w)
      .attr('height', contentSize.h);

    const content = container.append('g')
      .classed('content', true)
      .attr('transform', 'translate(' + margin.h + ', ' + margin.v + ')')
      .attr('clip-path', 'url(#clip)')
      .attr('width', contentSize.w)
      .attr('height', contentSize.h)
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
      .style('stroke-width', function (d) {
        return d.strokeWidth || options.style.strokeWidth
      })
      .style('stroke', function (d) {
        return d.stroke || options.style.stroke;
      })
      .style('fill', function (d) {
        return d.fill || options.style.fill;
      })
      .style('fill-opacity', function (d) {
        return d.fillOpacity || options.style.fill;
      });

    const xAxis = d3.axisBottom(x).ticks(6);
    const yAxis = d3.axisLeft(y).ticks(6);

    const cX = container.append('g')
      .attr('transform', 'translate(' + margin.h + ', ' + (contentSize.h + margin.v) + ')')
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