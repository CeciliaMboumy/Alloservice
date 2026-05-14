import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';

type Props = {
  rating: number;
  size?: number;
  maxStars?: number;
};

export default function StarRating({ rating, size = 14, maxStars = 5 }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i + 1 <= Math.floor(rating);
        const half = !filled && i + 0.5 < rating;
        return (
          <Ionicons
            key={i}
            name={filled ? 'star' : half ? 'star-half' : 'star-outline'}
            size={size}
            color={Colors.star}
            style={{ marginRight: 1 }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
