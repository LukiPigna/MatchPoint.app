// ============================================================
// Rutas de usuarios: /api/users
// Autor: Lucas Pignataro
// ============================================================

import { Router, Response } from 'express';
import { users } from '../data/db.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

// GET /api/users/me - Obtener perfil del usuario autenticado
router.get('/me', (req: AuthRequest, res: Response): void => {
  const user = users.find((u) => u.id === req.userId);

  if (!user) {
    res.status(404).json({ message: 'Usuario no encontrado.' });
    return;
  }

  res.json(user);
});

// PUT /api/users/me - Actualizar perfil
router.put('/me', (req: AuthRequest, res: Response): void => {
  const userIndex = users.findIndex((u) => u.id === req.userId);

  if (userIndex === -1) {
    res.status(404).json({ message: 'Usuario no encontrado.' });
    return;
  }

  const { name, avatar, zone } = req.body as { name?: string; avatar?: string; zone?: string };

  if (name) users[userIndex].name = name.trim();
  if (avatar) users[userIndex].avatar = avatar;
  if (zone) users[userIndex].zone = zone;

  res.json(users[userIndex]);
});

// GET /api/users - Obtener todos los usuarios (para leaderboard, clubs, etc.)
router.get('/', (_req: AuthRequest, res: Response): void => {
  // Devolvemos los usuarios sin datos sensibles
  const safeUsers = users.map(({ ...u }) => u);
  res.json(safeUsers);
});

// POST /api/users/me/friends - Agregar un amigo por padelTag
router.post('/me/friends', (req: AuthRequest, res: Response): void => {
  const { padelTag } = req.body as { padelTag?: string };
  const userIndex = users.findIndex((u) => u.id === req.userId);

  if (userIndex === -1) {
    res.status(404).json({ message: 'Usuario no encontrado.' });
    return;
  }

  if (!padelTag) {
    res.status(400).json({ message: 'Se requiere el PadelTag del amigo.' });
    return;
  }

  const friend = users.find((u) => u.padelTag === padelTag.trim());

  if (!friend) {
    res.status(404).json({ message: 'No se encontró ningún usuario con ese Padel-Tag.' });
    return;
  }

  if (friend.id === req.userId) {
    res.status(400).json({ message: 'No podés agregarte a vos mismo.' });
    return;
  }

  if (users[userIndex].friends.includes(friend.id)) {
    res.status(409).json({ message: 'Este usuario ya está en tu lista de amigos.' });
    return;
  }

  users[userIndex].friends.push(friend.id);
  res.json(users[userIndex]);
});

// DELETE /api/users/me/friends/:friendId - Eliminar un amigo
router.delete('/me/friends/:friendId', (req: AuthRequest, res: Response): void => {
  const { friendId } = req.params;
  const userIndex = users.findIndex((u) => u.id === req.userId);

  if (userIndex === -1) {
    res.status(404).json({ message: 'Usuario no encontrado.' });
    return;
  }

  users[userIndex].friends = users[userIndex].friends.filter((id) => id !== friendId);
  res.json(users[userIndex]);
});

export default router;
