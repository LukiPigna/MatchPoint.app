import React, { useState, useEffect } from 'react';
import { Booking, User } from '../types/index';
import { MATCH_LEVELS_CASUAL, MATCH_LEVELS_COMPETITIVE } from '../constants';

export type CreateBookingFormData = Pick<Booking, 'level' | 'notes' | 'visibility' | 'type'> & {
  players: string[];
};

interface CreateBookingFormProps {
  onSubmit: (formData: CreateBookingFormData) => void;
  isSubmitting: boolean;
  error: string | null;
  currentUser: User;
}

export const CreateBookingForm: React.FC<CreateBookingFormProps> = ({
  onSubmit,
  isSubmitting,
  error,
  currentUser: _currentUser,
}) => {
  const [matchType,    setMatchType]    = useState<'casual' | 'competitive'>('casual');
  const [level,        setLevel]        = useState<string>(MATCH_LEVELS_CASUAL[0]);
  const [notes,        setNotes]        = useState('');
  const [visibility,   setVisibility]   = useState<'public' | 'private'>('public');
  const [otherPlayers, setOtherPlayers] = useState(['', '', '']);

  useEffect(() => {
    setLevel(matchType === 'casual' ? MATCH_LEVELS_CASUAL[0] : MATCH_LEVELS_COMPETITIVE[0]);
  }, [matchType]);

  const filledPlayers = otherPlayers.filter((p) => p.trim() !== '');
  const totalPlayers  = 1 + filledPlayers.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ level, notes, visibility, type: matchType, players: otherPlayers });
  };

  const levelOptions = matchType === 'casual' ? MATCH_LEVELS_CASUAL : MATCH_LEVELS_COMPETITIVE;

  const toggleClass = (active: boolean) =>
    `w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${
      active ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tipo */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">Tipo de Partido</label>
        <div className="flex rounded-lg border border-slate-300 p-1">
          <button type="button" onClick={() => setMatchType('casual')} className={toggleClass(matchType === 'casual')}>
            Amistoso
          </button>
          <button type="button" onClick={() => setMatchType('competitive')} className={toggleClass(matchType === 'competitive')}>
            Competitivo
          </button>
        </div>
      </div>

      {/* Visibilidad */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">Visibilidad</label>
        <div className="flex rounded-lg border border-slate-300 p-1">
          <button type="button" onClick={() => setVisibility('public')} className={toggleClass(visibility === 'public')}>
            Público
          </button>
          <button type="button" onClick={() => setVisibility('private')} className={toggleClass(visibility === 'private')}>
            Privado
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-1.5">
          {visibility === 'public'
            ? 'Otros jugadores podrán unirse a tu reserva.'
            : 'Solo visible para vos. Invitá a tus amigos.'}
        </p>
      </div>

      {/* Jugadores extra (solo para partidos privados) */}
      {visibility === 'private' && (
        <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-fade-in">
          <h3 className="font-semibold text-slate-700 text-sm">
            Jugadores invitados ({totalPlayers}/4)
          </h3>
          {otherPlayers.map((player, index) => (
            <input
              key={index}
              type="text"
              value={player}
              onChange={(e) => {
                const next = [...otherPlayers];
                next[index] = e.target.value;
                setOtherPlayers(next);
              }}
              placeholder={`Jugador ${index + 2}`}
              className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 text-sm"
            />
          ))}
        </div>
      )}

      {/* Nivel */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          {matchType === 'casual' ? 'Nivel del partido' : 'Categoría'}
        </label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full bg-slate-100 border border-slate-300 rounded-md py-2.5 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {levelOptions.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Notas <span className="text-slate-400">(opcional)</span>
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ej: Partido amistoso, llevar pelotas nuevas..."
          className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 text-sm resize-none"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 text-center animate-fade-in">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || totalPlayers > 4}
        className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting
          ? 'Procesando...'
          : totalPlayers > 4
          ? `Demasiados jugadores (${totalPlayers}/4)`
          : 'Confirmar y Reservar Cancha'}
      </button>
    </form>
  );
};
