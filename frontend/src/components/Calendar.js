import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export const Calendar = ({ selectedDate, onDateChange }) => {
    const [displayDate, setDisplayDate] = useState(new Date(selectedDate));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1);
    const endOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0);
    const startDay = (startOfMonth.getDay() + 6) % 7; // Lunes = 0
    const daysInMonth = endOfMonth.getDate();
    const handlePrevMonth = () => {
        setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
    };
    const handleNextMonth = () => {
        setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
    };
    const days = [
        ...Array.from({ length: startDay }, () => null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("button", { onClick: handlePrevMonth, className: "p-2 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500", children: _jsx("svg", { className: "w-5 h-5 text-slate-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 19l-7-7 7-7" }) }) }), _jsx("h3", { className: "text-lg font-semibold", children: displayDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase()) }), _jsx("button", { onClick: handleNextMonth, className: "p-2 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500", children: _jsx("svg", { className: "w-5 h-5 text-slate-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 5l7 7-7 7" }) }) })] }), _jsx("div", { className: "grid grid-cols-7 gap-1 text-center text-sm text-slate-500", children: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => _jsx("div", { className: "font-semibold", children: day }, day)) }), _jsx("div", { className: "grid grid-cols-7 gap-1 mt-2", children: days.map((day, index) => {
                    if (!day)
                        return _jsx("div", {}, `empty-${index}`);
                    const date = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
                    const isSelected = isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, today);
                    const isPast = date < today;
                    let classes = "w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200";
                    if (isPast) {
                        classes += " text-slate-400 cursor-not-allowed";
                    }
                    else {
                        classes += " cursor-pointer";
                        if (isSelected) {
                            classes += " bg-indigo-600 text-white font-bold shadow-md";
                        }
                        else if (isToday) {
                            classes += " ring-2 ring-indigo-500 text-indigo-600";
                        }
                        else {
                            classes += " hover:bg-slate-200";
                        }
                    }
                    return (_jsx("div", { onClick: () => !isPast && onDateChange(date), className: classes, children: day }, day));
                }) })] }));
};
