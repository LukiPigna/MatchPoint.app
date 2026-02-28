import React from 'react';

interface OnboardingModalProps {
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full transform transition-all duration-300 scale-95 hover:scale-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">¡Bienvenido a Padel Indoor Club!</h2>
        <p className="text-slate-600 mb-6">Aquí tienes una guía rápida para empezar:</p>
        
        <ul className="space-y-4 text-slate-700">
          <li className="flex items-start">
            <span className="bg-indigo-100 text-indigo-600 rounded-full h-6 w-6 text-xs font-bold flex items-center justify-center mr-3 mt-1">1</span>
            <div>
              <h3 className="font-semibold">Busca y Únete a Partidos</h3>
              <p className="text-sm text-slate-500">Ve a "Buscar Partidos" para ver las reservas públicas. ¡Si hay un lugar libre, puedes unirte con un solo clic!</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-indigo-100 text-indigo-600 rounded-full h-6 w-6 text-xs font-bold flex items-center justify-center mr-3 mt-1">2</span>
            <div>
              <h3 className="font-semibold">Crea Tus Propias Reservas</h3>
              <p className="text-sm text-slate-500">En "Reservar Cancha", elige fecha y hora. Puedes hacerla pública para que otros se unan o privada para tus amigos.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-indigo-100 text-indigo-600 rounded-full h-6 w-6 text-xs font-bold flex items-center justify-center mr-3 mt-1">3</span>
            <div>
              <h3 className="font-semibold">Sistema de Puntos</h3>
              <p className="text-sm text-slate-500">Gana puntos al ganar partidos. Los partidos "Competitivos" otorgan más puntos. ¡Sube en el ranking y demuestra quién es el mejor!</p>
            </div>
          </li>
        </ul>

        <button 
          onClick={onClose}
          className="w-full mt-8 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
        >
          ¡Entendido, a jugar!
        </button>
      </div>
    </div>
  );
};
