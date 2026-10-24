export type Gender = 'male' | 'female';

export interface DonorTriageInput {
  age: number;
  gender: Gender;
  weight: number; // kg
  height: number; // cm
  hemoglobin: number; // g/dL
  altitudeRegion: 'sea_level' | 'moderate' | 'high_altitude'; // CDMX is high altitude (>2000m)
  systolicBP: number; // mmHg
  diastolicBP: number; // mmHg
  heartRate: number; // bpm
  temperature: number; // Celsius
  fastingHours: number; // hours
  sleepHours: number; // hours
  
  // Antecedentes
  tattooPiercingMonths: number | null; // null if none, or months elapsed
  recentSurgery: 'none' | 'minor_recent' | 'major_under_12m' | 'major_over_12m';
  dentalProcedureDays: number | null; // null or days elapsed
  antibioticsDaysAgo: number | null;
  pregnancyStatus: 'none' | 'pregnant' | 'breastfeeding' | 'postpartum_under_6m' | 'postpartum_over_6m';
  vaccineDaysAgo: number | null;
  alcoholHoursAgo: number;
  highRiskBehavior: boolean;
  chronicDiseases: string[];
}

export type TriageStatus = 'APTO' | 'DIFERIDO_TEMPORAL' | 'DIFERIDO_DEFINITIVO';

export interface ParameterEvaluation {
  parameter: string;
  value: string;
  normalRange: string;
  status: 'valid' | 'warning' | 'invalid';
  isDeferral: boolean;
  deferralType?: 'temporal' | 'definitivo';
  deferralDuration?: string;
  nomReference: string;
  explanation: string;
  recommendation: string;
}

export interface TriageResult {
  status: TriageStatus;
  statusTitle: string;
  statusDescription: string;
  evaluatedAt: string;
  totalVolemiaMl: number;
  maxExtractableMl: number;
  standardDonationMl: number;
  volemiaSafePercentage: number;
  evaluations: ParameterEvaluation[];
  summaryPoints: string[];
  aiAnalysis?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: string;
  donorContextSummary?: string;
  webSources?: Array<{ title: string; uri: string }>;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  technicalLevel: 'general' | 'laboratory';
}

export interface NomCard {
  id: string;
  category: 'criterios_seleccion' | 'pruebas_serologicas' | 'conservacion_componentes' | 'inmunohematologia' | 'hemovigilancia';
  numeral: string;
  title: string;
  shortDescription: string;
  fullText: string;
  laboratoryImpact: string;
  donorRelevance: string;
  tags: string[];
}

export interface BloodTypeCompatibility {
  type: string;
  rh: '+' | '-';
  canGiveRBCto: string[];
  canReceiveRBCfrom: string[];
  canGivePlasmato: string[];
  canReceivePlasmafrom: string[];
  prevalenceMexico: number; // percentage in Mexican population
  description: string;
}

export interface MythItem {
  id: string;
  myth: string;
  fact: string;
  scientificExplanation: string;
  source: 'NOM-253' | 'Buitrago' | 'DeKruif' | 'CNTS';
  category: 'fisiologia' | 'estilo_vida' | 'infecciones' | 'procedimiento';
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  requirement: string;
  category: 'triaje' | 'normativa' | 'educacion' | 'comunidad';
}

export interface ActivityEntry {
  id: string;
  title: string;
  points: number;
  timestamp: string;
  module: string;
}

export interface GamificationProfile {
  username: string;
  avatar: string;
  points: number;
  level: number;
  levelTitle: string;
  nextLevelPoints: number;
  badges: Badge[];
  unlockedBadgesCount: number;
  optInLeaderboard: boolean;
  completedModules: {
    triagesCompleted: number;
    aptTriagesCompleted: number;
    nomArticlesExplored: string[];
    mythsRead: string[];
    foundationsRead: string[];
    bloodMatrixExplored: boolean;
    chatQuestionsAsked: number;
    postDonationCareRead: boolean;
  };
  activities: ActivityEntry[];
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  username: string;
  avatar: string;
  location: string;
  points: number;
  levelTitle: string;
  badgesCount: number;
  isCurrentUser: boolean;
}

