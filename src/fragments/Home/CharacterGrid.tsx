import {
  Box,
  Button,
  Divider,
  FlatList,
  Flex,
  HStack,
  ScrollView,
  Skeleton,
  Text,
  VStack,
} from 'native-base';
import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import invariant from 'tiny-invariant';

import { QueriesContext } from 'App.context';
import { ScreenContainer } from 'src/components/Container';
import HomeContext from 'src/screens/Home.context';
import useBuildCharacter from 'src/utils/hooks/useBuildCharacter';
import useCreateCharacters from 'src/utils/hooks/useCreateCharacters';
import useDeleteCharacters from 'src/utils/hooks/useDeleteCharacters';
import useGetCharacters from 'src/utils/hooks/useGetCharacters';

import CharacterItem from './CharacterItem';

export default function CharacterGrid() {
  const [, setContext] = useContext(HomeContext);
  const { abilitiesResult } = useContext(QueriesContext);
  const { data } = useGetCharacters();
  const { data: abilityMap } = abilitiesResult;

  if (!data || !abilityMap) {
    return <Placeholders />;
  }

  function onLongPress(character: Character) {
    setContext((c) => ({ ...c, selectedCharacter: character }));
  }

  return (
    <ScreenContainer safeAreaBottom={16}>
      <DevTools />
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.id ?? '' + index}
        renderItem={({ item: character }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onLongPress={() => onLongPress(character)}>
            <CharacterItem character={character} abilityMap={abilityMap} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Flex justifyContent={'center'} alignItems={'center'}>
            <Text>No characters.</Text>
          </Flex>
        }
      />
    </ScreenContainer>
  );
}

function Placeholders() {
  return (
    <ScrollView>
      {Array(4)
        .fill(null)
        .map((_, i) => (
          <Box bgColor={'gray.800'} rounded={'2xl'} mx={4} my={2} p={6} key={i}>
            <VStack space={2}>
              <Skeleton h={8} w={'4/6'} />
              <Skeleton h={3} w={20} rounded={'sm'} />
            </VStack>
            <Divider thickness={2} my={4} />
            <HStack space={4}>
              <Skeleton.Text lines={5} flex={1} />
              <VStack space={2}>
                {Array(6)
                  .fill(null)
                  .map((_, i) => (
                    <Skeleton h={4} w={'150px'} rounded={'sm'} key={i} />
                  ))}
              </VStack>
            </HStack>
          </Box>
        ))}
    </ScrollView>
  );
}

function DevTools() {
  const { abilitiesResult, movesResult } = useContext(QueriesContext);
  const { mutate: createCharacters } = useCreateCharacters();
  const { mutate: deleteCharacters } = useDeleteCharacters();
  const buildCharacter = useBuildCharacter();
  const { data } = useGetCharacters();

  async function ingest() {
    const characters = Array(5).fill(null).map(buildCharacter);
    await createCharacters(characters);
  }

  async function deleteAll() {
    invariant(data, 'No characters to delete.');
    const ids = data.map(({ id }) => id!);
    await deleteCharacters(ids);
  }

  if (!__DEV__) {
    return null;
  }

  return (
    <HStack>
      <Button
        onPress={ingest}
        disabled={!abilitiesResult.data || !movesResult.data}>
        <Text>Ingest</Text>
      </Button>
      <Button variant={'ghost'} onPress={deleteAll}>
        <Text>Delete All</Text>
      </Button>
    </HStack>
  );
}
