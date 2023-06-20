import { doc, writeBatch } from 'firebase/firestore';

import firestore, { characterCollection } from 'firestore';

import useOperationResult from './useOperationResult';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function useDeleteCharacters() {
  return useOperationResult<string[]>(async (ids: string[]) => {
    const batch = writeBatch(firestore);
    ids.forEach((id) => {
      const characterDoc = doc(characterCollection, id);
      batch.delete(characterDoc);
    });
    await batch.commit();
  });
}
