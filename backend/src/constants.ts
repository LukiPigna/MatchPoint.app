// ============================================================
// Constantes de negocio compartidas
// Autor: Lucas Pignataro
// ============================================================

export const ZONES = ['Norte', 'Sur', 'Oeste', 'Este', 'Centro'] as const;

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
  },
} as const;
