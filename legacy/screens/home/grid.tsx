import type { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import type {
  ListRenderItemInfo,
  SectionListData,
  SectionListRenderItemInfo} from 'react-native';
import {
  ActionSheetIOS,
  FlatList,
  SectionList,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import Color from '../../constants/colors';
import { GroupOptions } from '../../constants/options';
import styles from '../../styles/Home.styles';
import type { RootStackParamList } from '../../types';
import { Character } from '../../types/classes';
import type { CharacterGroup} from '../../utils/helper';
import { groupCharacters, sortCharacters } from '../../utils/helper';
import { setCharacters, useAppSelector, useAppDispatch } from '../../utils/reducers';
import * as Storage from '../../utils/storage';

export default function CharacterGrid({
  characters,
  refreshCharacters,
  navigation
}: CharacterGridProps) {
  const { sortValue, groupValue } = useAppSelector((state) => state);
  const [characterGroups, setCharacterGroups] = useState<CharacterGroup[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const allCharacters = sortCharacters(characters);
    dispatch(setCharacters(allCharacters));
  }, [sortValue]);

  useEffect(() => {
    const groups = groupCharacters(characters);
    setCharacterGroups(groups);
  }, [sortValue, groupValue]);
  /**
   * Show action sheet on long-pressing character cell.
   * @param character The subject character.
   */
  const showLongPressOptions = (character: Character) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Edit', 'Delete'],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 2,
        message: `What do you want to do with ${character.name}?`
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

  /**
   * Prompts for confirmation to delete character.
   * @param character The character to delete.
   */
  const promptConfirmation = (character: Character) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['No', 'Yes'],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 1,
        title: `Are you sure you want to delete ${character.name}?`
      },
      async (buttonIndex) => {
        if (buttonIndex === 1) {
          await Storage.remove(character.id);
          refreshCharacters();
        }
      }
    );
  };

  if (!characters?.length) return <View style={styles.table} />;

  function StatEntry({ label, value }: StatEntryProps) {
    return (
      <View style={styles.statEntry}>
        <Text style={styles.statLabel}>{label}:</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    );
  }

  const renderSectionHeader = (info: {
    section: SectionListData<Character[], CharacterGroup>;
  }) => {
    const { section } = info;
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderTitle}>
          {GroupOptions[groupValue][1]}: {section.title}
        </Text>
      </View>
    );
  };

  const renderSection = ({
    item
  }: SectionListRenderItemInfo<Character[], CharacterGroup>) => {
    return (
      <FlatList
        data={item}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={renderItem}
        scrollEnabled={false}
        style={styles.section}
      />
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

  return (
    <View style={styles.table}>
      {groupValue > 1 ? (
        <SectionList
          sections={characterGroups}
          keyExtractor={([item]) => item.id}
          renderItem={renderSection}
          renderSectionHeader={renderSectionHeader}
        />
      ) : (
        <FlatList
          data={characters}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

interface CharacterGridProps {
  characters: Character[];
  refreshCharacters: () => void;
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}

interface StatEntryProps {
  label: string;
  value?: number;
}
