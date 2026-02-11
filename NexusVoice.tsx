
import React, { useState, useRef } from 'react';
import { Mic2, Play, Volume2, Loader2, Music, AlertTriangle } from 'lucide-react';
import { generateNexusSpeech } from '../services/geminiService';
import { User as UserType } from '../types';

interface NexusVoiceProps {
  language: string;
  user: UserType;
  deductCredits: (amount: number) => boolean;
}

const NexusVoice: React.FC<NexusVoiceProps> = ({ language, user, deductCredits }) => {
  const translations: any = {
    fr: {
      title: "Nexus Voice",
      subtitle: "Moteur de Synthèse Vocale Neuronal",
      labelInput: "Texte d'Entrée",
      placeholder: "Entrez le message que Nexus doit prononcer...",
      btnSpeak: "Prononcer le Message",
      btnSpeaking: "Synchronisation Vocale...",
      profiles: "Profils de Synthèse Vocale",
      visualizer: "Visualiseur Live",
      noCredits: "Crédits épuisés"
    },
    en: {
      title: "Nexus Voice",
      subtitle: "Neural Text-to-Speech Engine",
      labelInput: "Input Text",
      placeholder: "Enter the message for Nexus to speak...",
      btnSpeak: "Speak Message",
      btnSpeaking: "Synchronizing Vocals...",
      profiles: "Voice Synthesis Profiles",
      visualizer: "Live Visualizer",
      noCredits: "Out of credits"
    }
  };

  const t = translations[language] || translations.fr;

  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const canSynthesize = user.tier === 'elite' || user.credits >= 2;

  const voices = [
    { name: 'Kore', gender: 'Female', desc: language === 'fr' ? 'Claire & Professionnelle' : 'Clear & Professional' },
    { name: 'Puck', gender: 'Male', desc: language === 'fr' ? 'Profond & Énergique' : 'Deep & Energetic' },
    { name: 'Charon', gender: 'Male', desc: language === 'fr' ? 'Calme & Stable' : 'Calm & Steady' },
    { name: 'Fenrir', gender: 'Neutral', desc: language === 'fr' ? 'Ancien & Riche' : 'Ancient & Rich' },
    { name: 'Zephyr', gender: 'Neutral', desc: language === 'fr' ? 'Éthéré & Doux' : 'Ethereal & Smooth' }
  ];

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const handleSynthesize = async () => {
    if (!text.trim() || isSynthesizing) return;
    
    // Déduire 2 crédits
    if (!deductCredits(2)) return;

    setIsSynthesizing(true);
    try {
      const base64Audio = await generateNexusSpeech(text, selectedVoice);
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (error) {
      console.error(error);
      alert("Nexus Voice synchronization failed.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white/50 dark:bg-zinc-950/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <Mic2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl">{t.title}</h2>
            <p className="text-zinc-500 text-xs">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase flex items-center gap-2">
                  <Music className="w-4 h-4" /> {t.labelInput}
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={canSynthesize ? t.placeholder : t.noCredits}
                  disabled={!canSynthesize}
                  className={`w-full h-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none leading-relaxed shadow-sm ${!canSynthesize ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                />
              </div>
              <button
                onClick={handleSynthesize}
                disabled={!text.trim() || isSynthesizing || !canSynthesize}
                className={`w-full py-4 bg-cyan-600 text-white font-bold rounded-2xl hover:bg-cyan-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 disabled:opacity-50 ${!canSynthesize ? 'grayscale' : ''}`}
              >
                {isSynthesizing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    {t.btnSpeaking}
                  </>
                ) : !canSynthesize ? (
                  <>
                    <AlertTriangle className="w-6 h-6" />
                    {t.noCredits} (2)
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 fill-current" />
                    {t.btnSpeak}
                  </>
                )}
              </button>
            </div>

            <div className="space-y-6">
              <label className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase flex items-center gap-2">
                <Volume2 className="w-4 h-4" /> {t.profiles}
              </label>
              <div className="space-y-3">
                {voices.map((voice) => (
                  <button
                    key={voice.name}
                    onClick={() => setSelectedVoice(voice.name)}
                    disabled={!canSynthesize}
                    className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between shadow-sm ${
                      selectedVoice === voice.name 
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400' 
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-cyan-500/50'
                    } ${!canSynthesize ? 'opacity-30' : ''}`}
                  >
                    <div>
                      <h4 className="font-bold">{voice.name}</h4>
                      <p className="text-xs opacity-60">{voice.desc}</p>
                    </div>
                    <span className="text-[10px] uppercase font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                      {voice.gender === 'Female' && language === 'fr' ? 'Féminin' : 
                       voice.gender === 'Male' && language === 'fr' ? 'Masculin' : 
                       voice.gender}
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-6 glass rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${isSynthesizing ? 'bg-cyan-500 animate-ping' : 'bg-zinc-500 opacity-20'}`}></div>
                  <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">{t.visualizer}</span>
                </div>
                <div className="h-20 flex items-center justify-center gap-1">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1 bg-cyan-500 rounded-full transition-all duration-300 ${
                        isSynthesizing ? 'animate-pulse' : 'opacity-20'
                      }`}
                      style={{ height: isSynthesizing ? `${Math.random() * 80 + 20}%` : '20%' }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NexusVoice;
