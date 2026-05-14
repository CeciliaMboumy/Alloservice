import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MOCK_PROVIDERS } from '../../constants/data';
import { useFavorites } from '../../context/FavoritesContext';
import { openWhatsApp, callPhone } from '../../utils/whatsapp';
import { Colors, Spacing, Typography, BorderRadius, Shadow } from '../../constants/theme';
import StarRating from '../../components/common/StarRating';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 280;
const AVATAR_PLACEHOLDER = 'https://ui-avatars.com/api/?name=';

type Params = { providerId: string };

const MOCK_REVIEWS = [
  {
    id: 'r1',
    userName: 'Pascaline A.',
    rating: 5,
    comment: 'Excellent service ! Très propre et ponctuelle. Je recommande vivement.',
    date: 'Il y a 2 jours',
  },
  {
    id: 'r2',
    userName: 'Bertrand K.',
    rating: 4,
    comment: 'Bonne prestataire, travail soigné. Un peu de retard au début mais ça s\'est arrangé.',
    date: 'Il y a 1 semaine',
  },
  {
    id: 'r3',
    userName: 'Cécile M.',
    rating: 5,
    comment: 'Parfait ! Ma maison est impeccable. Je la rappelle la semaine prochaine.',
    date: 'Il y a 2 semaines',
  },
];

export default function ProviderProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: Params }, 'params'>>();
  const { providerId } = route.params;
  const [activeTab, setActiveTab] = useState<'infos' | 'avis'>('infos');
  const { isFavorite, toggleFavorite } = useFavorites();

  const provider = MOCK_PROVIDERS.find((p) => p.id === providerId);

  if (!provider) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Prestataire introuvable</Text>
        <Button label="Retour" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const avatarUri = provider.avatar
    ? { uri: provider.avatar }
    : { uri: `${AVATAR_PLACEHOLDER}${encodeURIComponent(provider.name)}&background=1B6B3A&color=fff&size=400` };

  // Contact helpers imported from utils/whatsapp.ts

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero image / avatar */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={['#1B4332', '#1B6B3A', '#2D9A57']}
            style={styles.heroBg}
          />
          <Image source={avatarUri} style={styles.heroAvatar} />
          {provider.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
              <Text style={styles.verifiedText}>Vérifié</Text>
            </View>
          )}
        </View>

        {/* Back button overlay */}
        <TouchableOpacity
          style={[styles.backOverlay, { top: insets.top + Spacing.sm }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        {/* Favorite button overlay */}
        <TouchableOpacity
          style={[styles.favoriteOverlay, { top: insets.top + Spacing.sm }]}
          onPress={() => provider && toggleFavorite(provider)}
        >
          <Ionicons
            name={provider && isFavorite(provider.id) ? 'heart' : 'heart-outline'}
            size={22}
            color={provider && isFavorite(provider.id) ? '#FF4D6D' : '#fff'}
          />
        </TouchableOpacity>

        {/* Profile card */}
        <View style={styles.profileCard}>
          {/* Name & category */}
          <Text style={styles.name}>{provider.name}</Text>
          <Text style={styles.category}>{provider.category} · {provider.city}, {provider.country}</Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <StarRating rating={provider.rating} size={16} />
              <Text style={styles.statValue}>{provider.rating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>({provider.reviewCount} avis)</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={16} color={Colors.primary} />
              <Text style={styles.statValue}>{provider.experience} ans</Text>
              <Text style={styles.statLabel}>d'expérience</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={[styles.statusDot, { backgroundColor: provider.available ? Colors.success : Colors.error }]} />
              <Text style={[styles.statValue, { color: provider.available ? Colors.success : Colors.error }]}>
                {provider.available ? 'Disponible' : 'Indisponible'}
              </Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tarif :</Text>
            <Text style={styles.price}>
              {provider.price.toLocaleString()} {provider.priceUnit}
            </Text>
          </View>

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.whatsappBtn} onPress={() => openWhatsApp(provider.whatsapp, provider.name)} activeOpacity={0.85}>
              <Ionicons name="logo-whatsapp" size={20} color="#fff" />
              <Text style={styles.whatsappText}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.callBtn} onPress={() => callPhone(provider.phone)} activeOpacity={0.85}>
              <Ionicons name="call-outline" size={20} color={Colors.primary} />
              <Text style={styles.callText}>Appeler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bookBtn}
              onPress={() => navigation.navigate('BookingRequest', { provider })}
              activeOpacity={0.85}
            >
              <LinearGradient colors={['#1B6B3A', '#2D9A57']} style={styles.bookGradient}>
                <Ionicons name="calendar-outline" size={18} color="#fff" />
                <Text style={styles.bookText}>Réserver</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'infos' && styles.tabActive]}
              onPress={() => setActiveTab('infos')}
            >
              <Text style={[styles.tabText, activeTab === 'infos' && styles.tabTextActive]}>
                Infos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'avis' && styles.tabActive]}
              onPress={() => setActiveTab('avis')}
            >
              <Text style={[styles.tabText, activeTab === 'avis' && styles.tabTextActive]}>
                Avis ({provider.reviewCount})
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'infos' ? (
            <>
              {/* Bio */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>À propos</Text>
                <Text style={styles.bio}>{provider.bio}</Text>
              </View>

              {/* Skills */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Compétences</Text>
                <View style={styles.skillsRow}>
                  {provider.skills.map((skill) => (
                    <Badge key={skill} label={skill} color={Colors.primary + '18'} textColor={Colors.primary} />
                  ))}
                </View>
              </View>

              {/* Location */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Zone d'intervention</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={16} color={Colors.primary} />
                  <Text style={styles.locationText}>
                    {provider.city}, {provider.country}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.section}>
              {MOCK_REVIEWS.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewAvatar}>
                      <Text style={styles.reviewAvatarText}>{review.userName[0]}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reviewName}>{review.userName}</Text>
                      <View style={styles.reviewRatingRow}>
                        <StarRating rating={review.rating} size={12} />
                        <Text style={styles.reviewDate}>{review.date}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    height: HEADER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: Spacing.xl,
  },
  heroBg: {
    ...StyleSheet.absoluteFillObject,
  },
  heroAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#fff',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginTop: Spacing.sm,
    ...Shadow.sm,
  },
  verifiedText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.primary,
  },
  backOverlay: {
    position: 'absolute',
    left: Spacing.base,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteOverlay: {
    position: 'absolute',
    right: Spacing.base,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    marginTop: -Spacing.xl,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing['4xl'],
    ...Shadow.lg,
  },
  name: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  category: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.base,
  },
  statItem: {
    alignItems: 'center',
    gap: 3,
    flex: 1,
  },
  statValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  priceLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  price: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '800',
    color: Colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  whatsappBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.whatsapp,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
  },
  whatsappText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: Typography.fontSize.sm,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  callText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: Typography.fontSize.sm,
  },
  bookBtn: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  bookGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
  },
  bookText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: Typography.fontSize.sm,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.base,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  bio: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  locationText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  reviewCard: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: Typography.fontSize.base,
  },
  reviewName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  reviewRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  reviewDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  reviewComment: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.base,
  },
  notFoundText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textSecondary,
  },
});
