/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { collection, orderBy, query } from 'firebase/firestore';
import { useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Alert } from 'react-native';

import firestore, { converter } from 'firestore';

const characterCollection = collection(firestore, 'characters').withConverter(
  converter,
);

export default function useGetCharacters() {
  const [data, isLoading, error] = useCollectionData<Character>(
    query(characterCollection, orderBy('createTime', 'desc')),
  );

  useEffect(() => {
    if (error) {
      Alert.alert(error.message);
    }
  }, [error]);

  return { data, isLoading };
}
