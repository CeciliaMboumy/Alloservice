import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { MOCK_PROVIDERS, SERVICE_CATEGORIES } from '../constants/data';
import ProviderCard from '../components/ProviderCard';

export default function ProviderListingPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'rating' | 'price'>('rating');

  const category = SERVICE_CATEGORIES.find(c => c.id === categoryId);
  const providers = MOCK_PROVIDERS
    .filter(p => categoryId === 'all' || p.categoryId === categoryId)
    .sort((a, b) => sortBy === 'rating' ? b.rating - a.rating : a.price - b.price);

  const title = category?.name ?? 'Tous les prestataires';

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            {category && <span className="text-xl">{category.icon}</span>}
            <h1 className="font-bold text-gray-900 text-lg">{title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5">
        {/* Sort bar */}
        <div className="flex items-center gap-2 mb-5">
          <SlidersHorizontal size={16} className="text-gray-400" />
          <span className="text-sm text-gray-500">Trier par :</span>
          <div className="flex gap-2 ml-auto">
            {(['rating', 'price'] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  sortBy === s ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600'
                }`}>
                {s === 'rating' ? '⭐ Note' : '💰 Prix'}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-4">{providers.length} prestataire{providers.length > 1 ? 's' : ''}</p>

        {providers.length === 0
          ? <div className="text-center py-24 text-gray-400">Aucun prestataire disponible dans cette catégorie.</div>
          : <div className="space-y-3">{providers.map(p => <ProviderCard key={p.id} provider={p} />)}</div>
        }
      </div>
    </div>
  );
}
