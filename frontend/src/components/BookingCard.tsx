import React from 'react';
import { Booking, User } from '../types/index';
import { PRICING_OPTIONS } from '../constants';

interface BookingCardProps {
  booking: Booking;
  currentUser: User;
  onJoin: (bookingId: string) => void;
  onLeave: (bookingId: string) => void;
  onKick: (bookingId: string, playerName: string) => void;
  onInvite: (bookingId: string) => void;
  onAwardPoints?: (bookingId: string, winners: string[]) => void;
}

const PlayerSlot: React.FC<{ name?: string; onKick?: () => void; isWinner?: boolean }> = ({
  name,
  onKick,
  isWinner,
}) => (
  <div className="relative group flex flex-col items-center">
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
        name
          ? 'bg-slate-200 text-slate-700 border-slate-300'
          : 'bg-slate-50 border-dashed border-slate-300 text-slate-300'
      }`}
    >
      {name ? name.charAt(0).toUpperCase() : '+'}
    </div>
    {isWinner && (
      <span className="absolute -top-1 -right-1 text-xs">⭐</span>
    )}
    {onKick && name && (
      <button
        onClick={onKick}
        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        ×
      </button>
    )}
    {name && (
      <div className="absolute top-10 w-max bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
        {name}
      </div>
    )}
  </div>
);

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  currentUser,
  onJoin,
  onLeave,
  onKick,
  onInvite,
  onAwardPoints,
}) => {
  const [showWinnerPicker, setShowWinnerPicker] = React.useState(false);

  const bookingDate  = new Date(booking.date + 'T00:00:00');
  const day          = bookingDate.toLocaleDateString('es-ES', { day: '2-digit' });
  const month        = bookingDate.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '').toUpperCase();
  const durationLabel = PRICING_OPTIONS[booking.duration]?.label ?? `${booking.duration} min`;

  const isFull       = booking.players.length >= 4;
  const isJoined     = booking.players.includes(currentUser.name);
  const isOrganizer  = booking.organizer === currentUser.name;
  const canJoin      = !isFull && !isJoined && booking.visibility === 'public';
  const pricePerPlayer = (booking.price / (booking.players.length || 1)).toFixed(2);

  const levelBadgeClass =
    booking.type === 'competitive'
      ? 'bg-red-100 text-red-800'
      : 'bg-green-100 text-green-800';

  const handleAward = (winners: string[]) => {
    onAwardPoints?.(booking.id, winners);
    setShowWinnerPicker(false);
  };

  const renderAction = () => {
    if (booking.winner) {
      return (
        <div className="w-full bg-amber-50 text-amber-700 font-bold py-2 px-3 rounded-lg text-xs text-center border border-amber-100">
          🏆 Ganadores: {booking.winner.join(' & ')}
        </div>
      );
    }
    if (isOrganizer && isFull && onAwardPoints) {
      return (
        <button
          onClick={() => setShowWinnerPicker(!showWinnerPicker)}
          className="w-full bg-amber-500 text-white font-bold py-2 px-3 rounded-lg text-sm transition hover:bg-amber-600"
        >
          {showWinnerPicker ? 'Cancelar' : '🏆 Cargar Resultado'}
        </button>
      );
    }
    if (isJoined && !isOrganizer) {
      return (
        <button
          onClick={() => onLeave(booking.id)}
          className="w-full bg-red-500 text-white font-semibold py-2 px-3 rounded-lg text-sm transition hover:bg-red-600"
        >
          Cancelar mi lugar
        </button>
      );
    }
    if (canJoin) {
      return (
        <button
          onClick={() => onJoin(booking.id)}
          className="w-full bg-indigo-600 text-white font-semibold py-2 px-3 rounded-lg text-sm transition hover:bg-indigo-700"
        >
          Unirme
        </button>
      );
    }
    if (isOrganizer && !isFull) {
      return (
        <button
          onClick={() => onInvite(booking.id)}
          className="w-full bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg text-sm transition hover:bg-blue-600"
        >
          Invitar Jugador
        </button>
      );
    }
    if (isJoined) {
      return (
        <div className="w-full bg-green-100 text-green-800 font-semibold py-2 px-3 rounded-lg text-sm text-center">
          Inscripto ✓
        </div>
      );
    }
    if (isFull) {
      return (
        <div className="w-full bg-slate-200 text-slate-500 font-semibold py-2 px-3 rounded-lg text-sm text-center">
          Completo
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md transition-all hover:shadow-lg flex flex-col sm:flex-row sm:items-center sm:gap-4 border border-slate-100 relative overflow-hidden">
      {booking.winner && (
        <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest z-10">
          Finalizado
        </div>
      )}

      {/* Fecha */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-slate-100 rounded-lg text-center">
        <span className="text-xs font-bold text-indigo-600">{month}</span>
        <span className="text-2xl font-extrabold text-slate-800">{day}</span>
      </div>

      {/* Info central */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-slate-800">
            {booking.time} hs{' '}
            <span className="text-sm font-normal text-slate-500">({durationLabel})</span>
          </p>
          {booking.visibility === 'private' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
            </svg>
          )}
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${levelBadgeClass}`}>
            {booking.level}
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-0.5">Organiza: {booking.organizer}</p>
        {booking.notes && (
          <p className="text-xs text-slate-400 mt-1 italic truncate">"{booking.notes}"</p>
        )}
        <div className="flex items-baseline mt-1 gap-1">
          <span className="font-bold text-lg text-indigo-600">${booking.price}</span>
          <span className="text-xs text-slate-400">/ ${pricePerPlayer} por jugador</span>
        </div>
      </div>

      <div className="border-t sm:border-t-0 sm:border-l border-slate-200 my-3 sm:my-0 sm:h-16" />

      {/* Jugadores + acción */}
      <div className="flex-shrink-0 sm:w-60 flex flex-col justify-center gap-2">
        {showWinnerPicker ? (
          <div className="space-y-2 animate-fade-in">
            <p className="text-[10px] font-black uppercase text-slate-400 text-center tracking-widest">
              ¿Quiénes ganaron?
            </p>
            <button
              onClick={() => handleAward([booking.players[0], booking.players[1]])}
              className="w-full text-xs font-bold py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-all"
            >
              {booking.players[0]} &amp; {booking.players[1]}
            </button>
            <button
              onClick={() => handleAward([booking.players[2], booking.players[3]])}
              className="w-full text-xs font-bold py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-all"
            >
              {booking.players[2]} &amp; {booking.players[3]}
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {Array.from({ length: 4 }).map((_, i) => {
                  const playerName = booking.players[i];
                  const isWinner   = booking.winner?.includes(playerName ?? '');
                  const canKick    = isOrganizer && !!playerName && playerName !== currentUser.name;
                  return (
                    <PlayerSlot
                      key={i}
                      name={playerName}
                      isWinner={isWinner}
                      onKick={canKick ? () => onKick(booking.id, playerName!) : undefined}
                    />
                  );
                })}
              </div>
              <span className="text-sm font-semibold text-slate-500">
                {booking.players.length}/4
              </span>
            </div>
            <div>{renderAction()}</div>
          </>
        )}
      </div>
    </div>
  );
};
