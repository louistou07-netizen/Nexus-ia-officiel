
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Palette, 
  Mic2, 
  ScanSearch, 
  Settings as SettingsIcon,
  Zap,
  Crown,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import NexusChat from './components/NexusChat';
import NexusCanvas from './components/NexusCanvas';
import NexusVoice from './components/NexusVoice';
import NexusLens from './components/NexusLens';
import NexusSettings from './components/NexusSettings';
import NexusAdmin from './components/NexusAdmin';
import Auth from './components/Auth';
import NexusAd from './components/NexusAd';
import { NexusModule, User } from './types';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<NexusModule>(NexusModule.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  
  const [theme, setTheme] = useState<'dark' | 'light'>(
    (localStorage.getItem('nexus_theme') as 'dark' | 'light') || 'dark'
  );
  const [language, setLanguage] = useState<string>(
    localStorage.getItem('nexus_lang') || 'fr'
  );

  const CREATOR_EMAILS = ['louistou07@gmail.com', 'louis.toupin@icloud.com'];

  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      const currentVisits = parseInt(localStorage.getItem('nexus_total_visits') || '0');
      localStorage.setItem('nexus_total_visits', (currentVisits + 1).toString());
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const updateActivity = () => {
      const users = JSON.parse(localStorage.getItem('nexus_users_db') || '[]');
      const updatedUsers = users.map((u: User) => {
        if (u.email.toLowerCase() === user.email.toLowerCase()) {
          return { ...u, lastActive: Date.now() };
        }
        return u;
      });
      localStorage.setItem('nexus_users_db', JSON.stringify(updatedUsers));
      const currentUserInDb = updatedUsers.find((u: User) => u.email.toLowerCase() === user.email.toLowerCase());
      if (currentUserInDb) {
        localStorage.setItem('nexus_user', JSON.stringify(currentUserInDb));
      }
    };
    updateActivity();
    const interval = setInterval(updateActivity, 30000);
    return () => clearInterval(interval);
  }, [user?.email]);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('nexus_theme', theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem('nexus_user');
    setUser(null);
    setActiveModule(NexusModule.DASHBOARD);
  };

  const deductCredits = (amount: number): boolean => {
    if (!user) return false;
    if (user.tier === 'elite') return true;
    if (user.credits < amount) {
      alert(language === 'fr' ? "Crédits insuffisants !" : "Insufficient credits!");
      return false;
    }
    const updatedUser = { ...user, credits: user.credits - amount };
    setUser(updatedUser);
    localStorage.setItem('nexus_user', JSON.stringify(updatedUser));
    const users = JSON.parse(localStorage.getItem('nexus_users_db') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('nexus_users_db', JSON.stringify(users));
    }
    // Simulation haptique
    if ('vibrate' in navigator) navigator.vibrate(50);
    return true;
  };

  const translations: any = {
    fr: {
      dashboard: 'Console',
      chat: 'Nexus Chat',
      canvas: 'Nexus Canvas',
      voice: 'Nexus Voice',
      lens: 'Nexus Lens',
      settings: 'Paramètres',
      admin: 'Master Admin',
      logout: 'Déconnexion',
      collapse: 'Réduire'
    },
    en: {
      dashboard: 'Console',
      chat: 'Nexus Chat',
      canvas: 'Nexus Canvas',
      voice: 'Nexus Voice',
      lens: 'Nexus Lens',
      settings: 'Settings',
      admin: 'Master Admin',
      logout: 'Log Out',
      collapse: 'Collapse'
    }
  };

  const t = translations[language] || translations.fr;
  const isCreator = user && CREATOR_EMAILS.includes(user.email.toLowerCase());

  const navItems = [
    { id: NexusModule.DASHBOARD, label: t.dashboard, icon: LayoutDashboard },
    { id: NexusModule.CHAT, label: t.chat, icon: MessageSquare },
    { id: NexusModule.CANVAS, label: t.canvas, icon: Palette },
    { id: NexusModule.VOICE, label: t.voice, icon: Mic2 },
    { id: NexusModule.LENS, label: t.lens, icon: ScanSearch },
    ...(isCreator ? [{ id: NexusModule.ADMIN, label: t.admin, icon: ShieldAlert }] : []),
    { id: NexusModule.SETTINGS, label: t.settings, icon: SettingsIcon },
  ];

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  const renderContent = () => {
    switch (activeModule) {
      case NexusModule.DASHBOARD: return <Dashboard onNavigate={setActiveModule} user={user} language={language} />;
      case NexusModule.CHAT: return <NexusChat language={language} user={user} deductCredits={deductCredits} />;
      case NexusModule.CANVAS: return <NexusCanvas language={language} user={user} deductCredits={deductCredits} />;
      case NexusModule.VOICE: return <NexusVoice language={language} user={user} deductCredits={deductCredits} />;
      case NexusModule.LENS: return <NexusLens language={language} user={user} deductCredits={deductCredits} />;
      case NexusModule.ADMIN: return isCreator ? <NexusAdmin language={language} /> : <Dashboard onNavigate={setActiveModule} user={user} language={language} />;
      case NexusModule.SETTINGS: return (
        <NexusSettings 
          user={user} 
          onLogout={handleLogout} 
          language={language} 
          setLanguage={setLanguage}
          theme={theme}
          setTheme={setTheme}
        />
      );
      default: return <Dashboard onNavigate={setActiveModule} user={user} language={language} />;
    }
  };

  return (
    <div className={`flex flex-col md:flex-row h-screen overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
    }`}>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col transition-all duration-300 border-r z-50 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } ${
          theme === 'dark' ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-zinc-200 shadow-sm'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center neon-border flex-shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {isSidebarOpen && (
              <span className={`font-heading font-bold text-xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                NEXUS IA
              </span>
            )}
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveModule(item.id);
                if ('vibrate' in navigator) navigator.vibrate(10);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                activeModule === item.id 
                  ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm' 
                  : theme === 'dark'
                    ? 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                    : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${activeModule === item.id ? 'text-indigo-600' : ''}`} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
          {user.tier === 'basic' && isSidebarOpen && <NexusAd type="sidebar" />}
        </nav>

        <div className={`p-4 border-t space-y-2 ${theme === 'dark' ? 'border-zinc-900' : 'border-zinc-100'}`}>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all ${
              theme === 'dark' ? 'bg-zinc-900/50 hover:bg-zinc-800' : 'bg-zinc-100 hover:bg-zinc-200'
            } ${!isSidebarOpen && 'justify-center'}`}
          >
            {isSidebarOpen ? (
              <><ChevronLeft className="w-4 h-4 text-zinc-500" /><span className="text-xs font-medium text-zinc-500">{t.collapse}</span></>
            ) : (
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            )}
          </button>
          <button 
            onClick={() => setActiveModule(NexusModule.SETTINGS)}
            className={`flex items-center gap-3 p-2 rounded-xl transition-all w-full text-left ${
              theme === 'dark' ? 'hover:bg-zinc-900' : 'hover:bg-zinc-100'
            } ${!isSidebarOpen && 'justify-center'}`}
          >
            <img src={user.avatar} className="w-8 h-8 rounded-full border border-indigo-500/30" alt="Avatar" />
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className={`text-xs font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{user.username}</p>
                <p className="text-[10px] text-indigo-500 flex items-center gap-1">
                  {user.tier === 'elite' ? <Crown className="w-3 h-3" /> : null}
                  {user.credits === 999999 ? '∞' : user.credits} {language === 'fr' ? 'Crédits' : 'Credits'}
                </p>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 relative flex flex-col overflow-hidden transition-all duration-300 ${
        theme === 'dark' 
        ? 'bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_#09090b_70%)]' 
        : 'bg-zinc-50'
      }`}>
        <div className="absolute inset-0 bg-grid-zinc-900/[0.02] dark:bg-grid-white/[0.02] pointer-events-none"></div>
        <div className="flex-1 overflow-y-auto safe-pt">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Tab Bar */}
      <nav className={`md:hidden safe-pb flex justify-around items-center h-16 border-t z-[100] backdrop-blur-xl ${
        theme === 'dark' ? 'bg-zinc-950/80 border-zinc-900' : 'bg-white/80 border-zinc-200'
      }`}>
        {navItems.filter(item => item.id !== NexusModule.ADMIN && item.id !== NexusModule.SETTINGS).map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveModule(item.id);
              if ('vibrate' in navigator) navigator.vibrate(10);
            }}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${
              activeModule === item.id 
                ? 'text-indigo-600 dark:text-indigo-400 scale-110' 
                : 'text-zinc-400'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase tracking-tighter">{item.label.split(' ')[1] || item.label}</span>
          </button>
        ))}
        {/* Settings Button on Mobile */}
        <button
          onClick={() => {
            setActiveModule(NexusModule.SETTINGS);
            if ('vibrate' in navigator) navigator.vibrate(10);
          }}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${
            activeModule === NexusModule.SETTINGS 
              ? 'text-indigo-600 dark:text-indigo-400 scale-110' 
              : 'text-zinc-400'
          }`}
        >
          <img src={user.avatar} className={`w-6 h-6 rounded-full border ${activeModule === NexusModule.SETTINGS ? 'border-indigo-500' : 'border-transparent'}`} />
          <span className="text-[9px] font-bold uppercase tracking-tighter">{t.settings.split(' ')[0]}</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
