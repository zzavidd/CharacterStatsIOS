import type { Spec } from 'immutability-helper';
import immutate from 'immutability-helper';
import type { IInputProps } from 'native-base';
import {
  Actionsheet,
  Box,
  Button,
  ChevronDownIcon,
  CloseIcon,
  HStack,
  Image,
  Input,
  SearchIcon,
  Text,
  VStack,
} from 'native-base';
import React, { useContext, useMemo, useState } from 'react';
import { VirtualizedList } from 'react-native';

import { QueriesContext } from 'App.context';
import CharacterFormContext from 'src/fragments/Form/CharacterForm.context';
import PokeIcon from 'src/utils/constants/icons';

export default function MoveSelect({
  name,
  value,
  index,
  ...props
}: MoveSelectProps) {
  const { movesResult } = useContext(QueriesContext);
  const { data: moveMap = {} } = movesResult;
  const [, setContext] = useContext(CharacterFormContext);

  function showAbilityMenu() {
    setContext((c) =>
      immutate(c, {
        selectedMove: {
          $set: {
            isMenuOpen: true,
            level: name,
            selectedMoveIndex: index,
            selectedValue: Number(value),
          },
        },
      }),
    );
  }

  return (
    <Input
      {...props}
      value={value ? moveMap[value]?.name : undefined}
      pl={value ? 2 : undefined}
      bgColor={value ? moveMap[value]?.color : 'transparent'}
      isReadOnly={true}
      InputLeftElement={
        value ? (
          <Image
            source={PokeIcon.Types[moveMap[value].type]}
            alt={value}
            width={6}
            height={6}
            key={value}
            ml={3}
          />
        ) : undefined
      }
      InputRightElement={
        <HStack mx={2} alignItems={'center'} space={2}>
          {value ? (
            <Image
              source={PokeIcon.Classes[moveMap[value].damageClass]}
              resizeMode={'stretch'}
              alt={value}
              width={7}
              height={5}
              key={value}
              ml={3}
            />
          ) : null}
          <Button onPress={showAbilityMenu} p={2}>
            <ChevronDownIcon />
          </Button>
        </HStack>
      }
    />
  );
}

export function LevelSelect({
  level,
  currentMoveId,
  moveIndex,
}: LevelSelectProps) {
  const [state, setState] = useState({ value: level });
  const [, setContext] = useContext(CharacterFormContext);

  function onChangeText(value: string) {
    setState({ value: Number(value) });
  }

  function onEndEditing() {
    if (state.value === level) return;

    const newLevel = Math.min(100, Number(state.value));

    setContext((s) => {
      let deleteSpec: Spec<Character['learnset']> = {};
      if (s.character.learnset[level].length > 1) {
        deleteSpec = {
          [level]: { $splice: [[moveIndex, 1]] },
        };
      } else {
        deleteSpec = { $unset: [String(level)] };
      }
      return immutate(s, {
        character: {
          learnset: {
            [newLevel]: (levelMoveIds = []) => [...levelMoveIds, currentMoveId],
            ...deleteSpec,
          },
        },
      });
    });
  }

  return (
    <Input
      value={String(state.value)}
      onChangeText={onChangeText}
      onEndEditing={onEndEditing}
      selectTextOnFocus={true}
      variant={'filled'}
      textAlign={'right'}
      inputMode={'numeric'}
      returnKeyLabel={'Done'}
      returnKeyType={'done'}
      w={'16'}
    />
  );
}

export function MoveMenu({ onChange }: MoveMenuProps) {
  const [state, setState] = useState({ searchTerm: '' });
  const [context, setContext] = useContext(CharacterFormContext);
  const { movesResult } = useContext(QueriesContext);
  const { data: moveMap = {} } = movesResult;

  const moves = Object.values(moveMap);

  function hideMoveMenu() {
    setContext((c) =>
      immutate(c, {
        selectedMove: {
          isMenuOpen: { $set: false },
          selectedValue: { $set: undefined },
        },
      }),
    );
    clearSearchField();
  }

  function clearSearchField() {
    setState((s) => ({ ...s, searchTerm: '' }));
  }

  const filteredMoves = useMemo(() => {
    const sortedMoves = moves.sort((a, b) => a.name.localeCompare(b.name));
    if (!state.searchTerm) return sortedMoves;
    return sortedMoves.filter(({ name, type }) => {
      return [name, type].some((value) =>
        value.toLowerCase().includes(state.searchTerm.toLowerCase()),
      );
    });
  }, [moves, state.searchTerm]);

  return (
    <Actionsheet
      isOpen={context.selectedMove.isMenuOpen}
      onClose={hideMoveMenu}>
      <Actionsheet.Content>
        <Box h={'full'} w={'full'}>
          <Input
            value={state.searchTerm}
            onChangeText={(value) =>
              setState((s) => ({ ...s, searchTerm: value }))
            }
            px={3}
            placeholder={'Filter moves...'}
            InputLeftElement={<SearchIcon ml={3} size={5} />}
            InputRightElement={
              state.searchTerm ? (
                <Button onPress={clearSearchField}>
                  <CloseIcon />
                </Button>
              ) : undefined
            }
          />
          <VirtualizedList<PokeMove>
            data={filteredMoves}
            getItem={(data, index) => data[index]}
            getItemCount={() => filteredMoves.length}
            keyExtractor={(item) => String(item.id)}
            maxToRenderPerBatch={20}
            initialNumToRender={20}
            style={{ width: '100%' }}
            renderItem={({ item: move }) => {
              const onPress = () => {
                onChange(move.id);
                hideMoveMenu();
              };
              return <MoveEntry move={move} onPress={onPress} />;
            }}
          />
        </Box>
      </Actionsheet.Content>
    </Actionsheet>
  );
}

const MoveEntry = React.memo(
  function MoveEntry({ move, onPress }: MoveEntryProps) {
    return (
      <Actionsheet.Item
        onPress={onPress}
        _pressed={{ bgColor: 'primary.800' }}
        p={3}>
        <HStack alignItems={'flex-start'} space={4}>
          <Image
            source={PokeIcon.Types[move.type]}
            alt={move.type}
            width={8}
            height={8}
          />
          <VStack space={1}>
            <Box>
              <Text fontSize={20}>{move.name}</Text>
              {move.description ? (
                <Text fontSize={12} fontWeight={'light'}>
                  {move.description}
                </Text>
              ) : null}
            </Box>
            <HStack space={4}>
              <Image
                source={PokeIcon.Classes[move.damageClass]}
                resizeMode={'stretch'}
                alt={move.damageClass}
                width={7}
                height={5}
              />
              <Text color={'gray.200'} fontSize={12}>
                Power: {move.power || '-'}
              </Text>
              <Text color={'gray.200'} fontSize={12}>
                PP: {move.pp || '-'}
              </Text>
              <Text color={'gray.200'} fontSize={12}>
                Acc: {move.accuracy || '-'}
              </Text>
            </HStack>
          </VStack>
        </HStack>
      </Actionsheet.Item>
    );
  },
  (a, b) => a.move.id === b.move.id,
);

interface MoveSelectProps extends IInputProps {
  name: string;
  index: number;
}

interface LevelSelectProps {
  currentMoveId: number;
  level: number;
  moveIndex: number;
}

interface MoveMenuProps {
  onChange: (moveId: number) => void;
}

interface MoveEntryProps {
  move: PokeMove;
  onPress: () => void;
}
