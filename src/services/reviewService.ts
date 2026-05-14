import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  increment,
  query,
  where,
  orderBy,
  serverTimestamp,
  runTransaction,
  getDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Review } from '../types';

export const REVIEWS_COLLECTION = 'reviews';

export async function fetchProviderReviews(providerId: string): Promise<Review[]> {
  try {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where('providerId', '==', providerId),
      orderBy('createdAt', 'desc'),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
  } catch {
    return [];
  }
}

export async function submitReview(
  review: Omit<Review, 'id' | 'createdAt'>,
): Promise<void> {
  await runTransaction(db, async (transaction) => {
    const providerRef = doc(db, 'providers', review.providerId);
    const providerSnap = await transaction.get(providerRef);

    if (!providerSnap.exists()) throw new Error('Prestataire introuvable');

    const data = providerSnap.data();
    const currentCount = data.reviewCount || 0;
    const currentRating = data.rating || 0;
    const newCount = currentCount + 1;
    const newRating = (currentRating * currentCount + review.rating) / newCount;

    transaction.update(providerRef, {
      rating: Math.round(newRating * 10) / 10,
      reviewCount: newCount,
    });

    const reviewRef = doc(collection(db, REVIEWS_COLLECTION));
    transaction.set(reviewRef, {
      ...review,
      createdAt: serverTimestamp(),
    });
  });
}
