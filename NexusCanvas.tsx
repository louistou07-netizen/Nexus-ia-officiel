
import React, { useState } from 'react';
import { Palette, Sparkles, Download, History, Loader2, Wand2, Info, AlertTriangle } from 'lucide-react';
import { generateNexusImage } from '../services/geminiService';
import { User as UserType } from '../types';

interface NexusCanvasProps {
  language: string;
  user: UserType;
  deductCredits: (amount: number) => boolean;
}

const NexusCanvas: React.FC<NexusCanvasProps> = ({ language, user, deductCredits }) => {
  const translations: any = {
    fr: {
      title: "Nexus Canvas",
      subtitle: "Imagerie par Diffusion Latente",
      promptLabel: "Invite Visuelle",
      placeholder: "Décrivez votre vision (ex: 'Une ville cyberpunk sous la pluie, ultra détaillé, 8k, néons')",
      btnGenerate: "Générer la Vision",
      btnGenerating: "Synthèse des Pixels...",
      info: "Les images sont générées en résolution 1024x1024 par défaut. Coût: 5 crédits.",
      waiting: "En attente d'entrée...",
      history: "Galerie d'Historique",
      rendering: "PROCESSUS_DE_RENDU...",
      download: "Télécharger",
      noCredits: "Crédits insuffisants"
    },
    en: {
      title: "Nexus Canvas",
      subtitle: "Latent Diffusion Imagery",
      promptLabel: "Visual Prompt",
      placeholder: "Describe your vision (e.g., 'A cyberpunk city in the rain, ultra detailed, 8k, neon lights')",
      btnGenerate: "Generate Vision",
      btnGenerating: "Synthesizing Nexus Pixels...",
      info: "Images are generated in 1024x1024 resolution by default. Cost: 5 credits.",
      waiting: "Waiting for Input...",
      history: "Gallery History",
      rendering: "RENDERING_PROCESS...",
      download: "Download",
      noCredits: "Insufficient credits"
    }
  };

  const t = translations[language] || translations.fr;

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [history, setHistory] = useState<{prompt: string, url: string}[]>([]);

  const canGenerate = user.tier === 'elite' || user.credits >= 5;

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    // Déduire 5 crédits
    if (!deductCredits(5)) return;

    setIsGenerating(true);
    try {
      const url = await generateNexusImage(prompt);
      setResultImage(url);
      setHistory(prev => [{ prompt, url }, ...prev]);
    } catch (error) {
      console.error(error);
      alert("Error generating image.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `nexus-art-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white/50 dark:bg-zinc-950/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl">{t.title}</h2>
            <p className="text-zinc-500 text-xs">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Controls */}
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <Wand2 className="w-4 h-4" /> {t.promptLabel}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.placeholder}
                disabled={!canGenerate}
                className={`w-full h-40 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-none text-lg leading-relaxed shadow-sm ${!canGenerate ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <div className="flex flex-wrap gap-2">
                {['Cyberpunk', 'Cinematic', 'Oil Painting', 'Isometric', 'Sketch', '3D Render'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setPrompt(p => p ? `${p}, ${tag}` : tag)}
                    disabled={!canGenerate}
                    className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-xs text-zinc-500 hover:text-pink-500 transition-colors disabled:opacity-30"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating || !canGenerate}
              className={`w-full py-4 bg-gradient-to-r from-pink-600 to-indigo-600 text-white font-bold rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20 ${!canGenerate ? 'grayscale opacity-50' : ''}`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  {t.btnGenerating}
                </>
              ) : !canGenerate ? (
                <>
                  <AlertTriangle className="w-6 h-6" />
                  {t.noCredits} (5)
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  {t.btnGenerate}
                </>
              )}
            </button>

            <div className="p-4 glass rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-start gap-3">
              <Info className="w-5 h-5 text-indigo-500 flex-shrink-0" />
              <p className="text-sm text-zinc-500 leading-relaxed">
                {t.info}
              </p>
            </div>
          </div>

          {/* Viewport */}
          <div className="space-y-6">
            <div className="aspect-square w-full rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 overflow-hidden relative shadow-2xl flex items-center justify-center group">
              {isGenerating ? (
                <div className="absolute inset-0 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center gap-4">
                  <div className="w-20 h-20 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
                  <p className="text-zinc-400 font-mono animate-pulse">{t.rendering}</p>
                </div>
              ) : resultImage ? (
                <>
                  <img src={resultImage} alt="Generated Art" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={downloadImage}
                      className="p-4 bg-white text-black rounded-full hover:scale-110 transition-transform flex items-center gap-2 font-bold"
                    >
                      <Download className="w-5 h-5" /> {t.download}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-zinc-400">
                  <Palette className="w-20 h-20 mb-4 opacity-10" />
                  <p className="font-heading font-medium">{t.waiting}</p>
                </div>
              )}
            </div>

            {history.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-400 flex items-center gap-2 uppercase">
                  <History className="w-4 h-4" /> {t.history}
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {history.map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => setResultImage(item.url)}
                      className="aspect-square rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-pink-500 transition-colors"
                    >
                      <img src={item.url} alt="History" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NexusCanvas;
