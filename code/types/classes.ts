import * as faker from 'faker';

import { Stat, Type } from './enums';

import { AppState, PokeMove } from '.';
import { Universes } from '../constants/fields';
import { randomNumber } from '../utils/helper';

export class Character {
  id: string;
  name: string;
  universe: string;
  type1: Type;
  type2: Type;
  ability1: string;
  ability2: string;
  abilityX: string;
  stats: CharacterStats;
  learnset: number[];
  dateAdded: Date;

  constructor() {
    this.learnset = [];
    this.stats = {};
  }

  static calculateBST(character: Character) {
    let bst = 0;
    Object.values(character.stats).forEach((value: unknown) => {
      if (value) {
        bst += parseInt(value as string);
      }
    });
    return bst;
  }

  static buildRandomCharacter({ abilities, moves }: AppState) {
    const types = Object.values(Type);
    const addSecondType = faker.datatype.boolean();
    const addSecondAbility = faker.datatype.boolean();

    const character = new Character();
    character.name = faker.name.firstName();
    character.universe =
      Universes[faker.datatype.number({ min: 0, max: 2, precision: 1 })].name;
    character.type1 = types[randomNumber(types.length - 1)];

    if (addSecondType) {
      character.type2 = types[randomNumber(types.length - 1)];
    }

    character.ability1 = abilities[randomNumber(abilities.length - 1)].name;
    character.abilityX = abilities[randomNumber(abilities.length - 1)].name;

    if (addSecondAbility) {
      character.ability2 = abilities[randomNumber(abilities.length - 1)].name;
    }

    character.stats = Character.generateStats();
    character.learnset = Character.generateLearnset(moves);

    character.id = `${character.universe}:${character.name}`;

    return character;
  }

  static generateStats() {
    const stats: CharacterStats = {};
    Object.values(Stat).forEach((property) => {
      stats[property] = faker.datatype.number({
        min: 5,
        max: 140,
        precision: 5
      });
    });
    return stats;
  }

  static generateLearnset(moveList: PokeMove[]) {
    const learnset = [];
    for (let i = 0; i < 15; i++) {
      const move = moveList[randomNumber(moveList.length - 1)].id;
      learnset.push(move);
    }
    return learnset;
  }
}

export type CharacterStats = {
  [key in Stat]?: number;
};
