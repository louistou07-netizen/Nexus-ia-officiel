
import React from 'react';
import { ExternalLink, Info } from 'lucide-react';

interface NexusAdProps {
  type: 'banner' | 'sidebar' | 'inline';
}

const NexusAd: React.FC<NexusAdProps> = ({ type }) => {
  const ads = [
    { title: "CyberCompute Cloud", desc: "La puissance brute pour vos projets IA.", cta: "Essayer" },
    { title: "NeoVPN", desc: "Protégez votre identité dans le Nexus.", cta: "Installer" },
    { title: "Quantix Store", desc: "Hardware de futur, aujourd'hui.", cta: "Découvrir" }
  ];
  
  const ad = ads[Math.floor(Math.random() * ads.length)];

  if (type === 'sidebar') {
    return (
      <div className="mx-3 my-4 p-4 rounded-xl bg-gradient-to-br from-indigo-900/40 to-zinc-900 border border-indigo-500/30">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter bg-indigo-500/10 px-1.5 py-0.5 rounded">Sponsorisé</span>
          <Info className="w-3 h-3 text-zinc-600" />
        </div>
        <h5 className="text-xs font-bold text-zinc-200 mb-1">{ad.title}</h5>
        <p className="text-[10px] text-zinc-500 mb-3">{ad.desc}</p>
        <button className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1">
          {ad.cta} <ExternalLink className="w-2.5 h-2.5" />
        </button>
      </div>
    );
  }

  if (type === 'banner') {
    return (
      <div className="w-full p-4 glass rounded-2xl border border-zinc-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center font-bold text-zinc-600">AD</div>
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase">Annonce</span>
            <h4 className="text-sm font-bold text-zinc-200">{ad.title} — {ad.desc}</h4>
          </div>
        </div>
        <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all">
          En savoir plus
        </button>
      </div>
    );
  }

  return null;
};

export default NexusAd;
