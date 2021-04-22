import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import Color from '../constants/colors';
import { useAppSelector } from '../utils/reducers';

export default function Home() {
  const { types, abilities, moves } = useAppSelector((state) => state);

  return (
    <View style={styles.container}>
      {/* <FlatList
        data={types}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => {
          return <Text>{item.name}</Text>;
        }}
      />
      <FlatList
        data={abilities}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => {
          return <Text>{item.name}</Text>;
        }}
      /> */}
      <FlatList
        data={moves}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => {
          return <Text>{item.name}</Text>;
        }}
      />
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
