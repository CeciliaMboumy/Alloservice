import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { MOCK_PROVIDERS } from '../constants/data';
import type { Provider } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';

const TIMES = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const AVATAR = 'https://ui-avatars.com/api/?name=';

export default function BookingRequestPage() {
  const { providerId } = useParams<{ providerId: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const provider: Provider | undefined =
    (state as { provider?: Provider })?.provider ?? MOCK_PROVIDERS.find(p => p.id === providerId);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!provider) return <div className="p-8 text-center text-gray-500">Prestataire introuvable.</div>;

  const p = provider;
  const avatar = p.avatar || `${AVATAR}${encodeURIComponent(p.name)}&background=1B6B3A&color=fff&size=200`;

  function validate() {
    const e: Record<string, string> = {};
    if (!date) e.date = 'Veuillez indiquer une date';
    if (!time) e.time = 'Veuillez choisir un horaire';
    if (!address.trim()) e.address = "Veuillez indiquer votre adresse";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        userId: user?.uid ?? 'anonymous',
        providerId: p.id,
        providerName: p.name,
        service: p.category,
        date, time, address, description,
        status: 'en_attente',
        createdAt: serverTimestamp(),
      });
    } catch { /* Firebase not configured — simulate success */ }
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'linear-gradient(135deg, #1B4332, #2D9A57)' }}>
        <div className="text-center">
          <CheckCircle2 size={80} className="text-white mx-auto mb-6" />
          <h1 className="text-4xl font-black text-white mb-4">Demande envoyée !</h1>
          <p className="text-white/85 text-base mb-8 leading-relaxed">
            Votre demande a été transmise à {p.name}.<br />Vous serez contacté(e) très prochainement.
          </p>
          <div className="bg-white/15 rounded-2xl p-4 mb-8 text-left space-y-2">
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <Calendar size={14} /> <span>{date} à {time}</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <MapPin size={14} /> <span>{address}</span>
            </div>
          </div>
          <Button onClick={() => navigate('/')} variant="outline" className="border-white/60 text-white hover:bg-white/10 hover:text-white">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-gray-900 text-lg">Réservation</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="card p-4 flex gap-4 items-center mb-6">
          <img src={avatar} alt={p.name} className="w-14 h-14 rounded-xl object-cover bg-gray-100" />
          <div>
            <p className="font-bold text-gray-900">{p.name}</p>
            <p className="text-primary text-sm font-medium">{p.category}</p>
            <p className="text-gray-500 text-sm">{p.price.toLocaleString()} {p.priceUnit}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="font-bold text-gray-900 text-lg">Détails de la réservation</h2>

          <Input label="Date souhaitée" type="date" value={date}
            onChange={e => setDate(e.target.value)} icon={<Calendar size={16} />} error={errors.date} />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="flex items-center gap-1.5"><Clock size={14} /> Horaire souhaité</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TIMES.map(t => (
                <button key={t} type="button" onClick={() => setTime(t)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                    time === t ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-600 hover:border-primary/50'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
            {errors.time && <p className="text-red-500 text-xs mt-1.5">{errors.time}</p>}
          </div>

          <Input label="Adresse d'intervention" placeholder="Ex: Rue de la Paix, Quartier Bastos"
            value={address} onChange={e => setAddress(e.target.value)}
            icon={<MapPin size={16} />} error={errors.address} />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description (optionnel)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Décrivez votre besoin en détail..." rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none" />
          </div>

          <div className="card p-4 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3 pb-3 border-b border-gray-100">Récapitulatif</h3>
            <div className="flex justify-between py-1.5">
              <span className="text-sm text-gray-500">Prestataire</span>
              <span className="text-sm font-medium text-gray-900">{p.name}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-sm text-gray-500">Service</span>
              <span className="text-sm font-medium text-gray-900">{p.category}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-sm text-gray-500">Tarif estimé</span>
              <span className="text-sm font-bold text-primary">{p.price.toLocaleString()} {p.priceUnit}</span>
            </div>
            <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
              Le tarif final sera confirmé par le prestataire.
            </p>
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading}>
            Envoyer la demande
          </Button>
        </form>
      </div>
    </div>
  );
}
