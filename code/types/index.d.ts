import type { Character } from 'src/models/Character';
import type { Stat, Type } from 'src/utils/constants/enums';

declare global {
  export interface AppState {
    isInitialised: boolean;
    characters: Character[];
    abilities: PokeAbility[];
    moves: PokeMove[];
    types: PokeType[];
    sortValue: number;
    groupValue: number;
  }

  export type GenericListItem = PokeType | PokeAbility | PokeMove;

  export interface PokeType {
    id: number;
    name: Type;
    color: string;
  }

  export interface PokeMove {
    id: number;
    name: string;
    color: string;
    accuracy: number;
    description: string;
    power: number;
    pp: number;
    type: Type;
    damageClass: string;
  }

  export interface PokeAbility {
    id: number;
    name: string;
    color: string;
    generation: number;
    description: string;
    commonType: Type;
  }

  export type Stats = Record<Stat, number>;

  export interface ResponseData {
    abilities: ResponseAbility[];
    moves: ResponseMove[];
    types: ResponseType[];
  }

  export interface ResponseAbility {
    id: number;
    name: string;
    generation: number;
    description: [
      {
        text: string;
      },
    ];
    candidates: [
      {
        pokemon: {
          types: [
            {
              type: {
                name: string;
              };
            },
          ];
        };
      },
    ];
  }

  export interface ResponseMove {
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
    description: [
      {
        text: string;
      },
    ];
  }

  export interface ResponseType {
    id: number;
    name: string;
  }
}
