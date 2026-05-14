import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '../../constants/theme';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  icon?: string;
};

export default function Chip({ label, selected = false, onPress, style, icon }: Props) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected, style]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  icon: {
    fontSize: 14,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  labelSelected: {
    color: '#fff',
    fontWeight: '700',
  },
});
