import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Award, 
  Sparkles, 
  Users, 
  ShieldCheck, 
  Flame, 
  CheckCircle2, 
  Lock, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  Clock, 
  Heart, 
  Droplet,
  Edit2,
  Check
} from 'lucide-react';
import { Badge, GamificationProfile, LeaderboardUser } from '../types';
import { 
  getGamificationProfile, 
  saveGamificationProfile, 
  getLeaderboard, 
  LEVEL_THRESHOLDS,
  triggerConfettiCelebration 
} from '../utils/gamification';

interface GamificationDashboardProps {
  onNavigateToTab?: (tab: string) => void;
}

export const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ onNavigateToTab }) => {
  const [profile, setProfile] = useState<GamificationProfile>(getGamificationProfile());
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(getLeaderboard());
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.username);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);

  const avatarOptions = ['🩺', '🩸', '👩‍⚕️', '👨‍🔬', '🦸', '🧬', '❤️', '🩹'];

  useEffect(() => {
    const handleUpdate = () => {
      const p = getGamificationProfile();
      setProfile(p);
      setLeaderboard(getLeaderboard());
    };

    window.addEventListener('cecilia_gamification_update', handleUpdate);
    return () => window.removeEventListener('cecilia_gamification_update', handleUpdate);
  }, []);

  const handleSaveProfile = () => {
    const updated: GamificationProfile = {
      ...profile,
      username: nameInput.trim() || 'Donante Altruista',
      avatar: selectedAvatar
    };
    saveGamificationProfile(updated);
    setProfile(updated);
    setLeaderboard(getLeaderboard());
    setIsEditingName(false);
  };

  const handleToggleLeaderboard = () => {
    const updated: GamificationProfile = {
      ...profile,
      optInLeaderboard: !profile.optInLeaderboard
    };
    saveGamificationProfile(updated);
    setProfile(updated);
    setLeaderboard(getLeaderboard());
  };

  // Find user's current rank in leaderboard
  const userRank = leaderboard.find((u) => u.isCurrentUser)?.rank || '-';

  // Calculate percentage to next level
  const currentThreshold = LEVEL_THRESHOLDS.find((t) => t.level === profile.level) || LEVEL_THRESHOLDS[0];
  const nextThreshold = LEVEL_THRESHOLDS.find((t) => t.level === profile.level + 1);
  const rangeSpan = nextThreshold ? nextThreshold.minPoints - currentThreshold.minPoints : 100;
  const currentProgressInLevel = Math.max(0, profile.points - currentThreshold.minPoints);
  const progressPercent = nextThreshold
    ? Math.min(100, Math.round((currentProgressInLevel / rangeSpan) * 100))
    : 100;

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header */}
      <div className="rounded-3xl border border-rose-950/60 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800/40 text-rose-300 text-xs font-mono">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Programa de Gamificación &amp; Reconocimiento Altruista</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Insignias, Niveles &amp; Tabla de Clasificación
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Gana puntos aprendiendo sobre la NOM-253, desmintiendo mitos, completando simulaciones de triaje y dominando la compatibilidad sanguínea y aféresis de plaquetas y plasma.
            </p>
          </div>

          {/* User Score Card */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col items-center justify-center text-center min-w-[240px] shadow-lg">
            <div className="text-3xl mb-1">{profile.avatar}</div>
            <div className="font-bold text-white text-base flex items-center space-x-1.5">
              <span>{profile.username}</span>
              <button 
                onClick={() => setIsEditingName(!isEditingName)}
                className="text-slate-400 hover:text-white p-1"
                title="Editar perfil"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-xs text-rose-400 font-medium">{profile.levelTitle}</span>
            <div className="mt-3 flex items-baseline space-x-1">
              <span className="text-3xl font-extrabold text-white font-mono">{profile.points}</span>
              <span className="text-xs text-slate-400 uppercase font-mono">PTS</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {profile.unlockedBadgesCount} de {profile.badges.length} insignias desbloqueadas
            </div>
          </div>
        </div>

        {/* Edit profile modal/box */}
        {isEditingName && (
          <div className="mt-6 p-4 rounded-xl bg-slate-900/90 border border-slate-700 max-w-xl space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Personalizar Perfil de Donante
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-slate-400">Elige avatar:</span>
              {avatarOptions.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`text-xl p-1.5 rounded-lg border transition-all ${
                    selectedAvatar === av ? 'border-rose-500 bg-rose-950/60 scale-110' : 'border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Tu apodo o nombre"
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-rose-500"
              />
              <button
                type="button"
                onClick={handleSaveProfile}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white text-xs font-medium"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Guardar</span>
              </button>
            </div>
          </div>
        )}

        {/* Progress towards next level */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 mb-2 gap-1">
            <span className="font-semibold flex items-center space-x-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Nivel {profile.level}: {profile.levelTitle}</span>
            </span>
            <span className="text-slate-400 font-mono">
              {profile.points} / {profile.nextLevelPoints} pts para siguiente rango
            </span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-3 p-0.5 border border-slate-800 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid: Badges (Logros) & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Badges Showcase (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-bold text-white">Insignias &amp; Logros</h2>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
              {profile.unlockedBadgesCount} / {profile.badges.length} Completadas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.badges.map((badge) => {
              const isUnlocked = badge.unlockedAt !== null;
              return (
                <div
                  key={badge.id}
                  className={`rounded-2xl p-4 border transition-all relative overflow-hidden flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-slate-900/80 border-rose-800/40 shadow-lg shadow-rose-950/20'
                      : 'bg-slate-950/60 border-slate-850 opacity-70'
                  }`}
                >
                  {isUnlocked && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-3xl p-2 rounded-xl bg-slate-950 border border-slate-800 inline-block shadow-sm">
                        {badge.icon}
                      </div>
                      {isUnlocked ? (
                        <span className="flex items-center space-x-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Desbloqueada</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-[11px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                          <Lock className="w-3 h-3" />
                          <span>Bloqueada</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className={`font-bold text-sm ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                        {badge.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {badge.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/70 text-[11px] text-slate-400">
                    <span className="text-rose-400/90 font-medium">Requisito: </span>
                    <span>{badge.requirement}</span>
                    {badge.unlockedAt && (
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">
                        Conseguido el {new Date(badge.unlockedAt).toLocaleDateString('es-MX', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Points Guide */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Cómo Ganar Puntos en CecilIA</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850">
                <span className="font-bold text-rose-400 block">+60 pts</span>
                <span className="text-slate-300 text-[11px]">Pasar Triaje (Apto)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850">
                <span className="font-bold text-rose-400 block">+35 pts</span>
                <span className="text-slate-300 text-[11px]">Guía Cuidados Post-Donación</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850">
                <span className="font-bold text-rose-400 block">+30 pts</span>
                <span className="text-slate-300 text-[11px]">Compatibilidad ABO/Rh</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850">
                <span className="font-bold text-rose-400 block">+20 pts</span>
                <span className="text-slate-300 text-[11px]">Pilares Científicos</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850">
                <span className="font-bold text-rose-400 block">+15 pts</span>
                <span className="text-slate-300 text-[11px]">Artículos NOM-253</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850">
                <span className="font-bold text-rose-400 block">+15 pts</span>
                <span className="text-slate-300 text-[11px]">Desmentir Mitos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Leaderboard & Activity Log (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Leaderboard Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-amber-400" />
                <div>
                  <h2 className="text-base font-bold text-white">Tabla de Clasificación</h2>
                  <p className="text-[11px] text-slate-400">Comunidad de Donantes Voluntarios de México</p>
                </div>
              </div>

              {/* Opt-in switch */}
              <button
                type="button"
                onClick={handleToggleLeaderboard}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                  profile.optInLeaderboard
                    ? 'bg-emerald-950/70 border-emerald-800/50 text-emerald-300 hover:bg-emerald-900'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
                title="Activar/desactivar visibilidad en la tabla"
              >
                {profile.optInLeaderboard ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Visible</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Oculto</span>
                  </>
                )}
              </button>
            </div>

            {!profile.optInLeaderboard && (
              <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300">
                ⚠️ Actualmente tienes la tabla en modo privado. Activa &quot;Visible&quot; para comparar tu puntuación con otros promotores.
              </div>
            )}

            {/* Leaderboard Ranking Table */}
            <div className="space-y-2">
              {leaderboard.map((user) => {
                const isCurrent = user.isCurrentUser;
                const isPodium = user.rank <= 3;
                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-rose-950/60 border-rose-600/70 shadow-md shadow-rose-950/30 ring-1 ring-rose-500/30'
                        : isPodium
                        ? 'bg-slate-950/90 border-slate-800'
                        : 'bg-slate-950/40 border-slate-850 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      {/* Rank Indicator */}
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
                        {user.rank === 1 && <span className="text-amber-400 text-sm">🥇</span>}
                        {user.rank === 2 && <span className="text-slate-300 text-sm">🥈</span>}
                        {user.rank === 3 && <span className="text-amber-600 text-sm">🥉</span>}
                        {user.rank > 3 && (
                          <span className="font-mono text-slate-400">#{user.rank}</span>
                        )}
                      </div>

                      <div className="text-lg shrink-0">{user.avatar}</div>

                      <div className="truncate">
                        <div className="flex items-center space-x-1.5">
                          <span className={`text-xs font-bold truncate ${isCurrent ? 'text-white' : 'text-slate-200'}`}>
                            {user.username}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-600 text-white font-bold">
                              TÚ
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate flex items-center space-x-1">
                          <span>{user.location}</span>
                          <span>•</span>
                          <span className="text-rose-400/80">{user.levelTitle}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-2">
                      <div className="font-mono font-bold text-sm text-white">
                        {user.points} <span className="text-[10px] text-slate-400">PTS</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {user.badgesCount} 🏅
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Log */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
            <div className="flex items-center space-x-2 text-slate-300">
              <Clock className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Historial de Logros &amp; Puntos</h3>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {profile.activities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-850 text-xs"
                >
                  <div className="truncate pr-2">
                    <div className="font-medium text-slate-200 truncate">{act.title}</div>
                    <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                      <span>{act.module}</span>
                      <span>•</span>
                      <span>{new Date(act.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-xs text-emerald-400 shrink-0 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                    +{act.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
