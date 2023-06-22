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

import { AppContext } from 'App.context';
import PokeIcon from 'src/utils/constants/icons';

export default function MoveSelect(props: IInputProps) {
  const [state, setState] = useState({
    isMoveListShown: false,
    searchTerm: '',
  });
  const { movesResult } = useContext(AppContext);
  const { data: moves = [] } = movesResult;

  function showMoveList() {
    setState((s) => ({ ...s, isMoveListShown: true }));
  }

  function hideMoveList() {
    setState((s) => ({ ...s, isMoveListShown: false, searchTerm: '' }));
  }

  function clearSearchField() {
    setState((s) => ({ ...s, searchTerm: '' }));
  }

  function onSelect(move: PokeMove) {
    props.onChangeText?.(move.name);
    hideMoveList();
  }

  const filteredMoves = useMemo(() => {
    if (!state.searchTerm) return moves;
    return moves.filter(({ name, type }) => {
      return [name, type].some((value) =>
        value.toLowerCase().includes(state.searchTerm.toLowerCase()),
      );
    });
  }, [moves, state.searchTerm]);

  return (
    <React.Fragment>
      <VStack>
        <Input
          {...props}
          isReadOnly={true}
          InputRightElement={
            <Button onPress={showMoveList}>
              <ChevronDownIcon />
            </Button>
          }
        />
      </VStack>
      <Actionsheet isOpen={state.isMoveListShown} onClose={hideMoveList}>
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
              renderItem={({ item: move }) => (
                <Actionsheet.Item
                  onPress={() => onSelect(move)}
                  _pressed={{ bgColor: 'primary.800' }}
                  p={3}>
                  <HStack alignItems={'flex-start'} space={4}>
                    <Image
                      source={PokeIcon[move.type]}
                      alt={move.type}
                      width={8}
                      height={8}
                    />
                    <VStack>
                      <Text fontSize={20}>{move.name}</Text>
                      {move.description ? (
                        <Text fontSize={12} fontWeight={'light'}>
                          {move.description}
                        </Text>
                      ) : null}
                    </VStack>
                  </HStack>
                </Actionsheet.Item>
              )}
            />
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
    </React.Fragment>
  );
}
