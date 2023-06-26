import { faker } from '@faker-js/faker/locale/en_GB';
import { useCallback, useContext } from 'react';
import invariant from 'tiny-invariant';

import { QueriesContext } from 'App.context';

import { Stat, Type } from '../constants/enums';
import { Universes } from '../constants/options';
import { zCharacter } from '../validators';

export default function useBuildCharacter(): () => Character {
  const { abilitiesResult, movesResult } = useContext(QueriesContext);
  const { data: abilities } = abilitiesResult;
  const { data: moves } = movesResult;
  const buildLearnset = useBuildLearnset();

  return useCallback(() => {
    invariant(abilities, 'Could not retrieve abilities.');
    invariant(moves, 'Could not retrieve moves.');

    const types = Object.values(Type);
    const hasSecondType = faker.datatype.boolean();
    const hasSecondAbility = faker.datatype.boolean();

    const getRandomType = (): Type =>
      types[faker.number.int({ max: types.length - 1 })];
    const getRandomAbility = (): string =>
      abilities[faker.number.int({ max: abilities.length - 1 })].name;

    return zCharacter.parse({
      name: faker.person.firstName(),
      universe: Universes[faker.number.int({ min: 0, max: 2 })].name,
      type1: getRandomType(),
      type2: hasSecondType ? getRandomType() : null,
      ability1: getRandomAbility(),
      ability2: hasSecondAbility ? getRandomAbility() : null,
      abilityX: getRandomAbility(),
      stats: generateStats(),
      learnset: buildLearnset(),
      createTime: Date.now(),
      lastModified: Date.now(),
    });
  }, [abilities, moves, buildLearnset]);
}

function generateStats(): Stats {
  const stats = {} as Stats;
  Object.values(Stat).forEach((stat) => {
    stats[stat] = faker.number.int({
      min: 5,
      max: 140,
    });
  });
  return stats;
}

function useBuildLearnset(): () => Record<string, number[]> {
  const { movesResult } = useContext(QueriesContext);
  const { data: moves = {} } = movesResult;

  return useCallback(() => {
    invariant(moves, 'Could not retrieve moves.');
    const startQuantity = faker.number.int({ min: 1, max: 4 });
    const moveQuantity = faker.number.int({ min: 8, max: 18 });

    const learnset: Record<string, number[]> = {};
    const addRandomMove = (level: number): void => {
      const index = faker.number.int({
        min: 0,
        max: Object.keys(moves).length,
      });
      const moveId = moves[index].id;
      learnset[level] = learnset[level]?.length
        ? [...learnset[level], moveId]
        : [moveId];
    };

    for (let i = 0; i < startQuantity; i++) {
      addRandomMove(1);
    }

    for (let i = 0; i < moveQuantity; i++) {
      const level = faker.number.int({ min: 1, max: 100 });
      addRandomMove(level);
    }
    return learnset;
  }, [moves]);
}
