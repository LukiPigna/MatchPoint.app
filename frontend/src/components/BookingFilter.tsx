import React from 'react';
import { MATCH_LEVELS_CASUAL, MATCH_LEVELS_COMPETITIVE } from '../constants';

export interface Filters {
  date: 'all' | 'today' | 'tomorrow' | 'week';
  type: 'all' | 'casual' | 'competitive';
  level: string;
}

interface BookingFilterProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export const BookingFilter: React.FC<BookingFilterProps> = ({ filters, onFilterChange }) => {
  const handleFilter = (key: keyof Filters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const allLevels = ['all', ...MATCH_LEVELS_CASUAL, ...MATCH_LEVELS_COMPETITIVE];

  const selectClass =
    'bg-white border border-slate-300 rounded-md py-1.5 px-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={filters.date}
        onChange={(e) => handleFilter('date', e.target.value)}
        className={selectClass}
      >
        <option value="all">Cualquier Fecha</option>
        <option value="today">Hoy</option>
        <option value="tomorrow">Mañana</option>
        <option value="week">Esta Semana</option>
      </select>

      <select
        value={filters.type}
        onChange={(e) => handleFilter('type', e.target.value)}
        className={selectClass}
      >
        <option value="all">Cualquier Tipo</option>
        <option value="casual">Amistoso</option>
        <option value="competitive">Competitivo</option>
      </select>

      <select
        value={filters.level}
        onChange={(e) => handleFilter('level', e.target.value)}
        className={selectClass}
      >
        {allLevels.map((level) => (
          <option key={level} value={level}>
            {level === 'all' ? 'Cualquier Nivel' : level}
          </option>
        ))}
      </select>
    </div>
  );
};
