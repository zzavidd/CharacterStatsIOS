import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { capitalCase } from 'capital-case';
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
      {types.map((type, key) => {
        return <Text key={key}>{type}</Text>;
      })}
      {abilities.map(({ name }, key) => {
        return <Text key={key}>{name}</Text>;
      })}
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

type PokeType = {
  name: string;
  url: string;
};

type PokeAbility = {
  name: string;
  url: string;
};
