import { StackScreenProps } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View } from 'react-native';

import CharacterGrid from './grid';
import { CharacterToolbar, DevToolbar } from './toolbar';

import styles from '../../styles/Home.styles';
import { RootStackParamList } from '../../types';
import { Character } from '../../types/classes';
import { organiseCharacters } from '../../utils/helper';
import {
  setCharacters,
  useAppDispatch,
  useAppSelector
} from '../../utils/reducers';
import * as Storage from '../../utils/storage';

export default function Home({
  navigation
}: StackScreenProps<RootStackParamList, 'Home'>) {
  const { characters } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  useEffect(() => {
    refreshCharacters();
  }, []);

  const refreshCharacters = async () => {
    const data = (await Storage.getAll()) as Character[];
    const allCharacters = organiseCharacters(data);
    dispatch(setCharacters(allCharacters));
  };

  return (
    <View style={styles.container}>
      <StatusBar style={'light'} />
      <CharacterGrid
        characters={characters}
        navigation={navigation}
        refreshCharacters={refreshCharacters}
      />
      <CharacterToolbar />
      <DevToolbar refreshCharacters={refreshCharacters} />
    </View>
  );
}
