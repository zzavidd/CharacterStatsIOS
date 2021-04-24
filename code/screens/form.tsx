import { StatusBar } from 'expo-status-bar';
import React, { RefObject, useRef, useState } from 'react';
import {
  Button,
  FlatList,
  StyleProp,
  Text,
  TextInput as ITextInput,
  TextInputProps,
  TextStyle,
  View
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Color from '../constants/colors';
import { Universes } from '../constants/fields';
import styles from '../styles/Form.styles';
import { Character, CharacterStats } from '../utils/classes';
import { useAppSelector } from '../utils/reducers';
import { PokeAbility, PokeType } from '../utils/types';

export default function Form() {
  const { types, abilities, moves } = useAppSelector((state) => state);

  const [character, setCharacter] = useState<Character>(new Character());
  const [displayedListItems, setDisplayedListItems] = useState<Array<any>>([]);
  const [focusedField, setFocusedField] = useState<keyof Character>('name');

  const setCharacterMeta = (value: any, property: keyof Character) => {
    setCharacter((character) => ({ ...character, [property]: value }));
  };

  const setCharacterStat = (value: string, property: keyof CharacterStats) => {
    setCharacter((character) => ({
      ...character,
      stats: { ...character.stats, [property]: value }
    }));
  };

  const commonProps = {
    setCharacterMeta,
    setDisplayedListItems,
    setFocusedField
  };

  return (
    <View style={styles.container}>
      <StatusBar style={'light'} />
      <View style={styles.form}>
        <TextInput
          name={'name'}
          value={character.name}
          placeholder={'Enter name'}
          autoFocus={true}
          {...commonProps}
        />
        <SelectInput
          name={'universe'}
          value={character.universe}
          options={Universes}
          placeholder={'Select universe'}
          {...commonProps}
        />
        <View style={styles.formTypes}>
          <SelectInput<PokeType>
            name={'type1'}
            value={character.type1}
            options={types}
            placeholder={'First type...'}
            style={styles.formTypesField}
            {...commonProps}
          />
          <SelectInput<PokeType>
            name={'type2'}
            value={character.type2}
            options={types}
            placeholder={'Second type...'}
            style={styles.formTypesField}
            {...commonProps}
          />
        </View>
        <SelectInput<PokeAbility>
          name={'ability1'}
          value={character.ability1}
          options={abilities}
          placeholder={'Select first ability'}
          {...commonProps}
        />
        <SelectInput<PokeAbility>
          name={'ability2'}
          value={character.ability2}
          options={abilities}
          placeholder={'Select second ability'}
          {...commonProps}
        />
        <SelectInput<PokeAbility>
          name={'abilityX'}
          value={character.abilityX}
          options={abilities}
          placeholder={'Select hidden ability'}
          {...commonProps}
        />
        <View style={styles.formStats}>
          <NumberInput
            name={'hp'}
            value={character.stats?.hp}
            placeholder={'HP'}
            setCharacterStat={setCharacterStat}
            style={styles.formStatsField}
          />
          <NumberInput
            name={'attack'}
            value={character.stats?.attack}
            placeholder={'Attack'}
            setCharacterStat={setCharacterStat}
            style={styles.formStatsField}
          />
          <NumberInput
            name={'defence'}
            value={character.stats?.defence}
            placeholder={'Defence'}
            setCharacterStat={setCharacterStat}
            style={styles.formStatsField}
          />
        </View>
        <View style={styles.formStats}>
          <NumberInput
            name={'spAtk'}
            value={character.stats?.spAtk}
            placeholder={'Sp. Atk'}
            setCharacterStat={setCharacterStat}
            style={styles.formStatsField}
          />
          <NumberInput
            name={'spDef'}
            value={character.stats?.spDef}
            placeholder={'Sp. Def'}
            setCharacterStat={setCharacterStat}
            style={styles.formStatsField}
          />
          <NumberInput
            name={'speed'}
            value={character.stats?.speed}
            placeholder={'Speed'}
            setCharacterStat={setCharacterStat}
            style={styles.formStatsField}
          />
        </View>
        <Button
          title={'Save'}
          onPress={() => {
            console.log(character);
          }}
        />
      </View>
      <MetaList
        displayedListItems={displayedListItems}
        focusedField={focusedField}
        setCharacterMeta={setCharacterMeta}
      />
    </View>
  );
}

function MetaList({
  displayedListItems,
  focusedField,
  setCharacterMeta
}: MetaListProps) {
  return (
    <View style={styles.list}>
      <FlatList
        data={displayedListItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setCharacterMeta(item.name, focusedField);
              }}
              key={index}>
              <Text style={styles.listItem}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

function TextInput(props: CustomTextInputProps) {
  const { name, style, setCharacterMeta } = props;
  return (
    <ITextInput
      {...props}
      placeholderTextColor={Color.PLACEHOLDER_TEXT_COLOR}
      style={[styles.formTextInput, style]}
      onChangeText={(text) => setCharacterMeta(text, name)}
    />
  );
}

function SelectInput<T extends unknown>(props: SelectInputProps<T>) {
  const { name, options, setDisplayedListItems, setFocusedField } = props;
  return (
    <TextInput
      {...props}
      onFocus={() => {
        setDisplayedListItems(options);
        setFocusedField(name);
      }}
    />
  );
}

function NumberInput(props: NumberInputProps) {
  const { name, placeholder, setCharacterStat, style } = props;
  return (
    <ITextInput
      {...props}
      value={props.value?.toString()}
      keyboardType={'numeric'}
      placeholder={placeholder}
      placeholderTextColor={Color.PLACEHOLDER_TEXT_COLOR}
      style={[styles.formTextInput, style]}
      onChangeText={(text) => setCharacterStat(text, name)}
    />
  );
}

type MetaListProps = {
  displayedListItems: any[];
  focusedField: keyof Character;
  setCharacterMeta: (value: any, property: keyof Character) => void;
};

interface CustomTextInputProps extends TextInputProps {
  name: keyof Character;
  setCharacterMeta: (value: any, property: keyof Character) => void;
}

interface NumberInputProps {
  name: keyof CharacterStats;
  placeholder: string;
  value: number;
  style?: StyleProp<TextStyle>;
  setCharacterStat: (value: string, property: keyof CharacterStats) => void;
}

interface SelectInputProps<T> extends CustomTextInputProps {
  name: keyof Character;
  options: T[];
  setDisplayedListItems: React.Dispatch<React.SetStateAction<Array<any>>>;
  setFocusedField: React.Dispatch<React.SetStateAction<keyof Character>>;
}
