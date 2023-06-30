/* eslint-disable import/no-unresolved */
import {
  API_KEY,
  APP_ID,
  AUTH_DOMAIN,
  MESSAGING_SENDER_ID,
  PROJECT_ID,
  STORAGE_BUCKET,
} from '@env';
import { initializeApp } from 'firebase/app';
import type { FirestoreDataConverter } from 'firebase/firestore';
import { collection, getFirestore } from 'firebase/firestore';

import { zCharacter } from 'src/utils/validators';

const app = initializeApp({
  apiKey: API_KEY,
  appId: APP_ID,
  authDomain: AUTH_DOMAIN,
  messagingSenderId: MESSAGING_SENDER_ID,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
});
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
