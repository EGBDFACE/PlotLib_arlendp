const d3 = Object.assign({}, require('d3-selection'), require('d3-zoom'), require('d3-scale'), require('d3-axis'), require('d3-format'), require('../lib/d3-svg2webgl'));
// deal with d3.event is null error
import {
  event as currentEvent
} from 'd3-selection';
import defaultConfigs from './config';
// draw iris chart
export function iris(data, configs) {
  console.log(this);
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
    .append('g');

  content.selectAll('circle')
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

// draw candleStick chart
export function candleStick(data, configs) {
  const options = Object.assign({}, defaultConfigs.base, defaultConfigs.candleStick, configs);
  const contentSize = options.contentSize;
  const margin = options.canvasMargin;
  const blockWidth = options.blockWidth;
  let x = d3.scaleTime().range([0, contentSize.w]);
  let y = d3.scaleLinear().range([contentSize.h, 0]);
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);
  const timeRange = options.range.x;
  const valueRange = options.range.y;
  const style = options.style;

  x.domain(timeRange.map(function (v, i) {
    const tmpDate = new Date(v);
    if (i === 0) {
      tmpDate.setDate(tmpDate.getDate() - 2);
    } else {
      tmpDate.setDate(tmpDate.getDate() + 2);
    }
    return tmpDate;
  }));
  y.domain(valueRange.map(function (v, i) {
    return i === 0 ? roundNumber(v, 10, false) : roundNumber(v, 10, true);
  }));

  const svg = d3.select(this.renderer.view)
    .toCanvas(this.renderer);
  options.zoom && svg.call(d3.zoom().on('zoom', zoomed));

  // clipPath
  // !important
  // pay attention that the clippath area is related to the ref element
  const clip = svg.append('defs')
    .append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', contentSize.w)
    .attr('height', contentSize.h);

  const container = svg.append('g')
    .attr('transform', 'translate(' + margin.h + ', ' + margin.v + ')');

  const cX = container.append('g')
    .attr('class', 'xAxis')
    .attr('transform', 'translate(0, ' + contentSize.h + ')')
    .call(xAxis);

  const cY = container.append('g')
    .attr('class', 'yAxis')
    .call(yAxis);

  const content = container.append('g')
    .attr('class', 'clipArea')
    .attr('clip-path', 'url(#clip)')
    .append('g')
    .attr('class', 'content');

  const blocks = content.selectAll('.block')
    .data(data)
    .enter()
    .append('path')
    .attr('d', function (d) {
      return getPath(d);
    })
    .style('stroke-width', function (d) {
      return d.strokeWidth || style.strokeWidth
    })
    .style('fill', function (d) {
      return d.fill || style.fill
    })
    .style('stroke', function (d) {
      return d.stroke || style.stroke
    });

  function zoomed() {
    content.attr('transform', currentEvent.transform);
    cX.call(xAxis.scale(currentEvent.transform.rescaleX(x)));
    cY.call(yAxis.scale(currentEvent.transform.rescaleY(y)));
  }

  function getPath(d) {
    const xCoor = x(new Date(d.date));
    return (
      'M ' + xCoor + ' ' + y(d.value[0]) + ' ' +
      'V ' + y(d.value[1]) + ' ' +
      'H ' + (xCoor - blockWidth / 2) + ' ' +
      'V ' + y(d.value[2]) + ' ' +
      'H ' + (xCoor + blockWidth / 2) + ' ' +
      'V ' + y(d.value[1]) + ' ' +
      'H ' + xCoor + ' ' +
      'M ' + xCoor + ' ' + y(d.value[2]) + ' ' +
      'V ' + y(d.value[3])
    )
  }
}

// draw occurrence chart
export function occurrence(data, configs) {
  const options = Object.assign({}, defaultConfigs.base, defaultConfigs.occurrence, configs);
  const xAxisLabel = options.range.x;
  const yAxisLabel = options.range.y;
  const unitSize = options.unitSize;
  const gap = options.gap;
  const contentSize = options.contentSize;
  const margin = options.canvasMargin;
  const svg = d3.select(this.renderer.view)
    .toCanvas(this.renderer)

  options.zoom && svg.call(d3.zoom().on('zoom', zoomed));
  // clips
  const defs = svg.append('defs');
  const clipContent = defs
    .append('clipPath')
    .attr('id', 'clip-content')
    .append('rect')
    .attr('width', contentSize.w)
    .attr('height', contentSize.h);
  const clipXAxis = defs
    .append('clipPath')
    .attr('id', 'clip-x-axis')
    .append('rect')
    .attr('width', contentSize.w)
    .attr('height', margin.v);
  const clipYAxis = defs
    .append('clipPath')
    .attr('id', 'clip-y-axis')
    .append('rect')
    .attr('width', margin.h)
    .attr('height', contentSize.h);
  // content
  const content = svg.append('g')
    .attr('class', 'content-wrapper')
    .attr('transform', 'translate(' + margin.h + ', ' + margin.v + ')')
    .attr('clip-path', 'url(#clip-content)')
    .append('g')
    .attr('class', 'content');
  // axis
  const xAxis = svg.append('g')
    .attr('class', 'xAxisSvg')
    .attr('transform', 'translate(' + margin.h + ', 0)')
    .attr('clip-path', 'url(#clip-x-axis)')
    .append('g')
    .attr('class', 'x-axis-wrapper axis-wrapper')
    .attr('transform', 'translate(0, ' + margin.v + ') rotate(-90)')
    .selectAll('text')
    .data(xAxisLabel)
    .enter()
    .append('text')
    .attr('class', 'x-axis')
    .attr('x', unitSize.w)
    .style('font-size', unitSize.w + 'px')
    .style('text-anchor', 'start')
    .text(function (d) {
      return d;
    })
    .attr('y', function (d, i) {
      return i * (unitSize.w + gap) + unitSize.w * 2 / 3;
    });;

  const yAxis = svg.append('g')
    .attr('class', 'yAxisSvg')
    .attr('transform', 'translate(0, ' + margin.v + ')')
    .attr('clip-path', 'url(#clip-y-axis)')
    .append('g')
    .attr('class', 'y-axis-wrapper axis-wrapper')
    .selectAll('text')
    .data(yAxisLabel)
    .enter()
    .append('text')
    .attr('class', 'y-axis')
    .attr('x', margin.h - unitSize.w)
    .style('text-anchor', 'end')
    .style('font-size', unitSize.h + 'px')
    .text(function (d) {
      return d;
    })
    .attr('y', function (d, i) {
      return i * (unitSize.h + gap) + unitSize.h * 2 / 3;
    });;

  content.selectAll('.block')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'block')
    .attr('x', function (d) {
      return d.y * (unitSize.w + gap);
    })
    .attr('y', function (d) {
      return d.x * (unitSize.h + gap);
    })
    .attr('width', unitSize.w)
    .attr('height', unitSize.h)
    .style('fill', function (d) {
      return d.color;
    })
  // .on('mouseenter', function (d) {
  //   d3.select('#container')
  //     .append('div')
  //     .attr('class', 'tip')
  //     .style('top', d3.event.clientY - 20 + 'px')
  //     .style('left', d3.event.clientX + 20 + 'px')
  //     .html(generateTip(d.names, d.count))
  // })
  // .on('mouseleave', function (d) {
  //   d3.select('.tip').remove();
  // });

  function generateTip(date, rate) {
    return '<ul>' +
      '<li><span class="title">names: </span>' + date + '</li>' +
      '<li><span class="title">count: </span>' + rate + '</li>' +
      '</ul>';
  }

  function zoomed() {
    content.attr('transform', currentEvent.transform);
    xAxis.attr('y', function (d, i) {
      return currentEvent.transform.x + (i * (unitSize.w + gap) + unitSize.w * 3 / 4) * currentEvent.transform.k - (currentEvent.transform.k - 1) * 3;
    })
    yAxis.attr('y', function (d, i) {
      return currentEvent.transform.y + (i * (unitSize.h + gap) + unitSize.h * 3 / 4) * currentEvent.transform.k - (currentEvent.transform.k - 1) * 3;
    })
  }
}

// draw boxplot
export function boxplot(data, configs) {
  const options = Object.assign({}, defaultConfigs.base, configs);
  const contentSize = options.contentSize;
  const margin = options.canvasMargin;
  const barWidth = options.barWidth;
  const ticks = options.ticks;
  let x = d3.scaleLinear().domain(options.range.x).range([0, contentSize.w]);
  let y = d3.scaleLinear().domain(options.range.y).range([contentSize.h, 0]);
  const xAxis = d3.axisBottom(x).tickValues(ticks.x.values).tickFormat(d3.format(ticks.x.format));
  const yAxis = d3.axisLeft(y);
  const style = options.style;
  // Setup the svg and group we will draw the box plot in
  const svg = d3.select(this.renderer.view)
    .toCanvas(this.renderer);

  options.zoom && svg.call(d3.zoom().on('zoom', zoomed));

  // add clipPath
  const defs = svg.append('defs');
  const clip = defs
    .append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', contentSize.w)
    .attr('height', contentSize.h);
  const xClip = defs.append('clipPath')
    .attr('id', 'x-clip')
    .append('rect')
    .attr('width', contentSize.w)
    .attr('height', margin.v);
  // add container
  const container = svg.append("g")
    .attr('clip-path', 'url(#clip)')
    .attr("transform", "translate(" + 35 + "," + margin.v + ")");
  // Move the left axis over 25 pixels, and the top axis over 35 pixels
  const axisG = svg.append("g").attr("transform", "translate(35, " + margin.v + ')');
  const axisTopG = svg.append("g").attr("transform", "translate(35, " + (contentSize.h + margin.v) + ')')
    .attr('clip-path', 'url(#x-clip)');

  // Setup the group the box plot elements will render in
  const g = container.append("g");

  // Draw the box plot vertical lines
  const verticalLines = g.selectAll(".verticalLines")
    .data(data)
    .enter()
    .append("line")
    .attr("x1", function (datum) {
      return x(datum.key);
    })
    .attr("y1", function (datum) {
      const whisker = datum.whiskers[0];
      return y(whisker);
    })
    .attr("x2", function (datum) {
      return x(datum.key);
    })
    .attr("y2", function (datum) {
      const whisker = datum.whiskers[1];
      return y(whisker);
    })
    .attr("stroke", style.stroke)
    .attr("stroke-width", style.strokeWidth)
    .attr("fill", "none");

  // Draw the boxes of the box plot, filled in white and on top of vertical lines
  const rects = g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("width", barWidth)
    .attr("height", function (datum) {
      const quartiles = datum.quartile;
      const height = y(quartiles[0]) - y(quartiles[2]);
      return height;
    })
    .attr("x", function (datum) {
      return x(datum.key) - barWidth / 2;
    })
    .attr("y", function (datum) {
      return y(datum.quartile[2]);
    })
    .attr("fill", function (datum) {
      return datum.color || style.fill;
    })
    .attr("stroke", style.stroke)
    .attr("stroke-width", style.strokeWidth);

  // Now render all the horizontal lines at once - the whiskers and the median
  const horizontalLineConfigs = [
    // Top whisker
    {
      x1: function (datum) {
        return x(datum.key) - barWidth / 2
      },
      y1: function (datum) {
        return y(datum.whiskers[0])
      },
      x2: function (datum) {
        return x(datum.key) + barWidth / 2;
      },
      y2: function (datum) {
        return y(datum.whiskers[0])
      }
    },
    // Median line
    {
      x1: function (datum) {
        return x(datum.key) - barWidth / 2
      },
      y1: function (datum) {
        return y(datum.quartile[1])
      },
      x2: function (datum) {
        return x(datum.key) + barWidth / 2
      },
      y2: function (datum) {
        return y(datum.quartile[1])
      }
    },
    // Bottom whisker
    {
      x1: function (datum) {
        return x(datum.key) - barWidth / 2
      },
      y1: function (datum) {
        return y(datum.whiskers[1])
      },
      x2: function (datum) {
        return x(datum.key) + barWidth / 2
      },
      y2: function (datum) {
        return y(datum.whiskers[1])
      }
    }
  ];

  for (let i = 0; i < horizontalLineConfigs.length; i++) {
    const lineConfig = horizontalLineConfigs[i];

    // Draw the whiskers at the min for this series
    const horizontalLine = g.selectAll(".whiskers")
      .data(data)
      .enter()
      .append("line")
      .attr("x1", lineConfig.x1)
      .attr("y1", lineConfig.y1)
      .attr("x2", lineConfig.x2)
      .attr("y2", lineConfig.y2)
      .attr("stroke", style.stroke)
      .attr("stroke-width", style.strokeWidth)
      .attr("fill", "none");
  }

  // Setup a scale on the left
  const cY = axisG.append("g")
    .call(yAxis);

  // Setup a series axis on the top
  const cX = axisTopG.append("g")
    .call(xAxis);

  function zoomed() {
    g.attr('transform', currentEvent.transform);
    cX.call(xAxis.scale(currentEvent.transform.rescaleX(x)));
    cY.call(yAxis.scale(currentEvent.transform.rescaleY(y)));
  }
}
