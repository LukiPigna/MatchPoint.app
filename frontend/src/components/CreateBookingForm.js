import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { MATCH_LEVELS_CASUAL, MATCH_LEVELS_COMPETITIVE } from '../constants';
export const CreateBookingForm = ({ onSubmit, isSubmitting, error, currentUser: _currentUser, }) => {
    const [matchType, setMatchType] = useState('casual');
    const [level, setLevel] = useState(MATCH_LEVELS_CASUAL[0]);
    const [notes, setNotes] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [otherPlayers, setOtherPlayers] = useState(['', '', '']);
    useEffect(() => {
        setLevel(matchType === 'casual' ? MATCH_LEVELS_CASUAL[0] : MATCH_LEVELS_COMPETITIVE[0]);
    }, [matchType]);
    const filledPlayers = otherPlayers.filter((p) => p.trim() !== '');
    const totalPlayers = 1 + filledPlayers.length;
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ level, notes, visibility, type: matchType, players: otherPlayers });
    };
    const levelOptions = matchType === 'casual' ? MATCH_LEVELS_CASUAL : MATCH_LEVELS_COMPETITIVE;
    const toggleClass = (active) => `w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${active ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`;
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-600 mb-2", children: "Tipo de Partido" }), _jsxs("div", { className: "flex rounded-lg border border-slate-300 p-1", children: [_jsx("button", { type: "button", onClick: () => setMatchType('casual'), className: toggleClass(matchType === 'casual'), children: "Amistoso" }), _jsx("button", { type: "button", onClick: () => setMatchType('competitive'), className: toggleClass(matchType === 'competitive'), children: "Competitivo" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-600 mb-2", children: "Visibilidad" }), _jsxs("div", { className: "flex rounded-lg border border-slate-300 p-1", children: [_jsx("button", { type: "button", onClick: () => setVisibility('public'), className: toggleClass(visibility === 'public'), children: "P\u00FAblico" }), _jsx("button", { type: "button", onClick: () => setVisibility('private'), className: toggleClass(visibility === 'private'), children: "Privado" })] }), _jsx("p", { className: "text-xs text-slate-400 mt-1.5", children: visibility === 'public'
                            ? 'Otros jugadores podrán unirse a tu reserva.'
                            : 'Solo visible para vos. Invitá a tus amigos.' })] }), visibility === 'private' && (_jsxs("div", { className: "space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-fade-in", children: [_jsxs("h3", { className: "font-semibold text-slate-700 text-sm", children: ["Jugadores invitados (", totalPlayers, "/4)"] }), otherPlayers.map((player, index) => (_jsx("input", { type: "text", value: player, onChange: (e) => {
                            const next = [...otherPlayers];
                            next[index] = e.target.value;
                            setOtherPlayers(next);
                        }, placeholder: `Jugador ${index + 2}`, className: "w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 text-sm" }, index)))] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-600 mb-1", children: matchType === 'casual' ? 'Nivel del partido' : 'Categoría' }), _jsx("select", { value: level, onChange: (e) => setLevel(e.target.value), className: "w-full bg-slate-100 border border-slate-300 rounded-md py-2.5 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500", children: levelOptions.map((l) => (_jsx("option", { value: l, children: l }, l))) })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-slate-600 mb-1", children: ["Notas ", _jsx("span", { className: "text-slate-400", children: "(opcional)" })] }), _jsx("textarea", { rows: 2, value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "Ej: Partido amistoso, llevar pelotas nuevas...", className: "w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 text-sm resize-none" })] }), error && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 text-center animate-fade-in", children: error })), _jsx("button", { type: "submit", disabled: isSubmitting || totalPlayers > 4, className: "w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed", children: isSubmitting
                    ? 'Procesando...'
                    : totalPlayers > 4
                        ? `Demasiados jugadores (${totalPlayers}/4)`
                        : 'Confirmar y Reservar Cancha' })] }));
};
