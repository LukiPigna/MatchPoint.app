// ============================================================
// Servidor Express - Reserva Tu Cancha
// Autor: Lucas Pignataro
// ============================================================

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import userRoutes from './routes/users.js';
import socialRoutes from './routes/social.js';

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

// ---- Middlewares ------------------------------------------
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ---- Rutas de la API -------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api', socialRoutes);

// ---- Health check ----------------------------------------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---- 404 handler -----------------------------------------
app.use((_req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada.' });
});

// ---- Inicio ----------------------------------------------
app.listen(PORT, () => {
  console.log(`\n🎾  Reserva Tu Cancha - Backend`);
  console.log(`🚀  Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋  API disponible en http://localhost:${PORT}/api`);
  console.log(`\n    Usuarios de prueba:`);
  console.log(`    - carlos@rios.com  / u1password  (owner)`);
  console.log(`    - ana@torres.com   / u2password  (player)`);
  console.log(`    - luis@fer.com     / u3password  (player)`);
  console.log(`    - marta@g.com      / u4password  (player)\n`);
});
