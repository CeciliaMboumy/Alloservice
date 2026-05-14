import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import Button from './Button';

type Props = {
  emoji?: string;
  title: string;
  subtitle?: string;
  action?: { label: string; onPress: () => void };
  style?: ViewStyle;
};

export default function EmptyState({ emoji = '🔍', title, subtitle, action, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.emojiWrapper}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {action && (
        <Button
          label={action.label}
          onPress={action.onPress}
          style={styles.btn}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
    paddingHorizontal: Spacing['2xl'],
  },
  emojiWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  emoji: {
    fontSize: 36,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  btn: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing['2xl'],
  },
});
