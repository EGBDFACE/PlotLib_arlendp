import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  NativeModules
} from 'react-native';
import CocosBaseView from './CocosBaseView.js';
const Cocos3View = require('./Cocos3View.js');

export default class Demo2Screen extends CocosBaseView {
  render() {
    return (
      <View style={styles.container}>
        <Cocos3View style={styles.view} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  view: {
    flex: 1
  }
});