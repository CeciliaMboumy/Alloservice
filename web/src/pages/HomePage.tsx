import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, MapPin, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SERVICE_CATEGORIES, MOCK_PROVIDERS } from '../constants/data';
import ProviderCard from '../components/ProviderCard';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  const displayName = userProfile?.name || user?.displayName || 'vous';
  const firstName = displayName.split(' ')[0];

  const filtered = query.trim()
    ? MOCK_PROVIDERS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.city.toLowerCase().includes(query.toLowerCase())
      )
    : null;

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="sticky top-0 z-10" style={{ background: 'linear-gradient(135deg, #1B4332, #1B6B3A)' }}>
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/70 text-sm">Bonjour 👋</p>
              <h1 className="text-white font-bold text-xl">{firstName}</h1>
            </div>
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
                <Bell size={18} />
              </button>
              <button onClick={() => navigate('/dashboard')}
                className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
                <User size={18} />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher un service, un prestataire..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {filtered ? (
          <>
            <p className="text-sm text-gray-500">{filtered.length} résultat(s) pour « {query} »</p>
            {filtered.length === 0
              ? <div className="text-center py-16 text-gray-400">Aucun prestataire trouvé.</div>
              : <div className="space-y-3">{filtered.map(p => <ProviderCard key={p.id} provider={p} />)}</div>
            }
          </>
        ) : (
          <>
            {/* Banner */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #F4A823, #E85D26)' }}>
              <div className="p-5">
                <p className="text-white font-black text-2xl mb-1">Trouvez un pro</p>
                <p className="text-white/90 text-sm mb-4">Partout en Afrique francophone</p>
                <div className="flex items-center gap-1.5 text-white/80 text-sm">
                  <MapPin size={14} />
                  <span>Douala · Abidjan · Dakar · Brazzaville</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <section>
              <h2 className="font-bold text-gray-900 text-lg mb-4">Services</h2>
              <div className="grid grid-cols-4 gap-3">
                {SERVICE_CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => navigate(`/providers/${cat.id}`)}
                    className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow active:scale-95">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: cat.color + '18' }}>
                      {cat.icon}
                    </div>
                    <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{cat.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Featured providers */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 text-lg">Prestataires vedettes</h2>
                <button onClick={() => navigate('/providers/all')} className="text-primary text-sm font-semibold">
                  Voir tout
                </button>
              </div>
              <div className="space-y-3">
                {MOCK_PROVIDERS.slice(0, 4).map(p => <ProviderCard key={p.id} provider={p} />)}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
