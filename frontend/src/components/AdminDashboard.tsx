import React, { useState, useMemo, useEffect } from 'react';
import { Booking } from '../types/index';
import { TIME_SLOTS, MATCH_LEVELS_CASUAL, MATCH_LEVELS_COMPETITIVE, PRICING_OPTIONS, DEFAULT_DURATION } from '../constants';

// ---- EditBookingModal --------------------------------------------------------

interface EditModalProps {
  booking: Booking;
  pricing: typeof PRICING_OPTIONS;
  onClose: () => void;
  onSave: (booking: Booking) => void;
}

const EditBookingModal: React.FC<EditModalProps> = ({ booking, pricing, onClose, onSave }) => {
  const [form, setForm] = useState<Booking>(booking);

  useEffect(() => {
    const defaultPrice = pricing[form.duration]?.price;
    const oldDefault   = pricing[booking.duration]?.price;
    if (defaultPrice !== undefined && form.price === oldDefault) {
      setForm((prev) => ({ ...prev, price: defaultPrice }));
    }
  }, [form.duration, booking.duration, form.price, pricing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' || name === 'duration' ? Number(value) : value,
    }));
  };

  const levelOptions = form.type === 'casual' ? MATCH_LEVELS_CASUAL : MATCH_LEVELS_COMPETITIVE;

  return (
    <div className="fixed inset-0 bg-slate-900/75 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900">Editar Reserva</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); onSave(form); }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600">Fecha</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600">Hora</label>
              <select name="time" value={form.time} onChange={handleChange} className="input-field">
                {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">A nombre de</label>
            <input type="text" name="organizer" value={form.organizer} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Jugadores (separados por coma)</label>
            <input
              type="text"
              name="players"
              value={form.players.join(', ')}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, players: e.target.value.split(',').map((p) => p.trim()) }))
              }
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600">Tipo</label>
              <select name="type" value={form.type} onChange={handleChange} className="input-field">
                <option value="casual">Amistoso</option>
                <option value="competitive">Competitivo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600">Nivel</label>
              <select name="level" value={form.level} onChange={handleChange} className="input-field">
                {levelOptions.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600">Duración</label>
              <select name="duration" value={form.duration} onChange={handleChange} className="input-field">
                {Object.entries(pricing).map(([d, v]) => <option key={d} value={d}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600">Precio ($)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition">
              Cancelar
            </button>
            <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition">
              Guardar
            </button>
          </div>
        </form>
      </div>

      {/* Inline Tailwind class for input-field */}
      <style>{`.input-field { width: 100%; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; font-size: 0.875rem; color: #1e293b; outline: none; } .input-field:focus { box-shadow: 0 0 0 2px #6366f1; }`}</style>
    </div>
  );
};

// ---- PricingSettings ---------------------------------------------------------

const PricingSettings: React.FC<{
  currentPricing: typeof PRICING_OPTIONS;
  onSave: (p: typeof PRICING_OPTIONS) => void;
}> = ({ currentPricing, onSave }) => {
  const [prices, setPrices] = useState({
    60: currentPricing[60].price,
    90: currentPricing[90].price,
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Configuración de Precios</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {([60, 90] as const).map((d) => (
          <div key={d}>
            <label className="block text-sm font-medium text-slate-600">
              {currentPricing[d].label} ($)
            </label>
            <input
              type="number"
              value={prices[d]}
              onChange={(e) => setPrices((prev) => ({ ...prev, [d]: Number(e.target.value) }))}
              className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 mt-1"
            />
          </div>
        ))}
        <button
          onClick={() =>
            onSave({
              60: { ...currentPricing[60], price: prices[60] },
              90: { ...currentPricing[90], price: prices[90] },
            })
          }
          className="w-full bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-lg transition hover:bg-indigo-700"
        >
          Guardar Precios
        </button>
      </div>
    </div>
  );
};

// ---- AdminDashboard ---------------------------------------------------------

interface AdminDashboardProps {
  bookings: Booking[];
  pricing: typeof PRICING_OPTIONS;
  onUpdateBooking: (booking: Booking) => void;
  onDeleteBooking: (bookingId: string) => void;
  onCreateBooking: (data: Omit<Booking, 'id'>) => void;
  onUpdatePricing: (p: typeof PRICING_OPTIONS) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  pricing,
  onUpdateBooking,
  onDeleteBooking,
  onCreateBooking,
  onUpdatePricing,
}) => {
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Form state
  const [date,       setDate]       = useState(new Date().toISOString().split('T')[0]);
  const [time,       setTime]       = useState(TIME_SLOTS[0]);
  const [duration,   setDuration]   = useState(DEFAULT_DURATION);
  const [organizer,  setOrganizer]  = useState('');
  const [players,    setPlayers]    = useState('');
  const [level,      setLevel]      = useState<string>(MATCH_LEVELS_CASUAL[0]);
  const [type,       setType]       = useState<'casual' | 'competitive'>('casual');
  const [visibility] = useState<'public' | 'private'>('public');
  const [price,      setPrice]      = useState(pricing[DEFAULT_DURATION].price);

  useEffect(() => setPrice(pricing[duration]?.price ?? 0), [duration, pricing]);

  const { grouped, totalBookings, todayOccupancy, topPlayer } = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayCount = bookings.filter((b) => b.date === todayStr).length;

    const playerCount = bookings
      .flatMap((b) => b.players)
      .reduce<Record<string, number>>((acc, p) => ({ ...acc, [p]: (acc[p] ?? 0) + 1 }), {});
    const top = Object.keys(playerCount).sort((a, b) => playerCount[b] - playerCount[a])[0] ?? 'N/A';

    const grp = [...bookings]
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
      .reduce<Record<string, Booking[]>>((acc, b) => {
        if (!acc[b.date]) acc[b.date] = [];
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

  const handleCreate = (e: React.FormEvent) => {
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

  const formatDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

  const StatCard: React.FC<{ title: string; value: string | number; emoji: string }> = ({
    title, value, emoji,
  }) => (
    <div className="bg-white p-5 rounded-xl shadow-lg flex items-center gap-4">
      <div className="text-3xl">{emoji}</div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Panel de Control</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total de Reservas"   value={totalBookings}    emoji="📋" />
          <StatCard title="Ocupación de Hoy"    value={todayOccupancy}   emoji="📅" />
          <StatCard title="Jugador más activo"  value={topPlayer}        emoji="🏆" />
        </div>
      </div>

      <PricingSettings currentPricing={pricing} onSave={onUpdatePricing} />

      {/* Crear reserva */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Crear Nueva Reserva</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          {[
            { label: 'Fecha', el: <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-sm" /> },
            { label: 'Hora', el: <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-sm">{TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}</select> },
            { label: 'Duración', el: <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-sm">{Object.entries(pricing).map(([d, v]) => <option key={d} value={d}>{v.label}</option>)}</select> },
            { label: 'A nombre de', el: <input type="text" value={organizer} onChange={(e) => setOrganizer(e.target.value)} required className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-sm" /> },
          ].map(({ label, el }) => (
            <div key={label}>
              <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
              {el}
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1">Otros jugadores (coma)</label>
            <input type="text" value={players} onChange={(e) => setPlayers(e.target.value)} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Tipo</label>
            <select value={type} onChange={(e) => setType(e.target.value as 'casual' | 'competitive')} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-sm">
              <option value="casual">Amistoso</option>
              <option value="competitive">Competitivo</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Nivel</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-sm">
              {(type === 'casual' ? MATCH_LEVELS_CASUAL : MATCH_LEVELS_COMPETITIVE).map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Precio ($)</label>
            <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-sm" />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-lg transition hover:bg-indigo-700 text-sm">
            Crear Reserva
          </button>
        </form>
      </div>

      {/* Lista de reservas */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Todas las Reservas</h2>
        {Object.keys(grouped).length === 0 ? (
          <p className="text-slate-400 text-center py-8">Sin reservas programadas.</p>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([dateKey, dayBookings]) => (
              <div key={dateKey}>
                <h3 className="text-base font-semibold text-indigo-600 mb-3 capitalize">
                  {formatDate(dateKey)}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-slate-50 text-slate-500">
                      <tr>
                        {['Hora', 'Duración', 'Organizador', 'Jugadores', 'Nivel', 'Precio', ''].map((h) => (
                          <th key={h} className="px-4 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dayBookings.map((b) => (
                        <tr key={b.id} className="border-b hover:bg-slate-50">
                          <td className="px-4 py-3 font-semibold text-slate-800">{b.time}</td>
                          <td className="px-4 py-3">{pricing[b.duration]?.label}</td>
                          <td className="px-4 py-3">{b.organizer}</td>
                          <td className="px-4 py-3 text-slate-500">{b.players.join(', ')} ({b.players.length}/4)</td>
                          <td className="px-4 py-3">{b.level}</td>
                          <td className="px-4 py-3 font-medium">${b.price}</td>
                          <td className="px-4 py-3 text-right space-x-3">
                            <button onClick={() => setEditingBooking(b)} className="text-blue-600 hover:underline text-xs font-semibold">Editar</button>
                            <button onClick={() => onDeleteBooking(b.id)} className="text-red-500 hover:underline text-xs font-semibold">Eliminar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          pricing={pricing}
          onClose={() => setEditingBooking(null)}
          onSave={(updated) => { onUpdateBooking(updated); setEditingBooking(null); }}
        />
      )}
    </div>
  );
};
