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
import { organiseCharacters } from '../utils/helper';
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

  const StatEntry = ({ label, value }: StatEntryProps) => {
    return (
      <View style={styles.statEntry}>
        <Text style={styles.statLabel}>{label}:</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    );
  };

  const renderItem = ({ item, index }: ListRenderItemInfo<Character>) => {
    const { name, universe, type1, type2, stats } = item;
    const color1 = Color.TYPE[type1];
    const color2 = Color.TYPE[type2];
    const types = type1 + (type2 ? ` / ${type2}` : '');
    const bst = Character.calculateBST(item);
    return (
      <TouchableOpacity
        style={styles.cell}
        activeOpacity={0.6}
        key={index}
        onLongPress={() => showLongPressOptions(item)}>
        <LinearGradient
          colors={[color1, color2]}
          locations={[0.85, 0.85]}
          start={[0, 1]}
          end={[1, 0]}
          style={styles.cellLinGrad}>
          <Text style={styles.universe}>{universe}</Text>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.types}>{types}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statsBlockLeft}>
              <StatEntry label={'HP'} value={stats.hp} />
              <StatEntry label={'Atk'} value={stats.attack} />
              <StatEntry label={'Def'} value={stats.defence} />
            </View>
            <View style={styles.statsBlockRight}>
              <StatEntry label={'Sp. Atk'} value={stats.spAtk} />
              <StatEntry label={'Sp. Def'} value={stats.spDef} />
              <StatEntry label={'Speed'} value={stats.speed} />
            </View>
          </View>
          <Text style={styles.bst}>BST: {bst}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const showLongPressOptions = (character: Character) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Edit', 'Delete'],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 2
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          navigation.navigate('Form', {
            character,
            isEdit: true
          });
        } else if (buttonIndex === 2) {
          promptConfirmation(character);
        }
      }
    );
  };

  const promptConfirmation = (character: Character) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['No', 'Yes'],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 1
      },
      async (buttonIndex) => {
        if (buttonIndex === 1) {
          await Storage.remove(character.id);
          refreshCharacters();
        }
      }
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

function CharacterToolbar() {
  const { characters } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  const sortCharacters = (sortId: number) => {
    const allCharacters = organiseCharacters(characters, { sortId });
    dispatch(setCharacters(allCharacters));
  };

  return (
    <View style={styles.footer}>
      <Button
        title={'Sort By...'}
        onPress={() => {
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options: [
                'Cancel',
                'Sort By Name (Ascending)',
                'Sort By Name (Descending)',
                'Sort By Type (Ascending)',
                'Sort By Type (Descending)'
              ],
              cancelButtonIndex: 0
            },
            (buttonIndex) => {
              sortCharacters(buttonIndex);
            }
          );
        }}
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

type CharacterToolbarProps = {
  refreshCharacters: () => void;
};

type StatEntryProps = {
  label: string;
  value?: number;
};

type DevToolsProps = {
  refreshCharacters: () => void;
};
