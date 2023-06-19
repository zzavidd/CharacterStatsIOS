import type React from 'react';

import { AppContext } from 'App.context';
import useAbilities from 'src/utils/hooks/useAbilities';
import useMoves from 'src/utils/hooks/useMoves';
import useTypes from 'src/utils/hooks/useTypes';

export default function ContextInitialiser({
  children,
}: React.PropsWithChildren) {
  const abilitiesResult = useAbilities();
  const movesResult = useMoves();
  const typesResult = useTypes();

  const collection = [abilitiesResult, movesResult, typesResult];
  const isLoading = collection.some(({ loading }) => loading);
  const isSuccess = collection.every(({ data }) => !!data);

  return (
    <AppContext.Provider
      value={{
        abilitiesResult,
        movesResult,
        typesResult,
        isLoading,
        isSuccess,
      }}>
      {children}
    </AppContext.Provider>
  );
}
