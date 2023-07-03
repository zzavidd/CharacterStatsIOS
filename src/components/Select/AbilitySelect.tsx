import immutate from 'immutability-helper';
import type { IInputProps } from 'native-base';
import {
  Actionsheet,
  Box,
  Button,
  CloseIcon,
  HStack,
  Image,
  Input,
  SearchIcon,
  Stack,
  Text,
  VStack,
} from 'native-base';
import React, { useContext, useMemo, useState } from 'react';
import { VirtualizedList } from 'react-native';

import { QueriesContext } from 'App.context';
import CharacterFormContext from 'src/fragments/Form/CharacterForm.context';
import PokeIcon from 'src/utils/constants/icons';
import useAbilities from 'src/utils/hooks/useAbilities';

export default function AbilitySelect({
  name,
  value,
  ...props
}: AbilitySelectProps) {
  const [, setContext] = useContext(CharacterFormContext);
  const { data: abilityMap = {} } = useAbilities();

  function showAbilityMenu() {
    setContext((c) =>
      immutate(c, {
        selectedAbility: {
          $set: {
            isMenuOpen: true,
            key: name,
            selectedValue: value,
          },
        },
      }),
    );
  }

  function onNullifyAbility() {
    setContext((c) => immutate(c, { character: { [name]: { $set: null } } }));
  }

  return (
    <Input
      {...props}
      value={value ? abilityMap[Number(value)].name : undefined}
      onPressOut={showAbilityMenu}
      isReadOnly={true}
      InputRightElement={
        value ? (
          <Stack mx={2}>
            <Button onPress={onNullifyAbility} p={2}>
              <CloseIcon />
            </Button>
          </Stack>
        ) : undefined
      }
    />
  );
}

export function AbilityMenu({ onChange }: AbilityMenuProps) {
  const [state, setState] = useState({ searchTerm: '' });
  const [context, setContext] = useContext(CharacterFormContext);
  const { abilitiesResult } = useContext(QueriesContext);
  const { data: abilityMap = {} } = abilitiesResult;

  const abilities = Object.values(abilityMap);

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

  const filteredAbilities = useMemo(() => {
    const sortedAbilities = abilities.sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    if (!state.searchTerm) return sortedAbilities;
    return abilities.filter(({ name, commonType }) => {
      return [name, commonType].some((value) =>
        value.toLowerCase().includes(state.searchTerm.toLowerCase()),
      );
    });
  }, [abilities, state.searchTerm]);

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
            renderItem={({ item: ability }) => {
              const onPress = () => {
                onChange(ability);
                hideAbilityMenu();
              };
              return <AbilityEntry ability={ability} onPress={onPress} />;
            }}
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

interface AbilitySelectProps extends Omit<IInputProps, 'value'> {
  name: AbilityKey;
  value: number | undefined;
}

interface AbilityMenuProps {
  onChange: (ability: PokeAbility) => void;
}

interface AbilityEntryProps {
  ability: PokeAbility;
  onPress: () => void;
}
