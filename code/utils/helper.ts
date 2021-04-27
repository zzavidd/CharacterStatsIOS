import { capitalCase } from 'capital-case';
import * as faker from 'faker';

import { PokeMove, ResponseAbility } from '../types';
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
