import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  QueryConstraint,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Provider } from '../types';

export const PROVIDERS_COLLECTION = 'providers';

export async function fetchProviders(filters?: {
  categoryId?: string;
  city?: string;
  available?: boolean;
}): Promise<Provider[]> {
  try {
    const constraints: QueryConstraint[] = [orderBy('rating', 'desc')];
    if (filters?.categoryId) constraints.push(where('categoryId', '==', filters.categoryId));
    if (filters?.city) constraints.push(where('city', '==', filters.city));
    if (filters?.available !== undefined) constraints.push(where('available', '==', filters.available));

    const q = query(collection(db, PROVIDERS_COLLECTION), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Provider));
  } catch {
    return [];
  }
}

export async function fetchProviderById(id: string): Promise<Provider | null> {
  try {
    const snap = await getDoc(doc(db, PROVIDERS_COLLECTION, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Provider;
  } catch {
    return null;
  }
}

export async function createProvider(data: Omit<Provider, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, PROVIDERS_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProvider(id: string, data: Partial<Provider>): Promise<void> {
  await updateDoc(doc(db, PROVIDERS_COLLECTION, id), data);
}

export function subscribeToProviders(
  filters: { categoryId?: string; city?: string },
  callback: (providers: Provider[]) => void,
): Unsubscribe {
  try {
    const constraints: QueryConstraint[] = [orderBy('rating', 'desc'), limit(50)];
    if (filters.categoryId) constraints.push(where('categoryId', '==', filters.categoryId));
    if (filters.city) constraints.push(where('city', '==', filters.city));

    const q = query(collection(db, PROVIDERS_COLLECTION), ...constraints);
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Provider)));
    });
  } catch {
    callback([]);
    return () => {};
  }
}
