import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import ServiceCategoryCard from '../../components/cards/ServiceCategoryCard';
import ProviderCard from '../../components/cards/ProviderCard';
import { SERVICE_CATEGORIES, MOCK_PROVIDERS, CITIES } from '../../constants/data';
import { Colors, Spacing, Typography, BorderRadius, Shadow } from '../../constants/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { userProfile, user } = useAuth();
  const { unreadCount } = useNotifications();
  const [selectedCity, setSelectedCity] = useState('Douala');
  const [showCityModal, setShowCityModal] = useState(false);

  const displayName = userProfile?.name || user?.displayName || 'là';
  const firstName = displayName.split(' ')[0];

  const featuredProviders = MOCK_PROVIDERS.filter((p) => p.verified && p.available).slice(0, 4);

  const filteredCategories = SERVICE_CATEGORIES;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Spacing['3xl'] }}
      >
        {/* Header gradient */}
        <LinearGradient
          colors={['#1B4332', '#1B6B3A', '#2D9A57']}
          style={[styles.header, { paddingTop: insets.top + Spacing.md }]}
        >
          {/* Top row */}
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Bonjour, {firstName} 👋</Text>
              <TouchableOpacity style={styles.locationRow} onPress={() => setShowCityModal(true)}>
                <Ionicons name="location" size={14} color="rgba(255,255,255,0.85)" />
                <Text style={styles.locationText}>{selectedCity}</Text>
                <Ionicons name="chevron-down" size={14} color="rgba(255,255,255,0.85)" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={22} color="#fff" />
              {unreadCount > 0 && <View style={styles.notifBadge} />}
            </TouchableOpacity>
          </View>

          {/* Search bar — tapping opens full Search screen */}
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => navigation.navigate('Search')}
            activeOpacity={0.9}
          >
            <Ionicons name="search" size={18} color={Colors.textSecondary} />
            <Text style={styles.searchPlaceholder}>Rechercher un service ou prestataire...</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Banner */}
        <View style={styles.bannerWrapper}>
          <LinearGradient colors={['#F4A823', '#E85D26']} style={styles.banner}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerEmoji}>🎉</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerTitle}>Nouveau prestataire ?</Text>
                <Text style={styles.bannerSub}>Inscrivez-vous gratuitement et commencez à recevoir des clients !</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Service categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nos Services</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoriesGrid}>
            {filteredCategories.map((cat) => (
              <ServiceCategoryCard
                key={cat.id}
                category={cat}
                onPress={() =>
                  navigation.navigate('ProviderListing', {
                    categoryId: cat.id,
                    categoryName: cat.name,
                  })
                }
              />
            ))}
          </View>
        </View>

        {/* Featured providers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Prestataires vedettes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProviderListing', { categoryId: '', categoryName: 'Tous' })}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          {featuredProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onPress={() => navigation.navigate('ProviderProfile', { providerId: provider.id })}
            />
          ))}
        </View>

        {/* Countries section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disponible dans</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: Spacing.md }}>
            {[
              { flag: '🇨🇲', name: 'Cameroun' },
              { flag: '🇨🇮', name: "Côte d'Ivoire" },
              { flag: '🇸🇳', name: 'Sénégal' },
              { flag: '🇨🇬', name: 'Congo' },
            ].map((c) => (
              <View key={c.name} style={styles.countryChip}>
                <Text style={{ fontSize: 22 }}>{c.flag}</Text>
                <Text style={styles.countryName}>{c.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* City selection modal */}
      <Modal visible={showCityModal} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowCityModal(false)} />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Choisir une ville</Text>
          <ScrollView>
            {CITIES.map((c) => (
              <TouchableOpacity
                key={c.name}
                style={[styles.cityItem, selectedCity === c.name && styles.cityItemActive]}
                onPress={() => { setSelectedCity(c.name); setShowCityModal(false); }}
              >
                <Text style={[styles.cityItemText, selectedCity === c.name && styles.cityItemTextActive]}>
                  {c.name}
                </Text>
                <Text style={styles.cityCountry}>{c.country}</Text>
                {selectedCity === c.name && (
                  <Ionicons name="checkmark" size={18} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing['2xl'],
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '800',
    color: '#fff',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.error,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.textLight,
  },
  bannerWrapper: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
  },
  banner: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  bannerEmoji: { fontSize: 32 },
  bannerTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  bannerSub: {
    fontSize: Typography.fontSize.xs,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 17,
  },
  section: {
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    color: Colors.text,
  },
  seeAll: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  countryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    marginRight: Spacing.md,
    ...Shadow.sm,
  },
  countryName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    maxHeight: '60%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.base,
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.base,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  cityItemActive: {
    backgroundColor: Colors.primary + '08',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
  },
  cityItemText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    fontWeight: '500',
  },
  cityItemTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  cityCountry: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
});
