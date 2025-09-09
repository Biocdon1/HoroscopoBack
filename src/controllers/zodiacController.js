import fs from 'fs';
import path from 'path';

const horoscopesPath = path.join(process.cwd(), 'src', 'data', 'horoscopes.json');

// Cargar el archivo
const loadData = () => {
  if (!fs.existsSync(horoscopesPath)) return {};
  const raw = fs.readFileSync(horoscopesPath, 'utf8');
  return raw.trim() ? JSON.parse(raw) : {};
};

// Guardar el archivo
const saveData = (data) => {
  fs.mkdirSync(path.dirname(horoscopesPath), { recursive: true });
  fs.writeFileSync(horoscopesPath, JSON.stringify(data, null, 2), 'utf8');
};

// Crear un nuevo signo zodiacal con default y frases
export const createZodiacSign = (req, res, next) => {
  try {
    const { signo, defaultText, frases } = req.body;
    if (!signo || typeof defaultText !== 'string' || !Array.isArray(frases)) {
      return res.status(400).json({ message: "Debes enviar 'signo', 'defaultText' y un array de 'frases'." });
    }

    const data = loadData();
    const signoLower = signo.toLowerCase();

    if (data[signoLower]) {
      return res.status(400).json({ message: 'El signo ya existe.' });
    }

    data[signoLower] = {
      default: defaultText,
      frases: frases.map((text) => ({ text, active: true })),
      imagen: '',
      accesoImagen: false
    };

    saveData(data);
    res.status(201).json({ message: 'Signo creado correctamente.', signo: signoLower });
  } catch (err) {
    next(err);
  }
};

// Obtener datos completos de un signo (público o admin)
export const getSignData = (req, res, next) => {
  try {
    const { signo } = req.params;
    const data = loadData();
    const entry = data?.[signo];
    if (!entry) return res.status(404).json({ error: 'Signo no encontrado' });

    res.json({
      nombre: signo,
      default: entry.default || '',
      frases: entry.frases || [],
      imagen: entry.imagen || '',
      accesoImagen: entry.accesoImagen || false
    });
  } catch (err) {
    next(err);
  }
};

// Obtener todos los signos y sus frases (admin)
export const getAllHoroscopes = (req, res, next) => {
  try {
    const data = loadData();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// Actualizar estado active de una frase (admin)
export const updateHoroscopeStatus = (req, res, next) => {
  try {
    const { signo, index, active } = req.body;
    const data = loadData();
    const signoLower = signo?.toLowerCase();
    if (!signoLower || !Number.isInteger(index)) {
      return res.status(400).json({ message: 'signo e index requeridos' });
    }

    if (!data[signoLower] || !data[signoLower].frases?.[index]) {
      return res.status(404).json({ message: 'Frase no encontrada.' });
    }

    data[signoLower].frases[index].active = Boolean(active);
    saveData(data);

    res.json({ message: 'Estado actualizado correctamente.', signo: signoLower, index, active: Boolean(active) });
  } catch (err) {
    next(err);
  }
};

// ✅ Actualizar solo las frases de un signo (ignora 'default')
export const updateDefaultText = (req, res, next) => {
  try {
    const { signo } = req.params;
    const { frases } = req.body;

    const signoLower = signo?.toLowerCase();
    if (!signoLower || !Array.isArray(frases)) {
      return res.status(400).json({ message: 'Debes enviar el signo y un array válido de frases.' });
    }

    const data = loadData();
    if (!data[signoLower]) {
      return res.status(404).json({ message: `El signo "${signoLower}" no existe.` });
    }

    // Validar estructura de cada frase
    const frasesValidadas = frases.map((f, i) => {
      if (typeof f.texto !== 'string' || typeof f.activo !== 'boolean') {
        throw new Error(`Frase inválida en posición ${i}.`);
      }
      return { texto: f.texto, activo: f.activo };
    });

    // Actualizar solo las frases
    data[signoLower].frases = frasesValidadas;
    saveData(data);

    res.status(200).json({ message: `Frases de ${signoLower} actualizadas correctamente.` });
  } catch (err) {
    console.error('Error al actualizar frases:', err.message);
    res.status(500).json({ message: 'Error interno al actualizar frases.' });
  }
};

// 🔹 Nuevo: Actualizar un signo completo (default, frases, imagen, accesoImagen)
export const updateSignComplete = (req, res, next) => {
  try {
    const { signo } = req.params;
    const { default: defaultText, frases, imagen, accesoImagen } = req.body;

    const signoLower = signo?.toLowerCase();
    if (!signoLower || typeof defaultText !== 'string' || !Array.isArray(frases)) {
      return res.status(400).json({ message: 'Datos inválidos: se requiere default, frases y signo.' });
    }

    const data = loadData();
    if (!data[signoLower]) {
      return res.status(404).json({ message: `El signo "${signoLower}" no existe.` });
    }

    // Validar frases
    const frasesValidadas = frases.map((f, i) => {
      if (typeof f.texto !== 'string' || typeof f.activo !== 'boolean') {
        throw new Error(`Frase inválida en posición ${i}.`);
      }
      return { texto: f.texto, activo: f.activo };
    });

    // Actualizar datos
    data[signoLower].default = defaultText;
    data[signoLower].frases = frasesValidadas;
    data[signoLower].imagen = typeof imagen === 'string' ? imagen : '';
    data[signoLower].accesoImagen = Boolean(accesoImagen);

    saveData(data);

    res.status(200).json({ message: `Signo "${signoLower}" actualizado correctamente.` });
  } catch (err) {
    console.error('Error al actualizar signo:', err.message);
    res.status(500).json({ message: 'Error interno al actualizar signo.' });
  }
};

// Inicializar horoscopes.json si está vacío
export const initializeHoroscopes = () => {
  const defaultTexts = {
    aries: 'Aries es el primer signo del zodiaco, conocido por su energía, iniciativa y liderazgo.',
    taurus: 'Tauro es el segundo signo, asociado con la estabilidad, la paciencia y el amor por el confort.',
    gemini: 'Géminis es el tercer signo, caracterizado por su curiosidad, versatilidad y habilidades comunicativas.',
    cancer: 'Cáncer es el cuarto signo, conocido por su sensibilidad, intuición y naturaleza protectora.',
    leo: 'Leo es el quinto signo, asociado con la creatividad, la confianza y el deseo de brillar.',
    virgo: 'Virgo es el sexto signo, caracterizado por su precisión, lógica y enfoque en los detalles.',
    libra: 'Libra es el séptimo signo, conocido por su sentido de la armonía, la justicia y las relaciones equilibradas.',
    scorpio: 'Escorpio es el octavo signo, asociado con la intensidad emocional, el misterio y la transformación.',
    sagittarius: 'Sagitario es el noveno signo, caracterizado por su espíritu aventurero, optimismo y amor por la libertad.',
    capricorn: 'Capricornio es el décimo signo, conocido por su disciplina, ambición y enfoque en metas a largo plazo.',
    aquarius: 'Acuario es el undécimo signo, asociado con la innovación, el pensamiento independiente y la visión humanitaria.',
    pisces: 'Piscis es el duodécimo signo, caracterizado por su empatía, imaginación y conexión espiritual.',
  };

  const existing = loadData();
  if (Object.keys(existing).length > 0) return;

  const initialized = {};
  for (const signo in defaultTexts) {
    initialized[signo] = { default: defaultTexts[signo], frases: [], imagen: '', accesoImagen: false };
  }
  saveData(initialized);
  console.log('horoscopes.json inicializado con textos predeterminados.');
};