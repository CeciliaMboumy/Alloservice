import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    emoji: '🌍',
    title: 'Bienvenue sur AlloService',
    subtitle: "La plateforme qui connecte les habitants d'Afrique francophone avec des prestataires de services fiables près de chez vous.",
    from: '#1B6B3A', to: '#2D9A57',
  },
  {
    emoji: '🔍',
    title: 'Trouvez le bon professionnel',
    subtitle: "Ménage, plomberie, coiffure, électricité, maquillage et bien plus encore. Des centaines de prestataires vérifiés à votre service.",
    from: '#F4A823', to: '#E85D26',
  },
  {
    emoji: '⭐',
    title: 'Réservez en toute confiance',
    subtitle: "Consultez les avis, comparez les prix et contactez directement par WhatsApp. Simple, rapide et sécurisé.",
    from: '#1565C0', to: '#1976D2',
  },
  {
    emoji: '📱',
    title: 'Disponible dans 4 pays',
    subtitle: "Cameroun, Côte d'Ivoire, Sénégal et Congo. AlloService grandit avec vous, partout en Afrique francophone.",
    from: '#1B6B3A', to: '#134D2A',
  },
];

export default function OnboardingPage() {
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();
  const slide = SLIDES[idx];

  function finish() {
    localStorage.setItem('onboarding_done', 'true');
    navigate('/auth');
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: `linear-gradient(135deg, ${slide.from}, ${slide.to})` }}>
      {/* Slide */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center py-16">
        <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center mb-10 text-6xl">
          {slide.emoji}
        </div>
        <h1 className="text-4xl font-black text-white mb-5 leading-tight">{slide.title}</h1>
        <p className="text-white/85 text-lg leading-relaxed max-w-sm">{slide.subtitle}</p>
      </div>

      {/* Controls */}
      <div className="px-8 pb-12">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-10">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`rounded-full transition-all ${i === idx ? 'w-7 h-2 bg-white' : 'w-2 h-2 bg-white/40'}`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button onClick={finish} className="text-white/70 font-medium text-base px-2 py-2">
            Passer
          </button>
          <button
            onClick={() => idx < SLIDES.length - 1 ? setIdx(i => i + 1) : finish()}
            className="bg-white text-gray-800 font-bold px-8 py-3.5 rounded-2xl flex items-center gap-2 hover:bg-white/90 transition-all active:scale-95"
          >
            {idx === SLIDES.length - 1 ? 'Commencer' : 'Suivant'}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
