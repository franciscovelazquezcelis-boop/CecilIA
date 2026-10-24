import { DonorTriageInput, ParameterEvaluation, TriageResult, TriageStatus } from '../types';
import { calculateVolemia } from '../data/bloodData';

export function evaluateDonorTriage(input: DonorTriageInput): TriageResult {
  const evaluations: ParameterEvaluation[] = [];
  const summaryPoints: string[] = [];

  const volemiaCalc = calculateVolemia(input.gender, input.weight, input.height);

  // 1. EDAD
  if (input.age < 18) {
    evaluations.push({
      parameter: 'Edad cronológica',
      value: `${input.age} años`,
      normalRange: '18 - 65 años',
      status: 'invalid',
      isDeferral: true,
      deferralType: 'temporal',
      deferralDuration: `Hasta cumplir la mayoría de edad (faltan ${18 - input.age} año(s))`,
      nomReference: 'NOM-253 Numeral 5.10.1',
      explanation: 'La ley sanitaria mexicana prohíbe la donación alogénica en menores de edad para salvaguardar el consentimiento informado y el pleno desarrollo hematopoyético.',
      recommendation: 'Te esperamos con entusiasmo tan pronto cumplas 18 años.'
    });
  } else if (input.age > 65) {
    evaluations.push({
      parameter: 'Edad cronológica',
      value: `${input.age} años`,
      normalRange: '18 - 65 años (hasta 70 en habituales)',
      status: 'warning',
      isDeferral: false,
      nomReference: 'NOM-253 Numeral 5.10.1',
      explanation: 'Mayores de 65 años requieren autorización expresa del médico responsable del banco de sangre si son donantes habituales.',
      recommendation: 'El médico del banco evaluará tu reserva funcional cardiovascular en entrevista presencial.'
    });
  } else {
    evaluations.push({
      parameter: 'Edad cronológica',
      value: `${input.age} años`,
      normalRange: '18 - 65 años',
      status: 'valid',
      isDeferral: false,
      nomReference: 'NOM-253 Numeral 5.10.1',
      explanation: 'Cumple perfectamente con el intervalo de edad reglamentario.',
      recommendation: 'Parámetro en rango óptimo.'
    });
  }

  // 2. PESO Y VOLEMIA
  if (input.weight < 50) {
    evaluations.push({
      parameter: 'Peso corporal y volemia',
      value: `${input.weight} kg`,
      normalRange: '≥ 50 kg',
      status: 'invalid',
      isDeferral: true,
      deferralType: 'temporal',
      deferralDuration: 'Hasta alcanzar ≥ 50 kg de peso estable',
      nomReference: 'NOM-253 Numeral 5.10.2',
      explanation: `Tu peso (${input.weight} kg) no alcanza el mínimo legal de 50 kg. Extraer la bolsa estándar de 450 mL representaría el ${volemiaCalc.extractionPercentage}% de tu sangre, superando el límite seguro del 13% de volemia y exponiéndote a síncope e intoxicación por citrato del anticoagulante.`,
      recommendation: 'Prioriza tu nutrición y bienestar. No te sometas a extracciones por debajo de 50 kg.'
    });
  } else {
    evaluations.push({
      parameter: 'Peso corporal y volemia',
      value: `${input.weight} kg (Volemia estimada: ${(volemiaCalc.volemiaMl / 1000).toFixed(2)} L)`,
      normalRange: '≥ 50 kg (Extracción ≤ 13% de volemia)',
      status: 'valid',
      isDeferral: false,
      nomReference: 'NOM-253 Numeral 5.10.2',
      explanation: `La extracción estándar de 450 mL representará solo el ${volemiaCalc.extractionPercentage}% de tu volemia circulante, manteniéndose holgadamente dentro del margen de bioseguridad.`,
      recommendation: 'Masa corporal adecuada para soportar la flebotomía sin alteraciones hemodinámicas.'
    });
  }

  // 3. HEMOGLOBINA Y ALTITUD
  let minHb = 12.5;
  let maxHb = 16.5;

  if (input.gender === 'male') {
    if (input.altitudeRegion === 'high_altitude') {
      minHb = 15.0; // CDMX / Altiplano
      maxHb = 18.0;
    } else if (input.altitudeRegion === 'moderate') {
      minHb = 14.0;
      maxHb = 18.0;
    } else {
      minHb = 13.5; // Nivel del mar
      maxHb = 18.0;
    }
  } else {
    // Femenino
    if (input.altitudeRegion === 'high_altitude') {
      minHb = 14.0;
      maxHb = 16.5;
    } else if (input.altitudeRegion === 'moderate') {
      minHb = 13.0;
      maxHb = 16.5;
    } else {
      minHb = 12.5;
      maxHb = 16.5;
    }
  }

  if (input.hemoglobin < minHb) {
    evaluations.push({
      parameter: `Hemoglobina (${input.altitudeRegion === 'high_altitude' ? 'Ajustada Altiplano >1500m' : 'Nivel basal'})`,
      value: `${input.hemoglobin} g/dL`,
      normalRange: `≥ ${minHb} a ${maxHb} g/dL`,
      status: 'invalid',
      isDeferral: true,
      deferralType: 'temporal',
      deferralDuration: '3 a 6 meses (tras reposición de hierro)',
      nomReference: 'NOM-253 Numeral 6.4.1 y Tabla 1',
      explanation: `Tu hemoglobina (${input.hemoglobin} g/dL) está por debajo del umbral mínimo regulatorio de ${minHb} g/dL para tu sexo y altitud. Donar en este estado causaría agotamiento de depósitos de ferritina medular y síntomas anémicos.`,
      recommendation: 'Consulta a tu médico familiar para evaluar reservas de hierro (ferritina sérica) y consumir alimentos ricos en hierro hemínico (carnes magras, legumbres con cítricos).'
    });
  } else if (input.hemoglobin > maxHb) {
    evaluations.push({
      parameter: 'Hemoglobina',
      value: `${input.hemoglobin} g/dL`,
      normalRange: `≥ ${minHb} a ${maxHb} g/dL`,
      status: 'warning',
      isDeferral: true,
      deferralType: 'temporal',
      deferralDuration: 'Hasta confirmación clínica de hemoconcentración o poliglobulia',
      nomReference: 'NOM-253 Numeral 6.4.1',
      explanation: `Tu hemoglobina supera el límite superior de ${maxHb} g/dL. Puede deberse a deshidratación aguda o policitemia.`,
      recommendation: 'Bebe al menos 1.5 a 2 litros de agua y repite la biometría hemática en 48 horas.'
    });
  } else {
    evaluations.push({
      parameter: 'Hemoglobina',
      value: `${input.hemoglobin} g/dL`,
      normalRange: `${minHb} - ${maxHb} g/dL`,
      status: 'valid',
      isDeferral: false,
      nomReference: 'NOM-253 Numeral 6.4.1',
      explanation: 'Concentración óptima de hemoglobina. La unidad obtenida aportará al menos 45 g de hemoglobina terapéutica al receptor.',
      recommendation: 'Excelente oxigenación tisular y masa eritrocitaria.'
    });
  }

  // 4. PRESIÓN ARTERIAL
  const isBPOk =
    input.systolicBP >= 90 &&
    input.systolicBP <= 180 &&
    input.diastolicBP >= 60 &&
    input.diastolicBP <= 100;

  if (!isBPOk) {
    evaluations.push({
      parameter: 'Tensión Arterial',
      value: `${input.systolicBP}/${input.diastolicBP} mmHg`,
      normalRange: 'Sistólica: 90 - 180 / Diastólica: 60 - 100 mmHg',
      status: 'invalid',
      isDeferral: true,
      deferralType: 'temporal',
      deferralDuration: 'Reposo en sala o reprogramación tras ajuste terapéutico',
      nomReference: 'NOM-253 Numeral 5.10.3',
      explanation: `Cifra tensional fuera de rango reglamentario (${input.systolicBP}/${input.diastolicBP} mmHg). Puede provocar cuadros vasovagales o crisis hipertensivas con la flebotomía.`,
      recommendation: 'Reposa 15 minutos en un ambiente tranquilo y solicita una segunda toma. Si persiste alterada, consulta a tu médico.'
    });
  } else {
    evaluations.push({
      parameter: 'Tensión Arterial',
      value: `${input.systolicBP}/${input.diastolicBP} mmHg`,
      normalRange: '90-180 / 60-100 mmHg',
      status: 'valid',
      isDeferral: false,
      nomReference: 'NOM-253 Numeral 5.10.3',
      explanation: 'Presión hemodinámica dentro de los rangos de tolerancia fisiológica.',
      recommendation: 'Adecuada perfusión sistémica.'
    });
  }

  // 5. FRECUENCIA CARDÍACA
  if (input.heartRate < 50 || input.heartRate > 100) {
    evaluations.push({
      parameter: 'Frecuencia Cardíaca',
      value: `${input.heartRate} lpm`,
      normalRange: '50 - 100 lpm regular',
      status: input.heartRate >= 45 && input.heartRate < 50 ? 'warning' : 'invalid',
      isDeferral: !(input.heartRate >= 45 && input.heartRate < 50),
      deferralType: 'temporal',
      deferralDuration: 'Hasta normalización del ritmo en reposo',
      nomReference: 'NOM-253 Numeral 5.10.4',
      explanation: input.heartRate > 100
        ? 'Taquicardia (FC > 100 lpm), frecuentemente secundaria a estrés, cafeína o deshidratación.'
        : 'Bradicardia (FC < 50 lpm). Solo admisible en deportistas entrenados con evaluación clínica.',
      recommendation: 'Evita bebidas energéticas o café antes del triaje y realiza respiraciones profundas.'
    });
  } else {
    evaluations.push({
      parameter: 'Frecuencia Cardíaca',
      value: `${input.heartRate} lpm`,
      normalRange: '50 - 100 lpm',
      status: 'valid',
      isDeferral: false,
      nomReference: 'NOM-253 Numeral 5.10.4',
      explanation: 'Ritmo cardíaco normocárdico y estable.',
      recommendation: 'Parámetro en orden.'
    });
  }

  // 6. TEMPERATURA
  if (input.temperature > 37.5) {
    evaluations.push({
      parameter: 'Temperatura corporal',
      value: `${input.temperature} °C`,
      normalRange: '≤ 37.5 °C',
      status: 'invalid',
      isDeferral: true,
      deferralType: 'temporal',
      deferralDuration: '14 días tras resolución del cuadro febril',
      nomReference: 'NOM-253 Numeral 5.10.5',
      explanation: 'Febrícula o fiebre activa. Denota un proceso inflamatorio o infeccioso agudo que invalida la donación.',
      recommendation: 'Acude a revisión médica para diagnosticar el foco de fiebre y reprograma tu donación dos semanas después.'
    });
  } else {
    evaluations.push({
      parameter: 'Temperatura corporal',
      value: `${input.temperature} °C`,
      normalRange: '≤ 37.5 °C',
      status: 'valid',
      isDeferral: false,
      nomReference: 'NOM-253 Numeral 5.10.5',
      explanation: 'Temperatura normotérmica.',
      recommendation: 'Ausencia de síndrome febril agudo.'
    });
  }

  // 7. AYUNO
  if (input.fastingHours < 4) {
    evaluations.push({
      parameter: 'Horas de Ayuno',
      value: `${input.fastingHours} horas`,
      normalRange: '4 a 12 horas (libre de grasas)',
      status: 'warning',
      isDeferral: true,
      deferralType: 'temporal',
      deferralDuration: `Esperar ${4 - input.fastingHours} hora(s) más para cumplir 4 horas`,
      nomReference: 'NOM-253 Numeral 5.10.6',
      explanation: 'Un ayuno menor a 4 horas incrementa la presencia de quilomicrones (lipemia), interfiriendo en las pruebas de tamizaje serológico por ELISA.',
      recommendation: 'Permanece en sala y reprograma la punción una vez completadas las 4 horas de digestión.'
    });
  } else if (input.fastingHours > 12) {
    evaluations.push({
      parameter: 'Horas de Ayuno',
      value: `${input.fastingHours} horas (Prolongado)`,
      normalRange: '4 a 12 horas',
      status: 'warning',
      isDeferral: false,
      nomReference: 'NOM-253 Numeral 5.10.6',
      explanation: 'Ayuno excesivo mayor a 12 horas aumenta el riesgo de hipoglucemia y mareo durante la donación.',
      recommendation: 'Se recomienda tomar agua abundante y un jugo o fruta dulce antes de pasar a la toma.'
    });
  } else {
    evaluations.push({
      parameter: 'Horas de Ayuno',
      value: `${input.fastingHours} horas`,
      normalRange: '4 a 12 horas',
      status: 'valid',
      isDeferral: false,
      nomReference: 'NOM-253 Numeral 5.10.6',
      explanation: 'Tiempo de ayuno idóneo sin lipemia en suero.',
      recommendation: 'Asegura buena hidratación con agua simple.'
    });
  }

  // 8. DESCANSO / SUEÑO
  if (input.sleepHours < 6) {
    evaluations.push({
      parameter: 'Descanso previo',
      value: `${input.sleepHours} horas de sueño`,
      normalRange: '≥ 6 horas recomendadas',
      status: 'warning',
      isDeferral: false,
      nomReference: 'Guías de Hemovigilancia CNTS',
      explanation: 'Dormir menos de 6 horas aumenta la excitabilidad del sistema nervioso autónomo y la susceptibilidad a lipotimias.',
      recommendation: 'Informa al médico para que el equipo de flebotomía mantenga mayor vigilancia post-donación.'
    });
  } else {
    evaluations.push({
      parameter: 'Descanso previo',
      value: `${input.sleepHours} horas`,
      normalRange: '≥ 6 horas',
      status: 'valid',
      isDeferral: false,
      nomReference: 'Guías de Hemovigilancia CNTS',
      explanation: 'Descanso nocturno satisfactorio para tolerar la pérdida de volumen.',
      recommendation: 'Condiciones psicofísicas idóneas.'
    });
  }

  // 9. TATUAJES, PERFORACIONES O MICROPIGMENTACIÓN
  if (input.tattooPiercingMonths !== null) {
    if (input.tattooPiercingMonths < 12) {
      const remaining = 12 - input.tattooPiercingMonths;
      evaluations.push({
        parameter: 'Tatuajes, piercings o microblading',
        value: `Hace ${input.tattooPiercingMonths} mes(es)`,
        normalRange: '≥ 12 meses cumplidos',
        status: 'invalid',
        isDeferral: true,
        deferralType: 'temporal',
        deferralDuration: `Faltan ${remaining} mes(es) para cumplir los 12 meses reglamentarios`,
        nomReference: 'NOM-253 Numeral 5.10.15',
        explanation: `La norma oficial estipula 12 meses obligatorios para garantizar la resolución del periodo de ventana inmunológico frente a Hepatitis B, C y VIH.`,
        recommendation: `Marca en tu calendario la fecha exacta en ${remaining} mes(es). ¡Tu donación será invaluable en cuanto transcurra este periodo!`
      });
    } else {
      evaluations.push({
        parameter: 'Tatuajes, piercings o microblading',
        value: `Hace ${input.tattooPiercingMonths} meses (Supera los 12 meses)`,
        normalRange: '≥ 12 meses cumplidos',
        status: 'valid',
        isDeferral: false,
        nomReference: 'NOM-253 Numeral 5.10.15',
        explanation: 'Ha transcurrido más de un año desde el procedimiento; el periodo de ventana está completamente superado.',
        recommendation: 'Criterio superado satisfactoriamente.'
      });
    }
  }

  // 10. CIRUGÍAS RECIENTES
  if (input.recentSurgery === 'major_under_12m') {
    evaluations.push({
      parameter: 'Cirugías mayores o endoscopías',
      value: 'Cirugía mayor en los últimos 12 meses',
      normalRange: '≥ 12 meses de recuperación',
      status: 'invalid',
      isDeferral: true,
      deferralType: 'temporal',
      deferralDuration: 'Hasta completar 12 meses postoperatorios',
      nomReference: 'NOM-253 Numeral 5.10.16',
      explanation: 'Las cirugías mayores y endoscopías con biopsia exigen 12 meses de diferimiento para recuperación hemostática y descarte de exposición nosocomial.',
      recommendation: 'Permite que tus tejidos completen su cicatrización y homeostasis hematológica.'
    });
  } else if (input.recentSurgery === 'minor_recent') {
    evaluations.push({
      parameter: 'Cirugías menores recientes',
      value: 'Procedimiento quirúrgico menor reciente',
      normalRange: '1 a 6 meses según procedimiento',
      status: 'warning',
      isDeferral: true,
      deferralType: 'temporal',
      deferralDuration: 'Sujeto a dictamen médico (1 a 3 meses)',
      nomReference: 'NOM-253 Numeral 5.10.16',
      explanation: 'Requiere que las heridas estén totalmente epitelizadas y sin suturas activas.',
      recommendation: 'Presenta el resumen de alta o nota médica en tu entrevista.'
    });
  }

  // 11. PROCEDIMIENTOS DENTALES
  if (input.dentalProcedureDays !== null && input.dentalProcedureDays < 7) {
    evaluations.push({
      parameter: 'Procedimientos odontológicos',
      value: `Hace ${input.dentalProcedureDays} día(s)`,
      normalRange: '≥ 7 días post-extracción / limpieza profunda',
      status: 'invalid',
      isDeferral: true,
      deferralType: 'temporal',
      deferralDuration: `Faltan ${7 - input.dentalProcedureDays} día(s) para completar 7 días`,
      nomReference: 'NOM-253 Numeral 5.10.17',
      explanation: 'Las extracciones, limpiezas y endodoncias provocan bacteriemia transitoria en sangre que podría colonizar la bolsa de donación.',
      recommendation: 'Espera que transcurra una semana completa para asegurar la total esterilidad sanguínea.'
    });
  }

  // 12. ANTIBIÓTICOS RECIENTES
  if (input.antibioticsDaysAgo !== null && input.antibioticsDaysAgo < 14) {
    evaluations.push({
      parameter: 'Tratamiento con Antibióticos',
      value: `Hace ${input.antibioticsDaysAgo} día(s)`,
      normalRange: '≥ 14 días tras la última dosis',
      status: 'invalid',
      isDeferral: true,
      deferralType: 'temporal',
      deferralDuration: `Faltan ${14 - input.antibioticsDaysAgo} día(s)`,
      nomReference: 'NOM-253 Numeral 5.10.18',
      explanation: 'Se debe esperar 14 días para asegurar la erradicación del germen infeccioso y la depuración farmacológica del principio activo en plasma.',
      recommendation: 'Finaliza tu tratamiento completo y espera 2 semanas tras la última toma.'
    });
  }

  // 13. EMBARAZO Y LACTANCIA
  if (input.pregnancyStatus === 'pregnant') {
    evaluations.push({
      parameter: 'Estado reproductivo',
      value: 'Embarazo en curso',
      normalRange: 'No gestante',
      status: 'invalid',
      isDeferral: true,
      deferralType: 'temporal',
      deferralDuration: 'Durante toda la gestación y 6 meses post-parto',
      nomReference: 'NOM-253 Numeral 5.10.14',
      explanation: 'La donación durante el embarazo comprometería el flujo sanguíneo fetoplacentario y los depósitos maternos de hierro y folatos.',
      recommendation: 'Dedícate por completo a cuidar tu salud y la de tu bebé.'
    });
  } else if (input.pregnancyStatus === 'breastfeeding' || input.pregnancyStatus === 'postpartum_under_6m') {
    evaluations.push({
      parameter: 'Estado reproductivo',
      value: input.pregnancyStatus === 'breastfeeding' ? 'Lactancia activa' : 'Post-parto < 6 meses',
      normalRange: '≥ 6 meses post-parto y concluida la lactancia',
      status: 'invalid',
      isDeferral: true,
      deferralType: 'temporal',
      deferralDuration: 'Hasta 6 meses posteriores al parto y final de lactancia',
      nomReference: 'NOM-253 Numeral 5.10.14',
      explanation: 'La lactancia demanda un alto recambio hídrico y de nutrientes esenciales para el lactante.',
      recommendation: 'Te esperamos con los brazos abiertos una vez concluida esta hermosa etapa.'
    });
  }

  // 14. ALCOHOL RECIENTE
  if (input.alcoholHoursAgo < 48) {
    evaluations.push({
      parameter: 'Consumo de bebidas alcohólicas',
      value: `Hace ${input.alcoholHoursAgo} horas`,
      normalRange: '≥ 48 horas de abstinencia',
      status: 'warning',
      isDeferral: true,
      deferralType: 'temporal',
      deferralDuration: `Esperar ${48 - input.alcoholHoursAgo} horas para completar 48 horas`,
      nomReference: 'NOM-253 Numeral 5.10.19',
      explanation: 'El consumo de alcohol en las 48 horas previas altera la función plaquetaria, genera deshidratación celular y puede inducir hipotensión.',
      recommendation: 'Mantente bien hidratado con agua y reprograma tu cita cumplidas las 48 horas.'
    });
  }

  // 15. CONDUCTAS DE ALTO RIESGO / ENFERMEDADES CRÓNICAS
  if (input.highRiskBehavior) {
    evaluations.push({
      parameter: 'Prácticas de riesgo biológico parenteral/sexual',
      value: 'Positivo',
      normalRange: 'Ausente',
      status: 'invalid',
      isDeferral: true,
      deferralType: 'definitivo',
      nomReference: 'NOM-253 Numeral 5.11',
      explanation: 'Exclusión por riesgo de transmisión de patógenos en periodo de ventana no detectable por técnicas serológicas convencionales.',
      recommendation: 'La seguridad biológica de los receptores vulnerables es la máxima prioridad sanitaria.'
    });
  }

  if (input.chronicDiseases && input.chronicDiseases.length > 0) {
    evaluations.push({
      parameter: 'Padecimientos crónicos declarados',
      value: input.chronicDiseases.join(', '),
      normalRange: 'Ausencia de cardiopatías, nefropatías, epilepsia o neoplasias',
      status: 'invalid',
      isDeferral: true,
      deferralType: 'definitivo',
      nomReference: 'NOM-253 Numeral 5.11',
      explanation: 'Ciertas afecciones crónicas requieren diferimiento definitivo para no descompensar la patología de base ni transfundir factores biológicos patológicos.',
      recommendation: 'Tu apoyo como promotor y divulgador altruista de la donación de sangre es igual de valioso.'
    });
  }

  // DETERMINACIÓN DEL DICTAMEN FINAL
  const hasDefinitiveDeferral = evaluations.some(
    (e) => e.isDeferral && e.deferralType === 'definitivo'
  );
  const hasTemporalDeferral = evaluations.some(
    (e) => e.isDeferral && e.deferralType === 'temporal'
  );

  let finalStatus: TriageStatus = 'APTO';
  let statusTitle = 'CANDIDATO APTO PARA DONACIÓN';
  let statusDescription =
    'Cumples rigurosamente con los criterios fisiológicos y normativos de la NOM-253-SSA1-2012 para proceder a la donación voluntaria.';

  if (hasDefinitiveDeferral) {
    finalStatus = 'DIFERIDO_DEFINITIVO';
    statusTitle = 'NO APTO / DIFERIMIENTO DEFINITIVO';
    statusDescription =
      'De acuerdo con las disposiciones sanitarias federales, se detectaron condiciones de exclusión definitiva para proteger tu salud o la del receptor.';
  } else if (hasTemporalDeferral) {
    finalStatus = 'DIFERIDO_TEMPORAL';
    statusTitle = 'DIFERIDO TEMPORALMENTE';
    statusDescription =
      'Actualmente presentas uno o más parámetros que requieren un periodo de espera para garantizar tu bienestar y la seguridad transfusional.';
  }

  // Generate summary points
  evaluations.forEach((ev) => {
    if (ev.isDeferral) {
      summaryPoints.push(
        `• ${ev.parameter}: ${ev.explanation} (${ev.nomReference})`
      );
    }
  });

  if (summaryPoints.length === 0) {
    summaryPoints.push(
      '• Todos los parámetros biométricos se encuentran dentro de las directrices de la NOM-253-SSA1-2012.',
      `• Volemia calculada: ${(volemiaCalc.volemiaMl / 1000).toFixed(2)} L. Extracción segura máxima: ${volemiaCalc.maxExtractionSafeMl} mL (Bolsa estándar: 450 mL).`,
      '• Recuerda acudir con documento oficial con fotografía (INE / Pasaporte) e hidratarte previamente.'
    );
  }

  return {
    status: finalStatus,
    statusTitle,
    statusDescription,
    evaluatedAt: new Date().toLocaleString('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }),
    totalVolemiaMl: volemiaCalc.volemiaMl,
    maxExtractableMl: volemiaCalc.maxExtractionSafeMl,
    standardDonationMl: volemiaCalc.standardBagMl,
    volemiaSafePercentage: volemiaCalc.extractionPercentage,
    evaluations,
    summaryPoints
  };
}
