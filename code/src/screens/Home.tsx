import { Button, Card, Text } from '@rneui/themed';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext } from 'react';
import type { ListRenderItemInfo, ViewProps, ViewStyle } from 'react-native';
import { FlatList, SafeAreaView, View } from 'react-native';

import { AppContext } from 'App.context';
import Color from 'src/utils/constants/colors';
import { StatMap } from 'src/utils/constants/defaults';
import { Stat } from 'src/utils/constants/enums';
import PokeIcon from 'src/utils/constants/icons';
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
        keyExtractor={(item, index) => item.id ?? '' + index}
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
  const {
    id,
    name,
    universe,
    stats,
    ability1,
    ability2,
    abilityX,
    type1,
    type2,
  } = character;
  const color1 = Color.TYPE[type1];
  const color2 = Color.TYPE[type2 || type1];
  return (
    <Card
      wrapperStyle={{ borderRadius: 20, overflow: 'hidden' }}
      containerStyle={{ borderRadius: 20, overflow: 'hidden', padding: 0 }}>
      <LinearGradient
        colors={[color1, color2]}
        locations={[0.85, 0.85]}
        start={[0.2, -0.8]}
        end={[1.2, 0.8]}>
        <View style={{ padding: 24 }}>
          <Row style={{ gap: 4 }}>
            <View style={{ flex: 1 }}>
              <Text
                h4={true}
                style={{ fontFamily: 'Mulish_700Bold', marginBottom: 4 }}>
                {name}
              </Text>
              {universe ? (
                <Text style={{ fontFamily: 'Mulish_300Light_Italic' }}>
                  {universe}
                </Text>
              ) : null}
            </View>
            <View style={{ gap: 4 }}>
              {[type1, type2].map((type, key) => {
                if (!type) return null;
                return (
                  <Row
                    style={{ gap: 4, alignItems: 'center' }}
                    key={`${type}-${key}`}>
                    <Image
                      source={PokeIcon[type]}
                      style={{ width: 20, height: 20 }}
                    />
                    <Text>{type}</Text>
                  </Row>
                );
              })}
            </View>
          </Row>
          <Card.Divider width={2} />
          <Row>
            <View style={{ flex: 1, gap: 12 }}>
              <View>
                <Text style={{ fontFamily: 'Mulish_300Light_Italic' }}>
                  Ability:
                </Text>
                <Row style={{ gap: 6 }}>
                  <Text>{ability1}</Text>
                  {ability2 ? (
                    <React.Fragment>
                      <Text>/</Text>
                      <Text>{ability2}</Text>
                    </React.Fragment>
                  ) : null}
                </Row>
              </View>
              <View>
                <Text style={{ fontFamily: 'Mulish_300Light_Italic' }}>
                  Hidden Ability:
                </Text>
                <Text>{abilityX}</Text>
              </View>
            </View>
            <View style={{ gap: 4 }}>
              {Object.values(Stat).map((stat) => (
                <Row key={`${id}-${stat}`}>
                  <Text
                    style={{
                      fontFamily: 'Mulish_700Bold_Italic',
                      minWidth: 80,
                    }}>
                    {StatMap[stat as Stat]}:
                  </Text>
                  <Text>{stats[stat]}</Text>
                </Row>
              ))}
            </View>
          </Row>
        </View>
      </LinearGradient>
    </Card>
  );
}

function Row({ style, ...props }: RowProps) {
  return <View style={{ flexDirection: 'row', ...style }} {...props} />;
}

interface RowProps extends ViewProps {
  style?: ViewStyle;
}
