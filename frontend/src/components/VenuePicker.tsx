
import React from 'react';
import { Venue } from '../types/index';
import { VENUES } from '../constants';

interface VenuePickerProps {
  selectedVenueId: string | null;
  onSelectVenue: (venue: Venue) => void;
}

export const VenuePicker: React.FC<VenuePickerProps> = ({ selectedVenueId, onSelectVenue }) => {
  return (
    <div className="py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Selecciona tu Club</h2>
          <p className="text-slate-500 mt-1">Encuentra las mejores canchas cerca de tu zona.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {VENUES.map((venue) => (
          <div 
            key={venue.id}
            onClick={() => onSelectVenue(venue)}
            className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${selectedVenueId === venue.id ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-transparent'}`}
          >
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={venue.image} 
                alt={venue.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center shadow-sm">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="text-sm font-bold text-slate-800">{venue.rating}</span>
              </div>
              <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {venue.zone}
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{venue.name}</h3>
              <p className="text-slate-500 text-sm mt-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {venue.address}
              </p>
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm text-slate-600 font-medium">{venue.courts} Canchas disponibles</span>
                <button className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedVenueId === venue.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                  {selectedVenueId === venue.id ? 'Seleccionado' : 'Ver Canchas'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
