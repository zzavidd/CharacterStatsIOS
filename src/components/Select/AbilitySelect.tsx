import immutate from 'immutability-helper';
import type { IInputProps } from 'native-base';
import { Button, CloseIcon, Input, Stack } from 'native-base';
import React, { useContext } from 'react';

import { CharacterFormContextDispatch } from 'src/fragments/Form/CharacterForm.context';
import useAbilities from 'src/utils/hooks/useAbilities';

export default function AbilitySelect({
  name,
  value,
  ...props
}: AbilitySelectProps) {
  const setContext = useContext(CharacterFormContextDispatch);
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

interface AbilitySelectProps extends Omit<IInputProps, 'value'> {
  name: AbilityKey;
  value: number | undefined;
}
