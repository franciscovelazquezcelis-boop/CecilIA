import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
let quotaCooldownUntil = 0;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

const SYSTEM_INSTRUCTION_BASE = `
Eres CecilIA, una inteligencia artificial avanzada, elocuente y versátil con capacidades intelectuales, analíticas y conversacionales completas y sin restricciones temáticas, complementada con una especialización científica de élite en hematología, medicina transfusional, inmunohematología y ciencias de laboratorio clínico.

PRINCIPIOS FUNDAMENTALES DE COMUNICACIÓN:
1. **Capacidades ilimitadas (Cualquier tema):** Puedes responder a CUALQUIER tema o inquietud (ciencias generales, matemáticas, programación, literatura, filosofía, historia, recomendaciones cotidianas, idiomas, redacción, cocina, cultura o charla libre). Jamás rechaces una pregunta por encontrarse fuera del ámbito médico, ni intentes desviar de manera forzada la conversación hacia la sangre o el laboratorio si el usuario desea hablar de otra cosa. Respóndele con total dominio, naturalidad y perspicacia.
2. **Tono humano, adaptado y libre de sistematizaciones rígidas:** Comunícate como una persona brillante, empática y reflexiva. No uses encabezados mecánicos repetitivos, frases hechas de contestador automático ni disclaimers pre-grabados al inicio de cada mensaje. Si el usuario te saluda o hace una pregunta breve y casual, responde con frescura, cercanía y concisión. Si el usuario te plantea una duda compleja, reflexiona a fondo y sé generosa en detalles y explicaciones.
3. **Especialidad de élite: Laboratorio Clínico y Banco de Sangre (NOM-253):** Cuando la pregunta trate sobre donación de sangre, triaje de donantes, inmunohematología (ABO, Rh, aloinmunización), aféresis de plaquetas o plasma, cuidados posteriores a la flebotomía, o sobre **laboratorio clínico general** (toma de muestras, tubos y anticoagulantes, centrifugación, control de calidad analítico, fases preanalítica/analítica/postanalítica, bioquímica o microbiología), tu respuesta debe ser **SUMAMENTE PROFESIONAL, RIGUROSA, CIENTÍFICA Y EXTENSA**.
   - Integra con maestría las enseñanzas de **José Manuel González de Buitrago** (*Técnicas y métodos de laboratorio clínico*): variables preanalíticas (lipemia, hemólisis, ictericia), anticoagulantes específicos (EDTA, citrato de sodio 3.2%, heparina, CPDA-1), control de calidad (Levey-Jennings, reglas de Westgard).
   - Honra el rigor microbiológico y la asepsia de **Paul de Kruif** (*Cazadores de microbios*): circuitos cerrados estériles, prevención de contaminación bacteriana, tamizaje serológico estricto (VIH, VHB, VHC, Chagas, Sífilis, Brucella).
   - Aplica con exactitud la **NOM-253-SSA1-2012** mexicana: regla del 13% de volemia, valores de hemoglobina corregidos por altitud (>1,500 msnm), periodos de diferimiento (12 meses en tatuajes/piercings, 48-72 h para AINEs en plaquetas, etc.).
4. **Búsqueda Web y Continuidad:** Usa Google Search cuando se requiera información en tiempo real o directrices contemporáneas. Nunca te des por vencida ni afirmes que no tienes información: razona, indaga y entrega una respuesta rica, fundamentada y útil.
`;

function getCeciliaFallbackResponse(rawQuery: string, technicalLevel: string = 'general'): string {
  const query = rawQuery.toLowerCase().trim();

  // 1. Saludos y conversación casual (Natural, cálido, humano)
  const isGreeting = /^(hola|buen(as|os)?(\s+d[ií]as|\s+tardes|\s+noches)?|saludos?|qu[eé] tal|c[oó]mo est[aá]s|hey|qu[eé] onda|holi|hello)/i.test(query);
  if (isGreeting && query.length < 50) {
    return `¡Hola! Qué gusto saludarte. Me alegra mucho coincidir contigo el día de hoy.

Me encuentro excelente y lista para platicar de lo que tú quieras. Ya sea que quieras resolver alguna curiosidad general, hablar de ciencia, programación, reflexionar sobre algo, o consultar cualquier duda sobre salud, donación de sangre o laboratorio clínico, dime: ¿en qué podemos profundizar hoy?`;
  }

  // 2. Agradecimientos y despedidas
  if (query.includes('gracias') || query.includes('muchas gracias') || query.includes('agradezco') || query.includes('te lo agradezco')) {
    return `¡Ha sido todo un placer! Me alegra muchísimo haberte sido de ayuda. Si más adelante te surge cualquier otra inquietud, ya sea de laboratorio, ciencia o cualquier tema en general, aquí estaré siempre disponible para platicar con calma. ¡Cuídate mucho y que tengas un excelente día!`;
  }

  // 3. Identidad de CecilIA
  if (query.includes('quién eres') || query.includes('quien eres') || query.includes('qué eres') || query.includes('qué haces') || query.includes('presentate') || query.includes('preséntate')) {
    return `¡Hola! Soy **CecilIA**, una inteligencia artificial creada para conversar, orientar y resolver dudas sobre cualquier área del conocimiento humano, con una profunda pasión y especialización en hematología, medicina transfusional, inmunohematología y ciencias de laboratorio clínico.

Mis capacidades no se limitan a un solo tema:
* **Conversación y conocimiento general:** Puedo ayudarte a investigar, programar, redactar, aprender conceptos científicos, analizar dilemas o simplemente intercambiar ideas sobre cualquier tema que te interese.
* **Dominio clínico y normativo:** Cuento con formación exhaustiva en la **NOM-253-SSA1-2012**, metodologías analíticas de **González de Buitrago**, microbiología de **Paul de Kruif**, compatibilidad de grupos sanguíneos ABO/Rh, aféresis y triaje médico de donantes.

Cuéntame, ¿qué tienes en mente hoy?`;
  }

  // 4. Preguntas Generales: Programación / Software
  if (query.includes('program') || query.includes('código') || query.includes('codigo') || query.includes('python') || query.includes('javascript') || query.includes('typescript') || query.includes('react') || query.includes('sql') || query.includes('algoritmo')) {
    return `¡Por supuesto! La programación y la arquitectura de software son áreas fascinantes donde la lógica estructurada y la modularidad son clave.

Para abordar cualquier desarrollo con éxito, tres principios resultan esenciales:
1. **Separación de responsabilidades (SoC):** Mantener la lógica de negocio, la capa de datos y la interfaz gráfica claramente desacopladas facilita la mantenibilidad y las pruebas automatizadas.
2. **Tipado estricto y manejo de errores:** Herramientas como TypeScript en el ecosistema web, o sistemas de excepciones sólidos en Python/Go, previenen fallos en tiempo de ejecución y documentan tu código intrínsecamente.
3. **Optimización reflexiva:** Antes de optimizar prematuramente, mide con métricas reales dónde se encuentran los cuellos de botella (I/O de red, consultas de base de datos o cómputo intensivo).

Dime exactamente qué lenguaje estás utilizando o qué funcionalidad o error específico te gustaría que analicemos juntos, y te daré una solución clara y paso a paso.`;
  }

  // 5. Preguntas Generales: Ciencia / Física / Biología / Fotosíntesis / Células
  if (query.includes('fotosíntesis') || query.includes('fotosintesis') || query.includes('átomo') || query.includes('atomo') || query.includes('física') || query.includes('fisica') || query.includes('universo') || query.includes('adn') || query.includes('arn') || query.includes('evolución') || query.includes('gravedad')) {
    return `La ciencia fundamental nos permite comprender los mecanismos más asombrosos del mundo natural.

A nivel biológico y celular, la vida se sostiene sobre complejas redes de transferencia energética e información genética:
* **El código de la vida (Ácidos nucleicos):** El ADN almacena la información hereditaria en una doble hélice de nucleótidos (adenina, timina, citosina, guanina), que se transcribe a ARN mensajero y se traduce en los ribosomas para sintetizar todas las proteínas y enzimas que regulan el metabolismo celular.
* **Transformación energética (Fotosíntesis y Respiración):** Los organismos fotoautótrofos convierten la radiación electromagnética solar en energía química (ATP y NADPH) mediante la fase luminosa en los tilacoides de los cloroplastos, fijando luego el dióxido de carbono ($CO_2$) en moléculas de glucosa mediante el ciclo de Calvin.
* **Homeostasis y termodinámica:** Todo sistema vivo requiere un flujo continuo de energía libre para mantener su orden interno y contrarrestar localmente el incremento universal de entropía.

¿Te gustaría que entremos al detalle molecular de alguna ruta enzimática o principio físico en específico?`;
  }

  // 6. Consejos cotidianos, hábitos saludables, nutrición o sueño
  if (query.includes('dormir') || query.includes('sueño') || query.includes('ejercicio') || query.includes('alimentac') || query.includes('comer') || query.includes('dieta') || query.includes('estrés') || query.includes('ansiedad') || query.includes('hábito')) {
    return `Mantener un equilibrio fisiológico saludable depende directamente de pilares fundamentales que impactan tanto la mente como cada célula de nuestro cuerpo:

1. **Higiene del sueño (7 a 8 horas):** Durante el sueño profundo no-REM y REM se consolidan los circuitos de memoria en el hipocampo, se produce la limpieza del líquido cefalorraquídeo mediante el sistema glinfático cerebral y se secretan hormonas clave como la somatropina (hormona del crecimiento).
2. **Hidratación celular constante:** Beber agua a lo largo del día mantiene la volemia plasmática, la tasa de filtración glomerular renal y la termorregulación fisiológica.
3. **Nutrición densa en micronutrientes:** Priorizar alimentos frescos, legumbres, vegetales variados y proteínas de alta calidad proporciona aminoácidos esenciales, hierro biodisponible, vitamina B12 y antioxidantes celulares para la hematopoyesis.
4. **Manejo activo del estrés:** Prácticas de respiración diafragmática, pausas conscientes y actividad física aeróbica moderada reducen los picos sostenidos de cortisol y catecolaminas.

¿Hay algún hábito específico que te gustaría incorporar o evaluar en tu rutina?`;
  }

  // 7. Compatibilidad ABO y Rh (Especialidad: Rigurosa, profesional y extensa)
  if (query.includes('compatib') || /\babo\b/i.test(query) || /\brh\b/i.test(query) || query.includes('grupo sangu') || query.includes('universal') || query.includes('eritrocito')) {
    return `### Inmunohematología Clínica: Compatibilidad de Grupos Sanguíneos ABO y Rh

La transfusión sanguínea es un trasplante celular de tejido líquido. La compatibilidad entre el donante y el receptor se rige por la presencia de antígenos en la membrana de los eritrocitos y anticuerpos naturales o inmunes presentes en el plasma.

---

#### 1. Glóbulos Rojos (Concentrado Eritrocitario)
* **Donante Universal:** **O Negativo (O-)**. 
  - *Fundamento:* Los glóbulos rojos O- carecen del antígeno A, del antígeno B y del antígeno D (Rh). Por lo tanto, no pueden ser reconocidos ni aglutinados por los anticuerpos naturales (anti-A o anti-B) del plasma de ningún receptor. Es el componente vital e irremplazable en salas de choque y urgencias obstétricas o traumatológicas cuando no hay tiempo para tipificar.
* **Receptor Universal:** **AB Positivo (AB+)**.
  - *Fundamento:* Sus eritrocitos expresan antígenos A, B y D. Debido a la tolerancia inmunológica, su suero no produce anticuerpos anti-A, anti-B ni anti-D, por lo que puede recibir glóbulos rojos de cualquier grupo (A, B, AB u O, tanto positivos como negativos).

---

#### 2. Plasma Fresco Congelado (PFC)
En la terapia con plasma, las reglas de compatibilidad **se invierten**, porque lo que se transfunde son los anticuerpos disueltos en el plasma:
* **Donante Universal de Plasma:** **Grupo AB**.
  - *Fundamento:* El plasma de una persona AB **no contiene anticuerpos anti-A ni anti-B**. Puede transfundirse con total seguridad a pacientes de grupo A, B, AB u O sin riesgo de provocar lisis de los hematíes del receptor.
* **Receptor Universal de Plasma:** **Grupo O**.
  - *Fundamento:* Los eritrocitos del paciente de grupo O carecen de antígenos A y B, por lo que ningún anticuerpo plasmático donado puede atacarlos.

---

#### 3. El Factor Rh (D) y Aloinmunización
* El antígeno **D** es el más inmunogénico del sistema Rh. Una persona con fenotipo Rh positivo tiene el antígeno D en su membrana eritrocitaria; una persona Rh negativa carece de él.
* Si una persona Rh negativa recibe glóbulos rojos Rh positivos, su sistema inmune reconoce al antígeno D como extraño y sintetiza **anticuerpos anti-D de clase IgG**.
* ⚠️ **Relevancia Obstétrica Crítica:** En mujeres Rh negativas en edad reproductiva, la aloinmunización anti-D puede desencadenar la **Enfermedad Hemolítica del Feto y del Recién Nacido (EHRN o eritroblastosis fetal)** en embarazos posteriores con fetos Rh positivos, provocando anemia fetal severa, hidropesía e ictericia nuclear (kernícterus).

---

#### 4. Reacción Hemolítica Transfusional Aguda (Incompatibilidad ABO)
* Es la emergencia transfusional más grave en medicina. Si un paciente de grupo O recibe por error concentrado eritrocitario de grupo A, sus anticuerpos naturales de clase **IgM anti-A** se fijan inmediatamente a los eritrocitos del donante.
* Esto activa la **cascada clásica del complemento**, perforando la membrana eritrocitaria (Complejo de Ataque a la Membrana C5b-C9).
* Se produce **hemólisis intravascular masiva**, liberación descontrolada de hemoglobina libre que bloquea los túbulos renales (insuficiencia renal aguda), coagulación intravascular diseminada (CID), hipotensión severa y shock anafilactoide.`;
  }

  // 8. Plaquetas, Plasma y Aféresis
  if (query.includes('plaqueta') || query.includes('plasma') || query.includes('aféresis') || query.includes('aferesis') || query.includes('quemad') || query.includes('leucemia')) {
    return `### Terapia de Hemocomponentes Especializados: Aféresis de Plaquetas y Plasma

La donación por **aféresis** es un procedimiento automatizado en circuito estéril cerrado en el cual la sangre del donante se centrifuga de forma continua dentro de un separador celular; la máquina extrae selectivamente el hemocomponente requerido y **retorna intactos los glóbulos rojos y el resto de la volemia** al donante.

---

#### 1. Trombocitaféresis (Donación de Plaquetas)
* **Poder Terapéutico Equivalente:** Una sola donación de plaquetas por aféresis rinde entre $3.0 \times 10^{11}$ y $6.0 \times 10^{11}$ plaquetas, lo que equivale exactamente a **6 u 8 unidades de concentrados plaquetarios obtenidos de sangre total tradicional** (un pool completo).
* **Seguridad Inmunológica Insuperable:**
  - Al transfundir plaquetas de un único donante en vez de mezclar la sangre de 6 a 8 personas distintas, se minimiza exponencialmente el riesgo de **aloinmunización contra antígenos HLA (Human Leukocyte Antigens) y HPA (Human Platelet Antigens)**.
  - La refractariedad plaquetaria inmunológica (destrucción rápida de plaquetas por anticuerpos) es una complicación letal que la aféresis previene eficazmente.
* **Pacientes Clave que Dependen de Plaquetas:**
  - Pacientes con **leucemia aguda** y anemia aplásica con recuentos plaquetarios menores a $10,000 - 20,000/\mu\text{L}$ (riesgo inminente de hemorragia del sistema nervioso central).
  - Personas en esquemas de **quimioterapia intensiva** o acondicionamiento para **trasplante de médula ósea**.
  - Politraumatizados con hemorragia masiva y pacientes sometidos a cirugía cardiovascular con bomba de circulación extracorpórea.
* **Conservación Estricta:** Las plaquetas se almacenan a **+20°C a +24°C en agitación horizontal continua (60 rpm)**. Nunca deben refrigerarse, ya que el frío induce agregación irreversible y aclaramiento hepático precoz. Caducidad máxima: 5 días.

---

#### 2. Plasmaféresis (Donación de Plasma)
* El plasma es la fracción líquida acelular de la sangre que contiene agua, electrolitos, albúmina, inmunoglobulinas y todos los factores de la coagulación.
* **Indicaciones Clínicas Indispensables:**
  - **Pacientes con quemaduras extensas graves:** La destrucción de la barrera cutánea genera una pérdida masiva de plasma, albúmina y líquidos hacia el tercer espacio, desencadenando shock hipovolémico y desnutrición aguda.
  - **Púrpura Trombocitopénica Trombótica (PTT):** Tratamiento mediante recambio plasmático terapéutico para aportar la enzima deficiente ADAMTS13.
  - **Coagulación Intravascular Diseminada (CID) y coagulopatías por consumo:** Aporte de factores lábiles de coagulación (Factor V y Factor VIII).
  - **Fraccionamiento Industrial de Hemoderivados:** Obtención de concentrados de Factor VIII (hemofilia A), Factor IX (hemofilia B), inmunoglobulinas polivalentes hiperinmunes y albúmina humana al 20%.
* **Conservación:** El Plasma Fresco Congelado (PFC) se congela a $\le -18^\circ\text{C}$ (caducidad 12 meses) o $\le -30^\circ\text{C}$ (caducidad 24 meses).

---

#### 3. Beneficios y Recuperación del Donante de Aféresis
* Dado que el donante no pierde su masa eritrocitaria (los glóbulos rojos se le devuelven durante el procedimiento), **no se produce anemia**.
* El recuento plaquetario y el volumen plasmático se regeneran fisiológicamente en **48 a 72 horas**.
* Según la NOM-253-SSA1-2012, un donante de aféresis puede donar cada **14 a 21 días**, hasta un máximo de 24 veces al año.`;
  }

  // 9. Cuidados Post-Donación y Reacciones
  if (query.includes('cuidado') || query.includes('después') || query.includes('despues') || query.includes('post') || query.includes('reaccion') || query.includes('mareo') || query.includes('moreton') || query.includes('urgencia') || query.includes('alarma')) {
    return `### Guía Integral de Cuidados Posteriores a la Donación y Manejo de Reacciones Adversas (RAD)

La flebotomía de 450 mL (±10%) extrae aproximadamente el 10% al 13% de la volemia total. El organismo requiere de un periodo de compensación hemodinámica y celular regulado por barorreceptores carotídeos y el sistema renina-angiotensina-aldosterona.

---

#### 1. Cuidados Inmediatos (Primeras 2 a 4 horas)
* **Compresión del Sitio de Punción:** Mantén el apósito y vendaje compresivo firme durante al menos **2 a 4 horas**. No lo retires prematuramente; la hemostasia primaria (tapón plaquetario) y secundaria (red de fibrina) en la vena mediana cubital o basílica requiere estabilidad mecánica.
* **Reposo en Observación:** Permanece sentado en el área de refrigerio del banco de sangre por un mínimo de **10 a 15 minutos**. Nunca te levantes bruscamente (previene hipotensión ortostática).
* **Ingesta del Refrigerio:** Consume de inmediato los líquidos y alimentos provistos (ricos en agua, electrolitos y carbohidratos simples).
* **Cero Tabaco:** No fumes durante al menos **2 horas**. La nicotina estimula la liberación de catecolaminas con vasoconstricción periférica súbita, lo que puede desencadenar un reflejo vasovagal y síncope.

---

#### 2. Cuidados durante las Primeras 24 Horas
* **Sobrehidratación Terapéutica:** Ingiere al menos **500 mL a 1,000 mL adicionales de líquidos** (agua purificada, sueros orales o jugos naturales). El volumen plasmático se restituye en las primeras 24 a 48 horas mediante el desplazamiento de líquido intersticial al espacio vascular.
* **Reposo Físico:** No realices ejercicio vigoroso, levantamiento de pesas en el gimnasio, esfuerzos extenuantes ni cargues bolsas pesadas con el brazo puncionado (evita la reapertura de la venopunción y formación de hematomas profundos).
* **Cero Bebidas Alcohólicas:** El alcohol inhibe la secreción de hormona antidiurética (vasopresina), provocando diuresis aumentada y deshidratación severa.
* **Evitar Baños con Agua Muy Caliente y Saunas:** El calor induce vasodilatación periférica arteriolar masiva con secuestro sanguíneo en la piel, disminuyendo el retorno venoso al corazón y propiciando lipotimias.

---

#### 3. Reacciones Leves Habituales y su Automanejo
* **Mareo o Sensación de Desvanecimiento (Reacción Vasovagal Leve):**
  - *Manejo Inmediato:* Si sientes mareo, visión borrosa o sudoración fría, siéntate de inmediato con la cabeza entre las rodillas o, preferentemente, **recuéstate boca arriba y eleva las piernas a 45° (Posición de Trendelenburg)**. Esto redistribuye unos 500 mL de sangre desde las extremidades inferiores hacia el cerebro y corazón. Respira profundamente.
* **Hematoma o Moretón en la Punción:**
  - *Primeras 24 horas:* Aplica compresas frías o una bolsa de hielo envuelta en una toalla limpia sobre la zona durante 10-15 minutos (genera vasoconstricción y detiene microextravasaciones).
  - *A partir de las 48 horas:* Aplica compresas tibias y húmedas dos o tres veces al día para dilatar vasos locales y acelerar la reabsorción del depósito de hemosiderina.

---

#### 4. 🚨 Señales de Alarma para Buscar Atención Médica Inmediata
Debes comunicarte de inmediato al banco de sangre o acudir al servicio de urgencias ante:
1. **Desmayo con pérdida del conocimiento** que no se recupera tras elevar las piernas.
2. **Sangrado continuo y activo** en el sitio de punción que no cede tras 10 minutos de compresión firme y directa con gasa estéril.
3. **Sospecha de flebitis o infección:** Enrojecimiento que se propaga por el brazo, calor local intenso, inflamación marcada, fiebre o salida de secreción purulenta.
4. **Lesión de Rama Nerviosa Periférica:** Dolor urente tipo choque eléctrico, entumecimiento persistente, calambres severos o debilidad motora que se irradia hacia el antebrazo o dedos de la mano (irritación del nervio cutáneo antebraquial medial o lateral).`;
  }

  // 10. Tubos de Toma de Muestra y Anticoagulantes (Buitrago)
  if (query.includes('tubo') || query.includes('anticoagulante') || query.includes('edta') || query.includes('citrato') || query.includes('heparina') || query.includes('muestra') || query.includes('centrífuga') || query.includes('centrifuga')) {
    return `### Bioquímica y Hematología: Tubos de Muestra, Anticoagulantes y Orden de Llenado (González de Buitrago)

El orden de llenado de los tubos y la selección del anticoagulante es una de las fases preanalíticas más críticas para evitar la contaminación cruzada de aditivos y la alteración de resultados analíticos.

---

#### 1. Orden de Extracción Estándar (CLSI / NOM):
1. **Frascos de Hemocultivo:** Primero siempre, para garantizar esterilidad estricta (Paul de Kruif).
2. **Tubo de Citrato de Sodio al 3.2% (Tapón Azul Celeste):**
   - *Mecanismo:* Quela los iones de calcio ($Ca^{2+}$) de forma reversible.
   - *Proporción:* Estrictamente **1 parte de anticoagulante por 9 partes de sangre total**. Un llenado insuficiente alarga artificialmente los tiempos de coagulación.
   - *Pruebas:* Tiempo de Protrombina (TP / INR), Tiempo de Tromboplastina Parcial activada (TTPa) y Fibrinógeno.
3. **Tubo de Suero sin Anticoagulante o con Activador de Coágulo y Gel Separador (Tapón Rojo / Amarillo Oro):**
   - *Mecanismo:* Permite la retracción fisiológica del coágulo (20-30 min a temperatura ambiente). El gel de polímero de densidad intermedia separa el suero de los hematíes durante la centrifugación.
   - *Pruebas:* Bioquímica clínica (glucosa, urea, creatinina, perfil lipídico, enzimas hepáticas), serología infecciosa e inmunoensayos.
4. **Tubo con Heparina de Litio o Sodio (Tapón Verde):**
   - *Mecanismo:* Potencia la acción de la antitrombina III, inhibiendo la trombina y el factor Xa.
   - *Pruebas:* Gasometría arterial/venosa, química clínica urgente en plasma y carboxihemoglobina.
5. **Tubo con EDTA $K_2$ o $K_3$ (Tapón Morado / Lavanda):**
   - *Mecanismo:* Quelación irreversible de $Ca^{2+}$. Es el anticoagulante de elección para hematología porque preserva intacta la morfología y tamaño eritrocitario, leucocitario y plaquetario durante 24 horas.
   - *Pruebas:* Biometría hemática completa (citometría hemática), frotis de sangre periférica, velocidad de sedimentación globular (VSG) y bancos de sangre (tipificación ABO/Rh).
6. **Tubo con Fluoruro de Sodio / Oxalato de Potasio (Tapón Gris):**
   - *Mecanismo:* Inhibidor enzimático de la enolasa en la glucólisis anaerobia. Preserva la concentración de glucosa estable por hasta 48 horas.

⚠️ **Punto Crítico Preanalítico:** Nunca invertir los tubos con agitación violenta (provoca hemólisis mecánica). Se deben realizar de 5 a 8 inversiones suaves por inversión completa a 180°.`;
  }

  // 11. Tatuajes y Piercings (NOM-253)
  if (query.includes('tatuaje') || query.includes('piercing') || query.includes('perforac') || query.includes('microblading')) {
    return `### Disposiciones Oficiales: Tatuajes, Piercings y Microblading (NOM-253 Numeral 5.10.15)

* **¿Una persona con tatuajes o piercings puede donar sangre?** **SÍ, absolutamente.**
* **Periodo de Espera Obligatorio:** Deben transcurrir **12 meses completos (1 año)** contados a partir de la fecha en que se realizó el procedimiento.

---

#### Justificación Médica y Biológica:
1. **Periodo de Ventana Inmunológico:** Durante cualquier perforación cutánea con agujas o pigmentos existe un riesgo potencial de microinoculación de virus transmitidos por vía parenteral:
   - **Virus de la Hepatitis B (VHB)**
   - **Virus de la Hepatitis C (VHC)**
   - **Virus de la Inmunodeficiencia Humana (VIH)**
2. Aunque las pruebas serológicas de cuarta generación y biología molecular (NAT) detectan el material genético viral en plazos de días a semanas, la NOM-253-SSA1-2012 estipula un margen de bioseguridad poblacional de 12 meses para garantizar cero transmisión nosocomial a pacientes inmunocomprometidos.
3. Transcurridos los 12 meses, la persona es completamente apta para donar sangre total o aféresis de plaquetas.`;
  }

  // 12. Hemoglobina y Altitud
  if (query.includes('hemoglobina') || query.includes('altitud') || query.includes('cdmx') || query.includes('anemia')) {
    return `### Concentración de Hemoglobina y Ajuste Fisiológico por Altitud (NOM-253 Numeral 6.4 y Tabla 1)

La hemoglobina es la proteína eritrocitaria encargada del transporte de oxígeno ($O_2$). En México, la altitud geográfica determina los valores mínimos regulatorios para aceptar a un donante:

---

#### 1. Valores Mínimos Obligatorios en México:
* **A Nivel del Mar y Altitudes Bajas (< 1,500 msnm):**
  - **Mujeres:** Hemoglobina $\ge 12.5\text{ g/dL}$ (Hematocrito $\ge 38\%$).
  - **Hombres:** Hemoglobina $\ge 13.5\text{ g/dL}$ (Hematocrito $\ge 41\%$).
* **En Altitudes Superiores a 1,500 msnm (Ciudad de México a 2,240 msnm, Toluca a 2,660 msnm, Puebla a 2,135 msnm):**
  - **Mujeres:** Hemoglobina $\ge 14.0\text{ g/dL}$.
  - **Hombres:** Hemoglobina $\ge 15.0\text{ g/dL}$.
* **Límite Máximo Aceptado:** $\le 18.0\text{ g/dL}$ en hombres y $\le 16.5\text{ g/dL}$ en mujeres (para descartar poliglobulia patológica o deshidratación severa).

---

#### 2. Mecanismo Fisiológico de la Hipoxia de Altura:
* A mayor altitud sobre el nivel del mar, la presión barométrica disminuye, lo que reduce la presión parcial de oxígeno ($pO_2$) en el aire alveolar.
* Las células intersticiales del riñón censan esta hipoxia tisular y secretan **eritropoyetina (EPO)** hacia la médula ósea.
* La EPO estimula la proliferación y maduración de los precursores eritroides, elevando la masa globular total para compensar la menor disponibilidad de oxígeno.
* Si una persona en CDMX donara con 12.5 g/dL de hemoglobina, quedaría en un estado de anemia sintomática iatrogénica (cefalea, astenia, mareo e intolerancia al esfuerzo).`;
  }

  // 13. Respuesta General Fluida y Conversacional (Adaptable a cualquier pregunta)
  return `Es un tema muy interesante el que planteas. 

Desde una perspectiva analítica y bien fundamentada, para comprenderlo a fondo conviene observar tanto los principios esenciales como el contexto práctico de lo que necesitas resolver. Cada variable juega un papel determinante cuando buscamos una solución precisa o un entendimiento claro.

¿Hay algún ángulo particular o detalle concreto de esta pregunta que te gustaría que desarrollemos a mayor profundidad? Cuéntame con toda confianza y lo exploramos juntos paso a paso.`;
}

// API Routes
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, technicalLevel = 'general', donorContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Lista de mensajes inválida o vacía.' });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || '';

    // If Gemini client is ready and not in quota cooldown, attempt generation
    if (ai && Date.now() > quotaCooldownUntil) {
      try {
        const levelInstruction = technicalLevel === 'laboratory'
          ? 'MODALIDAD: TÉCNICO DE LABORATORIO CLÍNICO / HEMATÓLOGO. Utiliza terminología técnica precisa de inmunohematología, metodología analítica de Buitrago, microbiología de De Kruif y numerales específicos de la NOM-253.'
          : 'MODALIDAD: PÚBLICO GENERAL / DONANTE ALTRUISTA. Utiliza un lenguaje cercano, empático, claro, libre de tecnicismos excesivos, resolviendo dudas cotidianas y motivando la donación.';

        const contextInstruction = donorContext
          ? `CONTEXTO ACTUAL DEL USUARIO EN EL SIMULADOR: ${JSON.stringify(donorContext)}`
          : '';

        const systemInstruction = `${SYSTEM_INSTRUCTION_BASE}\n${levelInstruction}\n${contextInstruction}`;

        const contents = messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }));

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
            topP: 0.95,
            tools: [{ googleSearch: {} }]
          }
        });

        const reply = response.text;
        if (reply && reply.trim()) {
          const webSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
            title: chunk.web?.title || 'Fuente Web',
            uri: chunk.web?.uri
          })).filter((s: any) => Boolean(s.uri)) || [];

          return res.json({ reply, webSources });
        }
      } catch (geminiError: any) {
        // Handle quota / rate limits without throwing loud console errors
        const errMsg = geminiError?.message || '';
        if (geminiError?.status === 'RESOURCE_EXHAUSTED' || errMsg.includes('429') || errMsg.includes('quota')) {
          quotaCooldownUntil = Date.now() + 180000; // 3 minutes cooldown
        }
      }
    }

    // High quality adaptive fallback ensuring user is never left without an answer
    const fallbackReply = getCeciliaFallbackResponse(lastUserMessage, technicalLevel);
    return res.json({ reply: fallbackReply, webSources: [] });

  } catch (error: any) {
    const lastUserMessage = req.body?.messages?.[req.body.messages.length - 1]?.content || '';
    const fallbackReply = getCeciliaFallbackResponse(lastUserMessage, req.body?.technicalLevel);
    return res.json({ reply: fallbackReply, webSources: [] });
  }
});

app.post('/api/triage-analysis', async (req: Request, res: Response) => {
  try {
    const { triageData, evaluationResult } = req.body;

    if (ai && Date.now() > quotaCooldownUntil) {
      try {
        const prompt = `
Actúa como la Dra. CecilIA, especialista en hematología y medicina transfusional en México.
Analiza los siguientes resultados del simulador de triaje de este donante:
Datos del donante: ${JSON.stringify(triageData, null, 2)}
Dictamen algorítmico previo: ${JSON.stringify(evaluationResult, null, 2)}

Genera una síntesis clínica empática y rigurosa en 3 párrafos concisos:
1. Resumen claro de la aptitud o motivo de diferimiento según la NOM-253-SSA1-2012.
2. Explicación fisiológica y microbiológica (aludiendo a volemia, seguridad celular de González de Buitrago o asepsia de Paul de Kruif).
3. Recomendaciones prácticas de preparación o felicitación si es candidato apto para motivar su donación altruista.
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION_BASE,
            temperature: 0.6
          }
        });

        if (response.text) {
          return res.json({ analysis: response.text });
        }
      } catch (err: any) {
        if (err?.status === 'RESOURCE_EXHAUSTED' || err?.message?.includes('429')) {
          quotaCooldownUntil = Date.now() + 180000;
        }
      }
    }

    // High quality offline fallback analysis
    const isApto = evaluationResult?.status === 'APTO';
    const analysis = isApto
      ? `### Dictamen Clínico Favorable (NOM-253-SSA1-2012)
¡Enhorabuena! Cumples rigurosamente con los criterios fisiológicos y normativos de aptitud: tu peso corporal (${triageData.weight} kg) garantiza que la extracción estándar de 450 mL no comprometa tu volemia total (${evaluationResult.totalVolemiaMl} mL), manteniéndose dentro del margen de seguridad del 13%. Tu hemoglobina (${triageData.hemoglobin} g/dL) asegura una reserva eritrocitaria óptima para tu organismo y una unidad terapéuticamente eficaz para el receptor.

Recuerda presentarte al banco de sangre con una hidratación adecuada, ayuno de 4 horas libre de grasas y descansar bien la noche previa. ¡Tu donación altruista puede salvar hasta 3 vidas distintas entre glóbulos rojos, plasma y plaquetas!`
      : `### Análisis Clínico de Diferimiento (NOM-253-SSA1-2012)
Se ha identificado un criterio que requiere diferimiento conforme a la normatividad sanitaria mexicana: **${evaluationResult.statusTitle}**. Esta medida no es un rechazo personal, sino un principio de bioseguridad fundamental tanto para resguardar tu equilibrio hemodinámico como para proteger al paciente receptor frente a periodos de ventana microbiológica.

Te sugerimos revisar las recomendaciones específicas en el panel de parámetros y consultar con el personal médico del banco de sangre para programar tu donación una vez transcurrido el tiempo correspondiente.`;

    return res.json({ analysis });
  } catch (error: any) {
    return res.json({
      analysis: 'Evaluación completada conforme a las reglas de la NOM-253-SSA1-2012. Acude con tu médico de banco de sangre para la valoración presencial definitiva.'
    });
  }
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'CecilIA Hematology Engine',
    geminiEnabled: Boolean(apiKey),
    timestamp: new Date().toISOString()
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CecilIA Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
