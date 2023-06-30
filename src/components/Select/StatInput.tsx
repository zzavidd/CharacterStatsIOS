import immutate from 'immutability-helper';
import { Input } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';

import CharacterFormContext from 'src/fragments/Form/CharacterForm.context';
import type { Stat } from 'src/utils/constants/enums';

export default function StatInput({ stat, value }: StatInputProps) {
  const [state, setState] = useState({ value: 0 });
  const [, setContext] = useContext(CharacterFormContext);

  useEffect(() => {
    setState({ value });
  }, [value]);

  function onChangeText(value: string) {
    setState({ value: Number(value) });
  }

  function onEndEditing() {
    setContext((s) =>
      immutate(s, { character: { stats: { [stat]: { $set: state.value } } } }),
    );
  }

  return (
    <Input
      value={String(state.value)}
      onChangeText={onChangeText}
      onEndEditing={onEndEditing}
      variant={'filled'}
      textAlign={'right'}
      inputMode={'numeric'}
      returnKeyLabel={'Done'}
      returnKeyType={'done'}
      w={'16'}
    />
  );
}

interface StatInputProps {
  stat: Stat;
  value: number;
}
