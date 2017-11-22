import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  NativeModules
} from 'react-native';
const ForceView = require('./ForceView.js');

export default function Demo2Screen() {
    return (
      <View style={styles.container}>
        <ForceView style={styles.view}/>
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