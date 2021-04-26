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
   * Hook for adding a new move to the character's learnset if it does not
   * already exist.
   * @param move The move to add.
   */
  const addToCharacterLearnset = (move: PokeMove) => {
    if (character.learnset.includes(move.id)) return;

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
    <View style={styles.container}>
      <View style={styles.main}>
        <StatusBar style={'light'} />
        <KeyboardAvoidingView
          behavior={'padding'}
          style={styles.container}
          keyboardVerticalOffset={headerHeight}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                useCharacterState={[character, setCharacter]}
                allMoves={moves}
                filterMatchingMoves={filterMoves}
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
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        <KeyboardAvoidingView
          behavior={'padding'}
          style={styles.list}
          keyboardVerticalOffset={headerHeight}>
          <DisplayedList
            items={displayedListItems}
            field={focusedField}
            characterMethods={{ addToCharacterLearnset, setCharacterMeta }}
          />
        </KeyboardAvoidingView>
      </View>
    </View>
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
  useCharacterState,
  filterMatchingMoves,
  setDisplayedListItems,
  setFocusedField
}: CharacterLearnsetFormProps) {
  const [character, setCharacter] = useCharacterState;
  const [value, setValue] = useState('');

  const moveUp = (item: number, index: number) => {
    if (index === 0) return;

    const { learnset } = character;
    learnset.splice(index, 1);
    learnset.splice(index - 1, 0, item);
    setCharacter((character) => ({
      ...character,
      learnset
    }));
  };

  const moveDown = (item: number, index: number) => {
    const { learnset } = character;
    if (index === learnset.length - 1) return;

    learnset.splice(index, 1);
    learnset.splice(index + 1, 0, item);
    setCharacter((character) => ({
      ...character,
      learnset
    }));
  };

  const deleteMove = (index: number) => {
    const { learnset } = character;
    learnset.splice(index, 1);
    setCharacter((character) => ({
      ...character,
      learnset
    }));
  };

  return (
    <>
      <Text style={styles.label}>Learnset:</Text>
      <View style={styles.learnsetList}>
        {character.learnset.map((item, key) => {
          const move = findMoveById(item, allMoves);
          if (!move) return null;

          const style = { backgroundColor: move.color };
          return (
            <View style={styles.learnsetRow} key={key}>
              <TouchableOpacity onPress={() => moveUp(item, key)}>
                <Text style={[styles.learnsetRowArrow, { paddingRight: 5 }]}>
                  &#9650;
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onLongPress={() => deleteMove(key)}
                style={{ flex: 1 }}>
                <View style={[styles.learnsetMove, style]}>
                  <Text style={styles.learnsetMoveText}>{move.name}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => moveDown(item, key)}>
                <Text style={[styles.learnsetRowArrow, { paddingLeft: 5 }]}>
                  &#9660;
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      <MoveSelect
        name={'learnset'}
        value={value}
        placeholder={'Type a move to filter...'}
        onChangeText={(text) => {
          filterMatchingMoves(text);
          setValue(text);
        }}
        onSubmitEditing={() => setValue('')}
        setDisplayedListItems={setDisplayedListItems}
        setFocusedField={setFocusedField}
      />
    </>
  );
}

function DisplayedList({ items, field, characterMethods }: DisplayedListProps) {
  const { addToCharacterLearnset, setCharacterMeta } = characterMethods;

  const renderItem = ({ item, index }: ListRenderItemInfo<GenericListItem>) => {
    let onPress;
    if (field === 'learnset') {
      onPress = () => addToCharacterLearnset(item as PokeMove);
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
  useCharacterState: [
    Character,
    React.Dispatch<React.SetStateAction<Character>>
  ];
  filterMatchingMoves: (text: string) => void;
  setDisplayedListItems: React.Dispatch<React.SetStateAction<Array<any>>>;
  setFocusedField: React.Dispatch<React.SetStateAction<keyof Character>>;
};

type DisplayedListProps = {
  items: GenericListItem[];
  field: keyof Character;
  characterMethods: {
    addToCharacterLearnset: (move: PokeMove) => void;
    setCharacterMeta: (value: any, property: keyof Character) => void;
  };
};

type DisplayedListItemProps = {
  item: GenericListItem;
  index: number;
  onPress: any;
};
