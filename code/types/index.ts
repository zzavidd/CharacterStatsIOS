import { Character } from './classes';
import { Type } from './enums';

export type AppState = {
  isInitialised: boolean;
  characters: Character[];
  abilities: PokeAbility[];
  moves: PokeMove[];
  types: PokeType[];
};

export type RootStackParamList = {
  Home: {
    characters: Character[];
    refreshCharacters: () => void;
  };
  Form: {
    character: Character;
    isEdit: boolean;
    refreshCharacters?: () => void;
  };
};

export type GenericListItem = PokeType | PokeAbility | PokeMove;

export type PokeType = {
  id: number;
  name: Type;
  color: string;
};

export type PokeMove = {
  id: number;
  name: string;
  color: string;
  accuracy: number;
  power: number;
  pp: number;
  type: Type;
  damageClass: string;
  effect: string;
};

export type PokeAbility = {
  id: number;
  name: string;
  color: string;
  generation: number;
  effect: string;
  commonType: Type;
};

export type ResponseData = {
  abilities: ResponseAbility[];
  moves: ResponseMove[];
  types: ResponseType[];
};

export type ResponseAbility = {
  id: number;
  name: string;
  generation: number;
  effects: {
    effect: string;
  };
  candidates: [
    {
      pokemon: {
        types: [
          {
            type: {
              name: string;
            };
          }
        ];
      };
    }
  ];
};

export type ResponseMove = {
  id: number;
  name: string;
  accuracy: number;
  power: number;
  pp: number;
  type: {
    name: string;
  };
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

export type ResponseType = {
  id: number;
  name: string;
};
