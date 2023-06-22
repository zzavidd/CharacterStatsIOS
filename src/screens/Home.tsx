import { Image } from 'expo-image';
import {
  AddIcon,
  Box,
  Button,
  Divider,
  FlatList,
  Flex,
  HStack,
  Text,
  VStack,
} from 'native-base';
import React, { useContext, useEffect } from 'react';
import type { ListRenderItemInfo } from 'react-native';
import invariant from 'tiny-invariant';

import { AppContext } from 'App.context';
import { ScreenContainer } from 'src/components/Container';
import Color from 'src/utils/constants/colors';
import { StatMap } from 'src/utils/constants/defaults';
import { Stat } from 'src/utils/constants/enums';
import PokeIcon from 'src/utils/constants/icons';
import { calculateBST } from 'src/utils/functions';
import useBuildCharacter from 'src/utils/hooks/useBuildCharacter';
import useCreateCharacters from 'src/utils/hooks/useCreateCharacters';
import useDeleteCharacters from 'src/utils/hooks/useDeleteCharacters';
import useGetCharacters from 'src/utils/hooks/useGetCharacters';

export default function HomeScreen({ navigation }: ScreenProps<'Home'>) {
  const { data, refetch } = useGetCharacters();
  const { mutate: createCharacters } = useCreateCharacters();
  const { mutate: deleteCharacters } = useDeleteCharacters();
  const buildCharacter = useBuildCharacter();
  const { abilitiesResult, movesResult } = useContext(AppContext);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          variant={'ghost'}
          onPress={() => navigation.navigate('Form')}
          startIcon={<AddIcon />}>
          Add
        </Button>
      ),
    });
  }, []);

  if (!data) {
    return null;
  }

  async function ingest() {
    const characters = Array(5).fill(null).map(buildCharacter);
    await createCharacters(characters);
    void refetch();
  }

  async function deleteAll() {
    invariant(data, 'No characters to delete.');
    const ids = data.map(({ id }) => id!);
    await deleteCharacters(ids);
    void refetch();
  }

  return (
    <ScreenContainer safeAreaBottom={16}>
      <HStack>
        <Button
          variant={'ghost'}
          onPress={ingest}
          disabled={!abilitiesResult.data || !movesResult.data}>
          <Text>Ingest</Text>
        </Button>
        <Button variant={'ghost'} onPress={deleteAll}>
          <Text>Delete All</Text>
        </Button>
      </HStack>
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.id ?? '' + index}
        renderItem={RenderedItem}
        ListEmptyComponent={
          <Flex justifyContent={'center'} alignItems={'center'}>
            <Text>No characters.</Text>
          </Flex>
        }
      />
    </ScreenContainer>
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
          {universe ? <Text fontWeight={'light'}>{universe}</Text> : null}
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
              <Text>{ability1}</Text>
              {ability2 ? (
                <React.Fragment>
                  <Text>/</Text>
                  <Text>{ability2}</Text>
                </React.Fragment>
              ) : null}
            </HStack>
          </VStack>
          <VStack>
            <Text italic={true} fontWeight={'light'}>
              Hidden Ability:
            </Text>
            <Text>{abilityX}</Text>
          </VStack>
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
