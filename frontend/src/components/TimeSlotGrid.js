import { jsx as _jsx } from "react/jsx-runtime";
import { TIME_SLOTS } from '../constants';
export const TimeSlotGrid = ({ selectedTime, onTimeSelect, bookedSlots }) => {
    return (_jsx("div", { className: "grid grid-cols-3 sm:grid-cols-4 gap-3", children: TIME_SLOTS.map((time) => {
            const isBooked = bookedSlots.includes(time);
            const isSelected = time === selectedTime;
            let buttonClass = 'bg-white text-slate-700 border border-slate-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-600';
            if (isBooked) {
                buttonClass = 'bg-slate-100 text-slate-400 cursor-not-allowed line-through';
            }
            if (isSelected) {
                buttonClass = 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-offset-2 ring-indigo-500';
            }
            return (_jsx("button", { disabled: isBooked, onClick: () => onTimeSelect(time), className: `p-3 rounded-lg text-center font-semibold text-md transition-all duration-200 focus:outline-none ${buttonClass}`, children: time }, time));
        }) }));
};
