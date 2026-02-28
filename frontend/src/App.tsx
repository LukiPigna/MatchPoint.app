// ============================================================
// App.tsx - Componente raíz
// Autor: Lucas Pignataro
// ============================================================

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

import { Header } from './components/Header';
import { Calendar } from './components/Calendar';
import { TimeSlotGrid } from './components/TimeSlotGrid';
import { CreateBookingForm, CreateBookingFormData } from './components/CreateBookingForm';
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

import { Booking, BookedSlots, User, Club, Tournament, Venue, AppView } from './types/index';
import { api } from './services/api';
import { PRICING_OPTIONS, DEFAULT_DURATION } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser]     = useState<User | null>(null);
  const [view, setView]                   = useState<AppView>('venues');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const [users, setUsers]             = useState<User[]>([]);
  const [clubs, setClubs]             = useState<Club[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [bookings, setBookings]       = useState<Booking[]>([]);

  const [pricing, setPricing]           = useState(PRICING_OPTIONS);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastBooking, setLastBooking]   = useState<Booking | null>(null);
  const [creationError, setCreationError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);

  // ---- Carga inicial de datos desde el backend -----------
  const fetchData = useCallback(async () => {
    if (!localStorage.getItem('authToken')) return;
    setIsLoading(true);
    try {
      const [fetchedUsers, fetchedClubs, fetchedTournaments, fetchedBookings] =
        await Promise.all([
          api.get<User[]>('/users'),
          api.get<Club[]>('/clubs'),
          api.get<Tournament[]>('/tournaments'),
          api.get<Booking[]>('/bookings'),
        ]);
      setUsers(fetchedUsers);
      setClubs(fetchedClubs);
      setTournaments(fetchedTournaments);
      setBookings(fetchedBookings);
    } catch (err) {
      // Token expirado u otro error → logout
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (currentUser) fetchData();
  }, [currentUser, fetchData]);

  // ---- Autenticación ------------------------------------
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.isNewUser) setShowOnboarding(true);
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
  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const saved = await api.put<User>('/users/me', {
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        zone: updatedUser.zone,
      });
      setCurrentUser(saved);
      setUsers((prev) => prev.map((u) => (u.id === saved.id ? saved : u)));
      toast.success('¡Perfil actualizado!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al actualizar el perfil.');
    }
  };

  const handleAddFriend = async (padelTag: string) => {
    try {
      const updated = await api.post<User>('/users/me/friends', { padelTag });
      setCurrentUser(updated);
      toast.success('Amigo añadido.');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al añadir amigo.');
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      const updated = await api.delete<User>(`/users/me/friends/${friendId}`);
      setCurrentUser(updated);
    } catch {
      toast.error('No se pudo eliminar el amigo.');
    }
  };

  // ---- Venue -------------------------------------------
  const handleSelectVenue = (venue: Venue) => {
    setSelectedVenue(venue);
    setView('list');
  };

  // ---- Torneos -----------------------------------------
  const handleJoinTournament = async (tournamentId: string) => {
    try {
      const updated = await api.post<Tournament>(`/tournaments/${tournamentId}/join`, {});
      setTournaments((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      const name = updated.name;
      toast.success(`Te inscribiste al torneo: ${name}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al inscribirse.');
    }
  };

  // ---- Clubs -------------------------------------------
  const handleUpdateClubs = (updatedClubs: Club[]) => setClubs(updatedClubs);

  // ---- Reservas ----------------------------------------
  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  }, []);

  const handleTimeSelect = useCallback((time: string) => {
    setSelectedTime(time);
    setCreationError(null);
  }, []);

  const handleCreateBooking = async (formData: CreateBookingFormData | Omit<Booking, 'id'>) => {
    setIsSubmitting(true);
    setCreationError(null);

    try {
      let payload: Omit<Booking, 'id'>;

      if ('players' in formData && !('venueId' in formData)) {
        // Viene del formulario del jugador
        if (!selectedTime || !currentUser || !selectedVenue) return;
        const playerList =
          formData.visibility === 'private'
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
      } else {
        // Viene del panel de admin
        payload = formData as Omit<Booking, 'id'>;
      }

      const newBooking = await api.post<Booking>('/bookings', payload);
      setBookings((prev) => [...prev, newBooking]);
      setLastBooking(newBooking);

      if (currentUser?.role === 'player') {
        setShowConfirmation(true);
        setView('my-bookings');
        toast.success(`Cancha reservada para el ${newBooking.date} a las ${newBooking.time} hs.`);
      } else {
        toast.success('Reserva creada con éxito.');
      }
      setSelectedTime(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo crear la reserva.';
      setCreationError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBooking = async (updatedBooking: Booking) => {
    try {
      const saved = await api.put<Booking>(`/bookings/${updatedBooking.id}`, updatedBooking);
      setBookings((prev) => prev.map((b) => (b.id === saved.id ? saved : b)));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al actualizar la reserva.');
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!window.confirm('¿Estás seguro de que querés eliminar esta reserva?')) return;
    try {
      await api.delete(`/bookings/${bookingId}`);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      toast.success('Reserva eliminada.');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar la reserva.');
    }
  };

  const handleJoinBooking = async (bookingId: string) => {
    try {
      const updated = await api.post<Booking>(`/bookings/${bookingId}/join`, {});
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      toast.success(`Te uniste a la reserva de ${updated.organizer}.`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'No pudiste unirte.');
    }
  };

  const handleLeaveBooking = async (bookingId: string) => {
    try {
      const updated = await api.post<Booking>(`/bookings/${bookingId}/leave`, {});
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al abandonar la reserva.');
    }
  };

  const handleKickPlayer = (bookingId: string, playerName: string) => {
    // Por simplicidad, esta operación se maneja localmente y se sincroniza vía PUT
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;
    handleUpdateBooking({
      ...booking,
      players: booking.players.filter((p) => p !== playerName),
    });
  };

  const handleInvitePlayer = (bookingId: string) => {
    const playerName = window.prompt('¿A quién querés invitar?');
    if (!playerName?.trim()) return;
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking || booking.players.length >= 4) return;
    handleUpdateBooking({ ...booking, players: [...booking.players, playerName.trim()] });
  };

  const handleAwardPoints = async (bookingId: string, winners: string[]) => {
    try {
      const { booking: updatedBooking, pointsAwarded } = await api.post<{
        booking: Booking;
        pointsAwarded: number;
      }>(`/bookings/${bookingId}/award`, { winners });

      setBookings((prev) => prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)));

      // Refrescar usuarios para que los puntos se actualicen en el ranking
      const freshUsers = await api.get<User[]>('/users');
      setUsers(freshUsers);

      toast.success(`¡${pointsAwarded} puntos otorgados a los ganadores!`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al cargar resultado.');
    }
  };

  const handlePricingUpdate = (newPricing: typeof PRICING_OPTIONS) => {
    setPricing(newPricing);
    toast.success('¡Tarifas actualizadas!');
  };

  // ---- Derivados -----------------------------------------
  const { publicBookings, myBookings, bookedSlots } = useMemo(() => {
    const slots: BookedSlots = {};
    const pub: Booking[] = [];
    const mine: Booking[] = [];

    for (const b of bookings) {
      if (!slots[b.venueId]) slots[b.venueId] = {};
      if (!slots[b.venueId][b.date]) slots[b.venueId][b.date] = [];
      slots[b.venueId][b.date].push(b.time);

      if (currentUser && b.players.includes(currentUser.name)) mine.push(b);
      if (b.visibility === 'public' && (!selectedVenue || b.venueId === selectedVenue.id)) {
        pub.push(b);
      }
    }

    return { publicBookings: pub, myBookings: mine, bookedSlots: slots };
  }, [bookings, currentUser, selectedVenue]);

  // ---- Render --------------------------------------------
  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="bottom-right" toastOptions={{ duration: 3500 }} />

      <Header
        user={currentUser}
        onLogout={handleLogout}
        onProfileClick={() => setView('profile')}
        onViewChange={setView}
        currentView={view}
      />

      <main className="container mx-auto p-4 md:p-8">
        {isLoading && (
          <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-600 font-medium">Cargando...</p>
            </div>
          </div>
        )}

        {currentUser.role === 'owner' ? (
          <AdminDashboard
            bookings={bookings}
            pricing={pricing}
            onUpdateBooking={handleUpdateBooking}
            onDeleteBooking={handleDeleteBooking}
            onCreateBooking={handleCreateBooking}
            onUpdatePricing={handlePricingUpdate}
          />
        ) : (
          <div className="max-w-6xl mx-auto">
            {view === 'profile' && (
              <Profile
                user={currentUser}
                allUsers={users}
                onUpdateUser={handleUpdateUser}
                onAddFriend={handleAddFriend}
                onRemoveFriend={handleRemoveFriend}
                onBack={() => setView('list')}
              />
            )}

            {view === 'venues' && (
              <VenuePicker
                selectedVenueId={selectedVenue?.id ?? null}
                onSelectVenue={handleSelectVenue}
              />
            )}

            {view === 'clubs' && (
              <ClubDashboard
                currentUser={currentUser}
                clubs={clubs}
                users={users}
                onUpdateUser={setCurrentUser}
                onUpdateClubs={handleUpdateClubs}
              />
            )}

            {view === 'tournaments' && (
              <TournamentSection
                tournaments={tournaments}
                currentUserId={currentUser.id}
                onJoinTournament={handleJoinTournament}
              />
            )}

            {view === 'leaderboard' && (
              <PointsLeaderboard users={users} clubs={clubs} />
            )}

            {(view === 'list' || view === 'my-bookings' || view === 'create') && (
              <>
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      {selectedVenue ? selectedVenue.name : 'Seleccioná un Club'}
                    </h2>
                    <p className="text-slate-500 text-sm">{selectedVenue?.address}</p>
                  </div>
                  <button
                    onClick={() => setView('venues')}
                    className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    Cambiar Club
                  </button>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                  <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
                    {[
                      { id: 'list',        label: 'Buscar Partidos' },
                      { id: 'create',      label: 'Reservar Cancha' },
                      { id: 'my-bookings', label: 'Mis Reservas' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setView(tab.id as AppView)}
                        className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors duration-200 ${
                          view === tab.id
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {view === 'list' && (
                  <BookingList
                    bookings={publicBookings}
                    onJoinBooking={handleJoinBooking}
                    onLeaveBooking={handleLeaveBooking}
                    onKickPlayer={handleKickPlayer}
                    onInvitePlayer={handleInvitePlayer}
                    onAwardPoints={handleAwardPoints}
                    currentUser={currentUser}
                  />
                )}

                {view === 'my-bookings' && (
                  <BookingList
                    bookings={myBookings}
                    onJoinBooking={handleJoinBooking}
                    onLeaveBooking={handleLeaveBooking}
                    onKickPlayer={handleKickPlayer}
                    onInvitePlayer={handleInvitePlayer}
                    onAwardPoints={handleAwardPoints}
                    currentUser={currentUser}
                  />
                )}

                {view === 'create' && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <h2 className="text-xl font-bold text-slate-800 mb-4">
                        1. Elegí fecha y hora
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Calendar
                          selectedDate={selectedDate}
                          onDateChange={handleDateChange}
                        />
                        <TimeSlotGrid
                          key={selectedDate.toISOString()}
                          selectedTime={selectedTime}
                          onTimeSelect={handleTimeSelect}
                          bookedSlots={
                            selectedVenue
                              ? (bookedSlots[selectedVenue.id]?.[
                                  selectedDate.toISOString().split('T')[0]
                                ] ?? [])
                              : []
                          }
                        />
                      </div>
                    </div>

                    {selectedTime && (
                      <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in-up">
                        <h2 className="text-xl font-bold text-slate-800 mb-2">
                          2. Completá los detalles
                        </h2>
                        <p className="text-slate-500 mb-6">
                          Reservando para el{' '}
                          <span className="font-semibold text-indigo-600">
                            {selectedDate.toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                            })}
                          </span>{' '}
                          a las{' '}
                          <span className="font-semibold text-indigo-600">
                            {selectedTime} hs
                          </span>
                          .
                        </p>
                        <CreateBookingForm
                          onSubmit={handleCreateBooking}
                          isSubmitting={isSubmitting}
                          error={creationError}
                          currentUser={currentUser}
                        />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {showConfirmation && lastBooking && (
        <ConfirmationModal
          booking={lastBooking}
          onClose={() => {
            setShowConfirmation(false);
            setLastBooking(null);
          }}
        />
      )}

      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
    </div>
  );
};

export default App;
