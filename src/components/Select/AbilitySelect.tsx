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

export default function AbilitySelect(props: IInputProps) {
  const [state, setState] = useState({
    isAbilityListShown: false,
    searchTerm: '',
  });
  const { abilitiesResult } = useContext(AppContext);
  const { data: abilities = [] } = abilitiesResult;

  function showAbilityList() {
    setState((s) => ({ ...s, isAbilityListShown: true }));
  }

  function hideAbilityList() {
    setState((s) => ({ ...s, isAbilityListShown: false, searchTerm: '' }));
  }

  function clearSearchField() {
    setState((s) => ({ ...s, searchTerm: '' }));
  }

  function onSelect(ability: PokeAbility) {
    props.onChangeText?.(ability.name);
    hideAbilityList();
  }

  const filteredAbilities = useMemo(() => {
    if (!state.searchTerm) return abilities;
    return abilities.filter(({ name, commonType }) => {
      return [name, commonType].some((value) =>
        value.toLowerCase().includes(state.searchTerm.toLowerCase()),
      );
    });
  }, [abilities, state.searchTerm]);

  return (
    <React.Fragment>
      <VStack>
        <Input
          {...props}
          isReadOnly={true}
          InputRightElement={
            <Button onPress={showAbilityList}>
              <ChevronDownIcon />
            </Button>
          }
        />
      </VStack>
      <Actionsheet isOpen={state.isAbilityListShown} onClose={hideAbilityList}>
        <Actionsheet.Content>
          <Box h={'full'} w={'full'}>
            <Input
              value={state.searchTerm}
              onChangeText={(value) =>
                setState((s) => ({ ...s, searchTerm: value }))
              }
              px={3}
              placeholder={'Filter abilities...'}
              InputLeftElement={<SearchIcon ml={3} size={5} />}
              InputRightElement={
                state.searchTerm ? (
                  <Button onPress={clearSearchField}>
                    <CloseIcon />
                  </Button>
                ) : undefined
              }
            />
            <VirtualizedList<PokeAbility>
              data={filteredAbilities}
              getItem={(data, index) => data[index]}
              getItemCount={() => filteredAbilities.length}
              keyExtractor={(item) => String(item.id)}
              maxToRenderPerBatch={20}
              initialNumToRender={20}
              style={{ width: '100%' }}
              renderItem={({ item: ability }) => (
                <Actionsheet.Item
                  onPress={() => onSelect(ability)}
                  _pressed={{ bgColor: 'primary.800' }}
                  p={3}>
                  <HStack alignItems={'flex-start'} space={4}>
                    <Image
                      source={PokeIcon[ability.commonType]}
                      alt={ability.commonType}
                      width={8}
                      height={8}
                    />
                    <VStack>
                      <Text fontSize={20}>{ability.name}</Text>
                      {ability.description ? (
                        <Text fontSize={12} fontWeight={'light'}>
                          {ability.description}
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
