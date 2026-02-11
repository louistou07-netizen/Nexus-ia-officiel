
import React, { useState } from 'react';
import { 
  Zap, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck as ShieldIcon 
} from 'lucide-react';
import { User as UserType } from '../types';

interface AuthProps {
  onLogin: (user: UserType) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const CREATOR_EMAILS = ['louistou07@gmail.com', 'louis.toupin@icloud.com'];
  const CREATOR_USERNAME = 'the_creator';

  const getUsers = (): UserType[] => {
    const users = localStorage.getItem('nexus_users_db');
    return users ? JSON.parse(users) : [];
  };

  const saveUser = (user: UserType) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('nexus_users_db', JSON.stringify(users));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    setTimeout(() => {
      const users = getUsers();
      const emailLower = formData.email.toLowerCase();
      
      if (isLogin) {
        let existingUser = users.find(u => u.email.toLowerCase() === emailLower);
        
        if (existingUser) {
          if (CREATOR_EMAILS.includes(existingUser.email.toLowerCase())) {
            existingUser.tier = 'elite';
            existingUser.credits = 999999;
            existingUser.username = CREATOR_USERNAME;
          }
          existingUser.lastActive = Date.now();
          localStorage.setItem('nexus_user', JSON.stringify(existingUser));
          setSuccess(true);
          setTimeout(() => onLogin(existingUser), 800);
        } else {
          setError("Accès refusé. E-mail inconnu.");
          setIsLoading(false);
        }
      } else {
        if (users.some(u => u.username.toLowerCase() === formData.username.toLowerCase())) {
          setError("Ce pseudo est déjà existant. Choisissez-en un autre.");
          setIsLoading(false);
          return;
        }

        if (users.some(u => u.email.toLowerCase() === emailLower)) {
          setError("Cet e-mail est déjà enregistré dans le Nexus.");
          setIsLoading(false);
          return;
        }

        const isCreator = CREATOR_EMAILS.includes(emailLower);
        
        const newUser: UserType = {
          id: 'user_' + Math.random().toString(36).substr(2, 9),
          username: isCreator ? CREATOR_USERNAME : (formData.username || 'NexusUser'),
          email: formData.email,
          tier: isCreator ? 'elite' : 'basic',
          credits: isCreator ? 999999 : 50,
          avatar: isCreator 
            ? `https://api.dicebear.com/7.x/bottts/svg?seed=creator&backgroundColor=b6e3f4`
            : `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username || formData.email}`,
          lastActive: Date.now(),
          registeredAt: Date.now()
        };
        
        saveUser(newUser);
        localStorage.setItem('nexus_user', JSON.stringify(newUser));
        setSuccess(true);
        setTimeout(() => onLogin(newUser), 800);
      }
    }, 1200);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    const demoUser: UserType = {
      id: 'demo_123',
      username: 'Invité Nexus',
      email: 'demo@nexus.ia',
      tier: 'basic',
      credits: 99,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=demo`,
      lastActive: Date.now(),
      registeredAt: Date.now()
    };
    setTimeout(() => {
      localStorage.setItem('nexus_user', JSON.stringify(demoUser));
      onLogin(demoUser);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#312e81_0%,_#09090b_100%)] opacity-40"></div>
      
      <div className="w-full max-w-md relative">
        <div className="glass p-8 rounded-3xl border border-zinc-800 shadow-2xl space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 neon-border">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-heading font-bold tracking-tight text-white">NEXUS IA</h1>
              <p className="text-zinc-500 text-sm mt-1">L'intelligence artificielle sans limites</p>
            </div>
          </div>

          {(CREATOR_EMAILS.includes(formData.email.toLowerCase())) && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-2 animate-pulse">
              <ShieldIcon className="w-4 h-4" /> Identification Créateur : Autorisation Prioritaire.
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 animate-bounce">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Système prêt. Bonjour, Louis.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Pseudo unique"
                    required
                    autoFocus
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-1">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="email"
                  placeholder="votre@email.com"
                  required
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  required
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button
              disabled={isLoading || success}
              className={`w-full py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50 shadow-lg ${
                CREATOR_EMAILS.includes(formData.email.toLowerCase())
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20' 
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20 text-white'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Accéder au Nexus' : "S'enregistrer"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="flex flex-col gap-4 pt-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-950 px-2 text-zinc-500">Sécurité</span></div>
            </div>

            <button 
              onClick={handleDemoLogin}
              type="button"
              className="w-full py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-xl font-medium transition-all"
            >
              Mode Démo (Limité)
            </button>

            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="text-sm text-zinc-500 hover:text-indigo-400 transition-colors"
            >
              {isLogin ? "Nouveau ? Créer un accès" : "Déjà membre ? Connexion"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
