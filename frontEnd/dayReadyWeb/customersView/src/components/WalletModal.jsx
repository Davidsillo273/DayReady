import React from 'react';

export default function WalletModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-[32px] shadow-xl border border-gray-100 p-8 animate-in slide-in-from-bottom-10 duration-300">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">DayWallet</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* Tarjeta de Saldo (Estilo Pastel) */}
        <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-[24px] p-6 text-emerald-900 mb-8 relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-emerald-700/80 text-xs font-semibold uppercase tracking-wider mb-1">Tu Saldo Disponible</p>
                <h3 className="text-4xl font-black text-emerald-950">$15.50</h3>
            </div>
            <svg className="absolute -right-4 -bottom-4 w-32 h-32 text-emerald-100/50" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.82v-1.91c-1.57-.33-3.13-1.12-3.66-2.09l1.66-1.11c.36.63 1.15 1.12 2 1.34v-3.41c-1.63-.44-3.52-1.07-3.52-3.14 0-1.79 1.4-3 3.11-3.37V5h2.82v1.9c1.47.28 2.72.93 3.32 1.83l-1.63 1.14c-.38-.56-1.09-.94-1.69-1.11v3.2c1.94.55 3.52 1.25 3.52 3.38 0 1.94-1.46 3.19-3.41 3.45z"/></svg>
        </div>

        {/* Instrucciones de Recarga (Tonos neutros) */}
        <div className="space-y-6">
            <div>
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-sm">
                    ¿Cómo recargar?
                </h4>
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex gap-4 items-start">
                        <div className="bg-slate-50 text-slate-500 border border-slate-100 w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm">1</div>
                        <p className="text-sm text-gray-600 font-medium mt-1.5">Acércate a cualquier local de comida.</p>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="bg-slate-50 text-slate-500 border border-slate-100 w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm">2</div>
                        <p className="text-sm text-gray-600 font-medium mt-1.5">Muestra tu código ID o usuario.</p>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="bg-slate-50 text-slate-500 border border-slate-100 w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm">3</div>
                        <p className="text-sm text-gray-600 font-medium mt-1.5">Entrega el efectivo y ¡listo!</p>
                    </div>
                </div>
            </div>
            
            <button className="w-full bg-slate-800 text-white py-4 rounded-2xl font-semibold hover:bg-slate-900 transition shadow-sm text-sm">
                Ver Historial de Recargas
            </button>
        </div>
      </div>
    </div>
  );
}