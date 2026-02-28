// ============================================================
// Rutas de autenticación: /api/auth
// Autor: Lucas Pignataro
// ============================================================

import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users, userPasswords, nextUserId } from '../data/db.js';
import { JWT_SECRET } from '../middleware/auth.js';
import { ZONES } from '../constants.js';

const router = Router();

// POST /api/auth/login
router.post('/login', (req: Request, res: Response): void => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    return;
  }

  const user = users.find((u) => u.email === email.toLowerCase().trim());

  if (!user || !bcrypt.compareSync(password, userPasswords[user.id] ?? '')) {
    res.status(401).json({ message: 'Credenciales inválidas.' });
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '8h' });

  // No devolvemos la contraseña al cliente
  const { ...safeUser } = user;
  res.json({ token, user: safeUser });
});

// POST /api/auth/register
router.post('/register', (req: Request, res: Response): void => {
  const { name, email, password, zone } = req.body as {
    name?: string;
    email?: string;
    password?: string;
    zone?: string;
  };

  if (!name || !email || !password || !zone) {
    res.status(400).json({ message: 'Todos los campos son requeridos.' });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (users.find((u) => u.email === normalizedEmail)) {
    res.status(409).json({ message: 'Ya existe una cuenta con ese email.' });
    return;
  }

  if (!ZONES.includes(zone)) {
    res.status(400).json({ message: 'Zona inválida.' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
    return;
  }

  const firstName = name.trim().split(' ')[0];
  const tag = Math.floor(1000 + Math.random() * 9000);
  const padelTag = `${firstName}#${tag}`;

  const newUser = {
    id: nextUserId(),
    name: name.trim(),
    email: normalizedEmail,
    role: 'player' as const,
    avatar: `https://i.pravatar.cc/150?u=${normalizedEmail}`,
    points: 0,
    friends: [] as string[],
    zone,
    padelTag,
    isNewUser: true,
  };

  users.push(newUser);
  userPasswords[newUser.id] = bcrypt.hashSync(password, 10);

  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '8h' });

  res.status(201).json({ token, user: newUser });
});

export default router;
