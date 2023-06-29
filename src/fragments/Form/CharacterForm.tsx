import type { Spec } from 'immutability-helper';
import immutate from 'immutability-helper';
import {
  AddIcon,
  Button,
  FormControl,
  HStack,
  Input,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import React, { useContext } from 'react';

import { ScreenContainer } from 'src/components/Container';
import AbilitySelect from 'src/components/Select/AbilitySelect';
import MoveSelect, { LevelSelect } from 'src/components/Select/MoveSelect';
import TypeSelect from 'src/components/Select/TypeSelect';
import type { Type } from 'src/utils/constants/enums';

import CharacterFormContext from './CharacterForm.context';

export default function CharacterForm() {
  const [context, setContext] = useContext(CharacterFormContext);
  const typeFields = useTypeFields();
  const abilityFields = useAbilityFields();

  function onChange(spec: Spec<Omit<Character, 'createTime'>>) {
    setContext((s) => immutate(s, { character: spec }));
  }

  function onAddMovePress() {
    setContext((s) =>
      immutate(s, {
        character: {
          learnset: {
            '0': (levelMoveIds = []) => [...levelMoveIds, 1],
          },
        },
      }),
    );
  }

  return (
    <ScreenContainer p={4} flex={1}>
      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        contentInset={{ bottom: 50 }}>
        <VStack space={3} flex={1}>
          <FormControl>
            <FormControl.Label>
              <Text>Name:</Text>
            </FormControl.Label>
            <Input
              value={context.character.name}
              placeholder={'Enter name...'}
              onChangeText={(value) => onChange({ name: { $set: value } })}
              returnKeyType={'done'}
            />
          </FormControl>
          <HStack space={5}>
            {typeFields.map(({ key, label, value }) => (
              <FormControl flex={1} key={key}>
                <FormControl.Label>
                  <Text>{label}:</Text>
                </FormControl.Label>
                <TypeSelect
                  name={key}
                  value={value ?? undefined}
                  placeholder={'Select type...'}
                  onChangeText={(value) =>
                    onChange({ [key]: { $set: value as Type } })
                  }
                />
              </FormControl>
            ))}
          </HStack>
          {abilityFields.map(({ key, label, value }) => (
            <FormControl key={key}>
              <FormControl.Label>
                <Text>{label}:</Text>
              </FormControl.Label>
              <AbilitySelect
                name={key}
                value={value ?? undefined}
                placeholder={'Select ability...'}
                onChangeText={(value) => onChange({ [key]: { $set: value } })}
                key={key}
              />
            </FormControl>
          ))}
          <FormControl>
            <FormControl.Label>
              <Text>Learnset:</Text>
            </FormControl.Label>
            <Button
              onPress={onAddMovePress}
              variant={'outline'}
              startIcon={<AddIcon />}
              mb={5}>
              <Text>Add Move</Text>
            </Button>
            <VStack space={2}>
              {Object.entries(context.character.learnset).map(
                ([level, moveIds]) => {
                  return (
                    <React.Fragment key={level}>
                      {moveIds.map((moveId, index) => (
                        <HStack key={`${level}-${moveId}-${index}`} space={3}>
                          <LevelSelect
                            level={level}
                            currentMoveId={moveId}
                            moveIndex={index}
                          />
                          <MoveSelect
                            name={level}
                            index={index}
                            value={String(moveId)}
                            placeholder={'Select move...'}
                            flex={1}
                          />
                        </HStack>
                      ))}
                    </React.Fragment>
                  );
                },
              )}
            </VStack>
          </FormControl>
        </VStack>
      </ScrollView>
    </ScreenContainer>
  );
}

function useTypeFields(): TypeField[] {
  const [context] = useContext(CharacterFormContext);
  return [
    {
      key: 'type1',
      label: 'Type 1',
      value: context.character.type1,
    },
    {
      key: 'type2',
      label: 'Type 2',
      value: context.character.type2,
    },
  ];
}

function useAbilityFields(): AbilityField[] {
  const [context] = useContext(CharacterFormContext);
  return [
    {
      key: 'ability1',
      label: 'First Ability',
      value: context.character.ability1,
    },
    {
      key: 'ability2',
      label: 'Second Ability',
      value: context.character.ability2,
    },
    {
      key: 'abilityX',
      label: 'Hidden Ability',
      value: context.character.abilityX,
    },
  ];
}

interface Field {
  label: string;
}

interface AbilityField extends Field {
  key: AbilityKey;
  value: string | null;
}

interface TypeField extends Field {
  key: TypeKey;
  value: Type | null;
}
