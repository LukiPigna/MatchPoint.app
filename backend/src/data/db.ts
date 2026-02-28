// ============================================================
// Base de datos en memoria con datos de prueba
// Autor: Lucas Pignataro
// ============================================================

import bcrypt from 'bcryptjs';
import { User, Club, Tournament, Booking } from './types.js';

// -----------------------------------------------------------
// Usuarios
// -----------------------------------------------------------
export const users: User[] = [
  {
    id: 'u1',
    name: 'Carlos Ríos',
    email: 'carlos@rios.com',
    role: 'owner',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    points: 1200,
    friends: ['u2', 'u3'],
    zone: 'Norte',
    padelTag: 'Carlos#1023',
  },
  {
    id: 'u2',
    name: 'Ana Torres',
    email: 'ana@torres.com',
    role: 'player',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    points: 850,
    friends: ['u1'],
    zone: 'Norte',
    padelTag: 'Ana#4829',
  },
  {
    id: 'u3',
    name: 'Luis Fer',
    email: 'luis@fer.com',
    role: 'player',
    avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    points: 920,
    friends: ['u1'],
    zone: 'Sur',
    padelTag: 'Luis#7341',
  },
  {
    id: 'u4',
    name: 'Marta García',
    email: 'marta@g.com',
    role: 'player',
    avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
    points: 450,
    friends: [],
    zone: 'Oeste',
    padelTag: 'Marta#2394',
  },
];

// -----------------------------------------------------------
// Contraseñas (hasheadas). La contraseña de prueba de cada
// usuario es su ID + "password", e.g., "u1password"
// -----------------------------------------------------------
export const userPasswords: Record<string, string> = {};

users.forEach((u) => {
  userPasswords[u.id] = bcrypt.hashSync(`${u.id}password`, 10);
});

// -----------------------------------------------------------
// Clubs
// -----------------------------------------------------------
export const clubs: Club[] = [
  {
    id: 'c1',
    name: 'Padel Kings',
    tag: 'KNGS',
    ownerId: 'u1',
    members: ['u1', 'u2'],
    points: 2500,
  },
  {
    id: 'c2',
    name: 'Volea Pro',
    tag: 'VOLA',
    ownerId: 'u3',
    members: ['u3', 'u4'],
    points: 1800,
  },
];

// -----------------------------------------------------------
// Torneos
// -----------------------------------------------------------
export const tournaments: Tournament[] = [
  {
    id: 't1',
    name: 'Open Primavera 2026',
    venueId: 'v1',
    date: '2026-03-15',
    level: '3ra',
    prize: '$50.000 + Paleta Varlion',
    status: 'upcoming',
    participants: [],
  },
  {
    id: 't2',
    name: 'Torneo Relámpago',
    venueId: 'v3',
    date: '2026-03-20',
    level: 'Intermedio',
    prize: 'Cena para 4 + Indumentaria',
    status: 'upcoming',
    participants: [],
  },
];

// -----------------------------------------------------------
// Reservas de prueba (hoy y mañana)
// -----------------------------------------------------------
const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split('T')[0];

export const bookings: Booking[] = [
  {
    id: 'b1',
    venueId: 'v1',
    date: today,
    time: '18:00',
    duration: 60,
    organizer: 'Ana Torres',
    players: ['Ana Torres', 'Jugador 2'],
    level: 'Intermedio',
    notes: 'Partido amistoso para pasar el rato.',
    visibility: 'public',
    type: 'casual',
    price: 20,
  },
  {
    id: 'b2',
    venueId: 'v1',
    date: today,
    time: '19:00',
    duration: 90,
    organizer: 'Luis Fer',
    players: ['Luis Fer', 'Jugador 2', 'Carlos Ríos'],
    level: '3ra',
    notes: '',
    visibility: 'public',
    type: 'competitive',
    price: 28,
  },
  {
    id: 'b3',
    venueId: 'v2',
    date: tomorrow,
    time: '20:00',
    duration: 60,
    organizer: 'Marta García',
    players: ['Marta García'],
    level: 'Iniciación',
    notes: '¡Buscamos gente para empezar!',
    visibility: 'public',
    type: 'casual',
    price: 20,
  },
  {
    id: 'b4',
    venueId: 'v1',
    date: tomorrow,
    time: '18:00',
    duration: 60,
    organizer: 'Carlos Ríos',
    players: ['Carlos Ríos', 'Juan', 'Pedro', 'Santi'],
    level: 'Intermedio',
    notes: 'Partido de amigos',
    visibility: 'private',
    type: 'casual',
    price: 25,
  },
];

// Contador para IDs autoincrementales
let bookingIdCounter = bookings.length + 1;
let userIdCounter = users.length + 1;

export const nextBookingId = () => `b${bookingIdCounter++}`;
export const nextUserId = () => `u${userIdCounter++}`;
