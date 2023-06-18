import { Stat } from './enums';

export const DEFAULT_STATS: Stats = {
  [Stat.HP]: 0,
  [Stat.ATTACK]: 0,
  [Stat.DEFENCE]: 0,
  [Stat.SPATK]: 0,
  [Stat.SPDEF]: 0,
  [Stat.SPEED]: 0,
};

export const StatMap = {
  [Stat.HP]: 'HP',
  [Stat.ATTACK]: 'Attack',
  [Stat.DEFENCE]: 'Defence',
  [Stat.SPATK]: 'Sp. Atk',
  [Stat.SPDEF]: 'Sp. Def',
  [Stat.SPEED]: 'Speed',
};
