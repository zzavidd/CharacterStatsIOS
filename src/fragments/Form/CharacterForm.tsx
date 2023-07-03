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
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { ScreenContainer } from 'src/components/Container';
import AbilitySelect from 'src/components/Select/AbilitySelect';
import MoveSelect, { LevelSelect } from 'src/components/Select/MoveSelect';
import StatInput from 'src/components/Select/StatInput';
import TypeSelect from 'src/components/Select/TypeSelect';
import UniverseSelect from 'src/components/Select/UniverseSelect';
import CSColor from 'src/utils/constants/colors';
import { StatMap } from 'src/utils/constants/defaults';
import type { Stat, Type } from 'src/utils/constants/enums';
import { Universes } from 'src/utils/constants/options';

import CharacterFormContext from './CharacterForm.context';

export default function CharacterForm() {
  const [context, setContext] = useContext(CharacterFormContext);
  const abilityFields = useAbilityFields();
  const typeFields = useTypeFields();

  function onChange(spec: Spec<Omit<Character, 'createTime'>>) {
    setContext((s) => immutate(s, { character: spec }));
  }

  function onAddMovePress() {
    setContext((s) =>
      immutate(s, {
        character: {
          learnset: {
            '0': (levelMoveIds = []) => [1, ...levelMoveIds],
          },
        },
        selectedMove: {
          $set: {
            isMenuOpen: true,
            level: '0',
            selectedMoveIndex: 0,
            selectedValue: undefined,
          },
        },
      }),
    );
  }

  function onDeleteMovePress(level: string, moveIndex: number) {
    setContext((s) => {
      let spec: Spec<Character['learnset']> = {};
      if (s.character.learnset[level].length > 1) {
        spec = {
          [level]: { $splice: [[moveIndex, 1]] },
        };
      } else {
        spec = { $unset: [level] };
      }

      return immutate(s, {
        character: {
          learnset: spec,
        },
      });
    });
  }

  const firstHalfStats = Object.entries(StatMap).slice(0, 3);
  const secondHalfStats = Object.entries(StatMap).slice(3);
  const stats = [firstHalfStats, secondHalfStats];

  const { type1, type2 } = context.character;
  const color1 = type1 ? CSColor.TYPE[type1] : 'transparent';
  const color2 = type2 ? CSColor.TYPE[type2] : color1;
  const linearGradient = {
    colors: [CSColor.darken(color1), CSColor.darken(color2)],
    locations: [0.5, 1],
    start: [0.2, -0.8],
    end: [1.2, 0.8],
  };

  return (
    <ScreenContainer bg={{ linearGradient }} p={4} flex={1}>
      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        contentInset={{ bottom: 50 }}
        showsVerticalScrollIndicator={false}>
        <VStack space={3} flex={1}>
          <HStack space={5}>
            <FormControl flex={1}>
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
            <FormControl flex={1}>
              <FormControl.Label>
                <Text>Universe:</Text>
              </FormControl.Label>
              <UniverseSelect
                value={Universes[context.character.universe!]}
                placeholder={'Select universe...'}
                onChangeText={(value) =>
                  onChange({ universe: { $set: Number(value) } })
                }
              />
            </FormControl>
          </HStack>
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
          <HStack space={5}>
            <VStack space={3} flex={5}>
              {abilityFields.map(({ key, label, value }) => (
                <FormControl key={key}>
                  <FormControl.Label>
                    <Text>{label}:</Text>
                  </FormControl.Label>
                  <AbilitySelect
                    name={key}
                    value={value ?? undefined}
                    placeholder={'Select ability...'}
                    onChangeText={(value) =>
                      onChange({ [key]: { $set: value } })
                    }
                    key={key}
                  />
                </FormControl>
              ))}
            </VStack>
            <HStack space={4} flex={4}>
              {stats.map((halfStats, i) => (
                <VStack space={3} key={i}>
                  {halfStats.map(([stat, alias]) => {
                    return (
                      <FormControl key={stat}>
                        <FormControl.Label>
                          <Text>{alias}:</Text>
                        </FormControl.Label>
                        <StatInput
                          stat={stat as Stat}
                          value={context.character.stats[stat as Stat]}
                        />
                      </FormControl>
                    );
                  })}
                </VStack>
              ))}
            </HStack>
          </HStack>
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
                ([level, moveIds]) => (
                  <React.Fragment key={level}>
                    {moveIds.map((moveId, index) => (
                      <Swipeable
                        renderRightActions={() => (
                          <Button
                            onPress={() => onDeleteMovePress(level, index)}>
                            <Text>Remove</Text>
                          </Button>
                        )}
                        key={`${level}-${moveId}-${index}`}>
                        <HStack space={3}>
                          <LevelSelect
                            level={Number(level)}
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
                      </Swipeable>
                    ))}
                  </React.Fragment>
                ),
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
  value: number | null;
}

interface TypeField extends Field {
  key: TypeKey;
  value: Type | null;
}
