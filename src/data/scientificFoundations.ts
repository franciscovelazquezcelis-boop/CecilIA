export interface ScientificPillar {
  id: string;
  authorOrStandard: string;
  title: string;
  focusArea: string;
  iconName: string;
  quote: string;
  summary: string;
  keyContributions: {
    title: string;
    description: string;
    practicalApplication: string;
  }[];
  laboratoryMethods: string[];
}

export const SCIENTIFIC_PILLARS: ScientificPillar[] = [
  {
    id: 'buitrago',
    authorOrStandard: 'Dr. José Manuel González de Buitrago',
    title: 'Técnicas y Métodos de Laboratorio Clínico',
    focusArea: 'Metodología Analítica, Bioquímica Clínica y Control de Calidad en Hematología',
    iconName: 'TestTube',
    quote: 'La reproducibilidad analítica y el rigor metodológico son la primera línea de defensa para la vida del paciente transfundido.',
    summary: 'Referencia cumbre en formación de técnicos y químicos clínicos. Aporta los fundamentos sobre el manejo preanalítico de muestras sanguíneas, el comportamiento de los anticoagulantes (EDTA, citrato trisódico, CPDA-1), la separación de fracciones por centrifugación diferencial y el control estadístico de calidad (gráficas de Levey-Jennings y reglas de Westgard) en el banco de sangre.',
    keyContributions: [
      {
        title: 'Manejo Preanalítico y Anticoagulantes',
        description: 'Estandarización de proporciones exactas entre sangre total y anticoagulante preservador (CPDA-1: citrato de sodio para quelar calcio, fosfato para buffer de pH, dextrosa para aporte energético celular y adenina para regenerar ATP).',
        practicalApplication: 'Previene la coagulación espontánea sin inducir hiperosmolaridad ni lisis celular en la bolsa de extracción.'
      },
      {
        title: 'Fraccionamiento Físico y Centrifugación Diferencial',
        description: 'Parámetros precisos de aceleración centrífuga (fuerza centrífuga relativa RCF) a temperaturas controladas (4°C para eritrocitos y plasma; 22°C para plaquetas).',
        practicalApplication: 'Obtención limpia de tres hemocomponentes vitales a partir de una única donación de sangre total.'
      },
      {
        title: 'Garantía y Control de Calidad Analítico',
        description: 'Validación de técnicas inmunoquímicas (ELISA, Quimioluminiscencia CLIA) y parámetros espectrofotométricos para descartar interferencias por hemólisis, ictericia y lipemia.',
        practicalApplication: 'Elimina falsos positivos o falsos negativos en el tamizaje serológico de donantes.'
      }
    ],
    laboratoryMethods: [
      'Centrifugación pesada y suave (Soft / Hard Spin)',
      'Espectrofotometría y ensayos inmunoenzimáticos',
      'Control de calidad de reactivos y antisueros hemotipadores',
      'Coombs directo e indirecto con técnica en tubo y microgel'
    ]
  },
  {
    id: 'dekruif',
    authorOrStandard: 'Paul de Kruif',
    title: 'Cazadores de Microbios (Microbe Hunters)',
    focusArea: 'Microbiología Histórica, Asepsia, Infecciones Parenterales y Esterilidad',
    iconName: 'Microscope',
    quote: 'Los microbios no surgen de la nada: viajan en instrumentos inadvertidos y en fluidos invisibles. La asepsia es el milagro de la medicina moderna.',
    summary: 'Aporta la perspectiva histórica, epistémica y metodológica indispensable para comprender la naturaleza de los agentes infecciosos transmisibles por sangre. Desde el descubrimiento de los protozoos por Leeuwenhoek y los principios de esterilización de Pasteur y Koch, hasta los estudios de Schaudinn y Hoffmann (Treponema) y Carlos Chagas (Trypanosoma cruzi), de Kruif nos recuerda que la esterilidad de los circuitos cerrados salva miles de vidas.',
    keyContributions: [
      {
        title: 'Esterilidad y Circuitos Cerrados de Flebotomía',
        description: 'La sangre humana es un caldo de cultivo extraordinariamente rico. Toda aguja o bolsa debe ser rigurosamente apirogénica, estéril y sellada herméticamente para erradicar la contaminación microbiana.',
        practicalApplication: 'Uso obligatorio de bolsas cuádruples cerradas con tubo de desvío (primeros 30-40 mL) para evitar que bacterias de la piel contaminen la unidad.'
      },
      {
        title: 'Detección de Agentes Sigilosos de Transmisión Parenteral',
        description: 'Comprensión de patógenos que circulan en sangre asintomática: espiroquetas como Treponema pallidum (sífilis), hemoflagelados como Trypanosoma cruzi (Chagas) y viriones de hepatitis.',
        practicalApplication: 'Justifica biológicamente los periodos de diferimiento temporal (12 meses para tatuajes) por el tiempo requerido para la seroconversión.'
      },
      {
        title: 'Cadena de Frío como Freno Microbiano',
        description: 'La refrigeración a 2-6°C inhibe la multiplicación de casi todas las bacterias ambientales, mientras que la crioconservación detiene toda actividad enzimática perjudicial.',
        practicalApplication: 'Conservación estricta de hemocomponentes para erradicar choques sépticos bacterianos en el receptor.'
      }
    ],
    laboratoryMethods: [
      'Asepsia de piel con clorhexidina al 2% o alcohol iodado',
      'Desvío inicial de muestra para hemocultivo y pruebas',
      'Técnicas de tamizaje treponémico y tripanosómico',
      'Control microbiológico aleatorio de unidades plaquetarias'
    ]
  },
  {
    id: 'nom253',
    authorOrStandard: 'Secretaría de Salud de México (SSA / CNTS)',
    title: 'Norma Oficial Mexicana NOM-253-SSA1-2012',
    focusArea: 'Marco Legal, Criterios de Selección, Disposición de Sangre y Hemovigilancia',
    iconName: 'ShieldCheck',
    quote: 'La donación de sangre es un acto voluntario, altruista, libre y no remunerado que constituye un principio de solidaridad y seguridad sanitaria nacional.',
    summary: 'Documento regulatorio oficial supremo en la República Mexicana. Norma la captación, extracción, análisis, conservación, fraccionamiento, transporte y transfusión de sangre y sus componentes. Establece los criterios médicos y analíticos para proteger tanto la salud del donante altruista como la seguridad del paciente receptor.',
    keyContributions: [
      {
        title: 'Criterios de Aptitud y Diferimiento',
        description: 'Protocolos de evaluación clínica basados en evidencia: edad (18-65 años), peso mínimo de 50 kg, niveles de hemoglobina según altitud geográfica y periodos de diferimiento específicos.',
        practicalApplication: 'Algoritmo uniforme de triaje que evita tanto el rechazo innecesario como la extracción riesgosa.'
      },
      {
        title: 'Tamizaje Infeccioso Obligatorio de 100% de las Unidades',
        description: 'Descarte obligatorio de VIH 1/2, Hepatitis B (AgHBs y Anti-HBc), Hepatitis C, Sífilis y Chagas en territorio nacional, con adición de Brucella en zonas endémicas.',
        practicalApplication: 'Cero tolerancia a unidades reactivas; trazabilidad total por medio de códigos de barras ISBT-128.'
      },
      {
        title: 'Inmunohematología y Pruebas de Compatibilidad',
        description: 'Verificación estricta de grupo sanguíneo ABO y factor Rh con doble tipificación (globular e inversa), rastreo de anticuerpos irregulares y prueba cruzada mayor.',
        practicalApplication: 'Prevención de reacciones hemolíticas transfusionales fatales.'
      }
    ],
    laboratoryMethods: [
      'ISBT 128 (Código de barras de trazabilidad transfusional)',
      'Pruebas cruzadas mayor, menor y autocontrol',
      'Tamizaje molecular por PCR / NAT en tiempo real',
      'Monitoreo y reporte al Sistema Nacional de Hemovigilancia'
    ]
  }
];
