import React from 'react';

export default function HelpView({ onBack }) {
  return (
    <div className="p-8 flex flex-col h-full w-full">
      <button onClick={onBack} className="mb-6 text-slate-400 font-bold text-xs uppercase flex items-center gap-2 hover:text-slate-600 transition">
        ← Volver
      </button>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Centro de Ayuda</h2>

      <div className="space-y-4 flex-grow">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-1">¿Cómo recargo mi DayWallet?</h3>
          <p className="text-xs text-slate-500">Puedes recargar en cualquier punto de venta físico del instituto indicando tu ID de usuario.</p>
        </div>
        
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Tuve un problema con mi pedido</h3>
          <p className="text-xs text-slate-500">Acércate al mostrador con tu número de orden o contáctanos a soporte.</p>
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-800 py-4 rounded-2xl font-semibold hover:bg-slate-200 transition text-sm mt-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          Contactar Soporte
        </button>
      </div>
    </div>
  );
}
