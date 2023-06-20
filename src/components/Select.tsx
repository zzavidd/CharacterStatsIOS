import type { IButtonProps } from 'native-base';
import { Box, CheckIcon, CircleIcon, Select } from 'native-base';
import type { InterfaceSelectProps } from 'native-base/lib/typescript/components/primitives/Select/types';
import React, { useContext } from 'react';

import { AppContext } from 'App.context';
import Color from 'src/utils/constants/colors';
import { Type } from 'src/utils/constants/enums';

const selectedItemStyle: Partial<IButtonProps> = {
  bgColor: 'primary.800',
  endIcon: (
    <Box alignSelf={'center'}>
      <CheckIcon size={'5'} />
    </Box>
  ),
};

export function TypeSelect(props: InterfaceSelectProps) {
  return (
    <Select _selectedItem={selectedItemStyle} {...props}>
      {Object.values(Type).map((type) => (
        <Select.Item
          startIcon={
            <Box alignSelf={'center'}>
              <CircleIcon color={Color.TYPE[type]} />
            </Box>
          }
          justifyContent={'center'}
          label={type}
          value={type}
          key={type}
        />
      ))}
    </Select>
  );
}

export function AbilitySelect(props: InterfaceSelectProps) {
  const { abilitiesResult } = useContext(AppContext);
  const { data: abilities = [] } = abilitiesResult;

  return (
    <Select _selectedItem={selectedItemStyle} {...props}>
      {abilities.map(({ id, name, color }) => (
        <Select.Item
          startIcon={
            <Box alignSelf={'center'}>
              <CircleIcon color={color} />
            </Box>
          }
          label={name}
          value={String(id)}
          key={id}
        />
      ))}
    </Select>
  );
}
