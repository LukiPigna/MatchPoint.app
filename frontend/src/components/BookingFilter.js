import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MATCH_LEVELS_CASUAL, MATCH_LEVELS_COMPETITIVE } from '../constants';
export const BookingFilter = ({ filters, onFilterChange }) => {
    const handleFilter = (key, value) => {
        onFilterChange({ ...filters, [key]: value });
    };
    const allLevels = ['all', ...MATCH_LEVELS_CASUAL, ...MATCH_LEVELS_COMPETITIVE];
    const selectClass = 'bg-white border border-slate-300 rounded-md py-1.5 px-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500';
    return (_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsxs("select", { value: filters.date, onChange: (e) => handleFilter('date', e.target.value), className: selectClass, children: [_jsx("option", { value: "all", children: "Cualquier Fecha" }), _jsx("option", { value: "today", children: "Hoy" }), _jsx("option", { value: "tomorrow", children: "Ma\u00F1ana" }), _jsx("option", { value: "week", children: "Esta Semana" })] }), _jsxs("select", { value: filters.type, onChange: (e) => handleFilter('type', e.target.value), className: selectClass, children: [_jsx("option", { value: "all", children: "Cualquier Tipo" }), _jsx("option", { value: "casual", children: "Amistoso" }), _jsx("option", { value: "competitive", children: "Competitivo" })] }), _jsx("select", { value: filters.level, onChange: (e) => handleFilter('level', e.target.value), className: selectClass, children: allLevels.map((level) => (_jsx("option", { value: level, children: level === 'all' ? 'Cualquier Nivel' : level }, level))) })] }));
};
