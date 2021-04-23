import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import Color from '../constants/colors';

export default function Home() {
  return (
    <View style={styles.container}>
      <StatusBar style={'dark'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Color.WHITE,
    display: 'flex',
    flex: 1,
    justifyContent: 'center'
  }
});
