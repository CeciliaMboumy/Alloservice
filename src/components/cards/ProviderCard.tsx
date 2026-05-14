import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from '../../types';
import { Colors, Spacing, BorderRadius, Typography, Shadow } from '../../constants/theme';
import StarRating from '../common/StarRating';
import Badge from '../common/Badge';

type Props = {
  provider: Provider;
  onPress: () => void;
};

const AVATAR_PLACEHOLDER = 'https://ui-avatars.com/api/?name=';

export default function ProviderCard({ provider, onPress }: Props) {
  const avatarUri = provider.avatar
    ? { uri: provider.avatar }
    : { uri: `${AVATAR_PLACEHOLDER}${encodeURIComponent(provider.name)}&background=1B6B3A&color=fff&size=200` };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={avatarUri} style={styles.avatar} />
      {provider.verified && (
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
        </View>
      )}
      <View style={styles.body}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{provider.name}</Text>
          {!provider.available && (
            <Badge label="Indisponible" color={Colors.textLight} textColor="#fff" />
          )}
        </View>
        <Text style={styles.category}>{provider.category}</Text>
        <View style={styles.ratingRow}>
          <StarRating rating={provider.rating} size={13} />
          <Text style={styles.ratingText}>{provider.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({provider.reviewCount} avis)</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.location}>{provider.city}</Text>
          </View>
          <Text style={styles.price}>
            {provider.price.toLocaleString()} <Text style={styles.priceUnit}>{provider.priceUnit}</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...Shadow.md,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.border,
  },
  verifiedBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md + 52,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
  },
  body: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  name: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.xs,
  },
  category: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: 4,
  },
  ratingText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  reviewCount: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  location: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  price: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.primary,
  },
  priceUnit: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
});
