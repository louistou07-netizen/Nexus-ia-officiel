
import React, { useState, useRef } from 'react';
import { ScanSearch, Upload, Image as ImageIcon, Send, Loader2, Maximize2, RefreshCw, AlertTriangle } from 'lucide-react';
import { analyzeImage } from '../services/geminiService';
import { User as UserType } from '../types';

interface NexusLensProps {
  language: string;
  user: UserType;
  deductCredits: (amount: number) => boolean;
}

const NexusLens: React.FC<NexusLensProps> = ({ language, user, deductCredits }) => {
  const translations: any = {
    fr: {
      title: "Nexus Lens",
      subtitle: "Perception Visuelle Neuronal",
      uploadTitle: "Télécharger des Données Visuelles",
      uploadDesc: "PNG, JPG ou WebP jusqu'à 10Mo",
      changeImg: "Changer d'Image",
      directive: "Directives d'Analyse",
      placeholder: "Que doit chercher le Nexus ?",
      btnScan: "Exécuter le Scan",
      btnScanning: "Vecteurs Visuels...",
      results: "Résultats du Scan",
      ready: "Prêt pour le Scan",
      readyDesc: "Téléchargez une image et cliquez sur Exécuter le Scan pour commencer.",
      noCredits: "Crédits insuffisants"
    },
    en: {
      title: "Nexus Lens",
      subtitle: "Neural Network Visual Perception",
      uploadTitle: "Upload Visual Data",
      uploadDesc: "PNG, JPG or WebP up to 10MB",
      changeImg: "Change Image",
      directive: "Analysis Directives",
      placeholder: "What should the Nexus look for?",
      btnScan: "Execute Scan",
      btnScanning: "Visual Vectors...",
      results: "Scan Results",
      ready: "Ready for Scanning",
      readyDesc: "Upload an image and click Execute Scan to begin visual processing.",
      noCredits: "Insufficient credits"
    }
  };

  const t = translations[language] || translations.fr;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(language === 'fr' ? 'Décrivez cette image en détail et identifiez les éléments clés.' : 'Describe this image in detail and identify key elements.');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canScan = user.tier === 'elite' || user.credits >= 3;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || isLoading) return;
    
    // Déduire 3 crédits
    if (!deductCredits(3)) return;

    setIsLoading(true);
    try {
      const result = await analyzeImage(selectedImage, prompt);
      setAnalysis(result || "No analysis generated.");
    } catch (error) {
      console.error(error);
      alert("Nexus Lens failed to scan the image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white/50 dark:bg-zinc-950/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
            <ScanSearch className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl">{t.title}</h2>
            <p className="text-zinc-500 text-xs">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Upload & Preview */}
          <div className="space-y-6">
            <div 
              onClick={() => canScan && fileInputRef.current?.click()}
              className={`aspect-video w-full rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden relative shadow-sm ${
                selectedImage ? 'border-amber-500/50 border-solid bg-white dark:bg-zinc-900' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50'
              } ${!canScan ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            >
              {selectedImage ? (
                <>
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-bold flex items-center gap-2">
                      <RefreshCw className="w-5 h-5" /> {t.changeImg}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" />
                  <h4 className="font-heading font-bold text-zinc-400 dark:text-zinc-500">{t.uploadTitle}</h4>
                  <p className="text-zinc-400 text-sm">{t.uploadDesc}</p>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />

            <div className="space-y-4">
              <label className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase flex items-center gap-2">
                <Send className="w-4 h-4" /> {t.directive}
              </label>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={canScan ? t.placeholder : t.noCredits}
                disabled={!canScan}
                className={`w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-sm ${!canScan ? 'opacity-50' : ''}`}
              />
              <button
                onClick={handleAnalyze}
                disabled={!selectedImage || isLoading || !canScan}
                className={`w-full py-4 bg-amber-600 text-white font-bold rounded-2xl hover:bg-amber-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 disabled:opacity-50 ${!canScan ? 'grayscale' : ''}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    {t.btnScanning}
                  </>
                ) : !canScan ? (
                  <>
                    <AlertTriangle className="w-5 h-5" />
                    {t.noCredits} (3)
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-5 h-5" />
                    {t.btnScan}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="flex flex-col">
            <div className="flex-1 glass border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden flex flex-col shadow-sm">
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold uppercase text-zinc-400 dark:text-zinc-500">{t.results}</span>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                {analysis ? (
                  <div className="prose dark:prose-invert prose-amber max-w-none">
                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {analysis}
                    </p>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-700 text-center px-8">
                    <ScanSearch className="w-16 h-16 mb-4 opacity-10" />
                    <h5 className="font-heading font-medium text-zinc-400 dark:text-zinc-500">{t.ready}</h5>
                    <p className="text-sm mt-2">{t.readyDesc}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NexusLens;
