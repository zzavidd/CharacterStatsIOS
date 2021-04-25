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
  learnset: CharacterLearnset;
  dateAdded: Date;

  static buildRandomCharacter({ abilities, moves }: AppState) {
    const types = Object.values(Type);
    const addSecondType = faker.datatype.boolean();
    const addSecondAbility = faker.datatype.boolean();

    const character = new Character();
    character.name = faker.name.firstName();
    character.universe = Universes[randomNumber(1, 3)].name;
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
    const learnset: CharacterLearnset = {};
    for (let i = 0; i < 15; i++) {
      learnset[randomNumber(100)] =
        moveList[randomNumber(moveList.length - 1)].name;
    }
    return learnset;
  }
}

export type CharacterStats = {
  [key in Stat]?: number;
};

type CharacterLearnset = {
  [key: number]: string;
};
