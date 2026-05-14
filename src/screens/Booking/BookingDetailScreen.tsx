import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { BookingRequest } from '../../types';
import { BOOKING_STATUS_COLORS, BOOKING_STATUS_LABELS, MOCK_PROVIDERS } from '../../constants/data';
import { Colors, Spacing, Typography, BorderRadius, Shadow } from '../../constants/theme';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import { openWhatsApp, callPhone } from '../../utils/whatsapp';

type Params = { booking: BookingRequest };

export default function BookingDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: Params }, 'params'>>();
  const { booking } = route.params;

  const provider = MOCK_PROVIDERS.find((p) => p.id === booking.providerId);
  const statusColor = BOOKING_STATUS_COLORS[booking.status] ?? Colors.textSecondary;
  const statusLabel = BOOKING_STATUS_LABELS[booking.status] ?? booking.status;

  function handleCancel() {
    Alert.alert(
      'Annuler la réservation',
      'Êtes-vous sûr de vouloir annuler cette réservation ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Détail réservation</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Status hero */}
        <LinearGradient
          colors={[statusColor, statusColor + 'BB']}
          style={styles.statusHero}
        >
          <View style={styles.statusIconWrapper}>
            <Ionicons
              name={
                booking.status === 'confirme' ? 'checkmark-circle' :
                booking.status === 'annule' ? 'close-circle' :
                booking.status === 'termine' ? 'checkmark-done-circle' :
                'time'
              }
              size={52}
              color="#fff"
            />
          </View>
          <Text style={styles.statusHeroLabel}>{statusLabel}</Text>
          <Text style={styles.statusHeroSub}>
            {booking.status === 'en_attente' ? 'En attente de confirmation du prestataire' :
             booking.status === 'confirme' ? 'Le prestataire a confirmé votre réservation' :
             booking.status === 'termine' ? 'Prestation terminée avec succès' :
             'Cette réservation a été annulée'}
          </Text>
        </LinearGradient>

        {/* Provider info */}
        {provider && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Prestataire</Text>
            <View style={styles.providerRow}>
              <Avatar name={provider.name} size="md" />
              <View style={{ flex: 1 }}>
                <Text style={styles.providerName}>{provider.name}</Text>
                <Text style={styles.providerCat}>{provider.category}</Text>
              </View>
              <TouchableOpacity
                style={styles.whatsappBtn}
                onPress={() => openWhatsApp(provider.whatsapp, provider.name)}
              >
                <Ionicons name="logo-whatsapp" size={20} color={Colors.whatsapp} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => callPhone(provider.phone)}
              >
                <Ionicons name="call-outline" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Booking details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Détails de la prestation</Text>
          {[
            { icon: 'construct-outline', label: 'Service', value: booking.service },
            { icon: 'calendar-outline', label: 'Date', value: booking.date },
            { icon: 'time-outline', label: 'Heure', value: booking.time },
            { icon: 'location-outline', label: 'Adresse', value: booking.address },
            { icon: 'map-outline', label: 'Ville', value: booking.city },
          ].map((row) => (
            <View key={row.label} style={styles.detailRow}>
              <View style={styles.detailIconWrapper}>
                <Ionicons name={row.icon as any} size={16} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
            </View>
          ))}
          {booking.description ? (
            <View style={styles.descriptionBox}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.detailValue}>{booking.description}</Text>
            </View>
          ) : null}
        </View>

        {/* Actions */}
        {booking.status === 'en_attente' && (
          <Button
            label="Annuler la réservation"
            onPress={handleCancel}
            variant="danger"
            fullWidth
            style={styles.cancelBtn}
          />
        )}
        {booking.status === 'termine' && (
          <Button
            label="Laisser un avis"
            onPress={() => provider && navigation.navigate('WriteReview', { provider, bookingId: booking.id })}
            fullWidth
            style={styles.reviewBtn}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: Typography.fontSize.lg, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  content: { paddingBottom: Spacing['4xl'] },
  statusHero: {
    alignItems: 'center',
    padding: Spacing['2xl'],
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing['3xl'],
    marginBottom: Spacing.base,
  },
  statusIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  statusHeroLabel: { fontSize: Typography.fontSize['2xl'], fontWeight: '800', color: '#fff', marginBottom: Spacing.sm },
  statusHeroSub: { fontSize: Typography.fontSize.sm, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 20 },
  card: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  cardTitle: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md, paddingBottom: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  providerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  providerName: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.text },
  providerCat: { fontSize: Typography.fontSize.xs, color: Colors.primary, fontWeight: '500' },
  whatsappBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.whatsapp + '15', alignItems: 'center', justifyContent: 'center' },
  callBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, paddingVertical: Spacing.sm },
  detailIconWrapper: { width: 32, height: 32, borderRadius: BorderRadius.sm, backgroundColor: Colors.primary + '12', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  detailLabel: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, marginBottom: 2 },
  detailValue: { fontSize: Typography.fontSize.base, color: Colors.text, fontWeight: '500' },
  descriptionBox: { marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  cancelBtn: { marginHorizontal: Spacing.base, marginTop: Spacing.sm },
  reviewBtn: { marginHorizontal: Spacing.base, marginTop: Spacing.sm },
});
