import { capitalCase } from 'capital-case';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import COLOR from '../constants/colors';
import request from '../utils/request';

export default function Home() {
  const [types, setTypes] = useState<Array<string>>([]);
  const [abilities, setAbilities] = useState<Array<PokeAbility>>([]);

  useEffect(() => {
    getPokeTypes();
    getPokeAbilities();
  }, []);

  const getPokeTypes = () => {
    request('https://pokeapi.co/api/v2/type', ({ results }) => {
      const bannedTypes = ['Shadow', 'Unknown'];
      const typeList = results
        .map((type: PokeType) => capitalCase(type.name))
        .filter((type: string) => type && !bannedTypes.includes(type))
        .sort();
      setTypes(typeList);
    });
  };

  const getPokeAbilities = () => {
    request('https://pokeapi.co/api/v2/ability', ({ results }) => {
      const abilityList = results
        .map((ability: PokeAbility) => {
          ability.name = capitalCase(ability.name);
          return ability;
        })
        .sort((a: PokeAbility, b: PokeAbility) => {
          return a.name > b.name;
        });
      setAbilities(abilityList);
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={types}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          return <Text>{item}</Text>;
        }}
      />
      <FlatList
        data={abilities}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => {
          return <Text>{item.name}</Text>;
        }}
      />
      <StatusBar style={'dark'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    display: 'flex',
    flex: 1,
    justifyContent: 'center'
  }
});

type PokeType = {
  name: string;
  url: string;
};

type PokeAbility = {
  name: string;
  url: string;
};
