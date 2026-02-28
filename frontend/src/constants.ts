// ============================================================
// Constantes del frontend
// Autor: Lucas Pignataro
// ============================================================

import { Venue } from './types/index.js';

export const TIME_SLOTS: string[] = [
  '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00',
  '17:00', '18:00', '19:00', '20:00',
  '21:00', '22:00',
];

export const MATCH_LEVELS_CASUAL = ['Iniciación', 'Intermedio', 'Avanzado'] as const;

export const MATCH_LEVELS_COMPETITIVE = [
  '1ra', '2da', '3ra', '4ta', '5ta', '6ta', '7ma',
] as const;

export const PRICING_OPTIONS: Record<number, { price: number; label: string }> = {
  60: { price: 20, label: '1 hora' },
  90: { price: 28, label: '1 hora 30 min' },
};

export const DEFAULT_DURATION = 60;

export const ZONES = ['Norte', 'Sur', 'Oeste', 'Este', 'Centro'] as const;

export const VENUES: Venue[] = [
  {
    id: 'v1',
    name: 'Padel Indoor Club - Norte',
    address: 'Av. Libertador 1234, CABA',
    zone: 'Norte',
    image:
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2070&auto=format&fit=crop',
    courts: 6,
    rating: 4.8,
  },
  {
    id: 'v2',
    name: 'Padel Arena - Sur',
    address: 'Calle Falsa 123, Avellaneda',
    zone: 'Sur',
    image:
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070&auto=format&fit=crop',
    courts: 4,
    rating: 4.5,
  },
  {
    id: 'v3',
    name: 'Central Padel - Oeste',
    address: 'Rivadavia 5678, Ramos Mejía',
    zone: 'Oeste',
    image:
      'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?q=80&w=1983&auto=format&fit=crop',
    courts: 8,
    rating: 4.9,
  },
];

export const POINT_RULES = {
  WIN_CASUAL: 10,
  WIN_COMPETITIVE: 25,
  LEVEL_MULTIPLIER: {
    Iniciación: 1,
    Intermedio: 1.2,
    Avanzado: 1.5,
    '7ma': 1.1,
    '6ta': 1.3,
    '5ta': 1.5,
    '4ta': 1.8,
    '3ra': 2.2,
    '2da': 2.8,
    '1ra': 3.5,
  } as Record<string, number>,
};
