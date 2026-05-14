import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, Typography, Shadow } from '../../constants/theme';

type Props = TextInputProps & {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  onPress?: () => void;
  elevated?: boolean;
};

export default function SearchBar({ value, onChangeText, onClear, onPress, elevated = false, ...rest }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.85 : 1}
      onPress={onPress}
      style={[styles.bar, elevated && Shadow.md]}
    >
      <Ionicons name="search" size={18} color={Colors.textSecondary} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={Colors.textLight}
        returnKeyType="search"
        editable={!onPress}
        {...rest}
      />
      {value.length > 0 && onClear && (
        <TouchableOpacity onPress={onClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="close-circle" size={18} color={Colors.textLight} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    height: 48,
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
  },
});
