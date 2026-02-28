import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from 'react';
import { TIME_SLOTS, MATCH_LEVELS_CASUAL, MATCH_LEVELS_COMPETITIVE, DEFAULT_DURATION } from '../constants';
const EditBookingModal = ({ booking, pricing, onClose, onSave }) => {
    const [form, setForm] = useState(booking);
    useEffect(() => {
        const defaultPrice = pricing[form.duration]?.price;
        const oldDefault = pricing[booking.duration]?.price;
        if (defaultPrice !== undefined && form.price === oldDefault) {
            setForm((prev) => ({ ...prev, price: defaultPrice }));
        }
    }, [form.duration, booking.duration, form.price, pricing]);
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'number' || name === 'duration' ? Number(value) : value,
        }));
    };
    const levelOptions = form.type === 'casual' ? MATCH_LEVELS_CASUAL : MATCH_LEVELS_COMPETITIVE;
    return (_jsxs("div", { className: "fixed inset-0 bg-slate-900/75 flex items-center justify-center z-50 p-4 animate-fade-in", children: [_jsxs("div", { className: "bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-fade-in-up", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h3", { className: "text-xl font-bold text-slate-900", children: "Editar Reserva" }), _jsx("button", { onClick: onClose, className: "p-2 rounded-full hover:bg-slate-100", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-slate-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsxs("form", { onSubmit: (e) => { e.preventDefault(); onSave(form); }, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-600", children: "Fecha" }), _jsx("input", { type: "date", name: "date", value: form.date, onChange: handleChange, className: "input-field" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-600", children: "Hora" }), _jsx("select", { name: "time", value: form.time, onChange: handleChange, className: "input-field", children: TIME_SLOTS.map((t) => _jsx("option", { value: t, children: t }, t)) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-600", children: "A nombre de" }), _jsx("input", { type: "text", name: "organizer", value: form.organizer, onChange: handleChange, className: "input-field" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-600", children: "Jugadores (separados por coma)" }), _jsx("input", { type: "text", name: "players", value: form.players.join(', '), onChange: (e) => setForm((prev) => ({ ...prev, players: e.target.value.split(',').map((p) => p.trim()) })), className: "input-field" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-600", children: "Tipo" }), _jsxs("select", { name: "type", value: form.type, onChange: handleChange, className: "input-field", children: [_jsx("option", { value: "casual", children: "Amistoso" }), _jsx("option", { value: "competitive", children: "Competitivo" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-600", children: "Nivel" }), _jsx("select", { name: "level", value: form.level, onChange: handleChange, className: "input-field", children: levelOptions.map((l) => _jsx("option", { value: l, children: l }, l)) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-600", children: "Duraci\u00F3n" }), _jsx("select", { name: "duration", value: form.duration, onChange: handleChange, className: "input-field", children: Object.entries(pricing).map(([d, v]) => _jsx("option", { value: d, children: v.label }, d)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-600", children: "Precio ($)" }), _jsx("input", { type: "number", name: "price", value: form.price, onChange: handleChange, className: "input-field" })] })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx("button", { type: "button", onClick: onClose, className: "bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition", children: "Cancelar" }), _jsx("button", { type: "submit", className: "bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition", children: "Guardar" })] })] })] }), _jsx("style", { children: `.input-field { width: 100%; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; font-size: 0.875rem; color: #1e293b; outline: none; } .input-field:focus { box-shadow: 0 0 0 2px #6366f1; }` })] }));
};
// ---- PricingSettings ---------------------------------------------------------
const PricingSettings = ({ currentPricing, onSave }) => {
    const [prices, setPrices] = useState({
        60: currentPricing[60].price,
        90: currentPricing[90].price,
    });
    return (_jsxs("div", { className: "bg-white p-6 rounded-xl shadow-lg", children: [_jsx("h2", { className: "text-xl font-bold text-slate-800 mb-4", children: "Configuraci\u00F3n de Precios" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 items-end", children: [[60, 90].map((d) => (_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-slate-600", children: [currentPricing[d].label, " ($)"] }), _jsx("input", { type: "number", value: prices[d], onChange: (e) => setPrices((prev) => ({ ...prev, [d]: Number(e.target.value) })), className: "w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 mt-1" })] }, d))), _jsx("button", { onClick: () => onSave({
                            60: { ...currentPricing[60], price: prices[60] },
                            90: { ...currentPricing[90], price: prices[90] },
                        }), className: "w-full bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-lg transition hover:bg-indigo-700", children: "Guardar Precios" })] })] }));
};
export const AdminDashboard = ({ bookings, pricing, onUpdateBooking, onDeleteBooking, onCreateBooking, onUpdatePricing, }) => {
    const [editingBooking, setEditingBooking] = useState(null);
    // Form state
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState(TIME_SLOTS[0]);
    const [duration, setDuration] = useState(DEFAULT_DURATION);
    const [organizer, setOrganizer] = useState('');
    const [players, setPlayers] = useState('');
    const [level, setLevel] = useState(MATCH_LEVELS_CASUAL[0]);
    const [type, setType] = useState('casual');
    const [visibility] = useState('public');
    const [price, setPrice] = useState(pricing[DEFAULT_DURATION].price);
    useEffect(() => setPrice(pricing[duration]?.price ?? 0), [duration, pricing]);
    const { grouped, totalBookings, todayOccupancy, topPlayer } = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const todayCount = bookings.filter((b) => b.date === todayStr).length;
        const playerCount = bookings
            .flatMap((b) => b.players)
            .reduce((acc, p) => ({ ...acc, [p]: (acc[p] ?? 0) + 1 }), {});
        const top = Object.keys(playerCount).sort((a, b) => playerCount[b] - playerCount[a])[0] ?? 'N/A';
        const grp = [...bookings]
            .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
            .reduce((acc, b) => {
            if (!acc[b.date])
                acc[b.date] = [];
            acc[b.date].push(b);
            return acc;
        }, {});
        return {
            grouped: grp,
            totalBookings: bookings.length,
            todayOccupancy: `${((todayCount / TIME_SLOTS.length) * 100).toFixed(0)}%`,
            topPlayer: top,
        };
    }, [bookings]);
    const handleCreate = (e) => {
        e.preventDefault();
        onCreateBooking({
            venueId: 'v1',
            date, time, duration, organizer,
            players: players.split(',').map((p) => p.trim()).filter(Boolean),
            level, type, visibility, price, notes: '',
        });
        setOrganizer('');
        setPlayers('');
    };
    const formatDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    const StatCard = ({ title, value, emoji, }) => (_jsxs("div", { className: "bg-white p-5 rounded-xl shadow-lg flex items-center gap-4", children: [_jsx("div", { className: "text-3xl", children: emoji }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-slate-500", children: title }), _jsx("p", { className: "text-2xl font-black text-slate-800", children: value })] })] }));
    return (_jsxs("div", { className: "space-y-10 animate-fade-in", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-slate-800 mb-4", children: "Panel de Control" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(StatCard, { title: "Total de Reservas", value: totalBookings, emoji: "\uD83D\uDCCB" }), _jsx(StatCard, { title: "Ocupaci\u00F3n de Hoy", value: todayOccupancy, emoji: "\uD83D\uDCC5" }), _jsx(StatCard, { title: "Jugador m\u00E1s activo", value: topPlayer, emoji: "\uD83C\uDFC6" })] })] }), _jsx(PricingSettings, { currentPricing: pricing, onSave: onUpdatePricing }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-lg", children: [_jsx("h2", { className: "text-xl font-bold text-slate-800 mb-4", children: "Crear Nueva Reserva" }), _jsxs("form", { onSubmit: handleCreate, className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end", children: [[
                                { label: 'Fecha', el: _jsx("input", { type: "date", value: date, onChange: (e) => setDate(e.target.value), className: "w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-sm" }) },
                                { label: 'Hora', el: _jsx("select", { value: time, onChange: (e) => setTime(e.target.value), className: "w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-sm", children: TIME_SLOTS.map((t) => _jsx("option", { value: t, children: t }, t)) }) },
                                { label: 'Duración', el: _jsx("select", { value: duration, onChange: (e) => setDuration(Number(e.target.value)), className: "w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-sm", children: Object.entries(pricing).map(([d, v]) => _jsx("option", { value: d, children: v.label }, d)) }) },
                                { label: 'A nombre de', el: _jsx("input", { type: "text", value: organizer, onChange: (e) => setOrganizer(e.target.value), required: true, className: "w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-sm" }) },
                            ].map(({ label, el }) => (_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-500 mb-1", children: label }), el] }, label))), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-xs font-medium text-slate-500 mb-1", children: "Otros jugadores (coma)" }), _jsx("input", { type: "text", value: players, onChange: (e) => setPlayers(e.target.value), className: "w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-sm" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-500 mb-1", children: "Tipo" }), _jsxs("select", { value: type, onChange: (e) => setType(e.target.value), className: "w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-sm", children: [_jsx("option", { value: "casual", children: "Amistoso" }), _jsx("option", { value: "competitive", children: "Competitivo" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-500 mb-1", children: "Nivel" }), _jsx("select", { value: level, onChange: (e) => setLevel(e.target.value), className: "w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-sm", children: (type === 'casual' ? MATCH_LEVELS_CASUAL : MATCH_LEVELS_COMPETITIVE).map((l) => _jsx("option", { value: l, children: l }, l)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-slate-500 mb-1", children: "Precio ($)" }), _jsx("input", { type: "number", value: price, onChange: (e) => setPrice(Number(e.target.value)), className: "w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-sm" })] }), _jsx("button", { type: "submit", className: "w-full bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-lg transition hover:bg-indigo-700 text-sm", children: "Crear Reserva" })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-lg", children: [_jsx("h2", { className: "text-xl font-bold text-slate-800 mb-6", children: "Todas las Reservas" }), Object.keys(grouped).length === 0 ? (_jsx("p", { className: "text-slate-400 text-center py-8", children: "Sin reservas programadas." })) : (_jsx("div", { className: "space-y-8", children: Object.entries(grouped).map(([dateKey, dayBookings]) => (_jsxs("div", { children: [_jsx("h3", { className: "text-base font-semibold text-indigo-600 mb-3 capitalize", children: formatDate(dateKey) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "text-xs uppercase bg-slate-50 text-slate-500", children: _jsx("tr", { children: ['Hora', 'Duración', 'Organizador', 'Jugadores', 'Nivel', 'Precio', ''].map((h) => (_jsx("th", { className: "px-4 py-3", children: h }, h))) }) }), _jsx("tbody", { children: dayBookings.map((b) => (_jsxs("tr", { className: "border-b hover:bg-slate-50", children: [_jsx("td", { className: "px-4 py-3 font-semibold text-slate-800", children: b.time }), _jsx("td", { className: "px-4 py-3", children: pricing[b.duration]?.label }), _jsx("td", { className: "px-4 py-3", children: b.organizer }), _jsxs("td", { className: "px-4 py-3 text-slate-500", children: [b.players.join(', '), " (", b.players.length, "/4)"] }), _jsx("td", { className: "px-4 py-3", children: b.level }), _jsxs("td", { className: "px-4 py-3 font-medium", children: ["$", b.price] }), _jsxs("td", { className: "px-4 py-3 text-right space-x-3", children: [_jsx("button", { onClick: () => setEditingBooking(b), className: "text-blue-600 hover:underline text-xs font-semibold", children: "Editar" }), _jsx("button", { onClick: () => onDeleteBooking(b.id), className: "text-red-500 hover:underline text-xs font-semibold", children: "Eliminar" })] })] }, b.id))) })] }) })] }, dateKey))) }))] }), editingBooking && (_jsx(EditBookingModal, { booking: editingBooking, pricing: pricing, onClose: () => setEditingBooking(null), onSave: (updated) => { onUpdateBooking(updated); setEditingBooking(null); } }))] }));
};
