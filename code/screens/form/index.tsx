import { StackScreenProps, useHeaderHeight } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import CharacterLearnsetForm from './learnset';
import DisplayedList from './list';
import CharacterStatsForm from './stats';

import {
  AbilitySelect,
  Select,
  TextInput,
  TypeSelect
} from '../../components/input';
import { Universes } from '../../constants/fields';
import styles from '../../styles/Form.styles';
import { GenericListItem, PokeMove, RootStackParamList } from '../../types';
import { Character, CharacterStats } from '../../types/classes';
import {
  setCharacters,
  useAppDispatch,
  useAppSelector
} from '../../utils/reducers';
import * as Storage from '../../utils/storage';

export default function Form({
  route,
  navigation
}: StackScreenProps<RootStackParamList, 'Form'>) {
  const { moves, abilities } = useAppSelector((state) => state);

  const [character, setCharacter] = useState<Character>(new Character());
  const [baseStatTotal, setBaseStatTotal] = useState(0);
  const [displayedListItems, setDisplayedListItems] = useState<
    Array<GenericListItem>
  >([]);
  const [focusedField, setFocusedField] = useState<keyof Character>('name');

  const headerHeight = useHeaderHeight();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const { params } = route;
    if (params?.isEdit) {
      setCharacter(params.character);
    }
  }, []);

  useEffect(() => {
    const bst = Character.calculateBST(character);
    setBaseStatTotal(bst);
  }, [JSON.stringify(character)]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <Button
            title={route.params?.isEdit ? 'Update' : 'Submit'}
            onPress={onConfirm}
          />
        );
      }
    });
  });

  /**
   * Hook for setting character information.
   * @param value The value to set.
   * @param property The character property to set the value to.
   */
  const setCharacterProperty = (value: any, property: keyof Character) => {
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
      learnset: [move.id, ...character.learnset]
    }));
  };

  /**
   * Filters the move list to only return moves whose name or type match input.
   * @param text The form field.
   */
  const filterMatchingMoves = (text: string) => {
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

  /**
   * Filters the move list to only return moves whose name or type match input.
   * @param text The form field.
   */
  const filterMatchingAbilities = (text: string) => {
    if (!text) {
      setDisplayedListItems(abilities);
      return;
    }

    const filteredList = abilities.filter((ability) => {
      if (ability.name.toLowerCase().includes(text.toLowerCase())) {
        return true;
      }
      if (ability.commonType.toLowerCase().includes(text.toLowerCase())) {
        return true;
      }
      return false;
    });

    setDisplayedListItems(filteredList);
  };

  const onConfirm = async () => {
    if (route.params?.isEdit) {
      await Storage.update(character);
    } else {
      await Storage.insert(character);
    }
    const allCharacters = (await Storage.getAll()) as Character[];
    dispatch(setCharacters(allCharacters));
    navigation.goBack();
  };

  const commonProps = {
    setCharacterProperty,
    setDisplayedListItems,
    setFocusedField
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <StatusBar style={'light'} />
        <ScrollView style={styles.form}>
          <KeyboardAvoidingView
            behavior={'padding'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={headerHeight}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View>
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
                  filterMatchingAbilities={filterMatchingAbilities}
                  {...commonProps}
                />
                <AbilitySelect
                  name={'ability2'}
                  value={character.ability2}
                  placeholder={'Select second ability...'}
                  filterMatchingAbilities={filterMatchingAbilities}
                  {...commonProps}
                />
                <AbilitySelect
                  name={'abilityX'}
                  value={character.abilityX}
                  placeholder={'Select hidden ability...'}
                  filterMatchingAbilities={filterMatchingAbilities}
                  {...commonProps}
                />
                <CharacterStatsForm
                  character={character}
                  baseStatTotal={baseStatTotal}
                  setCharacterStat={setCharacterStat}
                />
                <CharacterLearnsetForm
                  useCharacterState={[character, setCharacter]}
                  allMoves={moves}
                  filterMatchingMoves={filterMatchingMoves}
                  setDisplayedListItems={setDisplayedListItems}
                  setFocusedField={setFocusedField}
                />
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </ScrollView>
        <KeyboardAvoidingView
          behavior={'padding'}
          style={styles.list}
          keyboardVerticalOffset={headerHeight}>
          <DisplayedList
            items={displayedListItems}
            field={focusedField}
            characterMethods={{
              addToCharacterLearnset,
              setCharacterProperty
            }}
          />
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
