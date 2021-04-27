import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import {
  ActionSheetIOS,
  Button,
  FlatList,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import Color from '../constants/colors';
import styles from '../styles/Home.styles';
import { RootStackParamList } from '../types';
import { Character } from '../types/classes';
import {
  setCharacters,
  useAppDispatch,
  useAppSelector
} from '../utils/reducers';
import Settings from '../utils/settings';
import * as Storage from '../utils/storage';

export default function Home({
  navigation
}: StackScreenProps<RootStackParamList, 'Home'>) {
  const { characters } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  useEffect(() => {
    refreshCharacters();
  }, []);

  const refreshCharacters = async () => {
    const allCharacters = (await Storage.getAll()) as Character[];
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
      <DevTools refreshCharacters={refreshCharacters} />
    </View>
  );
}

function CharacterGrid({
  characters,
  refreshCharacters,
  navigation
}: CharacterGridProps) {
  if (!characters?.length) return <View style={styles.table} />;

  const renderItem = ({ item, index }: ListRenderItemInfo<Character>) => {
    const { name, universe, type1, type2 } = item;
    const color1 = Color.TYPE[type1];
    const color2 = Color.TYPE[type2];
    const types = type1 + (type2 ? ` / ${type2}` : '');
    return (
      <TouchableOpacity
        style={styles.cell}
        activeOpacity={0.6}
        key={index}
        onLongPress={() => {
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options: ['Cancel', 'Edit', 'Delete'],
              cancelButtonIndex: 0,
              destructiveButtonIndex: 2
            },
            (buttonIndex) => {
              if (buttonIndex === 1) {
                navigation.navigate('Form', {
                  character: item,
                  isEdit: true
                });
              } else if (buttonIndex === 2) {
                ActionSheetIOS.showActionSheetWithOptions(
                  {
                    options: ['No', 'Yes'],
                    cancelButtonIndex: 0,
                    destructiveButtonIndex: 1
                  },
                  async (buttonIndex) => {
                    if (buttonIndex === 1) {
                      await Storage.remove(item.id);
                      refreshCharacters();
                    }
                  }
                );
              }
            }
          );
        }}>
        <LinearGradient
          colors={[color1, color2]}
          locations={[0.85, 0.85]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.cellLinGrad}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.metadata}>{types}</Text>
          <Text style={styles.metadata}>{universe}</Text>
        </LinearGradient>
      </TouchableOpacity>
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

function DevTools({ refreshCharacters }: DevToolsProps) {
  if (!Settings.showDevTools) return null;

  const appState = useAppSelector((state) => state);
  return (
    <View style={styles.footer}>
      <Button
        title={'Ingest Example Data'}
        onPress={() => {
          Storage.ingestExampleData(appState);
          refreshCharacters();
        }}
      />
      <Button
        title={'Clear Data'}
        onPress={async () => {
          await Storage.clearAllData();
          refreshCharacters();
        }}
      />
    </View>
  );
}

type CharacterGridProps = {
  characters: Character[];
  refreshCharacters: () => void;
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

type DevToolsProps = {
  refreshCharacters: () => void;
};
