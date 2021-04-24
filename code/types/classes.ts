export class Character {
  name: string;
  universe: string;
  type1: string;
  type2: string;
  ability1: string;
  ability2: string;
  abilityX: string;
  stats: CharacterStats;
  learnset: Learnset;

  constructor() {
    this.stats = {
      hp: 0,
      attack: 0,
      defence: 0,
      spAtk: 0,
      spDef: 0,
      speed: 0
    };
  }
}

export type CharacterStats = {
  hp: number;
  attack: number;
  defence: number;
  spAtk: number;
  spDef: number;
  speed: number;
};

type Learnset = {
  [key: number]: string;
};