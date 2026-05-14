import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { NotificationProvider } from './src/context/NotificationContext';
import AppNavigator from './src/navigation';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <NotificationProvider>
            <FavoritesProvider>
              <StatusBar style="auto" />
              <AppNavigator />
            </FavoritesProvider>
          </NotificationProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
