import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Home() {
  const [types, setTypes] = useState<Array<string>>([]);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/type')
      .then((res) => res.json())
      .then(({ results }) => {
        const bannedTypes = ['Shadow', 'Unknown'];
        const typeList = results
          .map((type: PokeType) => {
            const { name } = type;
            const label =
              name.charAt(0).toUpperCase() + name.substr(1).toLowerCase();
            if (bannedTypes.includes(label)) return;
            return label;
          })
          .sort();
        setTypes(typeList);
      })
      .catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      {types.map((type, key) => {
        return <Text key={key}>{type}</Text>;
      })}
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

type PokeType = {
  name: string;
  url: string;
};
