var Plot = (function () {
'use strict';

exports.__esModule = true;
exports.loader = exports.prepare = exports.particles = exports.mesh = exports.loaders = exports.interaction = exports.filters = exports.extras = exports.extract = exports.accessibility = undefined;

var _polyfill = require('./polyfill');

Object.keys(_polyfill).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _polyfill[key];
        }
    });
});

var _core = require('./core');

Object.keys(_core).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _core[key];
        }
    });
});

var _deprecation = require('./deprecation');

var _deprecation2 = _interopRequireDefault(_deprecation);

var _accessibility = require('./accessibility');

var accessibility = _interopRequireWildcard(_accessibility);

var _extract = require('./extract');

var extract = _interopRequireWildcard(_extract);

var _extras = require('./extras');

var extras = _interopRequireWildcard(_extras);

var _filters = require('./filters');

var filters = _interopRequireWildcard(_filters);

var _interaction = require('./interaction');

var interaction = _interopRequireWildcard(_interaction);

var _loaders = require('./loaders');

var loaders = _interopRequireWildcard(_loaders);

var _mesh = require('./mesh');

var mesh = _interopRequireWildcard(_mesh);

var _particles = require('./particles');

var particles = _interopRequireWildcard(_particles);

var _prepare = require('./prepare');

var prepare = _interopRequireWildcard(_prepare);

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

// export core
_core.utils.mixins.performMixins();

/**
 * Alias for {@link PIXI.loaders.shared}.
 * @name loader
 * @memberof PIXI
 * @type {PIXI.loader.Loader}
 */

// handle mixins now, after all code has been added, including deprecation


// export libs
// import polyfills. Done as an export to make sure polyfills are imported first
var loader = loaders.shared || null;

exports.accessibility = accessibility;
exports.extract = extract;
exports.extras = extras;
exports.filters = filters;
exports.interaction = interaction;
exports.loaders = loaders;
exports.mesh = mesh;
exports.particles = particles;
exports.prepare = prepare;
exports.loader = loader;

// Apply the deprecations

if (typeof _deprecation2.default === 'function') {
    (0, _deprecation2.default)(exports);
}

// Always export PixiJS globally.
global.PIXI = exports; // eslint-disable-line

var circos = {
	gieStainColor: {
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
};

var base = {
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
	},
	zoom: false
};

var bokeh = {
	candleStick: {
		blockWidth: 10
	},
	occurrence: {
		unitSize: { // unit block size
			w: 12,
			h: 12
		},
		gap: 0 // gap between blocks
	}
};

var defaultConfigs = {
  base,
  bokeh,
  circos
};

class BaseRenderer {
  constructor(elem, options) {
    this.renderer = new undefined({
      width: elem.width || defaultConfigs.base.canvasSize.w,
      height: elem.height || defaultConfigs.base.canvasSize.h,
      resolution: options && options.resolution || window.devicePixelRatio,
      view: elem,
      backgroundColor: options && options.bgColor,
      antialias: true
    });
    this.renderer.view.style.width = elem.width / 2 + 'px';
    this.renderer.view.style.height = elem.height / 2 + 'px';
  }
}

if (typeof document !== "undefined") {
  var element = document.documentElement;
  if (!element.matches) {
    var vendorMatches = element.webkitMatchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector;
    
  }
}

var event$1 = null;

if (typeof document !== "undefined") {
  var element$1 = document.documentElement;
  
}

const degree = Math.PI / 180;


// degree to radian


// matrix








// fetch data


/**
 * 对数字按照指定取整
 * @param  {Number}  n      源数据
 * @param  {Number}  sn     指定整数
 * @param  {Boolean} isCeil 是否向上取整
 * @return {Number}         处理后的数据
 */
function roundNumber(n, sn, isCeil) {
  if (isCeil) {
    return (Math.floor(n / sn) + 1) * sn;
  } else {
    return Math.floor(n / sn) * sn;
  }
}

const d3$1 = Object.assign({}, require('d3-selection'), require('d3-zoom'), require('d3-scale'), require('d3-axis'), require('d3-format'), require('../Core/d3-SvgToWebgl'));
// deal with d3.event is null error
class ChartRenderer extends BaseRenderer {
  constructor(elem, options) {
    super(elem, options);
  }
  iris(data, configs) {
    const options = Object.assign({}, defaultConfigs.base, configs);
    const margin = options.canvasMargin;
    const contentSize = options.contentSize;
    const range = options.range;

    const container = d3$1.select(this.renderer.view).toCanvas(this.renderer);

    options.zoom && container.call(d3$1.zoom().on('zoom', zoom));

    const x = d3$1.scaleLinear().domain(range.x).range([0, contentSize.w]);

    const y = d3$1.scaleLinear().domain(range.y).range([contentSize.h, 0]);

    const clip = container.append('defs').append('clipPath').attr('id', 'clip').append('rect').attr('width', contentSize.w).attr('height', contentSize.h);
    // x axis clip
    container.append('defs').append('clipPath').attr('id', 'clipX').append('rect').attr('x', -5).attr('width', contentSize.w + 10).attr('height', margin.v);
    // y axis clip
    container.append('defs').append('clipPath').attr('id', 'clipY').append('rect').attr('x', -margin.h).attr('y', -5).attr('width', margin.h + 1).attr('height', contentSize.h + 10);

    const content = container.append('g').classed('content', true).attr('transform', 'translate(' + margin.h + ', ' + margin.v + ')').attr('clip-path', 'url(#clip)').append('g');

    content.selectAll('circle').data(data).enter().append('circle').attr('cx', function (d) {
      return x(d.x);
    }).attr('cy', function (d) {
      return y(d.y);
    }).attr('r', function (d) {
      return d.r;
    }).style('stroke-width', function (d) {
      return d.strokeWidth || options.style.strokeWidth;
    }).style('stroke', function (d) {
      return d.stroke || options.style.stroke;
    }).style('fill', function (d) {
      return d.fill || options.style.fill;
    }).style('fill-opacity', function (d) {
      return d.fillOpacity || options.style.fill;
    });

    const xAxis = d3$1.axisBottom(x).ticks(6);
    const yAxis = d3$1.axisLeft(y).ticks(6);

    const cX = container.append('g').attr('transform', 'translate(' + margin.h + ', ' + (contentSize.h + margin.v) + ')').attr('clip-path', 'url(#clipX)').call(xAxis);
    const cY = container.append('g').attr('transform', 'translate(' + margin.h + ', ' + margin.v + ')').attr('clip-path', 'url(#clipY)').call(yAxis);

    var rootNode = content.node().rootNode;

    function zoom() {
      var node = content.node().glElem;
      // var xPath = cX.select('path.domain').node().glElem;
      var xTicks = cX.selectAll('g.tick')._groups[0].map(function (d) {
        return d.glElem;
      });
      var yTicks = cY.selectAll('g.tick')._groups[0].map(function (d) {
        return d.glElem;
      });
      // console.log(xPath, xTicks)
      var transform = event$1.transform;
      xTicks.forEach(function (d) {
        if (!d.oriPos) {
          d.oriPos = {
            x: d.position.x,
            y: d.position.y
          };
        }
        d.position.x = d.oriPos.x * transform.k + transform.x;
      });
      yTicks.forEach(function (d) {
        if (!d.oriPos) {
          d.oriPos = {
            x: d.position.x,
            y: d.position.y
          };
        }
        d.position.y = d.oriPos.y * transform.k + transform.y;
      });
      node.scale.x = transform.k;
      node.scale.y = transform.k;
      node.position.x = transform.x;
      node.position.y = transform.y;
      rootNode.renderer.render(rootNode.stage);
      // content.attr('transform', currentEvent.transform);
      // cX.call(xAxis.scale(currentEvent.transform.rescaleX(x)));
      // cY.call(yAxis.scale(currentEvent.transform.rescaleY(y)));
    }
  }

  // draw candleStick chart
  candleStick(data, configs) {
    const options = Object.assign({}, defaultConfigs.base, defaultConfigs.bokeh.candleStick, configs);
    const contentSize = options.contentSize;
    const margin = options.canvasMargin;
    const blockWidth = options.blockWidth;
    let x = d3$1.scaleTime().range([0, contentSize.w]);
    let y = d3$1.scaleLinear().range([contentSize.h, 0]);
    const xAxis = d3$1.axisBottom(x);
    const yAxis = d3$1.axisLeft(y);
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

    const svg = d3$1.select(this.renderer.view).toCanvas(this.renderer);
    options.zoom && svg.call(d3$1.zoom().on('zoom', zoomed));

    // clipPath
    // !important
    // pay attention that the clippath area is related to the ref element
    const clip = svg.append('defs').append('clipPath').attr('id', 'clip').append('rect').attr('width', contentSize.w).attr('height', contentSize.h);

    // x axis clip
    svg.append('defs').append('clipPath').attr('id', 'clipX').append('rect').attr('x', -5).attr('width', contentSize.w + 10).attr('height', margin.v);
    // y axis clip
    svg.append('defs').append('clipPath').attr('id', 'clipY').append('rect').attr('x', -margin.h).attr('y', -5).attr('width', margin.h + 1).attr('height', contentSize.h + 10);

    const container = svg.append('g').attr('transform', 'translate(' + margin.h + ', ' + margin.v + ')');

    const cX = container.append('g').attr('class', 'xAxis').attr('transform', 'translate(0, ' + contentSize.h + ')').attr('clip-path', 'url(#clipX)').call(xAxis);

    const cY = container.append('g').attr('class', 'yAxis').attr('clip-path', 'url(#clipY)').call(yAxis);

    const content = container.append('g').attr('class', 'clipArea').attr('clip-path', 'url(#clip)').append('g').attr('class', 'content');

    const blocks = content.selectAll('.block').data(data).enter().append('path').attr('d', function (d) {
      return getPath(d);
    }).style('stroke-width', function (d) {
      return d.strokeWidth || style.strokeWidth;
    }).style('fill', function (d) {
      return d.fill || style.fill;
    }).style('stroke', function (d) {
      return d.stroke || style.stroke;
    });
    var rootNode = content.node().rootNode;
    function zoomed() {
      var node = content.node().glElem;
      // var xPath = cX.select('path.domain').node().glElem;
      var xTicks = cX.selectAll('g.tick')._groups[0].map(function (d) {
        return d.glElem;
      });
      var yTicks = cY.selectAll('g.tick')._groups[0].map(function (d) {
        return d.glElem;
      });
      // console.log(xPath, xTicks)
      var transform = event$1.transform;
      xTicks.forEach(function (d) {
        if (!d.oriPos) {
          d.oriPos = {
            x: d.position.x,
            y: d.position.y
          };
        }
        d.position.x = d.oriPos.x * transform.k + transform.x;
      });
      yTicks.forEach(function (d) {
        if (!d.oriPos) {
          d.oriPos = {
            x: d.position.x,
            y: d.position.y
          };
        }
        d.position.y = d.oriPos.y * transform.k + transform.y;
      });
      node.scale.x = transform.k;
      node.scale.y = transform.k;
      node.position.x = transform.x;
      node.position.y = transform.y;
      rootNode.renderer.render(rootNode.stage);
      // content.attr('transform', currentEvent.transform);
      // cX.call(xAxis.scale(currentEvent.transform.rescaleX(x)));
      // cY.call(yAxis.scale(currentEvent.transform.rescaleY(y)));
    }

    function getPath(d) {
      const xCoor = x(new Date(d.x));
      return 'M ' + xCoor + ' ' + y(d.value[0]) + ' ' + 'V ' + y(d.value[1]) + ' ' + 'H ' + (xCoor - blockWidth / 2) + ' ' + 'V ' + y(d.value[2]) + ' ' + 'H ' + (xCoor + blockWidth / 2) + ' ' + 'V ' + y(d.value[1]) + ' ' + 'H ' + xCoor + ' ' + 'M ' + xCoor + ' ' + y(d.value[2]) + ' ' + 'V ' + y(d.value[3]);
    }
  }

  // draw occurrence chart
  occurrence(data, configs) {
    const options = Object.assign({}, defaultConfigs.base, defaultConfigs.bokeh.occurrence, configs);
    const xAxisLabel = options.range.x;
    const yAxisLabel = options.range.y;
    const unitSize = options.unitSize;
    const gap = options.gap;
    const contentSize = options.contentSize;
    const margin = options.canvasMargin;
    const style = options.style;
    const svg = d3$1.select(this.renderer.view).toCanvas(this.renderer);

    options.zoom && svg.call(d3$1.zoom().on('zoom', zoomed));
    // clips
    const defs = svg.append('defs');
    const clipContent = defs.append('clipPath').attr('id', 'clip-content').append('rect').attr('width', contentSize.w).attr('height', contentSize.h);
    const clipXAxis = defs.append('clipPath').attr('id', 'clip-x-axis').append('rect').attr('width', contentSize.w).attr('height', margin.v);
    const clipYAxis = defs.append('clipPath').attr('id', 'clip-y-axis').append('rect').attr('width', margin.h).attr('height', contentSize.h);
    // content
    const content = svg.append('g').attr('class', 'content-wrapper').attr('transform', 'translate(' + margin.h + ', ' + margin.v + ')').attr('clip-path', 'url(#clip-content)').append('g').attr('class', 'content');
    // axis
    const xAxis = svg.append('g').attr('class', 'xAxisSvg').attr('transform', 'translate(' + margin.h + ', 0)').attr('clip-path', 'url(#clip-x-axis)').append('g').attr('class', 'x-axis-wrapper axis-wrapper').attr('transform', 'translate(0, ' + margin.v + ') rotate(-90)').selectAll('text').data(xAxisLabel).enter().append('text').attr('class', 'x-axis').attr('x', unitSize.w).style('font-size', unitSize.w + 'px').style('text-anchor', 'start').text(function (d) {
      return d;
    }).attr('y', function (d, i) {
      return i * (unitSize.w + gap) + unitSize.w * 2 / 3;
    });

    const yAxis = svg.append('g').attr('class', 'yAxisSvg').attr('transform', 'translate(0, ' + margin.v + ')').attr('clip-path', 'url(#clip-y-axis)').append('g').attr('class', 'y-axis-wrapper axis-wrapper').selectAll('text').data(yAxisLabel).enter().append('text').attr('class', 'y-axis').attr('x', margin.h - unitSize.w).style('text-anchor', 'end').style('font-size', unitSize.h + 'px').text(function (d) {
      return d;
    }).attr('y', function (d, i) {
      return i * (unitSize.h + gap) + unitSize.h * 2 / 3;
    });
    const tips = d3$1.select('body').append('div').attr('class', 'tip').style('opacity', 0).style('position', 'absolute').style('text-align', 'center').style('padding', '5px 10px').style('background-color', '#111111').style('color', 'white').style('border-radius', '5px').style('pointer-events', 'none').style('z-index', 9999);

    content.selectAll('.block').data(data).enter().append('rect').attr('class', 'block').attr('x', function (d) {
      return d.y * (unitSize.w + gap);
    }).attr('y', function (d) {
      return d.x * (unitSize.h + gap);
    }).attr('width', unitSize.w).attr('height', unitSize.h).style('fill', function (d) {
      return d.color || style.fill;
    }).on('mouseover', function (d) {
      tips.style('opacity', 0.9).style('top', event$1.data.originalEvent.clientY - 40 + 'px').style('left', event$1.data.originalEvent.clientX + 'px').html(d.label);
    }).on('mouseout', function (d) {
      tips.style('opacity', 0);
    });

    // function generateTip(date, rate) {
    //   return '<ul>' +
    //     '<li><span class="title">names: </span>' + date + '</li>' +
    //     '<li><span class="title">count: </span>' + rate + '</li>' +
    //     '</ul>';
    // }
    var rootNode = content.node().rootNode;
    function zoomed() {
      var node = content.node().glElem;
      var xTicks = xAxis._groups[0].map(function (d) {
        return d.glElem;
      });
      var yTicks = yAxis._groups[0].map(function (d) {
        return d.glElem;
      });
      var transform = event$1.transform;
      xTicks.forEach(function (d) {
        if (!d.oriPos) {
          d.oriPos = {
            x: d.position.x,
            y: d.position.y
          };
        }
        d.position.y = d.oriPos.y * transform.k + transform.x;
      });
      yTicks.forEach(function (d) {
        if (!d.oriPos) {
          d.oriPos = {
            x: d.position.x,
            y: d.position.y
          };
        }
        d.position.y = d.oriPos.y * transform.k + transform.y;
      });
      node.scale.x = transform.k;
      node.scale.y = transform.k;
      node.position.x = transform.x;
      node.position.y = transform.y;
      rootNode.renderer.render(rootNode.stage);
      // content.attr('transform', currentEvent.transform);
      // xAxis.attr('y', function (d, i) {
      //   return currentEvent.transform.x + (i * (unitSize.w + gap) + unitSize.w * 3 / 4) * currentEvent.transform.k - (currentEvent.transform.k - 1) * 3;
      // })
      // yAxis.attr('y', function (d, i) {
      //   return currentEvent.transform.y + (i * (unitSize.h + gap) + unitSize.h * 3 / 4) * currentEvent.transform.k - (currentEvent.transform.k - 1) * 3;
      // })
    }
  }

  // draw boxplot
  boxplot(data, configs) {
    const options = Object.assign({}, defaultConfigs.base, configs);
    const contentSize = options.contentSize;
    const margin = options.canvasMargin;
    const barWidth = options.barWidth;
    const ticks = options.ticks;
    let x = d3$1.scaleLinear().domain(options.range.x).range([0, contentSize.w]);
    let y = d3$1.scaleLinear().domain(options.range.y).range([contentSize.h, 0]);
    const xAxis = d3$1.axisBottom(x).tickValues(ticks.x.values).tickFormat(d3$1.format(ticks.x.format));
    const yAxis = d3$1.axisLeft(y);
    const style = options.style;
    // Setup the svg and group we will draw the box plot in
    const svg = d3$1.select(this.renderer.view).toCanvas(this.renderer);

    options.zoom && svg.call(d3$1.zoom().on('zoom', zoomed));

    // add clipPath
    const defs = svg.append('defs');
    const clip = defs.append('clipPath').attr('id', 'clip').append('rect').attr('width', contentSize.w).attr('height', contentSize.h);
    // x axis clip
    defs.append('clipPath').attr('id', 'clipX').append('rect').attr('x', -5).attr('width', contentSize.w + 10).attr('height', margin.v);
    // y axis clip
    defs.append('clipPath').attr('id', 'clipY').append('rect').attr('x', -margin.h).attr('y', -5).attr('width', margin.h + 1).attr('height', contentSize.h + 10);
    // const xClip = defs.append('clipPath')
    //   .attr('id', 'x-clip')
    //   .append('rect')
    //   .attr('width', contentSize.w)
    //   .attr('height', margin.v);
    // add container
    const container = svg.append("g").attr('clip-path', 'url(#clip)').attr("transform", "translate(" + margin.h + "," + margin.v + ")");
    // Move the left axis over 25 pixels, and the top axis over 35 pixels
    const axisG = svg.append("g").attr("transform", "translate(" + margin.h + ',' + margin.v + ')').attr('clip-path', 'url(#clipY)');
    const axisTopG = svg.append("g").attr("transform", "translate(" + margin.h + ',' + (contentSize.h + margin.v) + ')').attr('clip-path', 'url(#clipX)');

    // Setup the group the box plot elements will render in
    const g = container.append("g");

    // Draw the box plot vertical lines
    const verticalLines = g.selectAll(".verticalLines").data(data).enter().append("line").attr("x1", function (datum) {
      return x(datum.key);
    }).attr("y1", function (datum) {
      const whisker = datum.whiskers[0];
      return y(whisker);
    }).attr("x2", function (datum) {
      return x(datum.key);
    }).attr("y2", function (datum) {
      const whisker = datum.whiskers[1];
      return y(whisker);
    }).attr("stroke", style.stroke).attr("stroke-width", style.strokeWidth).attr("fill", "none");

    // Draw the boxes of the box plot, filled in white and on top of vertical lines
    const rects = g.selectAll("rect").data(data).enter().append("rect").attr("width", barWidth).attr("height", function (datum) {
      const quartiles = datum.quartile;
      const height = y(quartiles[0]) - y(quartiles[2]);
      return height;
    }).attr("x", function (datum) {
      return x(datum.key) - barWidth / 2;
    }).attr("y", function (datum) {
      return y(datum.quartile[2]);
    }).attr("fill", function (datum) {
      return datum.color || style.fill;
    }).attr("stroke", style.stroke).attr("stroke-width", style.strokeWidth);

    // Now render all the horizontal lines at once - the whiskers and the median
    const horizontalLineConfigs = [
    // Top whisker
    {
      x1: function (datum) {
        return x(datum.key) - barWidth / 2;
      },
      y1: function (datum) {
        return y(datum.whiskers[0]);
      },
      x2: function (datum) {
        return x(datum.key) + barWidth / 2;
      },
      y2: function (datum) {
        return y(datum.whiskers[0]);
      }
    },
    // Median line
    {
      x1: function (datum) {
        return x(datum.key) - barWidth / 2;
      },
      y1: function (datum) {
        return y(datum.quartile[1]);
      },
      x2: function (datum) {
        return x(datum.key) + barWidth / 2;
      },
      y2: function (datum) {
        return y(datum.quartile[1]);
      }
    },
    // Bottom whisker
    {
      x1: function (datum) {
        return x(datum.key) - barWidth / 2;
      },
      y1: function (datum) {
        return y(datum.whiskers[1]);
      },
      x2: function (datum) {
        return x(datum.key) + barWidth / 2;
      },
      y2: function (datum) {
        return y(datum.whiskers[1]);
      }
    }];

    for (let i = 0; i < horizontalLineConfigs.length; i++) {
      const lineConfig = horizontalLineConfigs[i];

      // Draw the whiskers at the min for this series
      const horizontalLine = g.selectAll(".whiskers").data(data).enter().append("line").attr("x1", lineConfig.x1).attr("y1", lineConfig.y1).attr("x2", lineConfig.x2).attr("y2", lineConfig.y2).attr("stroke", style.stroke).attr("stroke-width", style.strokeWidth).attr("fill", "none");
    }

    // Setup a scale on the left
    const cY = axisG.append("g").call(yAxis);

    // Setup a series axis on the top
    const cX = axisTopG.append("g").call(xAxis);

    // function zoomed() {
    //   g.attr('transform', currentEvent.transform);
    //   cX.call(xAxis.scale(currentEvent.transform.rescaleX(x)));
    //   cY.call(yAxis.scale(currentEvent.transform.rescaleY(y)));
    // }
    var rootNode = g.node().rootNode;

    function zoomed() {
      var node = g.node().glElem;
      // var xPath = cX.select('path.domain').node().glElem;
      var xTicks = cX.selectAll('g.tick')._groups[0].map(function (d) {
        return d.glElem;
      });
      var yTicks = cY.selectAll('g.tick')._groups[0].map(function (d) {
        return d.glElem;
      });
      // console.log(xPath, xTicks)
      var transform = event$1.transform;
      xTicks.forEach(function (d) {
        if (!d.oriPos) {
          d.oriPos = {
            x: d.position.x,
            y: d.position.y
          };
        }
        d.position.x = d.oriPos.x * transform.k + transform.x;
      });
      yTicks.forEach(function (d) {
        if (!d.oriPos) {
          d.oriPos = {
            x: d.position.x,
            y: d.position.y
          };
        }
        d.position.y = d.oriPos.y * transform.k + transform.y;
      });
      node.scale.x = transform.k;
      node.scale.y = transform.k;
      node.position.x = transform.x;
      node.position.y = transform.y;
      rootNode.renderer.render(rootNode.stage);
      // content.attr('transform', currentEvent.transform);
      // cX.call(xAxis.scale(currentEvent.transform.rescaleX(x)));
      // cY.call(yAxis.scale(currentEvent.transform.rescaleY(y)));
    }
  }
}

var defaultConf$1 = {
  innerRadius: 250,
  outerRadius: 300,
  cornerRadius: 0,
  gap: 0.04, // in radian
  opacity: 1,
  labels: {
    position: 'center',
    display: true,
    size: 14,
    color: '#000',
    radialOffset: 20
  },
  ticks: {
    display: true,
    color: 'grey',
    spacing: 10000000,
    labels: true,
    labelSpacing: 10,
    labelSuffix: '',
    labelDenominator: 1,
    labelDisplay0: true,
    labelSize: 10,
    labelColor: '#000',
    labelFont: 'default',
    majorSpacing: 5,
    size: {
      minor: 2,
      major: 5
    }
  },
  onClick: null,
  onMouseOver: null,
  events: {},
  zIndex: 100
};

const cloneDeep = require('lodash/cloneDeep');
const defaultsDeep$1 = require('lodash/defaultsDeep');
const reduce = require('lodash/reduce');
const forEach$1 = require('lodash/forEach');
const logger = console;

class Layout {
  constructor(conf, data) {
    if (!data) {
      logger.log(2, 'no layout data', '');
    }

    this.conf = defaultsDeep$1(conf, cloneDeep(defaultConf$1));
    this.data = data;
    const agg = reduce(data, (aggregator, block) => {
      block.offset = aggregator.offset;
      aggregator.blocks[block.id] = {
        label: block.label,
        len: block.len,
        color: block.color,
        offset: aggregator.offset
      };
      aggregator.offset += block.len;
      return aggregator;
    }, { blocks: {}, offset: 0 });
    this.blocks = agg.blocks;
    this.size = agg.offset;

    // thanks to sum of blocks' length, compute start and end angles in radian
    forEach$1(this.data, (block, index) => {
      this.blocks[block.id].start = block.offset / this.size * (2 * Math.PI - this.data.length * this.conf.gap) + index * this.conf.gap;

      this.blocks[block.id].end = (block.offset + block.len) / this.size * (2 * Math.PI - this.data.length * this.conf.gap) + index * this.conf.gap;

      block.start = block.offset / this.size * (2 * Math.PI - this.data.length * this.conf.gap) + index * this.conf.gap;

      block.end = (block.offset + block.len) / this.size * (2 * Math.PI - this.data.length * this.conf.gap) + index * this.conf.gap;
    });
  }

  getAngle(blockId, unit) {
    const position = this.blocks[blockId].start / this.size;
    if (unit === 'deg') {
      return angle * 360;
    }

    if (unit === 'rad') {
      return position * 2 * Math.PI;
    }

    return null;
  }

  summary() {
    return reduce(this.data, (summary, block) => {
      summary[block.id] = block.len;
      return summary;
    }, {});
  }
}

var pi = Math.PI;
var tau = 2 * pi;
var epsilon = 1e-6;
var tauEpsilon = tau - epsilon;

function Path() {
  this._x0 = this._y0 = // start of current subpath
  this._x1 = this._y1 = null; // end of current subpath
  this._ = "";
}

function path() {
  return new Path();
}

Path.prototype = path.prototype = {
  constructor: Path,
  moveTo: function (x, y) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
  },
  closePath: function () {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._ += "Z";
    }
  },
  lineTo: function (x, y) {
    this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  quadraticCurveTo: function (x1, y1, x, y) {
    this._ += "Q" + +x1 + "," + +y1 + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  bezierCurveTo: function (x1, y1, x2, y2, x, y) {
    this._ += "C" + +x1 + "," + +y1 + "," + +x2 + "," + +y2 + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  arcTo: function (x1, y1, x2, y2, r) {
    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
    var x0 = this._x1,
        y0 = this._y1,
        x21 = x2 - x1,
        y21 = y2 - y1,
        x01 = x0 - x1,
        y01 = y0 - y1,
        l01_2 = x01 * x01 + y01 * y01;

    // Is the radius negative? Error.
    if (r < 0) throw new Error("negative radius: " + r);

    // Is this path empty? Move to (x1,y1).
    if (this._x1 === null) {
      this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
    }

    // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
    else if (!(l01_2 > epsilon)) {}

      // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
      // Equivalently, is (x1,y1) coincident with (x2,y2)?
      // Or, is the radius zero? Line to (x1,y1).
      else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
          this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
        }

        // Otherwise, draw an arc!
        else {
            var x20 = x2 - x0,
                y20 = y2 - y0,
                l21_2 = x21 * x21 + y21 * y21,
                l20_2 = x20 * x20 + y20 * y20,
                l21 = Math.sqrt(l21_2),
                l01 = Math.sqrt(l01_2),
                l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
                t01 = l / l01,
                t21 = l / l21;

            // If the start tangent is not coincident with (x0,y0), line to.
            if (Math.abs(t01 - 1) > epsilon) {
              this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
            }

            this._ += "A" + r + "," + r + ",0,0," + +(y01 * x20 > x01 * y20) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
          }
  },
  arc: function (x, y, r, a0, a1, ccw) {
    var hasArc = false;
    x = +x, y = +y, r = +r;
    var dx = r * Math.cos(a0),
        dy = r * Math.sin(a0),
        x0 = x + dx,
        y0 = y + dy,
        cw = 1 ^ ccw,
        da = ccw ? a0 - a1 : a1 - a0;

    // Is the radius negative? Error.
    if (r < 0) throw new Error("negative radius: " + r);

    // Is this path empty? Move to (x0,y0).
    if (this._x1 === null) {
      this._ += "M" + x0 + "," + y0;
    }

    // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
    else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
        this._ += "L" + x0 + "," + y0;
      }

    // Is this arc empty? We’re done.
    if (!r) return;

    // Does the angle go the wrong way? Flip the direction.
    if (da < 0) da = da % tau + tau;

    // Is this a complete circle? Draw two arcs to complete the circle.
    if (da > tauEpsilon) {
      hasArc = true;
      this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
    }

    // Is this arc non-empty? Draw an arc!
    else if (da > epsilon) {
        hasArc = true;
        this._ += "A" + r + "," + r + ",0," + +(da >= pi) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
      }
    return hasArc;
  },
  rect: function (x, y, w, h) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + +w + "v" + +h + "h" + -w + "Z";
  },
  toString: function () {
    return this._;
  }
};

var constant$1 = function (x) {
  return function constant() {
    return x;
  };
};

var abs = Math.abs;
var atan2 = Math.atan2;
var cos = Math.cos;
var max = Math.max;
var min = Math.min;
var sin = Math.sin;
var sqrt = Math.sqrt;

var epsilon$1 = 1e-12;
var pi$1 = Math.PI;
var halfPi = pi$1 / 2;
var tau$1 = 2 * pi$1;

function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi$1 : Math.acos(x);
}

function asin(x) {
  return x >= 1 ? halfPi : x <= -1 ? -halfPi : Math.asin(x);
}

function arcInnerRadius(d) {
  return d.innerRadius;
}

function arcOuterRadius(d) {
  return d.outerRadius;
}

function arcStartAngle(d) {
  return d.startAngle;
}

function arcEndAngle(d) {
  return d.endAngle;
}

function arcPadAngle(d) {
  return d && d.padAngle; // Note: optional!
}

function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
  var x10 = x1 - x0,
      y10 = y1 - y0,
      x32 = x3 - x2,
      y32 = y3 - y2,
      t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / (y32 * x10 - x32 * y10);
  return [x0 + t * x10, y0 + t * y10];
}

// Compute perpendicular offset line of length rc.
// http://mathworld.wolfram.com/Circle-LineIntersection.html
function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
  var x01 = x0 - x1,
      y01 = y0 - y1,
      lo = (cw ? rc : -rc) / sqrt(x01 * x01 + y01 * y01),
      ox = lo * y01,
      oy = -lo * x01,
      x11 = x0 + ox,
      y11 = y0 + oy,
      x10 = x1 + ox,
      y10 = y1 + oy,
      x00 = (x11 + x10) / 2,
      y00 = (y11 + y10) / 2,
      dx = x10 - x11,
      dy = y10 - y11,
      d2 = dx * dx + dy * dy,
      r = r1 - rc,
      D = x11 * y10 - x10 * y11,
      d = (dy < 0 ? -1 : 1) * sqrt(max(0, r * r * d2 - D * D)),
      cx0 = (D * dy - dx * d) / d2,
      cy0 = (-D * dx - dy * d) / d2,
      cx1 = (D * dy + dx * d) / d2,
      cy1 = (-D * dx + dy * d) / d2,
      dx0 = cx0 - x00,
      dy0 = cy0 - y00,
      dx1 = cx1 - x00,
      dy1 = cy1 - y00;

  // Pick the closer of the two intersection points.
  // TODO Is there a faster way to determine which intersection to use?
  if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;

  return {
    cx: cx0,
    cy: cy0,
    x01: -ox,
    y01: -oy,
    x11: cx0 * (r1 / r - 1),
    y11: cy0 * (r1 / r - 1)
  };
}

var arc = function () {
  var innerRadius = arcInnerRadius,
      outerRadius = arcOuterRadius,
      cornerRadius = constant$1(0),
      padRadius = null,
      startAngle = arcStartAngle,
      endAngle = arcEndAngle,
      padAngle = arcPadAngle,
      context = null;

  function arc() {
    var buffer,
        r,
        r0 = +innerRadius.apply(this, arguments),
        r1 = +outerRadius.apply(this, arguments),
        a0 = startAngle.apply(this, arguments) - halfPi,
        a1 = endAngle.apply(this, arguments) - halfPi,
        da = abs(a1 - a0),
        cw = a1 > a0;

    if (!context) context = buffer = path();

    // Ensure that the outer radius is always larger than the inner radius.
    if (r1 < r0) r = r1, r1 = r0, r0 = r;

    // Is it a point?
    if (!(r1 > epsilon$1)) context.moveTo(0, 0);

    // Or is it a circle or annulus?
    else if (da > tau$1 - epsilon$1) {
        context.moveTo(r1 * cos(a0), r1 * sin(a0));
        context.arc(0, 0, r1, a0, a1, !cw);
        if (r0 > epsilon$1) {
          context.moveTo(r0 * cos(a1), r0 * sin(a1));
          context.arc(0, 0, r0, a1, a0, cw);
        }
      }

      // Or is it a circular or annular sector?
      else {
          var a01 = a0,
              a11 = a1,
              a00 = a0,
              a10 = a1,
              da0 = da,
              da1 = da,
              ap = padAngle.apply(this, arguments) / 2,
              rp = ap > epsilon$1 && (padRadius ? +padRadius.apply(this, arguments) : sqrt(r0 * r0 + r1 * r1)),
              rc = min(abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments)),
              rc0 = rc,
              rc1 = rc,
              t0,
              t1;

          // Apply padding? Note that since r1 ≥ r0, da1 ≥ da0.
          if (rp > epsilon$1) {
            var p0 = asin(rp / r0 * sin(ap)),
                p1 = asin(rp / r1 * sin(ap));
            if ((da0 -= p0 * 2) > epsilon$1) p0 *= cw ? 1 : -1, a00 += p0, a10 -= p0;else da0 = 0, a00 = a10 = (a0 + a1) / 2;
            if ((da1 -= p1 * 2) > epsilon$1) p1 *= cw ? 1 : -1, a01 += p1, a11 -= p1;else da1 = 0, a01 = a11 = (a0 + a1) / 2;
          }

          var x01 = r1 * cos(a01),
              y01 = r1 * sin(a01),
              x10 = r0 * cos(a10),
              y10 = r0 * sin(a10);

          // Apply rounded corners?
          if (rc > epsilon$1) {
            var x11 = r1 * cos(a11),
                y11 = r1 * sin(a11),
                x00 = r0 * cos(a00),
                y00 = r0 * sin(a00);

            // Restrict the corner radius according to the sector angle.
            if (da < pi$1) {
              var oc = da0 > epsilon$1 ? intersect(x01, y01, x00, y00, x11, y11, x10, y10) : [x10, y10],
                  ax = x01 - oc[0],
                  ay = y01 - oc[1],
                  bx = x11 - oc[0],
                  by = y11 - oc[1],
                  kc = 1 / sin(acos((ax * bx + ay * by) / (sqrt(ax * ax + ay * ay) * sqrt(bx * bx + by * by))) / 2),
                  lc = sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
              rc0 = min(rc, (r0 - lc) / (kc - 1));
              rc1 = min(rc, (r1 - lc) / (kc + 1));
            }
          }

          // Is the sector collapsed to a line?
          if (!(da1 > epsilon$1)) context.moveTo(x01, y01);

          // Does the sector’s outer ring have rounded corners?
          else if (rc1 > epsilon$1) {
              t0 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
              t1 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);

              context.moveTo(t0.cx + t0.x01, t0.cy + t0.y01);

              // Have the corners merged?
              if (rc1 < rc) context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);

              // Otherwise, draw the two corners and the ring.
              else {
                  context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
                  context.arc(0, 0, r1, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), !cw);
                  context.arc(t1.cx, t1.cy, rc1, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
                }
            }

            // Or is the outer ring just a circular arc?
            else context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw);

          // Is there no inner ring, and it’s a circular sector?
          // Or perhaps it’s an annular sector collapsed due to padding?
          if (!(r0 > epsilon$1) || !(da0 > epsilon$1)) context.lineTo(x10, y10);

          // Does the sector’s inner ring (or point) have rounded corners?
          else if (rc0 > epsilon$1) {
              t0 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
              t1 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);

              context.lineTo(t0.cx + t0.x01, t0.cy + t0.y01);

              // Have the corners merged?
              if (rc0 < rc) context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);

              // Otherwise, draw the two corners and the ring.
              else {
                  context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
                  context.arc(0, 0, r0, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), cw);
                  context.arc(t1.cx, t1.cy, rc0, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
                }
            }

            // Or is the inner ring just a circular arc?
            else context.arc(0, 0, r0, a10, a00, cw);
        }

    context.closePath();

    if (buffer) return context = null, buffer + "" || null;
  }

  arc.centroid = function () {
    var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2,
        a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi$1 / 2;
    return [cos(a) * r, sin(a) * r];
  };

  arc.innerRadius = function (_) {
    return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant$1(+_), arc) : innerRadius;
  };

  arc.outerRadius = function (_) {
    return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant$1(+_), arc) : outerRadius;
  };

  arc.cornerRadius = function (_) {
    return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant$1(+_), arc) : cornerRadius;
  };

  arc.padRadius = function (_) {
    return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant$1(+_), arc) : padRadius;
  };

  arc.startAngle = function (_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$1(+_), arc) : startAngle;
  };

  arc.endAngle = function (_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$1(+_), arc) : endAngle;
  };

  arc.padAngle = function (_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$1(+_), arc) : padAngle;
  };

  arc.context = function (_) {
    return arguments.length ? (context = _ == null ? null : _, arc) : context;
  };

  return arc;
};

function Linear(context) {
  this._context = context;
}

Linear.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._point = 0;
  },
  lineEnd: function () {
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0:
        this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
      case 1:
        this._point = 2; // proceed
      default:
        this._context.lineTo(x, y);break;
    }
  }
};

var curveLinear = function (context) {
  return new Linear(context);
};

function x(p) {
  return p[0];
}

function y(p) {
  return p[1];
}

var line = function () {
  var x$$1 = x,
      y$$1 = y,
      defined = constant$1(true),
      context = null,
      curve = curveLinear,
      output = null;

  function line(data) {
    var i,
        n = data.length,
        d,
        defined0 = false,
        buffer;

    if (context == null) output = curve(buffer = path());

    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) output.lineStart();else output.lineEnd();
      }
      if (defined0) output.point(+x$$1(d, i, data), +y$$1(d, i, data));
    }

    if (buffer) return output = null, buffer + "" || null;
  }

  line.x = function (_) {
    return arguments.length ? (x$$1 = typeof _ === "function" ? _ : constant$1(+_), line) : x$$1;
  };

  line.y = function (_) {
    return arguments.length ? (y$$1 = typeof _ === "function" ? _ : constant$1(+_), line) : y$$1;
  };

  line.defined = function (_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant$1(!!_), line) : defined;
  };

  line.curve = function (_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
  };

  line.context = function (_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
  };

  return line;
};

var area = function () {
  var x0 = x,
      x1 = null,
      y0 = constant$1(0),
      y1 = y,
      defined = constant$1(true),
      context = null,
      curve = curveLinear,
      output = null;

  function area(data) {
    var i,
        j,
        k,
        n = data.length,
        d,
        defined0 = false,
        buffer,
        x0z = new Array(n),
        y0z = new Array(n);

    if (context == null) output = curve(buffer = path());

    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) {
          j = i;
          output.areaStart();
          output.lineStart();
        } else {
          output.lineEnd();
          output.lineStart();
          for (k = i - 1; k >= j; --k) {
            output.point(x0z[k], y0z[k]);
          }
          output.lineEnd();
          output.areaEnd();
        }
      }
      if (defined0) {
        x0z[i] = +x0(d, i, data), y0z[i] = +y0(d, i, data);
        output.point(x1 ? +x1(d, i, data) : x0z[i], y1 ? +y1(d, i, data) : y0z[i]);
      }
    }

    if (buffer) return output = null, buffer + "" || null;
  }

  function arealine() {
    return line().defined(defined).curve(curve).context(context);
  }

  area.x = function (_) {
    return arguments.length ? (x0 = typeof _ === "function" ? _ : constant$1(+_), x1 = null, area) : x0;
  };

  area.x0 = function (_) {
    return arguments.length ? (x0 = typeof _ === "function" ? _ : constant$1(+_), area) : x0;
  };

  area.x1 = function (_) {
    return arguments.length ? (x1 = _ == null ? null : typeof _ === "function" ? _ : constant$1(+_), area) : x1;
  };

  area.y = function (_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : constant$1(+_), y1 = null, area) : y0;
  };

  area.y0 = function (_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : constant$1(+_), area) : y0;
  };

  area.y1 = function (_) {
    return arguments.length ? (y1 = _ == null ? null : typeof _ === "function" ? _ : constant$1(+_), area) : y1;
  };

  area.lineX0 = area.lineY0 = function () {
    return arealine().x(x0).y(y0);
  };

  area.lineY1 = function () {
    return arealine().x(x0).y(y1);
  };

  area.lineX1 = function () {
    return arealine().x(x1).y(y0);
  };

  area.defined = function (_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant$1(!!_), area) : defined;
  };

  area.curve = function (_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), area) : curve;
  };

  area.context = function (_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), area) : context;
  };

  return area;
};

var curveRadialLinear = curveRadial(curveLinear);

function Radial(curve) {
  this._curve = curve;
}

Radial.prototype = {
  areaStart: function () {
    this._curve.areaStart();
  },
  areaEnd: function () {
    this._curve.areaEnd();
  },
  lineStart: function () {
    this._curve.lineStart();
  },
  lineEnd: function () {
    this._curve.lineEnd();
  },
  point: function (a, r) {
    this._curve.point(r * Math.sin(a), r * -Math.cos(a));
  }
};

function curveRadial(curve) {

  function radial(context) {
    return new Radial(curve(context));
  }

  radial._curve = curve;

  return radial;
}

function lineRadial(l) {
  var c = l.curve;

  l.angle = l.x, delete l.x;
  l.radius = l.y, delete l.y;

  l.curve = function (_) {
    return arguments.length ? c(curveRadial(_)) : c()._curve;
  };

  return l;
}

var radialLine = function () {
  return lineRadial(line().curve(curveRadialLinear));
};

var radialArea = function () {
  var a = area().curve(curveRadialLinear),
      c = a.curve,
      x0 = a.lineX0,
      x1 = a.lineX1,
      y0 = a.lineY0,
      y1 = a.lineY1;

  a.angle = a.x, delete a.x;
  a.startAngle = a.x0, delete a.x0;
  a.endAngle = a.x1, delete a.x1;
  a.radius = a.y, delete a.y;
  a.innerRadius = a.y0, delete a.y0;
  a.outerRadius = a.y1, delete a.y1;
  a.lineStartAngle = function () {
    return lineRadial(x0());
  }, delete a.lineX0;
  a.lineEndAngle = function () {
    return lineRadial(x1());
  }, delete a.lineX1;
  a.lineInnerRadius = function () {
    return lineRadial(y0());
  }, delete a.lineY0;
  a.lineOuterRadius = function () {
    return lineRadial(y1());
  }, delete a.lineY1;

  a.curve = function (_) {
    return arguments.length ? c(curveRadial(_)) : c()._curve;
  };

  return a;
};

var symbolCircle = {
  draw: function (context, size) {
    var r = Math.sqrt(size / pi$1);
    context.moveTo(r, 0);
    context.arc(0, 0, r, 0, tau$1);
  }
};

var symbolCross = {
  draw: function (context, size) {
    var r = Math.sqrt(size / 5) / 2;
    context.moveTo(-3 * r, -r);
    context.lineTo(-r, -r);
    context.lineTo(-r, -3 * r);
    context.lineTo(r, -3 * r);
    context.lineTo(r, -r);
    context.lineTo(3 * r, -r);
    context.lineTo(3 * r, r);
    context.lineTo(r, r);
    context.lineTo(r, 3 * r);
    context.lineTo(-r, 3 * r);
    context.lineTo(-r, r);
    context.lineTo(-3 * r, r);
    context.closePath();
  }
};

var tan30 = Math.sqrt(1 / 3);
var tan30_2 = tan30 * 2;

var symbolDiamond = {
  draw: function (context, size) {
    var y = Math.sqrt(size / tan30_2),
        x = y * tan30;
    context.moveTo(0, -y);
    context.lineTo(x, 0);
    context.lineTo(0, y);
    context.lineTo(-x, 0);
    context.closePath();
  }
};

var ka = 0.89081309152928522810;
var kr = Math.sin(pi$1 / 10) / Math.sin(7 * pi$1 / 10);
var kx = Math.sin(tau$1 / 10) * kr;
var ky = -Math.cos(tau$1 / 10) * kr;

var symbolStar = {
    draw: function (context, size) {
        var r = Math.sqrt(size * ka),
            x = kx * r,
            y = ky * r;
        context.moveTo(0, -r);
        context.lineTo(x, y);
        for (var i = 1; i < 5; ++i) {
            var a = tau$1 * i / 5,
                c = Math.cos(a),
                s = Math.sin(a);
            context.lineTo(s * r, -c * r);
            context.lineTo(c * x - s * y, s * x + c * y);
        }
        context.closePath();
    }
};

var symbolSquare = {
  draw: function (context, size) {
    var w = Math.sqrt(size),
        x = -w / 2;
    context.rect(x, x, w, w);
  }
};

var sqrt3 = Math.sqrt(3);

var symbolTriangle = {
  draw: function (context, size) {
    var y = -Math.sqrt(size / (sqrt3 * 3));
    context.moveTo(0, y * 2);
    context.lineTo(-sqrt3 * y, -y);
    context.lineTo(sqrt3 * y, -y);
    context.closePath();
  }
};

var c$1 = -0.5;
var s$1 = Math.sqrt(3) / 2;
var k = 1 / Math.sqrt(12);
var a = (k / 2 + 1) * 3;

var symbolWye = {
    draw: function (context, size) {
        var r = Math.sqrt(size / a),
            x0 = r / 2,
            y0 = r * k,
            x1 = x0,
            y1 = r * k + r,
            x2 = -x1,
            y2 = y1;
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(c$1 * x0 - s$1 * y0, s$1 * x0 + c$1 * y0);
        context.lineTo(c$1 * x1 - s$1 * y1, s$1 * x1 + c$1 * y1);
        context.lineTo(c$1 * x2 - s$1 * y2, s$1 * x2 + c$1 * y2);
        context.lineTo(c$1 * x0 + s$1 * y0, c$1 * y0 - s$1 * x0);
        context.lineTo(c$1 * x1 + s$1 * y1, c$1 * y1 - s$1 * x1);
        context.lineTo(c$1 * x2 + s$1 * y2, c$1 * y2 - s$1 * x2);
        context.closePath();
    }
};

var symbol = function () {
  var type = constant$1(symbolCircle),
      size = constant$1(64),
      context = null;

  function symbol() {
    var buffer;
    if (!context) context = buffer = path();
    type.apply(this, arguments).draw(context, +size.apply(this, arguments));
    if (buffer) return context = null, buffer + "" || null;
  }

  symbol.type = function (_) {
    return arguments.length ? (type = typeof _ === "function" ? _ : constant$1(_), symbol) : type;
  };

  symbol.size = function (_) {
    return arguments.length ? (size = typeof _ === "function" ? _ : constant$1(+_), symbol) : size;
  };

  symbol.context = function (_) {
    return arguments.length ? (context = _ == null ? null : _, symbol) : context;
  };

  return symbol;
};

function sign(x) {
  return x < 0 ? -1 : 1;
}

// Calculate the slopes of the tangents (Hermite-type interpolation) based on
// the following paper: Steffen, M. 1990. A Simple Method for Monotonic
// Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
// NOV(II), P. 443, 1990.
function slope3(that, x2, y2) {
  var h0 = that._x1 - that._x0,
      h1 = x2 - that._x1,
      s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
      s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
      p = (s0 * h1 + s1 * h0) / (h0 + h1);
  return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
}

// Calculate a one-sided slope.
function slope2(that, t) {
  var h = that._x1 - that._x0;
  return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
}

// According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
// "you can express cubic Hermite interpolation in terms of cubic Bézier curves
// with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
function point$4(that, t0, t1) {
  var x0 = that._x0,
      y0 = that._y0,
      x1 = that._x1,
      y1 = that._y1,
      dx = (x1 - x0) / 3;
  that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
}

function MonotoneX(context) {
  this._context = context;
}

MonotoneX.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);break;
      case 3:
        point$4(this, this._t0, slope2(this, this._t0));break;
    }
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (x, y) {
    var t1 = NaN;

    x = +x, y = +y;
    if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
    switch (this._point) {
      case 0:
        this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
      case 1:
        this._point = 2;break;
      case 2:
        this._point = 3;point$4(this, slope2(this, t1 = slope3(this, x, y)), t1);break;
      default:
        point$4(this, this._t0, t1 = slope3(this, x, y));break;
    }

    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
    this._t0 = t1;
  }
};

function MonotoneY(context) {
  this._context = new ReflectContext(context);
}

(MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function (x, y) {
  MonotoneX.prototype.point.call(this, y, x);
};

function ReflectContext(context) {
  this._context = context;
}

ReflectContext.prototype = {
  moveTo: function (x, y) {
    this._context.moveTo(y, x);
  },
  closePath: function () {
    this._context.closePath();
  },
  lineTo: function (x, y) {
    this._context.lineTo(y, x);
  },
  bezierCurveTo: function (x1, y1, x2, y2, x, y) {
    this._context.bezierCurveTo(y1, x1, y2, x2, y, x);
  }
};

var ascending$2 = function (a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
};

var bisector = function (compare) {
  if (compare.length === 1) compare = ascendingComparator(compare);
  return {
    left: function (a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;else hi = mid;
      }
      return lo;
    },
    right: function (a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;else lo = mid + 1;
      }
      return lo;
    }
  };
};

function ascendingComparator(f) {
  return function (d, x) {
    return ascending$2(f(d), x);
  };
}

var ascendingBisect = bisector(ascending$2);
var bisectRight = ascendingBisect.right;

var range = function (start, stop, step) {
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
};

var e10 = Math.sqrt(50);
var e5 = Math.sqrt(10);
var e2 = Math.sqrt(2);

var ticks = function (start, stop, count) {
    var reverse,
        i = -1,
        n,
        ticks,
        step;

    stop = +stop, start = +start, count = +count;
    if (start === stop && count > 0) return [start];
    if (reverse = stop < start) n = start, start = stop, stop = n;
    if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

    if (step > 0) {
        start = Math.ceil(start / step);
        stop = Math.floor(stop / step);
        ticks = new Array(n = Math.ceil(stop - start + 1));
        while (++i < n) ticks[i] = (start + i) * step;
    } else {
        start = Math.floor(start * step);
        stop = Math.ceil(stop * step);
        ticks = new Array(n = Math.ceil(start - stop + 1));
        while (++i < n) ticks[i] = (start - i) / step;
    }

    if (reverse) ticks.reverse();

    return ticks;
};

function tickIncrement(start, stop, count) {
    var step = (stop - start) / Math.max(0, count),
        power = Math.floor(Math.log(step) / Math.LN10),
        error = step / Math.pow(10, power);
    return power >= 0 ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power) : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}

function tickStep(start, stop, count) {
    var step0 = Math.abs(stop - start) / Math.max(0, count),
        step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
        error = step0 / step1;
    if (error >= e10) step1 *= 10;else if (error >= e5) step1 *= 5;else if (error >= e2) step1 *= 2;
    return stop < start ? -step1 : step1;
}

var max$1 = function (values, valueof) {
  var n = values.length,
      i = -1,
      value,
      max;

  if (valueof == null) {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        max = value;
        while (++i < n) {
          // Compare the remaining values.
          if ((value = values[i]) != null && value > max) {
            max = value;
          }
        }
      }
    }
  } else {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        max = value;
        while (++i < n) {
          // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && value > max) {
            max = value;
          }
        }
      }
    }
  }

  return max;
};

var min$1 = function (values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min;

  if (valueof == null) {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = value;
        while (++i < n) {
          // Compare the remaining values.
          if ((value = values[i]) != null && min > value) {
            min = value;
          }
        }
      }
    }
  } else {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = value;
        while (++i < n) {
          // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && min > value) {
            min = value;
          }
        }
      }
    }
  }

  return min;
};

function renderLayoutLabels(conf, block) {
  const radius = conf.innerRadius + conf.labels.radialOffset;

  // const labelArc = arc()
  //   .innerRadius(radius)
  //   .outerRadius(radius)
  //   .startAngle((d, i) => d.start)
  //   .endAngle((d, i) => d.end)

  // block.append('path')
  //   .attr('fill', 'none')
  //   .attr('stroke', 'none')
  //   .attr('d', labelArc)
  //   .attr('id', d => 'arc-label' + d.id)

  // const label = block.append('text')
  //   .style('font-size', '' + conf.labels.size + 'px')
  //   .attr('text-anchor', 'middle')

  // // http://stackoverflow.com/questions/20447106/how-to-center-horizontal-and-vertical-text-along-an-textpath-inside-an-arc-usi
  // label.append('textPath')
  //   .attr('startOffset', '25%')
  //   .attr('xlink:href', (d) => '#arc-label' + d.id)
  //   .style('fill', conf.labels.color)
  //   .text((d) => d.label)
  const label = block.append('text').attr('transform', function (d) {
    return 'rotate(' + (d.start + d.end) / 2 / 2 / Math.PI * 360 + ')';
  }).attr('x', d => Math.sin((d.start + d.end) / 2) * radius).attr('y', d => -Math.cos((d.start + d.end) / 2) * radius).style('font-size', '' + conf.labels.size + 'px').attr('text-anchor', 'middle').style('fill', conf.labels.color).text(d => d.label);
}

function renderLayoutTicks(conf, layout, instance) {
  // Returns an array of tick angles and labels, given a block.
  function blockTicks(d) {
    const k = (d.end - d.start) / d.len;
    return range(0, d.len, conf.ticks.spacing).map((v, i) => {
      return {
        angle: v * k + d.start,
        label: displayLabel(v, i)
      };
    });
  }

  function displayLabel(v, i) {
    if (conf.ticks.labels === false) {
      return null;
    } else if (conf.ticks.labelDisplay0 === false && i === 0) {
      return null;
    } else if (i % conf.ticks.labelSpacing) {
      return null;
    } else {
      return v / conf.ticks.labelDenominator + conf.ticks.labelSuffix;
    }
  }

  const ticks = layout.append('g').selectAll('g').data(instance._layout.data).enter().append('g').selectAll('g').data(blockTicks).enter().append('g').attr('transform', d => {
    const rotation = d.angle * 180 / Math.PI - 90;
    const radius = conf.outerRadius;
    return 'translate(' + radius * Math.cos(-rotation / 180 * Math.PI) + ', ' + -radius * Math.sin(-rotation / 180 * Math.PI) + ') rotate(' + rotation + ')';
    // 'rotate(' + (d.angle * 180 / Math.PI - 90) + ')' + 'translate(' + conf.outerRadius + ',0)'
  });

  ticks.append('line').attr('x1', 0).attr('y1', 1).attr('x2', (d, i) => {
    if (i % conf.ticks.majorSpacing) {
      return conf.ticks.size.minor;
    } else {
      return conf.ticks.size.major;
    }
  }).attr('y2', 1).style('stroke', conf.ticks.color);

  ticks.append('text').attr('x', 8).attr('dy', '.35em').attr('transform', d => d.angle > Math.PI ? 'rotate(180)translate(-16)' : null).style('text-anchor', d => d.angle > Math.PI ? 'end' : null).style('font-size', '' + conf.ticks.labelSize + 'px').style('fill', conf.ticks.labelColor).text(d => d.label);
}

function renderLayout(parentElement, instance) {
  const conf = instance._layout.conf;
  parentElement.select('.cs-layout').remove();

  const layout = parentElement.append('g').attr('class', 'cs-layout item-wrapper').attr('z-index', conf.zIndex).on('click', conf.onClick);

  const block = layout.selectAll('g').data(instance._layout.data).enter().append('g').attr('class', d => d.id).attr('opacity', conf.opacity);

  Object.keys(conf.events).forEach(eventName => {
    block.on(eventName, function (d, i, nodes) {
      conf.events[eventName](d, i, nodes, event$1);
    });
  });

  const entry = arc().innerRadius(conf.innerRadius).outerRadius(conf.outerRadius).cornerRadius(conf.cornerRadius).startAngle(d => d.start).endAngle(d => d.end);

  block.append('path').attr('d', entry).attr('stroke-width', 0).attr('pathType', 'arc').attr('pathData', d => {
    d.innerRadius = conf.innerRadius;
    d.outerRadius = conf.outerRadius;
    return d;
  }).attr('fill', d => d.color).attr('id', d => d.id);

  if (conf.labels.display) {
    renderLayoutLabels(conf, block);
  }

  if (conf.ticks.display) {
    renderLayoutTicks(conf, layout, instance);
  }
}

const forEach$2 = require('lodash/forEach');
const sortBy = require('lodash/sortBy');
function render(ids = [], removeTracks, circos) {
  const renderAll = ids.length === 0;

  const svg = circos.svg.attr('width', circos.conf.width).attr('height', circos.conf.height);

  if (removeTracks) {
    forEach$2(circos.tracks, (track, trackId) => {
      svg.select('.' + trackId).remove();
    });
  }

  let translated = svg.select('.all');
  if (translated.empty()) {
    translated = svg.append('g').attr('class', 'all').attr('transform', `translate(
          ${parseInt(circos.conf.width / 2)},
          ${parseInt(circos.conf.height / 2)}
        )`);
  }

  forEach$2(circos.tracks, (track, trackId) => {
    if (renderAll || trackId in ids) {
      track.render(circos, translated, trackId);
    }
  });
  if (renderAll || 'layout' in ids) {
    renderLayout(translated, circos);
  }

  // re-order tracks and layout according to z-index
  // const trackContainers = svg.selectAll('.all + g').remove()
  const trackContainers = svg.select('.all').selectAll('.item-wrapper').remove();
  const sortedTrackContainers = sortBy(trackContainers._groups[0], elt => elt.getAttribute('z-index'));

  svg.select('.all').selectAll('g').data(sortedTrackContainers).enter().append(d => d);

  return circos;
}

// import 'd3-transition'

function registerTooltip(track, instance, element, trackParams) {
  track.dispatch.on('mouseover', d => {
    instance.tip.html(trackParams.tooltipContent(d)).transition().style('opacity', 0.9).style('left', event$1.data.originalEvent.clientX + 'px').style('top', event$1.data.originalEvent.clientY - 40 + 'px');
  });

  track.dispatch.on('mouseout', d => {
    instance.tip.transition().duration(500).style('opacity', 0);
  });
}

var noop$1 = { value: function () {} };

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || t in _) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames$1(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function (t) {
    var name = "",
        i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return { type: t, name: name };
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function (typename, callback) {
    var _ = this._,
        T = parseTypenames$1(typename + "", _),
        t,
        i = -1,
        n = T.length;

    // If no callback was specified, return the callback of the given type and name.
    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
      return;
    }

    // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
    }

    return this;
  },
  copy: function () {
    var copy = {},
        _ = this._;
    for (var t in _) copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function (type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function (type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};

function get(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop$1, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({ name: name, value: callback });
  return type;
}

var prefix = "$";

function Map() {}

Map.prototype = map$2.prototype = {
  constructor: Map,
  has: function (key) {
    return prefix + key in this;
  },
  get: function (key) {
    return this[prefix + key];
  },
  set: function (key, value) {
    this[prefix + key] = value;
    return this;
  },
  remove: function (key) {
    var property = prefix + key;
    return property in this && delete this[property];
  },
  clear: function () {
    for (var property in this) if (property[0] === prefix) delete this[property];
  },
  keys: function () {
    var keys = [];
    for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
    return keys;
  },
  values: function () {
    var values = [];
    for (var property in this) if (property[0] === prefix) values.push(this[property]);
    return values;
  },
  entries: function () {
    var entries = [];
    for (var property in this) if (property[0] === prefix) entries.push({ key: property.slice(1), value: this[property] });
    return entries;
  },
  size: function () {
    var size = 0;
    for (var property in this) if (property[0] === prefix) ++size;
    return size;
  },
  empty: function () {
    for (var property in this) if (property[0] === prefix) return false;
    return true;
  },
  each: function (f) {
    for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
  }
};

function map$2(object, f) {
  var map = new Map();

  // Copy constructor.
  if (object instanceof Map) object.each(function (value, key) {
    map.set(key, value);
  });

  // Index array by numeric index or specified key function.
  else if (Array.isArray(object)) {
      var i = -1,
          n = object.length,
          o;

      if (f == null) while (++i < n) map.set(i, object[i]);else while (++i < n) map.set(f(o = object[i], i, object), o);
    }

    // Convert object to map.
    else if (object) for (var key in object) map.set(key, object[key]);

  return map;
}

var nest = function () {
  var keys = [],
      sortKeys = [],
      sortValues,
      rollup,
      nest;

  function apply(array, depth, createResult, setResult) {
    if (depth >= keys.length) {
      if (sortValues != null) array.sort(sortValues);
      return rollup != null ? rollup(array) : array;
    }

    var i = -1,
        n = array.length,
        key = keys[depth++],
        keyValue,
        value,
        valuesByKey = map$2(),
        values,
        result = createResult();

    while (++i < n) {
      if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
        values.push(value);
      } else {
        valuesByKey.set(keyValue, [value]);
      }
    }

    valuesByKey.each(function (values, key) {
      setResult(result, key, apply(values, depth, createResult, setResult));
    });

    return result;
  }

  function entries(map, depth) {
    if (++depth > keys.length) return map;
    var array,
        sortKey = sortKeys[depth - 1];
    if (rollup != null && depth >= keys.length) array = map.entries();else array = [], map.each(function (v, k) {
      array.push({ key: k, values: entries(v, depth) });
    });
    return sortKey != null ? array.sort(function (a, b) {
      return sortKey(a.key, b.key);
    }) : array;
  }

  return nest = {
    object: function (array) {
      return apply(array, 0, createObject, setObject);
    },
    map: function (array) {
      return apply(array, 0, createMap, setMap);
    },
    entries: function (array) {
      return entries(apply(array, 0, createMap, setMap), 0);
    },
    key: function (d) {
      keys.push(d);return nest;
    },
    sortKeys: function (order) {
      sortKeys[keys.length - 1] = order;return nest;
    },
    sortValues: function (order) {
      sortValues = order;return nest;
    },
    rollup: function (f) {
      rollup = f;return nest;
    }
  };
};

function createObject() {
  return {};
}

function setObject(object, key, value) {
  object[key] = value;
}

function createMap() {
  return map$2();
}

function setMap(map, key, value) {
  map.set(key, value);
}

function Set() {}

var proto = map$2.prototype;

Set.prototype = set$1.prototype = {
  constructor: Set,
  has: proto.has,
  add: function (value) {
    value += "";
    this[prefix + value] = value;
    return this;
  },
  remove: proto.remove,
  clear: proto.clear,
  values: proto.keys,
  size: proto.size,
  empty: proto.empty,
  each: proto.each
};

function set$1(object, f) {
  var set = new Set();

  // Copy constructor.
  if (object instanceof Set) object.each(function (value) {
    set.add(value);
  });

  // Otherwise, assume it’s an array.
  else if (object) {
      var i = -1,
          n = object.length;
      if (f == null) while (++i < n) set.add(object[i]);else while (++i < n) set.add(f(object[i], i, object));
    }

  return set;
}

var array$1 = Array.prototype;

var map$4 = array$1.map;
var slice$2 = array$1.slice;

var define = function (constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
};

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}

function Color() {}

var darker = 0.7;
var brighter = 1 / darker;

var reI = "\\s*([+-]?\\d+)\\s*";
var reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*";
var reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
var reHex3 = /^#([0-9a-f]{3})$/;
var reHex6 = /^#([0-9a-f]{6})$/;
var reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$");
var reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$");
var reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$");
var reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$");
var reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$");
var reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

var named = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};

define(Color, color, {
  displayable: function () {
    return this.rgb().displayable();
  },
  toString: function () {
    return this.rgb() + "";
  }
});

function color(format) {
  var m;
  format = (format + "").trim().toLowerCase();
  return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb(m >> 8 & 0xf | m >> 4 & 0x0f0, m >> 4 & 0xf | m & 0xf0, (m & 0xf) << 4 | m & 0xf, 1)) : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
  : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
  : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
  : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
  : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
  : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
  : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
  : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}

function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}

function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb();
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}

function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}

define(Rgb, rgb, extend(Color, {
  brighter: function (k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker: function (k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb: function () {
    return this;
  },
  displayable: function () {
    return 0 <= this.r && this.r <= 255 && 0 <= this.g && this.g <= 255 && 0 <= this.b && this.b <= 255 && 0 <= this.opacity && this.opacity <= 1;
  },
  toString: function () {
    var a = this.opacity;a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (a === 1 ? ")" : ", " + a + ")");
  }
}));

function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;else if (l <= 0 || l >= 1) h = s = NaN;else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}

function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl();
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      h = NaN,
      s = max - min,
      l = (max + min) / 2;
  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;else if (g === max) h = (b - r) / s + 2;else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}

function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define(Hsl, hsl, extend(Color, {
  brighter: function (k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function (k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function () {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
  },
  displayable: function () {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  }
}));

/* From FvD 13.37, CSS Color Module Level 3 */
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}

var deg2rad = Math.PI / 180;
var rad2deg = 180 / Math.PI;

var Kn = 18;
var Xn = 0.950470;
var Yn = 1;
var Zn = 1.088830;
var t0 = 4 / 29;
var t1 = 6 / 29;
var t2 = 3 * t1 * t1;
var t3 = t1 * t1 * t1;

function labConvert(o) {
  if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
  if (o instanceof Hcl) {
    var h = o.h * deg2rad;
    return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
  }
  if (!(o instanceof Rgb)) o = rgbConvert(o);
  var b = rgb2xyz(o.r),
      a = rgb2xyz(o.g),
      l = rgb2xyz(o.b),
      x = xyz2lab((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn),
      y = xyz2lab((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn),
      z = xyz2lab((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn);
  return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
}

function lab(l, a, b, opacity) {
  return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
}

function Lab(l, a, b, opacity) {
  this.l = +l;
  this.a = +a;
  this.b = +b;
  this.opacity = +opacity;
}

define(Lab, lab, extend(Color, {
  brighter: function (k) {
    return new Lab(this.l + Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  darker: function (k) {
    return new Lab(this.l - Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  rgb: function () {
    var y = (this.l + 16) / 116,
        x = isNaN(this.a) ? y : y + this.a / 500,
        z = isNaN(this.b) ? y : y - this.b / 200;
    y = Yn * lab2xyz(y);
    x = Xn * lab2xyz(x);
    z = Zn * lab2xyz(z);
    return new Rgb(xyz2rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
    xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z), xyz2rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z), this.opacity);
  }
}));

function xyz2lab(t) {
  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
}

function lab2xyz(t) {
  return t > t1 ? t * t * t : t2 * (t - t0);
}

function xyz2rgb(x) {
  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}

function rgb2xyz(x) {
  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function hclConvert(o) {
  if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
  if (!(o instanceof Lab)) o = labConvert(o);
  var h = Math.atan2(o.b, o.a) * rad2deg;
  return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
}

function hcl(h, c, l, opacity) {
  return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}

function Hcl(h, c, l, opacity) {
  this.h = +h;
  this.c = +c;
  this.l = +l;
  this.opacity = +opacity;
}

define(Hcl, hcl, extend(Color, {
  brighter: function (k) {
    return new Hcl(this.h, this.c, this.l + Kn * (k == null ? 1 : k), this.opacity);
  },
  darker: function (k) {
    return new Hcl(this.h, this.c, this.l - Kn * (k == null ? 1 : k), this.opacity);
  },
  rgb: function () {
    return labConvert(this).rgb();
  }
}));

var A = -0.14861;
var B = +1.78277;
var C = -0.29227;
var D = -0.90649;
var E = +1.97294;
var ED = E * D;
var EB = E * B;
var BC_DA = B * C - D * A;

function cubehelixConvert(o) {
  if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Rgb)) o = rgbConvert(o);
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
      bl = b - l,
      k = (E * (g - l) - C * bl) / D,
      s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)),
      // NaN if l=0 or l=1
  h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
  return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
}

function cubehelix(h, s, l, opacity) {
  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
}

function Cubehelix(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define(Cubehelix, cubehelix, extend(Color, {
  brighter: function (k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function (k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function () {
    var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
        l = +this.l,
        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
        cosh = Math.cos(h),
        sinh = Math.sin(h);
    return new Rgb(255 * (l + a * (A * cosh + B * sinh)), 255 * (l + a * (C * cosh + D * sinh)), 255 * (l + a * (E * cosh)), this.opacity);
  }
}));

function basis$1(t1, v0, v1, v2, v3) {
  var t2 = t1 * t1,
      t3 = t2 * t1;
  return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
}

var basis$2 = function (values) {
  var n = values.length - 1;
  return function (t) {
    var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
        v1 = values[i],
        v2 = values[i + 1],
        v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
        v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis$1((t - i / n) * n, v0, v1, v2, v3);
  };
};

var constant$3 = function (x) {
  return function () {
    return x;
  };
};

function linear$1(a, d) {
  return function (t) {
    return a + t * d;
  };
}

function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function (t) {
    return Math.pow(a + t * b, y);
  };
}

function hue(a, b) {
  var d = b - a;
  return d ? linear$1(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$3(isNaN(a) ? b : a);
}

function gamma(y) {
  return (y = +y) === 1 ? nogamma : function (a, b) {
    return b - a ? exponential(a, b, y) : constant$3(isNaN(a) ? b : a);
  };
}

function nogamma(a, b) {
  var d = b - a;
  return d ? linear$1(a, d) : constant$3(isNaN(a) ? b : a);
}

var rgb$1 = (function rgbGamma(y) {
  var color$$1 = gamma(y);

  function rgb$$1(start, end) {
    var r = color$$1((start = rgb(start)).r, (end = rgb(end)).r),
        g = color$$1(start.g, end.g),
        b = color$$1(start.b, end.b),
        opacity = nogamma(start.opacity, end.opacity);
    return function (t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  rgb$$1.gamma = rgbGamma;

  return rgb$$1;
})(1);

function rgbSpline(spline) {
  return function (colors) {
    var n = colors.length,
        r = new Array(n),
        g = new Array(n),
        b = new Array(n),
        i,
        color$$1;
    for (i = 0; i < n; ++i) {
      color$$1 = rgb(colors[i]);
      r[i] = color$$1.r || 0;
      g[i] = color$$1.g || 0;
      b[i] = color$$1.b || 0;
    }
    r = spline(r);
    g = spline(g);
    b = spline(b);
    color$$1.opacity = 1;
    return function (t) {
      color$$1.r = r(t);
      color$$1.g = g(t);
      color$$1.b = b(t);
      return color$$1 + "";
    };
  };
}

var rgbBasis = rgbSpline(basis$2);

var array$2 = function (a, b) {
  var nb = b ? b.length : 0,
      na = a ? Math.min(nb, a.length) : 0,
      x = new Array(na),
      c = new Array(nb),
      i;

  for (i = 0; i < na; ++i) x[i] = interpolateValue(a[i], b[i]);
  for (; i < nb; ++i) c[i] = b[i];

  return function (t) {
    for (i = 0; i < na; ++i) c[i] = x[i](t);
    return c;
  };
};

var date = function (a, b) {
  var d = new Date();
  return a = +a, b -= a, function (t) {
    return d.setTime(a + b * t), d;
  };
};

var reinterpolate = function (a, b) {
  return a = +a, b -= a, function (t) {
    return a + b * t;
  };
};

var object = function (a, b) {
  var i = {},
      c = {},
      k;

  if (a === null || typeof a !== "object") a = {};
  if (b === null || typeof b !== "object") b = {};

  for (k in b) {
    if (k in a) {
      i[k] = interpolateValue(a[k], b[k]);
    } else {
      c[k] = b[k];
    }
  }

  return function (t) {
    for (k in i) c[k] = i[k](t);
    return c;
  };
};

var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
var reB = new RegExp(reA.source, "g");

function zero(b) {
  return function () {
    return b;
  };
}

function one(b) {
  return function (t) {
    return b(t) + "";
  };
}

var string = function (a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0,
      // scan index for next number in b
  am,
      // current match in a
  bm,
      // current match in b
  bs,
      // string preceding current number in b, if any
  i = -1,
      // index in s
  s = [],
      // string constants and placeholders
  q = []; // number interpolators

  // Coerce inputs to strings.
  a = a + "", b = b + "";

  // Interpolate pairs of numbers in a & b.
  while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) {
      // a string precedes the next number in b
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) {
      // numbers in a & b match
      if (s[i]) s[i] += bm; // coalesce with previous string
      else s[++i] = bm;
    } else {
      // interpolate non-matching numbers
      s[++i] = null;
      q.push({ i: i, x: reinterpolate(am, bm) });
    }
    bi = reB.lastIndex;
  }

  // Add remains of b.
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; // coalesce with previous string
    else s[++i] = bs;
  }

  // Special optimization for only a single match.
  // Otherwise, interpolate each of the numbers and rejoin the string.
  return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function (t) {
    for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
    return s.join("");
  });
};

var interpolateValue = function (a, b) {
    var t = typeof b,
        c;
    return b == null || t === "boolean" ? constant$3(b) : (t === "number" ? reinterpolate : t === "string" ? (c = color(b)) ? (b = c, rgb$1) : string : b instanceof color ? rgb$1 : b instanceof Date ? date : Array.isArray(b) ? array$2 : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object : reinterpolate)(a, b);
};

var interpolateRound = function (a, b) {
  return a = +a, b -= a, function (t) {
    return Math.round(a + b * t);
  };
};

var degrees = 180 / Math.PI;

var rho = Math.SQRT2;

function cubehelix$1(hue$$1) {
  return function cubehelixGamma(y) {
    y = +y;

    function cubehelix$$1(start, end) {
      var h = hue$$1((start = cubehelix(start)).h, (end = cubehelix(end)).h),
          s = nogamma(start.s, end.s),
          l = nogamma(start.l, end.l),
          opacity = nogamma(start.opacity, end.opacity);
      return function (t) {
        start.h = h(t);
        start.s = s(t);
        start.l = l(Math.pow(t, y));
        start.opacity = opacity(t);
        return start + "";
      };
    }

    cubehelix$$1.gamma = cubehelixGamma;

    return cubehelix$$1;
  }(1);
}

cubehelix$1(hue);
var cubehelixLong = cubehelix$1(nogamma);

var constant$4 = function (x) {
  return function () {
    return x;
  };
};

var number$1 = function (x) {
  return +x;
};

var unit = [0, 1];

function deinterpolateLinear(a, b) {
  return (b -= a = +a) ? function (x) {
    return (x - a) / b;
  } : constant$4(b);
}

function deinterpolateClamp(deinterpolate) {
  return function (a, b) {
    var d = deinterpolate(a = +a, b = +b);
    return function (x) {
      return x <= a ? 0 : x >= b ? 1 : d(x);
    };
  };
}

function reinterpolateClamp(reinterpolate) {
  return function (a, b) {
    var r = reinterpolate(a = +a, b = +b);
    return function (t) {
      return t <= 0 ? a : t >= 1 ? b : r(t);
    };
  };
}

function bimap(domain, range, deinterpolate, reinterpolate) {
  var d0 = domain[0],
      d1 = domain[1],
      r0 = range[0],
      r1 = range[1];
  if (d1 < d0) d0 = deinterpolate(d1, d0), r0 = reinterpolate(r1, r0);else d0 = deinterpolate(d0, d1), r0 = reinterpolate(r0, r1);
  return function (x) {
    return r0(d0(x));
  };
}

function polymap(domain, range, deinterpolate, reinterpolate) {
  var j = Math.min(domain.length, range.length) - 1,
      d = new Array(j),
      r = new Array(j),
      i = -1;

  // Reverse descending domains.
  if (domain[j] < domain[0]) {
    domain = domain.slice().reverse();
    range = range.slice().reverse();
  }

  while (++i < j) {
    d[i] = deinterpolate(domain[i], domain[i + 1]);
    r[i] = reinterpolate(range[i], range[i + 1]);
  }

  return function (x) {
    var i = bisectRight(domain, x, 1, j) - 1;
    return r[i](d[i](x));
  };
}

function copy(source, target) {
  return target.domain(source.domain()).range(source.range()).interpolate(source.interpolate()).clamp(source.clamp());
}

// deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
// reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].
function continuous(deinterpolate, reinterpolate) {
  var domain = unit,
      range = unit,
      interpolate$$1 = interpolateValue,
      clamp = false,
      piecewise,
      output,
      input;

  function rescale() {
    piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }

  function scale(x) {
    return (output || (output = piecewise(domain, range, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate, interpolate$$1)))(+x);
  }

  scale.invert = function (y) {
    return (input || (input = piecewise(range, domain, deinterpolateLinear, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
  };

  scale.domain = function (_) {
    return arguments.length ? (domain = map$4.call(_, number$1), rescale()) : domain.slice();
  };

  scale.range = function (_) {
    return arguments.length ? (range = slice$2.call(_), rescale()) : range.slice();
  };

  scale.rangeRound = function (_) {
    return range = slice$2.call(_), interpolate$$1 = interpolateRound, rescale();
  };

  scale.clamp = function (_) {
    return arguments.length ? (clamp = !!_, rescale()) : clamp;
  };

  scale.interpolate = function (_) {
    return arguments.length ? (interpolate$$1 = _, rescale()) : interpolate$$1;
  };

  return rescale();
}

// Computes the decimal coefficient and exponent of the specified number x with
// significant digits p, where x is positive and p is in [1, 21] or undefined.
// For example, formatDecimal(1.23) returns ["123", 0].
var formatDecimal = function (x, p) {
  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
  var i,
      coefficient = x.slice(0, i);

  // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
  return [coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient, +x.slice(i + 1)];
};

var exponent = function (x) {
  return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
};

var formatGroup = function (grouping, thousands) {
  return function (value, width) {
    var i = value.length,
        t = [],
        j = 0,
        g = grouping[0],
        length = 0;

    while (i > 0 && g > 0) {
      if (length + g + 1 > width) g = Math.max(1, width - length);
      t.push(value.substring(i -= g, i + g));
      if ((length += g + 1) > width) break;
      g = grouping[j = (j + 1) % grouping.length];
    }

    return t.reverse().join(thousands);
  };
};

var formatNumerals = function (numerals) {
  return function (value) {
    return value.replace(/[0-9]/g, function (i) {
      return numerals[+i];
    });
  };
};

var formatDefault = function (x, p) {
  x = x.toPrecision(p);

  out: for (var n = x.length, i = 1, i0 = -1, i1; i < n; ++i) {
    switch (x[i]) {
      case ".":
        i0 = i1 = i;break;
      case "0":
        if (i0 === 0) i0 = i;i1 = i;break;
      case "e":
        break out;
      default:
        if (i0 > 0) i0 = 0;break;
    }
  }

  return i0 > 0 ? x.slice(0, i0) + x.slice(i1 + 1) : x;
};

var prefixExponent;

var formatPrefixAuto = function (x, p) {
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1],
        i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
        n = coefficient.length;
    return i === n ? coefficient : i > n ? coefficient + new Array(i - n + 1).join("0") : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i) : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
};

var formatRounded = function (x, p) {
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1];
    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) : coefficient + new Array(exponent - coefficient.length + 2).join("0");
};

var formatTypes = {
  "": formatDefault,
  "%": function (x, p) {
    return (x * 100).toFixed(p);
  },
  "b": function (x) {
    return Math.round(x).toString(2);
  },
  "c": function (x) {
    return x + "";
  },
  "d": function (x) {
    return Math.round(x).toString(10);
  },
  "e": function (x, p) {
    return x.toExponential(p);
  },
  "f": function (x, p) {
    return x.toFixed(p);
  },
  "g": function (x, p) {
    return x.toPrecision(p);
  },
  "o": function (x) {
    return Math.round(x).toString(8);
  },
  "p": function (x, p) {
    return formatRounded(x * 100, p);
  },
  "r": formatRounded,
  "s": formatPrefixAuto,
  "X": function (x) {
    return Math.round(x).toString(16).toUpperCase();
  },
  "x": function (x) {
    return Math.round(x).toString(16);
  }
};

// [[fill]align][sign][symbol][0][width][,][.precision][type]
var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;

function formatSpecifier(specifier) {
  return new FormatSpecifier(specifier);
}

formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

function FormatSpecifier(specifier) {
  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);

  var match,
      fill = match[1] || " ",
      align = match[2] || ">",
      sign = match[3] || "-",
      symbol = match[4] || "",
      zero = !!match[5],
      width = match[6] && +match[6],
      comma = !!match[7],
      precision = match[8] && +match[8].slice(1),
      type = match[9] || "";

  // The "n" type is an alias for ",g".
  if (type === "n") comma = true, type = "g";

  // Map invalid types to the default format.
  else if (!formatTypes[type]) type = "";

  // If zero fill is specified, padding goes after sign and before digits.
  if (zero || fill === "0" && align === "=") zero = true, fill = "0", align = "=";

  this.fill = fill;
  this.align = align;
  this.sign = sign;
  this.symbol = symbol;
  this.zero = zero;
  this.width = width;
  this.comma = comma;
  this.precision = precision;
  this.type = type;
}

FormatSpecifier.prototype.toString = function () {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width == null ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0)) + this.type;
};

var identity$4 = function (x) {
  return x;
};

var prefixes = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];

var formatLocale = function (locale) {
  var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$4,
      currency = locale.currency,
      decimal = locale.decimal,
      numerals = locale.numerals ? formatNumerals(locale.numerals) : identity$4,
      percent = locale.percent || "%";

  function newFormat(specifier) {
    specifier = formatSpecifier(specifier);

    var fill = specifier.fill,
        align = specifier.align,
        sign = specifier.sign,
        symbol = specifier.symbol,
        zero = specifier.zero,
        width = specifier.width,
        comma = specifier.comma,
        precision = specifier.precision,
        type = specifier.type;

    // Compute the prefix and suffix.
    // For SI-prefix, the suffix is lazily computed.
    var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
        suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? percent : "";

    // What format function should we use?
    // Is this an integer type?
    // Can this type generate exponential notation?
    var formatType = formatTypes[type],
        maybeSuffix = !type || /[defgprs%]/.test(type);

    // Set the default precision if not specified,
    // or clamp the specified precision to the supported range.
    // For significant precision, it must be in [1, 21].
    // For fixed precision, it must be in [0, 20].
    precision = precision == null ? type ? 6 : 12 : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));

    function format(value) {
      var valuePrefix = prefix,
          valueSuffix = suffix,
          i,
          n,
          c;

      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value;

        // Perform the initial formatting.
        var valueNegative = value < 0;
        value = formatType(Math.abs(value), precision);

        // If a negative value rounds to zero during formatting, treat as positive.
        if (valueNegative && +value === 0) valueNegative = false;

        // Compute the prefix and suffix.
        valuePrefix = (valueNegative ? sign === "(" ? sign : "-" : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
        valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

        // Break the formatted value into the integer “value” part that can be
        // grouped, and fractional or exponential “suffix” part that is not.
        if (maybeSuffix) {
          i = -1, n = value.length;
          while (++i < n) {
            if (c = value.charCodeAt(i), 48 > c || c > 57) {
              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
              value = value.slice(0, i);
              break;
            }
          }
        }
      }

      // If the fill character is not "0", grouping is applied before padding.
      if (comma && !zero) value = group(value, Infinity);

      // Compute the padding.
      var length = valuePrefix.length + value.length + valueSuffix.length,
          padding = length < width ? new Array(width - length + 1).join(fill) : "";

      // If the fill character is "0", grouping is applied after padding.
      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

      // Reconstruct the final output based on the desired alignment.
      switch (align) {
        case "<":
          value = valuePrefix + value + valueSuffix + padding;break;
        case "=":
          value = valuePrefix + padding + value + valueSuffix;break;
        case "^":
          value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);break;
        default:
          value = padding + valuePrefix + value + valueSuffix;break;
      }

      return numerals(value);
    }

    format.toString = function () {
      return specifier + "";
    };

    return format;
  }

  function formatPrefix(specifier, value) {
    var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
        e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
        k = Math.pow(10, -e),
        prefix = prefixes[8 + e / 3];
    return function (value) {
      return f(k * value) + prefix;
    };
  }

  return {
    format: newFormat,
    formatPrefix: formatPrefix
  };
};

var locale;
var format;
var formatPrefix;

defaultLocale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});

function defaultLocale(definition) {
  locale = formatLocale(definition);
  format = locale.format;
  formatPrefix = locale.formatPrefix;
  return locale;
}

var precisionFixed = function (step) {
  return Math.max(0, -exponent(Math.abs(step)));
};

var precisionPrefix = function (step, value) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
};

var precisionRound = function (step, max) {
  step = Math.abs(step), max = Math.abs(max) - step;
  return Math.max(0, exponent(max) - exponent(step)) + 1;
};

var tickFormat = function (domain, count, specifier) {
  var start = domain[0],
      stop = domain[domain.length - 1],
      step = tickStep(start, stop, count == null ? 10 : count),
      precision;
  specifier = formatSpecifier(specifier == null ? ",f" : specifier);
  switch (specifier.type) {
    case "s":
      {
        var value = Math.max(Math.abs(start), Math.abs(stop));
        if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
        return formatPrefix(specifier, value);
      }
    case "":
    case "e":
    case "g":
    case "p":
    case "r":
      {
        if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
        break;
      }
    case "f":
    case "%":
      {
        if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
        break;
      }
  }
  return format(specifier);
};

function linearish(scale) {
  var domain = scale.domain;

  scale.ticks = function (count) {
    var d = domain();
    return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
  };

  scale.tickFormat = function (count, specifier) {
    return tickFormat(domain(), count, specifier);
  };

  scale.nice = function (count) {
    if (count == null) count = 10;

    var d = domain(),
        i0 = 0,
        i1 = d.length - 1,
        start = d[i0],
        stop = d[i1],
        step;

    if (stop < start) {
      step = start, start = stop, stop = step;
      step = i0, i0 = i1, i1 = step;
    }

    step = tickIncrement(start, stop, count);

    if (step > 0) {
      start = Math.floor(start / step) * step;
      stop = Math.ceil(stop / step) * step;
      step = tickIncrement(start, stop, count);
    } else if (step < 0) {
      start = Math.ceil(start * step) / step;
      stop = Math.floor(stop * step) / step;
      step = tickIncrement(start, stop, count);
    }

    if (step > 0) {
      d[i0] = Math.floor(start / step) * step;
      d[i1] = Math.ceil(stop / step) * step;
      domain(d);
    } else if (step < 0) {
      d[i0] = Math.ceil(start * step) / step;
      d[i1] = Math.floor(stop * step) / step;
      domain(d);
    }

    return scale;
  };

  return scale;
}

function linear() {
  var scale = continuous(deinterpolateLinear, reinterpolate);

  scale.copy = function () {
    return copy(scale, linear());
  };

  return linearish(scale);
}

var nice = function (domain, interval) {
  domain = domain.slice();

  var i0 = 0,
      i1 = domain.length - 1,
      x0 = domain[i0],
      x1 = domain[i1],
      t;

  if (x1 < x0) {
    t = i0, i0 = i1, i1 = t;
    t = x0, x0 = x1, x1 = t;
  }

  domain[i0] = interval.floor(x0);
  domain[i1] = interval.ceil(x1);
  return domain;
};

function deinterpolate(a, b) {
  return (b = Math.log(b / a)) ? function (x) {
    return Math.log(x / a) / b;
  } : constant$4(b);
}

function reinterpolate$1(a, b) {
  return a < 0 ? function (t) {
    return -Math.pow(-b, t) * Math.pow(-a, 1 - t);
  } : function (t) {
    return Math.pow(b, t) * Math.pow(a, 1 - t);
  };
}

function pow10(x) {
  return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
}

function powp(base) {
  return base === 10 ? pow10 : base === Math.E ? Math.exp : function (x) {
    return Math.pow(base, x);
  };
}

function logp(base) {
  return base === Math.E ? Math.log : base === 10 && Math.log10 || base === 2 && Math.log2 || (base = Math.log(base), function (x) {
    return Math.log(x) / base;
  });
}

function reflect(f) {
  return function (x) {
    return -f(-x);
  };
}

function log() {
  var scale = continuous(deinterpolate, reinterpolate$1).domain([1, 10]),
      domain = scale.domain,
      base = 10,
      logs = logp(10),
      pows = powp(10);

  function rescale() {
    logs = logp(base), pows = powp(base);
    if (domain()[0] < 0) logs = reflect(logs), pows = reflect(pows);
    return scale;
  }

  scale.base = function (_) {
    return arguments.length ? (base = +_, rescale()) : base;
  };

  scale.domain = function (_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.ticks = function (count) {
    var d = domain(),
        u = d[0],
        v = d[d.length - 1],
        r;

    if (r = v < u) i = u, u = v, v = i;

    var i = logs(u),
        j = logs(v),
        p,
        k,
        t,
        n = count == null ? 10 : +count,
        z = [];

    if (!(base % 1) && j - i < n) {
      i = Math.round(i) - 1, j = Math.round(j) + 1;
      if (u > 0) for (; i < j; ++i) {
        for (k = 1, p = pows(i); k < base; ++k) {
          t = p * k;
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      } else for (; i < j; ++i) {
        for (k = base - 1, p = pows(i); k >= 1; --k) {
          t = p * k;
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      }
    } else {
      z = ticks(i, j, Math.min(j - i, n)).map(pows);
    }

    return r ? z.reverse() : z;
  };

  scale.tickFormat = function (count, specifier) {
    if (specifier == null) specifier = base === 10 ? ".0e" : ",";
    if (typeof specifier !== "function") specifier = format(specifier);
    if (count === Infinity) return specifier;
    if (count == null) count = 10;
    var k = Math.max(1, base * count / scale.ticks().length); // TODO fast estimate?
    return function (d) {
      var i = d / pows(Math.round(logs(d)));
      if (i * base < base - 0.5) i *= base;
      return i <= k ? specifier(d) : "";
    };
  };

  scale.nice = function () {
    return domain(nice(domain(), {
      floor: function (x) {
        return pows(Math.floor(logs(x)));
      },
      ceil: function (x) {
        return pows(Math.ceil(logs(x)));
      }
    }));
  };

  scale.copy = function () {
    return copy(scale, log().base(base));
  };

  return scale;
}

var t0$1 = new Date();
var t1$1 = new Date();

function newInterval(floori, offseti, count, field) {

  function interval(date) {
    return floori(date = new Date(+date)), date;
  }

  interval.floor = interval;

  interval.ceil = function (date) {
    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
  };

  interval.round = function (date) {
    var d0 = interval(date),
        d1 = interval.ceil(date);
    return date - d0 < d1 - date ? d0 : d1;
  };

  interval.offset = function (date, step) {
    return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
  };

  interval.range = function (start, stop, step) {
    var range = [],
        previous;
    start = interval.ceil(start);
    step = step == null ? 1 : Math.floor(step);
    if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
    do range.push(previous = new Date(+start)), offseti(start, step), floori(start); while (previous < start && start < stop);
    return range;
  };

  interval.filter = function (test) {
    return newInterval(function (date) {
      if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
    }, function (date, step) {
      if (date >= date) {
        if (step < 0) while (++step <= 0) {
          while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
        } else while (--step >= 0) {
          while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
        }
      }
    });
  };

  if (count) {
    interval.count = function (start, end) {
      t0$1.setTime(+start), t1$1.setTime(+end);
      floori(t0$1), floori(t1$1);
      return Math.floor(count(t0$1, t1$1));
    };

    interval.every = function (step) {
      step = Math.floor(step);
      return !isFinite(step) || !(step > 0) ? null : !(step > 1) ? interval : interval.filter(field ? function (d) {
        return field(d) % step === 0;
      } : function (d) {
        return interval.count(0, d) % step === 0;
      });
    };
  }

  return interval;
}

var millisecond = newInterval(function () {
  // noop
}, function (date, step) {
  date.setTime(+date + step);
}, function (start, end) {
  return end - start;
});

// An optimized implementation for this simple case.
millisecond.every = function (k) {
  k = Math.floor(k);
  if (!isFinite(k) || !(k > 0)) return null;
  if (!(k > 1)) return millisecond;
  return newInterval(function (date) {
    date.setTime(Math.floor(date / k) * k);
  }, function (date, step) {
    date.setTime(+date + step * k);
  }, function (start, end) {
    return (end - start) / k;
  });
};

var durationSecond$1 = 1e3;
var durationMinute$1 = 6e4;
var durationHour$1 = 36e5;
var durationDay$1 = 864e5;
var durationWeek$1 = 6048e5;

var second = newInterval(function (date) {
  date.setTime(Math.floor(date / durationSecond$1) * durationSecond$1);
}, function (date, step) {
  date.setTime(+date + step * durationSecond$1);
}, function (start, end) {
  return (end - start) / durationSecond$1;
}, function (date) {
  return date.getUTCSeconds();
});

var minute = newInterval(function (date) {
  date.setTime(Math.floor(date / durationMinute$1) * durationMinute$1);
}, function (date, step) {
  date.setTime(+date + step * durationMinute$1);
}, function (start, end) {
  return (end - start) / durationMinute$1;
}, function (date) {
  return date.getMinutes();
});

var hour = newInterval(function (date) {
  var offset = date.getTimezoneOffset() * durationMinute$1 % durationHour$1;
  if (offset < 0) offset += durationHour$1;
  date.setTime(Math.floor((+date - offset) / durationHour$1) * durationHour$1 + offset);
}, function (date, step) {
  date.setTime(+date + step * durationHour$1);
}, function (start, end) {
  return (end - start) / durationHour$1;
}, function (date) {
  return date.getHours();
});

var day = newInterval(function (date) {
  date.setHours(0, 0, 0, 0);
}, function (date, step) {
  date.setDate(date.getDate() + step);
}, function (start, end) {
  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute$1) / durationDay$1;
}, function (date) {
  return date.getDate() - 1;
});

function weekday(i) {
  return newInterval(function (date) {
    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    date.setHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setDate(date.getDate() + step * 7);
  }, function (start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute$1) / durationWeek$1;
  });
}

var sunday = weekday(0);
var monday = weekday(1);
var tuesday = weekday(2);
var wednesday = weekday(3);
var thursday = weekday(4);
var friday = weekday(5);
var saturday = weekday(6);

var month = newInterval(function (date) {
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
}, function (date, step) {
  date.setMonth(date.getMonth() + step);
}, function (start, end) {
  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}, function (date) {
  return date.getMonth();
});

var year = newInterval(function (date) {
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
}, function (date, step) {
  date.setFullYear(date.getFullYear() + step);
}, function (start, end) {
  return end.getFullYear() - start.getFullYear();
}, function (date) {
  return date.getFullYear();
});

// An optimized implementation for this simple case.
year.every = function (k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function (date) {
    date.setFullYear(Math.floor(date.getFullYear() / k) * k);
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setFullYear(date.getFullYear() + step * k);
  });
};

var utcMinute = newInterval(function (date) {
  date.setUTCSeconds(0, 0);
}, function (date, step) {
  date.setTime(+date + step * durationMinute$1);
}, function (start, end) {
  return (end - start) / durationMinute$1;
}, function (date) {
  return date.getUTCMinutes();
});

var utcHour = newInterval(function (date) {
  date.setUTCMinutes(0, 0, 0);
}, function (date, step) {
  date.setTime(+date + step * durationHour$1);
}, function (start, end) {
  return (end - start) / durationHour$1;
}, function (date) {
  return date.getUTCHours();
});

var utcDay = newInterval(function (date) {
  date.setUTCHours(0, 0, 0, 0);
}, function (date, step) {
  date.setUTCDate(date.getUTCDate() + step);
}, function (start, end) {
  return (end - start) / durationDay$1;
}, function (date) {
  return date.getUTCDate() - 1;
});

function utcWeekday(i) {
  return newInterval(function (date) {
    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    date.setUTCHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setUTCDate(date.getUTCDate() + step * 7);
  }, function (start, end) {
    return (end - start) / durationWeek$1;
  });
}

var utcSunday = utcWeekday(0);
var utcMonday = utcWeekday(1);
var utcTuesday = utcWeekday(2);
var utcWednesday = utcWeekday(3);
var utcThursday = utcWeekday(4);
var utcFriday = utcWeekday(5);
var utcSaturday = utcWeekday(6);

var utcMonth = newInterval(function (date) {
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
}, function (date, step) {
  date.setUTCMonth(date.getUTCMonth() + step);
}, function (start, end) {
  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}, function (date) {
  return date.getUTCMonth();
});

var utcYear = newInterval(function (date) {
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
}, function (date, step) {
  date.setUTCFullYear(date.getUTCFullYear() + step);
}, function (start, end) {
  return end.getUTCFullYear() - start.getUTCFullYear();
}, function (date) {
  return date.getUTCFullYear();
});

// An optimized implementation for this simple case.
utcYear.every = function (k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function (date) {
    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step * k);
  });
};

function localDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
    date.setFullYear(d.y);
    return date;
  }
  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
}

function utcDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
    date.setUTCFullYear(d.y);
    return date;
  }
  return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
}

function newYear(y) {
  return { y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0 };
}

function formatLocale$1(locale) {
  var locale_dateTime = locale.dateTime,
      locale_date = locale.date,
      locale_time = locale.time,
      locale_periods = locale.periods,
      locale_weekdays = locale.days,
      locale_shortWeekdays = locale.shortDays,
      locale_months = locale.months,
      locale_shortMonths = locale.shortMonths;

  var periodRe = formatRe(locale_periods),
      periodLookup = formatLookup(locale_periods),
      weekdayRe = formatRe(locale_weekdays),
      weekdayLookup = formatLookup(locale_weekdays),
      shortWeekdayRe = formatRe(locale_shortWeekdays),
      shortWeekdayLookup = formatLookup(locale_shortWeekdays),
      monthRe = formatRe(locale_months),
      monthLookup = formatLookup(locale_months),
      shortMonthRe = formatRe(locale_shortMonths),
      shortMonthLookup = formatLookup(locale_shortMonths);

  var formats = {
    "a": formatShortWeekday,
    "A": formatWeekday,
    "b": formatShortMonth,
    "B": formatMonth,
    "c": null,
    "d": formatDayOfMonth,
    "e": formatDayOfMonth,
    "f": formatMicroseconds,
    "H": formatHour24,
    "I": formatHour12,
    "j": formatDayOfYear,
    "L": formatMilliseconds,
    "m": formatMonthNumber,
    "M": formatMinutes,
    "p": formatPeriod,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatSeconds,
    "u": formatWeekdayNumberMonday,
    "U": formatWeekNumberSunday,
    "V": formatWeekNumberISO,
    "w": formatWeekdayNumberSunday,
    "W": formatWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatYear,
    "Y": formatFullYear,
    "Z": formatZone,
    "%": formatLiteralPercent
  };

  var utcFormats = {
    "a": formatUTCShortWeekday,
    "A": formatUTCWeekday,
    "b": formatUTCShortMonth,
    "B": formatUTCMonth,
    "c": null,
    "d": formatUTCDayOfMonth,
    "e": formatUTCDayOfMonth,
    "f": formatUTCMicroseconds,
    "H": formatUTCHour24,
    "I": formatUTCHour12,
    "j": formatUTCDayOfYear,
    "L": formatUTCMilliseconds,
    "m": formatUTCMonthNumber,
    "M": formatUTCMinutes,
    "p": formatUTCPeriod,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatUTCSeconds,
    "u": formatUTCWeekdayNumberMonday,
    "U": formatUTCWeekNumberSunday,
    "V": formatUTCWeekNumberISO,
    "w": formatUTCWeekdayNumberSunday,
    "W": formatUTCWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatUTCYear,
    "Y": formatUTCFullYear,
    "Z": formatUTCZone,
    "%": formatLiteralPercent
  };

  var parses = {
    "a": parseShortWeekday,
    "A": parseWeekday,
    "b": parseShortMonth,
    "B": parseMonth,
    "c": parseLocaleDateTime,
    "d": parseDayOfMonth,
    "e": parseDayOfMonth,
    "f": parseMicroseconds,
    "H": parseHour24,
    "I": parseHour24,
    "j": parseDayOfYear,
    "L": parseMilliseconds,
    "m": parseMonthNumber,
    "M": parseMinutes,
    "p": parsePeriod,
    "Q": parseUnixTimestamp,
    "s": parseUnixTimestampSeconds,
    "S": parseSeconds,
    "u": parseWeekdayNumberMonday,
    "U": parseWeekNumberSunday,
    "V": parseWeekNumberISO,
    "w": parseWeekdayNumberSunday,
    "W": parseWeekNumberMonday,
    "x": parseLocaleDate,
    "X": parseLocaleTime,
    "y": parseYear,
    "Y": parseFullYear,
    "Z": parseZone,
    "%": parseLiteralPercent
  };

  // These recursive directive definitions must be deferred.
  formats.x = newFormat(locale_date, formats);
  formats.X = newFormat(locale_time, formats);
  formats.c = newFormat(locale_dateTime, formats);
  utcFormats.x = newFormat(locale_date, utcFormats);
  utcFormats.X = newFormat(locale_time, utcFormats);
  utcFormats.c = newFormat(locale_dateTime, utcFormats);

  function newFormat(specifier, formats) {
    return function (date) {
      var string = [],
          i = -1,
          j = 0,
          n = specifier.length,
          c,
          pad,
          format;

      if (!(date instanceof Date)) date = new Date(+date);

      while (++i < n) {
        if (specifier.charCodeAt(i) === 37) {
          string.push(specifier.slice(j, i));
          if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);else pad = c === "e" ? " " : "0";
          if (format = formats[c]) c = format(date, pad);
          string.push(c);
          j = i + 1;
        }
      }

      string.push(specifier.slice(j, i));
      return string.join("");
    };
  }

  function newParse(specifier, newDate) {
    return function (string) {
      var d = newYear(1900),
          i = parseSpecifier(d, specifier, string += "", 0),
          week,
          day$$1;
      if (i != string.length) return null;

      // If a UNIX timestamp is specified, return it.
      if ("Q" in d) return new Date(d.Q);

      // The am-pm flag is 0 for AM, and 1 for PM.
      if ("p" in d) d.H = d.H % 12 + d.p * 12;

      // Convert day-of-week and week-of-year to day-of-year.
      if ("V" in d) {
        if (d.V < 1 || d.V > 53) return null;
        if (!("w" in d)) d.w = 1;
        if ("Z" in d) {
          week = utcDate(newYear(d.y)), day$$1 = week.getUTCDay();
          week = day$$1 > 4 || day$$1 === 0 ? utcMonday.ceil(week) : utcMonday(week);
          week = utcDay.offset(week, (d.V - 1) * 7);
          d.y = week.getUTCFullYear();
          d.m = week.getUTCMonth();
          d.d = week.getUTCDate() + (d.w + 6) % 7;
        } else {
          week = newDate(newYear(d.y)), day$$1 = week.getDay();
          week = day$$1 > 4 || day$$1 === 0 ? monday.ceil(week) : monday(week);
          week = day.offset(week, (d.V - 1) * 7);
          d.y = week.getFullYear();
          d.m = week.getMonth();
          d.d = week.getDate() + (d.w + 6) % 7;
        }
      } else if ("W" in d || "U" in d) {
        if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
        day$$1 = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
        d.m = 0;
        d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$$1 + 5) % 7 : d.w + d.U * 7 - (day$$1 + 6) % 7;
      }

      // If a time zone is specified, all fields are interpreted as UTC and then
      // offset according to the specified time zone.
      if ("Z" in d) {
        d.H += d.Z / 100 | 0;
        d.M += d.Z % 100;
        return utcDate(d);
      }

      // Otherwise, all fields are in local time.
      return newDate(d);
    };
  }

  function parseSpecifier(d, specifier, string, j) {
    var i = 0,
        n = specifier.length,
        m = string.length,
        c,
        parse;

    while (i < n) {
      if (j >= m) return -1;
      c = specifier.charCodeAt(i++);
      if (c === 37) {
        c = specifier.charAt(i++);
        parse = parses[c in pads ? specifier.charAt(i++) : c];
        if (!parse || (j = parse(d, string, j)) < 0) return -1;
      } else if (c != string.charCodeAt(j++)) {
        return -1;
      }
    }

    return j;
  }

  function parsePeriod(d, string, i) {
    var n = periodRe.exec(string.slice(i));
    return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseShortWeekday(d, string, i) {
    var n = shortWeekdayRe.exec(string.slice(i));
    return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseWeekday(d, string, i) {
    var n = weekdayRe.exec(string.slice(i));
    return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseShortMonth(d, string, i) {
    var n = shortMonthRe.exec(string.slice(i));
    return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseMonth(d, string, i) {
    var n = monthRe.exec(string.slice(i));
    return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseLocaleDateTime(d, string, i) {
    return parseSpecifier(d, locale_dateTime, string, i);
  }

  function parseLocaleDate(d, string, i) {
    return parseSpecifier(d, locale_date, string, i);
  }

  function parseLocaleTime(d, string, i) {
    return parseSpecifier(d, locale_time, string, i);
  }

  function formatShortWeekday(d) {
    return locale_shortWeekdays[d.getDay()];
  }

  function formatWeekday(d) {
    return locale_weekdays[d.getDay()];
  }

  function formatShortMonth(d) {
    return locale_shortMonths[d.getMonth()];
  }

  function formatMonth(d) {
    return locale_months[d.getMonth()];
  }

  function formatPeriod(d) {
    return locale_periods[+(d.getHours() >= 12)];
  }

  function formatUTCShortWeekday(d) {
    return locale_shortWeekdays[d.getUTCDay()];
  }

  function formatUTCWeekday(d) {
    return locale_weekdays[d.getUTCDay()];
  }

  function formatUTCShortMonth(d) {
    return locale_shortMonths[d.getUTCMonth()];
  }

  function formatUTCMonth(d) {
    return locale_months[d.getUTCMonth()];
  }

  function formatUTCPeriod(d) {
    return locale_periods[+(d.getUTCHours() >= 12)];
  }

  return {
    format: function (specifier) {
      var f = newFormat(specifier += "", formats);
      f.toString = function () {
        return specifier;
      };
      return f;
    },
    parse: function (specifier) {
      var p = newParse(specifier += "", localDate);
      p.toString = function () {
        return specifier;
      };
      return p;
    },
    utcFormat: function (specifier) {
      var f = newFormat(specifier += "", utcFormats);
      f.toString = function () {
        return specifier;
      };
      return f;
    },
    utcParse: function (specifier) {
      var p = newParse(specifier, utcDate);
      p.toString = function () {
        return specifier;
      };
      return p;
    }
  };
}

var pads = { "-": "", "_": " ", "0": "0" };
var numberRe = /^\s*\d+/;
var percentRe = /^%/;
var requoteRe = /[\\^$*+?|[\]().{}]/g;

function pad(value, fill, width) {
  var sign = value < 0 ? "-" : "",
      string = (sign ? -value : value) + "",
      length = string.length;
  return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
}

function requote(s) {
  return s.replace(requoteRe, "\\$&");
}

function formatRe(names) {
  return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
}

function formatLookup(names) {
  var map = {},
      i = -1,
      n = names.length;
  while (++i < n) map[names[i].toLowerCase()] = i;
  return map;
}

function parseWeekdayNumberSunday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.w = +n[0], i + n[0].length) : -1;
}

function parseWeekdayNumberMonday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.u = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberSunday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.U = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberISO(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.V = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberMonday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.W = +n[0], i + n[0].length) : -1;
}

function parseFullYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 4));
  return n ? (d.y = +n[0], i + n[0].length) : -1;
}

function parseYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
}

function parseZone(d, string, i) {
  var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
  return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
}

function parseMonthNumber(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
}

function parseDayOfMonth(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.d = +n[0], i + n[0].length) : -1;
}

function parseDayOfYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
}

function parseHour24(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.H = +n[0], i + n[0].length) : -1;
}

function parseMinutes(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.M = +n[0], i + n[0].length) : -1;
}

function parseSeconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.S = +n[0], i + n[0].length) : -1;
}

function parseMilliseconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.L = +n[0], i + n[0].length) : -1;
}

function parseMicroseconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 6));
  return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
}

function parseLiteralPercent(d, string, i) {
  var n = percentRe.exec(string.slice(i, i + 1));
  return n ? i + n[0].length : -1;
}

function parseUnixTimestamp(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.Q = +n[0], i + n[0].length) : -1;
}

function parseUnixTimestampSeconds(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.Q = +n[0] * 1000, i + n[0].length) : -1;
}

function formatDayOfMonth(d, p) {
  return pad(d.getDate(), p, 2);
}

function formatHour24(d, p) {
  return pad(d.getHours(), p, 2);
}

function formatHour12(d, p) {
  return pad(d.getHours() % 12 || 12, p, 2);
}

function formatDayOfYear(d, p) {
  return pad(1 + day.count(year(d), d), p, 3);
}

function formatMilliseconds(d, p) {
  return pad(d.getMilliseconds(), p, 3);
}

function formatMicroseconds(d, p) {
  return formatMilliseconds(d, p) + "000";
}

function formatMonthNumber(d, p) {
  return pad(d.getMonth() + 1, p, 2);
}

function formatMinutes(d, p) {
  return pad(d.getMinutes(), p, 2);
}

function formatSeconds(d, p) {
  return pad(d.getSeconds(), p, 2);
}

function formatWeekdayNumberMonday(d) {
  var day$$1 = d.getDay();
  return day$$1 === 0 ? 7 : day$$1;
}

function formatWeekNumberSunday(d, p) {
  return pad(sunday.count(year(d), d), p, 2);
}

function formatWeekNumberISO(d, p) {
  var day$$1 = d.getDay();
  d = day$$1 >= 4 || day$$1 === 0 ? thursday(d) : thursday.ceil(d);
  return pad(thursday.count(year(d), d) + (year(d).getDay() === 4), p, 2);
}

function formatWeekdayNumberSunday(d) {
  return d.getDay();
}

function formatWeekNumberMonday(d, p) {
  return pad(monday.count(year(d), d), p, 2);
}

function formatYear(d, p) {
  return pad(d.getFullYear() % 100, p, 2);
}

function formatFullYear(d, p) {
  return pad(d.getFullYear() % 10000, p, 4);
}

function formatZone(d) {
  var z = d.getTimezoneOffset();
  return (z > 0 ? "-" : (z *= -1, "+")) + pad(z / 60 | 0, "0", 2) + pad(z % 60, "0", 2);
}

function formatUTCDayOfMonth(d, p) {
  return pad(d.getUTCDate(), p, 2);
}

function formatUTCHour24(d, p) {
  return pad(d.getUTCHours(), p, 2);
}

function formatUTCHour12(d, p) {
  return pad(d.getUTCHours() % 12 || 12, p, 2);
}

function formatUTCDayOfYear(d, p) {
  return pad(1 + utcDay.count(utcYear(d), d), p, 3);
}

function formatUTCMilliseconds(d, p) {
  return pad(d.getUTCMilliseconds(), p, 3);
}

function formatUTCMicroseconds(d, p) {
  return formatUTCMilliseconds(d, p) + "000";
}

function formatUTCMonthNumber(d, p) {
  return pad(d.getUTCMonth() + 1, p, 2);
}

function formatUTCMinutes(d, p) {
  return pad(d.getUTCMinutes(), p, 2);
}

function formatUTCSeconds(d, p) {
  return pad(d.getUTCSeconds(), p, 2);
}

function formatUTCWeekdayNumberMonday(d) {
  var dow = d.getUTCDay();
  return dow === 0 ? 7 : dow;
}

function formatUTCWeekNumberSunday(d, p) {
  return pad(utcSunday.count(utcYear(d), d), p, 2);
}

function formatUTCWeekNumberISO(d, p) {
  var day$$1 = d.getUTCDay();
  d = day$$1 >= 4 || day$$1 === 0 ? utcThursday(d) : utcThursday.ceil(d);
  return pad(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
}

function formatUTCWeekdayNumberSunday(d) {
  return d.getUTCDay();
}

function formatUTCWeekNumberMonday(d, p) {
  return pad(utcMonday.count(utcYear(d), d), p, 2);
}

function formatUTCYear(d, p) {
  return pad(d.getUTCFullYear() % 100, p, 2);
}

function formatUTCFullYear(d, p) {
  return pad(d.getUTCFullYear() % 10000, p, 4);
}

function formatUTCZone() {
  return "+0000";
}

function formatLiteralPercent() {
  return "%";
}

function formatUnixTimestamp(d) {
  return +d;
}

function formatUnixTimestampSeconds(d) {
  return Math.floor(+d / 1000);
}

var locale$1;
var timeFormat;
var timeParse;
var utcFormat;
var utcParse;

defaultLocale$1({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});

function defaultLocale$1(definition) {
  locale$1 = formatLocale$1(definition);
  timeFormat = locale$1.format;
  timeParse = locale$1.parse;
  utcFormat = locale$1.utcFormat;
  utcParse = locale$1.utcParse;
  return locale$1;
}

var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

function formatIsoNative(date) {
    return date.toISOString();
}

var formatIso = Date.prototype.toISOString ? formatIsoNative : utcFormat(isoSpecifier);

function parseIsoNative(string) {
  var date = new Date(string);
  return isNaN(date) ? null : date;
}

var parseIso = +new Date("2000-01-01T00:00:00.000Z") ? parseIsoNative : utcParse(isoSpecifier);

var colors = function (s) {
  return s.match(/.{6}/g).map(function (x) {
    return "#" + x;
  });
};

colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

colors("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6");

colors("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9");

colors("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");

cubehelixLong(cubehelix(300, 0.5, 0.0), cubehelix(-240, 0.5, 1.0));

var warm = cubehelixLong(cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

var cool = cubehelixLong(cubehelix(260, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

var rainbow = cubehelix();

function ramp(range) {
  var n = range.length;
  return function (t) {
    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
  };
}

ramp(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

var magma = ramp(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

var inferno = ramp(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

var plasma = ramp(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

function sequential(interpolator) {
  var x0 = 0,
      x1 = 1,
      clamp = false;

  function scale(x) {
    var t = (x - x0) / (x1 - x0);
    return interpolator(clamp ? Math.max(0, Math.min(1, t)) : t);
  }

  scale.domain = function (_) {
    return arguments.length ? (x0 = +_[0], x1 = +_[1], scale) : [x0, x1];
  };

  scale.clamp = function (_) {
    return arguments.length ? (clamp = !!_, scale) : clamp;
  };

  scale.interpolator = function (_) {
    return arguments.length ? (interpolator = _, scale) : interpolator;
  };

  scale.copy = function () {
    return sequential(interpolator).domain([x0, x1]).clamp(clamp);
  };

  return linearish(scale);
}

const sortBy$1 = require('lodash/fp/sortBy');
const flow = require('lodash/fp/flow');
const concat = require('lodash/fp/concat');
const filter = require('lodash/fp/filter');
const first = require('lodash/fp/first');
const reverse$1 = require('lodash/fp/reverse');
function smartBorders(conf, layout, tracks) {
  const width = conf.defaultTrackWidth || 30;

  const externalTrack = flow(filter('conf.outerRadius'), sortBy$1('conf.outerRadius'), reverse$1, first)(concat(tracks, layout));

  return {
    in: externalTrack.conf.outerRadius,
    out: externalTrack.conf.outerRadius + width
  };
}



function buildScale(min, max, height, logScale = false, logScaleBase = Math.E) {
  if (logScale && min * max <= 0) {
    console.warn(`As log(0) = -∞, a log scale domain must be
      strictly-positive or strictly-negative. logscale ignored`);
  }
  const scale = logScale && min * max > 0 ? log().base(logScaleBase) : linear();

  return scale.domain([min, max]).range([0, height]).clamp(true);
}

const cloneDeep$1 = require('lodash/cloneDeep');
const forEach$4 = require('lodash/forEach');
const isFunction = require('lodash/isFunction');
const assign$1 = require('lodash/assign');
const buildConf = (userConf = {}, defaultConf) => {
  let conf = {};
  forEach$4(defaultConf, (item, key) => {
    // if it's a leaf
    if (item.iteratee !== undefined) {
      if (!item.iteratee) {
        conf[key] = Object.keys(userConf).indexOf(key) > -1 ? userConf[key] : item.value;
      } else if (Object.keys(userConf).indexOf(key) > -1) {
        if (isFunction(userConf[key])) {
          conf[key] = userConf[key];
        } else {
          conf[key] = userConf[key];
        }
      } else {
        conf[key] = () => item.value;
      }
      // else we go deeper
    } else {
      conf[key] = buildConf(userConf[key], item);
    }
  });

  return conf;
};

const computeMinMax = (conf, meta) => {
  return {
    cmin: conf.min === null ? meta.min : conf.min,
    cmax: conf.max === null ? meta.max : conf.max
  };
};

const computeRadius = (conf, instance) => {
  if (conf.innerRadius === 0 && conf.outerRadius === 0) {
    const borders = smartBorders(conf, instance._layout, instance.tracks);
    return {
      innerRadius: borders.in,
      outerRadius: borders.out
    };
  }
  if (conf.innerRadius <= 1 && conf.outerRadius <= 1) {
    return {
      innerRadius: conf.innerRadius * instance._layout.conf.innerRadius,
      outerRadius: conf.outerRadius * instance._layout.conf.innerRadius
    };
  }
  if (conf.innerRadius <= 10 && conf.outerRadius <= 10) {
    return {
      innerRadius: conf.innerRadius * instance._layout.conf.outerRadius,
      outerRadius: conf.outerRadius * instance._layout.conf.outerRadius
    };
  }
};

const getConf = (userConf, defaultConf, meta, instance) => {
  let conf = buildConf(userConf, cloneDeep$1(defaultConf));
  assign$1(conf, computeMinMax(conf, meta), computeRadius(conf, instance));
  return conf;
};

var colors$1 = function (specifier) {
  var n = specifier.length / 6 | 0,
      colors = new Array(n),
      i = 0;
  while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
  return colors;
};

colors$1("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

colors$1("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666");

colors$1("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666");

colors$1("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928");

colors$1("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2");

colors$1("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc");

colors$1("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999");

colors$1("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3");

colors$1("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f");

var ramp$1 = function (scheme) {
  return rgbBasis(scheme[scheme.length - 1]);
};

var scheme = new Array(3).concat("d8b365f5f5f55ab4ac", "a6611adfc27d80cdc1018571", "a6611adfc27df5f5f580cdc1018571", "8c510ad8b365f6e8c3c7eae55ab4ac01665e", "8c510ad8b365f6e8c3f5f5f5c7eae55ab4ac01665e", "8c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e", "8c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e", "5430058c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e003c30", "5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30").map(colors$1);

var interpolateBrBG = ramp$1(scheme);

var scheme$1 = new Array(3).concat("af8dc3f7f7f77fbf7b", "7b3294c2a5cfa6dba0008837", "7b3294c2a5cff7f7f7a6dba0008837", "762a83af8dc3e7d4e8d9f0d37fbf7b1b7837", "762a83af8dc3e7d4e8f7f7f7d9f0d37fbf7b1b7837", "762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b7837", "762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b7837", "40004b762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b783700441b", "40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b").map(colors$1);

var interpolatePRGn = ramp$1(scheme$1);

var scheme$2 = new Array(3).concat("e9a3c9f7f7f7a1d76a", "d01c8bf1b6dab8e1864dac26", "d01c8bf1b6daf7f7f7b8e1864dac26", "c51b7de9a3c9fde0efe6f5d0a1d76a4d9221", "c51b7de9a3c9fde0eff7f7f7e6f5d0a1d76a4d9221", "c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221", "c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221", "8e0152c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221276419", "8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419").map(colors$1);

var interpolatePiYG = ramp$1(scheme$2);

var scheme$3 = new Array(3).concat("998ec3f7f7f7f1a340", "5e3c99b2abd2fdb863e66101", "5e3c99b2abd2f7f7f7fdb863e66101", "542788998ec3d8daebfee0b6f1a340b35806", "542788998ec3d8daebf7f7f7fee0b6f1a340b35806", "5427888073acb2abd2d8daebfee0b6fdb863e08214b35806", "5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b35806", "2d004b5427888073acb2abd2d8daebfee0b6fdb863e08214b358067f3b08", "2d004b5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b358067f3b08").map(colors$1);

var interpolatePuOr = ramp$1(scheme$3);

var scheme$4 = new Array(3).concat("ef8a62f7f7f767a9cf", "ca0020f4a58292c5de0571b0", "ca0020f4a582f7f7f792c5de0571b0", "b2182bef8a62fddbc7d1e5f067a9cf2166ac", "b2182bef8a62fddbc7f7f7f7d1e5f067a9cf2166ac", "b2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac", "b2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac", "67001fb2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac053061", "67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061").map(colors$1);

var interpolateRdBu = ramp$1(scheme$4);

var scheme$5 = new Array(3).concat("ef8a62ffffff999999", "ca0020f4a582bababa404040", "ca0020f4a582ffffffbababa404040", "b2182bef8a62fddbc7e0e0e09999994d4d4d", "b2182bef8a62fddbc7ffffffe0e0e09999994d4d4d", "b2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d", "b2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d", "67001fb2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d1a1a1a", "67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a").map(colors$1);

var interpolateRdGy = ramp$1(scheme$5);

var scheme$6 = new Array(3).concat("fc8d59ffffbf91bfdb", "d7191cfdae61abd9e92c7bb6", "d7191cfdae61ffffbfabd9e92c7bb6", "d73027fc8d59fee090e0f3f891bfdb4575b4", "d73027fc8d59fee090ffffbfe0f3f891bfdb4575b4", "d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4", "d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4", "a50026d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4313695", "a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695").map(colors$1);

var interpolateRdYlBu = ramp$1(scheme$6);

var scheme$7 = new Array(3).concat("fc8d59ffffbf91cf60", "d7191cfdae61a6d96a1a9641", "d7191cfdae61ffffbfa6d96a1a9641", "d73027fc8d59fee08bd9ef8b91cf601a9850", "d73027fc8d59fee08bffffbfd9ef8b91cf601a9850", "d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850", "d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850", "a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837", "a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837").map(colors$1);

var interpolateRdYlGn = ramp$1(scheme$7);

var scheme$8 = new Array(3).concat("fc8d59ffffbf99d594", "d7191cfdae61abdda42b83ba", "d7191cfdae61ffffbfabdda42b83ba", "d53e4ffc8d59fee08be6f59899d5943288bd", "d53e4ffc8d59fee08bffffbfe6f59899d5943288bd", "d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd", "d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd", "9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2", "9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2").map(colors$1);

var interpolateSpectral = ramp$1(scheme$8);

var scheme$9 = new Array(3).concat("e5f5f999d8c92ca25f", "edf8fbb2e2e266c2a4238b45", "edf8fbb2e2e266c2a42ca25f006d2c", "edf8fbccece699d8c966c2a42ca25f006d2c", "edf8fbccece699d8c966c2a441ae76238b45005824", "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824", "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b").map(colors$1);

var interpolateBuGn = ramp$1(scheme$9);

var scheme$10 = new Array(3).concat("e0ecf49ebcda8856a7", "edf8fbb3cde38c96c688419d", "edf8fbb3cde38c96c68856a7810f7c", "edf8fbbfd3e69ebcda8c96c68856a7810f7c", "edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b", "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b", "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b").map(colors$1);

var interpolateBuPu = ramp$1(scheme$10);

var scheme$11 = new Array(3).concat("e0f3dba8ddb543a2ca", "f0f9e8bae4bc7bccc42b8cbe", "f0f9e8bae4bc7bccc443a2ca0868ac", "f0f9e8ccebc5a8ddb57bccc443a2ca0868ac", "f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e", "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e", "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081").map(colors$1);

var interpolateGnBu = ramp$1(scheme$11);

var scheme$12 = new Array(3).concat("fee8c8fdbb84e34a33", "fef0d9fdcc8afc8d59d7301f", "fef0d9fdcc8afc8d59e34a33b30000", "fef0d9fdd49efdbb84fc8d59e34a33b30000", "fef0d9fdd49efdbb84fc8d59ef6548d7301f990000", "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000", "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000").map(colors$1);

var interpolateOrRd = ramp$1(scheme$12);

var scheme$13 = new Array(3).concat("ece2f0a6bddb1c9099", "f6eff7bdc9e167a9cf02818a", "f6eff7bdc9e167a9cf1c9099016c59", "f6eff7d0d1e6a6bddb67a9cf1c9099016c59", "f6eff7d0d1e6a6bddb67a9cf3690c002818a016450", "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450", "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636").map(colors$1);

var interpolatePuBuGn = ramp$1(scheme$13);

var scheme$14 = new Array(3).concat("ece7f2a6bddb2b8cbe", "f1eef6bdc9e174a9cf0570b0", "f1eef6bdc9e174a9cf2b8cbe045a8d", "f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d", "f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b", "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b", "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858").map(colors$1);

var interpolatePuBu = ramp$1(scheme$14);

var scheme$15 = new Array(3).concat("e7e1efc994c7dd1c77", "f1eef6d7b5d8df65b0ce1256", "f1eef6d7b5d8df65b0dd1c77980043", "f1eef6d4b9dac994c7df65b0dd1c77980043", "f1eef6d4b9dac994c7df65b0e7298ace125691003f", "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f", "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f").map(colors$1);

var interpolatePuRd = ramp$1(scheme$15);

var scheme$16 = new Array(3).concat("fde0ddfa9fb5c51b8a", "feebe2fbb4b9f768a1ae017e", "feebe2fbb4b9f768a1c51b8a7a0177", "feebe2fcc5c0fa9fb5f768a1c51b8a7a0177", "feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177", "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177", "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a").map(colors$1);

var interpolateRdPu = ramp$1(scheme$16);

var scheme$17 = new Array(3).concat("edf8b17fcdbb2c7fb8", "ffffcca1dab441b6c4225ea8", "ffffcca1dab441b6c42c7fb8253494", "ffffccc7e9b47fcdbb41b6c42c7fb8253494", "ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84", "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84", "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58").map(colors$1);

var interpolateYlGnBu = ramp$1(scheme$17);

var scheme$18 = new Array(3).concat("f7fcb9addd8e31a354", "ffffccc2e69978c679238443", "ffffccc2e69978c67931a354006837", "ffffccd9f0a3addd8e78c67931a354006837", "ffffccd9f0a3addd8e78c67941ab5d238443005a32", "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32", "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529").map(colors$1);

var interpolateYlGn = ramp$1(scheme$18);

var scheme$19 = new Array(3).concat("fff7bcfec44fd95f0e", "ffffd4fed98efe9929cc4c02", "ffffd4fed98efe9929d95f0e993404", "ffffd4fee391fec44ffe9929d95f0e993404", "ffffd4fee391fec44ffe9929ec7014cc4c028c2d04", "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04", "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506").map(colors$1);

var interpolateYlOrBr = ramp$1(scheme$19);

var scheme$20 = new Array(3).concat("ffeda0feb24cf03b20", "ffffb2fecc5cfd8d3ce31a1c", "ffffb2fecc5cfd8d3cf03b20bd0026", "ffffb2fed976feb24cfd8d3cf03b20bd0026", "ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026", "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026", "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026").map(colors$1);

var interpolateYlOrRd = ramp$1(scheme$20);

var scheme$21 = new Array(3).concat("deebf79ecae13182bd", "eff3ffbdd7e76baed62171b5", "eff3ffbdd7e76baed63182bd08519c", "eff3ffc6dbef9ecae16baed63182bd08519c", "eff3ffc6dbef9ecae16baed64292c62171b5084594", "f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594", "f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b").map(colors$1);

var interpolateBlues = ramp$1(scheme$21);

var scheme$22 = new Array(3).concat("e5f5e0a1d99b31a354", "edf8e9bae4b374c476238b45", "edf8e9bae4b374c47631a354006d2c", "edf8e9c7e9c0a1d99b74c47631a354006d2c", "edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32", "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32", "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b").map(colors$1);

var interpolateGreens = ramp$1(scheme$22);

var scheme$23 = new Array(3).concat("f0f0f0bdbdbd636363", "f7f7f7cccccc969696525252", "f7f7f7cccccc969696636363252525", "f7f7f7d9d9d9bdbdbd969696636363252525", "f7f7f7d9d9d9bdbdbd969696737373525252252525", "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525", "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000").map(colors$1);

var interpolateGreys = ramp$1(scheme$23);

var scheme$24 = new Array(3).concat("efedf5bcbddc756bb1", "f2f0f7cbc9e29e9ac86a51a3", "f2f0f7cbc9e29e9ac8756bb154278f", "f2f0f7dadaebbcbddc9e9ac8756bb154278f", "f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486", "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486", "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d").map(colors$1);

var interpolatePurples = ramp$1(scheme$24);

var scheme$25 = new Array(3).concat("fee0d2fc9272de2d26", "fee5d9fcae91fb6a4acb181d", "fee5d9fcae91fb6a4ade2d26a50f15", "fee5d9fcbba1fc9272fb6a4ade2d26a50f15", "fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d", "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d", "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d").map(colors$1);

var interpolateReds = ramp$1(scheme$25);

var scheme$26 = new Array(3).concat("fee6cefdae6be6550d", "feeddefdbe85fd8d3cd94701", "feeddefdbe85fd8d3ce6550da63603", "feeddefdd0a2fdae6bfd8d3ce6550da63603", "feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04", "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04", "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704").map(colors$1);

var interpolateOranges = ramp$1(scheme$26);

cubehelixLong(cubehelix(300, 0.5, 0.0), cubehelix(-240, 0.5, 1.0));

var warm$1 = cubehelixLong(cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

var cool$1 = cubehelixLong(cubehelix(260, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

var rainbow$2 = cubehelix();

function ramp$2(range) {
  var n = range.length;
  return function (t) {
    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
  };
}

ramp$2(colors$1("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

var magma$1 = ramp$2(colors$1("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

var inferno$1 = ramp$2(colors$1("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

var plasma$1 = ramp$2(colors$1("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

const isFunction$1 = require('lodash/isFunction');
const palettes = {
  BrBG: interpolateBrBG,
  PRGn: interpolatePRGn,
  PiYG: interpolatePiYG,
  PuOr: interpolatePuOr,
  RdBu: interpolateRdBu,
  RdGy: interpolateRdGy,
  RdYlBu: interpolateRdYlBu,
  RdYlGn: interpolateRdYlGn,
  Spectral: interpolateSpectral,
  Blues: interpolateBlues,
  Greens: interpolateGreens,
  Greys: interpolateGreys,
  Oranges: interpolateOranges,
  Purples: interpolatePurples,
  Reds: interpolateReds,
  BuGn: interpolateBuGn,
  BuPu: interpolateBuPu,
  GnBu: interpolateGnBu,
  OrRd: interpolateOrRd,
  PuBuGn: interpolatePuBuGn,
  PuBu: interpolatePuBu,
  PuRd: interpolatePuRd,
  RdPu: interpolateRdPu,
  YlGnBu: interpolateYlGnBu,
  YlGn: interpolateYlGn,
  YlOrBr: interpolateYlOrBr,
  YlOrRd: interpolateYlOrRd
};

function buildColorValue(color, min = null, max = null, logScale = false, logScaleBase = Math.E) {
  if (isFunction$1(color)) {
    return color;
  }
  const reverse = color[0] === '-';
  const paletteName = color[0] === '-' ? color.slice(1) : color;
  if (palettes[paletteName]) {
    const scale = buildColorScale(palettes[paletteName], min, max, reverse, logScale, logScaleBase);
    return d => {
      return scale(d.value);
    };
  }
  return color;
}

const buildColorScale = (interpolator, min, max, reverse = false, logScale = false, logScaleBase = Math.E) => {
  if (logScale && min * max <= 0) {
    console.warn(`As log(0) = -∞, a log scale domain must be
      strictly-positive or strictly-negative. logscale ignored`);
  }

  if (logScale && min * max > 0) {
    const scale = log().base(logScaleBase).domain(reverse ? [max, min] : [min, max]).range([0, 1]);
    return sequential(t => {
      return interpolator(scale(t));
    }).domain([0, 1]);
  }
  return sequential(interpolator).domain(reverse ? [max, min] : [min, max]);
};

const range$1 = require('lodash/range');
const reduce$1 = require('lodash/reduce');
const _buildAxisData = (value, axesGroup, conf) => {
  return {
    value: value,
    thickness: axesGroup.thickness || 1,
    color: axesGroup.color || '#d3d3d3',
    opacity: axesGroup.opacity || conf.opacity
  };
};

const _buildAxesData = conf => {
  return reduce$1(conf.axes, (aggregator, axesGroup) => {
    if (!axesGroup.position && !axesGroup.spacing) {
      console.warn('Skipping axe group with no position and spacing defined');
      return aggregator;
    }
    if (axesGroup.position) {
      aggregator.push(_buildAxisData(axesGroup.position, axesGroup, conf));
    }
    if (axesGroup.spacing) {
      const builtAxes = range$1(axesGroup.start || conf.cmin, axesGroup.end || conf.cmax, axesGroup.spacing).map(value => {
        return _buildAxisData(value, axesGroup, conf);
      });
      return aggregator.concat(builtAxes);
    }
    return aggregator;
  }, []);
};

const renderAxes = (parentElement, conf, instance, scale) => {
  const axes = _buildAxesData(conf);

  const axis = arc().innerRadius(d => {
    return conf.direction === 'in' ? conf.outerRadius - scale(d.value) : conf.innerRadius + scale(d.value);
  }).outerRadius(d => {
    return conf.direction === 'in' ? conf.outerRadius - scale(d.value) : conf.innerRadius + scale(d.value);
  }).startAngle(0).endAngle(d => d.length);

  const selection = parentElement.selectAll('.axis').data(blockData => {
    const block = instance._layout.blocks[blockData.key];
    return axes.map(d => {
      return {
        value: d.value,
        thickness: d.thickness,
        color: d.color,
        opacity: d.opacity,
        block_id: blockData.key,
        length: block.end - block.start
      };
    });
  }).enter().append('path').attr('opacity', d => d.opacity).attr('class', 'axis').attr('d', axis).attr('pathType', 'arc').attr('pathData', d => {
    const dCopy = JSON.parse(JSON.stringify(d));
    dCopy.innerRadius = axis.innerRadius()(d);
    dCopy.outerRadius = axis.outerRadius()(d);
    dCopy.start = 0;
    dCopy.end = d.length;
    return dCopy;
  }).attr('stroke-width', d => d.thickness).attr('stroke', d => d.color);

  if (conf.showAxesTooltip) {
    selection.on('mouseover', (d, i) => {
      instance.tip.html(d.value).transition().style('opacity', 0.9).style('left', event.pageX + 'px').style('top', event.pageY - 28 + 'px');
    });
    selection.on('mouseout', (d, i) => {
      instance.tip.transition().duration(500).style('opacity', 0);
    });
  }

  return selection;
};

/**
 * Abstract class used by all tracks
**/
class Track {
  constructor(instance, conf, defaultConf, data, dataParser) {
    this.dispatch = dispatch('mouseover', 'mouseout');
    this.parseData = dataParser;
    this.loadData(data, instance);
    this.conf = getConf(conf, defaultConf, this.meta, instance);
    this.conf.colorValue = buildColorValue(this.conf.color, this.conf.cmin, this.conf.cmax, this.conf.logScale, this.conf.logScaleBase);
    this.scale = buildScale(this.conf.cmin, this.conf.cmax, this.conf.outerRadius - this.conf.innerRadius, this.conf.logScale, this.conf.logScaleBase);
  }

  loadData(data, instance) {
    const result = this.parseData(data, instance._layout.summary());
    this.data = result.data;
    this.meta = result.meta;
  }

  render(instance, parentElement, name) {
    parentElement.select('.' + name).remove();
    const track = parentElement.append('g').attr('class', name + ' item-wrapper').attr('z-index', this.conf.zIndex);
    const datumContainer = this.renderBlock(track, this.data, instance._layout, this.conf);
    if (this.conf.axes && this.conf.axes.length > 0) {
      renderAxes(datumContainer, this.conf, instance, this.scale);
    }
    const selection = this.renderDatum(datumContainer, this.conf, instance._layout);
    if (this.conf.tooltipContent) {
      registerTooltip(this, instance, selection, this.conf);
    }
    selection.on('mouseover', (d, i) => {
      this.dispatch.call('mouseover', this, d);
      // if (this.conf.tooltipContent) {
      //   instance.clipboard.attr('value', this.conf.tooltipContent(d))
      // }
    });
    selection.on('mouseout', (d, i) => {
      this.dispatch.call('mouseout', this, d);
    });

    Object.keys(this.conf.events).forEach(eventName => {
      const conf = this.conf;
      selection.on(eventName, function (d, i, nodes) {
        conf.events[eventName](d, i, nodes, event$1);
      });
    });

    return this;
  }

  renderBlock(parentElement, data, layout, conf) {
    const block = parentElement.selectAll('.block').data(data).enter().append('g').attr('class', 'block').attr('transform', d => `rotate(${layout.blocks[d.key].start * 360 / (2 * Math.PI)})`);

    if (conf.backgrounds) {
      block.selectAll('.background').data(d => {
        return conf.backgrounds.map(background => {
          return {
            start: background.start || conf.cmin,
            end: background.end || conf.cmax,
            angle: layout.blocks[d.key].end - layout.blocks[d.key].start,
            color: background.color,
            opacity: background.opacity
          };
        });
      }).enter().append('path').attr('class', 'background')
      // .attr('stroke-width', 0)
      .attr('fill', background => background.color).attr('opacity', background => background.opacity || 1).attr('pathType', 'arc').attr('pathData', d => {
        const dCopy = JSON.parse(JSON.stringify(d));
        dCopy.innerRadius = conf.direction === 'in' ? conf.outerRadius - this.scale(d.start) : conf.innerRadius + this.scale(d.start);
        dCopy.outerRadius = conf.direction === 'in' ? conf.outerRadius - this.scale(d.end) : conf.innerRadius + this.scale(d.end);
        dCopy.start = 0;
        dCopy.end = d.angle;
        return dCopy;
      }).attr('d', arc().innerRadius(background => {
        return conf.direction === 'in' ? conf.outerRadius - this.scale(background.start) : conf.innerRadius + this.scale(background.start);
      }).outerRadius(background => {
        return conf.direction === 'in' ? conf.outerRadius - this.scale(background.end) : conf.innerRadius + this.scale(background.end);
      }).startAngle(0).endAngle(d => d.angle));
    }

    return block;
  }

  theta(position, block) {
    return position / block.len * (block.end - block.start);
  }

  x(d, layout, conf) {
    const height = this.scale(d.value);
    const r = conf.direction === 'in' ? conf.outerRadius - height : conf.innerRadius + height;

    const angle = this.theta(d.position, layout.blocks[d.block_id]) - Math.PI / 2;
    return r * Math.cos(angle);
  }

  y(d, layout, conf) {
    const height = this.scale(d.value);
    const r = conf.direction === 'in' ? conf.outerRadius - height : conf.innerRadius + height;

    const angle = this.theta(d.position, layout.blocks[d.block_id]) - Math.PI / 2;
    return r * Math.sin(angle);
  }
}

const keys$1 = require('lodash/keys');
const includes = require('lodash/includes');
const every = require('lodash/every');
const map$5 = require('lodash/map');
const logger$2 = console;

function checkParent(key, index, layoutSummary, header) {
  if (!includes(keys$1(layoutSummary), key)) {
    logger$2.log(1, 'datum', 'unknown parent id', { line: index + 1, value: key, header: header, layoutSummary: layoutSummary });
    return false;
  }
  return true;
}

function checkNumber(keys, index) {
  return every(keys, (value, header) => {
    if (isNaN(value)) {
      logger$2.log(1, 'datum', 'not a number', { line: index + 1, value: value, header: header });
      return false;
    }
    return true;
  });
}

function buildOutput(data) {
  return {
    data: nest().key(datum => datum.block_id).entries(data),
    meta: {
      min: min$1(data, d => d.value),
      max: max$1(data, d => d.value)
    }
  };
}

function parseSpanValueData(data, layoutSummary) {
  // ['parent_id', 'start', 'end', 'value']
  if (data.length === 0) {
    return { data: [], meta: { min: null, max: null } };
  }

  const filteredData = data.filter((datum, index) => checkParent(datum.block_id, index, layoutSummary, 'parent'));

  return buildOutput(filteredData);
}

function parseSpanStringData(data, layoutSummary) {
  // ['parent_id', 'start', 'end', 'value']

  if (data.length === 0) {
    return { data: [], meta: { min: null, max: null } };
  }

  const filteredData = data.filter((datum, index) => checkParent(datum.block_id, index, layoutSummary, 'parent')).filter((datum, index) => checkNumber({ start: datum.start, end: datum.end }, index)).filter(datum => {
    if (datum.start < 0 || datum.end > layoutSummary[datum.block_id]) {
      logger$2.log(2, 'position', 'position inconsistency', { datum: datum, layoutSummary: layoutSummary });
      return false;
    }
    return true;
  });

  return buildOutput(filteredData);
}

function parsePositionValueData(data, layoutSummary) {
  // ['parent_id', 'position', 'value']
  if (data.length === 0) {
    return { data: [], meta: { min: null, max: null } };
  }

  const filteredData = data.filter((datum, index) => checkParent(datum.block_id, index, layoutSummary, 'parent')).filter((datum, index) => checkNumber({ position: datum.position, value: datum.value }, index));

  return buildOutput(filteredData);
}

function parsePositionTextData(data, layoutSummary) {
  // ['parent_id', 'position', 'value']
  if (data.length === 0) {
    return { data: [], meta: { min: null, max: null } };
  }

  const filteredData = data.filter((datum, index) => checkParent(datum.block_id, index, layoutSummary, 'parent')).filter((datum, index) => checkNumber({ position: datum.position }, index));

  return buildOutput(filteredData);
}

function parseChordData(data, layoutSummary) {
  if (data.length === 0) {
    return { data: [], meta: { min: null, max: null } };
  }

  const formatedData = data.filter((datum, index) => {
    if (datum.source) {
      return checkParent(datum.source.id, index, layoutSummary, 'sourceId');
    }
    logger$2.warn(`No source for data at index ${index}`);
    return false;
  }).filter((datum, index) => {
    if (datum.target) {
      return checkParent(datum.target.id, index, layoutSummary, 'targetId');
    }
    logger$2.warn(`No target for data at index ${index}`);
    return false;
  }).filter((datum, index) => checkNumber({
    sourceStart: datum.source.start,
    sourceEnd: datum.source.end,
    targetStart: datum.target.start,
    targetEnd: datum.target.end,
    value: datum.value || 1
  }, index));

  return {
    data: formatedData,
    meta: {
      min: min$1(formatedData, d => d.value),
      max: max$1(formatedData, d => d.value)
    }
  };
}

const axes = {
  axes: {
    value: [],
    iteratee: false
  },
  showAxesTooltip: {
    value: true,
    iteratee: false
  }
};

const radial = {
  innerRadius: {
    value: 0,
    iteratee: false
  },
  outerRadius: {
    value: 0,
    iteratee: false
  }
};

const values$1 = {
  min: {
    value: null,
    iteratee: false
  },
  max: {
    value: null,
    iteratee: false
  },
  logScale: {
    value: false,
    iteratee: false
  },
  logScaleBase: {
    value: Math.E,
    iteratee: false
  }
};

const common = {
  zIndex: {
    value: false,
    iteratee: false
  },
  opacity: {
    value: 1,
    iteratee: true
  },
  tooltipContent: {
    value: null,
    iteratee: false
  },
  events: {
    value: {},
    iteratee: false
  }
};

const forEach$3 = require('lodash/forEach');
const assign = require('lodash/assign');
const defaultConf$2 = assign({
  style: {
    value: {},
    iteratee: true
  },
  color: {
    value: 'black',
    iteratee: true
  },
  backgrounds: {
    value: [],
    iteratee: false
  }
}, common, radial);

class Text extends Track {
  constructor(instance, conf, data) {
    super(instance, conf, defaultConf$2, data, parsePositionTextData);
  }

  renderDatum(parentElement, conf, layout) {
    const text = parentElement.selectAll('g').data(d => d.values.map(item => {
      item._angle = this.theta(item.position, layout.blocks[item.block_id]) * 360 / (2 * Math.PI) - 90;
      item._anchor = item._angle > 90 ? 'end' : 'start';
      item._rotate = item._angle > 90 ? 180 : 0;
      return item;
    })).enter().append('g').append('text').text(d => d.value).attr('transform', d => {
      return `
          rotate(${d._angle})
          translate(${conf.innerRadius}, 0)
          rotate(${d._rotate})
        `;
    }).attr('text-anchor', d => d._anchor);
    forEach$3(conf.style, (value, key) => {
      text.style(key, value);
    });
    return text;
  }
}

const assign$2 = require('lodash/assign');
const defaultConf$3 = assign$2({
  color: {
    value: '#fd6a62',
    iteratee: true
  },
  strokeColor: {
    value: '#d3d3d3',
    iteratee: true
  },
  strokeWidth: {
    value: 0,
    iteratee: true
  }
}, radial, common);

class Highlight extends Track {
  constructor(instance, conf, data) {
    super(instance, conf, defaultConf$3, data, parseSpanStringData);
  }

  renderDatum(parentElement, conf, layout) {
    const self = this;
    return parentElement.selectAll('tile').data(d => d.values).enter().append('path').attr('class', 'tile').attr('d', arc().innerRadius(conf.innerRadius).outerRadius(conf.outerRadius).startAngle((d, i) => this.theta(d.start, layout.blocks[d.block_id])).endAngle((d, i) => this.theta(d.end, layout.blocks[d.block_id]))).attr('pathType', 'arc').attr('pathData', function (d) {
      d.innerRadius = conf.innerRadius;
      d.outerRadius = conf.outerRadius;
      d.start = self.theta(d.start, layout.blocks[d.block_id]);
      d.end = self.theta(d.end, layout.blocks[d.block_id]);
      return d;
    }).attr('fill', conf.colorValue).attr('opacity', conf.opacity).attr('stroke-width', conf.strokeWidth).attr('stroke', conf.strokeColor);
  }
}

const assign$3 = require('lodash/assign');
const defaultConf$4 = assign$3({
  direction: {
    value: 'out',
    iteratee: false
  },
  color: {
    value: '#fd6a62',
    iteratee: true
  },
  backgrounds: {
    value: [],
    iteratee: false
  }
}, axes, radial, common, values$1);

class Histogram extends Track {
  constructor(instance, conf, data) {
    super(instance, conf, defaultConf$4, data, parseSpanValueData);
  }

  renderDatum(parentElement, conf, layout) {
    const bin = parentElement.selectAll('.bin').data(d => d.values).enter().append('path').attr('class', 'bin').attr('opacity', conf.opacity).attr('stroke-width', 0).attr('pathType', 'arc').attr('pathData', d => {
      const dCopy = JSON.parse(JSON.stringify(d));
      dCopy.innerRadius = conf.direction == 'in' ? conf.outerRadius - this.scale(d.value) : conf.innerRadius;
      dCopy.outerRadius = conf.direction == 'out' ? conf.innerRadius + this.scale(d.value) : conf.outerRadius;
      dCopy.start = this.theta(d.start, layout.blocks[d.block_id]);
      dCopy.end = this.theta(d.end, layout.blocks[d.block_id]);
      return dCopy;
    }).attr('d', arc().innerRadius(d => {
      if (conf.direction == 'in') {
        return conf.outerRadius - this.scale(d.value);
      }
      return conf.innerRadius;
    }).outerRadius(d => {
      if (conf.direction == 'out') {
        return conf.innerRadius + this.scale(d.value);
      }
      return conf.outerRadius;
    }).startAngle(d => this.theta(d.start, layout.blocks[d.block_id])).endAngle(d => this.theta(d.end, layout.blocks[d.block_id])));
    bin.attr('fill', conf.colorValue);
    return bin;
  }
}

var cos$1 = Math.cos;
var sin$1 = Math.sin;
var pi$2 = Math.PI;
var halfPi$1 = pi$2 / 2;

var slice$3 = Array.prototype.slice;

var constant$5 = function (x) {
  return function () {
    return x;
  };
};

function defaultSource(d) {
  return d.source;
}

function defaultTarget(d) {
  return d.target;
}

function defaultRadius(d) {
  return d.radius;
}

function defaultStartAngle(d) {
  return d.startAngle;
}

function defaultEndAngle(d) {
  return d.endAngle;
}

var ribbon = function () {
  var source = defaultSource,
      target = defaultTarget,
      radius = defaultRadius,
      startAngle = defaultStartAngle,
      endAngle = defaultEndAngle,
      context = null;

  function ribbon() {
    var buffer,
        argv = slice$3.call(arguments),
        s = source.apply(this, argv),
        t = target.apply(this, argv),
        sr = +radius.apply(this, (argv[0] = s, argv)),
        sa0 = startAngle.apply(this, argv) - halfPi$1,
        sa1 = endAngle.apply(this, argv) - halfPi$1,
        sx0 = sr * cos$1(sa0),
        sy0 = sr * sin$1(sa0),
        tr = +radius.apply(this, (argv[0] = t, argv)),
        ta0 = startAngle.apply(this, argv) - halfPi$1,
        ta1 = endAngle.apply(this, argv) - halfPi$1,
        arcs = [];

    if (!context) context = buffer = path();

    context.moveTo(sx0, sy0);
    context.arc(0, 0, sr, sa0, sa1) && arcs.push({ cx: 0, cy: 0, radius: sr, startAngle: sa0, endAngle: sa1 });
    if (sa0 !== ta0 || sa1 !== ta1) {
      // TODO sr !== tr?
      context.quadraticCurveTo(0, 0, tr * cos$1(ta0), tr * sin$1(ta0));
      context.arc(0, 0, tr, ta0, ta1) && arcs.push({ cx: 0, cy: 0, radius: tr, startAngle: ta0, endAngle: ta1 });
    }
    context.quadraticCurveTo(0, 0, sx0, sy0);
    context.closePath();

    buffer.arcs = arcs;
    if (buffer) return context = null, buffer || null;
  }

  ribbon.radius = function (_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant$5(+_), ribbon) : radius;
  };

  ribbon.startAngle = function (_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$5(+_), ribbon) : startAngle;
  };

  ribbon.endAngle = function (_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$5(+_), ribbon) : endAngle;
  };

  ribbon.source = function (_) {
    return arguments.length ? (source = _, ribbon) : source;
  };

  ribbon.target = function (_) {
    return arguments.length ? (target = _, ribbon) : target;
  };

  ribbon.context = function (_) {
    return arguments.length ? (context = _ == null ? null : _, ribbon) : context;
  };

  return ribbon;
};

const assign$4 = require('lodash/assign');
const isFunction$2 = require('lodash/isFunction');
const defaultConf$5 = assign$4({
  color: {
    value: '#fd6a62',
    iteratee: true
  },
  radius: {
    value: null,
    iteratee: false
  },
  stroke: {
    value: '#000000',
    iteratee: false
  },
  strokeWidth: {
    value: 0,
    iteratee: false
  }
}, common, values$1);

const normalizeRadius = (radius, layoutRadius) => {
  if (radius >= 1) return radius;
  return radius * layoutRadius;
};

class Chords extends Track {
  constructor(instance, conf, data) {
    super(instance, conf, defaultConf$5, data, parseChordData);
  }

  getCoordinates(d, layout, conf, datum) {
    const block = layout.blocks[d.id];
    const startAngle = block.start + d.start / block.len * (block.end - block.start);
    const endAngle = block.start + d.end / block.len * (block.end - block.start);

    let radius;
    if (isFunction$2(conf.radius)) {
      radius = normalizeRadius(conf.radius(datum), layout.conf.innerRadius);
    } else if (conf.radius) {
      radius = normalizeRadius(conf.radius, layout.conf.innerRadius);
    }

    if (!radius) {
      radius = layout.conf.innerRadius;
    }

    return {
      radius,
      startAngle,
      endAngle
    };
  }

  renderChords(parentElement, name, conf, data, instance, getCoordinates) {
    const track = parentElement.append('g');
    const self = this;
    const link = track.selectAll('.chord').data(data).enter().append('path').attr('class', 'chord').attr('d', function (d) {
      return ribbon().source(d => getCoordinates(d.source, instance._layout, self.conf, d)).target(d => getCoordinates(d.target, instance._layout, self.conf, d))(d) + '';
    }).attr('pathType', 'ribbon').attr('pathData', function (d) {
      const ribbonData = ribbon().source(d => getCoordinates(d.source, instance._layout, self.conf, d)).target(d => getCoordinates(d.target, instance._layout, self.conf, d))(d).arcs;
      // console.log(ribbonData);
      // const s = getCoordinates(d.source, instance._layout, self.conf, d)
      // const t = getCoordinates(d.target, instance._layout, self.conf, d)
      // s.startAngle = s.startAngle - Math.PI / 2
      // s.endAngle = s.endAngle - Math.PI / 2
      // t.startAngle = t.startAngle - Math.PI / 2
      // t.endAngle = t.endAngle - Math.PI / 2
      // return [s, t]
      return ribbonData;
    }).attr('opacity', conf.opacity).attr('stroke', conf.stroke).attr('stroke-width', conf.strokeWidth).on('mouseover', d => {
      this.dispatch.call('mouseover', this, d);
      // instance.clipboard.attr('value', conf.tooltipContent(d))
    }).on('mouseout', d => this.dispatch.call('mouseout', this, d));

    Object.keys(conf.events).forEach(eventName => {
      link.on(eventName, function (d, i, nodes) {
        conf.events[eventName](d, i, nodes, event$1);
      });
    });

    link.attr('fill', conf.colorValue);

    return link;
  }

  render(instance, parentElement, name) {
    parentElement.select('.' + name).remove();

    const track = parentElement.append('g').attr('class', name + ' item-wrapper').attr('z-index', this.conf.zIndex);

    const selection = this.renderChords(track, name, this.conf, this.data, instance, this.getCoordinates);
    if (this.conf.tooltipContent) {
      registerTooltip(this, instance, selection, this.conf);
    }
    return this;
  }
}

const assign$5 = require('lodash/assign');
const defaultConf$6 = assign$5({
  color: {
    value: 'Spectral',
    iteratee: false
  },
  backgrounds: {
    value: [],
    iteratee: false
  }
}, radial, values$1, common);

class Heatmap extends Track {
  constructor(instance, conf, data) {
    super(instance, conf, defaultConf$6, data, parseSpanValueData);
  }

  renderDatum(parentElement, conf, layout) {
    return parentElement.selectAll('tile').data(d => d.values).enter().append('path').attr('class', 'tile').attr('pathType', 'arc').attr('stroke-width', 0).attr('pathData', d => {
      const dCopy = JSON.parse(JSON.stringify(d));
      dCopy.start = this.theta(dCopy.start, layout.blocks[dCopy.block_id]);
      dCopy.end = this.theta(dCopy.end, layout.blocks[dCopy.block_id]);
      dCopy.innerRadius = conf.innerRadius;
      dCopy.outerRadius = conf.outerRadius;
      return dCopy;
    }).attr('opacity', conf.opacity).attr('d', arc().innerRadius(conf.innerRadius).outerRadius(conf.outerRadius).startAngle((d, i) => this.theta(d.start, layout.blocks[d.block_id])).endAngle((d, i) => this.theta(d.end, layout.blocks[d.block_id]))).attr('fill', conf.colorValue);
  }
}

const assign$6 = require('lodash/assign');
const reduce$2 = require('lodash/reduce');
const sortBy$2 = require('lodash/sortBy');
const defaultConf$7 = assign$6({
  direction: {
    value: 'out',
    iteratee: false
  },
  color: {
    value: '#fd6a62',
    iteratee: true
  },
  fill: {
    value: false,
    iteratee: false
  },
  fillColor: {
    value: '#d3d3d3',
    iteratee: true
  },
  thickness: {
    value: 1,
    iteratee: true
  },
  maxGap: {
    value: null,
    iteratee: false
  },
  backgrounds: {
    value: [],
    iteratee: false
  }
}, axes, radial, common, values$1);

const splitByGap = (points, maxGap) => {
  return reduce$2(sortBy$2(points, 'position'), (aggregator, datum) => {
    if (aggregator.position === null) {
      return { position: datum.position, groups: [[datum]] };
    }
    if (datum.position > aggregator.position + maxGap) {
      aggregator.groups.push([datum]);
    } else {
      aggregator.groups[aggregator.groups.length - 1].push(datum);
    }
    aggregator.position = datum.position;
    return aggregator;
  }, { position: null, groups: [] }).groups;
};

class Line extends Track {
  constructor(instance, conf, data) {
    super(instance, conf, defaultConf$7, data, parsePositionValueData);
  }

  renderDatum(parentElement, conf, layout) {
    const line = radialLine().angle(d => d.angle).radius(d => d.radius).curve(curveLinear);

    const area = radialArea().angle(d => d.angle).innerRadius(d => d.innerRadius).outerRadius(d => d.outerRadius).curve(curveLinear);

    const generator = conf.fill ? area : line;

    const buildRadius = height => {
      if (conf.fill) {
        return {
          innerRadius: conf.direction === 'out' ? conf.innerRadius : conf.outerRadius - height,
          outerRadius: conf.direction === 'out' ? conf.innerRadius + height : conf.outerRadius
        };
      } else {
        return {
          radius: conf.direction === 'out' ? conf.innerRadius + height : conf.outerRadius - height
        };
      }
    };

    const selection = parentElement.selectAll('.line').data(d => conf.maxGap ? splitByGap(d.values, conf.maxGap) : [d.values]).enter().append('g').attr('class', 'line').append('path').datum(d => {
      return d.map(datum => {
        const height = this.scale(datum.value);
        return assign$6(datum, {
          angle: this.theta(datum.position, layout.blocks[datum.block_id])
        }, buildRadius(height));
      });
    }).attr('d', generator).attr('opacity', conf.opacity).attr('stroke-width', conf.thickness).attr('stroke', conf.colorValue).attr('fill', 'none');

    if (conf.fill) {
      selection.attr('fill', conf.fillColor);
    }

    return selection;
  }
}

const assign$7 = require('lodash/assign');
const defaultConf$8 = assign$7({
  direction: {
    value: 'out',
    iteratee: false
  },
  color: {
    value: '#fd6a62',
    iteratee: true
  },
  fill: {
    value: true,
    iteratee: false
  },
  size: {
    value: 15,
    iteratee: true
  },
  shape: {
    value: 'circle',
    iteratee: false
  },
  strokeColor: {
    value: '#d3d3d3',
    iteratee: true
  },
  strokeWidth: {
    value: 2,
    iteratee: true
  },
  backgrounds: {
    value: [],
    iteratee: false
  }
}, axes, radial, common, values$1);

const getSymbol = key => {
  switch (key) {
    case 'circle':
      return symbolCircle;
    case 'cross':
      return symbolCross;
    case 'diamond':
      return symbolDiamond;
    case 'square':
      return symbolSquare;
    case 'triangle':
      return symbolTriangle;
    case 'star':
      return symbolStar;
    case 'wye':
      return symbolWye;
    default:
      return symbolCross;
  }
};

class Scatter extends Track {
  constructor(instance, conf, data) {
    super(instance, conf, defaultConf$8, data, parsePositionValueData);
  }

  renderDatum(parentElement, conf, layout) {
    const point = parentElement.selectAll('.point').data(d => {
      d.values.forEach((item, i) => {
        item.symbol = symbol().type(getSymbol(conf.shape)).size(conf.size);
      });
      return d.values;
    }).enter().append('path').attr('class', 'point').attr('opacity', conf.opacity).attr('d', (d, i, j) => d.symbol(d, i, j)).attr('transform', d => {
      return `
          translate(
            ${this.x(d, layout, conf)},
            ${this.y(d, layout, conf)}
          ) rotate(
            ${this.theta(d.position, layout.blocks[d.block_id]) * 360 / (2 * Math.PI)}
          )`;
    }).attr('stroke', conf.strokeColor).attr('stroke-width', conf.strokeWidth).attr('fill', 'none');

    if (conf.shape === 'circle') {
      point.attr('pathType', 'circle').attr('pathData', d => {
        const radius = Math.sqrt(conf.size / Math.PI);
        return {
          cx: 0,
          cy: 0,
          radius
        };
      });
    }

    if (conf.fill) {
      point.attr('fill', conf.colorValue);
    }

    return point;
  }
}

const assign$8 = require('lodash/assign');
const forEach$5 = require('lodash/forEach');
const defaultConf$9 = assign$8({
  color: {
    value: '#fd6a62',
    iteratee: true
  },
  direction: {
    value: 'out',
    iteratee: false
  },
  thickness: {
    value: 10,
    iteratee: false
  },
  radialMargin: {
    value: 2,
    iteratee: false
  },
  margin: {
    value: 2,
    iteratee: false
  },
  strokeWidth: {
    value: 1,
    iteratee: true
  },
  strokeColor: {
    value: '#000000',
    iteratee: true
  },
  backgrounds: {
    value: [],
    iteratee: false
  }
}, axes, radial, values$1, common);

class Stack extends Track {
  constructor(instance, conf, data) {
    super(instance, conf, defaultConf$9, data, parseSpanValueData);
    this.buildLayers(this.data, this.conf.margin);
  }

  buildLayers(data, margin) {
    forEach$5(data, (block, idx) => {
      block.values = block.values.sort((a, b) => {
        if (a.start < b.start) {
          return -1;
        }
        if (a.start == b.start && a.end > b.end) {
          return -1;
        }
        if (a.start == b.start && a.end == b.end) {
          return 0;
        }
        return 1;
      });
      let layers = [];
      forEach$5(block.values, datum => {
        let placed = false;
        forEach$5(layers, (layer, i) => {
          // try to place datum
          const lastDatumInLayer = layer.slice(0).pop();
          if (lastDatumInLayer.end + margin < datum.start) {
            layer.push(datum);
            datum.layer = i;
            placed = true;
            return false;
          }
        });
        if (!placed) {
          datum.layer = layers.length;
          layers.push([datum]);
        }
      });
    });
  }

  datumRadialPosition(d) {
    const radialStart = (this.conf.thickness + this.conf.radialMargin) * d.layer;
    const radialEnd = radialStart + this.conf.thickness;
    if (this.conf.direction === 'out') {
      return [Math.min(this.conf.innerRadius + radialStart, this.conf.outerRadius), Math.min(this.conf.innerRadius + radialEnd, this.conf.outerRadius)];
    }

    if (this.conf.direction === 'in') {
      return [Math.max(this.conf.outerRadius - radialEnd, this.conf.innerRadius), this.conf.outerRadius - radialStart];
    }

    if (this.conf.direction === 'center') {
      const origin = Math.floor((this.conf.outerRadius + this.conf.innerRadius) / 2);
      const radialStart = (this.conf.thickness + this.conf.radialMargin) * Math.floor(d.layer / 2);
      const radialEnd = radialStart + this.conf.thickness;

      if (d.layer % 2 === 0) {
        return [origin + radialStart, origin + radialEnd];
      } else {
        return [origin - radialStart - this.conf.radialMargin, origin - radialEnd - this.conf.radialMargin];
      }
    }
  }

  renderDatum(parentElement, conf, layout) {
    const that = this;

    return parentElement.selectAll('.tile').data(d => {
      return d.values.map(datum => {
        const radius = that.datumRadialPosition(datum);
        return assign$8(datum, {
          innerRadius: radius[0],
          outerRadius: radius[1],
          startAngle: this.theta(datum.start, layout.blocks[datum.block_id]),
          endAngle: this.theta(datum.end, layout.blocks[datum.block_id])
        });
      });
    }).enter().append('path').attr('class', 'tile').attr('d', arc()).attr('pathType', 'arc').attr('pathData', d => {
      return {
        innerRadius: d.innerRadius,
        outerRadius: d.outerRadius,
        start: d.startAngle,
        end: d.endAngle
      };
    }).attr('opacity', conf.opacity).attr('stroke-width', conf.strokeWidth).attr('stroke', conf.strokeColor).attr('fill', conf.colorValue);
  }
}

const defaultsDeep = require('lodash/defaultsDeep');
const forEach = require('lodash/forEach');
const isArray = require('lodash/isArray');
const map = require('lodash/map');
// import {select} from 'd3-selection'
const d3$3 = Object.assign({}, require('../../d3-SvgToWebgl'), require('d3-zoom'));
// import {initClipboard} from './clipboard'

const defaultConf = {
  width: 700,
  height: 700,
  container: 'circos',
  defaultTrackWidth: 10
};

class Core {
  constructor(conf) {
    this.tracks = {};
    this._layout = null;
    this.conf = defaultsDeep(conf, defaultConf);
    // const container = d3.select(this.conf.container).append('div')
    //   .style('position', 'relative')
    // this.svg = container.append('svg')
    this.svgContainer = d3$3.select(this.conf.container).toCanvas(this.conf.renderer);
    this.svg = this.svgContainer.append('g').attr('class', 'content');
    var zoomed = function () {
      var node = this.node().glElem;
      var rootNode = this.node().rootNode;
      var transform = event$1.transform;
      node.scale.x = transform.k;
      node.scale.y = transform.k;
      node.position.x = transform.x;
      node.position.y = transform.y;
      rootNode.renderer.render(rootNode.stage);
    };
    zoomed = zoomed.bind(this.svg);
    this.svgContainer.call(d3$3.zoom().on('zoom', zoomed));
    if (d3$3.select('body').select('.circos-tooltip').empty()) {
      this.tip = d3$3.select('body').append('div').attr('class', 'circos-tooltip').style('opacity', 0).style('position', 'absolute').style('text-align', 'center').style('padding', '5px 10px').style('background-color', '#111111').style('color', 'white').style('border-radius', '5px').style('pointer-events', 'none').style('z-index', 9999);
    } else {
      this.tip = d3$3.select('body').select('.circos-tooltip');
    }

    // this.clipboard = initClipboard(this.conf.container)
  }

  removeTracks(trackIds) {
    if (typeof trackIds === 'undefined') {
      map(this.tracks, (track, id) => {
        this.svg.select('.' + id).remove();
      });
      this.tracks = {};
    } else if (typeof trackIds === 'string') {
      this.svg.select('.' + trackIds).remove();
      delete this.tracks[trackIds];
    } else if (isArray(trackIds)) {
      forEach(trackIds, function (trackId) {
        this.svg.select('.' + trackId).remove();
        delete this.tracks[trackId];
      });
    } else {
      console.warn('removeTracks received an unhandled attribute type');
    }

    return this;
  }

  layout(data, conf) {
    this._layout = new Layout(conf, data);
    return this;
  }

  chords(id, data, conf) {
    this.tracks[id] = new Chords(this, conf, data);
    return this;
  }
  heatmap(id, data, conf) {
    this.tracks[id] = new Heatmap(this, conf, data);
    return this;
  }
  highlight(id, data, conf) {
    this.tracks[id] = new Highlight(this, conf, data);
    return this;
  }
  histogram(id, data, conf) {
    this.tracks[id] = new Histogram(this, conf, data);
    return this;
  }
  line(id, data, conf) {
    this.tracks[id] = new Line(this, conf, data);
    return this;
  }
  scatter(id, data, conf) {
    this.tracks[id] = new Scatter(this, conf, data);
    return this;
  }
  stack(id, data, conf) {
    this.tracks[id] = new Stack(this, conf, data);
    return this;
  }
  text(id, data, conf) {
    this.tracks[id] = new Text(this, conf, data);
    return this;
  }
  render(ids, removeTracks) {
    render(ids, removeTracks, this);
  }
}

const Circos = conf => {
  const instance = new Core(conf);
  return instance;
};

const d3$2 = Object.assign({}, require('d3-queue'), require('d3-request'), require('d3-collection'), require('d3-array'));
class CircularRenderer extends BaseRenderer {
  constructor(elem, options) {
    super(elem, options);
  }
  // draw chords
  chords(layout, data) {
    const width = this.renderer.view.clientWidth;
    const height = this.renderer.view.clientHeight;
    const circos = new Circos({
      container: this.renderer.view,
      renderer: this.renderer,
      width: width,
      height: height
    });

    var drawCircos = function (error) {
      let layoutData = arguments[1];
      const fileData = [].slice.call(arguments, 2);
      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'heatmap') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.start = parseInt(d.start);
            d.end = parseInt(d.end);
            d.value = parseFloat(d.value || 0);
            return d;
          });
        }
      });

      let circular = circos.layout(layoutData, {
        innerRadius: layout.configs.innerRadius || width / 2 - 100,
        outerRadius: layout.configs.outerRadius || width / 2 - 80,
        labels: {
          display: layout.configs.labels || false,
          radialOffset: 70
        },
        ticks: {
          display: layout.configs.ticks || false,
          labelDenominator: layout.configs.tickScale || 1000000
        },
        tooltipContent: layout.configs.tips
      });

      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'heatmap') {
          circular = circular.heatmap(data[i].name, fileData[i], {
            innerRadius: data[i].configs.innerRadius,
            outerRadius: data[i].configs.outerRadius,
            logScale: false,
            color: data[i].configs.color || 'YlOrRd',
            tooltipContent: data[i].configs.tips
          });
        } else if (data[i].circularType === 'chords') {
          circular = circular.chords(data[i].name, fileData[i], {
            radius: data[i].configs.radius,
            logScale: false,
            opacity: data[i].configs.opacity || 0.7,
            color: 'none',
            stroke: data[i].configs.stroke || '#000000',
            strokeWidth: data[i].configs.strokeWidth || 1,
            tooltipContent: data[i].configs.tips
          });
        }
      });
      circular.render();
    };
    let queue = d3$2.queue();
    queue = queue.defer(d3$2[layout.fileType], layout.fileUrl);
    data.forEach(function (d) {
      queue = queue.defer(d3$2[d.fileType], d.fileUrl);
    });
    queue.await(drawCircos);
  }
  // draw highlight
  highlight(layout, data) {
    const width = this.renderer.view.clientWidth;
    const height = this.renderer.view.clientHeight;
    const circos = new Circos({
      container: this.renderer.view,
      renderer: this.renderer,
      width: width,
      height: height
    });

    const gieStainColor = defaultConfigs.circos.gieStainColor;

    var drawCircos = function (error) {
      let layoutData = arguments[1];
      const fileData = [].slice.call(arguments, 2);
      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'highlight') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.start = parseInt(d.start);
            d.end = parseInt(d.end);
            d.value = parseFloat(d.value || 0);
            return d;
          });
        }
      });

      let circular = circos.layout(layoutData, {
        innerRadius: layout.configs.innerRadius || width / 2 - 100,
        outerRadius: layout.configs.outerRadius || width / 2 - 80,
        labels: {
          display: layout.configs.labels || false,
          radialOffset: 70
        },
        ticks: {
          display: layout.configs.ticks || false,
          labelDenominator: layout.configs.tickScale || 1000000
        },
        // events: {
        //   'click.demo': function (d, i, nodes, event) {
        //     console.log('clicked on layout block', d, event)
        //   }
        // }
        tooltipContent: layout.configs.tips
      });

      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'highlight') {
          circular = circular.highlight(data[i].name, fileData[i], {
            innerRadius: data[i].configs.innerRadius,
            outerRadius: data[i].configs.outerRadius,
            opacity: data[i].configs.opacity || 0.5,
            color: data[i].configs.color || function (d) {
              return gieStainColor[d.gieStain] || '#000';
            }
          });
        }
      });
      circular.render();
    };
    let queue = d3$2.queue();
    queue = queue.defer(d3$2[layout.fileType], layout.fileUrl);
    data.forEach(function (d) {
      queue = queue.defer(d3$2[d.fileType], d.fileUrl);
    });
    queue.await(drawCircos);
  }
  // draw heatmap
  heatmap(layout, data) {
    const width = this.renderer.view.clientWidth;
    const height = this.renderer.view.clientHeight;
    const circos = new Circos({
      container: this.renderer.view,
      renderer: this.renderer,
      width: width,
      height: height
    });
    var drawCircos = function (error) {
      let layoutData = arguments[1];
      const fileData = [].slice.call(arguments, 2);
      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'heatmap') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.start = parseInt(d.start);
            d.end = parseInt(d.end);
            d.value = parseFloat(d.value || 0);
            return d;
          });
        }
      });

      let circular = circos.layout(layoutData, {
        innerRadius: layout.configs.innerRadius || width / 2 - 100,
        outerRadius: layout.configs.outerRadius || width / 2 - 80,
        labels: {
          display: layout.configs.labels || false,
          position: 'center',
          size: 14,
          color: '#000',
          radialOffset: 30
        },
        ticks: {
          display: layout.configs.ticks || false,
          labelDenominator: layout.configs.tickScale || 1000000
        },
        tooltipContent: layout.configs.tips
      });

      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'heatmap') {
          circular = circular.heatmap(data[i].name, fileData[i], {
            innerRadius: data[i].configs.innerRadius,
            outerRadius: data[i].configs.outerRadius,
            logScale: false,
            color: data[i].configs.color || 'YlOrRd',
            tooltipContent: data[i].configs.tips
          });
        }
      });
      circular.render();
    };
    let queue = d3$2.queue();
    queue = queue.defer(d3$2[layout.fileType], layout.fileUrl);
    data.forEach(function (d) {
      queue = queue.defer(d3$2[d.fileType], d.fileUrl);
    });
    queue.await(drawCircos);
  }
  // draw histogram
  histogram(layout, data) {
    const width = this.renderer.view.clientWidth;
    const height = this.renderer.view.clientHeight;
    const circos = new Circos({
      container: this.renderer.view,
      renderer: this.renderer,
      width: width,
      height: height
    });
    const gieStainColor = defaultConfigs.circos.gieStainColor;

    var drawCircos = function (error) {
      let layoutData = arguments[1];
      const fileData = [].slice.call(arguments, 2);
      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'highlight') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.start = parseInt(d.start);
            d.end = parseInt(d.end);
            d.value = parseFloat(d.value || 0);
            return d;
          });
        } else if (data[i].circularType === 'histogram') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.start = parseInt(d.start);
            d.end = parseInt(d.end);
            d.value = parseFloat(d.value || 0);
            return d;
          });
        }
      });

      let circular = circos.layout(layoutData, {
        innerRadius: layout.configs.innerRadius || width / 2 - 100,
        outerRadius: layout.configs.outerRadius || width / 2 - 80,
        labels: {
          display: layout.configs.labels || false,
          position: 'center',
          size: 14,
          color: '#000',
          radialOffset: 30
        },
        ticks: {
          display: layout.configs.ticks || false,
          labelDenominator: layout.configs.tickScale || 1000000
        },
        tooltipContent: layout.configs.tips
      });

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
          });
        } else if (data[i].circularType === 'histogram') {
          circular = circular.histogram(data[i].name, fileData[i], {
            innerRadius: data[i].configs.innerRadius,
            outerRadius: data[i].configs.outerRadius,
            color: data[i].configs.color || 'OrRd',
            direction: data[i].configs.direction || 'out',
            tooltipContent: data[i].configs.tips
          });
        }
      });
      circular.render();
    };
    let queue = d3$2.queue();
    queue = queue.defer(d3$2[layout.fileType], layout.fileUrl);
    data.forEach(function (d) {
      queue = queue.defer(d3$2[d.fileType], d.fileUrl);
    });
    queue.await(drawCircos);
  }
  // draw line
  line(layout, data) {
    const width = this.renderer.view.clientWidth;
    const height = this.renderer.view.clientHeight;
    const circos = new Circos({
      container: this.renderer.view,
      renderer: this.renderer,
      width: width,
      height: height
    });

    const gieStainColor = defaultConfigs.circos.gieStainColor;

    var drawCircos = function (error) {
      let layoutData = arguments[1];
      const fileData = [].slice.call(arguments, 2);
      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'highlight') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.start = parseInt(d.start);
            d.end = parseInt(d.end);
            d.value = parseFloat(d.value || 0);
            return d;
          });
        } else if (data[i].circularType === 'line') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.position = (parseInt(d.start) + parseInt(d.end)) / 2;
            d.value = parseFloat(d.value || 0);
            return d;
          });
        }
      });

      let circular = circos.layout(layoutData, {
        innerRadius: layout.configs.innerRadius || width / 2 - 100,
        outerRadius: layout.configs.outerRadius || width / 2 - 80,
        labels: {
          display: layout.configs.labels || false,
          position: 'center',
          size: 14,
          color: '#000',
          radialOffset: 30
        },
        ticks: {
          display: layout.configs.ticks || false,
          labelDenominator: layout.configs.tickScale || 1000000
        },
        tooltipContent: layout.configs.tips
      });

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
          });
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
          });
        }
      });
      circular.render();
    };
    let queue = d3$2.queue();
    queue = queue.defer(d3$2[layout.fileType], layout.fileUrl);
    data.forEach(function (d) {
      queue = queue.defer(d3$2[d.fileType], d.fileUrl);
    });
    queue.await(drawCircos);
  }
  // draw scatter
  scatter(layout, data) {
    const width = this.renderer.view.clientWidth;
    const height = this.renderer.view.clientHeight;
    const circos = new Circos({
      container: this.renderer.view,
      renderer: this.renderer,
      width: width,
      height: height
    });

    const gieStainColor = defaultConfigs.circos.gieStainColor;

    var drawCircos = function (error) {
      let layoutData = arguments[1];
      const fileData = [].slice.call(arguments, 2);
      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'highlight') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.start = parseInt(d.start);
            d.end = parseInt(d.end);
            d.value = parseFloat(d.value || 0);
            return d;
          });
        } else if (data[i].circularType === 'scatter') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.position = (parseInt(d.start) + parseInt(d.end)) / 2;
            d.value = parseFloat(d.value || 0);
            return d;
          });
        }
      });

      let circular = circos.layout(layoutData, {
        innerRadius: layout.configs.innerRadius || width / 2 - 100,
        outerRadius: layout.configs.outerRadius || width / 2 - 80,
        labels: {
          display: layout.configs.labels || false,
          position: 'center',
          size: 14,
          color: '#000',
          radialOffset: 30
        },
        ticks: {
          display: layout.configs.ticks || false,
          labelDenominator: layout.configs.tickScale || 1000000
        },
        tooltipContent: layout.configs.tips
      });

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
          });
        } else if (data[i].circularType === 'scatter') {
          circular = circular.scatter(data[i].name, fileData[i], {
            innerRadius: data[i].configs.innerRadius,
            outerRadius: data[i].configs.outerRadius,
            color: data[i].configs.color || '#000',
            stroke: data[i].configs.stroke || '#000',
            strokeWidth: data[i].configs.strokeWidth,
            shape: data[i].configs.shape || 'circle',
            size: data[i].configs.size || 14,
            min: data[i].configs.min,
            max: data[i].configs.max,
            axes: data[i].configs.axes,
            backgrounds: data[i].configs.backgrounds,
            tooltipContent: data[i].configs.tips
          });
        }
      });
      circular.render();
    };
    let queue = d3$2.queue();
    queue = queue.defer(d3$2[layout.fileType], layout.fileUrl);
    data.forEach(function (d) {
      queue = queue.defer(d3$2[d.fileType], d.fileUrl);
    });
    queue.await(drawCircos);
  }
  // draw stack
  stack(layout, data) {
    const width = this.renderer.view.clientWidth;
    const height = this.renderer.view.clientHeight;
    const circos = new Circos({
      container: this.renderer.view,
      renderer: this.renderer,
      width: width,
      height: height
    });

    const gieStainColor = defaultConfigs.circos.gieStainColor;

    var drawCircos = function (error) {
      let layoutData = arguments[1];
      const fileData = [].slice.call(arguments, 2);
      fileData.forEach(function (d, i) {
        if (data[i].circularType === 'highlight') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.start = parseInt(d.start);
            d.end = parseInt(d.end);
            d.value = parseFloat(d.value || 0);
            return d;
          });
        } else if (data[i].circularType === 'stack') {
          fileData[i] = fileData[i].map(function (d) {
            d.block_id = d.chrom;
            d.start = parseInt(d.start);
            d.end = parseInt(d.end);
            d.value = parseFloat(d.value || 0);
            return d;
          });
        }
      });

      let circular = circos.layout(layoutData, {
        innerRadius: layout.configs.innerRadius || width / 2 - 100,
        outerRadius: layout.configs.outerRadius || width / 2 - 80,
        labels: {
          display: layout.configs.labels || false,
          position: 'center',
          size: 14,
          color: '#000',
          radialOffset: 30
        },
        ticks: {
          display: layout.configs.ticks || false,
          labelDenominator: layout.configs.tickScale || 1000000
        },
        tooltipContent: layout.configs.tips
      });

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
          });
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
          });
        }
      });
      circular.render();
    };
    let queue = d3$2.queue();
    queue = queue.defer(d3$2[layout.fileType], layout.fileUrl);
    data.forEach(function (d) {
      queue = queue.defer(d3$2[d.fileType], d.fileUrl);
    });
    queue.await(drawCircos);
  }
}

const Plot = window.Plot || {};
Plot.chart = ChartRenderer;
Plot.circular = CircularRenderer;

return Plot;

}());
