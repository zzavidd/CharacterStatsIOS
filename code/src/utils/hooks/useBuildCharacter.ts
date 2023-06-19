import { faker } from '@faker-js/faker/locale/en_GB';
import { useCallback, useContext } from 'react';
import invariant from 'tiny-invariant';

import { AppContext } from 'App.context';

import { Stat, Type } from '../constants/enums';
import { Universes } from '../constants/options';
import { zCharacter } from '../validators';

export default function useBuildCharacter(): () => Character {
  const { abilitiesResult, movesResult } = useContext(AppContext);
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

function useBuildLearnset(): () => number[] {
  const { movesResult } = useContext(AppContext);
  const { data: moves } = movesResult;

  return useCallback(() => {
    invariant(moves, 'Could not retrieve moves.');
    const quantity = faker.number.int({ min: 8, max: 18 });
    return Array(quantity)
      .fill(null)
      .map(() => {
        const index = faker.number.int({ max: 0 });
        return moves[index].id;
      });
  }, [moves]);
}
