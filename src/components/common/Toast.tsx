import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography, Shadow } from '../../constants/theme';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type Props = {
  message: string;
  type: ToastType;
  onDismiss: () => void;
};

const CONFIG: Record<ToastType, { icon: React.ComponentProps<typeof Ionicons>['name']; color: string; bg: string }> = {
  success: { icon: 'checkmark-circle', color: Colors.success, bg: '#E8F5E9' },
  error: { icon: 'alert-circle', color: Colors.error, bg: '#FFEBEE' },
  info: { icon: 'information-circle', color: Colors.info, bg: '#E3F2FD' },
  warning: { icon: 'warning', color: Colors.warning, bg: '#FFF3E0' },
};

function ToastItem({ message, type, onDismiss }: Props) {
  const anim = useRef(new Animated.Value(0)).current;
  const { icon, color, bg } = CONFIG[type];

  useEffect(() => {
    Animated.spring(anim, { toValue: 1, tension: 80, friction: 10, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor: bg },
        { opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] },
      ]}
    >
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.message, { color }]} numberOfLines={2}>{message}</Text>
      <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="close" size={16} color={color} />
      </TouchableOpacity>
    </Animated.View>
  );
}

type ContainerProps = {
  toasts: { id: string; message: string; type: ToastType }[];
  onDismiss: (id: string) => void;
};

export default function ToastContainer({ toasts, onDismiss }: ContainerProps) {
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View style={[styles.container, { top: insets.top + Spacing.sm }]} pointerEvents="box-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} message={t.message} type={t.type} onDismiss={() => onDismiss(t.id)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.base,
    right: Spacing.base,
    zIndex: 9999,
    gap: Spacing.sm,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    ...Shadow.md,
  },
  message: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
    lineHeight: 20,
  },
});
