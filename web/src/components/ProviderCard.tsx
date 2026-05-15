import { Star, MapPin, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Provider } from '../types';

const AVATAR = 'https://ui-avatars.com/api/?name=';

export default function ProviderCard({ provider }: { provider: Provider }) {
  const navigate = useNavigate();
  const avatar = provider.avatar || `${AVATAR}${encodeURIComponent(provider.name)}&background=1B6B3A&color=fff&size=200`;

  return (
    <button
      onClick={() => navigate(`/provider/${provider.id}`)}
      className="card p-4 flex gap-4 items-start text-left w-full hover:shadow-md transition-shadow"
    >
      <div className="relative flex-shrink-0">
        <img src={avatar} alt={provider.name} className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
        {!provider.available && (
          <span className="absolute -top-1 -right-1 bg-gray-400 text-white text-xs px-1.5 py-0.5 rounded-full">Indispo</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-bold text-gray-900 truncate">{provider.name}</span>
            {provider.verified && <ShieldCheck size={14} className="text-primary flex-shrink-0" />}
          </div>
          <span className="text-primary font-bold text-sm flex-shrink-0">
            {provider.price.toLocaleString()} <span className="text-gray-400 font-normal text-xs">{provider.priceUnit}</span>
          </span>
        </div>

        <p className="text-primary text-xs font-medium mt-0.5">{provider.category}</p>

        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-700">{provider.rating}</span>
            <span>({provider.reviewCount})</span>
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={12} />
            {provider.city}
          </span>
        </div>
      </div>
    </button>
  );
}
