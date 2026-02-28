// ============================================================
// Tipos compartidos - Reserva Tu Cancha
// Autor: Lucas Pignataro
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'player' | 'owner';
  avatar: string;
  friends: string[];   // Array de user IDs
  points: number;
  clubId?: string;
  zone: string;
  padelTag: string;    // e.g., Carlos#1023
  isNewUser?: boolean;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  zone: string;
  image: string;
  courts: number;
  rating: number;
}

export interface Club {
  id: string;
  name: string;
  tag: string;
  ownerId: string;
  members: string[];   // user IDs
  points: number;
}

export interface Tournament {
  id: string;
  name: string;
  venueId: string;
  date: string;        // YYYY-MM-DD
  level: string;
  prize: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  participants: string[];
}

export interface Booking {
  id: string;
  venueId: string;
  date: string;        // YYYY-MM-DD
  time: string;        // HH:MM
  duration: number;    // minutos: 60 o 90
  organizer: string;   // nombre del organizador
  players: string[];
  level: string;
  type: 'casual' | 'competitive';
  visibility: 'public' | 'private';
  notes?: string;
  price: number;
  winner?: string[];
}
