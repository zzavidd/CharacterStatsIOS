import { StatusBar } from 'expo-status-bar';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Text,
  TextInput as ITextInput,
  TextInputProps,
  View
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Color from '../constants/colors';
import { Universes } from '../constants/fields';
import styles from '../styles/Form.styles';
import { Character } from '../utils/classes';
import { useAppSelector } from '../utils/reducers';
import { PokeAbility, PokeType } from '../utils/types';

export default function Form() {
  const { types, abilities, moves } = useAppSelector((state) => state);

  const [character, setCharacter] = useState<Character>(new Character());
  const [selectedField, setSelectedField] = useState<Array<any>>([]);

  useEffect(() => {
    console.log(selectedField);
  }, [selectedField]);

  const selectRef = useRef<ITextInput>(null);

  const setCharacterMeta = (value: any, property: keyof Character) => {
    setCharacter((character) => {
      character[property] = value;
      return character;
    });
  };

  const { TextInput, SelectInput } = createInputs(
    setCharacterMeta,
    setSelectedField,
    selectRef
  );

  return (
    <View style={styles.container}>
      <StatusBar style={'light'} />
      <View style={styles.form}>
        <TextInput
          name={'name'}
          value={character.name}
          placeholder={'Enter name'}
          autoFocus={true}
        />
        <SelectInput
          name={'universe'}
          value={character.universe}
          options={Universes}
          placeholder={'Select universe'}
        />
        <View style={styles.formTypes}>
          <SelectInput<PokeType>
            name={'type1'}
            value={character.type1}
            options={types}
            placeholder={'First type...'}
            style={styles.formTypesField}
          />
          <SelectInput<PokeType>
            name={'type2'}
            value={character.type2}
            options={types}
            placeholder={'Second type...'}
            style={styles.formTypesField}
          />
        </View>
        <SelectInput<PokeAbility>
          name={'ability1'}
          value={character.ability1}
          options={abilities}
          placeholder={'Select first ability'}
        />
        <SelectInput<PokeAbility>
          name={'ability2'}
          value={character.ability2}
          options={abilities}
          placeholder={'Select second ability'}
        />
        <SelectInput<PokeAbility>
          name={'abilityX'}
          value={character.abilityX}
          options={abilities}
          placeholder={'Select hidden ability'}
        />
      </View>
      <MetaList selectedField={selectedField} selectRef={selectRef} />
    </View>
  );
}

function MetaList({ selectedField, selectRef }: MetaListProps) {
  return (
    <View style={styles.list}>
      <FlatList
        data={selectedField}
        keyExtractor={(item) => item.name ?? item}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                const select = selectRef.current;
                if (select && select.isFocused) {
                  select.setNativeProps({
                    text: item.name ?? item
                  });
                }
              }}>
              <Text style={styles.listItem}>{item.name ?? item}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

function createInputs(
  setCharacterMeta: (value: any, property: keyof Character) => void,
  setSelectedField: React.Dispatch<React.SetStateAction<Array<any>>>,
  selectRef: RefObject<ITextInput>
) {
  const SelectInput = <T extends unknown>(props: SelectInputProps<T>) => {
    const { options } = props;
    return (
      <TextInput
        {...props}
        ref={selectRef}
        onFocus={() => setSelectedField(options)}
      />
    );
  };

  const TextInput = React.forwardRef<ITextInput, CustomTextInputProps>(
    (props, ref) => {
      const { name, style } = props;
      return (
        <ITextInput
          {...props}
          ref={ref}
          placeholderTextColor={Color.PLACEHOLDER_TEXT_COLOR}
          style={[styles.formTextInput, style]}
          onChangeText={(text) => setCharacterMeta(text, name)}
        />
      );
    }
  );

  return { TextInput, SelectInput };
}

type MetaListProps = {
  selectedField: any[];
  selectRef: RefObject<ITextInput>;
};

interface CustomTextInputProps extends TextInputProps {
  name: keyof Character;
}

interface SelectInputProps<T> extends CustomTextInputProps {
  options: T[];
}
