import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { Colors, Spacing, Typography, BorderRadius, Shadow } from '../../constants/theme';
import { BOOKING_STATUS_COLORS, BOOKING_STATUS_LABELS } from '../../constants/data';

const AVATAR_PLACEHOLDER = 'https://ui-avatars.com/api/?name=';

const MOCK_REQUESTS = [
  {
    id: 'r1',
    clientName: 'Amina Bello',
    service: 'Ménage',
    date: '22/05/2026',
    time: '08:00',
    address: 'Quartier Bastos, Yaoundé',
    status: 'en_attente',
  },
  {
    id: 'r2',
    clientName: 'François Mballa',
    service: 'Ménage',
    date: '19/05/2026',
    time: '10:00',
    address: 'Bonapriso, Douala',
    status: 'confirme',
  },
  {
    id: 'r3',
    clientName: 'Grace Eto\'o',
    service: 'Ménage',
    date: '15/05/2026',
    time: '09:00',
    address: 'Akwa, Douala',
    status: 'termine',
  },
];

type TabKey = 'demandes' | 'gains' | 'profil';

export default function ProviderDashboardScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { userProfile, user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('demandes');

  const displayName = userProfile?.name || user?.displayName || 'Prestataire';
  const avatarUri = {
    uri: `${AVATAR_PLACEHOLDER}${encodeURIComponent(displayName)}&background=F4A823&color=fff&size=200`,
  };

  function renderTabContent() {
    switch (activeTab) {
      case 'demandes':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Demandes de réservation</Text>
            {MOCK_REQUESTS.map((req) => (
              <View key={req.id} style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <View style={styles.requestAvatar}>
                    <Text style={styles.requestAvatarText}>{req.clientName[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.clientName}>{req.clientName}</Text>
                    <Text style={styles.requestService}>{req.service}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: BOOKING_STATUS_COLORS[req.status] + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: BOOKING_STATUS_COLORS[req.status] },
                      ]}
                    >
                      {BOOKING_STATUS_LABELS[req.status]}
                    </Text>
                  </View>
                </View>
                <View style={styles.requestMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={13} color={Colors.textSecondary} />
                    <Text style={styles.metaText}>{req.date}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
                    <Text style={styles.metaText}>{req.time}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
                    <Text style={styles.metaText} numberOfLines={1}>{req.address}</Text>
                  </View>
                </View>
                {req.status === 'en_attente' && (
                  <View style={styles.requestActions}>
                    <TouchableOpacity style={styles.rejectBtn}>
                      <Ionicons name="close-circle-outline" size={16} color={Colors.error} />
                      <Text style={styles.rejectText}>Refuser</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.acceptBtn}>
                      <LinearGradient colors={['#1B6B3A', '#2D9A57']} style={styles.acceptGradient}>
                        <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
                        <Text style={styles.acceptText}>Accepter</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        );

      case 'gains':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Mes Gains</Text>
            <View style={styles.gainsCard}>
              <LinearGradient colors={['#1B4332', '#2D9A57']} style={styles.gainsGradient}>
                <Text style={styles.gainsLabel}>Gains ce mois</Text>
                <Text style={styles.gainsAmount}>75 000 FCFA</Text>
                <Text style={styles.gainsNote}>15 interventions terminées</Text>
              </LinearGradient>
            </View>
            <View style={styles.gainsPeriods}>
              {[
                { label: 'Cette semaine', amount: '15 000 FCFA', count: '3 interventions' },
                { label: 'Mois précédent', amount: '60 000 FCFA', count: '12 interventions' },
                { label: 'Total cumulé', amount: '320 000 FCFA', count: '64 interventions' },
              ].map((p) => (
                <View key={p.label} style={styles.gainsPeriodCard}>
                  <Text style={styles.gainsPeriodLabel}>{p.label}</Text>
                  <Text style={styles.gainsPeriodAmount}>{p.amount}</Text>
                  <Text style={styles.gainsPeriodCount}>{p.count}</Text>
                </View>
              ))}
            </View>
            <View style={styles.comingSoonBanner}>
              <Ionicons name="construct-outline" size={20} color={Colors.secondary} />
              <Text style={styles.comingSoonText}>
                Le retrait de gains sera disponible prochainement.
              </Text>
            </View>
          </View>
        );

      case 'profil':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Mon Profil Prestataire</Text>
            <View style={styles.profileMenuItems}>
              {[
                { icon: 'person-outline', label: 'Modifier mes informations' },
                { icon: 'briefcase-outline', label: 'Mes services proposés' },
                { icon: 'images-outline', label: 'Mes photos' },
                { icon: 'time-outline', label: 'Mes disponibilités' },
                { icon: 'star-outline', label: 'Mes avis reçus' },
                { icon: 'toggle-outline', label: 'Statut : Disponible' },
              ].map((item) => (
                <TouchableOpacity key={item.label} style={styles.menuItem}>
                  <View style={styles.menuIconWrapper}>
                    <Ionicons name={item.icon as any} size={18} color={Colors.secondary} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.comingSoonBanner}>
              <Ionicons name="rocket-outline" size={20} color={Colors.secondary} />
              <Text style={styles.comingSoonText}>
                La gestion complète du profil prestataire arrive bientôt !
              </Text>
            </View>
          </View>
        );
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Spacing['4xl'] }}>
        {/* Header */}
        <LinearGradient
          colors={['#1B4332', '#134D2A']}
          style={[styles.header, { paddingTop: insets.top + Spacing.md }]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tableau de bord</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>

        {/* Provider banner */}
        <View style={styles.providerBanner}>
          <Image source={avatarUri} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.providerName}>{displayName}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={Colors.secondary} />
              <Text style={styles.ratingText}>4.8 · 47 avis</Text>
            </View>
            <View style={styles.availableRow}>
              <View style={styles.availableDot} />
              <Text style={styles.availableText}>Disponible</Text>
            </View>
          </View>
          <View style={styles.notifBadge}>
            <Ionicons name="notifications-outline" size={20} color={Colors.text} />
            <View style={styles.notifDot} />
          </View>
        </View>

        {/* Quick stats */}
        <View style={styles.quickStats}>
          {[
            { icon: 'calendar-outline', value: '3', label: 'Demandes', color: Colors.primary },
            { icon: 'checkmark-circle-outline', value: '1', label: 'Confirmées', color: Colors.success },
            { icon: 'star-outline', value: '4.8', label: 'Note', color: Colors.secondary },
            { icon: 'cash-outline', value: '75k', label: 'FCFA', color: Colors.accent },
          ].map((stat) => (
            <View key={stat.label} style={styles.quickStatItem}>
              <View style={[styles.quickStatIcon, { backgroundColor: stat.color + '18' }]}>
                <Ionicons name={stat.icon as any} size={18} color={stat.color} />
              </View>
              <Text style={[styles.quickStatValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.quickStatLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {([
            { key: 'demandes', label: 'Demandes', icon: 'clipboard-outline' },
            { key: 'gains', label: 'Gains', icon: 'wallet-outline' },
            { key: 'profil', label: 'Profil', icon: 'person-outline' },
          ] as { key: TabKey; label: string; icon: string }[]).map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Ionicons
                name={tab.icon as any}
                size={16}
                color={activeTab === tab.key ? Colors.primary : Colors.textSecondary}
              />
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderTabContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  providerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  providerName: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  ratingText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  availableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  availableDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  availableText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.success,
    fontWeight: '600',
  },
  notifBadge: {
    position: 'relative',
    padding: Spacing.sm,
  },
  notifDot: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    gap: Spacing.sm,
  },
  quickStatItem: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    alignItems: 'center',
    ...Shadow.sm,
  },
  quickStatIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  quickStatValue: {
    fontSize: Typography.fontSize.md,
    fontWeight: '800',
  },
  quickStatLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
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
    gap: 4,
    paddingVertical: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  tabContent: {
    padding: Spacing.base,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.base,
  },
  requestCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  requestAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestAvatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: Typography.fontSize.base,
  },
  clientName: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
  },
  requestService: {
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
  requestMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
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
  requestActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: Colors.error + '50',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.error + '08',
  },
  rejectText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.error,
    fontWeight: '600',
  },
  acceptBtn: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  acceptGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: Spacing.md,
  },
  acceptText: {
    fontSize: Typography.fontSize.sm,
    color: '#fff',
    fontWeight: '700',
  },
  gainsCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.base,
  },
  gainsGradient: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  gainsLabel: {
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: Spacing.sm,
  },
  gainsAmount: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
  },
  gainsNote: {
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255,255,255,0.75)',
  },
  gainsPeriods: {
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  gainsPeriodCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadow.sm,
  },
  gainsPeriodLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  gainsPeriodAmount: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.primary,
  },
  gainsPeriodCount: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginLeft: Spacing.sm,
  },
  comingSoonBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.secondary + '15',
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.secondary + '30',
    marginTop: Spacing.sm,
  },
  comingSoonText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  profileMenuItems: {
    marginBottom: Spacing.base,
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
    backgroundColor: Colors.secondary + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    fontWeight: '500',
  },
});
