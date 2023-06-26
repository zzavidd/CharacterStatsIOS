import type React from 'react';
import { useState } from 'react';

import { AppContext, InitialAppState, QueriesContext } from 'App.context';
import useAbilities from 'src/utils/hooks/useAbilities';
import useMoves from 'src/utils/hooks/useMoves';
import useTypes from 'src/utils/hooks/useTypes';

export default function ContextInitializer({
  children,
}: React.PropsWithChildren) {
  const appContext = useState(InitialAppState);

  const abilitiesResult = useAbilities();
  const movesResult = useMoves();
  const typesResult = useTypes();

  const collection = [abilitiesResult, movesResult, typesResult];
  const isLoading = collection.some(({ loading }) => loading);
  const isSuccess = collection.every(({ data }) => !!data);

  return (
    <AppContext.Provider value={appContext}>
      <QueriesContext.Provider
        value={{
          abilitiesResult,
          movesResult,
          typesResult,
          isLoading,
          isSuccess,
        }}>
        {children}
      </QueriesContext.Provider>
    </AppContext.Provider>
  );
}
