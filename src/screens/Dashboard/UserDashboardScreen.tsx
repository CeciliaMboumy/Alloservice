import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { Colors, Spacing, Typography, BorderRadius, Shadow } from '../../constants/theme';
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from '../../constants/data';

const AVATAR_PLACEHOLDER = 'https://ui-avatars.com/api/?name=';

const MOCK_BOOKINGS = [
  {
    id: 'b1',
    providerName: 'Marie-Claire Nguema',
    service: 'Ménage',
    date: '20/05/2026',
    time: '09:00',
    status: 'confirme',
    price: '5 000 FCFA/heure',
  },
  {
    id: 'b2',
    providerName: 'Fatou Diallo',
    service: 'Coiffure',
    date: '18/05/2026',
    time: '14:00',
    status: 'en_attente',
    price: '8 000 FCFA/séance',
  },
  {
    id: 'b3',
    providerName: 'Jean-Paul Koné',
    service: 'Plomberie',
    date: '10/05/2026',
    time: '10:00',
    status: 'termine',
    price: '15 000 FCFA/intervention',
  },
];

const MENU_ITEMS = [
  { icon: 'person-outline', label: 'Modifier mon profil', action: 'EditProfile' },
  { icon: 'notifications-outline', label: 'Notifications', action: 'Notifications' },
  { icon: 'heart-outline', label: 'Mes Favoris', action: 'Favorites' },
  { icon: 'briefcase-outline', label: 'Devenir prestataire', action: 'BecomeProvider' },
  { icon: 'settings-outline', label: 'Paramètres', action: 'Settings' },
  { icon: 'help-circle-outline', label: 'Aide & Support', action: 'Help' },
];

export default function UserDashboardScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { userProfile, user, logOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'reservations' | 'compte'>('reservations');

  const displayName = userProfile?.name || user?.displayName || 'Utilisateur';
  const email = userProfile?.email || user?.email || '';
  const city = userProfile?.city || 'Non défini';
  const avatarUri = {
    uri: `${AVATAR_PLACEHOLDER}${encodeURIComponent(displayName)}&background=1B6B3A&color=fff&size=200`,
  };

  async function handleLogOut() {
    Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter',
        style: 'destructive',
        onPress: async () => {
          await logOut();
          navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
        },
      },
    ]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Spacing['3xl'] }}>
        {/* Header */}
        <LinearGradient
          colors={['#1B4332', '#1B6B3A']}
          style={[styles.header, { paddingTop: insets.top + Spacing.md }]}
        >
          <View style={styles.profileRow}>
            <Image source={avatarUri} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{displayName}</Text>
              <Text style={styles.email}>{email}</Text>
              <View style={styles.cityRow}>
                <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.7)" />
                <Text style={styles.cityText}>{city}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="pencil-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Réservations</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>Avis laissés</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Favoris</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reservations' && styles.tabActive]}
            onPress={() => setActiveTab('reservations')}
          >
            <Ionicons
              name="calendar-outline"
              size={16}
              color={activeTab === 'reservations' ? Colors.primary : Colors.textSecondary}
            />
            <Text style={[styles.tabText, activeTab === 'reservations' && styles.tabTextActive]}>
              Réservations
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'compte' && styles.tabActive]}
            onPress={() => setActiveTab('compte')}
          >
            <Ionicons
              name="person-outline"
              size={16}
              color={activeTab === 'compte' ? Colors.primary : Colors.textSecondary}
            />
            <Text style={[styles.tabText, activeTab === 'compte' && styles.tabTextActive]}>
              Mon Compte
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'reservations' ? (
          <View style={styles.section}>
            {MOCK_BOOKINGS.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyEmoji}>📅</Text>
                <Text style={styles.emptyTitle}>Aucune réservation</Text>
                <Text style={styles.emptyText}>Vos réservations apparaîtront ici.</Text>
                <TouchableOpacity
                  style={styles.ctaBtn}
                  onPress={() => navigation.navigate('Accueil')}
                >
                  <Text style={styles.ctaBtnText}>Trouver un prestataire</Text>
                </TouchableOpacity>
              </View>
            ) : (
              MOCK_BOOKINGS.map((booking) => (
                <View key={booking.id} style={styles.bookingCard}>
                  <View style={styles.bookingHeader}>
                    <View style={styles.bookingIcon}>
                      <Ionicons name="construct-outline" size={20} color={Colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.bookingProvider}>{booking.providerName}</Text>
                      <Text style={styles.bookingService}>{booking.service}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: BOOKING_STATUS_COLORS[booking.status] + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: BOOKING_STATUS_COLORS[booking.status] },
                        ]}
                      >
                        {BOOKING_STATUS_LABELS[booking.status]}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.bookingMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="calendar-outline" size={13} color={Colors.textSecondary} />
                      <Text style={styles.metaText}>{booking.date}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
                      <Text style={styles.metaText}>{booking.time}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="cash-outline" size={13} color={Colors.textSecondary} />
                      <Text style={styles.metaText}>{booking.price}</Text>
                    </View>
                  </View>
                  {booking.status === 'termine' && (
                    <TouchableOpacity style={styles.reviewLink}>
                      <Ionicons name="star-outline" size={14} color={Colors.primary} />
                      <Text style={styles.reviewLinkText}>Laisser un avis</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}
          </View>
        ) : (
          <View style={styles.section}>
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.action}
                style={styles.menuItem}
                onPress={() => {
                  if (item.action !== 'Help') navigation.navigate(item.action as any);
                }}
              >
                <View style={styles.menuIconWrapper}>
                  <Ionicons name={item.icon as any} size={20} color={Colors.primary} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogOut}>
              <Ionicons name="log-out-outline" size={20} color={Colors.error} />
              <Text style={styles.logoutText}>Se déconnecter</Text>
            </TouchableOpacity>

            <Text style={styles.version}>AlloService v1.0.0</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  name: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 2,
  },
  email: {
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 4,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cityText: {
    fontSize: Typography.fontSize.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '800',
    color: '#fff',
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: Spacing.xs,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  section: {
    padding: Spacing.base,
  },
  bookingCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  bookingIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingProvider: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
  },
  bookingService: {
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
  bookingMeta: {
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
  empty: {
    alignItems: 'center',
    paddingTop: Spacing['3xl'],
  },
  emptyEmoji: { fontSize: 48, marginBottom: Spacing.base },
  emptyTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  ctaBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  ctaBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: Typography.fontSize.base,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.error + '12',
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginTop: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.error + '30',
  },
  logoutText: {
    fontSize: Typography.fontSize.base,
    color: Colors.error,
    fontWeight: '700',
  },
  version: {
    textAlign: 'center',
    fontSize: Typography.fontSize.xs,
    color: Colors.textLight,
    marginTop: Spacing.xl,
  },
});
