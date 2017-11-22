import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  NativeModules
} from 'react-native';
const PackView = require('./PackView.js');

export default function Demo3Screen() {
    return (
      <View style={styles.container}>
        <PackView style={styles.view}/>
      </View>
    )
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