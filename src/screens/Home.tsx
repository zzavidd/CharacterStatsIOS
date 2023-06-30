import { Image } from 'expo-image';
import {
  Actionsheet,
  AddIcon,
  Box,
  Button,
  DeleteIcon,
  Divider,
  FlatList,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
} from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import invariant from 'tiny-invariant';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { QueriesContext } from 'App.context';
import { ScreenContainer } from 'src/components/Container';
import Color from 'src/utils/constants/colors';
import { StatMap } from 'src/utils/constants/defaults';
import { Stat } from 'src/utils/constants/enums';
import PokeIcon from 'src/utils/constants/icons';
import { Universes } from 'src/utils/constants/options';
import { calculateBST } from 'src/utils/functions';
import useBuildCharacter from 'src/utils/hooks/useBuildCharacter';
import useCreateCharacters from 'src/utils/hooks/useCreateCharacters';
import useDeleteCharacters from 'src/utils/hooks/useDeleteCharacters';
import useGetCharacters from 'src/utils/hooks/useGetCharacters';
import HomeContext, { InitialHomeState } from './Home.context';

export default function HomeScreen({ navigation }: ScreenProps<'Home'>) {
  const [state, setState] = useState(InitialHomeState);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() =>
            navigation.navigate('Form', {
              isEditing: false,
              selectedCharacter: null,
            })
          }
          startIcon={<AddIcon />}>
          Add
        </Button>
      ),
    });
  }, []);

  function onActionSheetClose() {
    setState((s) => ({ ...s, selectedCharacter: null }));
  }

  function onEditPress() {
    navigation.navigate('Form', {
      isEditing: true,
      selectedCharacter: state.selectedCharacter,
    });
    onActionSheetClose();
  }

  return (
    <HomeContext.Provider value={[state, setState]}>
      <CharacterGrid />
      <Actionsheet
        isOpen={!!state.selectedCharacter}
        onClose={onActionSheetClose}>
        <Actionsheet.Content>
          <Actionsheet.Item>
            <Text>Do what with "{state.selectedCharacter?.name}"?</Text>
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={onEditPress}
            startIcon={
              <Icon as={MaterialIcons} name={'edit'} alignSelf={'center'} />
            }>
            Edit
          </Actionsheet.Item>
          <Actionsheet.Item startIcon={<DeleteIcon alignSelf={'center'} />}>
            Delete
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </HomeContext.Provider>
  );
}

function CharacterGrid() {
  const [, setContext] = useContext(HomeContext);
  const { abilitiesResult, movesResult } = useContext(QueriesContext);
  const { mutate: createCharacters } = useCreateCharacters();
  const { mutate: deleteCharacters } = useDeleteCharacters();
  const buildCharacter = useBuildCharacter();
  const { data } = useGetCharacters();
  const { data: abilityMap } = abilitiesResult;

  if (!data || !abilityMap) {
    return null;
  }

  function onLongPress(character: Character) {
    setContext((c) => ({ ...c, selectedCharacter: character }));
  }

  async function ingest() {
    const characters = Array(5).fill(null).map(buildCharacter);
    await createCharacters(characters);
  }

  async function deleteAll() {
    invariant(data, 'No characters to delete.');
    const ids = data.map(({ id }) => id!);
    await deleteCharacters(ids);
  }

  return (
    <ScreenContainer safeAreaBottom={16}>
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
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.id ?? '' + index}
        renderItem={({ item: character }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onLongPress={() => onLongPress(character)}>
            <RenderedItem character={character} abilityMap={abilityMap} />
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

function RenderedItem({ character, abilityMap }: CharacterItemProps) {
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
