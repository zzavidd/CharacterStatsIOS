import { faker } from '@faker-js/faker/locale/en_GB';

import { DEFAULT_STATS } from 'src/utils/constants/defaults';

import { Stat, Type } from '../utils/constants/enums';
import { Universes } from '../utils/constants/options';

export class Character {
  public id: string;
  public name?: string;
  public universe?: string | null;
  public type1?: Type | null;
  public type2?: Type | null;
  public ability1?: string;
  public ability2?: string | null;
  public abilityX?: string | null;
  public stats: Stats;
  public learnset: number[];
  public dateAdded?: Date;

  constructor(args: Partial<Character>) {
    this.id = args.id || '';
    this.name = args.name;
    this.universe = args.universe || null;
    this.type1 = args.type1 || null;
    this.type2 = args.type2 || null;
    this.ability1 = args.ability1;
    this.ability2 = args.ability2 || null;
    this.abilityX = args.abilityX || null;
    this.stats = args.stats || DEFAULT_STATS;
    this.learnset = args.learnset = [];
    this.dateAdded = args.dateAdded || new Date();
  }

  public static calculateBST(character: Character): number {
    return Object.values(character.stats).reduce((bst, value: unknown) => {
      if (value) {
        bst += parseInt(value as string);
      }
      return bst;
    }, 0);
  }

  public static buildRandomCharacter({
    abilities,
    moves,
  }: AppState): Character {
    const types = Object.values(Type);
    const hasSecondType = faker.datatype.boolean();
    const hasSecondAbility = faker.datatype.boolean();

    const getRandomType = (): Type =>
      types[faker.number.int({ max: types.length - 1 })];
    const getRandomAbility = (): string =>
      abilities[faker.number.int({ max: abilities.length - 1 })].name;

    const character = new Character({
      name: faker.person.firstName(),
      universe: Universes[faker.number.int({ min: 0, max: 2 })].name,
      type1: getRandomType(),
      type2: hasSecondType ? getRandomType() : null,
      ability1: getRandomAbility(),
      ability2: hasSecondAbility ? getRandomAbility() : null,
      abilityX: getRandomAbility(),
    });
    character.generateStats();
    character.generateLearnset(moves);
    return character;
  }

  private generateStats(): void {
    Object.values(Stat).forEach((property) => {
      this.stats[property] = faker.number.int({
        min: 5,
        max: 140,
      });
    });
  }

  private generateLearnset(moves: PokeMove[]): void {
    for (let i = 0; i < faker.number.int({ min: 8, max: 18 }); i++) {
      const move = moves[faker.number.int({ max: 0 })].id;
      this.learnset.push(move);
    }
  }
}
