import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

type Slide = {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  gradient: [string, string];
};

const SLIDES: Slide[] = [
  {
    id: '1',
    emoji: '🌍',
    title: 'Bienvenue sur AlloService',
    subtitle:
      'La plateforme qui connecte les habitants d\'Afrique francophone avec des prestataires de services fiables près de chez vous.',
    gradient: ['#1B6B3A', '#2D9A57'],
  },
  {
    id: '2',
    emoji: '🔍',
    title: 'Trouvez le bon professionnel',
    subtitle:
      'Ménage, plomberie, coiffure, électricité, maquillage et bien plus encore. Des centaines de prestataires vérifiés à votre service.',
    gradient: ['#F4A823', '#E85D26'],
  },
  {
    id: '3',
    emoji: '⭐',
    title: 'Réservez en toute confiance',
    subtitle:
      'Consultez les avis, comparez les prix et contactez directement par WhatsApp. Simple, rapide et sécurisé.',
    gradient: ['#1565C0', '#1976D2'],
  },
  {
    id: '4',
    emoji: '📱',
    title: 'Disponible dans 4 pays',
    subtitle:
      'Cameroun, Côte d\'Ivoire, Sénégal et Congo. AlloService grandit avec vous, partout en Afrique francophone.',
    gradient: ['#1B6B3A', '#134D2A'],
  },
];

export default function OnboardingScreen() {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  async function finish() {
    await AsyncStorage.setItem('onboarding_done', 'true');
    navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
  }

  function next() {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex((i) => i + 1);
    } else {
      finish();
    }
  }

  const renderSlide: ListRenderItem<Slide> = ({ item }) => (
    <LinearGradient colors={item.gradient} style={styles.slide}>
      <View style={styles.slideContent}>
        <View style={styles.emojiWrapper}>
          <Text style={styles.emoji}>{item.emoji}</Text>
        </View>
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
      </View>
    </LinearGradient>
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + Spacing.lg }]}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
      />

      {/* Bottom controls */}
      <View style={styles.controls}>
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentIndex ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity onPress={finish} style={styles.skipBtn}>
            <Text style={styles.skipText}>Passer</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={next} style={styles.nextBtn} activeOpacity={0.85}>
            <LinearGradient colors={['#1B6B3A', '#2D9A57']} style={styles.nextGradient}>
              <Text style={styles.nextText}>
                {currentIndex === SLIDES.length - 1 ? 'Commencer' : 'Suivant'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  slide: {
    width,
    height: height * 0.78,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideContent: {
    paddingHorizontal: Spacing['2xl'],
    alignItems: 'center',
  },
  emojiWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['2xl'],
  },
  emoji: {
    fontSize: 60,
  },
  slideTitle: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: Spacing.base,
    lineHeight: 36,
  },
  slideSubtitle: {
    fontSize: Typography.fontSize.base,
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
    lineHeight: 24,
  },
  controls: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    justifyContent: 'space-between',
    paddingTop: Spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: Colors.border,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipBtn: {
    padding: Spacing.md,
  },
  skipText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  nextBtn: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  nextGradient: {
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.md,
  },
  nextText: {
    color: '#fff',
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
  },
});
