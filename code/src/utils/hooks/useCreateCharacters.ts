import type { FirebaseError } from 'firebase/app';
import { addDoc, collection } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import firestore, { converter } from 'firestore';

const characterCollection = collection(firestore, 'characters').withConverter(
  converter,
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function useCreateCharacters() {
  const [state, setState] = useState<FirestoreResult<void>>({
    data: undefined,
    error: null,
    loading: false,
  });

  const mutate = useCallback(async (characters: Character[]) => {
    try {
      setState((s) => ({ ...s, loading: true }));
      const promises = characters.map((character) => {
        return addDoc(characterCollection, character);
      });
      await Promise.all(promises);
      setState((s) => ({ ...s, loading: false }));
    } catch (e) {
      setState((s) => ({ ...s, error: e as FirebaseError, loading: false }));
    }
  }, []);

  useEffect(() => {
    if (state.error) {
      Alert.alert(state.error.message);
    }
  }, [state.error]);

  return { mutate, ...state };
}
