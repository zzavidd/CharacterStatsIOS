import * as faker from 'faker';

import { PokeMove } from '../types';

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

export function shiftElement(list: number[], fromIndex: number, toIndex: number) {
  const element = list[fromIndex];
  list.splice(fromIndex, 1);
  list.splice(toIndex, 0, element);
}
