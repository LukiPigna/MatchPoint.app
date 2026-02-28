import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// ============================================================
// App.tsx - Componente raíz
// Autor: Lucas Pignataro
// ============================================================
import { useState, useCallback, useMemo, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Header } from './components/Header';
import { Calendar } from './components/Calendar';
import { TimeSlotGrid } from './components/TimeSlotGrid';
import { CreateBookingForm } from './components/CreateBookingForm';
import { ConfirmationModal } from './components/ConfirmationModal';
import { BookingList } from './components/BookingList';
import { AdminDashboard } from './components/AdminDashboard';
import { Auth } from './components/Auth';
import { Profile } from './components/Profile';
import { VenuePicker } from './components/VenuePicker';
import { ClubDashboard } from './components/ClubDashboard';
import { TournamentSection } from './components/TournamentSection';
import { PointsLeaderboard } from './components/PointsLeaderboard';
import { OnboardingModal } from './components/OnboardingModal';
import { api } from './services/api';
import { PRICING_OPTIONS, DEFAULT_DURATION } from './constants';
const App = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [view, setView] = useState('venues');
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [users, setUsers] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [tournaments, setTournaments] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [pricing, setPricing] = useState(PRICING_OPTIONS);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [lastBooking, setLastBooking] = useState(null);
    const [creationError, setCreationError] = useState(null);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // ---- Carga inicial de datos desde el backend -----------
    const fetchData = useCallback(async () => {
        if (!localStorage.getItem('authToken'))
            return;
        setIsLoading(true);
        try {
            const [fetchedUsers, fetchedClubs, fetchedTournaments, fetchedBookings] = await Promise.all([
                api.get('/users'),
                api.get('/clubs'),
                api.get('/tournaments'),
                api.get('/bookings'),
            ]);
            setUsers(fetchedUsers);
            setClubs(fetchedClubs);
            setTournaments(fetchedTournaments);
            setBookings(fetchedBookings);
        }
        catch (err) {
            // Token expirado u otro error → logout
            handleLogout();
        }
        finally {
            setIsLoading(false);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (currentUser)
            fetchData();
    }, [currentUser, fetchData]);
    // ---- Autenticación ------------------------------------
    const handleLogin = (user) => {
        setCurrentUser(user);
        if (user.isNewUser)
            setShowOnboarding(true);
        setView('venues');
        toast.success(`¡Bienvenido, ${user.name}!`);
    };
    const handleLogout = () => {
        setCurrentUser(null);
        setSelectedVenue(null);
        localStorage.removeItem('authToken');
        setView('venues');
    };
    // ---- Perfil ------------------------------------------
    const handleUpdateUser = async (updatedUser) => {
        try {
            const saved = await api.put('/users/me', {
                name: updatedUser.name,
                avatar: updatedUser.avatar,
                zone: updatedUser.zone,
            });
            setCurrentUser(saved);
            setUsers((prev) => prev.map((u) => (u.id === saved.id ? saved : u)));
            toast.success('¡Perfil actualizado!');
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : 'Error al actualizar el perfil.');
        }
    };
    const handleAddFriend = async (padelTag) => {
        try {
            const updated = await api.post('/users/me/friends', { padelTag });
            setCurrentUser(updated);
            toast.success('Amigo añadido.');
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : 'Error al añadir amigo.');
        }
    };
    const handleRemoveFriend = async (friendId) => {
        try {
            const updated = await api.delete(`/users/me/friends/${friendId}`);
            setCurrentUser(updated);
        }
        catch {
            toast.error('No se pudo eliminar el amigo.');
        }
    };
    // ---- Venue -------------------------------------------
    const handleSelectVenue = (venue) => {
        setSelectedVenue(venue);
        setView('list');
    };
    // ---- Torneos -----------------------------------------
    const handleJoinTournament = async (tournamentId) => {
        try {
            const updated = await api.post(`/tournaments/${tournamentId}/join`, {});
            setTournaments((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
            const name = updated.name;
            toast.success(`Te inscribiste al torneo: ${name}`);
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : 'Error al inscribirse.');
        }
    };
    // ---- Clubs -------------------------------------------
    const handleUpdateClubs = (updatedClubs) => setClubs(updatedClubs);
    // ---- Reservas ----------------------------------------
    const handleDateChange = useCallback((date) => {
        setSelectedDate(date);
        setSelectedTime(null);
    }, []);
    const handleTimeSelect = useCallback((time) => {
        setSelectedTime(time);
        setCreationError(null);
    }, []);
    const handleCreateBooking = async (formData) => {
        setIsSubmitting(true);
        setCreationError(null);
        try {
            let payload;
            if ('players' in formData && !('venueId' in formData)) {
                // Viene del formulario del jugador
                if (!selectedTime || !currentUser || !selectedVenue)
                    return;
                const playerList = formData.visibility === 'private'
                    ? [currentUser.name, ...formData.players.filter((p) => p.trim())]
                    : [currentUser.name];
                payload = {
                    venueId: selectedVenue.id,
                    date: selectedDate.toISOString().split('T')[0],
                    time: selectedTime,
                    duration: DEFAULT_DURATION,
                    price: pricing[DEFAULT_DURATION].price,
                    level: formData.level,
                    notes: formData.notes,
                    organizer: currentUser.name,
                    players: playerList,
                    visibility: formData.visibility,
                    type: formData.type,
                };
            }
            else {
                // Viene del panel de admin
                payload = formData;
            }
            const newBooking = await api.post('/bookings', payload);
            setBookings((prev) => [...prev, newBooking]);
            setLastBooking(newBooking);
            if (currentUser?.role === 'player') {
                setShowConfirmation(true);
                setView('my-bookings');
                toast.success(`Cancha reservada para el ${newBooking.date} a las ${newBooking.time} hs.`);
            }
            else {
                toast.success('Reserva creada con éxito.');
            }
            setSelectedTime(null);
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'No se pudo crear la reserva.';
            setCreationError(msg);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleUpdateBooking = async (updatedBooking) => {
        try {
            const saved = await api.put(`/bookings/${updatedBooking.id}`, updatedBooking);
            setBookings((prev) => prev.map((b) => (b.id === saved.id ? saved : b)));
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : 'Error al actualizar la reserva.');
        }
    };
    const handleDeleteBooking = async (bookingId) => {
        if (!window.confirm('¿Estás seguro de que querés eliminar esta reserva?'))
            return;
        try {
            await api.delete(`/bookings/${bookingId}`);
            setBookings((prev) => prev.filter((b) => b.id !== bookingId));
            toast.success('Reserva eliminada.');
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : 'Error al eliminar la reserva.');
        }
    };
    const handleJoinBooking = async (bookingId) => {
        try {
            const updated = await api.post(`/bookings/${bookingId}/join`, {});
            setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
            toast.success(`Te uniste a la reserva de ${updated.organizer}.`);
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : 'No pudiste unirte.');
        }
    };
    const handleLeaveBooking = async (bookingId) => {
        try {
            const updated = await api.post(`/bookings/${bookingId}/leave`, {});
            setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : 'Error al abandonar la reserva.');
        }
    };
    const handleKickPlayer = (bookingId, playerName) => {
        // Por simplicidad, esta operación se maneja localmente y se sincroniza vía PUT
        const booking = bookings.find((b) => b.id === bookingId);
        if (!booking)
            return;
        handleUpdateBooking({
            ...booking,
            players: booking.players.filter((p) => p !== playerName),
        });
    };
    const handleInvitePlayer = (bookingId) => {
        const playerName = window.prompt('¿A quién querés invitar?');
        if (!playerName?.trim())
            return;
        const booking = bookings.find((b) => b.id === bookingId);
        if (!booking || booking.players.length >= 4)
            return;
        handleUpdateBooking({ ...booking, players: [...booking.players, playerName.trim()] });
    };
    const handleAwardPoints = async (bookingId, winners) => {
        try {
            const { booking: updatedBooking, pointsAwarded } = await api.post(`/bookings/${bookingId}/award`, { winners });
            setBookings((prev) => prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)));
            // Refrescar usuarios para que los puntos se actualicen en el ranking
            const freshUsers = await api.get('/users');
            setUsers(freshUsers);
            toast.success(`¡${pointsAwarded} puntos otorgados a los ganadores!`);
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : 'Error al cargar resultado.');
        }
    };
    const handlePricingUpdate = (newPricing) => {
        setPricing(newPricing);
        toast.success('¡Tarifas actualizadas!');
    };
    // ---- Derivados -----------------------------------------
    const { publicBookings, myBookings, bookedSlots } = useMemo(() => {
        const slots = {};
        const pub = [];
        const mine = [];
        for (const b of bookings) {
            if (!slots[b.venueId])
                slots[b.venueId] = {};
            if (!slots[b.venueId][b.date])
                slots[b.venueId][b.date] = [];
            slots[b.venueId][b.date].push(b.time);
            if (currentUser && b.players.includes(currentUser.name))
                mine.push(b);
            if (b.visibility === 'public' && (!selectedVenue || b.venueId === selectedVenue.id)) {
                pub.push(b);
            }
        }
        return { publicBookings: pub, myBookings: mine, bookedSlots: slots };
    }, [bookings, currentUser, selectedVenue]);
    // ---- Render --------------------------------------------
    if (!currentUser) {
        return _jsx(Auth, { onLogin: handleLogin });
    }
    return (_jsxs("div", { className: "min-h-screen bg-slate-50", children: [_jsx(Toaster, { position: "bottom-right", toastOptions: { duration: 3500 } }), _jsx(Header, { user: currentUser, onLogout: handleLogout, onProfileClick: () => setView('profile'), onViewChange: setView, currentView: view }), _jsxs("main", { className: "container mx-auto p-4 md:p-8", children: [isLoading && (_jsx("div", { className: "fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50", children: _jsxs("div", { className: "flex flex-col items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" }), _jsx("p", { className: "text-slate-600 font-medium", children: "Cargando..." })] }) })), currentUser.role === 'owner' ? (_jsx(AdminDashboard, { bookings: bookings, pricing: pricing, onUpdateBooking: handleUpdateBooking, onDeleteBooking: handleDeleteBooking, onCreateBooking: handleCreateBooking, onUpdatePricing: handlePricingUpdate })) : (_jsxs("div", { className: "max-w-6xl mx-auto", children: [view === 'profile' && (_jsx(Profile, { user: currentUser, allUsers: users, onUpdateUser: handleUpdateUser, onAddFriend: handleAddFriend, onRemoveFriend: handleRemoveFriend, onBack: () => setView('list') })), view === 'venues' && (_jsx(VenuePicker, { selectedVenueId: selectedVenue?.id ?? null, onSelectVenue: handleSelectVenue })), view === 'clubs' && (_jsx(ClubDashboard, { currentUser: currentUser, clubs: clubs, users: users, onUpdateUser: setCurrentUser, onUpdateClubs: handleUpdateClubs })), view === 'tournaments' && (_jsx(TournamentSection, { tournaments: tournaments, currentUserId: currentUser.id, onJoinTournament: handleJoinTournament })), view === 'leaderboard' && (_jsx(PointsLeaderboard, { users: users, clubs: clubs })), (view === 'list' || view === 'my-bookings' || view === 'create') && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-black text-slate-900 tracking-tight", children: selectedVenue ? selectedVenue.name : 'Seleccioná un Club' }), _jsx("p", { className: "text-slate-500 text-sm", children: selectedVenue?.address })] }), _jsx("button", { onClick: () => setView('venues'), className: "bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm", children: "Cambiar Club" })] }), _jsx("div", { className: "mb-6", children: _jsx("div", { className: "flex border-b border-slate-200 overflow-x-auto no-scrollbar", children: [
                                                { id: 'list', label: 'Buscar Partidos' },
                                                { id: 'create', label: 'Reservar Cancha' },
                                                { id: 'my-bookings', label: 'Mis Reservas' },
                                            ].map((tab) => (_jsx("button", { onClick: () => setView(tab.id), className: `px-4 py-3 font-semibold whitespace-nowrap transition-colors duration-200 ${view === tab.id
                                                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                                                    : 'text-slate-500 hover:text-slate-700'}`, children: tab.label }, tab.id))) }) }), view === 'list' && (_jsx(BookingList, { bookings: publicBookings, onJoinBooking: handleJoinBooking, onLeaveBooking: handleLeaveBooking, onKickPlayer: handleKickPlayer, onInvitePlayer: handleInvitePlayer, onAwardPoints: handleAwardPoints, currentUser: currentUser })), view === 'my-bookings' && (_jsx(BookingList, { bookings: myBookings, onJoinBooking: handleJoinBooking, onLeaveBooking: handleLeaveBooking, onKickPlayer: handleKickPlayer, onInvitePlayer: handleInvitePlayer, onAwardPoints: handleAwardPoints, currentUser: currentUser })), view === 'create' && (_jsxs("div", { className: "space-y-8 animate-fade-in", children: [_jsxs("div", { className: "bg-white p-6 rounded-xl shadow-lg", children: [_jsx("h2", { className: "text-xl font-bold text-slate-800 mb-4", children: "1. Eleg\u00ED fecha y hora" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsx(Calendar, { selectedDate: selectedDate, onDateChange: handleDateChange }), _jsx(TimeSlotGrid, { selectedTime: selectedTime, onTimeSelect: handleTimeSelect, bookedSlots: selectedVenue
                                                                    ? (bookedSlots[selectedVenue.id]?.[selectedDate.toISOString().split('T')[0]] ?? [])
                                                                    : [] }, selectedDate.toISOString())] })] }), selectedTime && (_jsxs("div", { className: "bg-white p-6 rounded-xl shadow-lg animate-fade-in-up", children: [_jsx("h2", { className: "text-xl font-bold text-slate-800 mb-2", children: "2. Complet\u00E1 los detalles" }), _jsxs("p", { className: "text-slate-500 mb-6", children: ["Reservando para el", ' ', _jsx("span", { className: "font-semibold text-indigo-600", children: selectedDate.toLocaleDateString('es-ES', {
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                }) }), ' ', "a las", ' ', _jsxs("span", { className: "font-semibold text-indigo-600", children: [selectedTime, " hs"] }), "."] }), _jsx(CreateBookingForm, { onSubmit: handleCreateBooking, isSubmitting: isSubmitting, error: creationError, currentUser: currentUser })] }))] }))] }))] }))] }), showConfirmation && lastBooking && (_jsx(ConfirmationModal, { booking: lastBooking, onClose: () => {
                    setShowConfirmation(false);
                    setLastBooking(null);
                } })), showOnboarding && _jsx(OnboardingModal, { onClose: () => setShowOnboarding(false) })] }));
};
export default App;
