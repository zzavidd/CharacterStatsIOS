import { Card, Text } from '@rneui/themed';
import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';

import { StatMap } from 'src/utils/constants/defaults';
import type { Stat } from 'src/utils/constants/enums';

import { useCharacters } from '../utils/hooks';

export default function HomeScreen() {
  const { data } = useCharacters();

  // if (!data) {
  //   return null;
  // }

  return (
    <SafeAreaView>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item: character }) => (
          <Card>
            <Card.Title style={{ textAlign: 'left' }}>
              <Text h4={true}>{character.name}</Text>
            </Card.Title>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              <Text>{character.type1}</Text>
              {character.type2 ? (
                <React.Fragment>
                  <Text>/</Text>
                  <Text>{character.type2}</Text>
                </React.Fragment>
              ) : null}
            </View>
            <Card.Divider />
            <View>
              {Object.entries(character.stats).map(([stat, value]) => (
                <View key={`${character.id}-${stat}`}>
                  <View>
                    <Text>
                      {StatMap[stat as Stat]}: {value}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}
