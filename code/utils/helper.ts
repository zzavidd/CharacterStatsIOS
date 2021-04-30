import { capitalCase } from 'capital-case';
import * as faker from 'faker';

import { PokeMove, ResponseAbility } from '../types';
import { Character } from '../types/classes';
import { Type } from '../types/enums';

/**
 * Generate a random number between specified bounds;
 * @param max The upper bound.
 * @param min The lower bound.
 * @returns The random number.
 */
export function randomNumber(max: number, min = 0) {
  return faker.datatype.number({ min, max });
}

/**
 * Finds a move in the total list of moves by a specified ID.
 * @param id The ID of the move.
 * @param moves The total list moves.
 * @returns The move if found.
 */
export function findMoveById(id: number, moves: PokeMove[]) {
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    if (move.id === id) return move;
  }
}

/**
 * Finds the most common type held by a specified ability's candidates.
 * @param ability The specified ability.
 * @returns The most common type.
 */
export function findMostCommonType(ability: ResponseAbility) {
  const { candidates } = ability;
  const types: Type[] = [];

  candidates.forEach((candidate) => {
    candidate.pokemon.types.forEach(({ type }) => {
      types.push(capitalCase(type.name) as Type);
    });
  });

  const sortedTypes = types.sort((a, b) => {
    const first = types.filter((type) => type === a).length;
    const second = types.filter((type) => type === b).length;
    return first - second;
  });
  const mostCommonType = sortedTypes.pop();
  return mostCommonType;
}

export function organiseCharacters(
  characters: Character[],
  opts: OrganiseOptions = {}
) {
  const { sortId = 1 } = opts;

  if (!sortId) return characters;

  const [property, order] = SortOptions[sortId];
  return characters.slice().sort((a, b) => {
    if (order === 'ascending') {
      if (a[property] < b[property]) return -1;
      if (a[property] > b[property]) return 1;
      return 0;
    } else {
      if (a[property] < b[property]) return 1;
      if (a[property] > b[property]) return -1;
      return 0;
    }
  });
}

const SortOptions: SortOptions = {
  1: ['name', 'ascending'],
  2: ['name', 'descending'],
  3: ['type1', 'ascending'],
  4: ['type1', 'descending']
};

function groupCharacters(characters: Character[]) {
  const groupedCharacters: Array<GroupedCharacter> = [];
  const property = 'universe';

  characters.forEach((character) => {
    const key = character[property];
    const pos = groupedCharacters.findIndex(
      (item: GroupedCharacter) => item.title == key
    );
    if (pos >= 0) {
      groupedCharacters[pos].data.push(character);
    } else {
      groupedCharacters.push({ title: key, data: [character] });
    }
  }, {});

  return groupedCharacters;
}

type GroupedCharacter = { title: string; data: Character[] };
type OrganiseOptions = {
  sortId?: number;
};

type SortOptions = {
  [key: number]: [keyof Character, 'ascending' | 'descending'];
};
