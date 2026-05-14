import { useState, useEffect } from 'react';
import { BookingRequest } from '../types';
import { subscribeToUserBookings, subscribeToProviderBookings, updateBookingStatus } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

export function useUserBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToUserBookings(user.uid, (data) => {
      setBookings(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [user?.uid]);

  async function cancelBooking(bookingId: string) {
    await updateBookingStatus(bookingId, 'annule');
  }

  return { bookings, loading, cancelBooking };
}

export function useProviderBookings(providerId: string) {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!providerId) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToProviderBookings(providerId, (data) => {
      setBookings(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [providerId]);

  async function acceptBooking(bookingId: string) {
    await updateBookingStatus(bookingId, 'confirme');
  }

  async function rejectBooking(bookingId: string) {
    await updateBookingStatus(bookingId, 'annule');
  }

  async function completeBooking(bookingId: string) {
    await updateBookingStatus(bookingId, 'termine');
  }

  return { bookings, loading, acceptBooking, rejectBooking, completeBooking };
}
