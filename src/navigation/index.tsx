import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Colors } from '../constants/theme';

// ── Screens ──────────────────────────────────────────────────────────────────
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import AuthScreen from '../screens/Auth/AuthScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import FavoritesScreen from '../screens/Favorites/FavoritesScreen';
import ProviderListingScreen from '../screens/Providers/ProviderListingScreen';
import ProviderProfileScreen from '../screens/Providers/ProviderProfileScreen';
import BookingRequestScreen from '../screens/Booking/BookingRequestScreen';
import BookingDetailScreen from '../screens/Booking/BookingDetailScreen';
import UserDashboardScreen from '../screens/Dashboard/UserDashboardScreen';
import ProviderDashboardScreen from '../screens/Dashboard/ProviderDashboardScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import BecomeProviderScreen from '../screens/Profile/BecomeProviderScreen';
import WriteReviewScreen from '../screens/Reviews/WriteReviewScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ── Bottom Tab Navigator ──────────────────────────────────────────────────────
function MainTabs() {
  const { unreadCount } = useNotifications();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 6,
          height: 68,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
        tabBarIcon: ({ focused, color, size }) => {
          const s = size - 2;
          if (route.name === 'Accueil') {
            return <Ionicons name={focused ? 'home' : 'home-outline'} size={s} color={color} />;
          }
          if (route.name === 'Découvrir') {
            return <Ionicons name={focused ? 'search' : 'search-outline'} size={s} color={color} />;
          }
          if (route.name === 'Réservations') {
            return <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={s} color={color} />;
          }
          if (route.name === 'Profil') {
            return (
              <View>
                <Ionicons name={focused ? 'person' : 'person-outline'} size={s} color={color} />
                {unreadCount > 0 && (
                  <View
                    style={{
                      position: 'absolute', top: -2, right: -4,
                      width: 8, height: 8, borderRadius: 4,
                      backgroundColor: Colors.error,
                      borderWidth: 1.5, borderColor: Colors.surface,
                    }}
                  />
                )}
              </View>
            );
          }
          return null;
        },
      })}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Découvrir" component={SearchScreen} />
      <Tab.Screen name="Réservations" component={UserDashboardScreen} />
      <Tab.Screen name="Profil" component={UserDashboardScreen} />
    </Tab.Navigator>
  );
}

// ── Loading Spinner ───────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

// ── Root Navigator ────────────────────────────────────────────────────────────
// ALL screens are always registered — this lets navigation.reset() work from
// any screen regardless of auth / onboarding state.
export default function AppNavigator() {
  const { user, loading: authLoading } = useAuth();
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('onboarding_done').then((val) => setOnboardingDone(val === 'true'));
  }, []);

  if (authLoading || onboardingDone === null) return <LoadingScreen />;

  const initialRoute: string = !onboardingDone ? 'Onboarding' : !user ? 'Auth' : 'Main';

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        {/* Auth flow — always registered */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} options={{ animation: 'fade' }} />

        {/* App shell */}
        <Stack.Screen name="Main" component={MainTabs} options={{ animation: 'fade' }} />

        {/* Provider flow */}
        <Stack.Screen name="ProviderListing" component={ProviderListingScreen} />
        <Stack.Screen name="ProviderProfile" component={ProviderProfileScreen} />

        {/* Booking flow */}
        <Stack.Screen name="BookingRequest" component={BookingRequestScreen} />
        <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />

        {/* Search */}
        <Stack.Screen name="Search" component={SearchScreen} options={{ animation: 'fade_from_bottom' }} />

        {/* Utility screens */}
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="WriteReview" component={WriteReviewScreen} />

        {/* Profile management */}
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="BecomeProvider" component={BecomeProviderScreen} />

        {/* Settings & dashboards */}
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="ProviderDashboard" component={ProviderDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
