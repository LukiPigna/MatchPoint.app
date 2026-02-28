import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { api } from '../services/api';
export const ClubDashboard = ({ currentUser, clubs, users, onUpdateUser, onUpdateClubs, }) => {
    const [loading, setLoading] = useState(null);
    const userClub = clubs.find((c) => c.id === currentUser.clubId);
    const handleJoinClub = async (clubId) => {
        setLoading(clubId);
        try {
            const { club, user } = await api.post(`/clubs/${clubId}/join`, {});
            onUpdateUser(user);
            onUpdateClubs(clubs.map((c) => (c.id === club.id ? club : c)));
        }
        catch {
            // handled globally
        }
        finally {
            setLoading(null);
        }
    };
    const handleLeaveClub = async () => {
        if (!userClub)
            return;
        setLoading(userClub.id);
        try {
            const { club, user } = await api.post(`/clubs/${userClub.id}/leave`, {});
            onUpdateUser(user);
            onUpdateClubs(clubs.map((c) => (c.id === club.id ? club : c)));
        }
        catch {
            // handled globally
        }
        finally {
            setLoading(null);
        }
    };
    const getMemberDetails = (memberIds) => users.filter((u) => memberIds.includes(u.id));
    return (_jsxs("div", { className: "py-8 animate-fade-in space-y-10", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-extrabold text-slate-900 tracking-tight", children: "Clubs" }), _jsx("p", { className: "text-slate-500 mt-1", children: "Unite a un club, sum\u00E1 puntos y compet\u00ED en equipo." })] }), userClub ? (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white text-lg", children: userClub.tag }), _jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-black text-slate-900", children: userClub.name }), _jsxs("p", { className: "text-slate-500", children: [userClub.members.length, " miembros"] })] }), _jsxs("div", { className: "ml-auto text-right", children: [_jsx("p", { className: "text-3xl font-black text-indigo-600", children: userClub.points }), _jsx("p", { className: "text-[10px] uppercase font-bold text-slate-400 tracking-widest", children: "Puntos" })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-slate-700 mb-3 text-sm uppercase tracking-widest", children: "Miembros" }), _jsx("div", { className: "space-y-3", children: getMemberDetails(userClub.members).map((member) => (_jsxs("div", { className: "flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50", children: [_jsx("img", { src: member.avatar, alt: member.name, className: "w-10 h-10 rounded-full object-cover" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-slate-800 text-sm", children: member.name }), _jsx("p", { className: "text-xs text-slate-400", children: member.padelTag })] }), _jsxs("p", { className: "ml-auto font-black text-slate-700", children: [member.points, " pts"] })] }, member.id))) })] }), _jsx("button", { onClick: handleLeaveClub, disabled: loading === userClub.id, className: "w-full py-3 text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100 disabled:opacity-60", children: "Abandonar Club" })] }), _jsxs("div", { className: "bg-white p-6 rounded-3xl shadow-sm border border-slate-100", children: [_jsx("h4", { className: "text-lg font-bold text-slate-900 mb-4", children: "Ranking de Clubs" }), _jsx("div", { className: "space-y-3", children: [...clubs]
                                    .sort((a, b) => b.points - a.points)
                                    .slice(0, 5)
                                    .map((club, index) => (_jsxs("div", { className: "flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50", children: [_jsx("span", { className: `w-5 text-center font-black text-sm ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-amber-700' : 'text-slate-300'}`, children: index + 1 }), _jsx("div", { className: "w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-600 text-xs", children: club.tag }), _jsx("p", { className: "font-bold text-slate-900 text-sm flex-1", children: club.name }), _jsx("p", { className: "font-black text-indigo-600 text-sm", children: club.points })] }, club.id))) })] })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: clubs.map((club) => (_jsxs("div", { className: "bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all group", children: [_jsxs("div", { className: "flex items-center gap-4 mb-6", children: [_jsx("div", { className: "w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-lg font-black text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-all", children: club.tag }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-slate-900", children: club.name }), _jsxs("p", { className: "text-slate-500 text-sm", children: [club.members.length, " miembros"] })] })] }), _jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-slate-50", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-[10px] uppercase font-bold text-slate-400 tracking-widest", children: "Puntos" }), _jsx("p", { className: "text-lg font-black text-slate-900", children: club.points })] }), _jsx("button", { onClick: () => handleJoinClub(club.id), disabled: loading === club.id, className: "bg-slate-100 text-slate-700 px-6 py-2 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-60", children: loading === club.id ? 'Uniéndose...' : 'Unirse' })] })] }, club.id))) }))] }));
};
