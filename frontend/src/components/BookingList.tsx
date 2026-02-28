import React, { useState, useMemo } from 'react';
import { Booking, User } from '../types/index';
import { BookingCard } from './BookingCard';
import { BookingFilter, Filters } from './BookingFilter';

interface BookingListProps {
  bookings: Booking[];
  currentUser: User;
  onJoinBooking: (bookingId: string) => void;
  onLeaveBooking: (bookingId: string) => void;
  onKickPlayer: (bookingId: string, playerName: string) => void;
  onInvitePlayer: (bookingId: string) => void;
  onAwardPoints?: (bookingId: string, winners: string[]) => void;
}

export const BookingList: React.FC<BookingListProps> = ({
  bookings,
  currentUser,
  onJoinBooking,
  onLeaveBooking,
  onKickPlayer,
  onInvitePlayer,
  onAwardPoints,
}) => {
  const [filters, setFilters] = useState<Filters>({ date: 'all', type: 'all', level: 'all' });

  const filtered = useMemo(() => {
    const today   = new Date();
    const todayStr    = today.toISOString().split('T')[0];
    const tomorrow    = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const endOfWeek   = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));

    return bookings
      .filter((b) => {
        if (filters.date === 'today'    && b.date !== todayStr)    return false;
        if (filters.date === 'tomorrow' && b.date !== tomorrowStr) return false;
        if (filters.date === 'week') {
          const d = new Date(b.date + 'T00:00:00');
          if (d < today || d > endOfWeek) return false;
        }
        if (filters.type  !== 'all' && b.type  !== filters.type)  return false;
        if (filters.level !== 'all' && b.level !== filters.level) return false;
        return true;
      })
      .sort(
        (a, b) =>
          new Date(`${a.date}T${a.time}`).getTime() -
          new Date(`${b.date}T${b.time}`).getTime()
      );
  }, [bookings, filters]);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <BookingFilter filters={filters} onFilterChange={setFilters} />
        <p className="text-sm text-slate-400">
          {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-xl shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-slate-700">Sin resultados</h3>
          <p className="text-sm text-slate-400 mt-1">
            Intentá cambiar los filtros o creá tu propia reserva.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              currentUser={currentUser}
              onJoin={onJoinBooking}
              onLeave={onLeaveBooking}
              onKick={onKickPlayer}
              onInvite={onInvitePlayer}
              onAwardPoints={onAwardPoints}
            />
          ))}
        </div>
      )}
    </div>
  );
};
