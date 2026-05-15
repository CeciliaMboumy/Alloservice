import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, ShieldCheck, Phone, MessageCircle, Briefcase, CheckCircle2 } from 'lucide-react';
import { MOCK_PROVIDERS } from '../constants/data';
import Button from '../components/Button';

const AVATAR = 'https://ui-avatars.com/api/?name=';

export default function ProviderProfilePage() {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();
  const provider = MOCK_PROVIDERS.find(p => p.id === providerId);

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Prestataire introuvable.</p>
          <Button onClick={() => navigate(-1)} variant="outline">Retour</Button>
        </div>
      </div>
    );
  }

  const avatar = provider.avatar || `${AVATAR}${encodeURIComponent(provider.name)}&background=1B6B3A&color=fff&size=200`;

  function openWhatsApp() {
    window.open(`https://wa.me/${provider.whatsapp.replace(/\s/g, '')}`, '_blank');
  }

  function callProvider() {
    window.open(`tel:${provider.phone}`, '_self');
  }

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(provider.rating));

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <div className="relative" style={{ background: 'linear-gradient(135deg, #1B4332, #1B6B3A)', paddingBottom: '80px' }}>
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 text-white mb-6">
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className="max-w-2xl mx-auto px-4 flex items-end gap-4">
          <img src={avatar} alt={provider.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg flex-shrink-0" />
          <div className="pb-2">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-white font-black text-2xl">{provider.name}</h1>
              {provider.verified && <ShieldCheck size={18} className="text-green-300" />}
            </div>
            <p className="text-green-200 font-medium">{provider.category}</p>
            <div className="flex items-center gap-1 mt-1">
              {stars.map((filled, i) => (
                <Star key={i} size={13} className={filled ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'} />
              ))}
              <span className="text-white/80 text-xs ml-1">{provider.rating} ({provider.reviewCount} avis)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content card */}
      <div className="max-w-2xl mx-auto px-4 -mt-12 space-y-4 pb-8">
        {/* Quick info */}
        <div className="card p-5">
          <div className="grid grid-cols-3 divide-x divide-gray-100 text-center">
            <div>
              <p className="text-primary font-black text-xl">{provider.rating}</p>
              <p className="text-xs text-gray-500">Note</p>
            </div>
            <div>
              <p className="text-primary font-black text-xl">{provider.experience}</p>
              <p className="text-xs text-gray-500">Ans exp.</p>
            </div>
            <div>
              <p className="text-primary font-black text-xl">{provider.reviewCount}</p>
              <p className="text-xs text-gray-500">Avis</p>
            </div>
          </div>
        </div>

        {/* Location & Price */}
        <div className="card p-5 flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} className="text-primary" />
            <span className="text-sm">{provider.city}, {provider.country}</span>
          </div>
          <div className="text-right">
            <span className="text-primary font-black text-xl">{provider.price.toLocaleString()}</span>
            <span className="text-gray-400 text-xs ml-1">{provider.priceUnit}</span>
          </div>
        </div>

        {/* About */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Briefcase size={16} className="text-primary" /> À propos
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">{provider.bio}</p>
        </div>

        {/* Skills */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-3">Compétences</h2>
          <div className="flex flex-wrap gap-2">
            {provider.skills.map(skill => (
              <span key={skill} className="flex items-center gap-1 bg-primary/8 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                <CheckCircle2 size={11} /> {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Availability badge */}
        <div className={`card p-4 flex items-center gap-3 ${provider.available ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
          <div className={`w-3 h-3 rounded-full ${provider.available ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
          <span className={`text-sm font-semibold ${provider.available ? 'text-green-700' : 'text-gray-500'}`}>
            {provider.available ? 'Disponible maintenant' : 'Actuellement indisponible'}
          </span>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={callProvider} variant="outline" size="lg" className="flex-col gap-1 py-4">
            <Phone size={18} />
            <span className="text-xs">Appeler</span>
          </Button>
          <button onClick={openWhatsApp}
            className="flex flex-col items-center justify-center gap-1 py-4 rounded-xl font-semibold text-white transition-all active:scale-95"
            style={{ backgroundColor: '#25D366' }}>
            <MessageCircle size={18} />
            <span className="text-xs">WhatsApp</span>
          </button>
        </div>

        <Button
          fullWidth size="lg"
          onClick={() => navigate(`/booking/${provider.id}`, { state: { provider } })}
          disabled={!provider.available}
        >
          {provider.available ? 'Réserver maintenant' : 'Prestataire indisponible'}
        </Button>
      </div>
    </div>
  );
}
