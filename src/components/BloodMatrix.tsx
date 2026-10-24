import React, { useState, useEffect } from 'react';
import { 
  GitFork, 
  Droplet, 
  Scale, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Info,
  ShieldCheck,
  Activity,
  Heart,
  Zap,
  Sparkles,
  AlertTriangle,
  Flame,
  Bandage,
  Clock,
  ShieldAlert,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { BLOOD_COMPATIBILITY_DATA, calculateVolemia } from '../data/bloodData';
import { recordBloodMatrixExplored, recordPostDonationCareRead } from '../utils/gamification';

export const BloodMatrix: React.FC = () => {
  const [selectedBloodKey, setSelectedBloodKey] = useState<string>('O+');
  const [componentType, setComponentType] = useState<'rbc' | 'plasma'>('rbc');

  // Volemia interactive calculator state
  const [calcGender, setCalcGender] = useState<'male' | 'female'>('male');
  const [calcWeight, setCalcWeight] = useState<number>(68);
  const [calcHeight, setCalcHeight] = useState<number>(172);

  // Tab for sub-modules
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'apheresis' | 'postcare'>('matrix');

  useEffect(() => {
    recordBloodMatrixExplored();
  }, []);

  const handleOpenPostCare = () => {
    setActiveSubTab('postcare');
    recordPostDonationCareRead();
  };

  const selectedBlood = BLOOD_COMPATIBILITY_DATA.find(
    (b) => `${b.type}${b.rh}` === selectedBloodKey
  ) || BLOOD_COMPATIBILITY_DATA[0];

  const volemiaResult = calculateVolemia(calcGender, calcWeight, calcHeight);

  const allBloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  return (
    <div className="space-y-8 pb-12">
      {/* Banner */}
      <div className="rounded-3xl border border-rose-950/60 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800/40 text-rose-300 text-xs font-mono">
            <GitFork className="w-3.5 h-3.5 text-rose-400" />
            <span>Inmunohematología, Aféresis &amp; Cuidado Post-Donación</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Compatibilidad ABO/Rh, Plaquetas, Plasma &amp; Cuidados
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Aprende sobre la compatibilidad de glóbulos rojos y plasma, la enorme trascendencia de la donación por aféresis de plaquetas y plasma, y la guía completa para el cuidado posterior y detección de signos de alarma.
          </p>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setActiveSubTab('matrix')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeSubTab === 'matrix'
                ? 'bg-rose-700 text-white shadow-lg shadow-rose-950/60'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Droplet className="w-4 h-4 text-rose-400" />
            <span>Matriz ABO/Rh &amp; Volemia</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('apheresis')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeSubTab === 'apheresis'
                ? 'bg-rose-700 text-white shadow-lg shadow-rose-950/60'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Aféresis: Plaquetas &amp; Plasma</span>
          </button>

          <button
            type="button"
            onClick={handleOpenPostCare}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeSubTab === 'postcare'
                ? 'bg-rose-700 text-white shadow-lg shadow-rose-950/60'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Bandage className="w-4 h-4 text-emerald-400" />
            <span>Cuidados Post-Donación &amp; Reacciones (+35 pts)</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: Matrix ABO/Rh & Volemia */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-8">
          {/* Section: Interactive ABO / Rh Transfusion Matrix */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <Droplet className="w-4 h-4 text-rose-500" />
                  <span>Matriz Transfusional por Hemocomponente</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Selecciona tu tipo de sangre para ver quién puede recibir tu donación y a quién puedes ayudar.
                </p>
              </div>

              {/* Component Toggle (Eritrocitos vs Plasma) */}
              <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setComponentType('rbc')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    componentType === 'rbc'
                      ? 'bg-rose-700 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Glóbulos Rojos (Eritrocitos)
                </button>
                <button
                  type="button"
                  onClick={() => setComponentType('plasma')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    componentType === 'plasma'
                      ? 'bg-rose-700 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Plasma Fresco Congelado (PFC)
                </button>
              </div>
            </div>

            {/* Blood Type Selector Pills */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {BLOOD_COMPATIBILITY_DATA.map((b) => {
                const key = `${b.type}${b.rh}`;
                const isSelected = key === selectedBloodKey;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedBloodKey(key)}
                    className={`py-3 px-2 rounded-xl text-center border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-950 border-rose-500 text-white shadow-md shadow-rose-950/80 scale-105'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className="text-lg font-black tracking-tight">{key}</div>
                    <div className="text-[10px] font-mono opacity-70">{b.prevalenceMexico}% Mex</div>
                  </button>
                );
              })}
            </div>

            {/* Selected Blood Type Details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
              
              {/* Card Info */}
              <div className="md:col-span-5 rounded-xl border border-slate-800 bg-slate-950/70 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-black text-rose-500 font-mono tracking-tight">
                      {selectedBloodKey}
                    </span>
                    <span className="text-xs text-slate-400 ml-2">Grupo ABO y Rh</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-emerald-400 block font-semibold">
                      {selectedBlood.prevalenceMexico}% de la población
                    </span>
                    <span className="text-[10px] text-slate-400">Prevalencia en México</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedBlood.description}
                </p>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-850 text-xs text-slate-300 space-y-1">
                  <span className="text-[10px] font-mono text-rose-400 uppercase block font-semibold">
                    Principio Inmunohematológico:
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    {componentType === 'rbc'
                      ? 'En concentrado eritrocitario se busca que los antígenos de membrana no sean destruidos por los anticuerpos naturales (anti-A o anti-B) del suero del receptor.'
                      : 'En plasma se transfunden anticuerpos y factores de la coagulación; por tanto, el grupo AB es donante universal de plasma porque carece de anticuerpos anti-A y anti-B.'}
                  </p>
                </div>
              </div>

              {/* Compatibility Visual Grid */}
              <div className="md:col-span-7 space-y-4">
                {/* Can give to */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span>
                        {componentType === 'rbc' ? 'Puede donar glóbulos rojos a:' : 'Puede donar plasma a:'}
                      </span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {componentType === 'rbc' ? selectedBlood.canGiveRBCto.length : selectedBlood.canGivePlasmato.length} grupos compatibles
                    </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {allBloodTypes.map((type) => {
                      const isCompatible = componentType === 'rbc'
                        ? selectedBlood.canGiveRBCto.includes(type)
                        : selectedBlood.canGivePlasmato.includes(type);

                      return (
                        <div
                          key={type}
                          className={`p-2 rounded-lg text-center text-xs font-mono font-bold transition-all ${
                            isCompatible
                              ? 'bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 shadow-sm'
                              : 'bg-slate-900/40 border border-slate-850 text-slate-600 opacity-40'
                          }`}
                        >
                          {type}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Can receive from */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>
                        {componentType === 'rbc' ? 'Puede recibir glóbulos rojos de:' : 'Puede recibir plasma de:'}
                      </span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {componentType === 'rbc' ? selectedBlood.canReceiveRBCfrom.length : selectedBlood.canReceivePlasmafrom.length} grupos compatibles
                    </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {allBloodTypes.map((type) => {
                      const isCompatible = componentType === 'rbc'
                        ? selectedBlood.canReceiveRBCfrom.includes(type)
                        : selectedBlood.canReceivePlasmafrom.includes(type);

                      return (
                        <div
                          key={type}
                          className={`p-2 rounded-lg text-center text-xs font-mono font-bold transition-all ${
                            isCompatible
                              ? 'bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 shadow-sm'
                              : 'bg-slate-900/40 border border-slate-850 text-slate-600 opacity-40'
                          }`}
                        >
                          {type}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Universal Rules banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start space-x-2 text-xs">
                    <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Donante Universal (RBC):</span>
                      <p className="text-slate-300 text-[11px]">
                        <strong>O Negativo (O-)</strong> es el donante universal de glóbulos rojos. Indispensable en emergencias donde no hay tiempo para tipificar.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start space-x-2 text-xs">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Donante Universal (Plasma):</span>
                      <p className="text-slate-300 text-[11px]">
                        <strong>AB</strong> es el donante universal de Plasma Fresco Congelado porque carece de anticuerpos anti-A y anti-B en su plasma.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Section 2: Volemia Calculator */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>Calculadora Fisiológica de Volemia (Fórmula de Nadler)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                La NOM-253-SSA1-2012 estipula que la extracción habitual (450 mL ±10%) nunca debe rebasar el 13% del volumen sanguíneo circulante total.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Sliders Input */}
              <div className="md:col-span-6 space-y-4">
                
                {/* Gender */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Sexo Biológico:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCalcGender('male')}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                        calcGender === 'male'
                          ? 'bg-rose-950 border-rose-600 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      Hombre
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcGender('female')}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                        calcGender === 'female'
                          ? 'bg-rose-950 border-rose-600 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      Mujer
                    </button>
                  </div>
                </div>

                {/* Weight slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300">Peso Corporal:</span>
                    <span className="font-mono font-bold text-rose-400">{calcWeight} kg</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="130"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(Number(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>40 kg</span>
                    <span className="text-rose-400 font-bold">Mínimo legal 50 kg</span>
                    <span>130 kg</span>
                  </div>
                </div>

                {/* Height slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300">Estatura:</span>
                    <span className="font-mono font-bold text-rose-400">{calcHeight} cm</span>
                  </div>
                  <input
                    type="range"
                    min="140"
                    max="205"
                    value={calcHeight}
                    onChange={(e) => setCalcHeight(Number(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>140 cm</span>
                    <span>170 cm</span>
                    <span>205 cm</span>
                  </div>
                </div>
              </div>

              {/* Volemia Results */}
              <div className="md:col-span-6 rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 uppercase font-mono">Volemia Total Estimada:</span>
                  <span className="text-2xl font-black font-mono text-white">
                    {volemiaResult.volemiaMl} mL
                  </span>
                </div>

                {/* Visual Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Porcentaje de Extracción:</span>
                    <span className={`font-mono font-bold ${
                      volemiaResult.extractionPercentage <= 13.0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {volemiaResult.extractionPercentage}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-900 rounded-full h-3 p-0.5 border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        volemiaResult.isSafeByVolemia ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(volemiaResult.extractionPercentage * 6.5, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0%</span>
                    <span className="text-amber-400">10%</span>
                    <span className="text-rose-400 font-bold">Límite 13%</span>
                  </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">
                    <span className="text-[10px] text-slate-400 block">Extracción Máxima Segura:</span>
                    <span className="text-sm font-bold font-mono text-emerald-400">
                      {volemiaResult.maxExtractionSafeMl} mL
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">
                    <span className="text-[10px] text-slate-400 block">Bolsa Estándar Donada:</span>
                    <span className="text-sm font-bold font-mono text-white">
                      450 mL (±10%)
                    </span>
                  </div>
                </div>

                {/* Dictum badge */}
                <div className={`p-3 rounded-xl border text-xs flex items-center space-x-2 ${
                  volemiaResult.isSafeByVolemia
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-800 text-rose-300'
                }`}>
                  {volemiaResult.isSafeByVolemia ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>
                        <strong>Extracción Fisiológicamente Segura:</strong> No rebasa el 13% de volemia y peso ≥50 kg.
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>
                        <strong>Riesgo Hemodinámico:</strong> Peso &lt; 50 kg o extracción superior al 13% de volemia. Requiere diferimiento.
                      </span>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Apheresis Platelets & Plasma */}
      {activeSubTab === 'apheresis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Plateletpheresis */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-700/50 flex items-center justify-center text-amber-400">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Trombocitaféresis (Donación de Plaquetas)</h3>
                  <span className="text-xs text-amber-400 font-mono">1 Aféresis = 6 a 8 donaciones tradicionales</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Durante la aféresis, una máquina automatizada de circuito estéril cerrado separa selectivamente las plaquetas del donante mediante centrifugación continua y <strong>retorna los glóbulos rojos y la mayor parte del plasma</strong> al cuerpo del donante.
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-amber-400 block mb-1">🏥 Pacientes Beneficiarios:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                    <li>Pacientes con <strong>leucemia aguda</strong> y anemias aplásicas.</li>
                    <li>Personas en <strong>quimioterapia intensiva</strong> con trombocitopenia severa (&lt; 20,000 plaquetas/µL).</li>
                    <li>Receptores de <strong>trasplantes de médula ósea</strong> y órganos sólidos.</li>
                    <li>Cirugías cardíacas mayores con circulación extracorpórea.</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-emerald-400 block mb-1">🛡️ Ventaja Inmunológica Crítica:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Al obtener un pool completo de un solo donante en lugar de mezclar sangre de 6 donantes distintos, se reduce drásticamente el riesgo de <strong>aloinmunización contra antígenos plaquetarios y HLA</strong> y la exposición a patógenos.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-rose-400 block mb-1">⏱️ Recuperación Rápida:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    El organismo repone las plaquetas donadas en <strong>48 a 72 horas</strong>. Por ello, se puede donar plaquetas cada 14 a 21 días (hasta 24 veces al año).
                  </p>
                </div>
              </div>
            </div>

            {/* Plasmapheresis */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-700/50 flex items-center justify-center text-rose-400">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Plasmaféresis (Donación de Plasma)</h3>
                  <span className="text-xs text-rose-400 font-mono">Factores Lábiles V, VIII, Albúmina e Inmunoglobulinas</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                El plasma es la porción líquida de la sangre rica en proteínas transportadoras, albúmina y factores de la cascada de coagulación. Se congela en las primeras 6-8 horas a <strong>≤ -18°C</strong> para mantener activos los factores más delicados.
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-rose-400 block mb-1">🔥 Pacientes Beneficiarios:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                    <li><strong>Quemaduras graves extensas:</strong> Pérdida masiva de líquido y albúmina por la piel lesionada.</li>
                    <li><strong>Shock hipovolémico y politraumatismos</strong> con sangrado descontrolado.</li>
                    <li><strong>Púrpura Trombocitopénica Trombótica (PTT)</strong> tratada con recambio plasmático terapéutico.</li>
                    <li>Coagulación Intravascular Diseminada (CID) y hepatopatías agudas.</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-amber-400 block mb-1">🧪 Industria de Hemoderivados:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    A partir del plasma donado se elaboran <strong>inmunoglobulinas polivalentes</strong> para pacientes con inmunodeficiencias y <strong>concentrados de factor VIII y IX</strong> para pacientes con hemofilia A y B.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-emerald-400 block mb-1">👑 El Donante Estrella de Plasma:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Las personas con grupo <strong>AB</strong> son los <strong>donantes universales de plasma</strong>: al no tener anticuerpos anti-A ni anti-B, su plasma puede salvar a pacientes de cualquier grupo sanguíneo (A, B, AB u O).
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUBTAB 3: Post-Donation Care & Reactions */}
      {activeSubTab === 'postcare' && (
        <div className="space-y-6">
          
          {/* Header notification */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 flex items-center space-x-3 text-emerald-300 text-xs">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <div>
              <strong>¡Módulo de Cuidados Completado!</strong> Has sumado puntos al perfil y desbloqueado criterios para la insignia <em>&apos;Donante Informado&apos;</em>.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Column 1: Immediate & 24h Care */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Clock className="w-5 h-5 text-rose-400" />
                <span>Cronograma de Cuidados Post-Donación</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 space-y-1.5">
                  <span className="font-bold text-rose-400 flex items-center space-x-1">
                    <span>⏱️ Primeras 2 a 4 horas (Inmediatas):</span>
                  </span>
                  <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px]">
                    <li><strong>Conserva el vendaje compresivo:</strong> No retires la venda ni el apósito durante al menos 2 a 4 horas para asegurar la hemostasia del vaso.</li>
                    <li><strong>Descanso obligatorio de 10-15 minutos:</strong> Permanece sentado en la sala de recuperación del banco de sangre; no te levantes intempestivamente.</li>
                    <li><strong>Toma el refrigerio e hidrátate:</strong> Bebe líquidos abundantes (agua, jugos) y consume el refrigerio balanceado con glucosa y sodio provisto por el banco.</li>
                    <li><strong>Cero tabaco:</strong> No fumes durante al menos 2 horas (el tabaco induce vasoconstricción y puede precipitar un síncope).</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 space-y-1.5">
                  <span className="font-bold text-amber-400 flex items-center space-x-1">
                    <span>💧 Primeras 24 horas:</span>
                  </span>
                  <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px]">
                    <li><strong>Hidratación extra:</strong> Consume al menos 500 mL adicionales de líquidos a tu ingesta habitual para restablecer la volemia plasmática.</li>
                    <li><strong>No cargues peso ni entrenes:</strong> Evita levantar objetos pesados, cargar mochilas pesadas o hacer ejercicio extenuante/gimnasio con el brazo puncionado.</li>
                    <li><strong>Evita bebidas alcohólicas:</strong> No consumas alcohol en las primeras 24 horas; el alcohol inhibe la vasopresina y potencia la deshidratación.</li>
                    <li><strong>Evita baños muy calientes o saunas:</strong> El calor excesivo genera vasodilatación periférica rápida, lo que puede provocar hipotensión ortostática y desvanecimiento.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Column 2: Reactions & Red Flags */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>Reacciones Leves vs Signos de Alarma</span>
              </h3>

              <div className="space-y-3 text-xs">
                {/* Mild reactions */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 space-y-1.5">
                  <span className="font-bold text-emerald-400 flex items-center space-x-1">
                    <span>🟢 Reacciones Leves Habituales &amp; Automanejo:</span>
                  </span>
                  <div className="space-y-2 text-[11px] text-slate-300">
                    <div>
                      <strong className="text-white">Sensación de mareo o pesadez:</strong> Acuéstate boca arriba de inmediato y <em>eleva las piernas a 45 grados (Posición de Trendelenburg)</em>. Afloja prendas apretadas y respira hondo.
                    </div>
                    <div>
                      <strong className="text-white">Hematoma leve (moretón):</strong> Aplica compresas frías o hielo envuelto en un paño durante las primeras 24 horas. A partir de las 48 horas, aplica calor local húmedo para acelerar su absorción.
                    </div>
                    <div>
                      <strong className="text-white">Fatiga leve:</strong> Descansa y duerme adecuadamente; tu cuerpo regenerará el volumen plasmático en pocas horas.
                    </div>
                  </div>
                </div>

                {/* Alarm signs */}
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 space-y-1.5">
                  <span className="font-bold text-rose-300 flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>🚨 ¿Cuándo Buscar Atención Médica Inmediata?</span>
                  </span>
                  <ul className="list-disc list-inside text-rose-200/90 space-y-1 text-[11px]">
                    <li><strong>Pérdida prolongada del conocimiento o desmayo</strong> que no cede tras elevar las piernas.</li>
                    <li><strong>Sangrado continuo en el sitio de punción</strong> que no para tras 10 minutos de presión firme y constante con gasa estéril.</li>
                    <li><strong>Signos de infección o flebitis:</strong> Calor intenso, enrojecimiento que se extiende, dolor creciente o pus en la zona de punción.</li>
                    <li><strong>Dolor agudo lancinante, entumecimiento o sensación de &quot;toques eléctricos&quot;</strong> que se irradia por el brazo o dedos (irritación de nervio periférico).</li>
                    <li><strong>Dificultad respiratoria o dolor en el pecho.</strong></li>
                  </ul>
                  <p className="text-[10px] text-rose-300/80 pt-1">
                    Comunícate de inmediato al teléfono de urgencias o hemovigilancia que te fue entregado en el comprobante del banco de sangre.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
