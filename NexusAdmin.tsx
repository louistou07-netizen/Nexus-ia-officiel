
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Globe, 
  Activity, 
  ShieldAlert, 
  Eye, 
  UserPlus, 
  UserMinus, 
  TrendingUp, 
  Search,
  RefreshCw,
  Crown,
  Lock,
  Mail,
  Calendar,
  CreditCard,
  Settings,
  Save,
  Check,
  Link as LinkIcon
} from 'lucide-react';
import { User } from '../types';

interface NexusAdminProps {
  language: string;
}

const NexusAdmin: React.FC<NexusAdminProps> = ({ language }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [officialUrl, setOfficialUrl] = useState(localStorage.getItem('nexus_official_url') || window.location.origin);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [stats, setStats] = useState({
    totalVisits: 0,
    totalUsers: 0,
    onlineUsers: 0,
    offlineUsers: 0,
    eliteUsers: 0
  });
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = () => {
    setIsRefreshing(true);
    const dbUsers = JSON.parse(localStorage.getItem('nexus_users_db') || '[]');
    const visits = parseInt(localStorage.getItem('nexus_total_visits') || '0');
    
    const onlineThreshold = Date.now() - (5 * 60 * 1000);
    const online = dbUsers.filter((u: User) => u.lastActive && u.lastActive > onlineThreshold).length;
    const elite = dbUsers.filter((u: User) => u.tier === 'elite').length;

    setUsers(dbUsers);
    setStats({
      totalVisits: visits,
      totalUsers: dbUsers.length,
      onlineUsers: online,
      offlineUsers: dbUsers.length - online,
      eliteUsers: elite
    });

    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleSaveConfig = () => {
    localStorage.setItem('nexus_official_url', officialUrl);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
    if ('vibrate' in navigator) navigator.vibrate(50);
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const translations: any = {
    fr: {
      title: "Nexus Master Console",
      subtitle: "Gestion de l'infrastructure et monitoring temps réel",
      v_total: "Visites Totales",
      u_total: "Utilisateurs",
      u_online: "En Ligne",
      u_offline: "Hors Ligne",
      u_elite: "Membres Elite",
      sys_config: "Configuration Système",
      url_label: "URL Officielle du Nexus",
      url_help: "Cette URL sera utilisée pour les fonctions de partage et les invitations.",
      save: "Sauvegarder la Config",
      search: "Rechercher une entité...",
      table_user: "Utilisateur",
      table_status: "Statut",
      table_credits: "Crédits",
      table_tier: "Grade",
      table_active: "Dernière Activité",
      online: "Actif",
      offline: "Inactif",
      refresh: "Actualiser"
    },
    en: {
      title: "Nexus Master Console",
      subtitle: "Infrastructure management and real-time monitoring",
      v_total: "Total Visits",
      u_total: "Total Users",
      u_online: "Online",
      u_offline: "Offline",
      u_elite: "Elite Members",
      sys_config: "System Configuration",
      url_label: "Official Nexus URL",
      url_help: "This URL will be used for sharing functions and invitations.",
      save: "Save Config",
      search: "Search entity...",
      table_user: "User",
      table_status: "Status",
      table_credits: "Credits",
      table_tier: "Tier",
      table_active: "Last Activity",
      online: "Active",
      offline: "Inactive",
      refresh: "Refresh"
    }
  };

  const t = translations[language] || translations.fr;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-in fade-in duration-700 relative z-10 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-xl shadow-red-600/20 border border-red-500/30">
              <ShieldAlert className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-500 uppercase tracking-tighter">
                {t.title}
              </h1>
              <p className="text-zinc-500 text-[10px] md:text-sm font-mono uppercase tracking-widest">{t.subtitle}</p>
            </div>
          </div>
          <button 
            onClick={fetchStats}
            className={`flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold text-zinc-300 hover:bg-zinc-800 transition-all ${isRefreshing ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {t.refresh}
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {[
            { label: t.v_total, value: stats.totalVisits, icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: t.u_total, value: stats.totalUsers, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { label: t.u_online, value: stats.onlineUsers, icon: UserPlus, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: t.u_offline, value: stats.offlineUsers, icon: UserMinus, color: 'text-red-500', bg: 'bg-red-500/10' },
            { label: t.u_elite, value: stats.eliteUsers, icon: Crown, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          ].map((stat, i) => (
            <div key={i} className="glass p-4 md:p-6 rounded-2xl border border-zinc-800 flex flex-col gap-4 relative overflow-hidden group">
              <div className={`w-8 h-8 md:w-10 md:h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-zinc-500 text-[9px] md:text-[10px] uppercase font-bold tracking-widest">{stat.label}</p>
                <h3 className="text-xl md:text-3xl font-bold font-heading mt-1">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Configuration Section */}
        <div className="glass p-6 md:p-8 rounded-3xl border border-zinc-800 space-y-6">
          <div className="flex items-center gap-2 text-red-500">
            <Settings className="w-5 h-5" />
            <h3 className="font-heading font-bold uppercase tracking-tight">{t.sys_config}</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <LinkIcon className="w-3 h-3" /> {t.url_label}
                </label>
                <input 
                  type="url" 
                  value={officialUrl}
                  onChange={(e) => setOfficialUrl(e.target.value)}
                  placeholder="https://votre-site.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <p className="text-[10px] text-zinc-600">{t.url_help}</p>
              </div>
              <button 
                onClick={handleSaveConfig}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-red-600/20"
              >
                {showSaveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {showSaveSuccess ? "Configurée !" : t.save}
              </button>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed italic">
                "Attention Louis : l'URL que vous entrez ici deviendra l'identité numérique du Nexus. Assurez-vous qu'elle est correcte avant de la partager à grande échelle."
              </p>
            </div>
          </div>
        </div>

        {/* Main Content: User Table */}
        <div className="glass rounded-3xl border border-zinc-800 overflow-hidden flex flex-col shadow-2xl">
          <div className="p-6 border-b border-zinc-800 bg-zinc-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-500" />
              <h3 className="font-heading font-bold text-lg uppercase tracking-tight">Registre des Sujets</h3>
            </div>
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder={t.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-red-500/50 text-zinc-300"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-900/50 text-[10px] uppercase font-bold text-zinc-500 tracking-widest border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">{t.table_user}</th>
                  <th className="px-6 py-4">{t.table_status}</th>
                  <th className="px-6 py-4">{t.table_credits}</th>
                  <th className="px-6 py-4">{t.table_tier}</th>
                  <th className="px-6 py-4">{t.table_active}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {filteredUsers.length > 0 ? filteredUsers.map((u) => {
                  const isOnline = u.lastActive && u.lastActive > (Date.now() - (5 * 60 * 1000));
                  return (
                    <tr key={u.id} className="hover:bg-red-500/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar} className="w-10 h-10 rounded-xl border border-zinc-800 group-hover:border-red-500/30 transition-colors" alt="" />
                          <div>
                            <p className="text-sm font-bold text-zinc-200">{u.username}</p>
                            <p className="text-[10px] text-zinc-500 flex items-center gap-1 truncate max-w-[120px]">
                              <Mail className="w-3 h-3" /> {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                          isOnline 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
                            : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                        }`}>
                          {isOnline ? t.online : t.offline}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-zinc-300 text-sm">
                        {u.credits === 999999 ? '∞' : u.credits}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 text-xs font-bold ${u.tier === 'elite' ? 'text-amber-500' : 'text-indigo-500'}`}>
                          {u.tier === 'elite' ? <Crown className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          {u.tier.toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] md:text-xs text-zinc-400 font-mono">
                            {u.lastActive ? new Date(u.lastActive).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-zinc-600 italic">
                      Aucune entité trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NexusAdmin;
