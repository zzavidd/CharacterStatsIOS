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
import React, { useContext, useMemo, useState } from 'react';
import { VirtualizedList } from 'react-native';

import CharacterFormContext from 'src/fragments/Form/CharacterForm.context';
import PokeIcon from 'src/utils/constants/icons';
import { containsMatch } from 'src/utils/functions';
import useAbilities from 'src/utils/hooks/useAbilities';

const SORT_GROUPS: Record<number, keyof PokeAbility> = {
  1: 'name',
  2: 'description',
  3: 'commonType',
};

export default function AbilityMenu() {
  const [state, setState] = useState({ searchTerm: '' });
  const [context, setContext] = useContext(CharacterFormContext);
  const filteredAbilities = useFilteredAbilities(state.searchTerm);

  function hideAbilityMenu() {
    setContext((c) =>
      immutate(c, {
        selectedAbility: {
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

  function onAbilityChange(ability: PokeAbility) {
    setContext((c) =>
      immutate(c, {
        character: { [c.selectedAbility.key]: { $set: ability.id } },
      }),
    );
    hideAbilityMenu();
  }

  return (
    <Actionsheet
      isOpen={context.selectedAbility.isMenuOpen}
      onClose={hideAbilityMenu}>
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
              <AbilityEntry
                ability={ability}
                onPress={() => onAbilityChange(ability)}
              />
            )}
          />
        </Box>
      </Actionsheet.Content>
    </Actionsheet>
  );
}

const AbilityEntry = React.memo(
  function AbilityEntry({ ability, onPress }: AbilityEntryProps) {
    return (
      <Actionsheet.Item
        onPress={onPress}
        _pressed={{ bgColor: 'primary.800' }}
        p={3}>
        <HStack alignItems={'flex-start'} space={4}>
          <Image
            source={PokeIcon.Types[ability.commonType]}
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
    );
  },
  (a, b) => a.ability.id === b.ability.id,
);

function useFilteredAbilities(searchTerm: string) {
  const { data: abilityMap = {} } = useAbilities();
  const abilities = Object.values(abilityMap);

  return useMemo(() => {
    const sortedAbilities = abilities.sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    if (!searchTerm) return sortedAbilities;

    return abilities
      .reduce((acc, ability) => {
        for (const [order, prop] of Object.entries(SORT_GROUPS)) {
          if (containsMatch(String(ability[prop]), searchTerm)) {
            return [...acc, { ...ability, order: Number(order) }];
          }
        }
        return acc;
      }, [] as (PokeAbility & { order: number })[])
      .sort((a, b) => a.order - b.order);
  }, [abilities, searchTerm]);
}

interface AbilityEntryProps {
  ability: PokeAbility;
  onPress: () => void;
}
