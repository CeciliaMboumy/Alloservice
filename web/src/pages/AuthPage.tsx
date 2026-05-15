import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { CITIES } from '../constants/data';

type Mode = 'login' | 'signup';
type Role = 'client' | 'prestataire';

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [role, setRole] = useState<Role>('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Douala');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  function validate() {
    const e: Record<string, string> = {};
    if (!email) e.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email invalide';
    if (!password) e.password = 'Mot de passe requis';
    else if (password.length < 6) e.password = 'Minimum 6 caractères';
    if (mode === 'signup') {
      if (!name.trim()) e.name = 'Nom requis';
      if (!phone) e.phone = 'Téléphone requis';
      if (password !== confirm) e.confirm = 'Les mots de passe ne correspondent pas';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setGlobalError('');
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password, name, phone, city, role);
      }
      navigate('/');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      setGlobalError(
        code === 'auth/user-not-found' || code === 'auth/wrong-password' ? 'Email ou mot de passe incorrect' :
        code === 'auth/email-already-in-use' ? 'Cet email est déjà utilisé' :
        code === 'auth/network-request-failed' ? 'Erreur réseau. Vérifiez votre connexion.' :
        'Une erreur est survenue. Réessayez.'
      );
    } finally {
      setLoading(false);
    }
  }

  function switchMode(m: Mode) { setMode(m); setErrors({}); setGlobalError(''); }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="py-16 px-6 text-center" style={{ background: 'linear-gradient(135deg, #1B6B3A, #2D9A57)' }}>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">AlloService</h1>
        <p className="text-white/80 italic">Vos services, à portée de main</p>
      </div>

      {/* Form card */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 px-6 py-8 max-w-lg mx-auto w-full">
        {/* Tab switcher */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
          {(['login', 'signup'] as Mode[]).map(m => (
            <button key={m} onClick={() => switchMode(m)}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${mode === m ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
            >
              {m === 'login' ? 'Connexion' : 'Inscription'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {mode === 'signup' && (
            <>
              {/* Role */}
              <p className="text-sm font-semibold text-gray-700 mb-2">Je suis :</p>
              <div className="flex gap-3 mb-5">
                {(['client', 'prestataire'] as Role[]).map(r => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all flex items-center justify-center gap-2
                      ${role === r ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-500'}`}
                  >
                    <span>{r === 'client' ? '👤' : '🛠️'}</span>
                    {r === 'client' ? 'Client' : 'Prestataire'}
                  </button>
                ))}
              </div>

              <Input label="Nom complet" placeholder="Ex: Marie Nguema" value={name}
                onChange={e => setName(e.target.value)} icon={<User size={16} />} error={errors.name} autoComplete="name" />
              <Input label="Téléphone / WhatsApp" placeholder="+237 6XX XXX XXX" value={phone}
                onChange={e => setPhone(e.target.value)} icon={<Phone size={16} />} error={errors.phone} type="tel" />

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ville</label>
                <select value={city} onChange={e => setCity(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </>
          )}

          <Input label="Adresse email" placeholder="votre@email.com" value={email} type="email"
            onChange={e => setEmail(e.target.value)} icon={<Mail size={16} />} error={errors.email} autoComplete="email" />
          <Input label="Mot de passe" placeholder="Minimum 6 caractères" value={password}
            onChange={e => setPassword(e.target.value)} icon={<Lock size={16} />} error={errors.password}
            isPassword autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          {mode === 'signup' && (
            <Input label="Confirmer le mot de passe" placeholder="Répétez votre mot de passe" value={confirm}
              onChange={e => setConfirm(e.target.value)} icon={<Lock size={16} />} error={errors.confirm} isPassword />
          )}

          {globalError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{globalError}</div>
          )}

          <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
            {mode === 'login' ? 'Se connecter' : "S'inscrire"}
          </Button>
        </form>

        {mode === 'login' && (
          <button className="w-full text-center text-primary text-sm font-medium mt-4 hover:underline">
            Mot de passe oublié ?
          </button>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          {mode === 'login' ? "Pas encore de compte ? " : 'Déjà un compte ? '}
          <button onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
            className="text-primary font-bold hover:underline">
            {mode === 'login' ? "S'inscrire" : 'Se connecter'}
          </button>
        </p>
      </div>
    </div>
  );
}
