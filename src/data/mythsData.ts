import { MythItem } from '../types';

export const DONATION_MYTHS: MythItem[] = [
  {
    id: 'mito-tatuajes',
    myth: 'Si tengo tatuajes o piercings nunca más podré donar sangre en mi vida.',
    fact: 'FALSO: Puedes donar perfectamente después de cumplir 12 meses de haberte tatuado o perforado.',
    scientificExplanation: 'La NOM-253-SSA1-2012 (numeral 5.10.15) establece un periodo de diferimiento temporal de 12 meses. Este tiempo garantiza que cualquier hipotética exposición a virus como VHB, VHC o VIH haya superado con creces su periodo de ventana serológica.',
    source: 'NOM-253',
    category: 'estilo_vida'
  },
  {
    id: 'mito-infeccion',
    myth: 'Donar sangre puede contagiarme de VIH u otras enfermedades.',
    fact: 'FALSO: Es biológicamente imposible contagiarse durante el acto de donar.',
    scientificExplanation: 'Como destaca González de Buitrago y el legado de Paul de Kruif sobre esterilidad, todo el material utilizado (agujas, bolsas y conectores) es 100% estéril, desechable, apirogénico y de un solo uso. La aguja se abre frente a tus ojos y se destruye en el contenedor de RPBI inmediatamente al finalizar.',
    source: 'Buitrago',
    category: 'procedimiento'
  },
  {
    id: 'mito-peso-engorda',
    myth: 'Donar sangre engorda o debilita de forma permanente.',
    fact: 'FALSO: Donar sangre ni engorda ni adelgaza, y el volumen se recupera en horas.',
    scientificExplanation: 'El volumen plasmático donado (~450 mL) se restituye por vía osmótica e ingesta de líquidos en las primeras 24 a 48 horas. Los glóbulos rojos son repuestos por la médula ósea estimulada por eritropoyetina en pocas semanas. No tiene ningún impacto en el metabolismo de grasas corporales.',
    source: 'NOM-253',
    category: 'fisiologia'
  },
  {
    id: 'mito-ayuno-extremo',
    myth: 'Debo ir en un ayuno total de más de 12 horas para que mi sangre sirva.',
    fact: 'FALSO: El ayuno excesivo provoca desmayos y lipotimias.',
    scientificExplanation: 'La NOM-253 exige un ayuno mínimo de 4 horas pero que NO supere las 8-12 horas. Se recomienda hidratarse con agua abundante y se pueden consumir frutas ligeras (manzana, plátano) o té sin leche. Solo deben evitarse comidas grasosas, fritos y lácteos para evitar lipemia en el plasma analizado.',
    source: 'NOM-253',
    category: 'procedimiento'
  },
  {
    id: 'mito-dolor-debilidad',
    myth: 'El procedimiento es muy doloroso y tardado.',
    fact: 'FALSO: La extracción efectiva dura apenas entre 8 y 12 minutos.',
    scientificExplanation: 'Solo se siente una leve molestia inicial similar a un pellizco al insertar la aguja. Los donantes reposan 10 minutos y reciben un refrigerio nutritivo. En menos de una hora total el donante regresa a sus actividades cotidianas (evitando ejercicio pesado por 24h).',
    source: 'CNTS',
    category: 'procedimiento'
  },
  {
    id: 'mito-orientacion-sexual',
    myth: 'La orientación sexual de una persona define si puede o no donar.',
    fact: 'FALSO: Los criterios actuales se basan en conductas de riesgo biológico individual, no en la orientación sexual.',
    scientificExplanation: 'La bioética moderna y las directrices de la OMS y el Centro Nacional de la Transfusión Sanguínea (CNTS) establecen que la evaluación debe enfocarse en prácticas sexuales sin protección y múltiples parejas en periodos de ventana, garantizando un trato digno, no discriminatorio y estrictamente científico.',
    source: 'NOM-253',
    category: 'estilo_vida'
  },
  {
    id: 'mito-anticonceptivos',
    myth: 'Tomar pastillas anticonceptivas o analgésicos comunes impide donar.',
    fact: 'FALSO: Los anticonceptivos orales no interfieren con la donación.',
    scientificExplanation: 'Las hormonas anticonceptivas no afectan la calidad de los componentes sanguíneos ni suponen riesgo para el receptor. Respecto a analgésicos como el paracetamol, es totalmente permitido. Si tomaste aspirina o ibuprofeno recientemente, solo se difiere si la donación es exclusiva de plaquetas (aféresis).',
    source: 'Buitrago',
    category: 'fisiologia'
  },
  {
    id: 'mito-hipertension',
    myth: 'Las personas con hipertensión controlada jamás pueden donar.',
    fact: 'FALSO: Si tu presión arterial está en rango terapéutico normal, eres apto.',
    scientificExplanation: 'Si el donante toma medicación antihipertensiva estable y en la toma física presenta una tensión arterial entre 90/60 mmHg y 180/100 mmHg sin síntomas cardiovasculares, la NOM-253 permite la donación previa autorización del médico del banco de sangre.',
    source: 'NOM-253',
    category: 'fisiologia'
  }
];
