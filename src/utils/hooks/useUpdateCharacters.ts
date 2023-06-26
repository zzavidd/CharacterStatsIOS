import { doc, writeBatch } from 'firebase/firestore';

import firestore, { characterCollection } from 'firestore';

import useOperationResult from './useOperationResult';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function useUpdateCharacters() {
  return useOperationResult<CharacterUpdateInput[]>(async (characters) => {
    const batch = writeBatch(firestore);
    characters.forEach((character) => {
      const characterDoc = doc(characterCollection, character.id);
      batch.update(characterDoc, character);
    });
    await batch.commit();
  });
}
