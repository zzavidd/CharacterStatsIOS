import immutate from 'immutability-helper';
import {
  Actionsheet,
  Box,
  Button,
  CloseIcon,
  HStack,
  Image,
  Input,
  SearchIcon,
  Text,
  VStack,
} from 'native-base';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import type { ListRenderItem } from 'react-native';
import { VirtualizedList } from 'react-native';

import CharacterFormContext from 'src/fragments/Form/CharacterForm.context';
import PokeIcon from 'src/utils/constants/icons';
import { containsMatch } from 'src/utils/functions';
import useMoves from 'src/utils/hooks/useMoves';

const ITEM_HEIGHT = 127.3;

const SORT_GROUPS: Record<number, keyof PokeMove> = {
  1: 'name',
  2: 'type',
  3: 'damageClass',
  4: 'description',
};

export default function MoveMenu() {
  const [state, setState] = useState({ searchTerm: '' });
  const [context, setContext] = useContext(CharacterFormContext);
  const filteredMoves = useFilteredMoves(state.searchTerm);

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

  function onMoveChange(moveId: number) {
    setContext((c) => {
      const { level, selectedMoveIndex } = c.selectedMove;
      return immutate(c, {
        character: {
          learnset: { [level]: { [selectedMoveIndex]: { $set: moveId } } },
        },
      });
    });
    hideMoveMenu();
  }

  function clearSearchField() {
    setState((s) => ({ ...s, searchTerm: '' }));
  }

  const renderMove = useCallback<ListRenderItem<PokeMove>>(({ item: move }) => {
    return <MoveEntry move={move} onPress={() => onMoveChange(move.id)} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            getItemLayout={(_, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
            keyExtractor={(item) => String(item.id)}
            maxToRenderPerBatch={20}
            initialNumToRender={20}
            style={{ width: '100%' }}
            renderItem={renderMove}
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

function useFilteredMoves(searchTerm: string) {
  const { data: moveMap = {} } = useMoves();
  const moves = Object.values(moveMap);

  return useMemo(() => {
    const sortedMoves = moves.sort((a, b) => a.name.localeCompare(b.name));
    if (!searchTerm) return sortedMoves;

    return moves
      .reduce((acc, move) => {
        for (const [order, prop] of Object.entries(SORT_GROUPS)) {
          if (containsMatch(String(move[prop]), searchTerm)) {
            return [...acc, { ...move, order: Number(order) }];
          }
        }
        return acc;
      }, [] as (PokeMove & { order: number })[])
      .sort((a, b) => a.order - b.order);
  }, [moves, searchTerm]);
}

interface MoveEntryProps {
  move: PokeMove;
  onPress: () => void;
}
