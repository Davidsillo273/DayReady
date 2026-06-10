import React, { useState } from 'react';
import logo from '../imgs/DayReadyLogo.png';

export default function Navbar({ onCartClick, onWalletClick, onProfileClick }) {
  const [isLocalsOpen, setIsLocalsOpen] = useState(false);
  const [selectedLocal, setSelectedLocal] = useState("Todos los locales");

  const locales = ["Todos los locales", "Local Azul", "Local Amarillo", "Local Verde"];

  return (
    <nav className="flex items-center justify-between px-8 py-3 bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center gap-6">

        {/* LOGO MÁS GRANDE */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="DayFood Logo"
            className="h-25 w-auto object-contain transition-transform hover:scale-105 cursor-pointer"
          />
        </div>

        {/* MENÚ DESPLEGABLE DE LOCALES */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setIsLocalsOpen(!isLocalsOpen)}
            className="flex items-center gap-2 text-gray-600 text-sm bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-xl border border-gray-100 transition-colors"
          >
            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            <span className="font-medium">{selectedLocal}</span>
            <svg className={`w-4 h-4 transition-transform ${isLocalsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </button>

          {/* VENTANITA DEL MENÚ */}
          {isLocalsOpen && (
            <div className="absolute top-full mt-2 left-0 w-48 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50">
              {locales.map((local) => (
                <div
                  key={local}
                  onClick={() => {
                    setSelectedLocal(local);
                    setIsLocalsOpen(false);
                  }}
                  className={`px-4 py-3 text-sm cursor-pointer hover:bg-orange-50 hover:text-orange-600 transition-colors ${selectedLocal === local ? 'bg-orange-50 text-orange-600 font-bold' : 'text-gray-600'}`}
                >
                  {local}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
          <input
            type="text"
            placeholder="Buscar comida, bebida..."
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-200 transition text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div onClick={onWalletClick} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-bold cursor-pointer transition-colors text-sm shadow-sm">
          Saldo: $15.50
        </div>

        <button onClick={onCartClick} className="relative p-2 hover:bg-gray-100 rounded-full transition-colors border-none bg-transparent">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold border-2 border-white">2</span>
        </button>

        <div onClick={onProfileClick} className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-bold border border-orange-200 cursor-pointer hover:bg-orange-200 transition shadow-sm">
          DE
        </div>
      </div>
    </nav>
  );
}