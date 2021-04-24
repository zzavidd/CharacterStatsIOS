import { StackScreenProps } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Button,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View
} from 'react-native';

import { NumberInput, SelectInput, TextInput } from '../components/input';
import { Universes } from '../constants/fields';
import styles from '../styles/Form.styles';
import {
  GenericListItem,
  ResponseAbility,
  ResponseMove,
  ResponseType,
  RootStackParamList
} from '../types';
import { Character, CharacterStats } from '../types/classes';
import { useAppSelector } from '../utils/reducers';
import * as Storage from '../utils/storage';

export default function Form({
  navigation
}: StackScreenProps<RootStackParamList, 'Form'>) {
  const { types, abilities, moves } = useAppSelector((state) => state);

  const [character, setCharacter] = useState<Character>(new Character());
  const [displayedListItems, setDisplayedListItems] = useState<
    Array<GenericListItem>
  >([]);
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
    <SafeAreaView style={styles.container}>
      <StatusBar style={'light'} />
      <View style={styles.form}>
        <TextInput
          name={'name'}
          value={character.name}
          placeholder={'Enter name'}
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
          <SelectInput<ResponseType>
            name={'type1'}
            value={character.type1}
            options={types}
            placeholder={'First type...'}
            style={styles.formTypesField}
            {...commonProps}
          />
          <SelectInput<ResponseType>
            name={'type2'}
            value={character.type2}
            options={types}
            placeholder={'Second type...'}
            style={styles.formTypesField}
            {...commonProps}
          />
        </View>
        <SelectInput<ResponseAbility>
          name={'ability1'}
          value={character.ability1}
          options={abilities}
          placeholder={'Select first ability'}
          {...commonProps}
        />
        <SelectInput<ResponseAbility>
          name={'ability2'}
          value={character.ability2}
          options={abilities}
          placeholder={'Select second ability'}
          {...commonProps}
        />
        <SelectInput<ResponseAbility>
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
        <SelectInput<ResponseMove>
          name={'learnset'}
          value={character.name}
          options={moves}
          placeholder={'Learnset'}
          {...commonProps}
        />
        <Button
          title={'Save'}
          onPress={async () => {
            await Storage.save(character);
            navigation.goBack();
          }}
        />
      </View>
      <DisplayedList
        items={displayedListItems}
        field={focusedField}
        setCharacterMeta={setCharacterMeta}
      />
    </SafeAreaView>
  );
}

function DisplayedList({ items, field, setCharacterMeta }: DisplayedListProps) {
  const renderItem = ({ item, index }: ListRenderItemInfo<GenericListItem>) => {
    return (
      <DisplayedListItem
        item={item}
        index={index}
        field={field}
        setCharacterMeta={setCharacterMeta}
      />
    );
  };
  return (
    <View style={styles.list}>
      <FlatList
        data={items}
        keyExtractor={(item: GenericListItem) => item.id.toString()}
        renderItem={renderItem}
        removeClippedSubviews={true}
        initialNumToRender={20}
      />
    </View>
  );
}

const DisplayedListItem = React.memo((props: DisplayedListItemProps) => {
  const { item, index, field, setCharacterMeta } = props;

  return (
    <TouchableOpacity
      onPress={() => {
        setCharacterMeta(item.name, field);
      }}
      key={index}>
      <Text
        style={[
          styles.listItem,
          {
            backgroundColor: item.color
          }
        ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
});

type DisplayedListProps = {
  items: GenericListItem[];
  field: keyof Character;
  setCharacterMeta: (value: any, property: keyof Character) => void;
};

type DisplayedListItemProps = {
  item: GenericListItem;
  index: number;
  field: keyof Character;
  setCharacterMeta: (value: any, property: keyof Character) => void;
};
