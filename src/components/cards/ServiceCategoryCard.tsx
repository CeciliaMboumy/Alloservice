import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ServiceCategory } from '../../types';
import { Colors, Spacing, BorderRadius, Typography, Shadow } from '../../constants/theme';

type Props = {
  category: ServiceCategory;
  onPress: () => void;
};

export default function ServiceCategoryCard({ category, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.iconWrapper, { backgroundColor: category.color + '20' }]}>
        <Text style={styles.icon}>{category.icon}</Text>
      </View>
      <Text style={styles.name} numberOfLines={2}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    alignItems: 'center',
    width: '22%',
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  icon: {
    fontSize: 26,
  },
  name: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 15,
  },
});
