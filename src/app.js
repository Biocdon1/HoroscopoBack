const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const zodiacRoutes = require('./routes/zodiacRoutes');
const protectRoute = require('./middleware/protectRoute');
const path = require('path');
const app = express();

const corsOptions = {
  origin: ['http://localhost:5174', 'http://localhost:5173'], // ✅ array de orígenes permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight

// 📦 Middleware para parsear JSON
app.use(express.json());
app.use('/data/imagenes', express.static(path.join(__dirname, 'data/imagenes')));

// 🛠 Ruta simple para probar que el backend está vivo
app.get('/', (req, res) => {
  res.send('Backend de  Zodiacos');
});

// 🔑 Rutas de autenticación (públicas)
app.use('/api/auth', authRoutes);

// ♈ Rutas de signos (protegidas con JWT)
app.use('/api/signos', zodiacRoutes);

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});