import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useReviews } from '../../hooks/useReviews';
import RatingInput from '../../components/common/RatingInput';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Colors, Spacing, Typography, BorderRadius, Shadow } from '../../constants/theme';
import { buildAvatarUrl } from '../../utils/formatters';
import { Provider } from '../../types';

type Params = { provider: Provider; bookingId?: string };

export default function WriteReviewScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: Params }, 'params'>>();
  const { provider, bookingId } = route.params;
  const { user, userProfile } = useAuth();
  const { addReview } = useReviews(provider.id);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (rating === 0) {
      Alert.alert('Note requise', 'Veuillez attribuer une note avant de soumettre votre avis.');
      return;
    }
    if (comment.trim().length < 10) {
      Alert.alert('Commentaire trop court', 'Veuillez écrire au moins 10 caractères.');
      return;
    }

    setLoading(true);
    try {
      await addReview({
        userId: user?.uid ?? 'anonymous',
        userName: userProfile?.name ?? user?.displayName ?? 'Anonyme',
        userAvatar: undefined,
        providerId: provider.id,
        rating,
        comment: comment.trim(),
      });
      Alert.alert(
        'Merci pour votre avis !',
        'Votre évaluation aide la communauté AlloService.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch {
      Alert.alert('Erreur', 'Impossible de soumettre votre avis. Réessayez.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="close" size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Laisser un avis</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Provider summary */}
          <View style={styles.providerCard}>
            <Image
              source={{ uri: buildAvatarUrl(provider.name) }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.providerName}>{provider.name}</Text>
              <Text style={styles.providerCategory}>{provider.category}</Text>
            </View>
          </View>

          {/* Rating */}
          <View style={styles.ratingSection}>
            <Text style={styles.ratingPrompt}>Comment évaluez-vous ce prestataire ?</Text>
            <RatingInput value={rating} onChange={setRating} size={44} />
          </View>

          {/* Comment */}
          <View style={styles.commentSection}>
            <Text style={styles.commentLabel}>Votre commentaire</Text>
            <Input
              placeholder="Partagez votre expérience avec ce prestataire..."
              value={comment}
              onChangeText={setComment}
              multiline
              style={styles.commentInput}
            />
            <Text style={styles.charCount}>{comment.length}/500</Text>
          </View>

          {/* Tips */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>Conseils pour un bon avis</Text>
            {[
              'Décrivez la qualité du travail réalisé',
              'Mentionnez la ponctualité et le professionnalisme',
              'Indiquez si vous recommandez ce prestataire',
            ].map((tip) => (
              <View key={tip} style={styles.tipRow}>
                <Ionicons name="checkmark-circle-outline" size={14} color={Colors.primary} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

          <Button
            label="Publier mon avis"
            onPress={handleSubmit}
            loading={loading}
            disabled={rating === 0}
            fullWidth
            size="lg"
            style={styles.submitBtn}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
  title: {
    flex: 1,
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  content: { padding: Spacing.base, paddingBottom: Spacing['4xl'] },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
    ...Shadow.sm,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.border },
  providerName: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: Colors.text },
  providerCategory: { fontSize: Typography.fontSize.sm, color: Colors.primary, fontWeight: '500' },
  ratingSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.base,
    ...Shadow.sm,
  },
  ratingPrompt: { fontSize: Typography.fontSize.base, fontWeight: '600', color: Colors.text, textAlign: 'center' },
  commentSection: { marginBottom: Spacing.xl },
  commentLabel: { fontSize: Typography.fontSize.sm, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  commentInput: { minHeight: 120, textAlignVertical: 'top' },
  charCount: { fontSize: Typography.fontSize.xs, color: Colors.textLight, textAlign: 'right', marginTop: -Spacing.sm },
  tipsCard: {
    backgroundColor: Colors.primary + '10',
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  tipsTitle: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.primary, marginBottom: 4 },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  tipText: { flex: 1, fontSize: Typography.fontSize.xs, color: Colors.textSecondary, lineHeight: 18 },
  submitBtn: { marginTop: Spacing.sm },
});
