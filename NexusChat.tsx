
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Trash2, Copy, Check, Code2, AlertTriangle } from 'lucide-react';
import { generateNexusResponse } from '../services/geminiService';
import { Message, User as UserType } from '../types';

interface NexusChatProps {
  language: string;
  user: UserType;
  deductCredits: (amount: number) => boolean;
}

const CodeBlock: React.FC<{ code: string; lang: string }> = ({ code, lang }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg bg-zinc-950">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-indigo-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            {lang || 'SCRIPT'}
          </span>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
          <span className="text-[10px] font-bold uppercase">{copied ? 'Copié' : 'Copier'}</span>
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-xs font-mono text-zinc-300 leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

const NexusChat: React.FC<NexusChatProps> = ({ language, user, deductCredits }) => {
  const translations: any = {
    fr: {
      title: "Nexus Chat",
      subtitle: "Gemini 3 Flash",
      welcome: "Salutations. Je suis Nexus Chat. Comment puis-je assister votre traitement logique ?",
      placeholder: "Votre message...",
      warning: "IA peut générer des erreurs.",
      error: "Erreur de communication.",
      clear: "Effacer",
      noCredits: "Crédits épuisés"
    },
    en: {
      title: "Nexus Chat",
      subtitle: "Gemini 3 Flash",
      welcome: "Greetings. I am Nexus Chat. How can I assist your logical processing?",
      placeholder: "Your message...",
      warning: "AI may generate errors.",
      error: "Communication error.",
      clear: "Clear",
      noCredits: "Out of credits"
    }
  };

  const t = translations[language] || translations.fr;

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('nexus_chat_history');
    return saved ? JSON.parse(saved) : [{ id: '1', role: 'assistant', content: t.welcome, timestamp: Date.now() }];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const canSend = user.tier === 'elite' || user.credits >= 1;

  useEffect(() => {
    localStorage.setItem('nexus_chat_history', JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const parseContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        if (match) {
          return <CodeBlock key={index} lang={match[1]} code={match[2].trim()} />;
        }
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    if (!deductCredits(1)) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateNexusResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || "I'm sorry, I couldn't process that.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t.error,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800/50 flex justify-between items-center bg-white/40 dark:bg-zinc-950/20 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-base md:text-xl dark:text-white leading-none">{t.title}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-[10px]">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!canSend && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/10 text-red-500 text-[9px] font-bold rounded-full animate-pulse border border-red-500/20 uppercase">
              {t.noCredits}
            </span>
          )}
          <button 
            onClick={() => setMessages([{ id: '1', role: 'assistant', content: t.welcome, timestamp: Date.now() }])}
            className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 md:gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm ${msg.role === 'assistant' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700' : 'bg-indigo-600 text-white'}`}>
              {msg.role === 'assistant' ? <Bot className="w-4 h-4 md:w-5 md:h-5" /> : <User className="w-4 h-4 md:w-5 md:h-5" />}
            </div>
            <div className={`flex flex-col gap-1 max-w-[88%] md:max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-3 md:p-4 rounded-2xl leading-relaxed text-sm md:text-base shadow-sm transition-colors ${msg.role === 'assistant' ? 'bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 backdrop-blur-sm' : 'bg-indigo-600 text-white shadow-indigo-500/10'}`}>
                <div className="whitespace-pre-wrap">{parseContent(msg.content)}</div>
              </div>
              <span className="text-[9px] text-zinc-400 font-mono mt-1 px-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 max-w-4xl mx-auto">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-indigo-500 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-600 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.4s]"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 md:p-6 bg-white/80 dark:bg-zinc-950/60 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800/50 shrink-0">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={canSend ? t.placeholder : t.noCredits}
            disabled={!canSend}
            rows={1}
            className={`w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 pl-4 pr-14 text-sm md:text-base text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none min-h-[48px] shadow-inner ${!canSend ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || !canSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
        <p className="text-center text-[9px] text-zinc-400 dark:text-zinc-500 mt-2 uppercase tracking-widest font-bold hidden md:block">
          {t.warning} • {user.tier === 'elite' ? '∞' : '1'} CRÉDIT
        </p>
      </div>
    </div>
  );
};

export default NexusChat;
