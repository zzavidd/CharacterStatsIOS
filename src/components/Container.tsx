import { useTheme } from '@react-navigation/native';
import { Box } from 'native-base';
import type { InterfaceBoxProps } from 'native-base/lib/typescript/components/primitives/Box';
import React from 'react';

export function ScreenContainer(props: InterfaceBoxProps) {
  const theme = useTheme();
  return <Box bgColor={theme.colors.card} {...props} />;
}
