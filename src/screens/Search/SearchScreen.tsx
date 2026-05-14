import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSearch, SearchResult } from '../../hooks/useSearch';
import SearchBar from '../../components/common/SearchBar';
import { SERVICE_CATEGORIES } from '../../constants/data';
import { Colors, Spacing, Typography, BorderRadius, Shadow } from '../../constants/theme';
import { Provider, ServiceCategory } from '../../types';
import { buildAvatarUrl } from '../../utils/formatters';

const POPULAR_SEARCHES = ['Ménage', 'Coiffure', 'Plomberie', 'Maquillage', 'Électricité', 'Chauffeur'];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { query, setQuery, results, recentSearches, addRecentSearch, clearRecentSearches } = useSearch();

  function handleSelectResult(result: SearchResult) {
    addRecentSearch(query);
    if (result.type === 'provider') {
      navigation.navigate('ProviderProfile', { providerId: result.data.id });
    } else {
      navigation.navigate('ProviderListing', {
        categoryId: result.data.id,
        categoryName: result.data.name,
      });
    }
  }

  function handleQuickSearch(term: string) {
    setQuery(term);
  }

  function renderResult({ item }: { item: SearchResult }) {
    if (item.type === 'category') {
      const cat = item.data as ServiceCategory;
      return (
        <TouchableOpacity style={styles.resultRow} onPress={() => handleSelectResult(item)}>
          <View style={[styles.resultIcon, { backgroundColor: cat.color + '20' }]}>
            <Text style={{ fontSize: 20 }}>{cat.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.resultName}>{cat.name}</Text>
            <Text style={styles.resultSub}>{cat.description}</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>Catégorie</Text>
          </View>
        </TouchableOpacity>
      );
    }

    const provider = item.data as Provider;
    return (
      <TouchableOpacity style={styles.resultRow} onPress={() => handleSelectResult(item)}>
        <Image
          source={{ uri: buildAvatarUrl(provider.name) }}
          style={styles.resultAvatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.resultName}>{provider.name}</Text>
          <Text style={styles.resultSub}>
            {provider.category} · {provider.city}
          </Text>
        </View>
        <View style={styles.ratingPill}>
          <Ionicons name="star" size={11} color={Colors.star} />
          <Text style={styles.ratingText}>{provider.rating.toFixed(1)}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  const showResults = query.length >= 2;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
          placeholder="Rechercher un service, prestataire..."
          autoFocus
          style={{ flex: 1 }}
        />
      </View>

      <FlatList
        data={showResults ? results : []}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderResult}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          !showResults ? (
            <View>
              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionRow}>
                    <Text style={styles.sectionTitle}>Recherches récentes</Text>
                    <TouchableOpacity onPress={clearRecentSearches}>
                      <Text style={styles.clearText}>Effacer</Text>
                    </TouchableOpacity>
                  </View>
                  {recentSearches.map((term) => (
                    <TouchableOpacity
                      key={term}
                      style={styles.recentRow}
                      onPress={() => handleQuickSearch(term)}
                    >
                      <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
                      <Text style={styles.recentText}>{term}</Text>
                      <TouchableOpacity onPress={() => clearRecentSearches()}>
                        <Ionicons name="arrow-up-outline" size={14} color={Colors.textLight} style={{ transform: [{ rotate: '45deg' }] }} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Popular searches */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recherches populaires</Text>
                <View style={styles.popularGrid}>
                  {POPULAR_SEARCHES.map((term) => (
                    <TouchableOpacity
                      key={term}
                      style={styles.popularChip}
                      onPress={() => handleQuickSearch(term)}
                    >
                      <Ionicons name="trending-up-outline" size={13} color={Colors.primary} />
                      <Text style={styles.popularText}>{term}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Browse categories */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Parcourir par catégorie</Text>
                {SERVICE_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.catRow}
                    onPress={() =>
                      navigation.navigate('ProviderListing', {
                        categoryId: cat.id,
                        categoryName: cat.name,
                      })
                    }
                  >
                    <View style={[styles.catIconWrapper, { backgroundColor: cat.color + '20' }]}>
                      <Text style={{ fontSize: 22 }}>{cat.icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.catName}>{cat.name}</Text>
                      <Text style={styles.catDesc} numberOfLines={1}>{cat.description}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : results.length === 0 ? (
            <View style={styles.noResults}>
              <Text style={styles.noResultsEmoji}>🔍</Text>
              <Text style={styles.noResultsTitle}>Aucun résultat pour « {query} »</Text>
              <Text style={styles.noResultsSub}>Essayez un autre terme ou parcourez les catégories.</Text>
            </View>
          ) : (
            <Text style={styles.resultCount}>
              {results.length} résultat{results.length > 1 ? 's' : ''} pour « {query} »
            </Text>
          )
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  listContent: { paddingBottom: Spacing['3xl'] },
  section: { padding: Spacing.base, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.text },
  clearText: { fontSize: Typography.fontSize.sm, color: Colors.primary, fontWeight: '500' },
  recentRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  recentText: { flex: 1, fontSize: Typography.fontSize.base, color: Colors.text },
  popularGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  popularChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primary + '12',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
  },
  popularText: { fontSize: Typography.fontSize.sm, color: Colors.primary, fontWeight: '600' },
  catRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  catIconWrapper: {
    width: 44, height: 44, borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  catName: { fontSize: Typography.fontSize.base, fontWeight: '600', color: Colors.text },
  catDesc: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  resultRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  resultIcon: {
    width: 44, height: 44, borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  resultAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.border },
  resultName: { fontSize: Typography.fontSize.base, fontWeight: '600', color: Colors.text },
  resultSub: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  categoryBadge: {
    backgroundColor: Colors.secondary + '20',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 3,
  },
  categoryBadgeText: { fontSize: Typography.fontSize.xs, color: Colors.secondary, fontWeight: '600' },
  ratingPill: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    backgroundColor: Colors.star + '15',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 3,
  },
  ratingText: { fontSize: Typography.fontSize.xs, color: Colors.star, fontWeight: '700' },
  resultCount: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, padding: Spacing.base },
  noResults: { alignItems: 'center', paddingTop: Spacing['3xl'], paddingHorizontal: Spacing['2xl'] },
  noResultsEmoji: { fontSize: 48, marginBottom: Spacing.base },
  noResultsTitle: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: Colors.text, textAlign: 'center', marginBottom: Spacing.sm },
  noResultsSub: { fontSize: Typography.fontSize.base, color: Colors.textSecondary, textAlign: 'center' },
});
