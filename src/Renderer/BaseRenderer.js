import * as PIXI from 'pixi.js';
import defaultConfigs from '../Config';
export default class BaseRenderer {
  constructor(elem, options) {
    this.renderer = new PIXI.autoDetectRenderer({
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