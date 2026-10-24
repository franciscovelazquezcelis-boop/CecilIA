import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  BookOpen, 
  Heart,
  MessageSquare 
} from 'lucide-react';
import { DONATION_MYTHS } from '../data/mythsData';
import { recordMythRead } from '../utils/gamification';

interface MythsBusterProps {
  onAskMythInChat: (mythText: string) => void;
}

export const MythsBuster: React.FC<MythsBusterProps> = ({ onAskMythInChat }) => {
  const [expandedId, setExpandedId] = useState<string | null>(DONATION_MYTHS[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todos los Mitos' },
    { id: 'estilo_vida', label: 'Estilo de Vida & Tatuajes' },
    { id: 'fisiologia', label: 'Fisiología & Salud' },
    { id: 'procedimiento', label: 'Procedimiento & Seguridad' }
  ];

  const filteredMyths = DONATION_MYTHS.filter(
    (m) => selectedCategory === 'all' || m.category === selectedCategory
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Banner */}
      <div className="rounded-2xl border border-rose-950/60 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800/40 text-rose-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Desmitificación Basada en Evidencia</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Mitos y Realidades de la Donación de Sangre
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            El miedo al dolor y la desinformación en jóvenes sobre tatuajes, peso, sexualidad y ayuno son las principales causas de escasez de sangre en México. Aquí desmentimos cada creencia errónea con base científica.
          </p>
        </div>
      </div>

      {/* Category selector */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-rose-900 text-rose-200 border border-rose-700 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Myths Accordion / Deck */}
      <div className="space-y-4">
        {filteredMyths.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'border-rose-800/80 bg-slate-900/80 shadow-lg shadow-rose-950/30'
                  : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  const next = isExpanded ? null : item.id;
                  setExpandedId(next);
                  if (next) recordMythRead(item.id);
                }}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
              >
                <div className="flex items-center space-x-3.5 pr-4">
                  <div className="w-8 h-8 rounded-xl bg-rose-950 border border-rose-800/60 flex items-center justify-center text-rose-400 shrink-0">
                    <XCircle className="w-4 h-4 text-rose-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 block font-semibold">
                      Mito Popular
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      "{item.myth}"
                    </h3>
                  </div>
                </div>

                <div className="text-slate-400">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-800/60">
                  
                  {/* Fact */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold block">
                        Realidad Científica Comprobada:
                      </span>
                      <p className="text-xs sm:text-sm text-emerald-200 font-medium leading-relaxed">
                        {item.fact}
                      </p>
                    </div>
                  </div>

                  {/* Scientific explanation */}
                  <div className="space-y-1.5 p-4 rounded-xl bg-slate-950 border border-slate-850">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                      Explicación Fisiológica &amp; Normativa:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {item.scientificExplanation}
                    </p>
                  </div>

                  {/* Footer actions */}
                  <div className="flex items-center justify-between pt-2 text-xs">
                    <span className="text-[11px] font-mono text-slate-400">
                      Fuente: <strong className="text-rose-400">{item.source}</strong>
                    </span>

                    <button
                      type="button"
                      onClick={() => onAskMythInChat(item.myth)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 text-rose-300 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Profundizar con CecilIA</span>
                    </button>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Motivational Callout */}
      <div className="rounded-2xl border border-rose-800/40 bg-gradient-to-r from-rose-950/60 via-slate-900 to-rose-950/60 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-bold text-white flex items-center justify-center sm:justify-start space-x-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Una sola donación salva hasta 3 vidas</span>
          </h4>
          <p className="text-xs text-slate-300">
            Los mitos se curan con ciencia. La desinformación cuesta vidas en los quirófanos y salas de quimioterapia.
          </p>
        </div>
      </div>
    </div>
  );
};
