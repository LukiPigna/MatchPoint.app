import React, { useState } from 'react';
import { User } from '../types/index';
import { api } from '../services/api';
import { ZONES } from '../constants';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin]               = useState(true);
  const [name, setName]                     = useState('');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [zone, setZone]                     = useState<string>('Norte');
  const [showPassword, setShowPassword]     = useState(false);
  const [error, setError]                   = useState('');
  const [isSubmitting, setIsSubmitting]     = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const data = await api.auth.login<{ token: string; user: User }>({ email, password });
      localStorage.setItem('authToken', data.token);
      onLogin(data.user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setIsSubmitting(true);
    try {
      const data = await api.auth.register<{ token: string; user: User }>({
        name,
        email,
        password,
        zone,
      });
      localStorage.setItem('authToken', data.token);
      onLogin(data.user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrarse.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      {showPassword
        ? <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074L3.707 2.293z" clipRule="evenodd" />
        : <><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10z" clipRule="evenodd" /></>}
    </svg>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Imagen lateral */}
        <div className="hidden md:block md:w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1614008583226-358838059187?q=80&w=1887&auto=format&fit=crop"
            alt="Cancha de pádel"
            className="absolute h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
          <div className="absolute bottom-8 left-8 text-white">
            <p className="text-indigo-300 text-sm font-bold uppercase tracking-widest mb-2">
              Tu plataforma de pádel
            </p>
            <h1 className="text-4xl font-extrabold tracking-tighter leading-none">
              Reserva<br />Tu Cancha
            </h1>
            <p className="mt-3 text-slate-300 max-w-xs text-sm">
              Encontrá partidos, reservá canchas y competí con los mejores de tu zona.
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              {isLogin ? 'Iniciá sesión' : 'Creá tu cuenta'}
            </h2>

            {/* Toggle login/register */}
            <div className="flex rounded-lg border border-slate-300 p-1 mb-6">
              {(['login', 'register'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => { setIsLogin(mode === 'login'); setError(''); }}
                  className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${
                    (isLogin ? 'login' : 'register') === mode
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {mode === 'login' ? 'Ingresar' : 'Registrarse'}
                </button>
              ))}
            </div>

            <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-slate-100 text-slate-800 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
                />
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-100 text-slate-800 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
              />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-100 text-slate-800 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                >
                  <EyeIcon />
                </button>
              </div>

              {!isLogin && (
                <>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirmá la contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-100 text-slate-800 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
                  />
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-100 text-slate-800 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {ZONES.map((z) => (
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </select>
                </>
              )}

              {error && (
                <p className="text-red-500 text-sm text-center animate-fade-in">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Procesando...' : isLogin ? 'Ingresar' : 'Crear Cuenta'}
              </button>
            </form>

            {/* Hint de prueba */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500 font-semibold mb-1">Cuentas de prueba:</p>
              <p className="text-xs text-slate-500">🎾 ana@torres.com / u2password</p>
              <p className="text-xs text-slate-500">🛡️ carlos@rios.com / u1password (dueño)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
