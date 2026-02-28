import React, { useState } from 'react';
import { User } from '../types/index';

interface ProfileProps {
  user: User;
  allUsers: User[];
  onUpdateUser: (updatedUser: User) => void;
  onAddFriend: (padelTag: string) => void;
  onRemoveFriend: (friendId: string) => void;
  onBack: () => void;
}

export const Profile: React.FC<ProfileProps> = ({
  user,
  allUsers,
  onUpdateUser,
  onAddFriend,
  onRemoveFriend,
  onBack,
}) => {
  const [name, setName]             = useState(user.name);
  const [avatar, setAvatar]         = useState(user.avatar);
  const [zone, setZone]             = useState(user.zone);
  const [newFriendTag, setNewFriendTag] = useState('');
  const [saving, setSaving]         = useState(false);

  const friends = allUsers.filter((u) => user.friends.includes(u.id));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onUpdateUser({ ...user, name, avatar, zone });
    setSaving(false);
  };

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFriendTag.trim()) {
      onAddFriend(newFriendTag.trim());
      setNewFriendTag('');
    }
  };

  const randomAvatar = () => {
    setAvatar(`https://i.pravatar.cc/150?u=${Date.now()}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800">Mi Perfil</h2>
        <button
          onClick={onBack}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </button>
      </div>

      {/* Datos del perfil */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Avatar */}
          <div className="md:col-span-1 flex flex-col items-center gap-3">
            <div className="relative group">
              <img
                src={avatar || `https://i.pravatar.cc/150?u=${user.email}`}
                alt={name}
                className="w-28 h-28 rounded-full object-cover shadow-md"
              />
              <button
                type="button"
                onClick={randomAvatar}
                className="absolute inset-0 w-full h-full bg-black/50 rounded-full flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Cambiar
              </button>
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-800">{user.name}</p>
              <div className="mt-1 bg-indigo-50 px-4 py-1 rounded-full border border-indigo-100 inline-block">
                <p className="text-indigo-600 font-black text-sm">{user.points} pts</p>
              </div>
              <div className="mt-2 bg-slate-100 px-3 py-1 rounded-full inline-block">
                <p className="text-slate-600 font-bold text-xs">{user.padelTag}</p>
              </div>
            </div>
          </div>

          {/* Campos */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Nombre completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-slate-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Zona</label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {['Norte', 'Sur', 'Oeste', 'Este', 'Centro'].map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>

      {/* Amigos */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Mis Amigos</h3>
        <form onSubmit={handleAddFriend} className="flex items-center gap-3 mb-6">
          <input
            type="text"
            value={newFriendTag}
            onChange={(e) => setNewFriendTag(e.target.value)}
            placeholder="PadelTag: Nombre#1234"
            className="flex-grow bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
          />
          <button
            type="submit"
            className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition hover:bg-green-600 flex-shrink-0"
          >
            Añadir
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-slate-700 font-semibold text-sm">{friend.name}</p>
                    <p className="text-slate-400 text-xs">{friend.padelTag}</p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFriend(friend.id)}
                  title="Eliminar amigo"
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-sm col-span-full text-center py-4">
              Aún no agregaste amigos. ¡Buscalos por su Padel-Tag!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
