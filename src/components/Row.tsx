import React from 'react';
import type { ViewProps, ViewStyle } from 'react-native';
import { View } from 'react-native';

export function Row({ style, ...props }: RowProps) {
  return <View style={{ flexDirection: 'row', ...style }} {...props} />;
}

interface RowProps extends ViewProps {
  style?: ViewStyle;
}
