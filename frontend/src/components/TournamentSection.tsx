import React from 'react';
import { Tournament } from '../types/index';
import { VENUES } from '../constants';

interface TournamentSectionProps {
  tournaments: Tournament[];
  currentUserId: string;
  onJoinTournament: (tournamentId: string) => void;
}

export const TournamentSection: React.FC<TournamentSectionProps> = ({
  tournaments,
  currentUserId,
  onJoinTournament,
}) => {
  return (
    <div className="py-8 animate-fade-in space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Torneos &amp; Competiciones
        </h2>
        <p className="text-slate-500 mt-1">
          Participá en los eventos más importantes de tu zona y ganá premios increíbles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tournaments.map((tournament) => {
          const venue = VENUES.find((v) => v.id === tournament.venueId);
          const isJoined = tournament.participants.includes(currentUserId);

          return (
            <div
              key={tournament.id}
              className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row"
            >
              <div className="md:w-1/3 relative min-h-[140px]">
                <img
                  src={
                    venue?.image ||
                    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop'
                  }
                  alt={tournament.name}
                  className="absolute h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  {tournament.status === 'upcoming'
                    ? 'Próximamente'
                    : tournament.status === 'ongoing'
                    ? 'En Curso'
                    : 'Finalizado'}
                </div>
              </div>

              <div className="p-6 md:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-indigo-600 text-xs font-black uppercase tracking-widest">
                      {tournament.level}
                    </span>
                    <span className="text-slate-400 text-xs">{tournament.date}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-1 leading-tight">
                    {tournament.name}
                  </h3>
                  {venue && (
                    <p className="text-slate-500 text-sm mb-4 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {venue.name}
                    </p>
                  )}
                  <div className="flex gap-4 mb-6">
                    <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Premio</p>
                      <p className="text-sm font-black text-slate-800">{tournament.prize}</p>
                    </div>
                    <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Inscritos</p>
                      <p className="text-sm font-black text-slate-800">
                        {tournament.participants.length} / 16
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => !isJoined && onJoinTournament(tournament.id)}
                  disabled={tournament.status !== 'upcoming' || isJoined}
                  className={`w-full py-3 rounded-2xl font-black text-sm transition-all ${
                    isJoined
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : tournament.status === 'upcoming'
                      ? 'bg-indigo-600 text-white shadow-indigo-200 shadow-lg hover:bg-indigo-700 hover:-translate-y-0.5'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isJoined
                    ? '✓ Inscripto'
                    : tournament.status === 'upcoming'
                    ? 'Inscribirse Ahora'
                    : 'Inscripciones Cerradas'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
