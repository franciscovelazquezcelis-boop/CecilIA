import confetti from 'canvas-confetti';
import { Badge, GamificationProfile, LeaderboardUser } from '../types';

const GAMIFICATION_STORAGE_KEY = 'cecilia_gamification_profile_v2';
const GAMIFICATION_EVENT_NAME = 'cecilia_gamification_update';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'donante_informado',
    title: 'Donante Informado',
    description: 'Desmitificó creencias populares y revisó la guía de cuidados post-donación.',
    icon: '💡',
    unlockedAt: null,
    requirement: 'Revisa al menos 2 mitos y lee los cuidados posteriores a la donación.',
    category: 'educacion'
  },
  {
    id: 'experto_normativa',
    title: 'Experto en Normativa',
    description: 'Exploró y analizó los numerales obligatorios de la NOM-253-SSA1-2012.',
    icon: '⚖️',
    unlockedAt: null,
    requirement: 'Explora al menos 3 artículos del marco regulatorio NOM-253.',
    category: 'normativa'
  },
  {
    id: 'triaje_superado',
    title: 'Triaje Superado',
    description: 'Realizó una simulación de triaje clínico exitosa con dictamen APTO según la NOM-253.',
    icon: '🩸',
    unlockedAt: null,
    requirement: 'Completa una evaluación de triaje que resulte en dictamen APTO.',
    category: 'triaje'
  },
  {
    id: 'maestro_inmunohematologo',
    title: 'Maestro Inmunohematólogo',
    description: 'Comprendió la compatibilidad ABO y Rh en eritrocitos y plasma, y la volemia.',
    icon: '🔬',
    unlockedAt: null,
    requirement: 'Interactúa con la matriz de grupos sanguíneos y calcula la volemia.',
    category: 'educacion'
  },
  {
    id: 'heroe_plaquetas_plasma',
    title: 'Héroe de Plaquetas & Plasma',
    description: 'Conoció la importancia vital de la donación por aféresis para pacientes oncológicos y traumatizados.',
    icon: '⚡',
    unlockedAt: null,
    requirement: 'Estudia los módulos de plaquetas, plasma y sus receptores críticos.',
    category: 'comunidad'
  },
  {
    id: 'embajador_altruista',
    title: 'Embajador Altruista',
    description: 'Alcanzó el rango de honor en la comunidad de promotores de la donación voluntaria.',
    icon: '🏆',
    unlockedAt: null,
    requirement: 'Acumula 400 o más puntos completando actividades educativas y de triaje.',
    category: 'comunidad'
  }
];

export const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Voluntario Inicial', minPoints: 0, maxPoints: 99 },
  { level: 2, title: 'Donante Comprometido', minPoints: 100, maxPoints: 249 },
  { level: 3, title: 'Guardián de la Sangre', minPoints: 250, maxPoints: 449 },
  { level: 4, title: 'Héroe Transfusional', minPoints: 450, maxPoints: 699 },
  { level: 5, title: 'Embajador de Vida', minPoints: 700, maxPoints: 99999 }
];

export function calculateLevel(points: number): { level: number; levelTitle: string; nextLevelPoints: number } {
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    const t = LEVEL_THRESHOLDS[i];
    if (points <= t.maxPoints) {
      return {
        level: t.level,
        levelTitle: t.title,
        nextLevelPoints: t.maxPoints + 1
      };
    }
  }
  return { level: 5, levelTitle: 'Embajador de Vida', nextLevelPoints: 1000 };
}

const DEFAULT_PROFILE: GamificationProfile = {
  username: 'Donante Altruista',
  avatar: '🩺',
  points: 50, // Welcome gift
  level: 1,
  levelTitle: 'Voluntario Inicial',
  nextLevelPoints: 100,
  badges: INITIAL_BADGES,
  unlockedBadgesCount: 0,
  optInLeaderboard: true,
  completedModules: {
    triagesCompleted: 0,
    aptTriagesCompleted: 0,
    nomArticlesExplored: [],
    mythsRead: [],
    foundationsRead: [],
    bloodMatrixExplored: false,
    chatQuestionsAsked: 0,
    postDonationCareRead: false
  },
  activities: [
    {
      id: 'act-welcome',
      title: 'Bienvenida a la plataforma CecilIA',
      points: 50,
      timestamp: new Date().toISOString(),
      module: 'Registro Inicial'
    }
  ]
};

// Simulated peer donors in Mexico for the community leaderboard
const PEER_LEADERBOARD: Omit<LeaderboardUser, 'rank'>[] = [
  {
    id: 'peer-1',
    username: 'Mariana S.',
    avatar: '👩‍⚕️',
    location: 'CDMX (CNTS)',
    points: 720,
    levelTitle: 'Embajador de Vida',
    badgesCount: 6,
    isCurrentUser: false
  },
  {
    id: 'peer-2',
    username: 'Dr. Carlos Mendoza',
    avatar: '👨‍🔬',
    location: 'Guadalajara, JAL',
    points: 560,
    levelTitle: 'Héroe Transfusional',
    badgesCount: 5,
    isCurrentUser: false
  },
  {
    id: 'peer-3',
    username: 'Valeria T.',
    avatar: '🩸',
    location: 'Monterrey, NL',
    points: 430,
    levelTitle: 'Guardián de la Sangre',
    badgesCount: 4,
    isCurrentUser: false
  },
  {
    id: 'peer-4',
    username: 'Rodrigo B.',
    avatar: '🩺',
    location: 'Puebla, PUE',
    points: 310,
    levelTitle: 'Guardián de la Sangre',
    badgesCount: 3,
    isCurrentUser: false
  },
  {
    id: 'peer-5',
    username: 'Alejandra P.',
    avatar: '🧬',
    location: 'Mérida, YUC',
    points: 240,
    levelTitle: 'Donante Comprometido',
    badgesCount: 2,
    isCurrentUser: false
  },
  {
    id: 'peer-6',
    username: 'Gabriel R.',
    avatar: '🩹',
    location: 'Toluca, MEX',
    points: 180,
    levelTitle: 'Donante Comprometido',
    badgesCount: 2,
    isCurrentUser: false
  },
  {
    id: 'peer-7',
    username: 'Fernanda K.',
    avatar: '🔬',
    location: 'Querétaro, QRO',
    points: 120,
    levelTitle: 'Donante Comprometido',
    badgesCount: 1,
    isCurrentUser: false
  }
];

export function getGamificationProfile(): GamificationProfile {
  try {
    const raw = localStorage.getItem(GAMIFICATION_STORAGE_KEY);
    if (raw) {
      const parsed: GamificationProfile = JSON.parse(raw);
      // Merge any new badges in case definition changed
      const mergedBadges = INITIAL_BADGES.map((b) => {
        const existing = parsed.badges?.find((eb) => eb.id === b.id);
        return existing || b;
      });
      const unlockedCount = mergedBadges.filter((b) => b.unlockedAt !== null).length;
      const { level, levelTitle, nextLevelPoints } = calculateLevel(parsed.points);
      return {
        ...DEFAULT_PROFILE,
        ...parsed,
        badges: mergedBadges,
        unlockedBadgesCount: unlockedCount,
        level,
        levelTitle,
        nextLevelPoints
      };
    }
  } catch (e) {
    console.error('Error loading gamification profile', e);
  }
  return DEFAULT_PROFILE;
}

export function saveGamificationProfile(profile: GamificationProfile): void {
  try {
    const unlockedCount = profile.badges.filter((b) => b.unlockedAt !== null).length;
    const { level, levelTitle, nextLevelPoints } = calculateLevel(profile.points);
    const updated: GamificationProfile = {
      ...profile,
      unlockedBadgesCount: unlockedCount,
      level,
      levelTitle,
      nextLevelPoints
    };
    localStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify(updated));
    // Dispatch custom event for real-time reactivity
    window.dispatchEvent(new CustomEvent(GAMIFICATION_EVENT_NAME, { detail: updated }));
  } catch (e) {
    console.error('Error saving gamification profile', e);
  }
}

export function triggerConfettiCelebration() {
  try {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#fb7185', '#38bdf8', '#fbbf24', '#34d399']
    });
  } catch {
    // ignore
  }
}

/**
 * Checks and unlocks badges if criteria are met
 */
function evaluateBadges(profile: GamificationProfile): { updatedBadges: Badge[]; newBadgesUnlocked: Badge[] } {
  const newUnlocked: Badge[] = [];
  const updatedBadges = profile.badges.map((badge) => {
    if (badge.unlockedAt) return badge; // already unlocked

    let shouldUnlock = false;
    const m = profile.completedModules;

    if (badge.id === 'donante_informado') {
      shouldUnlock = m.mythsRead.length >= 2 && m.postDonationCareRead;
    } else if (badge.id === 'experto_normativa') {
      shouldUnlock = m.nomArticlesExplored.length >= 3;
    } else if (badge.id === 'triaje_superado') {
      shouldUnlock = m.aptTriagesCompleted >= 1;
    } else if (badge.id === 'maestro_inmunohematologo') {
      shouldUnlock = m.bloodMatrixExplored;
    } else if (badge.id === 'heroe_plaquetas_plasma') {
      shouldUnlock = m.nomArticlesExplored.includes('nom-conservacion-plaquetas') || m.nomArticlesExplored.includes('nom-conservacion-plasma-crio');
    } else if (badge.id === 'embajador_altruista') {
      shouldUnlock = profile.points >= 400;
    }

    if (shouldUnlock) {
      const unlocked = { ...badge, unlockedAt: new Date().toISOString() };
      newUnlocked.push(unlocked);
      return unlocked;
    }
    return badge;
  });

  return { updatedBadges, newBadgesUnlocked: newUnlocked };
}

export function awardPoints(points: number, activityTitle: string, moduleName: string): GamificationProfile {
  const current = getGamificationProfile();
  const newPoints = current.points + points;
  const newActivity = {
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: activityTitle,
    points,
    timestamp: new Date().toISOString(),
    module: moduleName
  };

  const updatedProfile: GamificationProfile = {
    ...current,
    points: newPoints,
    activities: [newActivity, ...current.activities.slice(0, 30)]
  };

  const { updatedBadges, newBadgesUnlocked } = evaluateBadges(updatedProfile);
  updatedProfile.badges = updatedBadges;

  if (newBadgesUnlocked.length > 0) {
    triggerConfettiCelebration();
  }

  saveGamificationProfile(updatedProfile);
  return updatedProfile;
}

// Module specific action recorders
export function recordNomExplored(numeralId: string): GamificationProfile {
  const current = getGamificationProfile();
  if (current.completedModules.nomArticlesExplored.includes(numeralId)) {
    return current;
  }
  const updatedExplored = [...current.completedModules.nomArticlesExplored, numeralId];
  current.completedModules.nomArticlesExplored = updatedExplored;

  const pointsToAdd = 15;
  const activityTitle = `Explorado Numeral NOM-253 (${numeralId})`;
  return awardPoints(pointsToAdd, activityTitle, 'Marco NOM-253');
}

export function recordMythRead(mythId: string): GamificationProfile {
  const current = getGamificationProfile();
  if (current.completedModules.mythsRead.includes(mythId)) {
    return current;
  }
  current.completedModules.mythsRead = [...current.completedModules.mythsRead, mythId];
  return awardPoints(15, 'Mito desmentido con evidencia científica', 'Mitos de Donación');
}

export function recordTriageCompleted(isApto: boolean): GamificationProfile {
  const current = getGamificationProfile();
  current.completedModules.triagesCompleted += 1;
  if (isApto) {
    current.completedModules.aptTriagesCompleted += 1;
    return awardPoints(60, 'Simulación de Triaje aprobada (Dictamen APTO)', 'Simulador de Triaje');
  } else {
    return awardPoints(25, 'Simulación de Triaje realizada (Criterio de diferimiento analizado)', 'Simulador de Triaje');
  }
}

export function recordBloodMatrixExplored(): GamificationProfile {
  const current = getGamificationProfile();
  if (!current.completedModules.bloodMatrixExplored) {
    current.completedModules.bloodMatrixExplored = true;
    return awardPoints(30, 'Estudio de compatibilidad ABO/Rh y cálculo de volemia', 'Compatibilidad & Volemia');
  }
  return current;
}

export function recordPostDonationCareRead(): GamificationProfile {
  const current = getGamificationProfile();
  if (!current.completedModules.postDonationCareRead) {
    current.completedModules.postDonationCareRead = true;
    return awardPoints(35, 'Lectura completa de Cuidados Post-Donación y Reacciones Leves', 'Guía Clínica Post-Donación');
  }
  return current;
}

export function recordFoundationRead(foundationId: string): GamificationProfile {
  const current = getGamificationProfile();
  if (current.completedModules.foundationsRead.includes(foundationId)) {
    return current;
  }
  current.completedModules.foundationsRead = [...current.completedModules.foundationsRead, foundationId];
  return awardPoints(20, `Estudio del Pilar Científico: ${foundationId}`, 'Pilares Científicos');
}

export function recordChatQuestion(): GamificationProfile {
  const current = getGamificationProfile();
  current.completedModules.chatQuestionsAsked += 1;
  // Award points every question (limit to once every 2 questions to prevent runaway points)
  if (current.completedModules.chatQuestionsAsked % 2 === 1) {
    return awardPoints(10, 'Consulta clínica formulada a CecilIA', 'CecilIA AI');
  }
  return current;
}

export function getLeaderboard(): LeaderboardUser[] {
  const profile = getGamificationProfile();

  const allUsers: Omit<LeaderboardUser, 'rank'>[] = [...PEER_LEADERBOARD];

  // Insert current user if opted in
  if (profile.optInLeaderboard) {
    allUsers.push({
      id: 'current-user',
      username: profile.username || 'Tú (Donante Altruista)',
      avatar: profile.avatar || '🩺',
      location: 'México (En Línea)',
      points: profile.points,
      levelTitle: profile.levelTitle,
      badgesCount: profile.badges.filter((b) => b.unlockedAt !== null).length,
      isCurrentUser: true
    });
  }

  // Sort descending by points
  allUsers.sort((a, b) => b.points - a.points);

  return allUsers.map((u, index) => ({
    ...u,
    rank: index + 1
  }));
}
