import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useNotifications, AppNotification } from '../../context/NotificationContext';
import EmptyState from '../../components/common/EmptyState';
import { Colors, Spacing, Typography, BorderRadius, Shadow } from '../../constants/theme';
import { formatRelativeDate } from '../../utils/formatters';

const TYPE_CONFIG: Record<AppNotification['type'], { icon: React.ComponentProps<typeof Ionicons>['name']; color: string }> = {
  booking: { icon: 'calendar', color: Colors.primary },
  review: { icon: 'star', color: Colors.star },
  promo: { icon: 'megaphone', color: Colors.accent },
  system: { icon: 'information-circle', color: Colors.info },
};

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { notifications, markAsRead, markAllRead, clearAll } = useNotifications();

  function handlePress(n: AppNotification) {
    markAsRead(n.id);
    if (n.type === 'booking' && n.data?.bookingId) {
      // navigate to booking detail
    } else if (n.type === 'review' && n.data?.providerId) {
      navigation.navigate('ProviderProfile', { providerId: n.data.providerId });
    }
  }

  function handleClearAll() {
    Alert.alert(
      'Effacer les notifications',
      'Voulez-vous supprimer toutes les notifications ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Effacer', style: 'destructive', onPress: clearAll },
      ],
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead} style={styles.actionBtn}>
          <Text style={styles.actionText}>Tout lire</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            emoji="🔔"
            title="Aucune notification"
            subtitle="Vos notifications apparaîtront ici."
          />
        }
        ListHeaderComponent={
          notifications.length > 0 ? (
            <TouchableOpacity style={styles.clearAllBtn} onPress={handleClearAll}>
              <Ionicons name="trash-outline" size={14} color={Colors.error} />
              <Text style={styles.clearAllText}>Effacer tout</Text>
            </TouchableOpacity>
          ) : null
        }
        renderItem={({ item }) => {
          const { icon, color } = TYPE_CONFIG[item.type];
          return (
            <TouchableOpacity
              style={[styles.notifCard, !item.read && styles.notifCardUnread]}
              onPress={() => handlePress(item)}
              activeOpacity={0.85}
            >
              <View style={[styles.iconWrapper, { backgroundColor: color + '18' }]}>
                <Ionicons name={icon} size={20} color={color} />
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <View style={styles.notifHeaderRow}>
                  <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  {!item.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
                <Text style={styles.notifDate}>{formatRelativeDate(item.createdAt)}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
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
  title: {
    flex: 1,
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  actionBtn: { paddingHorizontal: Spacing.sm },
  actionText: { fontSize: Typography.fontSize.sm, color: Colors.primary, fontWeight: '600' },
  listContent: { paddingBottom: Spacing['3xl'] },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
    padding: Spacing.base,
  },
  clearAllText: { fontSize: Typography.fontSize.xs, color: Colors.error, fontWeight: '500' },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  notifCardUnread: {
    backgroundColor: Colors.primary + '06',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notifHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  notifTitle: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
    color: Colors.text,
  },
  notifTitleUnread: {
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    flexShrink: 0,
  },
  notifBody: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  notifDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textLight,
  },
});
