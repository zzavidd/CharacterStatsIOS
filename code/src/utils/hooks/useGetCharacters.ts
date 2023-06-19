/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { collection } from 'firebase/firestore';
import { useEffect } from 'react';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { Alert } from 'react-native';

import firestore, { converter } from 'firestore';

const characterCollection = collection(firestore, 'characters').withConverter(
  converter,
);

export default function useGetCharacters() {
  const [data, isLoading, error, , refetch] =
    useCollectionDataOnce<Character>(characterCollection);

  useEffect(() => {
    if (error) {
      Alert.alert(error.message);
    }
  }, [error]);

  return { data, isLoading, refetch };
}
