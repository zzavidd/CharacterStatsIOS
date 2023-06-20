import { initializeApp } from 'firebase/app';
import type { FirestoreDataConverter } from 'firebase/firestore';
import { collection, getFirestore } from 'firebase/firestore';

import config from 'config.json';
import { zCharacter } from 'src/utils/validators';

const app = initializeApp(config);
const firestore = getFirestore(app);
export default firestore;

export const converter: FirestoreDataConverter<Character> = {
  toFirestore: (character) => ({ ...character }),
  fromFirestore: (snapshot) =>
    zCharacter.parse({
      ...snapshot.data(),
      id: snapshot.id,
    }),
};

export const characterCollection = collection(
  firestore,
  'characters',
).withConverter(converter);
