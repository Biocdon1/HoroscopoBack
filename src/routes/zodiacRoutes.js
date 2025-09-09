// src/routes/zodiacRoutes.js
const express = require('express');
const {
  createZodiacSign,
  getSignData,
  getAllHoroscopes,
  updateHoroscopeStatus,
  updateDefaultText,
  updateSignComplete // ✅ asegúrate de importar esta función
} = require('../controllers/zodiacController');
const { protectRoute } = require('../middleware/protectRoute');

const router = express.Router();

// 🔹 Normaliza el parámetro :signo a minúsculas
router.param('signo', (req, res, next, signo) => {
  req.params.signo = signo.toLowerCase();
  next();
});
// 🌐 Ruta pública para frontend
router.get('/public', getAllHoroscopes);

// 🔍 Obtener datos completos de un signo (público o admin)
router.get('/:signo', protectRoute, getSignData);

// 📋 Obtener todos los signos y sus frases (admin)
router.get('/', protectRoute, getAllHoroscopes);

// 🆕 Crear nuevo signo con default y frases (admin)
router.post('/', protectRoute, createZodiacSign);

// 🔄 Actualizar estado de una frase (admin)
router.patch('/status', protectRoute, updateHoroscopeStatus);

// ✅ Actualizar signo completo (default, frases, imagen, accesoImagen)
router.put('/:signo', protectRoute, updateSignComplete);

module.exports = router;