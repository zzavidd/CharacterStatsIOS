import React, { useState } from 'react';

import CharacterForm from 'src/fragments/Form/CharacterForm';
import CharacterFormContext, {
  InitialCharacterFormState,
} from 'src/fragments/Form/CharacterForm.context';

export default function FormScreen() {
  const context = useState(InitialCharacterFormState);
  return (
    <CharacterFormContext.Provider value={context}>
      <CharacterForm />
    </CharacterFormContext.Provider>
  );
}
