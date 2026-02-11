
import React, { useState } from 'react';
import { NexusModule, User } from '../types';
import { 
  Zap, 
  MessageSquare, 
  Palette, 
  Mic2, 
  ScanSearch, 
  TrendingUp,
  Activity,
  Cpu,
  Crown,
  CreditCard,
  X,
  ShieldCheck,
  Check,
  Share2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import NexusAd from './NexusAd';

const dummyData = [
  { time: '00:00', value: 400 },
  { time: '04:00', value: 300 },
  { time: '08:00', value: 600 },
  { time: '12:00', value: 800 },
  { time: '16:00', value: 500 },
  { time: '20:00', value: 900 },
  { time: '23:59', value: 1000 },
];

interface DashboardProps {
  onNavigate: (module: NexusModule) => void;
  user: User;
  language: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, user, language }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const PAYPAL_EMAIL = 'louis.toupin@icloud.com';
  const CREATOR_EMAILS = ['louistou07@gmail.com', 'louis.toupin@icloud.com'];

  const translations: any = {
    fr: {
      title: "Console Nexus",
      welcome: "Bienvenue",
      status: "Système : Optimal",
      elite: "Activer Elite",
      credits: "Crédits",
      share: "Partager le Nexus",
      shareSuccess: "Lien copié !",
      usage: "Utilisation",
      latency: "Latence Nexus",
      grade: "Grade Actuel",
      master: "Accès Master",
      activity: "Activité du Réseau",
      activeSub: "ABONNEMENT ACTIF",
      unlock: "Débloquer Elite",
      benefits: [
        "Expérience sans publicité",
        "Crédits illimités (Protocol ∞)",
        "Priorité Gemini Ultra",
        "Outils de création avancés"
      ],
      creator: "Créateur",
      yes: "OUI",
      no: "NON",
      totalToPay: "Total à payer",
      month: "/ mois",
      secure: "Paiement sécurisé via PayPal",
      foundsSent: "Les fonds seront transférés au compte :",
      payBtn: "Payer avec PayPal",
      placeholderText: {
        chat: "Nexus Chat",
        chatDesc: "Raisonnement IA",
        canvas: "Nexus Canvas",
        canvasDesc: "Art Génératif",
        voice: "Nexus Voice",
        voiceDesc: "Synthèse Vocale HD",
        lens: "Nexus Lens",
        lensDesc: "Vision par Ordinateur"
      }
    },
    en: {
      title: "Nexus Console",
      welcome: "Welcome",
      status: "System: Optimal",
      elite: "Activate Elite",
      credits: "Credits",
      share: "Share Nexus",
      shareSuccess: "Link copied!",
      usage: "Usage",
      latency: "Nexus Latency",
      grade: "Current Grade",
      master: "Master Access",
      activity: "Network Activity",
      activeSub: "ACTIVE SUBSCRIPTION",
      unlock: "Unlock Elite",
      benefits: [
        "Ad-free experience",
        "Unlimited credits (Protocol ∞)",
        "Gemini Ultra priority",
        "Advanced creation tools"
      ],
      creator: "Creator",
      yes: "YES",
      no: "NO",
      totalToPay: "Total to pay",
      month: "/ month",
      secure: "Secure payment via PayPal",
      foundsSent: "Funds will be transferred to:",
      payBtn: "Pay with PayPal",
      placeholderText: {
        chat: "Nexus Chat",
        chatDesc: "AI Reasoning",
        canvas: "Nexus Canvas",
        canvasDesc: "Generative Art",
        voice: "Nexus Voice",
        voiceDesc: "HD Speech Synthesis",
        lens: "Nexus Lens",
        lensDesc: "Computer Vision"
      }
    }
  };

  const t = translations[language] || translations.fr;

  const handleShare = async () => {
    // Utiliser l'URL officielle si configurée en Admin, sinon l'URL actuelle
    const officialUrl = localStorage.getItem('nexus_official_url') || window.location.href;
    
    const shareData = {
      title: 'Nexus IA',
      text: 'Découvrez Nexus IA, l\'intelligence artificielle sans limites.',
      url: officialUrl,
    };

    try {
      if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(officialUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      // Fallback simple si Clipboard API échoue sur certains navigateurs mobiles non-HTTPS
      const textArea = document.createElement("textarea");
      textArea.value = officialUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {}
      document.body.removeChild(textArea);
    }
    
    if ('vibrate' in navigator) navigator.vibrate(20);
  };

  const handlePaypalClick = () => {
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(PAYPAL_EMAIL)}&item_name=Nexus+IA+Elite+Subscription&amount=9.99&currency_code=EUR`;
    window.open(paypalUrl, '_blank');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 pb-24 md:pb-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-4xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
              {t.title}
            </h1>
            {CREATOR_EMAILS.includes(user.email.toLowerCase()) && (
              <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/50 text-amber-500 text-[8px] md:text-[9px] font-bold rounded-full flex items-center gap-1 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" /> {t.creator}
              </span>
            )}
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm">{t.welcome}, {user.username}. {t.status}.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 md:gap-3">
          <button 
            onClick={handleShare}
            className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all border ${
              copied 
              ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' 
              : 'bg-indigo-600/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white shadow-sm'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            {copied ? t.shareSuccess : t.share}
          </button>

          {user.tier === 'basic' && (
            <button 
              onClick={() => setShowPayment(true)}
              className="px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl flex items-center gap-2 text-[10px] md:text-xs font-bold animate-pulse hover:scale-105 transition-all shadow-lg shadow-orange-500/20"
            >
              <Crown className="w-3.5 h-3.5" /> {t.elite}
            </button>
          )}

          <div className="px-3 py-2 md:px-4 md:py-2 glass rounded-xl flex items-center gap-2 text-[10px] md:text-xs font-mono text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
            <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
            {user.credits === 999999 ? '∞' : user.credits}
          </div>
        </div>
      </header>

      {user.tier === 'basic' && <NexusAd type="banner" />}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: t.usage, value: user.tier === 'elite' ? '0%' : `${50 - user.credits}/50`, icon: Activity, color: 'text-blue-500' },
          { label: t.latency, value: '18ms', icon: Cpu, color: 'text-purple-500' },
          { label: t.grade, value: user.tier.toUpperCase(), icon: TrendingUp, color: 'text-emerald-500' },
          { label: t.master, value: CREATOR_EMAILS.includes(user.email.toLowerCase()) ? t.yes : t.no, icon: Zap, color: 'text-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="glass p-4 md:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-3 md:gap-4">
            <div className="flex items-center justify-between">
              <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
              <span className="text-[9px] md:text-[10px] font-mono text-zinc-400">ID_{i+100}</span>
            </div>
            <div>
              <p className="text-zinc-500 text-[9px] md:text-[10px] uppercase font-bold tracking-widest">{stat.label}</p>
              <h3 className="text-base md:text-2xl font-bold font-heading">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-bold text-lg">{t.activity}</h3>
          </div>
          <div className="w-full h-[150px] md:h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dummyData}>
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between bg-indigo-500/5">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-500" />
              <h3 className="font-heading font-bold text-lg italic text-amber-500 uppercase tracking-widest">Nexus Elite</h3>
            </div>
            <ul className="space-y-3">
              {t.benefits.map((benefit: string, i: number) => (
                <li key={i} className="flex items-center gap-3 text-xs md:text-sm text-zinc-600 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-amber-500" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          {user.tier === 'basic' ? (
            <button 
              onClick={() => setShowPayment(true)}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-white dark:text-zinc-950 font-bold rounded-xl mt-6 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {t.unlock} — 9.99€
            </button>
          ) : (
            <div className="w-full py-4 bg-zinc-100 dark:bg-zinc-800/50 text-amber-500 font-bold rounded-xl mt-6 text-center border border-amber-500/20">
              {t.activeSub}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {[
          { id: NexusModule.CHAT, label: t.placeholderText.chat, desc: t.placeholderText.chatDesc, icon: MessageSquare, color: 'bg-indigo-500' },
          { id: NexusModule.CANVAS, label: t.placeholderText.canvas, desc: t.placeholderText.canvasDesc, icon: Palette, color: 'bg-pink-500' },
          { id: NexusModule.VOICE, label: t.placeholderText.voice, desc: t.placeholderText.voiceDesc, icon: Mic2, color: 'bg-cyan-500' },
          { id: NexusModule.LENS, label: t.placeholderText.lens, desc: t.placeholderText.lensDesc, icon: ScanSearch, color: 'bg-amber-500' },
        ].map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className="group relative glass p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-left hover:border-indigo-500/50 transition-all overflow-hidden"
          >
             <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
               <card.icon className="w-20 md:w-24 h-20 md:h-24" />
             </div>
            <div className={`w-10 h-10 md:w-12 md:h-12 ${card.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
              <card.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h4 className="font-heading font-bold text-base md:text-lg mb-1">{card.label}</h4>
            <p className="text-zinc-500 text-xs md:text-sm">{card.desc}</p>
          </button>
        ))}
      </div>

      {showPayment && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-950 w-full max-w-md p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 relative space-y-6 shadow-2xl">
            <button 
              onClick={() => setShowPayment(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-2xl font-heading font-bold">Nexus Elite</h2>
              <p className="text-zinc-500 text-sm">Libérez tout le potentiel de l'IA.</p>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-500">{t.totalToPay}</span>
                <span className="text-xl font-bold">9,99€ <span className="text-xs text-zinc-500">{t.month}</span></span>
              </div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-widest">{t.secure}</div>
            </div>
            <button 
              onClick={handlePaypalClick}
              className="w-full py-4 bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" className="h-6 rounded" />
              {t.payBtn}
            </button>
            <p className="text-[10px] text-zinc-500 text-center">
              {t.foundsSent} {PAYPAL_EMAIL}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
