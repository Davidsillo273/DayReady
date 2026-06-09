import React from 'react';

export default function Nav() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-orange-400">D</span>
              <span className="text-2xl font-bold text-orange-400">Y</span>
              <span className="text-orange-400 text-xs font-semibold">READY</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-600 hover:text-orange-400">
              Inicio
            </a>
            <a href="#" className="text-gray-600 hover:text-orange-400">
              Contacto
            </a>
            <button className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500">
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
