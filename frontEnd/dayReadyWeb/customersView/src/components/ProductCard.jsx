import React from 'react';

export default function ProductCard({ title, price, location, category, image }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col">
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
        )}
        <div className="absolute top-3 left-3 px-3 py-1 bg-orange-500/90 backdrop-blur-sm text-white text-[10px] uppercase font-bold rounded-lg shadow-sm">
          {category}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-base leading-tight group-hover:text-orange-500 transition-colors">
          {title}
        </h3>
        
        {/* ÍCONO SVG EN LUGAR DE EMOJI */}
        <p className="text-gray-400 text-xs flex items-center gap-1.5 mt-2">
          <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {location}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4">
          <span className="text-lg font-black text-gray-800">${price.toFixed(2)}</span>
          <button className="bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95">
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}