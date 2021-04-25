import React from 'react';
import {
  StyleProp,
  TextInput as IInput,
  TextInputProps,
  TextStyle
} from 'react-native';

import Color from '../constants/colors';
import styles from '../styles/Form.styles';
import { Character, CharacterStats } from '../types/classes';

export function TextInput(props: CustomTextInputProps) {
  const { name, style, setCharacterMeta } = props;
  return (
    <IInput
      {...props}
      placeholderTextColor={Color.PLACEHOLDER_TEXT_COLOR}
      onChangeText={(text) => setCharacterMeta(text, name)}
      style={[styles.textInput, style]}
      keyboardAppearance={'dark'}
      autoCompleteType={'off'}
      returnKeyType={'next'}
    />
  );
}

export function SelectInput<T extends unknown>(props: SelectInputProps<T>) {
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

export function NumberInput(props: NumberInputProps) {
  const { name, placeholder, setCharacterStat, style } = props;
  return (
    <IInput
      {...props}
      value={props.value?.toString()}
      onChangeText={(text) => setCharacterStat(text, name)}
      placeholder={placeholder}
      placeholderTextColor={Color.PLACEHOLDER_TEXT_COLOR}
      style={[styles.textInput, style]}
      clearTextOnFocus={true}
      keyboardAppearance={'dark'}
      keyboardType={'number-pad'}
      returnKeyType={'next'}
    />
  );
}

interface CustomTextInputProps extends TextInputProps {
  name: keyof Character;
  setCharacterMeta: (value: any, property: keyof Character) => void;
}

interface NumberInputProps {
  name: keyof CharacterStats;
  placeholder: string;
  value: number | undefined;
  style?: StyleProp<TextStyle>;
  setCharacterStat: (value: string, property: keyof CharacterStats) => void;
}

interface SelectInputProps<T> extends CustomTextInputProps {
  name: keyof Character;
  options: T[];
  setDisplayedListItems: React.Dispatch<React.SetStateAction<Array<any>>>;
  setFocusedField: React.Dispatch<React.SetStateAction<keyof Character>>;
}
