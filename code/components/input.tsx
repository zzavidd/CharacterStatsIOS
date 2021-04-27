import React from 'react';
import {
  StyleProp,
  TextInput as DefaultInput,
  TextInputProps as DefaultInputProps,
  TextStyle
} from 'react-native';

import Color from '../constants/colors';
import styles from '../styles/Form.styles';
import { Character, CharacterStats } from '../types/classes';
import { useAppSelector } from '../utils/reducers';

export function TextInput(props: TextInputProps) {
  const { name, setCharacterProperty } = props;
  return (
    <Input {...props} onChangeText={(text) => setCharacterProperty(text, name)} />
  );
}

export function StatInput(props: NumberInputProps) {
  const { name, setCharacterStat, value } = props;
  return (
    <Input
      {...props}
      value={value?.toString()}
      onChangeText={(text) => setCharacterStat(text, name)}
      keyboardType={'number-pad'}
    />
  );
}

export function TypeSelect(props: TypeSelectProps) {
  const { types } = useAppSelector((state) => state);
  const { name, setCharacterProperty } = props;
  return (
    <Select
      {...props}
      items={types}
      onChangeText={(text) => setCharacterProperty(text, name)}
    />
  );
}

export function AbilitySelect(props: AbilitySelectProps) {
  const { abilities } = useAppSelector((state) => state);
  const { name, setCharacterProperty } = props;
  return (
    <Select
      {...props}
      items={abilities}
      onChangeText={(text) => setCharacterProperty(text, name)}
    />
  );
}

export function MoveSelect(props: ScopedSelectProps) {
  const { moves } = useAppSelector((state) => state);
  const { name, setDisplayedListItems, setFocusedField } = props;
  return (
    <Input
      {...props}
      clearButtonMode={'always'}
      returnKeyLabel={'Add'}
      onFocus={() => {
        setDisplayedListItems(moves);
        setFocusedField(name);
      }}
    />
  );
}

export function Select<T extends unknown>(props: SelectProps<T>) {
  const { name, items, setDisplayedListItems, setFocusedField } = props;
  return (
    <Input
      {...props}
      onFocus={() => {
        setDisplayedListItems(items);
        setFocusedField(name);
      }}
    />
  );
}

function Input(props: InputProps) {
  return (
    <DefaultInput
      returnKeyLabel={'Confirm'}
      {...props}
      placeholderTextColor={Color.PLACEHOLDER_TEXT_COLOR}
      style={[styles.textInput, props.style]}
      keyboardAppearance={'dark'}
      autoCompleteType={'off'}
    />
  );
}

interface InputProps extends DefaultInputProps {
  name: any;
}

interface TextInputProps extends InputProps {
  name: keyof Character;
  setCharacterProperty: SetCharacterMetaType;
}

interface NumberInputProps {
  name: keyof CharacterStats;
  placeholder: string;
  value: number | undefined;
  style?: StyleProp<TextStyle>;
  setCharacterStat: (value: string, property: keyof CharacterStats) => void;
}

interface ScopedSelectProps extends InputProps {
  setDisplayedListItems: React.Dispatch<React.SetStateAction<Array<any>>>;
  setFocusedField: React.Dispatch<React.SetStateAction<keyof Character>>;
}

interface SelectProps<T> extends ScopedSelectProps {
  name: keyof Character;
  items: T[];
}

interface TypeSelectProps extends ScopedSelectProps {
  name: keyof Character;
  setCharacterProperty: SetCharacterMetaType;
}

interface AbilitySelectProps extends ScopedSelectProps {
  name: keyof Character;
  setCharacterProperty: SetCharacterMetaType;
}

type SetCharacterMetaType = (value: any, property: keyof Character) => void;
