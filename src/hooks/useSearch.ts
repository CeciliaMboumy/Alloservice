import { useState, useMemo, useCallback } from 'react';
import { MOCK_PROVIDERS, SERVICE_CATEGORIES } from '../constants/data';
import { Provider, ServiceCategory } from '../types';

export type SearchResult =
  | { type: 'provider'; data: Provider }
  | { type: 'category'; data: ServiceCategory };

export function useSearch() {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim() || query.length < 2) return [];

    const q = query.toLowerCase();

    const providerResults: SearchResult[] = MOCK_PROVIDERS
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.skills.some((s) => s.toLowerCase().includes(q)),
      )
      .map((p) => ({ type: 'provider', data: p }));

    const categoryResults: SearchResult[] = SERVICE_CATEGORIES
      .filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
      .map((c) => ({ type: 'category', data: c }));

    return [...categoryResults, ...providerResults].slice(0, 20);
  }, [query]);

  const addRecentSearch = useCallback((term: string) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s !== term);
      return [term, ...filtered].slice(0, 8);
    });
  }, []);

  const clearRecentSearches = useCallback(() => setRecentSearches([]), []);

  return { query, setQuery, results, recentSearches, addRecentSearch, clearRecentSearches };
}
