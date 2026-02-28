import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { PRICING_OPTIONS } from '../constants';
const PlayerSlot = ({ name, onKick, isWinner, }) => (_jsxs("div", { className: "relative group flex flex-col items-center", children: [_jsx("div", { className: `w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${name
                ? 'bg-slate-200 text-slate-700 border-slate-300'
                : 'bg-slate-50 border-dashed border-slate-300 text-slate-300'}`, children: name ? name.charAt(0).toUpperCase() : '+' }), isWinner && (_jsx("span", { className: "absolute -top-1 -right-1 text-xs", children: "\u2B50" })), onKick && name && (_jsx("button", { onClick: onKick, className: "absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10", children: "\u00D7" })), name && (_jsx("div", { className: "absolute top-10 w-max bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap", children: name }))] }));
export const BookingCard = ({ booking, currentUser, onJoin, onLeave, onKick, onInvite, onAwardPoints, }) => {
    const [showWinnerPicker, setShowWinnerPicker] = React.useState(false);
    const bookingDate = new Date(booking.date + 'T00:00:00');
    const day = bookingDate.toLocaleDateString('es-ES', { day: '2-digit' });
    const month = bookingDate.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '').toUpperCase();
    const durationLabel = PRICING_OPTIONS[booking.duration]?.label ?? `${booking.duration} min`;
    const isFull = booking.players.length >= 4;
    const isJoined = booking.players.includes(currentUser.name);
    const isOrganizer = booking.organizer === currentUser.name;
    const canJoin = !isFull && !isJoined && booking.visibility === 'public';
    const pricePerPlayer = (booking.price / (booking.players.length || 1)).toFixed(2);
    const levelBadgeClass = booking.type === 'competitive'
        ? 'bg-red-100 text-red-800'
        : 'bg-green-100 text-green-800';
    const handleAward = (winners) => {
        onAwardPoints?.(booking.id, winners);
        setShowWinnerPicker(false);
    };
    const renderAction = () => {
        if (booking.winner) {
            return (_jsxs("div", { className: "w-full bg-amber-50 text-amber-700 font-bold py-2 px-3 rounded-lg text-xs text-center border border-amber-100", children: ["\uD83C\uDFC6 Ganadores: ", booking.winner.join(' & ')] }));
        }
        if (isOrganizer && isFull && onAwardPoints) {
            return (_jsx("button", { onClick: () => setShowWinnerPicker(!showWinnerPicker), className: "w-full bg-amber-500 text-white font-bold py-2 px-3 rounded-lg text-sm transition hover:bg-amber-600", children: showWinnerPicker ? 'Cancelar' : '🏆 Cargar Resultado' }));
        }
        if (isJoined && !isOrganizer) {
            return (_jsx("button", { onClick: () => onLeave(booking.id), className: "w-full bg-red-500 text-white font-semibold py-2 px-3 rounded-lg text-sm transition hover:bg-red-600", children: "Cancelar mi lugar" }));
        }
        if (canJoin) {
            return (_jsx("button", { onClick: () => onJoin(booking.id), className: "w-full bg-indigo-600 text-white font-semibold py-2 px-3 rounded-lg text-sm transition hover:bg-indigo-700", children: "Unirme" }));
        }
        if (isOrganizer && !isFull) {
            return (_jsx("button", { onClick: () => onInvite(booking.id), className: "w-full bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg text-sm transition hover:bg-blue-600", children: "Invitar Jugador" }));
        }
        if (isJoined) {
            return (_jsx("div", { className: "w-full bg-green-100 text-green-800 font-semibold py-2 px-3 rounded-lg text-sm text-center", children: "Inscripto \u2713" }));
        }
        if (isFull) {
            return (_jsx("div", { className: "w-full bg-slate-200 text-slate-500 font-semibold py-2 px-3 rounded-lg text-sm text-center", children: "Completo" }));
        }
        return null;
    };
    return (_jsxs("div", { className: "bg-white p-4 rounded-xl shadow-md transition-all hover:shadow-lg flex flex-col sm:flex-row sm:items-center sm:gap-4 border border-slate-100 relative overflow-hidden", children: [booking.winner && (_jsx("div", { className: "absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest z-10", children: "Finalizado" })), _jsxs("div", { className: "flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-slate-100 rounded-lg text-center", children: [_jsx("span", { className: "text-xs font-bold text-indigo-600", children: month }), _jsx("span", { className: "text-2xl font-extrabold text-slate-800", children: day })] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsxs("p", { className: "font-bold text-slate-800", children: [booking.time, " hs", ' ', _jsxs("span", { className: "text-sm font-normal text-slate-500", children: ["(", durationLabel, ")"] })] }), booking.visibility === 'private' && (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 text-slate-400", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z", clipRule: "evenodd" }) })), _jsx("span", { className: `text-xs font-semibold px-2 py-0.5 rounded-full ${levelBadgeClass}`, children: booking.level })] }), _jsxs("p", { className: "text-sm text-slate-500 mt-0.5", children: ["Organiza: ", booking.organizer] }), booking.notes && (_jsxs("p", { className: "text-xs text-slate-400 mt-1 italic truncate", children: ["\"", booking.notes, "\""] })), _jsxs("div", { className: "flex items-baseline mt-1 gap-1", children: [_jsxs("span", { className: "font-bold text-lg text-indigo-600", children: ["$", booking.price] }), _jsxs("span", { className: "text-xs text-slate-400", children: ["/ $", pricePerPlayer, " por jugador"] })] })] }), _jsx("div", { className: "border-t sm:border-t-0 sm:border-l border-slate-200 my-3 sm:my-0 sm:h-16" }), _jsx("div", { className: "flex-shrink-0 sm:w-60 flex flex-col justify-center gap-2", children: showWinnerPicker ? (_jsxs("div", { className: "space-y-2 animate-fade-in", children: [_jsx("p", { className: "text-[10px] font-black uppercase text-slate-400 text-center tracking-widest", children: "\u00BFQui\u00E9nes ganaron?" }), _jsxs("button", { onClick: () => handleAward([booking.players[0], booking.players[1]]), className: "w-full text-xs font-bold py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-all", children: [booking.players[0], " & ", booking.players[1]] }), _jsxs("button", { onClick: () => handleAward([booking.players[2], booking.players[3]]), className: "w-full text-xs font-bold py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-all", children: [booking.players[2], " & ", booking.players[3]] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "flex items-center gap-2", children: Array.from({ length: 4 }).map((_, i) => {
                                        const playerName = booking.players[i];
                                        const isWinner = booking.winner?.includes(playerName ?? '');
                                        const canKick = isOrganizer && !!playerName && playerName !== currentUser.name;
                                        return (_jsx(PlayerSlot, { name: playerName, isWinner: isWinner, onKick: canKick ? () => onKick(booking.id, playerName) : undefined }, i));
                                    }) }), _jsxs("span", { className: "text-sm font-semibold text-slate-500", children: [booking.players.length, "/4"] })] }), _jsx("div", { children: renderAction() })] })) })] }));
};
