import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius } from '../../constants/theme';

type Props = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export function SkeletonBox({ width = '100%', height = 16, borderRadius = BorderRadius.sm, style }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.7] });

  return (
    <Animated.View
      style={[
        { width: width as any, height, borderRadius, backgroundColor: Colors.border, opacity },
        style,
      ]}
    />
  );
}

export function ProviderCardSkeleton() {
  return (
    <View style={skStyles.card}>
      <SkeletonBox width={70} height={70} borderRadius={BorderRadius.lg} />
      <View style={{ flex: 1, gap: 8 }}>
        <SkeletonBox width="70%" height={14} />
        <SkeletonBox width="45%" height={12} />
        <SkeletonBox width="55%" height={11} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <SkeletonBox width="35%" height={11} />
          <SkeletonBox width="30%" height={11} />
        </View>
      </View>
    </View>
  );
}

const skStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: 16,
    marginBottom: 12,
  },
});
