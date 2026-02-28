// ============================================================
// Tipos del dominio - Reserva Tu Cancha
// Autor: Lucas Pignataro
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'player' | 'owner';
  avatar: string;
  friends: string[];
  points: number;
  clubId?: string;
  zone: string;
  padelTag: string;
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
  members: string[];
  points: number;
}

export interface Tournament {
  id: string;
  name: string;
  venueId: string;
  date: string;
  level: string;
  prize: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  participants: string[];
}

export interface Booking {
  id: string;
  venueId: string;
  date: string;
  time: string;
  duration: number;
  organizer: string;
  players: string[];
  level: string;
  type: 'casual' | 'competitive';
  visibility: 'public' | 'private';
  notes?: string;
  price: number;
  winner?: string[];
}

export interface BookedSlots {
  [venueId: string]: {
    [date: string]: string[];
  };
}

export type AppView =
  | 'venues'
  | 'list'
  | 'my-bookings'
  | 'create'
  | 'profile'
  | 'clubs'
  | 'tournaments'
  | 'leaderboard';
