import type { QueryResult } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { collection, getDocs } from 'firebase/firestore/lite';
import { useEffect, useState } from 'react';

import { firestore } from 'firestore';
import { Character } from 'src/models/Character';

import { QUERY_ABILITIES, QUERY_MOVES, QUERY_TYPES } from './queries';

const characterCollection = collection(
  firestore,
  'characters',
).withConverter<Character>({
  toFirestore: (character) => character,
  fromFirestore: (snapshot) => new Character(snapshot.data()),
});

export function useCharacters(): CustomQueryResult<Character[]> {
  const [state, setState] = useState<CustomQueryResult<Character[]>>({
    data: undefined,
    error: null,
    isLoading: false,
    isSuccess: false,
  });

  useEffect(() => {
    (async () => {
      try {
        setState((s) => ({
          ...s,
          data: undefined,
          isLoading: true,
          isSuccess: false,
        }));
        const characterDocs = await getDocs(characterCollection);
        const data = characterDocs.docs.map((doc) => doc.data());
        setState((s) => ({ ...s, data, isLoading: false, isSuccess: true }));
      } catch (e) {
        setState((s) => ({ ...s, error: e, isLoading: false }));
      }
    })();
  }, []);

  return state;
}

export function useAbilities(): QueryResult<PokeAbility[]> {
  return useQuery(QUERY_ABILITIES);
}

export function useMoves(): QueryResult<PokeMove[]> {
  return useQuery(QUERY_MOVES);
}

export function useTypes(): QueryResult<PokeType[]> {
  return useQuery(QUERY_TYPES);
}

type CustomQueryResult<T> =
  | {
      data: undefined;
      error: unknown | null;
      isLoading: boolean;
      isSuccess: false;
    }
  | {
      data: T;
      error: unknown | null;
      isLoading: false;
      isSuccess: true;
    };
