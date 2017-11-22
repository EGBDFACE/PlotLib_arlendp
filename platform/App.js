/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  NativeModules
} from 'react-native';
import {
  StackNavigator
} from 'react-navigation';
import MainScreen from './component/MainScreen';
import Demo1Screen from './component/Demo1Screen';
import Demo2Screen from './component/Demo2Screen';
import Demo3Screen from './component/Demo3Screen';
import Demo4Screen from './component/Demo4Screen';
import Demo5Screen from './component/Demo5Screen';
import Demo6Screen from './component/Demo6Screen';

const AppView = StackNavigator({
  Main: {screen: MainScreen},
  Demo1: {screen: Demo1Screen},
  Demo2: {screen: Demo2Screen},
  Demo3: {screen: Demo3Screen},
  Demo4: {screen: Demo4Screen},
  Demo5: {screen: Demo5Screen},
  Demo6: {screen: Demo6Screen}
});

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {
  render() {
    return (
      <AppView/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  view: {
    flex: 1
  }
});
