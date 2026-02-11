
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  LogOut, 
  User as UserIcon, 
  ShieldCheck, 
  Monitor,
  Bell,
  Lock,
  Globe,
  Link as LinkIcon,
  Copy,
  Check
} from 'lucide-react';
import { User } from '../types';

interface NexusSettingsProps {
  user: User;
  onLogout: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

const NexusSettings: React.FC<NexusSettingsProps> = ({ 
  user, 
  onLogout, 
  language, 
  setLanguage, 
  theme, 
  setTheme 
}) => {
  const [notifications, setNotifications] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const translations: any = {
    fr: {
      title: "Paramètres",
      appearance: "Apparence",
      theme: "Thème du Nexus",
      light: "Clair",
      dark: "Sombre",
      langTitle: "Langue du Système",
      account: "Compte & Sécurité",
      credits: "Crédits restants",
      logout: "Se déconnecter",
      notifications: "Notifications Push",
      privacy: "Confidentialité",
      status: "Statut du compte",
      siteLink: "Lien du Nexus",
      copyLink: "Copier l'URL"
    },
    en: {
      title: "Settings",
      appearance: "Appearance",
      theme: "Nexus Theme",
      light: "Light",
      dark: "Dark",
      langTitle: "System Language",
      account: "Account & Security",
      credits: "Remaining Credits",
      logout: "Log Out",
      notifications: "Push Notifications",
      privacy: "Privacy",
      status: "Account Status",
      siteLink: "Nexus Link",
      copyLink: "Copy URL"
    }
  };

  const t = translations[language] || translations.fr;

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    if ('vibrate' in navigator) navigator.vibrate(20);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
            theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200 shadow-sm'
          }`}>
            <SettingsIcon className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h1 className={`text-3xl font-heading font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{t.title}</h1>
            <p className="text-zinc-500 text-sm">Personnalisez votre interface Nexus.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20 md:pb-0">
          {/* Apparence */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Monitor className="w-4 h-4" /> {t.appearance}
            </h3>
            
            <div className={`glass p-6 rounded-3xl border space-y-6 ${
              theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200 shadow-xl shadow-zinc-200/50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}>{t.theme}</span>
                </div>
                <div className={`flex p-1 rounded-xl border ${
                  theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
                }`}>
                  <button 
                    onClick={() => setTheme('light')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      theme === 'light' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {t.light}
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      theme === 'dark' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {t.dark}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-indigo-500" />
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}>{t.langTitle}</span>
                </div>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`border text-xs font-bold rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
                  }`}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-indigo-500" />
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}>{t.notifications}</span>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-all relative ${notifications ? 'bg-indigo-600' : 'bg-zinc-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </section>

          {/* Compte */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <UserIcon className="w-4 h-4" /> {t.account}
            </h3>
            
            <div className={`glass p-6 rounded-3xl border space-y-6 ${
              theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200 shadow-xl shadow-zinc-200/50'
            }`}>
              <div className="flex items-center gap-4">
                <img src={user.avatar} alt="Avatar" className="w-16 h-16 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl" />
                <div>
                  <h4 className={`font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                    {user.username}
                    {user.tier === 'elite' && <ShieldCheck className="w-4 h-4 text-amber-500" />}
                  </h4>
                  <p className="text-xs text-zinc-500">{user.email}</p>
                </div>
              </div>

              {/* Site URL Sharing */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-zinc-500 mb-1">
                   <LinkIcon className="w-3.5 h-3.5" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">{t.siteLink}</span>
                </div>
                <div className={`flex items-center justify-between p-3 rounded-xl border ${
                  theme === 'dark' ? 'bg-zinc-950/50 border-zinc-800' : 'bg-zinc-50 border-zinc-100'
                }`}>
                  <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[150px]">{window.location.origin}</span>
                  <button 
                    onClick={copyUrl}
                    className={`p-1.5 rounded-lg transition-all ${
                      copiedLink ? 'bg-emerald-500/10 text-emerald-500' : 'hover:bg-indigo-500/10 text-indigo-500'
                    }`}
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className={`pt-4 border-t space-y-3 ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-100'}`}>
                <button className={`w-full py-3 px-4 border rounded-xl text-xs font-bold flex items-center gap-3 transition-all ${
                  theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800' : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                }`}>
                  <Lock className="w-4 h-4" /> {t.privacy}
                </button>
                <button 
                  onClick={onLogout}
                  className="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-xs font-bold text-red-500 flex items-center gap-3 transition-all"
                >
                  <LogOut className="w-4 h-4" /> {t.logout}
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="p-8 text-center space-y-2 opacity-50">
          <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase">Nexus Core v2.5.1 — Distribution Build</p>
          <p className="text-[10px] text-zinc-500">© 2024 Nexus IA Technologies. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default NexusSettings;
