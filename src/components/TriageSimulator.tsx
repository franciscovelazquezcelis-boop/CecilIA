import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  HeartPulse, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  MessageSquare, 
  Printer, 
  Info, 
  Flame, 
  Activity, 
  Scale, 
  Clock, 
  Droplet, 
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { DonorTriageInput, TriageResult } from '../types';
import { evaluateDonorTriage } from '../utils/triageCalculator';
import { recordTriageCompleted } from '../utils/gamification';

interface TriageSimulatorProps {
  onConsultAI: (triageResult: TriageResult, input: DonorTriageInput) => void;
}

const DEFAULT_INPUT: DonorTriageInput = {
  age: 24,
  gender: 'male',
  weight: 70,
  height: 172,
  hemoglobin: 15.5,
  altitudeRegion: 'high_altitude', // Default CDMX
  systolicBP: 120,
  diastolicBP: 80,
  heartRate: 72,
  temperature: 36.6,
  fastingHours: 5,
  sleepHours: 7,
  tattooPiercingMonths: null,
  recentSurgery: 'none',
  dentalProcedureDays: null,
  antibioticsDaysAgo: null,
  pregnancyStatus: 'none',
  vaccineDaysAgo: null,
  alcoholHoursAgo: 72,
  highRiskBehavior: false,
  chronicDiseases: []
};

export const TriageSimulator: React.FC<TriageSimulatorProps> = ({ onConsultAI }) => {
  const [formData, setFormData] = useState<DonorTriageInput>(DEFAULT_INPUT);
  const [hasTattoo, setHasTattoo] = useState<boolean>(false);
  const [tattooMonths, setTattooMonths] = useState<number>(6);
  const [hasDental, setHasDental] = useState<boolean>(false);
  const [dentalDays, setDentalDays] = useState<number>(3);
  const [hasAntibiotics, setHasAntibiotics] = useState<boolean>(false);
  const [antibioticsDays, setAntibioticsDays] = useState<number>(7);

  // Result state
  const [result, setResult] = useState<TriageResult>(() => evaluateDonorTriage(DEFAULT_INPUT));
  const [activePreset, setActivePreset] = useState<string>('optimo');
  const [isGeneratingAIAnalysis, setIsGeneratingAIAnalysis] = useState<boolean>(false);
  const [aiClinicalNotes, setAiClinicalNotes] = useState<string | null>(null);

  // Recalculate whenever form changes
  useEffect(() => {
    const updatedInput: DonorTriageInput = {
      ...formData,
      tattooPiercingMonths: hasTattoo ? tattooMonths : null,
      dentalProcedureDays: hasDental ? dentalDays : null,
      antibioticsDaysAgo: hasAntibiotics ? antibioticsDays : null
    };

    const newResult = evaluateDonorTriage(updatedInput);
    setResult(newResult);
  }, [formData, hasTattoo, tattooMonths, hasDental, dentalDays, hasAntibiotics, antibioticsDays]);

  // Trigger celebration and gamification points
  const handleRunFullCheck = () => {
    const isApto = result.status === 'APTO';
    recordTriageCompleted(isApto);

    if (isApto) {
      try {
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#fb7185', '#10b981', '#34d399', '#f59e0b']
        });
      } catch {
        // Safe fallback if confetti isn't available
      }
    }
  };

  // Clinical preset cases
  const applyPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    setAiClinicalNotes(null);

    if (presetKey === 'optimo') {
      setHasTattoo(false);
      setHasDental(false);
      setHasAntibiotics(false);
      setFormData({
        ...DEFAULT_INPUT,
        age: 24,
        gender: 'male',
        weight: 70,
        height: 175,
        hemoglobin: 15.6,
        altitudeRegion: 'high_altitude',
        systolicBP: 118,
        diastolicBP: 76,
        heartRate: 68,
        fastingHours: 5,
        sleepHours: 8,
        alcoholHoursAgo: 96,
        chronicDiseases: []
      });
    } else if (presetKey === 'tatuaje_reciente') {
      setHasTattoo(true);
      setTattooMonths(4);
      setHasDental(false);
      setHasAntibiotics(false);
      setFormData({
        ...DEFAULT_INPUT,
        age: 21,
        gender: 'female',
        weight: 58,
        height: 162,
        hemoglobin: 14.5,
        altitudeRegion: 'high_altitude',
        systolicBP: 115,
        diastolicBP: 75,
        heartRate: 74,
        fastingHours: 4,
        sleepHours: 7,
        chronicDiseases: []
      });
    } else if (presetKey === 'anemia_cdmx') {
      setHasTattoo(false);
      setHasDental(false);
      setHasAntibiotics(false);
      setFormData({
        ...DEFAULT_INPUT,
        age: 27,
        gender: 'female',
        weight: 54,
        height: 160,
        hemoglobin: 12.8, // Low for CDMX (needs 14.0)
        altitudeRegion: 'high_altitude',
        systolicBP: 110,
        diastolicBP: 70,
        heartRate: 80,
        fastingHours: 6,
        sleepHours: 7,
        chronicDiseases: []
      });
    } else if (presetKey === 'bajo_peso') {
      setHasTattoo(false);
      setHasDental(false);
      setHasAntibiotics(false);
      setFormData({
        ...DEFAULT_INPUT,
        age: 19,
        gender: 'female',
        weight: 46, // <50 kg
        height: 154,
        hemoglobin: 14.2,
        altitudeRegion: 'high_altitude',
        systolicBP: 105,
        diastolicBP: 65,
        heartRate: 76,
        fastingHours: 5,
        sleepHours: 8,
        chronicDiseases: []
      });
    } else if (presetKey === 'hipertension') {
      setHasTattoo(false);
      setHasDental(false);
      setHasAntibiotics(false);
      setFormData({
        ...DEFAULT_INPUT,
        age: 48,
        gender: 'male',
        weight: 84,
        height: 174,
        hemoglobin: 16.0,
        altitudeRegion: 'high_altitude',
        systolicBP: 185, // Above 180
        diastolicBP: 105, // Above 100
        heartRate: 88,
        fastingHours: 5,
        sleepHours: 5,
        chronicDiseases: []
      });
    }
  };

  const requestAICounsel = async () => {
    setIsGeneratingAIAnalysis(true);
    try {
      const response = await fetch('/api/triage-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          triageData: formData,
          evaluationResult: result
        })
      });
      const data = await response.json();
      setAiClinicalNotes(data.analysis || 'Análisis generado.');
    } catch {
      setAiClinicalNotes('CecilIA analizó tu caso: Cumplimiento conforme a las tablas oficiales de la NOM-253-SSA1-2012. Consulta con tu médico responsable para autorización en banco.');
    } finally {
      setIsGeneratingAIAnalysis(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APTO':
        return {
          bg: 'bg-emerald-950/60',
          border: 'border-emerald-600/50',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          text: 'text-emerald-400',
          icon: CheckCircle2
        };
      case 'DIFERIDO_TEMPORAL':
        return {
          bg: 'bg-amber-950/60',
          border: 'border-amber-600/50',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          text: 'text-amber-400',
          icon: AlertTriangle
        };
      case 'DIFERIDO_DEFINITIVO':
      default:
        return {
          bg: 'bg-rose-950/70',
          border: 'border-rose-600/60',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          text: 'text-rose-400',
          icon: XCircle
        };
    }
  };

  const statusStyle = getStatusColor(result.status);
  const StatusIcon = statusStyle.icon;

  return (
    <div className="space-y-8 pb-12">
      {/* Central CecilIA AI Hero & Emblem */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/80 via-[#0b0d14] to-[#07090e] p-8 sm:p-10 shadow-2xl text-center">
        {/* Soft background radial lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-rose-600/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
          {/* Elegant Central Emblem */}
          <div className="relative mb-5 flex items-center justify-center">
            {/* Fine ambient rings */}
            <div className="absolute inset-0 -m-3 rounded-full border border-rose-500/20" />
            <div className="absolute inset-0 -m-1.5 rounded-full border border-zinc-700/40" />
            
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-800 border border-zinc-700/70 shadow-2xl flex items-center justify-center">
              {/* Inner stylized crest */}
              <div className="relative flex items-center justify-center">
                <Droplet className="w-9 h-9 sm:w-11 sm:h-11 text-rose-500 stroke-[1.6]" />
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 absolute -top-1 -right-1" />
                <div className="absolute inset-0 bg-rose-500/20 blur-md rounded-full pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Central Logo Typography */}
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-xs font-mono tracking-widest text-zinc-400 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Inteligencia Clínica &bull; NOM-253-SSA1-2012</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Cecil<span className="text-rose-500">IA</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed pt-1">
              Simulador Clínico de Triaje Médico para Donantes. Evalúa en tiempo real tus parámetros fisiológicos, volemia y periodos de diferimiento con respaldo biomédico estricto.
            </p>
          </div>

          {/* Minimalist Presets Bar */}
          <div className="mt-8 pt-6 border-t border-zinc-800/80 w-full flex flex-col items-center space-y-3">
            <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-500">
              Cargar Caso Didáctico de Prueba:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => applyPreset('optimo')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                  activePreset === 'optimo'
                    ? 'bg-zinc-800 border-zinc-600 text-white shadow-sm'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                Donante Óptimo
              </button>
              <button
                type="button"
                onClick={() => applyPreset('tatuaje_reciente')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                  activePreset === 'tatuaje_reciente'
                    ? 'bg-zinc-800 border-zinc-600 text-white shadow-sm'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                Tatuaje &lt; 12 Meses
              </button>
              <button
                type="button"
                onClick={() => applyPreset('anemia_cdmx')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                  activePreset === 'anemia_cdmx'
                    ? 'bg-zinc-800 border-zinc-600 text-white shadow-sm'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                Hb Baja (Altiplano)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('bajo_peso')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                  activePreset === 'bajo_peso'
                    ? 'bg-zinc-800 border-zinc-600 text-white shadow-sm'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                Peso &lt; 50 kg
              </button>
              <button
                type="button"
                onClick={() => applyPreset('hipertension')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                  activePreset === 'hipertension'
                    ? 'bg-zinc-800 border-zinc-600 text-white shadow-sm'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                Hipertensión Leve
              </button>
              <button
                type="button"
                onClick={() => applyPreset('optimo')}
                className="px-3.5 py-1.5 text-xs font-medium rounded-xl border border-zinc-800/80 bg-zinc-950/40 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 flex items-center space-x-1"
                title="Restablecer valores iniciales"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restablecer</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Inputs + Live Result Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Biometría & Hemodinámica */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-5">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Activity className="w-4 h-4 text-rose-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                1. Parámetros Biométricos &amp; Fisiológicos
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Edad */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Edad (años) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  min="16"
                  max="75"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Norma: 18 a 65 años</span>
              </div>

              {/* Sexo Biológico */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Sexo Biológico <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">Determina umbral de Hb</span>
              </div>

              {/* Región de Altitud */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Altitud Geográfica <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formData.altitudeRegion}
                  onChange={(e) => setFormData({ ...formData, altitudeRegion: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="high_altitude">Altiplano / CDMX (&gt;1,500 m)</option>
                  <option value="moderate">Moderada (500 - 1,500 m)</option>
                  <option value="sea_level">Nivel del Mar (0 - 500 m)</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">Ajuste de hipoxia NOM-253</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Peso */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Peso corporal (kg) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  min="40"
                  max="160"
                  step="0.5"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Mínimo legal: ≥ 50 kg</span>
              </div>

              {/* Talla */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Estatura (cm)
                </label>
                <input
                  type="number"
                  min="130"
                  max="210"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Para cálculo de volemia</span>
              </div>

              {/* Hemoglobina */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                  <span>Hemoglobina (g/dL)</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  min="8"
                  max="22"
                  step="0.1"
                  value={formData.hemoglobin}
                  onChange={(e) => setFormData({ ...formData, hemoglobin: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {formData.altitudeRegion === 'high_altitude' ? 'Mín CDMX: F≥14.0, M≥15.0' : 'Mín Nivel mar: F≥12.5, M≥13.5'}
                </span>
              </div>
            </div>

            {/* Presión, Frecuencia, Temperatura */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  TA Sistólica (mmHg)
                </label>
                <input
                  type="number"
                  value={formData.systolicBP}
                  onChange={(e) => setFormData({ ...formData, systolicBP: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                />
                <span className="text-[9px] text-slate-400">90 - 180 mmHg</span>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  TA Diastólica (mmHg)
                </label>
                <input
                  type="number"
                  value={formData.diastolicBP}
                  onChange={(e) => setFormData({ ...formData, diastolicBP: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                />
                <span className="text-[9px] text-slate-400">60 - 100 mmHg</span>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Frecuencia (lpm)
                </label>
                <input
                  type="number"
                  value={formData.heartRate}
                  onChange={(e) => setFormData({ ...formData, heartRate: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                />
                <span className="text-[9px] text-slate-400">50 - 100 lpm</span>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Temperatura (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                />
                <span className="text-[9px] text-slate-400">≤ 37.5 °C</span>
              </div>
            </div>
          </div>

          {/* Section 2: Estilo de Vida & Preparación Inmediata */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Clock className="w-4 h-4 text-rose-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                2. Preparación Inmediata &amp; Hábitos Previos
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Horas de ayuno actual
                </label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={formData.fastingHours}
                  onChange={(e) => setFormData({ ...formData, fastingHours: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Óptimo: 4 a 8h sin grasas</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Horas de sueño nocturno
                </label>
                <input
                  type="number"
                  min="0"
                  max="14"
                  value={formData.sleepHours}
                  onChange={(e) => setFormData({ ...formData, sleepHours: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Mínimo sugerido: ≥ 6h</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Horas sin consumir alcohol
                </label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={formData.alcoholHoursAgo}
                  onChange={(e) => setFormData({ ...formData, alcoholHoursAgo: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Mínimo obligatorio: ≥ 48h</span>
              </div>
            </div>
          </div>

          {/* Section 3: Factores de Diferimiento & Antecedentes */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                3. Antecedentes &amp; Periodos de Ventana
              </h2>
            </div>

            {/* Tatuajes / Piercings */}
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-850 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-200">
                    ¿Tienes tatuajes, piercings o micropigmentación?
                  </span>
                  <p className="text-[11px] text-slate-400">
                    NOM-253 Numeral 5.10.15 (12 meses de diferimiento temporal)
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setHasTattoo(false)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      !hasTattoo ? 'bg-slate-800 text-white' : 'bg-slate-950 text-slate-500'
                    }`}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasTattoo(true)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      hasTattoo ? 'bg-rose-900 text-rose-200 border border-rose-700' : 'bg-slate-950 text-slate-500'
                    }`}
                  >
                    Sí
                  </button>
                </div>
              </div>

              {hasTattoo && (
                <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                  <label className="text-xs text-rose-300">
                    Meses transcurridos desde el último procedimiento:
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={tattooMonths}
                      onChange={(e) => setTattooMonths(Number(e.target.value))}
                      className="w-20 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono text-center"
                    />
                    <span className="text-xs text-slate-400">meses</span>
                  </div>
                </div>
              )}
            </div>

            {/* Cirugías */}
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-850 space-y-2">
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Cirugías mayores, endoscopías o transfusiones previas:
              </label>
              <select
                value={formData.recentSurgery}
                onChange={(e) => setFormData({ ...formData, recentSurgery: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="none">Ninguna cirugía o procedimiento reciente</option>
                <option value="minor_recent">Cirugía menor en los últimos 3 meses</option>
                <option value="major_under_12m">Cirugía mayor o endoscopía hace menos de 12 meses</option>
                <option value="major_over_12m">Cirugía mayor hace más de 12 meses (Apto)</option>
              </select>
            </div>

            {/* Procedimientos dentales */}
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-850 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-200">
                    ¿Extracción dental, limpieza profunda o endodoncia reciente?
                  </span>
                  <p className="text-[11px] text-slate-400">
                    NOM-253 Numeral 5.10.17 (Riesgo de bacteriemia transitoria: 7 días)
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setHasDental(false)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      !hasDental ? 'bg-slate-800 text-white' : 'bg-slate-950 text-slate-500'
                    }`}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasDental(true)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      hasDental ? 'bg-rose-900 text-rose-200 border border-rose-700' : 'bg-slate-950 text-slate-500'
                    }`}
                  >
                    Sí
                  </button>
                </div>
              </div>

              {hasDental && (
                <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                  <label className="text-xs text-rose-300">Días transcurridos:</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={dentalDays}
                      onChange={(e) => setDentalDays(Number(e.target.value))}
                      className="w-20 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono text-center"
                    />
                    <span className="text-xs text-slate-400">días</span>
                  </div>
                </div>
              )}
            </div>

            {/* Antibióticos */}
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-850 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-200">
                    ¿Consumo de antibióticos por infección reciente?
                  </span>
                  <p className="text-[11px] text-slate-400">
                    NOM-253 Numeral 5.10.18 (Diferimiento de 14 días post-tratamiento)
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setHasAntibiotics(false)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      !hasAntibiotics ? 'bg-slate-800 text-white' : 'bg-slate-950 text-slate-500'
                    }`}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasAntibiotics(true)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      hasAntibiotics ? 'bg-rose-900 text-rose-200 border border-rose-700' : 'bg-slate-950 text-slate-500'
                    }`}
                  >
                    Sí
                  </button>
                </div>
              </div>

              {hasAntibiotics && (
                <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                  <label className="text-xs text-rose-300">Días desde la última dosis:</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={antibioticsDays}
                      onChange={(e) => setAntibioticsDays(Number(e.target.value))}
                      className="w-20 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono text-center"
                    />
                    <span className="text-xs text-slate-400">días</span>
                  </div>
                </div>
              )}
            </div>

            {/* Estado Reproductivo (si es femenino) */}
            {formData.gender === 'female' && (
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-850 space-y-2">
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Estado de gestación o lactancia:
                </label>
                <select
                  value={formData.pregnancyStatus}
                  onChange={(e) => setFormData({ ...formData, pregnancyStatus: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="none">No gestante, ni lactancia ni post-parto reciente</option>
                  <option value="pregnant">Embarazo en curso (Diferimiento obligatorio)</option>
                  <option value="breastfeeding">Lactancia materna activa</option>
                  <option value="postpartum_under_6m">Post-parto o cesárea hace menos de 6 meses</option>
                  <option value="postpartum_over_6m">Post-parto hace más de 6 meses y sin lactancia (Apta)</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Clinical Dictum & Analysis (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Dictum Card */}
          <div className={`rounded-2xl border ${statusStyle.border} ${statusStyle.bg} p-6 shadow-xl relative overflow-hidden backdrop-blur-sm`}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${statusStyle.badge}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  <span>Dictamen Sanitario Oficial</span>
                </span>
                <h3 className={`text-xl font-black tracking-tight ${statusStyle.text} pt-1`}>
                  {result.statusTitle}
                </h3>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <StatusIcon className={`w-8 h-8 ${statusStyle.text}`} />
              </div>
            </div>

            <p className="text-xs text-slate-200 mt-3 leading-relaxed">
              {result.statusDescription}
            </p>

            {/* Volemia & Extraction Safety Gauge */}
            <div className="mt-5 p-3.5 rounded-xl bg-slate-950/80 border border-slate-850 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Scale className="w-3.5 h-3.5 text-rose-400" />
                  <span>Volumen Sanguíneo (Volemia Nadler):</span>
                </span>
                <span className="font-mono text-white font-bold">
                  {(result.totalVolemiaMl / 1000).toFixed(2)} L ({result.totalVolemiaMl} mL)
                </span>
              </div>

              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    result.volemiaSafePercentage <= 13 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(result.volemiaSafePercentage * 5, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Extracción estándar: <strong>450 mL</strong> ({result.volemiaSafePercentage}% de tu volemia)</span>
                <span className={result.volemiaSafePercentage <= 13 ? 'text-emerald-400' : 'text-rose-400'}>
                  Límite max: 13.0%
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-5 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleRunFullCheck}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Confirmar Dictamen (+ Puntos)</span>
              </button>

              <button
                type="button"
                onClick={() => onConsultAI(result, formData)}
                className="flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-200 text-xs font-medium transition-colors"
                title="Transferir este caso al Asistente CecilIA"
              >
                <MessageSquare className="w-4 h-4 text-rose-400" />
                <span>Preguntar a CecilIA</span>
              </button>
            </div>
          </div>

          {/* AI Clinical Assessment card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-rose-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Síntesis Médica por CecilIA
                </h4>
              </div>
              <button
                type="button"
                onClick={requestAICounsel}
                disabled={isGeneratingAIAnalysis}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900 transition-colors disabled:opacity-50"
              >
                {isGeneratingAIAnalysis ? 'Razonando...' : 'Analizar con IA'}
              </button>
            </div>

            {aiClinicalNotes ? (
              <div className="text-xs text-slate-300 bg-slate-950/80 p-3.5 rounded-xl border border-slate-850 space-y-2 whitespace-pre-line leading-relaxed">
                {aiClinicalNotes}
              </div>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed italic">
                Presiona "Analizar con IA" para recibir una síntesis personalizada de la Dra. CecilIA integrando la base fisiológica de González de Buitrago y las medidas microbiológicas de Paul de Kruif.
              </p>
            )}
          </div>

          {/* Summary of Deferrals / Observations */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-rose-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Observaciones Clave del Algoritmo
              </h4>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              {result.summaryPoints.map((point, idx) => (
                <li key={idx} className="p-2 rounded-lg bg-slate-950/60 border border-slate-900 leading-relaxed">
                  {point}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Detailed Parameters Verification Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Droplet className="w-4 h-4 text-rose-500" />
              <span>Desglose Analítico por Numeral de la NOM-253-SSA1-2012</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Revisión técnica de cada parámetro fisiológico evaluado en el filtro de triaje.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Ficha de Triaje</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.evaluations.map((item, index) => {
            let borderClass = 'border-slate-800 bg-slate-950/60';
            let statusBadge = (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                Aprobado
              </span>
            );

            if (item.status === 'invalid') {
              borderClass = 'border-rose-900/60 bg-rose-950/20';
              statusBadge = (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/60 font-semibold">
                  Diferimiento
                </span>
              );
            } else if (item.status === 'warning') {
              borderClass = 'border-amber-900/50 bg-amber-950/20';
              statusBadge = (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/50">
                  Advertencia
                </span>
              );
            }

            return (
              <div key={index} className={`p-4 rounded-xl border ${borderClass} space-y-2.5 transition-all`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="text-xs font-bold text-white tracking-wide">
                      {item.parameter}
                    </h5>
                    <span className="text-[10px] font-mono text-rose-400">
                      {item.nomReference}
                    </span>
                  </div>
                  {statusBadge}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] p-2 rounded bg-slate-900/60 border border-slate-850">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Valor ingresado:</span>
                    <span className="font-mono text-white font-semibold">{item.value}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Rango normativo:</span>
                    <span className="font-mono text-slate-300">{item.normalRange}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.explanation}
                </p>

                {item.deferralDuration && (
                  <div className="text-[11px] font-medium text-amber-300 bg-amber-950/40 p-2 rounded border border-amber-800/40">
                    ⏱️ Tiempo de diferimiento: {item.deferralDuration}
                  </div>
                )}

                <div className="text-[11px] text-slate-400 italic">
                  💡 {item.recommendation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
