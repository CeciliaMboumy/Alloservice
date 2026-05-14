import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { BookingRequest } from '../types';

export const BOOKINGS_COLLECTION = 'bookings';

export async function createBooking(
  data: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>,
): Promise<string> {
  const ref = await addDoc(collection(db, BOOKINGS_COLLECTION), {
    ...data,
    status: 'en_attente',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function fetchUserBookings(userId: string): Promise<BookingRequest[]> {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BookingRequest));
  } catch {
    return [];
  }
}

export async function fetchProviderBookings(providerId: string): Promise<BookingRequest[]> {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where('providerId', '==', providerId),
      orderBy('createdAt', 'desc'),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BookingRequest));
  } catch {
    return [];
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingRequest['status'],
): Promise<void> {
  await updateDoc(doc(db, BOOKINGS_COLLECTION, bookingId), { status });
}

export function subscribeToUserBookings(
  userId: string,
  callback: (bookings: BookingRequest[]) => void,
): Unsubscribe {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
    );
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as BookingRequest)));
    });
  } catch {
    callback([]);
    return () => {};
  }
}

export function subscribeToProviderBookings(
  providerId: string,
  callback: (bookings: BookingRequest[]) => void,
): Unsubscribe {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where('providerId', '==', providerId),
      orderBy('createdAt', 'desc'),
    );
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as BookingRequest)));
    });
  } catch {
    callback([]);
    return () => {};
  }
}
