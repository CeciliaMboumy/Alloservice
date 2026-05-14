import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookingRequest } from '../../types';
import { BOOKING_STATUS_COLORS, BOOKING_STATUS_LABELS } from '../../constants/data';
import { Colors, Spacing, Typography, BorderRadius, Shadow } from '../../constants/theme';

type Props = {
  booking: BookingRequest;
  onPress?: () => void;
  onReview?: () => void;
  onCancel?: () => void;
};

export default function BookingCard({ booking, onPress, onReview, onCancel }: Props) {
  const statusColor = BOOKING_STATUS_COLORS[booking.status] ?? Colors.textSecondary;
  const statusLabel = BOOKING_STATUS_LABELS[booking.status] ?? booking.status;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <Ionicons name="construct-outline" size={20} color={Colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.providerName} numberOfLines={1}>{booking.providerName}</Text>
          <Text style={styles.service}>{booking.service}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={13} color={Colors.textSecondary} />
          <Text style={styles.metaText}>{booking.date}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
          <Text style={styles.metaText}>{booking.time}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
          <Text style={styles.metaText} numberOfLines={1}>{booking.city}</Text>
        </View>
      </View>

      {(booking.status === 'termine' && onReview) && (
        <TouchableOpacity style={styles.reviewLink} onPress={onReview}>
          <Ionicons name="star-outline" size={14} color={Colors.primary} />
          <Text style={styles.reviewLinkText}>Laisser un avis</Text>
        </TouchableOpacity>
      )}
      {(booking.status === 'en_attente' && onCancel) && (
        <TouchableOpacity style={styles.cancelLink} onPress={onCancel}>
          <Ionicons name="close-circle-outline" size={14} color={Colors.error} />
          <Text style={styles.cancelLinkText}>Annuler</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerName: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
  },
  service: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.base,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  reviewLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  reviewLinkText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  cancelLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  cancelLinkText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.error,
    fontWeight: '600',
  },
});
