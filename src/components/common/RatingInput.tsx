import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../../constants/theme';

type Props = {
  value: number;
  onChange: (rating: number) => void;
  size?: number;
  label?: string;
};

const LABELS = ['', 'Très mauvais', 'Mauvais', 'Correct', 'Bien', 'Excellent'];

export default function RatingInput({ value, onChange, size = 36, label }: Props) {
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => onChange(star)} activeOpacity={0.7}>
            <Ionicons
              name={star <= value ? 'star' : 'star-outline'}
              size={size}
              color={star <= value ? Colors.star : Colors.border}
            />
          </TouchableOpacity>
        ))}
      </View>
      {value > 0 && (
        <Text style={styles.ratingLabel}>{LABELS[value]}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  stars: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  ratingLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});
