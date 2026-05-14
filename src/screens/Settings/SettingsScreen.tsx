import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Typography, BorderRadius, Shadow } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

type SettingItem = {
  key: string;
  label: string;
  sublabel?: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  type: 'toggle' | 'link' | 'action';
  color?: string;
  value?: boolean;
  onPress?: () => void;
  onChange?: (val: boolean) => void;
};

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { logOut } = useAuth();

  const [notifications, setNotifications] = useState(true);
  const [bookingAlerts, setBookingAlerts] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);

  async function handleResetOnboarding() {
    Alert.alert(
      'Réinitialiser l\'onboarding',
      'Voulez-vous revoir le guide d\'introduction ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          onPress: async () => {
            await AsyncStorage.removeItem('onboarding_done');
            navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
          },
        },
      ],
    );
  }

  async function handleDeleteAccount() {
    Alert.alert(
      'Supprimer le compte',
      'Cette action est irréversible. Toutes vos données seront supprimées.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => {} },
      ],
    );
  }

  const sections: { title: string; items: SettingItem[] }[] = [
    {
      title: 'Notifications',
      items: [
        {
          key: 'notifs',
          label: 'Notifications push',
          sublabel: 'Activer les notifications de l\'application',
          icon: 'notifications-outline',
          type: 'toggle',
          value: notifications,
          onChange: setNotifications,
        },
        {
          key: 'bookingAlerts',
          label: 'Alertes réservations',
          sublabel: 'Confirmations et rappels',
          icon: 'calendar-outline',
          type: 'toggle',
          value: bookingAlerts,
          onChange: setBookingAlerts,
        },
        {
          key: 'promoAlerts',
          label: 'Offres promotionnelles',
          sublabel: 'Nouveaux prestataires et promotions',
          icon: 'megaphone-outline',
          type: 'toggle',
          value: promoAlerts,
          onChange: setPromoAlerts,
        },
      ],
    },
    {
      title: 'Confidentialité',
      items: [
        {
          key: 'location',
          label: 'Localisation',
          sublabel: 'Permettre à AlloService d\'accéder à votre position',
          icon: 'location-outline',
          type: 'toggle',
          value: locationEnabled,
          onChange: setLocationEnabled,
        },
        {
          key: 'privacy',
          label: 'Politique de confidentialité',
          icon: 'shield-outline',
          type: 'link',
          onPress: () => Linking.openURL('https://alloservice.app/privacy'),
        },
        {
          key: 'terms',
          label: 'Conditions d\'utilisation',
          icon: 'document-text-outline',
          type: 'link',
          onPress: () => Linking.openURL('https://alloservice.app/terms'),
        },
      ],
    },
    {
      title: 'Application',
      items: [
        {
          key: 'onboarding',
          label: 'Revoir l\'introduction',
          icon: 'play-circle-outline',
          type: 'action',
          onPress: handleResetOnboarding,
        },
        {
          key: 'help',
          label: 'Centre d\'aide',
          icon: 'help-circle-outline',
          type: 'link',
          onPress: () => Linking.openURL('https://alloservice.app/help'),
        },
        {
          key: 'feedback',
          label: 'Donner votre avis',
          icon: 'star-outline',
          type: 'link',
          onPress: () => {},
        },
        {
          key: 'about',
          label: 'À propos d\'AlloService',
          sublabel: 'Version 1.0.0',
          icon: 'information-circle-outline',
          type: 'link',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Compte',
      items: [
        {
          key: 'delete',
          label: 'Supprimer mon compte',
          icon: 'trash-outline',
          type: 'action',
          color: Colors.error,
          onPress: handleDeleteAccount,
        },
      ],
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Paramètres</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.settingRow,
                    idx < section.items.length - 1 && styles.settingRowBorder,
                  ]}
                  onPress={item.type !== 'toggle' ? item.onPress : undefined}
                  activeOpacity={item.type === 'toggle' ? 1 : 0.7}
                >
                  <View style={[styles.settingIcon, { backgroundColor: (item.color ?? Colors.primary) + '15' }]}>
                    <Ionicons name={item.icon} size={18} color={item.color ?? Colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.settingLabel, item.color ? { color: item.color } : null]}>
                      {item.label}
                    </Text>
                    {item.sublabel && (
                      <Text style={styles.settingSubLabel}>{item.sublabel}</Text>
                    )}
                  </View>
                  {item.type === 'toggle' ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onChange}
                      trackColor={{ false: Colors.border, true: Colors.primary + '80' }}
                      thumbColor={item.value ? Colors.primary : Colors.surface}
                    />
                  ) : (
                    <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.version}>AlloService v1.0.0 · Fait avec ❤️ pour l'Afrique</Text>
      </ScrollView>
    </View>
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
  content: { padding: Spacing.base, paddingBottom: Spacing['3xl'] },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: Typography.fontSize.xs, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: Spacing.sm, paddingHorizontal: Spacing.xs },
  sectionCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, overflow: 'hidden', ...Shadow.sm },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.base },
  settingRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  settingIcon: { width: 36, height: 36, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { fontSize: Typography.fontSize.base, color: Colors.text, fontWeight: '500' },
  settingSubLabel: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  version: { textAlign: 'center', fontSize: Typography.fontSize.xs, color: Colors.textLight, paddingTop: Spacing.sm },
});
