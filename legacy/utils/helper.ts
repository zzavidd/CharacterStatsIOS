import { capitalCase } from 'capital-case';

import { GroupOptions, SortOptions } from '../constants/options';
import type { PokeMove, ResponseAbility } from '../types';
import { Character } from '../types/classes';
import type { Type } from '../types/enums';

import store from './reducers';

/**
 * Finds a move in the total list of moves by a specified ID.
 * @param id The ID of the move.
 * @param moves The total list moves.
 * @returns The move if found.
 */
export function findMoveById(
  id: number,
  moves: PokeMove[]
): PokeMove | undefined {
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
export function findMostCommonType(ability: ResponseAbility): Type | undefined {
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

/**
 * Sort characters by the sort value in memory.
 * @param characters The current list of characters.
 * @returns The sorted list of characters.
 */
export function sortCharacters(characters: Character[]): Character[] {
  const { sortValue } = store.getState();

  if (!sortValue) return characters;

  const property = SortOptions[sortValue];
  return characters.slice().sort((a, b) => {
    if (property !== 'bst') {
      if (a[property] < b[property]) return -1;
      if (a[property] > b[property]) return 1;
      return 0;
    } else {
      const aBST = Character.calculateBST(a);
      const bBST = Character.calculateBST(b);
      return aBST - bBST;
    }
  });
}

/**
 * Group characters by a specified property.
 * @param characters The list of characters.
 * @returns The map of characters grouped by property.
 */
export function groupCharacters(characters: Character[]): CharacterGroup[] {
  const { sortValue, groupValue } = store.getState();

  let groups: Array<CharacterGroup> = [];
  const groupOption = GroupOptions[groupValue];
  if (!groupOption) return groups;

  const [property] = groupOption;

  characters.forEach((character) => {
    const key = character[property] as string;
    if (!key) return;

    const index = groups.findIndex((item) => item.title == key);

    if (index >= 0) {
      groups[index].data[0].push(character);
    } else {
      groups.push({ title: key, data: [[character]] });
    }
  });

  groups = groups.sort((a, b) => {
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  });

  if (sortValue) {
    groups = groups.map(({ title, data }) => {
      return {
        title,
        data: [sortCharacters(data[0])]
      };
    });
  }

  return groups;
}

export interface CharacterGroup {
  title: string;
  data: Character[][];
}
