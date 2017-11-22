import React, {Component} from 'react';
import {
  View,
  Button,
  StyleSheet
} from 'react-native';

export default class MainScreen extends Component {
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <View style={styles.container}>
      <Button
        onPress={() => {this.props.navigation.navigate('Demo1')}}
        title="Chord"
      />
      <Button 
      onPress={() => {this.props.navigation.navigate('Demo2')}}
      title="Force"
      />
      <Button 
      onPress={() => {this.props.navigation.navigate('Demo3')}}
      title="Pack"
      />
      <Button 
      onPress={() => {this.props.navigation.navigate('Demo4')}}
      title="Cocos1"
      />
      <Button 
      onPress={() => {this.props.navigation.navigate('Demo5')}}
      title="Cocos2"
      />
      <Button 
      onPress={() => {this.props.navigation.navigate('Demo6')}}
      title="Cocos3"
      />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  }
});