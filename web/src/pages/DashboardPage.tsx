import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Heart, Bell, User, Pencil, Calendar, Clock, Banknote } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from '../constants/data';
import type { BookingStatus } from '../types';

const AVATAR = 'https://ui-avatars.com/api/?name=';

const MOCK_BOOKINGS = [
  { id: 'b1', providerName: 'Marie-Claire Nguema', service: 'Ménage',    date: '20/05/2026', time: '09:00', status: 'confirme'  as BookingStatus, price: '5 000 FCFA/heure' },
  { id: 'b2', providerName: 'Fatou Diallo',         service: 'Coiffure', date: '18/05/2026', time: '14:00', status: 'en_attente' as BookingStatus, price: '8 000 FCFA/séance' },
  { id: 'b3', providerName: 'Jean-Paul Koné',       service: 'Plomberie',date: '10/05/2026', time: '10:00', status: 'termine'   as BookingStatus, price: '15 000 FCFA/intervention' },
];

const MENU = [
  { icon: User,     label: 'Modifier mon profil',  action: () => {} },
  { icon: Bell,     label: 'Notifications',          action: () => {} },
  { icon: Heart,    label: 'Mes Favoris',            action: () => {} },
  { icon: Settings, label: 'Paramètres',             action: (nav: ReturnType<typeof useNavigate>) => nav('/settings') },
];

export default function DashboardPage() {
  const [tab, setTab] = useState<'reservations' | 'compte'>('reservations');
  const { user, userProfile, logOut } = useAuth();
  const navigate = useNavigate();

  const displayName = userProfile?.name || user?.displayName || 'Utilisateur';
  const email = userProfile?.email || user?.email || '';
  const city = userProfile?.city || '';
  const avatar = `${AVATAR}${encodeURIComponent(displayName)}&background=1B6B3A&color=fff&size=200`;

  async function handleLogOut() {
    if (!window.confirm('Voulez-vous vraiment vous déconnecter ?')) return;
    await logOut();
    navigate('/auth');
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Profile header */}
      <div className="pb-6" style={{ background: 'linear-gradient(135deg, #1B4332, #1B6B3A)' }}>
        <div className="max-w-2xl mx-auto px-4 pt-10">
          <div className="flex items-center gap-4 mb-6">
            <img src={avatar} alt={displayName} className="w-16 h-16 rounded-full border-3 border-white/40 object-cover" />
            <div className="flex-1">
              <p className="text-white font-black text-xl">{displayName}</p>
              <p className="text-white/70 text-sm">{email}</p>
              {city && <p className="text-white/60 text-xs mt-0.5">📍 {city}</p>}
            </div>
            <button className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
              <Pencil size={15} />
            </button>
          </div>

          {/* Stats */}
          <div className="bg-white/15 rounded-2xl p-4 grid grid-cols-3 divide-x divide-white/20">
            {[
              { value: '3', label: 'Réservations' },
              { value: '2', label: 'Avis laissés' },
              { value: '5', label: 'Favoris' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-white font-black text-2xl">{stat.value}</p>
                <p className="text-white/70 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto flex">
          {(['reservations', 'compte'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3.5 text-sm font-semibold border-b-2 transition-all ${
                tab === t ? 'border-primary text-primary' : 'border-transparent text-gray-500'
              }`}>
              {t === 'reservations' ? '📅 Réservations' : '👤 Mon Compte'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5">
        {tab === 'reservations' ? (
          <div className="space-y-3">
            {MOCK_BOOKINGS.map(booking => (
              <div key={booking.id} className="card p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{booking.providerName}</p>
                    <p className="text-primary text-xs font-medium">{booking.service}</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{
                      color: BOOKING_STATUS_COLORS[booking.status],
                      backgroundColor: BOOKING_STATUS_COLORS[booking.status] + '20',
                    }}>
                    {BOOKING_STATUS_LABELS[booking.status]}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 border-t border-gray-50 pt-3">
                  {[
                    { icon: Calendar,  text: booking.date },
                    { icon: Clock,     text: booking.time },
                    { icon: Banknote,  text: booking.price },
                  ].map(({ icon: Icon, text }) => (
                    <span key={text} className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Icon size={12} /> {text}
                    </span>
                  ))}
                </div>
                {booking.status === 'termine' && (
                  <button className="mt-3 pt-3 border-t border-gray-50 text-primary text-sm font-semibold flex items-center gap-1 w-full">
                    ⭐ Laisser un avis
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {MENU.map(item => (
              <button key={item.label} onClick={() => item.action(navigate as ReturnType<typeof useNavigate>)}
                className="card w-full flex items-center gap-4 p-4 hover:shadow-md transition-shadow text-left">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon size={18} className="text-primary" />
                </div>
                <span className="flex-1 font-medium text-gray-800">{item.label}</span>
                <span className="text-gray-300">›</span>
              </button>
            ))}

            <button onClick={handleLogOut}
              className="w-full flex items-center justify-center gap-2 p-4 mt-4 rounded-xl bg-red-50 border border-red-100 text-red-600 font-bold hover:bg-red-100 transition-colors">
              <LogOut size={18} /> Se déconnecter
            </button>
            <p className="text-center text-xs text-gray-400 py-4">AlloService v1.0.0</p>
          </div>
        )}
      </div>
    </div>
  );
}
