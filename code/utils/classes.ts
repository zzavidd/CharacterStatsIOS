export class Character {
  name: string;
  universe: string;
  type1: string;
  type2: string;
  ability1: string;
  ability2: string;
  abilityX: string;
  learnset: Learnset;
  stats: Stats;
}

type Learnset = {
  [key: string]: string;
};

type Stats = {
  hp: number;
  attack: number;
  defence: number;
  spAtk: number;
  spDef: number;
  speed: number;
};
