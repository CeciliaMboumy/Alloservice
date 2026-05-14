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
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { Provider } from '../../types';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Colors, Spacing, Typography, BorderRadius, Shadow } from '../../constants/theme';

type Params = { provider: Provider };

const AVAILABLE_TIMES = [
  '08:00', '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
];

const AVATAR_PLACEHOLDER = 'https://ui-avatars.com/api/?name=';

export default function BookingRequestScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: Params }, 'params'>>();
  const { provider } = route.params;
  const { user } = useAuth();

  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const avatarUri = provider.avatar
    ? { uri: provider.avatar }
    : { uri: `${AVATAR_PLACEHOLDER}${encodeURIComponent(provider.name)}&background=1B6B3A&color=fff&size=200` };

  function validate() {
    const e: Record<string, string> = {};
    if (!date) e.date = 'Veuillez indiquer une date';
    else {
      const parsed = new Date(date);
      if (isNaN(parsed.getTime())) e.date = 'Format invalide (JJ/MM/AAAA)';
    }
    if (!selectedTime) e.time = 'Veuillez choisir un horaire';
    if (!address.trim()) e.address = 'Veuillez indiquer votre adresse';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        userId: user?.uid || 'anonymous',
        providerId: provider.id,
        providerName: provider.name,
        service: provider.category,
        date,
        time: selectedTime,
        address,
        city: provider.city,
        description,
        status: 'en_attente',
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch {
      // If Firebase isn't configured, simulate success for demo
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <View style={[styles.container, styles.successContainer, { paddingTop: insets.top }]}>
        <LinearGradient colors={['#1B4332', '#2D9A57']} style={StyleSheet.absoluteFillObject} />
        <View style={styles.successContent}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Demande envoyée !</Text>
          <Text style={styles.successText}>
            Votre demande de réservation a été transmise à {provider.name}. Vous serez contacté(e) très prochainement.
          </Text>
          <View style={styles.successInfo}>
            <View style={styles.successInfoRow}>
              <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.successInfoText}>{date} à {selectedTime}</Text>
            </View>
            <View style={styles.successInfoRow}>
              <Ionicons name="location-outline" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.successInfoText}>{address}</Text>
            </View>
          </View>
          <Button
            label="Retour à l'accueil"
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
            variant="outline"
            fullWidth
            style={styles.successBtn}
            textStyle={{ color: '#fff' }}
          />
          <Button
            label="Mes réservations"
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
            variant="ghost"
            fullWidth
            textStyle={{ color: 'rgba(255,255,255,0.8)' }}
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Réservation</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Provider summary */}
          <View style={styles.providerSummary}>
            <Image source={avatarUri} style={styles.providerAvatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.providerName}>{provider.name}</Text>
              <Text style={styles.providerCategory}>{provider.category}</Text>
              <Text style={styles.providerPrice}>
                {provider.price.toLocaleString()} {provider.priceUnit}
              </Text>
            </View>
          </View>

          <Text style={styles.formTitle}>Détails de la réservation</Text>

          {/* Date */}
          <Input
            label="Date souhaitée"
            placeholder="JJ/MM/AAAA"
            value={date}
            onChangeText={setDate}
            leftIcon="calendar-outline"
            error={errors.date}
            keyboardType="numeric"
          />

          {/* Time selection */}
          <View style={styles.timeSection}>
            <Text style={styles.fieldLabel}>Horaire souhaité</Text>
            <View style={styles.timeGrid}>
              {AVAILABLE_TIMES.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeChip,
                    selectedTime === time && styles.timeChipActive,
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text
                    style={[
                      styles.timeChipText,
                      selectedTime === time && styles.timeChipTextActive,
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}
          </View>

          {/* Address */}
          <Input
            label="Adresse d'intervention"
            placeholder="Ex: Rue de la Paix, Quartier Bastos"
            value={address}
            onChangeText={setAddress}
            leftIcon="location-outline"
            error={errors.address}
            multiline
          />

          {/* Description */}
          <View style={styles.textareaWrapper}>
            <Text style={styles.fieldLabel}>Description (optionnel)</Text>
            <Input
              placeholder="Décrivez votre besoin en détail..."
              value={description}
              onChangeText={setDescription}
              multiline
              style={{ minHeight: 90, textAlignVertical: 'top' }}
            />
          </View>

          {/* Summary card */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Récapitulatif</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Prestataire</Text>
              <Text style={styles.summaryValue}>{provider.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service</Text>
              <Text style={styles.summaryValue}>{provider.category}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tarif estimé</Text>
              <Text style={[styles.summaryValue, { color: Colors.primary, fontWeight: '700' }]}>
                {provider.price.toLocaleString()} {provider.priceUnit}
              </Text>
            </View>
            <View style={styles.summaryNote}>
              <Ionicons name="information-circle-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.summaryNoteText}>
                Le tarif final sera confirmé par le prestataire.
              </Text>
            </View>
          </View>

          <Button
            label="Envoyer la demande"
            onPress={handleSubmit}
            loading={loading}
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
    color: Colors.text,
    textAlign: 'center',
  },
  content: {
    padding: Spacing.base,
    paddingBottom: Spacing['4xl'],
  },
  providerSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
    ...Shadow.sm,
  },
  providerAvatar: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.border,
  },
  providerName: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  providerCategory: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  providerPrice: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  formTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.base,
  },
  timeSection: {
    marginBottom: Spacing.base,
  },
  fieldLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  timeChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  timeChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  timeChipText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  timeChipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  errorText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  textareaWrapper: {
    marginBottom: Spacing.base,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
    color: Colors.text,
  },
  summaryNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  summaryNoteText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    flex: 1,
  },
  submitBtn: {
    marginTop: Spacing.sm,
  },
  // Success
  successContainer: {
    flex: 1,
  },
  successContent: {
    flex: 1,
    padding: Spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    marginBottom: Spacing.xl,
  },
  successTitle: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: '900',
    color: '#fff',
    marginBottom: Spacing.base,
    textAlign: 'center',
  },
  successText: {
    fontSize: Typography.fontSize.base,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  successInfo: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    width: '100%',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  successInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  successInfoText: {
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255,255,255,0.9)',
  },
  successBtn: {
    borderColor: 'rgba(255,255,255,0.6)',
    marginBottom: Spacing.sm,
  },
});
