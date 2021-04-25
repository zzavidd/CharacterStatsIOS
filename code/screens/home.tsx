import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, ListRenderItemInfo, Text, View } from 'react-native';

import Color from '../constants/colors';
import styles from '../styles/Home.styles';
import { Character } from '../types/classes';
import * as Storage from '../utils/storage';

export default function Home() {
  const [characters, setCharacters] = useState<Array<Character>>([]);

  useEffect(() => {
    getAllCharacters();
  }, []);

  const getAllCharacters = async () => {
    const allCharacters = await Storage.getAll();
    setCharacters(allCharacters);
  };

  const renderItem = ({ item, index }: ListRenderItemInfo<Character>) => {
    const { name, universe, type1, type2 } = item;
    const color1 = Color.TYPE[type1];
    const color2 = Color.TYPE[type2];
    const types = type1 + (type2 ? ` / ${type2}` : '');
    return (
      <View style={styles.cell} key={index}>
        <LinearGradient
          colors={[color1, color2]}
          locations={[0.85, 1]}
          style={styles.cellLinGrad}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.metadata}>{types}</Text>
          <Text style={styles.metadata}>{universe}</Text>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style={'light'} />
      <View style={styles.table}>
        <FlatList
          data={characters}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}
