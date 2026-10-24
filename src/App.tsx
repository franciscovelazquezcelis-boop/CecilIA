import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { TriageSimulator } from './components/TriageSimulator';
import { CeciliaChat } from './components/CeciliaChat';
import { NomExplorer } from './components/NomExplorer';
import { BloodMatrix } from './components/BloodMatrix';
import { ScientificFoundations } from './components/ScientificFoundations';
import { MythsBuster } from './components/MythsBuster';
import { GamificationDashboard } from './components/GamificationDashboard';
import { DonorTriageInput, TriageResult } from './types';
import { Droplet, Heart, ShieldCheck, BookOpen, GraduationCap, Trophy, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('triage');
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | null>(null);
  const [chatDonorContext, setChatDonorContext] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Listen for gamification updates to display feedback toast
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleGamificationEvent = (e: any) => {
      const detail = e.detail;
      if (detail && detail.activities && detail.activities.length > 0) {
        const latest = detail.activities[0];
        setToastMessage(`+${latest.points} PTS: ${latest.title}`);
        clearTimeout(timer);
        timer = setTimeout(() => {
          setToastMessage(null);
        }, 4000);
      }
    };

    window.addEventListener('cecilia_gamification_update', handleGamificationEvent);
    return () => {
      window.removeEventListener('cecilia_gamification_update', handleGamificationEvent);
      clearTimeout(timer);
    };
  }, []);

  // Transfer from Triage Simulator to Chat
  const handleConsultFromTriage = (triageResult: TriageResult, input: DonorTriageInput) => {
    const summaryText = `Hola CecilIA, acabo de realizar la simulación de triaje con mis parámetros y obtuve el dictamen: **${triageResult.statusTitle}** (${triageResult.status}). 
Mis datos fueron: Edad ${input.age} años, Peso ${input.weight} kg, Hemoglobina ${input.hemoglobin} g/dL, Región de altitud: ${input.altitudeRegion}, TA: ${input.systolicBP}/${input.diastolicBP} mmHg, FC: ${input.heartRate} lpm.
${input.tattooPiercingMonths ? `Tatuajes/piercings: hace ${input.tattooPiercingMonths} meses.` : 'Sin tatuajes recientes.'}
¿Podrías orientarme detalladamente sobre este resultado con base en la NOM-253 y los fundamentos de González de Buitrago?`;

    setChatInitialPrompt(summaryText);
    setChatDonorContext(`Dictamen: ${triageResult.statusTitle}. Volemia: ${triageResult.totalVolemiaMl} mL (${triageResult.volemiaSafePercentage}% de extracción). Parámetros: ${JSON.stringify(input)}`);
    setActiveTab('chat');
  };

  // Transfer from NOM Explorer to Chat
  const handleAskArticleInChat = (articleTitle: string, numeral: string) => {
    setChatInitialPrompt(`Hola CecilIA, me gustaría profundizar en el Numeral ${numeral} de la NOM-253-SSA1-2012 («${articleTitle}»). ¿Cuál es su relevancia médica y su impacto en el laboratorio según González de Buitrago?`);
    setChatDonorContext(null);
    setActiveTab('chat');
  };

  // Transfer from Myths to Chat
  const handleAskMythInChat = (mythText: string) => {
    setChatInitialPrompt(`Hola CecilIA, existe el mito común de que: «${mythText}». ¿Cuál es la evidencia científica y biológica que lo desmiente?`);
    setChatDonorContext(null);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 selection:bg-rose-600 selection:text-white relative">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className={`flex-1 w-full mx-auto transition-all ${
        activeTab === 'chat' 
          ? 'w-full px-1 sm:px-3 py-1 sm:py-2' 
          : 'max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8'
      }`}>
        {activeTab === 'triage' && (
          <TriageSimulator onConsultAI={handleConsultFromTriage} />
        )}

        {activeTab === 'chat' && (
          <CeciliaChat 
            initialPrompt={chatInitialPrompt}
            donorContextSummary={chatDonorContext}
            onClearInitialPrompt={() => setChatInitialPrompt(null)}
          />
        )}

        {activeTab === 'compatibility' && (
          <BloodMatrix />
        )}

        {activeTab === 'nom' && (
          <NomExplorer onAskArticleInChat={handleAskArticleInChat} />
        )}

        {activeTab === 'myths' && (
          <MythsBuster onAskMythInChat={handleAskMythInChat} />
        )}

        {activeTab === 'foundations' && (
          <ScientificFoundations />
        )}

        {activeTab === 'gamification' && (
          <GamificationDashboard onNavigateToTab={(tab) => setActiveTab(tab as NavTab)} />
        )}
      </main>

      {/* Floating Gamification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
          <div className="flex items-center space-x-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 border border-amber-500/60 shadow-2xl shadow-amber-950/50 backdrop-blur-md text-white text-xs font-medium">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-amber-400 font-mono block uppercase">¡Logro Registrado!</span>
              <span className="font-semibold text-slate-100">{toastMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* Institutional Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-700 to-red-600 flex items-center justify-center text-white font-bold text-sm">
              C
            </div>
            <div>
              <p className="font-bold text-white text-sm">
                Cecil<span className="text-rose-500">IA</span> • Plataforma de Triaje Clínico &amp; Hemovigilancia
              </p>
              <p className="text-[11px] text-slate-400">
                Promoción de la Donación Voluntaria y Altruista de Sangre en México
              </p>
            </div>
          </div>

          {/* Pillars badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono text-slate-400">
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-rose-400" />
              <span>NOM-253-SSA1-2012</span>
            </span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 flex items-center space-x-1">
              <GraduationCap className="w-3 h-3 text-emerald-400" />
              <span>J.M. González de Buitrago</span>
            </span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 flex items-center space-x-1">
              <BookOpen className="w-3 h-3 text-amber-400" />
              <span>Paul de Kruif</span>
            </span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 flex items-center space-x-1">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>Gamificación Activa</span>
            </span>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-400">
            Herramienta didáctica de salud pública y laboratorio clínico.
          </div>
        </div>
      </footer>
    </div>
  );
}
