import React from 'react';
import { 
  GraduationCap, 
  TestTube, 
  Microscope, 
  ShieldCheck, 
  Quote, 
  CheckCircle,
  BookOpen
} from 'lucide-react';
import { SCIENTIFIC_PILLARS } from '../data/scientificFoundations';
import { recordFoundationRead } from '../utils/gamification';

export const ScientificFoundations: React.FC = () => {
  React.useEffect(() => {
    SCIENTIFIC_PILLARS.forEach((p) => recordFoundationRead(p.id));
  }, []);
  return (
    <div className="space-y-8 pb-12">
      {/* Banner */}
      <div className="rounded-2xl border border-rose-950/60 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800/40 text-rose-300 text-xs font-mono">
            <GraduationCap className="w-3.5 h-3.5 text-rose-400" />
            <span>Epistemología Médica &amp; Rigor Analítico</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Los Tres Pilares Científicos de CecilIA
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Para garantizar que cada respuesta, cálculo y dictamen de triaje sea científicamente impecable y éticamente responsable, CecilIA fusiona la bioquímica clínica de González de Buitrago, el rigor microbiológico de Paul de Kruif y el marco regulatorio oficial de la NOM-253-SSA1-2012.
          </p>
        </div>
      </div>

      {/* Pillars Deck */}
      <div className="space-y-8">
        {SCIENTIFIC_PILLARS.map((pillar, index) => {
          let IconComponent = TestTube;
          let accentColor = 'from-rose-600 to-red-600';
          let borderAccent = 'border-rose-900/60';

          if (pillar.id === 'dekruif') {
            IconComponent = Microscope;
            accentColor = 'from-emerald-600 to-teal-600';
            borderAccent = 'border-emerald-900/60';
          } else if (pillar.id === 'nom253') {
            IconComponent = ShieldCheck;
            accentColor = 'from-amber-600 to-orange-600';
            borderAccent = 'border-amber-900/60';
          }

          return (
            <div
              key={pillar.id}
              className={`rounded-2xl border ${borderAccent} bg-slate-900/40 p-6 sm:p-8 space-y-6 relative overflow-hidden`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${accentColor} flex items-center justify-center text-white shadow-lg shrink-0`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Pilar #{index + 1} • {pillar.focusArea}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {pillar.authorOrStandard}
                    </h2>
                    <p className="text-xs text-rose-400 font-medium italic">
                      «{pillar.title}»
                    </p>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-850 flex items-start space-x-3">
                <Quote className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-slate-200 italic font-serif leading-relaxed">
                  "{pillar.quote}"
                </p>
              </div>

              {/* Summary */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {pillar.summary}
              </p>

              {/* Key contributions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {pillar.keyContributions.map((contrib, cIdx) => (
                  <div key={cIdx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{contrib.title}</span>
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {contrib.description}
                    </p>
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                      <strong className="text-rose-300">Aplicación:</strong> {contrib.practicalApplication}
                    </div>
                  </div>
                ))}
              </div>

              {/* Laboratory methods tags */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
                <span className="text-[11px] font-mono text-slate-400 mr-2">
                  Métodos de Laboratorio Vinculados:
                </span>
                {pillar.laboratoryMethods.map((method, mIdx) => (
                  <span
                    key={mIdx}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
                  >
                    ⚙️ {method}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
