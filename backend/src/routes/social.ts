// ============================================================
// Rutas de clubs y torneos
// Autor: Lucas Pignataro
// ============================================================

import { Router, Response } from 'express';
import { clubs, tournaments, users } from '../data/db.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

// ---- CLUBS ------------------------------------------------

// GET /api/clubs
router.get('/clubs', (_req: AuthRequest, res: Response): void => {
  res.json(clubs);
});

// POST /api/clubs/:id/join - Unirse a un club
router.post('/clubs/:id/join', (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const userIndex = users.findIndex((u) => u.id === req.userId);
  const clubIndex = clubs.findIndex((c) => c.id === id);

  if (userIndex === -1 || clubIndex === -1) {
    res.status(404).json({ message: 'Usuario o club no encontrado.' });
    return;
  }

  const currentClubId = users[userIndex].clubId;

  // Salir del club actual si tiene uno
  if (currentClubId) {
    const currentClubIndex = clubs.findIndex((c) => c.id === currentClubId);
    if (currentClubIndex !== -1) {
      clubs[currentClubIndex].members = clubs[currentClubIndex].members.filter(
        (m) => m !== req.userId
      );
    }
  }

  if (!clubs[clubIndex].members.includes(req.userId!)) {
    clubs[clubIndex].members.push(req.userId!);
  }

  users[userIndex].clubId = id;
  res.json({ club: clubs[clubIndex], user: users[userIndex] });
});

// POST /api/clubs/:id/leave - Abandonar un club
router.post('/clubs/:id/leave', (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const userIndex = users.findIndex((u) => u.id === req.userId);
  const clubIndex = clubs.findIndex((c) => c.id === id);

  if (userIndex === -1 || clubIndex === -1) {
    res.status(404).json({ message: 'Usuario o club no encontrado.' });
    return;
  }

  clubs[clubIndex].members = clubs[clubIndex].members.filter((m) => m !== req.userId);
  users[userIndex].clubId = undefined;

  res.json({ club: clubs[clubIndex], user: users[userIndex] });
});

// ---- TORNEOS ---------------------------------------------

// GET /api/tournaments
router.get('/tournaments', (_req: AuthRequest, res: Response): void => {
  res.json(tournaments);
});

// POST /api/tournaments/:id/join - Inscribirse a un torneo
router.post('/tournaments/:id/join', (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const tournamentIndex = tournaments.findIndex((t) => t.id === id);

  if (tournamentIndex === -1) {
    res.status(404).json({ message: 'Torneo no encontrado.' });
    return;
  }

  const tournament = tournaments[tournamentIndex];

  if (tournament.status !== 'upcoming') {
    res.status(409).json({ message: 'Las inscripciones están cerradas.' });
    return;
  }

  if (tournament.participants.includes(req.userId!)) {
    res.status(409).json({ message: 'Ya estás inscripto en este torneo.' });
    return;
  }

  tournaments[tournamentIndex].participants.push(req.userId!);
  res.json(tournaments[tournamentIndex]);
});

export default router;
