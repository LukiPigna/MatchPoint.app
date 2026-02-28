
import React from 'react';
import { User, Club } from '../types/index';

interface PointsLeaderboardProps {
  users: User[];
  clubs: Club[];
}

export const PointsLeaderboard: React.FC<PointsLeaderboardProps> = ({ users, clubs }) => {
  return (
    <div className="py-8 animate-fade-in space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Salón de la Fama</h2>
        <p className="text-slate-500">Los mejores jugadores y clubs de la temporada. ¿Tienes lo necesario para estar en la cima?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Players Leaderboard */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 flex items-center">
              <span className="mr-3">🏆</span> Top Jugadores
            </h3>
            <span className="text-indigo-600 text-sm font-bold uppercase tracking-widest">Global</span>
          </div>
          
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="divide-y divide-slate-50">
              {users.sort((a, b) => b.points - a.points).slice(0, 10).map((user, index) => (
                <div key={user.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-slate-100 text-slate-500' : index === 2 ? 'bg-amber-50 text-amber-800' : 'text-slate-300'}`}>
                      {index + 1}
                    </div>
                    <div className="relative">
                      <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm group-hover:scale-110 transition-transform" />
                      {index === 0 && <span className="absolute -top-2 -right-2 text-xl">👑</span>}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900">{user.name}</p>
                        {user.clubId && (
                          <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md font-black uppercase">
                            {clubs.find(c => c.id === user.clubId)?.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-medium">{user.zone || 'Sin zona'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900">{user.points}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Puntos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Clubs Leaderboard */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 flex items-center">
              <span className="mr-3">🛡️</span> Top Clubs
            </h3>
            <span className="text-indigo-600 text-sm font-bold uppercase tracking-widest">Temporada 1</span>
          </div>
          
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="divide-y divide-slate-50">
              {clubs.sort((a, b) => b.points - a.points).slice(0, 10).map((club, index) => (
                <div key={club.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-slate-100 text-slate-500' : index === 2 ? 'bg-amber-50 text-amber-800' : 'text-slate-300'}`}>
                      {index + 1}
                    </div>
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-all text-sm">
                      {club.tag}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{club.name}</p>
                      <p className="text-xs text-slate-400 font-medium">{club.members.length} miembros activos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-indigo-600">{club.points}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Puntos Club</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
