import { BloodTypeCompatibility } from '../types';

export const BLOOD_COMPATIBILITY_DATA: BloodTypeCompatibility[] = [
  {
    type: 'O',
    rh: '+',
    canGiveRBCto: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveRBCfrom: ['O+', 'O-'],
    canGivePlasmato: ['O+', 'O-'],
    canReceivePlasmafrom: ['O+', 'A+', 'B+', 'AB+'],
    prevalenceMexico: 61.8,
    description: 'El tipo sanguíneo más abundante y solicitado en México. Sus glóbulos rojos pueden salvar a cualquier persona con factor Rh positivo.'
  },
  {
    type: 'O',
    rh: '-',
    canGiveRBCto: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    canReceiveRBCfrom: ['O-'],
    canGivePlasmato: ['O+', 'O-'],
    canReceivePlasmafrom: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    prevalenceMexico: 2.1,
    description: 'Donante universal de glóbulos rojos (Concentrado Eritrocitario). Esencial en salas de urgencias y choque cuando no hay tiempo para tipificar.'
  },
  {
    type: 'A',
    rh: '+',
    canGiveRBCto: ['A+', 'AB+'],
    canReceiveRBCfrom: ['A+', 'A-', 'O+', 'O-'],
    canGivePlasmato: ['A+', 'A-', 'O+', 'O-'],
    canReceivePlasmafrom: ['A+', 'AB+'],
    prevalenceMexico: 24.3,
    description: 'Segundo grupo más común en México. Gran demanda para cirugías programadas y pacientes hematológicos.'
  },
  {
    type: 'A',
    rh: '-',
    canGiveRBCto: ['A+', 'A-', 'AB+', 'AB-'],
    canReceiveRBCfrom: ['A-', 'O-'],
    canGivePlasmato: ['A+', 'A-', 'O+', 'O-'],
    canReceivePlasmafrom: ['A+', 'A-', 'AB+', 'AB-'],
    prevalenceMexico: 0.9,
    description: 'Grupo escaso en población hispana. Altamente valorado en bancos de sangre para receptores A- y AB-.'
  },
  {
    type: 'B',
    rh: '+',
    canGiveRBCto: ['B+', 'AB+'],
    canReceiveRBCfrom: ['B+', 'B-', 'O+', 'O-'],
    canGivePlasmato: ['B+', 'B-', 'O+', 'O-'],
    canReceivePlasmafrom: ['B+', 'AB+'],
    prevalenceMexico: 8.5,
    description: 'Grupo sanguíneo con antígeno B en eritrocitos y anticuerpos naturales anti-A en suero.'
  },
  {
    type: 'B',
    rh: '-',
    canGiveRBCto: ['B+', 'B-', 'AB+', 'AB-'],
    canReceiveRBCfrom: ['B-', 'O-'],
    canGivePlasmato: ['B+', 'B-', 'O+', 'O-'],
    canReceivePlasmafrom: ['B+', 'B-', 'AB+', 'AB-'],
    prevalenceMexico: 0.4,
    description: 'Extremadamente raro en México (< 0.5%). Los donantes altruistas B negativo son contactados prioritariamente.'
  },
  {
    type: 'AB',
    rh: '+',
    canGiveRBCto: ['AB+'],
    canReceiveRBCfrom: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    canGivePlasmato: ['AB+', 'AB-'],
    canReceivePlasmafrom: ['AB+'],
    prevalenceMexico: 1.8,
    description: 'Receptor universal de glóbulos rojos. En plasma, es donante de plasma para otros grupos AB.'
  },
  {
    type: 'AB',
    rh: '-',
    canGiveRBCto: ['AB+', 'AB-'],
    canReceiveRBCfrom: ['AB-', 'A-', 'B-', 'O-'],
    canGivePlasmato: ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
    canReceivePlasmafrom: ['AB-'],
    prevalenceMexico: 0.2,
    description: 'Donante universal de Plasma Fresco Congelado (PFC) porque su plasma carece de anticuerpos anti-A y anti-B.'
  }
];

/**
 * Calculates approximate total blood volemia using Nadler's formula
 * Males: Volemia (L) = 0.3669 * (Height in m)^3 + 0.03219 * Weight in kg + 0.6041
 * Females: Volemia (L) = 0.3561 * (Height in m)^3 + 0.03308 * Weight in kg + 0.1833
 */
export function calculateVolemia(gender: 'male' | 'female', weightKg: number, heightCm: number): {
  volemiaMl: number;
  maxExtractionSafeMl: number; // 13% of volemia
  standardBagMl: number; // 450 mL
  extractionPercentage: number;
  isSafeByVolemia: boolean;
} {
  const hMeters = Math.max(heightCm / 100, 1.2);
  let volemiaL: number;

  if (gender === 'male') {
    volemiaL = 0.3669 * Math.pow(hMeters, 3) + 0.03219 * weightKg + 0.6041;
  } else {
    volemiaL = 0.3561 * Math.pow(hMeters, 3) + 0.03308 * weightKg + 0.1833;
  }

  const volemiaMl = Math.round(volemiaL * 1000);
  const maxExtractionSafeMl = Math.round(volemiaMl * 0.13); // 13% rule NOM-253
  const standardBagMl = 450;
  const extractionPercentage = Number(((standardBagMl / volemiaMl) * 100).toFixed(1));
  const isSafeByVolemia = weightKg >= 50 && extractionPercentage <= 13.0;

  return {
    volemiaMl,
    maxExtractionSafeMl,
    standardBagMl,
    extractionPercentage,
    isSafeByVolemia
  };
}
