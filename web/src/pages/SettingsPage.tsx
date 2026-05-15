import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, Megaphone, MapPin, Shield, FileText, PlayCircle, HelpCircle, Star, Info, Trash2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type ToggleSetting = { key: string; label: string; sub: string; icon: LucideIcon; type: 'toggle'; value: boolean; onChange: (v: boolean) => void };
type LinkSetting   = { key: string; label: string; sub?: string; icon: LucideIcon; type: 'link' | 'action'; color?: string; onPress: () => void };
type Setting = ToggleSetting | LinkSetting;

export default function SettingsPage() {
  const navigate = useNavigate();
  const [notifs, setNotifs]   = useState(true);
  const [booking, setBooking] = useState(true);
  const [promo, setPromo]     = useState(false);
  const [location, setLocation] = useState(true);

  const sections: { title: string; items: Setting[] }[] = [
    {
      title: 'Notifications',
      items: [
        { key: 'notifs',  label: 'Notifications push',     sub: "Activer les notifications de l'application", icon: Bell,     type: 'toggle', value: notifs,   onChange: setNotifs },
        { key: 'booking', label: 'Alertes réservations',   sub: 'Confirmations et rappels',                   icon: Calendar, type: 'toggle', value: booking,  onChange: setBooking },
        { key: 'promo',   label: 'Offres promotionnelles', sub: 'Nouveaux prestataires et promotions',        icon: Megaphone,type: 'toggle', value: promo,    onChange: setPromo },
      ],
    },
    {
      title: 'Confidentialité',
      items: [
        { key: 'location', label: 'Localisation',               sub: "Permettre à AlloService d'accéder à votre position", icon: MapPin,   type: 'toggle', value: location, onChange: setLocation },
        { key: 'privacy',  label: 'Politique de confidentialité',                                                            icon: Shield,   type: 'link',   onPress: () => {} },
        { key: 'terms',    label: "Conditions d'utilisation",                                                                icon: FileText, type: 'link',   onPress: () => {} },
      ],
    },
    {
      title: 'Application',
      items: [
        { key: 'onboarding', label: "Revoir l'introduction",       icon: PlayCircle, type: 'action', onPress: () => { localStorage.removeItem('onboarding_done'); navigate('/onboarding'); } },
        { key: 'help',       label: "Centre d'aide",               icon: HelpCircle, type: 'link',   onPress: () => {} },
        { key: 'feedback',   label: 'Donner votre avis',           icon: Star,       type: 'link',   onPress: () => {} },
        { key: 'about',      label: "À propos d'AlloService",      icon: Info,       type: 'link',   sub: 'Version 1.0.0', onPress: () => {} },
      ],
    },
    {
      title: 'Compte',
      items: [
        { key: 'delete', label: 'Supprimer mon compte', icon: Trash2, type: 'action', color: '#DC2626',
          onPress: () => { if (window.confirm('Cette action est irréversible. Toutes vos données seront supprimées.')) {} } },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-gray-900 text-lg flex-1 text-center">Paramètres</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {sections.map(section => (
          <div key={section.title}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">{section.title}</p>
            <div className="card overflow-hidden">
              {section.items.map((item, i) => {
                const color = 'color' in item ? item.color : undefined;
                const IconColor = color ?? '#1B6B3A';
                return (
                  <div key={item.key}
                    className={`flex items-center gap-3 px-4 py-3.5 ${i < section.items.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: IconColor + '15' }}>
                      <item.icon size={17} style={{ color: IconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: color ?? '#1A1A1A' }}>{item.label}</p>
                      {item.sub && <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>}
                    </div>
                    {item.type === 'toggle' ? (
                      <button
                        role="switch" aria-checked={item.value}
                        onClick={() => (item as ToggleSetting).onChange(!item.value)}
                        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${item.value ? 'bg-primary' : 'bg-gray-200'}`}>
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${item.value ? 'translate-x-5' : ''}`} />
                      </button>
                    ) : (
                      <button onClick={(item as LinkSetting).onPress} className="text-gray-300 hover:text-gray-400">›</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <p className="text-center text-xs text-gray-400 py-2">AlloService v1.0.0 · Fait avec ❤️ pour l'Afrique</p>
      </div>
    </div>
  );
}
