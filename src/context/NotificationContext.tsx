import React, { createContext, useContext, useState, useCallback } from 'react';

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  type: 'booking' | 'review' | 'promo' | 'system';
  read: boolean;
  createdAt: Date;
  data?: Record<string, string>;
};

type NotificationContextType = {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  clearAll: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const INITIAL: AppNotification[] = [
  {
    id: 'n1',
    title: 'Réservation confirmée !',
    body: 'Marie-Claire Nguema a confirmé votre réservation pour le 20/05/2026 à 09h00.',
    type: 'booking',
    read: false,
    createdAt: new Date('2026-05-13T10:30:00'),
    data: { bookingId: 'b1' },
  },
  {
    id: 'n2',
    title: 'Nouveau prestataire près de chez vous',
    body: 'Fatou Diallo propose maintenant ses services de coiffure à Dakar.',
    type: 'promo',
    read: false,
    createdAt: new Date('2026-05-12T14:00:00'),
  },
  {
    id: 'n3',
    title: 'Votre avis compte !',
    body: 'N\'oubliez pas de noter Jean-Paul Koné suite à votre intervention du 10/05.',
    type: 'review',
    read: true,
    createdAt: new Date('2026-05-11T09:00:00'),
    data: { providerId: '2' },
  },
  {
    id: 'n4',
    title: 'Bienvenue sur AlloService 🎉',
    body: 'Découvrez des centaines de prestataires vérifiés dans votre ville !',
    type: 'system',
    read: true,
    createdAt: new Date('2026-05-01T08:00:00'),
  },
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback(
    (n: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
      setNotifications((prev) => [
        { ...n, id: Date.now().toString(), createdAt: new Date(), read: false },
        ...prev,
      ]);
    },
    [],
  );

  const clearAll = useCallback(() => setNotifications([]), []);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllRead, addNotification, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
