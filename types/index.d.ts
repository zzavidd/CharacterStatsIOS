import type { QueryResult } from '@apollo/client';
import type { FirebaseError } from 'firebase/app';
import type { Dispatch, SetStateAction } from 'react';
import type { z } from 'zod';

import type { Type } from 'src/utils/constants/enums';
import type { zCharacter, zStats } from 'src/utils/validators';

declare global {
  export type Character = z.infer<typeof zCharacter>;
  export type Stats = z.infer<typeof zStats>;

  export type ReactUseState<T> = [T, Dispatch<SetStateAction<T>>];

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

  export interface RawAbility {
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

  export interface RawMove {
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

  export interface RawType {
    id: number;
    name: string;
  }

  export interface FirestoreResult<T> {
    data: T;
    error: FirebaseError | null;
    loading: boolean;
  }

  export type ApolloResult<T> = Pick<
    QueryResult<T>,
    'data' | 'error' | 'loading'
  >;
}