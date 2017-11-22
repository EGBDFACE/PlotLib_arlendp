import React, {Component} from 'react';
import { CocosControlManager } from './control.js';

export default class CocosBase extends Component {
  componentWillUnmount() {
    CocosControlManager.cancel();
  }
}