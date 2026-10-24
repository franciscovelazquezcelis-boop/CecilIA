import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Bot, 
  BookOpen, 
  GitFork, 
  GraduationCap, 
  HelpCircle, 
  ShieldCheck,
  Trophy,
  Award,
  Sparkles
} from 'lucide-react';
import { getGamificationProfile } from '../utils/gamification';

export type NavTab = 'triage' | 'chat' | 'nom' | 'compatibility' | 'foundations' | 'myths' | 'gamification';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  pendingTriageCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [profile, setProfile] = useState(getGamificationProfile());

  useEffect(() => {
    const handleUpdate = () => {
      setProfile(getGamificationProfile());
    };
    window.addEventListener('cecilia_gamification_update', handleUpdate);
    return () => window.removeEventListener('cecilia_gamification_update', handleUpdate);
  }, []);

  const tabs = [
    { id: 'triage', label: 'Simulador de Triaje', icon: HeartPulse, badge: 'Algoritmo NOM' },
    { id: 'chat', label: 'CecilIA AI', icon: Bot, badge: 'Búsqueda Web' },
    { id: 'compatibility', label: 'Compatibilidad & Volemia', icon: GitFork },
    { id: 'nom', label: 'Marco NOM-253', icon: BookOpen },
    { id: 'myths', label: 'Mitos de Donación', icon: HelpCircle },
    { id: 'foundations', label: 'Pilares Científicos', icon: GraduationCap },
    { id: 'gamification', label: 'Logros & Ranking', icon: Trophy, badge: `${profile.points} pts` },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#090b10]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform identity */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('triage')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-zinc-900 to-zinc-800 border border-zinc-700/80 shadow-md group-hover:border-zinc-600 transition-colors duration-200">
              <span className="text-white font-bold text-lg tracking-tighter">C</span>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border-2 border-zinc-950"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-rose-400 transition-colors">
                  Cecil<span className="text-rose-500">IA</span>
                </span>
                <span className="text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  v2.8
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-none hidden sm:block">
                Inteligencia Clínica &bull; NOM-253
              </p>
            </div>
          </div>

          {/* Navigation items for desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as NavTab)}
                  className={`relative flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-zinc-800/90 text-white border border-zinc-700/80 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-400' : 'text-zinc-500'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${
                      tab.id === 'gamification' 
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 font-semibold'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-700/80'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Score & Regulatory Pill */}
          <div className="flex items-center space-x-2.5">
            {/* Gamification Quick Button */}
            <button
              type="button"
              onClick={() => setActiveTab('gamification')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl border text-xs font-mono transition-all ${
                activeTab === 'gamification'
                  ? 'bg-amber-950/80 border-amber-500/80 text-amber-300 shadow-md shadow-amber-950/30'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-amber-700/60 hover:text-amber-300'
              }`}
              title="Ver insignias, nivel y tabla de clasificación"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold text-white">{profile.points}</span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">PTS</span>
              <span className="text-xs pl-0.5">{profile.avatar}</span>
            </button>

            <div className="hidden sm:flex items-center space-x-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/30 px-2.5 py-1 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>NOM-253</span>
            </div>
          </div>
        </div>

        {/* Mobile horizontal scroll navigation */}
        <div className="flex lg:hidden overflow-x-auto py-2 space-x-1 border-t border-slate-900 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as NavTab)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 whitespace-nowrap rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-rose-950/70 text-rose-200 border border-rose-800/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.id === 'gamification' && (
                  <span className="text-[10px] font-mono px-1 rounded bg-amber-950 text-amber-400">
                    {profile.points}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
