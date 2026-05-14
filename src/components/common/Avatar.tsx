import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius } from '../../constants/theme';
import { getInitials, buildAvatarUrl } from '../../utils/formatters';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<Size, number> = {
  xs: 28,
  sm: 36,
  md: 48,
  lg: 64,
  xl: 96,
};

const FONT_MAP: Record<Size, number> = {
  xs: 10,
  sm: 13,
  md: 17,
  lg: 22,
  xl: 32,
};

type Props = {
  name: string;
  uri?: string;
  size?: Size;
  bgColor?: string;
  style?: ViewStyle;
  borderColor?: string;
  borderWidth?: number;
};

export default function Avatar({
  name,
  uri,
  size = 'md',
  bgColor = Colors.primary,
  style,
  borderColor,
  borderWidth = 0,
}: Props) {
  const dim = SIZE_MAP[size];
  const fontSize = FONT_MAP[size];
  const borderRadius = dim / 2;

  const source = uri
    ? { uri }
    : { uri: buildAvatarUrl(name) };

  return (
    <View
      style={[
        styles.wrapper,
        {
          width: dim,
          height: dim,
          borderRadius,
          borderColor: borderColor ?? 'transparent',
          borderWidth,
        },
        style,
      ]}
    >
      <Image
        source={source}
        style={{ width: dim, height: dim, borderRadius }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    backgroundColor: Colors.border,
  },
});
