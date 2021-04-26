import { StackScreenProps, useHeaderHeight } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Button,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  ListRenderItemInfo,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import {
  AbilitySelect,
  MoveSelect,
  Select,
  StatInput,
  TextInput,
  TypeSelect
} from '../components/input';
import { Universes } from '../constants/fields';
import styles from '../styles/Form.styles';
import { GenericListItem, PokeMove, RootStackParamList } from '../types';
import { Character, CharacterStats } from '../types/classes';
import { Stat } from '../types/enums';
import { findMoveById } from '../utils/helper';
import { useAppSelector } from '../utils/reducers';
import * as Storage from '../utils/storage';

export default function Form({
  navigation
}: StackScreenProps<RootStackParamList, 'Form'>) {
  const headerHeight = useHeaderHeight();
  const { moves } = useAppSelector((state) => state);

  const [character, setCharacter] = useState<Character>(new Character());
  const [displayedListItems, setDisplayedListItems] = useState<
    Array<GenericListItem>
  >([]);
  const [focusedField, setFocusedField] = useState<keyof Character>('name');

  /**
   * Hook for setting character information.
   * @param value The value to set.
   * @param property The character property to set the value to.
   */
  const setCharacterMeta = (value: any, property: keyof Character) => {
    setCharacter((character) => ({ ...character, [property]: value }));
  };

  /**
   * Hook for setting a character stat number.
   * @param value The number (as a string) to set to a stat.
   * @param property The stat property.
   */
  const setCharacterStat = (value: string, property: keyof CharacterStats) => {
    setCharacter((character) => ({
      ...character,
      stats: { ...character.stats, [property]: value }
    }));
  };

  /**
   * Hook adding a new move to the character's learnset.
   * @param move The move to add.
   */
  const setCharacterLearnset = (move: PokeMove) => {
    setCharacter((character) => ({
      ...character,
      learnset: [...character.learnset, move.id]
    }));
  };

  /**
   * Filters the move list to only return moves whose name or type match input.
   * @param text The form field.
   */
  const filterMoves = (text: string) => {
    if (!text) {
      setDisplayedListItems(moves);
      return;
    }

    const filteredList = moves.filter((move) => {
      if (move.name.toLowerCase().includes(text.toLowerCase())) {
        return true;
      }
      if (move.type.toLowerCase().includes(text.toLowerCase())) {
        return true;
      }
      return false;
    });

    setDisplayedListItems(filteredList);
  };

  const commonProps = {
    setCharacterMeta,
    setDisplayedListItems,
    setFocusedField
  };

  return (
    <KeyboardAvoidingView
      behavior={'padding'}
      style={styles.container}
      keyboardVerticalOffset={headerHeight}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.main}>
          <StatusBar style={'light'} />
          <ScrollView style={styles.form}>
            <TextInput
              name={'name'}
              value={character.name}
              placeholder={'Enter character name...'}
              {...commonProps}
            />
            <Select
              name={'universe'}
              value={character.universe}
              items={Universes}
              placeholder={'Select origin universe...'}
              {...commonProps}
            />
            <View style={styles.formTypes}>
              <TypeSelect
                name={'type1'}
                value={character.type1}
                placeholder={'First type...'}
                style={styles.formTypesField}
                {...commonProps}
              />
              <TypeSelect
                name={'type2'}
                value={character.type2}
                placeholder={'Second type...'}
                style={styles.formTypesField}
                {...commonProps}
              />
            </View>
            <AbilitySelect
              name={'ability1'}
              value={character.ability1}
              placeholder={'Select first ability...'}
              {...commonProps}
            />
            <AbilitySelect
              name={'ability2'}
              value={character.ability2}
              placeholder={'Select second ability...'}
              {...commonProps}
            />
            <AbilitySelect
              name={'abilityX'}
              value={character.abilityX}
              placeholder={'Select hidden ability...'}
              {...commonProps}
            />
            <CharacterStatsForm
              character={character}
              setCharacterStat={setCharacterStat}
            />
            <CharacterLearnsetForm
              character={character}
              allMoves={moves}
              filterMatchingMoves={filterMoves}
              setCharacterLearnset={setCharacterLearnset}
              setDisplayedListItems={setDisplayedListItems}
              setFocusedField={setFocusedField}
            />
            <Button
              title={'Save'}
              onPress={async () => {
                await Storage.save(character);
                navigation.goBack();
              }}
            />
          </ScrollView>
          <View style={styles.list}>
            <DisplayedList
              items={displayedListItems}
              field={focusedField}
              characterMethods={{ setCharacterLearnset, setCharacterMeta }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

function CharacterStatsForm({
  character,
  setCharacterStat
}: CharacterStatsFormProps) {
  const commonProps = {
    setCharacterStat,
    style: styles.formStatsField
  };
  return (
    <>
      <Text style={styles.label}>Stats:</Text>
      <View style={styles.formStats}>
        <StatInput
          name={Stat.HP}
          value={character.stats?.hp}
          placeholder={'HP'}
          {...commonProps}
        />
        <StatInput
          name={Stat.ATTACK}
          value={character.stats?.attack}
          placeholder={'Attack'}
          {...commonProps}
        />
        <StatInput
          name={Stat.DEFENCE}
          value={character.stats?.defence}
          placeholder={'Defence'}
          {...commonProps}
        />
      </View>
      <View style={styles.formStats}>
        <StatInput
          name={Stat.SPATK}
          value={character.stats?.spAtk}
          placeholder={'Sp. Atk'}
          {...commonProps}
        />
        <StatInput
          name={Stat.SPDEF}
          value={character.stats?.spDef}
          placeholder={'Sp. Def'}
          {...commonProps}
        />
        <StatInput
          name={Stat.SPEED}
          value={character.stats?.speed}
          placeholder={'Speed'}
          {...commonProps}
        />
      </View>
    </>
  );
}

function CharacterLearnsetForm({
  allMoves,
  character,
  filterMatchingMoves,
  setCharacterLearnset,
  setDisplayedListItems,
  setFocusedField
}: CharacterLearnsetFormProps) {
  const [value, setValue] = useState('');

  const renderItem = ({ item, index }: ListRenderItemInfo<number>) => {
    const move = findMoveById(item, allMoves);
    if (!move) return null;

    const style = { backgroundColor: move.color };
    return (
      <View style={[styles.learnsetMove, style]} key={index}>
        <Text style={styles.learnsetMoveText}>{move.name}</Text>
      </View>
    );
  };

  return (
    <>
      <Text style={styles.label}>Learnset:</Text>
      <MoveSelect
        name={'learnset'}
        value={value}
        placeholder={'Select a move...'}
        onChangeText={(text) => {
          filterMatchingMoves(text);
          setValue(text);
        }}
        onSubmitEditing={() => setValue('')}
        setCharacterLearnset={setCharacterLearnset}
        setDisplayedListItems={setDisplayedListItems}
        setFocusedField={setFocusedField}
      />
      <View style={styles.learnsetList}>
        <FlatList
          data={character.learnset}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
        />
      </View>
    </>
  );
}

function DisplayedList({ items, field, characterMethods }: DisplayedListProps) {
  const { setCharacterLearnset, setCharacterMeta } = characterMethods;

  const renderItem = ({ item, index }: ListRenderItemInfo<GenericListItem>) => {
    let onPress;
    if (field === 'learnset') {
      onPress = () => setCharacterLearnset(item as PokeMove);
    } else {
      onPress = () => setCharacterMeta(item.name, field);
    }
    return <DisplayedListItem item={item} index={index} onPress={onPress} />;
  };

  return (
    <FlatList
      data={items}
      keyExtractor={(item: GenericListItem) => item.id.toString()}
      renderItem={renderItem}
      removeClippedSubviews={true}
      initialNumToRender={20}
      keyboardShouldPersistTaps={'handled'}
    />
  );
}

const DisplayedListItem = React.memo((props: DisplayedListItemProps) => {
  const { item, index, onPress } = props;
  const itemStyle = {
    backgroundColor: item.color
  };

  return (
    <TouchableOpacity onPress={onPress} key={index}>
      <Text style={[styles.listItem, itemStyle]}>{item.name}</Text>
    </TouchableOpacity>
  );
});

type CharacterStatsFormProps = {
  character: Character;
  setCharacterStat: (value: string, property: Stat) => void;
};

type CharacterLearnsetFormProps = {
  allMoves: PokeMove[];
  character: Character;
  filterMatchingMoves: (text: string) => void;
  setCharacterLearnset: (move: PokeMove) => void;
  setDisplayedListItems: React.Dispatch<React.SetStateAction<Array<any>>>;
  setFocusedField: React.Dispatch<React.SetStateAction<keyof Character>>;
};

type DisplayedListProps = {
  items: GenericListItem[];
  field: keyof Character;
  characterMethods: {
    setCharacterLearnset: (move: PokeMove) => void;
    setCharacterMeta: (value: any, property: keyof Character) => void;
  };
};

type DisplayedListItemProps = {
  item: GenericListItem;
  index: number;
  onPress: any;
};
