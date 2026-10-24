import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  ExternalLink, 
  ShieldCheck, 
  Microscope, 
  Thermometer, 
  FileText, 
  HelpCircle,
  MessageSquare,
  CheckCircle,
  X
} from 'lucide-react';
import { NomCard } from '../types';
import { NOM_253_ARTICLES } from '../data/nom253Data';
import { recordNomExplored } from '../utils/gamification';

interface NomExplorerProps {
  onAskArticleInChat: (articleTitle: string, numeral: string) => void;
}

export const NomExplorer: React.FC<NomExplorerProps> = ({ onAskArticleInChat }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalCard, setActiveModalCard] = useState<NomCard | null>(null);

  const categories = [
    { id: 'all', label: 'Todas las Disposiciones' },
    { id: 'criterios_seleccion', label: 'Criterios de Selección & Diferimiento' },
    { id: 'pruebas_serologicas', label: 'Tamizaje Serológico Obligatorio' },
    { id: 'conservacion_componentes', label: 'Conservación de Hemocomponentes' },
    { id: 'inmunohematologia', label: 'Inmunohematología & Cruzabilidad' },
    { id: 'hemovigilancia', label: 'Hemovigilancia & Trazabilidad' }
  ];

  const filteredArticles = NOM_253_ARTICLES.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(searchLower) ||
      item.numeral.toLowerCase().includes(searchLower) ||
      item.shortDescription.toLowerCase().includes(searchLower) ||
      item.fullText.toLowerCase().includes(searchLower) ||
      item.tags.some((t) => t.toLowerCase().includes(searchLower));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header banner */}
      <div className="rounded-2xl border border-rose-950/60 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800/40 text-rose-300 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>Marco Sanitario Federal Mexicano</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            NOM-253-SSA1-2012: Disposiciones de Sangre Humana
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Biblioteca interactiva que desglosa los criterios sanitarios oficiales para la selección de donantes, tamizaje infeccioso estricto, conservación celular en cadena de frío y pruebas de compatibilidad pretransfusional.
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por numeral, término (ej: tatuajes, VIH, 4°C, CPDA-1)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
          />
        </div>

        {/* Categories horizontal list */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-rose-900 text-rose-200 border border-rose-700 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.map((card) => (
          <div
            key={card.id}
            className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-5 hover:border-rose-800/60 hover:bg-slate-900/80 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/40">
                  Numeral {card.numeral}
                </span>
                <span className="text-[10px] uppercase font-mono text-slate-400">
                  {card.category.replace('_', ' ')}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                {card.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {card.shortDescription}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {card.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-850"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setActiveModalCard(card);
                  recordNomExplored(card.id);
                }}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center space-x-1"
              >
                <span>Ver Disposición (+15 pts)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onAskArticleInChat(card.title, card.numeral)}
                className="p-1.5 rounded-lg bg-slate-950 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-800 transition-colors"
                title="Consultar este numeral con CecilIA"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 space-y-3">
          <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400">
            No se encontraron disposiciones que coincidan con "<span className="text-white">{searchTerm}</span>".
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="text-xs text-rose-400 hover:underline"
          >
            Limpiar filtros y ver todas las normas
          </button>
        </div>
      )}

      {/* Modal Detail View */}
      {activeModalCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <button
              type="button"
              onClick={() => setActiveModalCard(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono text-rose-400 px-2 py-0.5 rounded bg-rose-950 border border-rose-800/40">
                NOM-253-SSA1-2012 • Numeral {activeModalCard.numeral}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white pt-1">
                {activeModalCard.title}
              </h2>
            </div>

            {/* Legal text */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-mono uppercase text-slate-400 block font-semibold">
                Texto Normativo Oficial:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                {activeModalCard.fullText}
              </p>
            </div>

            {/* Laboratory impact */}
            <div className="space-y-2 p-4 rounded-xl bg-blue-950/30 border border-blue-900/40">
              <span className="text-[11px] font-mono uppercase text-blue-300 flex items-center space-x-1.5 font-semibold">
                <Microscope className="w-3.5 h-3.5 text-blue-400" />
                <span>Rigor y Justificación en el Laboratorio Clínico:</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeModalCard.laboratoryImpact}
              </p>
            </div>

            {/* Donor relevance */}
            <div className="space-y-2 p-4 rounded-xl bg-emerald-950/30 border border-emerald-900/40">
              <span className="text-[11px] font-mono uppercase text-emerald-300 flex items-center space-x-1.5 font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Relevancia Práctica para el Donante:</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeModalCard.donorRelevance}
              </p>
            </div>

            {/* Footer action */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  const card = activeModalCard;
                  setActiveModalCard(null);
                  onAskArticleInChat(card.title, card.numeral);
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-semibold transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Consultar este Numeral con CecilIA</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalCard(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
