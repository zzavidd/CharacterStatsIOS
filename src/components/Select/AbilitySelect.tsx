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

import { AppContext, QueriesContext } from 'App.context';
import PokeIcon from 'src/utils/constants/icons';

export default function AbilitySelect({ name, ...props }: AbilitySelectProps) {
  const { value } = props;
  const [, setContext] = useContext(AppContext);

  function showAbilityMenu() {
    setContext((c) =>
      immutate(c, {
        ability: {
          $set: {
            isMenuOpen: true,
            key: name,
            selectedValue: value,
          },
        },
      }),
    );
  }

  return (
    <Input
      {...props}
      isReadOnly={true}
      InputRightElement={
        <Button onPress={showAbilityMenu}>
          <ChevronDownIcon />
        </Button>
      }
    />
  );
}

export function AbilityMenu({ onChange }: AbilityMenuProps) {
  const [state, setState] = useState({ searchTerm: '' });
  const [context, setContext] = useContext(AppContext);
  const { abilitiesResult } = useContext(QueriesContext);
  const { data: abilities = [] } = abilitiesResult;

  function hideAbilityMenu() {
    setContext((c) =>
      immutate(c, {
        ability: {
          isMenuOpen: { $set: false },
          selectedValue: { $set: undefined },
        },
      }),
    );
    setState((s) => ({ ...s, searchTerm: '' }));
  }

  function clearSearchField() {
    setState((s) => ({ ...s, searchTerm: '' }));
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
    <Actionsheet isOpen={context.ability.isMenuOpen} onClose={hideAbilityMenu}>
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
                onPress={() => {
                  onChange(ability);
                  hideAbilityMenu();
                }}
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
  );
}

interface AbilitySelectProps extends IInputProps {
  name: AbilityKey;
}

interface AbilityMenuProps {
  onChange: (ability: PokeAbility) => void;
}
