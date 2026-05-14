import { useState, useEffect } from 'react';
import { Provider } from '../types';
import { MOCK_PROVIDERS } from '../constants/data';
import { subscribeToProviders } from '../services/providerService';

type Filters = {
  categoryId?: string;
  city?: string;
};

export function useProviders(filters: Filters = {}) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    let resolved = false;

    // Fallback to mock data after 2s if Firebase not configured
    const timeout = setTimeout(() => {
      if (!resolved) {
        let data = MOCK_PROVIDERS;
        if (filters.categoryId) data = data.filter((p) => p.categoryId === filters.categoryId);
        if (filters.city) data = data.filter((p) => p.city === filters.city);
        setProviders(data);
        setLoading(false);
      }
    }, 2000);

    const unsubscribe = subscribeToProviders(filters, (data) => {
      resolved = true;
      clearTimeout(timeout);
      // If Firebase returns empty (not configured), fall back to mock
      if (data.length === 0) {
        let mock = MOCK_PROVIDERS;
        if (filters.categoryId) mock = mock.filter((p) => p.categoryId === filters.categoryId);
        if (filters.city) mock = mock.filter((p) => p.city === filters.city);
        setProviders(mock);
      } else {
        setProviders(data);
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [filters.categoryId, filters.city]);

  return { providers, loading, error };
}
