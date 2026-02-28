// ============================================================
// Rutas de reservas: /api/bookings
// Autor: Lucas Pignataro
// ============================================================

import { Router, Response } from 'express';
import { bookings, users, nextBookingId } from '../data/db.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { Booking } from '../types.js';
import { POINT_RULES } from '../constants.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/bookings - Obtener todas las reservas
router.get('/', (_req: AuthRequest, res: Response): void => {
  res.json(bookings);
});

// POST /api/bookings - Crear una nueva reserva
router.post('/', (req: AuthRequest, res: Response): void => {
  const body = req.body as Omit<Booking, 'id'>;

  const { venueId, date, time, duration, organizer, players, level, type, visibility, price } = body;

  if (!venueId || !date || !time || !duration || !organizer || !players || !level || !type || !visibility || price === undefined) {
    res.status(400).json({ message: 'Faltan campos requeridos para crear la reserva.' });
    return;
  }

  // Verificar que el slot no esté ya tomado
  const conflict = bookings.find(
    (b) => b.venueId === venueId && b.date === date && b.time === time
  );

  if (conflict) {
    res.status(409).json({ message: 'La cancha ya fue reservada en ese horario. Elegí otro.' });
    return;
  }

  const newBooking: Booking = {
    id: nextBookingId(),
    venueId,
    date,
    time,
    duration,
    organizer,
    players,
    level,
    type,
    visibility,
    notes: body.notes ?? '',
    price,
  };

  bookings.push(newBooking);
  res.status(201).json(newBooking);
});

// PUT /api/bookings/:id - Actualizar una reserva (solo el organizador o un owner)
router.put('/:id', (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const currentUser = users.find((u) => u.id === req.userId);

  if (!currentUser) {
    res.status(404).json({ message: 'Usuario no encontrado.' });
    return;
  }

  const bookingIndex = bookings.findIndex((b) => b.id === id);

  if (bookingIndex === -1) {
    res.status(404).json({ message: 'Reserva no encontrada.' });
    return;
  }

  const booking = bookings[bookingIndex];
  const isOrganizer = booking.organizer === currentUser.name;
  const isOwner = currentUser.role === 'owner';

  if (!isOrganizer && !isOwner) {
    res.status(403).json({ message: 'No tenés permiso para editar esta reserva.' });
    return;
  }

  bookings[bookingIndex] = { ...booking, ...req.body, id };
  res.json(bookings[bookingIndex]);
});

// DELETE /api/bookings/:id - Eliminar una reserva
router.delete('/:id', (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const currentUser = users.find((u) => u.id === req.userId);

  if (!currentUser) {
    res.status(404).json({ message: 'Usuario no encontrado.' });
    return;
  }

  const bookingIndex = bookings.findIndex((b) => b.id === id);

  if (bookingIndex === -1) {
    res.status(404).json({ message: 'Reserva no encontrada.' });
    return;
  }

  const booking = bookings[bookingIndex];
  const isOrganizer = booking.organizer === currentUser.name;
  const isOwner = currentUser.role === 'owner';

  if (!isOrganizer && !isOwner) {
    res.status(403).json({ message: 'No tenés permiso para eliminar esta reserva.' });
    return;
  }

  bookings.splice(bookingIndex, 1);
  res.status(204).send();
});

// POST /api/bookings/:id/join - Unirse a una reserva pública
router.post('/:id/join', (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const currentUser = users.find((u) => u.id === req.userId);

  if (!currentUser) {
    res.status(404).json({ message: 'Usuario no encontrado.' });
    return;
  }

  const bookingIndex = bookings.findIndex((b) => b.id === id);

  if (bookingIndex === -1) {
    res.status(404).json({ message: 'Reserva no encontrada.' });
    return;
  }

  const booking = bookings[bookingIndex];

  if (booking.visibility !== 'public') {
    res.status(403).json({ message: 'Esta reserva es privada.' });
    return;
  }

  if (booking.players.length >= 4) {
    res.status(409).json({ message: 'La reserva ya está completa.' });
    return;
  }

  if (booking.players.includes(currentUser.name)) {
    res.status(409).json({ message: 'Ya estás en esta reserva.' });
    return;
  }

  bookings[bookingIndex] = {
    ...booking,
    players: [...booking.players, currentUser.name],
  };

  res.json(bookings[bookingIndex]);
});

// POST /api/bookings/:id/leave - Abandonar una reserva
router.post('/:id/leave', (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const currentUser = users.find((u) => u.id === req.userId);

  if (!currentUser) {
    res.status(404).json({ message: 'Usuario no encontrado.' });
    return;
  }

  const bookingIndex = bookings.findIndex((b) => b.id === id);

  if (bookingIndex === -1) {
    res.status(404).json({ message: 'Reserva no encontrada.' });
    return;
  }

  const booking = bookings[bookingIndex];

  if (booking.organizer === currentUser.name) {
    res.status(400).json({ message: 'El organizador no puede abandonar la reserva. Eliminála directamente.' });
    return;
  }

  bookings[bookingIndex] = {
    ...booking,
    players: booking.players.filter((p) => p !== currentUser.name),
  };

  res.json(bookings[bookingIndex]);
});

// POST /api/bookings/:id/award - Cargar resultado y otorgar puntos
router.post('/:id/award', (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const { winners } = req.body as { winners?: string[] };
  const currentUser = users.find((u) => u.id === req.userId);

  if (!currentUser) {
    res.status(404).json({ message: 'Usuario no encontrado.' });
    return;
  }

  if (!winners || !Array.isArray(winners) || winners.length === 0) {
    res.status(400).json({ message: 'Debés indicar los ganadores.' });
    return;
  }

  const bookingIndex = bookings.findIndex((b) => b.id === id);

  if (bookingIndex === -1) {
    res.status(404).json({ message: 'Reserva no encontrada.' });
    return;
  }

  const booking = bookings[bookingIndex];

  if (booking.organizer !== currentUser.name && currentUser.role !== 'owner') {
    res.status(403).json({ message: 'Solo el organizador puede cargar el resultado.' });
    return;
  }

  if (booking.winner) {
    res.status(409).json({ message: 'El resultado ya fue cargado.' });
    return;
  }

  // Calcular y otorgar puntos
  const basePoints = booking.type === 'competitive' ? POINT_RULES.WIN_COMPETITIVE : POINT_RULES.WIN_CASUAL;
  const multiplier = POINT_RULES.LEVEL_MULTIPLIER[booking.level as keyof typeof POINT_RULES.LEVEL_MULTIPLIER] ?? 1;
  const pointsToAward = Math.round(basePoints * multiplier);

  winners.forEach((winnerName) => {
    const userIndex = users.findIndex((u) => u.name === winnerName);
    if (userIndex !== -1) {
      users[userIndex].points += pointsToAward;
    }
  });

  bookings[bookingIndex] = { ...booking, winner: winners };
  res.json({ booking: bookings[bookingIndex], pointsAwarded: pointsToAward });
});

export default router;
