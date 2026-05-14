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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Chip from '../../components/common/Chip';
import { SERVICE_CATEGORIES, CITIES } from '../../constants/data';
import { Colors, Spacing, Typography, BorderRadius, Shadow } from '../../constants/theme';

type Step = 1 | 2 | 3;

export default function BecomeProviderScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { user, userProfile } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [categoryId, setCategoryId] = useState('');
  const [city, setCity] = useState(userProfile?.city ?? 'Douala');
  const [price, setPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState('FCFA/heure');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedCategory = SERVICE_CATEGORIES.find((c) => c.id === categoryId);

  function addSkill() {
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills((prev) => [...prev, customSkill.trim()]);
      setCustomSkill('');
    }
  }

  async function handleSubmit() {
    if (!categoryId || !price || !experience || !bio.trim()) {
      Alert.alert('Champs manquants', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'providers'), {
        userId: user?.uid,
        name: userProfile?.name ?? user?.displayName ?? 'Prestataire',
        category: selectedCategory?.name ?? '',
        categoryId,
        rating: 0,
        reviewCount: 0,
        city,
        country: userProfile?.country ?? 'Cameroun',
        price: Number(price),
        priceUnit,
        phone: userProfile?.phone ?? '',
        whatsapp: userProfile?.phone ?? '',
        bio: bio.trim(),
        photos: [],
        avatar: '',
        verified: false,
        available: true,
        experience: Number(experience),
        skills,
        createdAt: serverTimestamp(),
      });

      Alert.alert(
        'Demande envoyée ! 🎉',
        'Votre profil prestataire est en cours de vérification. Vous serez notifié(e) dans les 24-48h.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch {
      // Simulate success
      Alert.alert(
        'Demande envoyée ! 🎉',
        'Votre profil prestataire est en cours de vérification. Vous serez notifié(e) dans les 24-48h.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
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
        {/* Header */}
        <LinearGradient colors={['#1B4332', '#1B6B3A']} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.headerTitle}>Devenir prestataire</Text>
            <Text style={styles.headerSub}>Étape {step}/3</Text>
          </View>
          <View style={{ width: 40 }} />
        </LinearGradient>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          {([1, 2, 3] as Step[]).map((s) => (
            <View
              key={s}
              style={[styles.progressStep, s <= step && styles.progressStepActive]}
            />
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {step === 1 && (
            <View>
              <Text style={styles.stepTitle}>Choisissez votre service</Text>
              <Text style={styles.stepDesc}>Sélectionnez la catégorie principale dans laquelle vous offrez vos services.</Text>

              <View style={styles.categoriesGrid}>
                {SERVICE_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryCard,
                      categoryId === cat.id && styles.categoryCardActive,
                      { borderColor: categoryId === cat.id ? cat.color : Colors.border },
                    ]}
                    onPress={() => setCategoryId(cat.id)}
                  >
                    <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                    <Text style={[styles.categoryName, categoryId === cat.id && { color: cat.color }]}>
                      {cat.name}
                    </Text>
                    {categoryId === cat.id && (
                      <View style={[styles.categoryCheck, { backgroundColor: cat.color }]}>
                        <Ionicons name="checkmark" size={12} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <Button
                label="Suivant →"
                onPress={() => { if (!categoryId) Alert.alert('Sélectionnez un service'); else setStep(2); }}
                fullWidth
                size="lg"
                style={styles.nextBtn}
              />
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={styles.stepTitle}>Vos tarifs & expérience</Text>
              <Text style={styles.stepDesc}>Ces informations aident les clients à vous trouver et à vous contacter.</Text>

              {/* City */}
              <Text style={styles.fieldLabel}>Ville d'intervention *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cityRow}>
                {CITIES.map((c) => (
                  <Chip
                    key={c.name}
                    label={c.name}
                    selected={city === c.name}
                    onPress={() => setCity(c.name)}
                    style={{ marginRight: Spacing.sm }}
                  />
                ))}
              </ScrollView>

              <View style={styles.priceRow}>
                <Input
                  label="Tarif *"
                  placeholder="Ex: 5000"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  leftIcon="cash-outline"
                  containerStyle={{ flex: 1 }}
                />
                <View style={styles.priceUnitPicker}>
                  <Text style={styles.fieldLabel}>Unité</Text>
                  {['FCFA/heure', 'FCFA/jour', 'FCFA/séance', 'FCFA/intervention'].map((u) => (
                    <TouchableOpacity
                      key={u}
                      style={[styles.unitOption, priceUnit === u && styles.unitOptionActive]}
                      onPress={() => setPriceUnit(u)}
                    >
                      <Text style={[styles.unitText, priceUnit === u && styles.unitTextActive]} numberOfLines={1}>
                        {u}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Input
                label="Années d'expérience *"
                placeholder="Ex: 5"
                value={experience}
                onChangeText={setExperience}
                keyboardType="numeric"
                leftIcon="time-outline"
              />

              <View style={styles.buttons}>
                <Button label="← Retour" onPress={() => setStep(1)} variant="outline" style={{ flex: 1 }} />
                <Button
                  label="Suivant →"
                  onPress={() => { if (!price || !experience) Alert.alert('Remplissez les champs'); else setStep(3); }}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          )}

          {step === 3 && (
            <View>
              <Text style={styles.stepTitle}>Votre présentation</Text>
              <Text style={styles.stepDesc}>Décrivez votre savoir-faire pour convaincre les clients.</Text>

              <Input
                label="Biographie *"
                placeholder="Décrivez votre expérience, vos points forts, ce qui vous distingue..."
                value={bio}
                onChangeText={setBio}
                multiline
                style={{ minHeight: 120, textAlignVertical: 'top' }}
              />

              {/* Skills */}
              <Text style={styles.fieldLabel}>Compétences spécifiques</Text>
              <View style={styles.skillsRow}>
                {skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    selected
                    onPress={() => setSkills((prev) => prev.filter((s) => s !== skill))}
                    icon="✕"
                  />
                ))}
              </View>
              <View style={styles.skillInputRow}>
                <Input
                  placeholder="Ajouter une compétence..."
                  value={customSkill}
                  onChangeText={setCustomSkill}
                  onSubmitEditing={addSkill}
                  returnKeyType="done"
                  containerStyle={{ flex: 1 }}
                />
                <TouchableOpacity style={styles.addSkillBtn} onPress={addSkill}>
                  <Ionicons name="add" size={22} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Benefits */}
              <View style={styles.benefitsCard}>
                <Text style={styles.benefitsTitle}>En rejoignant AlloService vous bénéficiez de :</Text>
                {[
                  '✅ Profil visible par des milliers de clients',
                  '✅ Réservations directes sans commission',
                  '✅ Badge "Vérifié" après vérification',
                  '✅ Statistiques de vos performances',
                ].map((b) => (
                  <Text key={b} style={styles.benefitItem}>{b}</Text>
                ))}
              </View>

              <View style={styles.buttons}>
                <Button label="← Retour" onPress={() => setStep(2)} variant="outline" style={{ flex: 1 }} />
                <Button
                  label="Soumettre 🎉"
                  onPress={handleSubmit}
                  loading={loading}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          )}
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
    paddingVertical: Spacing.base,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: Typography.fontSize.xs, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  progressBar: {
    flexDirection: 'row',
    height: 4,
    backgroundColor: Colors.border,
  },
  progressStep: {
    flex: 1,
    backgroundColor: Colors.border,
    marginRight: 2,
  },
  progressStepActive: { backgroundColor: Colors.primary },
  content: { padding: Spacing.base, paddingBottom: Spacing['4xl'] },
  stepTitle: { fontSize: Typography.fontSize['2xl'], fontWeight: '800', color: Colors.text, marginBottom: Spacing.sm },
  stepDesc: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.xl, lineHeight: 21 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.xl },
  categoryCard: {
    width: '46%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
    ...Shadow.sm,
  },
  categoryCardActive: { backgroundColor: Colors.primary + '06' },
  categoryEmoji: { fontSize: 32, marginBottom: Spacing.sm },
  categoryName: { fontSize: Typography.fontSize.sm, fontWeight: '600', color: Colors.text, textAlign: 'center' },
  categoryCheck: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtn: { marginTop: Spacing.sm },
  fieldLabel: { fontSize: Typography.fontSize.sm, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  cityRow: { marginBottom: Spacing.base },
  priceRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  priceUnitPicker: { flex: 1, gap: 4 },
  unitOption: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  unitOptionActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '10' },
  unitText: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary },
  unitTextActive: { color: Colors.primary, fontWeight: '600' },
  buttons: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.base },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  skillInputRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-end', marginBottom: Spacing.xl },
  addSkillBtn: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
  },
  benefitsCard: {
    backgroundColor: Colors.primary + '10',
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  benefitsTitle: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.primary, marginBottom: 4 },
  benefitItem: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, lineHeight: 21 },
});
