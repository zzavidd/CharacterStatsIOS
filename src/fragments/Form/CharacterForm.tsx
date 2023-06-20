import immutate from 'immutability-helper';
import { Input, VStack } from 'native-base';
import React, { useContext } from 'react';

import { ScreenContainer } from 'src/components/Container';
import { AbilitySelect, TypeSelect } from 'src/components/Select';
import type { Type } from 'src/utils/constants/enums';

import CharacterFormContext from './CharacterForm.context';

export default function CharacterForm() {
  const [context, setContext] = useContext(CharacterFormContext);
  const typeFields = useTypeFields();
  const abilityFields = useAbilityFields();

  return (
    <ScreenContainer height={'full'}>
      <VStack space={3}>
        <Input
          value={context.character.name}
          placeholder={'Enter name'}
          onChangeText={(value) =>
            setContext((s) =>
              immutate(s, { character: { name: { $set: value } } }),
            )
          }
        />
        {typeFields.map(({ key, value, placeholder }) => (
          <TypeSelect
            selectedValue={value ?? undefined}
            placeholder={placeholder}
            onValueChange={(value) =>
              setContext((s) =>
                immutate(s, {
                  character: { [key]: { $set: value as Type } },
                }),
              )
            }
            key={key}
          />
        ))}
        {abilityFields.map(({ key, value, placeholder }) => (
          <AbilitySelect
            selectedValue={value ?? undefined}
            placeholder={placeholder}
            onValueChange={(value) =>
              setContext((s) =>
                immutate(s, {
                  character: { [key]: { $set: value } },
                }),
              )
            }
            key={key}
          />
        ))}
      </VStack>
    </ScreenContainer>
  );
}

function useTypeFields(): TypeField[] {
  const [context] = useContext(CharacterFormContext);
  return [
    {
      key: 'type1',
      value: context.character.type1,
      placeholder: 'Select first type...',
    },
    {
      key: 'type2',
      value: context.character.type2,
      placeholder: 'Select second type...',
    },
  ];
}

function useAbilityFields(): AbilityField[] {
  const [context] = useContext(CharacterFormContext);
  return [
    {
      key: 'ability1',
      value: context.character.ability1,
      placeholder: 'Select first ability...',
    },
    {
      key: 'ability2',
      value: context.character.ability2,
      placeholder: 'Select second ability...',
    },
    {
      key: 'abilityX',
      value: context.character.abilityX,
      placeholder: 'Select hidden ability...',
    },
  ];
}

interface TypeField {
  key: keyof Character;
  value: Type | null;
  placeholder: string;
}

interface AbilityField {
  key: keyof Character;
  value: string | null;
  placeholder: string;
}
