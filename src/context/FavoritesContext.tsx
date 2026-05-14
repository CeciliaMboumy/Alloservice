import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider } from '../types';
import { MOCK_PROVIDERS } from '../constants/data';

const STORAGE_KEY = 'alloservice_favorites';

type FavoritesContextType = {
  favorites: Provider[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (provider: Provider) => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) setFavoriteIds(JSON.parse(val));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const isFavorite = useCallback((id: string) => favoriteIds.includes(id), [favoriteIds]);

  const toggleFavorite = useCallback((provider: Provider) => {
    setFavoriteIds((prev) =>
      prev.includes(provider.id) ? prev.filter((id) => id !== provider.id) : [...prev, provider.id],
    );
  }, []);

  const favorites = MOCK_PROVIDERS.filter((p) => favoriteIds.includes(p.id));

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
