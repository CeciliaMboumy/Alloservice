import { useState, useEffect } from 'react';
import { Review } from '../types';
import { fetchProviderReviews, submitReview } from '../services/reviewService';

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    userId: 'u1',
    userName: 'Pascaline A.',
    providerId: '1',
    rating: 5,
    comment: 'Excellent service ! Très propre et ponctuelle. Je recommande vivement.',
    createdAt: new Date('2026-05-12'),
  },
  {
    id: 'r2',
    userId: 'u2',
    userName: 'Bertrand K.',
    providerId: '1',
    rating: 4,
    comment: 'Bonne prestataire, travail soigné. Un peu de retard mais ça s\'est arrangé.',
    createdAt: new Date('2026-05-05'),
  },
  {
    id: 'r3',
    userId: 'u3',
    userName: 'Cécile M.',
    providerId: '1',
    rating: 5,
    comment: 'Parfait ! Ma maison est impeccable. Je la rappelle la semaine prochaine.',
    createdAt: new Date('2026-04-28'),
  },
];

export function useReviews(providerId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviderReviews(providerId)
      .then((data) => {
        setReviews(data.length > 0 ? data : MOCK_REVIEWS.filter((r) => r.providerId === providerId));
      })
      .finally(() => setLoading(false));
  }, [providerId]);

  async function addReview(review: Omit<Review, 'id' | 'createdAt'>) {
    await submitReview(review);
    setReviews((prev) => [
      { ...review, id: Date.now().toString(), createdAt: new Date() },
      ...prev,
    ]);
  }

  return { reviews, loading, addReview };
}
