import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  ListRenderItemInfo,
  SafeAreaView,
  Text,
  View
} from 'react-native';

import Color from '../constants/colors';
import styles from '../styles/Home.styles';
import { Character } from '../types/classes';
import { useAppSelector } from '../utils/reducers';
import * as Storage from '../utils/storage';

export default function Home() {
  const appState = useAppSelector((state) => state);
  const [characters, setCharacters] = useState<Array<Character>>([]);

  useEffect(() => {
    getAllCharacters();
  }, [characters]);

  const getAllCharacters = async () => {
    const allCharacters = await Storage.getAll();
    setCharacters(allCharacters);
  };

  return (
    <View style={styles.container}>
      <StatusBar style={'light'} />
      <CharacterGrid characters={characters} />
      <View style={styles.footer}>
        <Button
          title={'Ingest Example Data'}
          onPress={() => Storage.ingestExampleData(appState)}
        />
        <Button title={'Clear Data'} onPress={Storage.clearAllData} />
      </View>
    </View>
  );
}

function CharacterGrid({ characters }: CharacterGridProps) {
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
    <View style={styles.table}>
      <FlatList
        data={characters}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={renderItem}
      />
    </View>
  );
}

type CharacterGridProps = {
  characters: Character[];
};
