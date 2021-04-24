import { Type } from "./enums";

export type AppState = {
  types: PokeType[];
  abilities: PokeAbility[];
  moves: PokeMove[];
};

export type RootStackParamList = {
  Home: undefined;
  Form: undefined;
};

export type GenericListItem = PokeType | PokeAbility | PokeMove;

export type PokeType = {
  id: number;
  name: Type;
  color: string;
};

export type PokeAbility = {
  id: number;
  name: string;
  color: string;
  generation: number;
  effects: {
    effect: string;
  };
};

export type PokeMove = {
  id: number;
  name: string;
  color: string;
  accuracy: number;
  power: number;
  pp: number;
  typeId: number;
  damageClass: {
    name: string;
  };
  effect: {
    texts: [
      {
        text: string;
      }
    ];
  };
};