import { Image } from 'expo-image';
import { Box, Divider, HStack, Text, VStack } from 'native-base';
import React from 'react';

import Color from 'src/utils/constants/colors';
import { StatMap } from 'src/utils/constants/defaults';
import { Stat } from 'src/utils/constants/enums';
import PokeIcon from 'src/utils/constants/icons';
import { Universes } from 'src/utils/constants/options';
import { calculateBST } from 'src/utils/functions';

export default function CharacterItem({
  character,
  abilityMap,
}: CharacterItemProps) {
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
  const color1 = Color.TYPE[type1!] ?? 'transparent';
  const color2 = Color.TYPE[type2 || type1!] ?? 'transparent';
  const linearGradient = {
    colors: [color1, color2],
    locations: [0.85, 0.85],
    start: [0.2, -0.8],
    end: [1.2, 0.8],
  };

  return (
    <Box rounded={'2xl'} mx={4} my={2} p={6} bg={{ linearGradient }}>
      <HStack>
        <VStack flex={1}>
          <Text bold={true} fontSize={24}>
            {name}
          </Text>
          {universe ? (
            <Text fontWeight={'light'}>{Universes[universe]}</Text>
          ) : null}
        </VStack>
        <VStack space={1}>
          {[type1, type2].map((type, key) => {
            if (!type) return null;
            return (
              <HStack space={2} alignItems={'center'} key={`${type}-${key}`}>
                <Image
                  source={PokeIcon[type]}
                  style={{ width: 20, height: 20 }}
                />
                <Text>{type}</Text>
              </HStack>
            );
          })}
        </VStack>
      </HStack>
      <Divider thickness={2} my={4} />
      <HStack>
        <VStack flex={1} space={3}>
          <VStack>
            <Text italic={true} fontWeight={'light'}>
              Ability:
            </Text>
            <HStack space={1}>
              {ability1 ? <Text>{abilityMap[ability1].name}</Text> : null}
              {ability2 ? (
                <React.Fragment>
                  <Text>/</Text>
                  <Text>{abilityMap[ability2].name}</Text>
                </React.Fragment>
              ) : null}
            </HStack>
          </VStack>
          {abilityX ? (
            <VStack>
              <Text italic={true} fontWeight={'light'}>
                Hidden Ability:
              </Text>
              <Text>{abilityMap[abilityX].name}</Text>
            </VStack>
          ) : null}
          <HStack flex={1} alignItems={'flex-end'} space={1}>
            <Text fontWeight={'light'}>BST:</Text>
            <Text>{calculateBST(stats)}</Text>
          </HStack>
        </VStack>
        <VStack space={1}>
          {Object.values(Stat).map((stat) => (
            <HStack key={`${id}-${stat}`}>
              <Text bold={true} italic={true} minW={20}>
                {StatMap[stat as Stat]}:
              </Text>
              <Text>{stats[stat]}</Text>
            </HStack>
          ))}
        </VStack>
      </HStack>
    </Box>
  );
}

interface CharacterItemProps {
  character: Character;
  abilityMap: PokeAbilityMap;
}
