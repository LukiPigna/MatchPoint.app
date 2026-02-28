import React from 'react';
import { User, AppView } from '../types/index';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onProfileClick: () => void;
  onViewChange: (view: AppView) => void;
  currentView: AppView;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onProfileClick,
  onViewChange,
  currentView,
}) => {
  const navItems: { id: AppView; label: string; icon: string }[] = [
    { id: 'list',        label: 'Canchas',  icon: '🎾' },
    { id: 'clubs',       label: 'Clubs',    icon: '🛡️' },
    { id: 'tournaments', label: 'Torneos',  icon: '🏆' },
    { id: 'leaderboard', label: 'Ranking',  icon: '📊' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Nav */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onViewChange('venues')}
            className="flex items-center gap-2 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-indigo-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
            <span className="text-xl font-extrabold tracking-tighter text-slate-900 hidden sm:block group-hover:text-indigo-600 transition-colors">
              Reserva<span className="text-indigo-600">TuCancha</span>
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  currentView === item.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Acciones de usuario */}
        <div className="flex items-center gap-2">
          {/* Puntos */}
          <div className="hidden sm:flex items-center bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
            <span className="text-indigo-600 font-black text-sm">{user.points} pts</span>
          </div>

          {/* Perfil */}
          <button
            onClick={onProfileClick}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <span className="text-sm font-semibold text-slate-700 hidden sm:block">{user.name}</span>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-indigo-600">
                {user.name.charAt(0)}
              </div>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            title="Cerrar sesión"
            className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
