import {
  iris,
  candleStick,
  occurrence,
  boxplot
} from './plot_bokeh';

import {
  roundNumber
} from './util.js';

import defaultConfigs from './config';

export default function Plot(elem, options) {
  const renderer = new PIXI.autoDetectRenderer({
    width: elem.width || defaultConfigs.base.canvasSize.w,
    height: elem.height || defaultConfigs.base.canvasSize.h,
    resolution: options && options.resolution || window.devicePixelRatio,
    view: elem,
    backgroundColor: options && options.bgColor || 0xffffff,
    antialias: true
  });
  renderer.view.style.width = elem.width / 2 + 'px';
  renderer.view.style.height = elem.height / 2 + 'px';
}