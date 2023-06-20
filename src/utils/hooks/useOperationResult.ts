import type { FirebaseError } from 'firebase/app';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function useOperationResult<T>(
  callback: (args: T) => Promise<void>,
) {
  const [state, setState] = useState<FirestoreResult<void>>({
    data: undefined,
    error: null,
    loading: false,
  });

  const mutate = useCallback(
    async (args: T) => {
      try {
        setState((s) => ({ ...s, loading: true }));
        await callback(args);
        setState((s) => ({ ...s, loading: false }));
      } catch (e) {
        setState((s) => ({ ...s, error: e as FirebaseError, loading: false }));
      }
    },
    [callback],
  );

  useEffect(() => {
    if (state.error) {
      Alert.alert(state.error.message);
    }
  }, [state.error]);

  return { mutate, ...state };
}
