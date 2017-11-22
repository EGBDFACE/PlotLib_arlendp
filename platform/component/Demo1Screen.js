import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  NativeModules
} from 'react-native';
const ChordView = require('./ChordView.js');

export default function Demo1Screen() {
    return (
      <View style={styles.container}>
        <ChordView style={styles.view}/>
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