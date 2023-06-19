import { Button, Card, Text } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext } from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList, SafeAreaView, View } from 'react-native';

import { AppContext } from 'App.context';
import Color from 'src/utils/constants/colors';
import { StatMap } from 'src/utils/constants/defaults';
import { Stat } from 'src/utils/constants/enums';
import useBuildCharacter from 'src/utils/hooks/useBuildCharacter';
import useCreateCharacters from 'src/utils/hooks/useCreateCharacters';
import useGetCharacters from 'src/utils/hooks/useGetCharacters';

export default function HomeScreen() {
  const { data, refetch } = useGetCharacters();
  const { mutate: createCharacters } = useCreateCharacters();
  const buildCharacter = useBuildCharacter();
  const { abilitiesResult, movesResult } = useContext(AppContext);

  if (!data) {
    return null;
  }

  async function ingest() {
    const characters = Array(5).fill(null).map(buildCharacter);
    await createCharacters(characters);
    void refetch();
  }

  return (
    <SafeAreaView>
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.id + index}
        renderItem={RenderedItem}
      />
      <Button
        onPress={ingest}
        disabled={!abilitiesResult.data || !movesResult.data}>
        <Text>Ingest</Text>
      </Button>
    </SafeAreaView>
  );
}

function RenderedItem({
  item: character,
}: ListRenderItemInfo<Character>): React.ReactElement | null {
  const color1 = Color.TYPE[character.type1];
  const color2 = Color.TYPE[character.type2 || character.type1];
  return (
    <Card
      wrapperStyle={{
        borderRadius: 20,
        overflow: 'hidden',
      }}
      containerStyle={{ borderRadius: 20, overflow: 'hidden', padding: 0 }}>
      <LinearGradient
        colors={[color1, color2]}
        locations={[0.85, 0.85]}
        start={[0, 1]}
        end={[1, 0]}>
        <View style={{ padding: 20 }}>
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
          <View style={{ flexDirection: 'row' }}>
            <View>
              {Object.values(Stat).map((stat) => (
                <View key={`${character.id}-${stat}`}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ minWidth: 80 }}>
                      {StatMap[stat as Stat]}:
                    </Text>
                    <Text>{character.stats[stat]}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </LinearGradient>
    </Card>
  );
}
