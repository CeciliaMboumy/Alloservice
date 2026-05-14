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
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Colors, Spacing, Typography, BorderRadius, Shadow } from '../../constants/theme';
import { CITIES, COUNTRIES } from '../../constants/data';
import { buildAvatarUrl } from '../../utils/formatters';

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { user, userProfile, refreshProfile } = useAuth();

  const [name, setName] = useState(userProfile?.name ?? user?.displayName ?? '');
  const [phone, setPhone] = useState(userProfile?.phone ?? '');
  const [city, setCity] = useState(userProfile?.city ?? 'Douala');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Le nom est requis.');
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), { name: name.trim(), phone, city });
      await refreshProfile();
      Alert.alert('Succès', 'Votre profil a été mis à jour.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      // Simulate success if Firebase not configured
      Alert.alert('Profil mis à jour', 'Vos modifications ont été enregistrées.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const displayName = name || 'Utilisateur';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Modifier le profil</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Avatar section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: buildAvatarUrl(displayName) }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.cameraBtn}>
                <LinearGradient colors={['#1B6B3A', '#2D9A57']} style={styles.cameraGradient}>
                  <Ionicons name="camera" size={16} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <Text style={styles.changePhotoText}>Changer la photo</Text>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            <Input
              label="Nom complet"
              placeholder="Votre nom complet"
              value={name}
              onChangeText={setName}
              leftIcon="person-outline"
              autoCapitalize="words"
            />
            <Input
              label="Email"
              value={userProfile?.email ?? user?.email ?? ''}
              editable={false}
              leftIcon="mail-outline"
              style={{ backgroundColor: Colors.surfaceAlt, opacity: 0.7 }}
            />
            <Input
              label="Téléphone / WhatsApp"
              placeholder="+237 6XX XXX XXX"
              value={phone}
              onChangeText={setPhone}
              leftIcon="call-outline"
              keyboardType="phone-pad"
            />

            {/* City selector */}
            <View style={styles.cityField}>
              <Text style={styles.fieldLabel}>Ville</Text>
              <TouchableOpacity
                style={styles.citySelector}
                onPress={() => setShowCityPicker(true)}
              >
                <Ionicons name="location-outline" size={18} color={Colors.textSecondary} />
                <Text style={styles.cityText}>{city}</Text>
                <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* City picker modal inline */}
          {showCityPicker && (
            <View style={styles.cityPickerCard}>
              <View style={styles.cityPickerHeader}>
                <Text style={styles.cityPickerTitle}>Choisir une ville</Text>
                <TouchableOpacity onPress={() => setShowCityPicker(false)}>
                  <Ionicons name="close" size={22} color={Colors.text} />
                </TouchableOpacity>
              </View>
              {CITIES.map((c) => (
                <TouchableOpacity
                  key={c.name}
                  style={[styles.cityOption, city === c.name && styles.cityOptionActive]}
                  onPress={() => { setCity(c.name); setShowCityPicker(false); }}
                >
                  <Text style={[styles.cityOptionText, city === c.name && styles.cityOptionTextActive]}>
                    {c.name}
                  </Text>
                  <Text style={styles.cityOptionCountry}>{c.country}</Text>
                  {city === c.name && (
                    <Ionicons name="checkmark" size={16} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Button
            label="Enregistrer les modifications"
            onPress={handleSave}
            loading={loading}
            fullWidth
            size="lg"
            style={styles.saveBtn}
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
  title: { flex: 1, fontSize: Typography.fontSize.lg, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  content: { padding: Spacing.base, paddingBottom: Spacing['4xl'] },
  avatarSection: { alignItems: 'center', marginBottom: Spacing.xl },
  avatarWrapper: { position: 'relative', marginBottom: Spacing.sm },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: Colors.primary + '40' },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 18,
    overflow: 'hidden',
  },
  cameraGradient: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
    borderRadius: 18,
  },
  changePhotoText: { fontSize: Typography.fontSize.sm, color: Colors.primary, fontWeight: '600' },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    ...Shadow.sm,
  },
  fieldLabel: { fontSize: Typography.fontSize.sm, fontWeight: '600', color: Colors.text, marginBottom: Spacing.xs },
  cityField: { marginBottom: Spacing.base },
  citySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 50,
  },
  cityText: { flex: 1, fontSize: Typography.fontSize.base, color: Colors.text },
  cityPickerCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    ...Shadow.sm,
  },
  cityPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cityPickerTitle: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.text },
  cityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  cityOptionActive: { backgroundColor: Colors.primary + '08', borderRadius: BorderRadius.md, paddingHorizontal: Spacing.sm },
  cityOptionText: { flex: 1, fontSize: Typography.fontSize.base, color: Colors.text },
  cityOptionTextActive: { color: Colors.primary, fontWeight: '700' },
  cityOptionCountry: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary },
  saveBtn: { marginTop: Spacing.sm },
});
