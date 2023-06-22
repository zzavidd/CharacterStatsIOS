import type { IInputProps } from 'native-base';
import {
  Actionsheet,
  Box,
  Button,
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  FlatList,
  HStack,
  Image,
  Input,
  Pressable,
  SearchIcon,
  Text,
  VStack,
} from 'native-base';
import React, { useContext, useMemo, useState } from 'react';
import { VirtualizedList } from 'react-native';

import { AppContext } from 'App.context';
import { Type } from 'src/utils/constants/enums';
import PokeIcon from 'src/utils/constants/icons';

export function TypeSelect(props: IInputProps) {
  const { value, onChangeText } = props;
  const [state, setState] = useState({ isTypeListShown: false });

  function toggleTypeList(visible: boolean) {
    setState((s) => ({ ...s, isTypeListShown: visible }));
  }

  function onSelect(type: Type) {
    onChangeText?.(type);
    toggleTypeList(false);
  }

  return (
    <React.Fragment>
      <VStack>
        <Input
          {...props}
          pl={value ? 1 : undefined}
          isReadOnly={true}
          InputLeftElement={
            value ? (
              <Image
                source={PokeIcon[value as Type]}
                alt={value}
                width={6}
                height={6}
                key={value}
                ml={3}
              />
            ) : undefined
          }
          InputRightElement={
            <Button onPress={() => toggleTypeList(true)}>
              <ChevronDownIcon />
            </Button>
          }
        />
      </VStack>
      <Actionsheet
        isOpen={state.isTypeListShown}
        onClose={() => toggleTypeList(false)}>
        <Actionsheet.Content>
          <FlatList
            data={Object.values(Type)}
            keyExtractor={(item) => item}
            maxToRenderPerBatch={20}
            initialNumToRender={20}
            numColumns={2}
            key={'1'}
            w={'full'}
            renderItem={({ item: type }) => {
              const selected = value === type;
              return (
                <Pressable
                  bgColor={selected ? 'primary.900' : undefined}
                  onPress={() => onSelect(type)}
                  _pressed={{ bgColor: 'gray.900' }}
                  flex={1}>
                  <HStack alignItems={'center'} space={4} p={3}>
                    <Image
                      source={PokeIcon[type]}
                      alt={type}
                      width={30}
                      height={30}
                    />
                    <Text fontSize={20}>{type}</Text>
                    {selected ? <CheckIcon size={'5'} /> : null}
                  </HStack>
                </Pressable>
              );
            }}
          />
        </Actionsheet.Content>
      </Actionsheet>
    </React.Fragment>
  );
}

export function AbilitySelect(props: IInputProps) {
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
