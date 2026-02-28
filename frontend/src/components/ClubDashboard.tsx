import React, { useState } from 'react';
import { User, Club } from '../types/index';
import { api } from '../services/api';

interface ClubDashboardProps {
  currentUser: User;
  clubs: Club[];
  users: User[];
  onUpdateUser: (user: User) => void;
  onUpdateClubs: (clubs: Club[]) => void;
}

export const ClubDashboard: React.FC<ClubDashboardProps> = ({
  currentUser,
  clubs,
  users,
  onUpdateUser,
  onUpdateClubs,
}) => {
  const [loading, setLoading] = useState<string | null>(null);

  const userClub = clubs.find((c) => c.id === currentUser.clubId);

  const handleJoinClub = async (clubId: string) => {
    setLoading(clubId);
    try {
      const { club, user } = await api.post<{ club: Club; user: User }>(
        `/clubs/${clubId}/join`,
        {}
      );
      onUpdateUser(user);
      onUpdateClubs(clubs.map((c) => (c.id === club.id ? club : c)));
    } catch {
      // handled globally
    } finally {
      setLoading(null);
    }
  };

  const handleLeaveClub = async () => {
    if (!userClub) return;
    setLoading(userClub.id);
    try {
      const { club, user } = await api.post<{ club: Club; user: User }>(
        `/clubs/${userClub.id}/leave`,
        {}
      );
      onUpdateUser(user);
      onUpdateClubs(clubs.map((c) => (c.id === club.id ? club : c)));
    } catch {
      // handled globally
    } finally {
      setLoading(null);
    }
  };

  const getMemberDetails = (memberIds: string[]) =>
    users.filter((u) => memberIds.includes(u.id));

  return (
    <div className="py-8 animate-fade-in space-y-10">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Clubs</h2>
        <p className="text-slate-500 mt-1">
          Unite a un club, sumá puntos y competí en equipo.
        </p>
      </div>

      {userClub ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mi club */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white text-lg">
                {userClub.tag}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">{userClub.name}</h3>
                <p className="text-slate-500">{userClub.members.length} miembros</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-3xl font-black text-indigo-600">{userClub.points}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Puntos</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-widest">
                Miembros
              </h4>
              <div className="space-y-3">
                {getMemberDetails(userClub.members).map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{member.name}</p>
                      <p className="text-xs text-slate-400">{member.padelTag}</p>
                    </div>
                    <p className="ml-auto font-black text-slate-700">{member.points} pts</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleLeaveClub}
              disabled={loading === userClub.id}
              className="w-full py-3 text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100 disabled:opacity-60"
            >
              Abandonar Club
            </button>
          </div>

          {/* Ranking de clubs */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h4 className="text-lg font-bold text-slate-900 mb-4">Ranking de Clubs</h4>
            <div className="space-y-3">
              {[...clubs]
                .sort((a, b) => b.points - a.points)
                .slice(0, 5)
                .map((club, index) => (
                  <div key={club.id} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50">
                    <span className={`w-5 text-center font-black text-sm ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-amber-700' : 'text-slate-300'}`}>
                      {index + 1}
                    </span>
                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-600 text-xs">
                      {club.tag}
                    </div>
                    <p className="font-bold text-slate-900 text-sm flex-1">{club.name}</p>
                    <p className="font-black text-indigo-600 text-sm">{club.points}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <div
              key={club.id}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-lg font-black text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  {club.tag}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{club.name}</h3>
                  <p className="text-slate-500 text-sm">{club.members.length} miembros</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Puntos</p>
                  <p className="text-lg font-black text-slate-900">{club.points}</p>
                </div>
                <button
                  onClick={() => handleJoinClub(club.id)}
                  disabled={loading === club.id}
                  className="bg-slate-100 text-slate-700 px-6 py-2 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-60"
                >
                  {loading === club.id ? 'Uniéndose...' : 'Unirse'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
