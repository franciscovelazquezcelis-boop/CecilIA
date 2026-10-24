import { NomCard } from '../types';

export const NOM_253_ARTICLES: NomCard[] = [
  {
    id: 'nom-edad-peso',
    category: 'criterios_seleccion',
    numeral: '5.10.1 y 5.10.2',
    title: 'Edad y Peso Mínimo del Donante',
    shortDescription: 'Rango obligatorio de 18 a 65 años y peso corporal mínimo de 50 kg para extracción segura.',
    fullText: '5.10.1 Tener entre 18 y 65 años de edad cumplidos. Las personas mayores de 65 años que sean donantes habituales podrán donar si cuentan con autorización médica del banco de sangre.\n5.10.2 Pesar 50 kg o más. En personas con peso menor a 50 kg, el volumen de extracción habitual (450 mL ± 10%) excedería el límite fisiológico de seguridad del 13% de la volemia total.',
    laboratoryImpact: 'Garantiza la relación anticoagulante-sangre (63 mL de CPDA-1 por cada 450 mL de sangre total ± 10%). Si el peso es menor a 50 kg se requiere una purga proporcional del anticoagulante para evitar toxicidad por citrato en el receptor.',
    donorRelevance: 'Protege al donante de episodios de hipotensión vasovagal, mareo, síncope y anemia iatrogénica.',
    tags: ['Edad', 'Peso', 'Volemia', 'Criterios Básicos']
  },
  {
    id: 'nom-hemoglobina-altitud',
    category: 'criterios_seleccion',
    numeral: '6.4.1 y Tabla 1',
    title: 'Cifras de Hemoglobina y Ajuste por Altitud',
    shortDescription: 'Límites mínimos de hemoglobina según sexo y metros sobre el nivel del mar (msnm).',
    fullText: '6.4.1 La concentración de hemoglobina y el hematocrito deben medirse antes de cada flebotomía. A nivel del mar:\n- Mujeres: Hemoglobina ≥ 12.5 g/dL (Hto ≥ 38%)\n- Hombres: Hemoglobina ≥ 13.5 g/dL (Hto ≥ 41%)\nPara altitudes superiores a 1,500 msnm (p. ej. Ciudad de México a 2,240 msnm, Toluca, Puebla), los valores mínimos se ajustan por hipoxia fisiológica a:\n- Mujeres: Hemoglobina ≥ 14.0 g/dL\n- Hombres: Hemoglobina ≥ 15.0 g/dL\nValor máximo aceptado: ≤ 18.0 g/dL en hombres y ≤ 16.5 g/dL en mujeres para descartar poliglobulia patológica.',
    laboratoryImpact: 'Asegura que el concentrado eritrocitario obtenido cumpla con el estándar de calidad de contenido mínimo de hemoglobina (≥ 45 g por unidad) para una terapia transfusional eficaz.',
    donorRelevance: 'Evita inducir anemia en el donante y asegura que retenga reservas suficientes de hierro medular.',
    tags: ['Hemoglobina', 'Hematocrito', 'Altitud', 'CDMX', 'Biometría']
  },
  {
    id: 'nom-signos-vitales',
    category: 'criterios_seleccion',
    numeral: '5.10.3 a 5.10.5',
    title: 'Signos Vitales y Estado Físico Inmediato',
    shortDescription: 'Parámetros hemodinámicos: Tensión arterial, frecuencia cardíaca y temperatura corporal.',
    fullText: 'El candidato a donar debe presentar:\n- Tensión Arterial: Sistólica entre 90 y 180 mmHg; Diastólica entre 60 y 100 mmHg.\n- Frecuencia Cardíaca: Entre 50 y 100 latidos por minuto, con ritmo regular. (En atletas de alto rendimiento se aceptan frecuencias menores si el electrocardiograma o exploración clínica es normal).\n- Temperatura corporal: Axilar o bucal no mayor a 37.5°C.\n- Horas de sueño: Mínimo 6 horas de descanso nocturno previo.\n- Ayuno: Mínimo 4 horas libre de grasas y lácteos; no exceder 12 horas de ayuno prolongado.',
    laboratoryImpact: 'El ayuno libre de lípidos previene la lipemia del suero y plasma, la cual interfiere severamente en las lecturas espectrofotométricas de ELISA y quimioluminiscencia serológica.',
    donorRelevance: 'Previene colapso hemodinámico o reacciones vagales durante y después de la punción venosa.',
    tags: ['Tensión Arterial', 'Frecuencia Cardíaca', 'Temperatura', 'Ayuno']
  },
  {
    id: 'nom-tatuajes-perforaciones',
    category: 'criterios_seleccion',
    numeral: '5.10.15',
    title: 'Tatuajes, Perforaciones y Micropigmentación',
    shortDescription: 'Diferimiento temporal obligatorio de 12 meses contados a partir del procedimiento.',
    fullText: '5.10.15 Se diferirán por un periodo de 12 meses a las personas que se hayan realizado tatuajes, acupuntura, perforaciones en orejas o cualquier parte del cuerpo (piercings), micropigmentación o contacto de mucosas con instrumentos punzocortantes no estériles.',
    laboratoryImpact: 'Este periodo cubre el periodo de ventana serológica para Virus de la Hepatitis C (VHC), Hepatitis B (VHB) y Virus de la Inmunodeficiencia Humana (VIH) frente a técnicas serológicas estándar.',
    donorRelevance: 'Tener un tatuaje NO te excluye de por vida. Solo debes esperar que transcurran 12 meses completos desde que te lo realizaste.',
    tags: ['Tatuajes', 'Piercings', 'Diferimiento', 'Periodo de Ventana']
  },
  {
    id: 'nom-cirugias-endoscopias',
    category: 'criterios_seleccion',
    numeral: '5.10.16',
    title: 'Cirugías, Endoscopías y Transfusiones Previas',
    shortDescription: 'Diferimiento de 12 meses para cirugías mayores, endoscopías con biopsia o antecedentes transfusionales.',
    fullText: 'Se diferirán por un lapso de 12 meses a quienes hayan recibido:\n- Transfusión de sangre o hemocomponentes\n- Trasplante de tejidos o células alogénicas\n- Cirugías mayores o procedimientos invasivos con endoscopía flexible\n- Exposición accidental a sangre humana o pinchazo con aguja biológica contaminada.',
    laboratoryImpact: 'Previene aloinmunización frente a antígenos eritrocitarios menores o HLA, y bloquea transmisión nosocomial inadvertida.',
    donorRelevance: 'Las cirugías menores no complicadas (p. ej. extirpación de quiste simple sin transfusión) requieren típicamente de 1 a 6 meses de recuperación según valoración médica.',
    tags: ['Cirugía', 'Endoscopía', 'Transfusión Previa', 'Bioseguridad']
  },
  {
    id: 'nom-pruebas-serologicas',
    category: 'pruebas_serologicas',
    numeral: '9.1 a 9.5',
    title: 'Tamizaje Serológico Obligatorio en México',
    shortDescription: 'Pruebas analíticas indispensables para descartar infecciones transmitidas por transfusión.',
    fullText: '9.1 Toda unidad de sangre o hemocomponente destinada a transfusión alogénica debe someterse rigurosamente a las siguientes pruebas analíticas:\n1. Virus de la Inmunodeficiencia Humana tipos 1 y 2 (Anti-VIH 1/2 y Antígeno p24).\n2. Virus de la Hepatitis B (Antígeno de Superficie AgHBs y anticuerpos totales anti-core Anti-HBc).\n3. Virus de la Hepatitis C (Anticuerpos Anti-VHC).\n4. Treponema pallidum (Prueba treponémica para Sífilis).\n5. Trypanosoma cruzi (Enfermedad de Chagas, mediante dos metodologías serológicas distintas).\n6. Brucella spp. (Pruebas aglutinantes como Rosa de Bengala en zonas endémicas de la República Mexicana).\n9.3 Los bancos de sangre deben implementar preferentemente pruebas de amplificación de ácidos nucleicos (NAT).',
    laboratoryImpact: 'Cualquier unidad inicialmente reactiva se repite por duplicado. Si resulta reactiva confirmatoria, la unidad se incinera biológicamente y el donante es notificado confidencialmente.',
    donorRelevance: 'Garantiza que la sangre donada sea biológicamente segura para el paciente pediátrico, oncológico o quirúrgico.',
    tags: ['VIH', 'Hepatitis', 'Chagas', 'Sífilis', 'Brucella', 'NAT', 'Serología']
  },
  {
    id: 'nom-conservacion-eritrocitos',
    category: 'conservacion_componentes',
    numeral: '8.4.1',
    title: 'Conservación del Concentrado Eritrocitario (CE)',
    shortDescription: 'Temperatura estricta de +2°C a +6°C con monitoreo térmico continuo.',
    fullText: '8.4.1 Los concentrados de eritrocitos deben conservarse en refrigeración especializada de banco de sangre entre +2°C y +6°C.\n- Vigencia en solución CPDA-1: hasta 35 días posteriores a la extracción.\n- Vigencia con solución aditiva preservadora (SAGM, AS-1, AS-3, AS-5): hasta 42 días.\n- Deben contar con registro gráfico térmico y alarma sonora ante desviaciones.',
    laboratoryImpact: 'A +4°C se ralentiza la glicólisis anaerobia eritrocitaria, preservando los niveles de ATP y 2,3-difosfoglicerato (2,3-DPG), evitando la lisis de la membrana celular.',
    donorRelevance: 'Cada unidad de glóbulos rojos salva vidas en anemias severas, accidentes automovilísticos, hemorragias obstétricas y cirugías cardiovasculares.',
    tags: ['Eritrocitos', 'Refrigeración', 'CPDA-1', 'SAGM', 'Hemoderivados']
  },
  {
    id: 'nom-conservacion-plaquetas',
    category: 'conservacion_componentes',
    numeral: '8.4.2',
    title: 'Conservación de Concentrados Plaquetarios (CP)',
    shortDescription: 'Temperatura de +20°C a +24°C con agitación horizontal suave y continua.',
    fullText: '8.4.2 Los concentrados de plaquetas (recuperadas de sangre total o por aféresis) deben conservarse a temperatura controlada de +20°C a +24°C en incubador con agitación suave y continua (60 ciclos por minuto).\n- Caducidad máxima: 5 días en sistema cerrado (o hasta 7 días con sistema de detección bacteriana validado).\n- Nunca deben refrigerarse, pues el frío induce activación irreversible y aclaramiento hepático precoz.',
    laboratoryImpact: 'Al conservarse a temperatura ambiente, las plaquetas tienen mayor riesgo de proliferación bacteriana si hubo contaminación en la punción, por lo que el descarte de los primeros 30-40 mL (tubo de desvío) es mandatorio.',
    donorRelevance: 'Vitales para pacientes con leucemia, quimioterapia, trasplantes de médula ósea y sangrado trombocitopénico masivo.',
    tags: ['Plaquetas', 'Agitación', 'Incubador', 'Aféresis', 'Oncología']
  },
  {
    id: 'nom-conservacion-plasma-crio',
    category: 'conservacion_componentes',
    numeral: '8.4.3 y 8.4.4',
    title: 'Plasma Fresco Congelado (PFC) y Crioprecipitados',
    shortDescription: 'Congelación a ≤ -18°C o ≤ -30°C para preservar los factores lábiles de la coagulación.',
    fullText: '8.4.3 El Plasma Fresco Congelado debe separarse y congelarse en las primeras 6 a 8 horas de la flebotomía.\n- A temperatura ≤ -18°C: caducidad de 12 meses.\n- A temperatura ≤ -30°C: caducidad de hasta 24 meses.\n8.4.4 El Crioprecipitado contiene Factor VIII, Factor von Willebrand, Fibrinógeno y Factor XIII. Se almacena a ≤ -18°C hasta por 12 meses.',
    laboratoryImpact: 'La congelación rápida criopreserva los factores lábiles V y VIII, fundamentales para corregir coagulopatías de consumo y coagulación intravascular diseminada (CID).',
    donorRelevance: 'Un solo donante altruista de sangre total aporta eritrocitos, plasma y plaquetas, ayudando hasta a 3 o 4 pacientes distintos.',
    tags: ['Plasma', 'Crioprecipitado', 'Congelación', 'Coagulación', 'Fibrinógeno']
  },
  {
    id: 'nom-pruebas-compatibilidad',
    category: 'inmunohematologia',
    numeral: '10.1 a 10.4',
    title: 'Inmunohematología y Pruebas Cruzadas',
    shortDescription: 'Grupo ABO directo e inverso, fenotipo Rh (D), Coombs y prueba cruzada mayor.',
    fullText: '10.1 Se debe corroborar el grupo ABO mediante prueba globular (antígenos en eritrocitos con antisueros anti-A, anti-B, anti-AB) y prueba sérica/inversa (anticuerpos en suero con eritrocitos conocidos A1 y B).\n10.2 Investigación del antígeno Rh (D) y búsqueda de variante débil D (Du) en donantes.\n10.3 Rastreo de Anticuerpos Irregulares (RAI) mediante panel de células cribadas y prueba de antiglobulina humana (Coombs).\n10.4 Prueba Cruzada Mayor: Enfrenta suero del receptor contra eritrocitos del donante para detectar anticuerpos que pudieran causar reacción hemolítica aguda intravascular.',
    laboratoryImpact: 'Evita la incompatibilidad ABO, que representa la emergencia inmunohematológica más letal en medicina transfusional (shock hemolítico mediado por IgM y complemento).',
    donorRelevance: 'Garantiza la compatibilidad biológica perfecta antes de que la sangre entre en el torrente sanguíneo del receptor.',
    tags: ['ABO', 'Rh', 'Coombs', 'Prueba Cruzada', 'Inmunohematología']
  },
  {
    id: 'nom-medicamentos-diferimiento',
    category: 'criterios_seleccion',
    numeral: '5.10.18',
    title: 'Medicamentos y Diferimientos Farmacológicos',
    shortDescription: 'Reglas de suspensión para aspirina, AINEs, antibióticos, retinoides e inmunosupresores.',
    fullText: '5.10.18 El uso de medicamentos determina exclusiones temporales específicas:\n- Ácido acetilsalicílico (Aspirina) y AINEs (ibuprofeno, naproxeno): Se difiere por 48 a 72 horas para donación de plaquetas (para sangre total es aceptable si el fin no es obtener plaquetas funcionales).\n- Antibióticos orales o parenterales: Difieren por 14 días tras la última dosis y resolución clínica del cuadro infeccioso.\n- Isotretinoína (Acnecutan/Roaccutan): 1 mes de diferimiento por teratogenicidad.\n- Dutasterida / Finasterida (hiperplasia prostática / alopecia): Difieren de 1 a 6 meses.\n- Anticoagulantes orales (warfarina, acenocumarol, DOACs): Difiere permanentemente o según cese y patología de base.',
    laboratoryImpact: 'Los fármacos teratogénicos presentes en el plasma transfundido podrían causar malformaciones fetales graves en receptoras embarazadas.',
    donorRelevance: 'Informa al médico de triaje cualquier medicamento o suplemento naturista que hayas tomado en la última semana.',
    tags: ['Medicamentos', 'Aspirina', 'Antibióticos', 'Farmacología']
  },
  {
    id: 'nom-hemovigilancia',
    category: 'hemovigilancia',
    numeral: '11.1 a 11.6',
    title: 'Hemovigilancia y Reacciones Adversas',
    shortDescription: 'Detección, registro y notificación inmediata de reacciones en el donante (RAD) y receptor (RAT).',
    fullText: '11.1 La hemovigilancia es el conjunto de procedimientos de vigilancia epidemiológica que abarca toda la cadena transfusional.\n- En el donante: Registro y atención inmediata de mareo, náusea, hipotensión, hematomas, punción arterial accidental o síncope vasovagal.\n- En el receptor: Monitoreo durante los primeros 15 minutos (a goteo lento) y durante toda la infusión para detectar fiebre, escalofríos, urticaria, disnea (TRALI/TACO) o hemólisis.',
    laboratoryImpact: 'Permite la trazabilidad absoluta desde la vena del donante hasta la vena del receptor durante un periodo mínimo de 5 a 10 años.',
    donorRelevance: 'El personal de enfermería y medicina transfusional te acompañará y te proporcionará un refrigerio balanceado tras la donación para tu pronta recuperación.',
    tags: ['Hemovigilancia', 'Seguridad', 'Reacción Adversa', 'Trazabilidad']
  }
];
