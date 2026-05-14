import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { CITIES } from '../../constants/data';

type Mode = 'login' | 'signup';
type Role = 'client' | 'prestataire';

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>('login');
  const [role, setRole] = useState<Role>('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Douala');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signIn, signUp } = useAuth();
  const navigation = useNavigation<any>();

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!email) e.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email invalide';
    if (!password) e.password = 'Mot de passe requis';
    else if (password.length < 6) e.password = 'Minimum 6 caractères';
    if (mode === 'signup') {
      if (!name.trim()) e.name = 'Nom requis';
      if (!phone) e.phone = 'Téléphone requis';
      if (password !== confirmPassword) e.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password, name, phone, city, role);
      }
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (err: any) {
      const msg =
        err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password'
          ? 'Email ou mot de passe incorrect'
          : err?.code === 'auth/email-already-in-use'
          ? 'Cet email est déjà utilisé'
          : err?.code === 'auth/network-request-failed'
          ? 'Erreur réseau. Vérifiez votre connexion.'
          : 'Une erreur est survenue. Réessayez.';
      Alert.alert('Erreur', msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Hero */}
        <LinearGradient colors={['#1B6B3A', '#2D9A57']} style={styles.hero}>
          <Text style={styles.logo}>AlloService</Text>
          <Text style={styles.tagline}>Vos services, à portée de main</Text>
        </LinearGradient>

        <View style={styles.form}>
          {/* Mode switcher */}
          <View style={styles.modeSwitcher}>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'login' && styles.modeBtnActive]}
              onPress={() => { setMode('login'); setErrors({}); }}
            >
              <Text style={[styles.modeBtnText, mode === 'login' && styles.modeBtnTextActive]}>
                Connexion
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'signup' && styles.modeBtnActive]}
              onPress={() => { setMode('signup'); setErrors({}); }}
            >
              <Text style={[styles.modeBtnText, mode === 'signup' && styles.modeBtnTextActive]}>
                Inscription
              </Text>
            </TouchableOpacity>
          </View>

          {/* Signup-only fields */}
          {mode === 'signup' && (
            <>
              {/* Role selection */}
              <Text style={styles.sectionLabel}>Je suis :</Text>
              <View style={styles.roleRow}>
                <TouchableOpacity
                  style={[styles.roleBtn, role === 'client' && styles.roleBtnActive]}
                  onPress={() => setRole('client')}
                >
                  <Text style={styles.roleEmoji}>👤</Text>
                  <Text style={[styles.roleText, role === 'client' && styles.roleTextActive]}>Client</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.roleBtn, role === 'prestataire' && styles.roleBtnActive]}
                  onPress={() => setRole('prestataire')}
                >
                  <Text style={styles.roleEmoji}>🛠️</Text>
                  <Text style={[styles.roleText, role === 'prestataire' && styles.roleTextActive]}>Prestataire</Text>
                </TouchableOpacity>
              </View>

              <Input
                label="Nom complet"
                placeholder="Ex: Marie Nguema"
                value={name}
                onChangeText={setName}
                leftIcon="person-outline"
                error={errors.name}
                autoCapitalize="words"
              />
              <Input
                label="Téléphone / WhatsApp"
                placeholder="+237 6XX XXX XXX"
                value={phone}
                onChangeText={setPhone}
                leftIcon="call-outline"
                error={errors.phone}
                keyboardType="phone-pad"
              />
            </>
          )}

          <Input
            label="Adresse email"
            placeholder="votre@email.com"
            value={email}
            onChangeText={setEmail}
            leftIcon="mail-outline"
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Mot de passe"
            placeholder="Minimum 6 caractères"
            value={password}
            onChangeText={setPassword}
            leftIcon="lock-closed-outline"
            error={errors.password}
            isPassword
          />
          {mode === 'signup' && (
            <Input
              label="Confirmer le mot de passe"
              placeholder="Répétez votre mot de passe"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              leftIcon="lock-closed-outline"
              error={errors.confirmPassword}
              isPassword
            />
          )}

          <Button
            label={mode === 'login' ? 'Se connecter' : "S'inscrire"}
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            size="lg"
            style={styles.submitBtn}
          />

          {mode === 'login' && (
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          )}

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>
              {mode === 'login' ? "Pas encore de compte ? " : 'Déjà un compte ? '}
            </Text>
            <TouchableOpacity onPress={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErrors({}); }}>
              <Text style={styles.switchLink}>
                {mode === 'login' ? "S'inscrire" : 'Se connecter'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
  },
  hero: {
    paddingTop: 72,
    paddingBottom: Spacing['3xl'],
    paddingHorizontal: Spacing['2xl'],
    alignItems: 'center',
  },
  logo: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
    marginBottom: Spacing.sm,
  },
  tagline: {
    fontSize: Typography.fontSize.base,
    color: 'rgba(255,255,255,0.85)',
    fontStyle: 'italic',
  },
  form: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    marginTop: -Spacing.xl,
    padding: Spacing['2xl'],
    flex: 1,
  },
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: Spacing.xl,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  modeBtnActive: {
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modeBtnText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  modeBtnTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  sectionLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  roleRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.base,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
  },
  roleBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  roleEmoji: { fontSize: 20 },
  roleText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  roleTextActive: {
    color: Colors.primary,
  },
  submitBtn: {
    marginTop: Spacing.sm,
  },
  forgotBtn: {
    alignItems: 'center',
    marginTop: Spacing.base,
  },
  forgotText: {
    color: Colors.primary,
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  switchText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  switchLink: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
    fontWeight: '700',
  },
});
