import React, { useState } from 'react';

export default function CheckoutModal({ isOpen, onClose }) {
  const [method, setMethod] = useState('wallet'); 

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-t-[32px] md:rounded-[32px] shadow-xl border border-gray-100 p-8 animate-in slide-in-from-bottom-full duration-500">
        
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Finalizar Pedido</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* Resumen de orden */}
        <div className="bg-slate-50 rounded-2xl p-5 mb-8 flex justify-between items-center border border-slate-100">
            <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total a pagar</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">$10.75</p>
            </div>
            <div className="text-right">
                <p className="text-xs font-medium text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-100">3 Productos</p>
            </div>
        </div>

        <h4 className="font-semibold text-gray-800 mb-4 text-sm">Método de pago</h4>
        
        <div className="space-y-3 mb-8">
            {/* Opción Wallet */}
            <div 
                onClick={() => setMethod('wallet')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${method === 'wallet' ? 'border-slate-800 bg-slate-50/50' : 'border-gray-100 hover:border-gray-200'}`}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${method === 'wallet' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-gray-400 border-gray-100'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 text-sm">DayWallet</p>
                        <p className="text-[11px] text-emerald-600 font-medium">Saldo: $15.50</p>
                    </div>
                </div>
                {method === 'wallet' && <div className="w-4 h-4 bg-slate-800 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>}
            </div>

            {/* Opción Tarjeta */}
            <div 
                onClick={() => setMethod('card')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${method === 'card' ? 'border-slate-800 bg-slate-50/50' : 'border-gray-100 hover:border-gray-200'}`}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${method === 'card' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-gray-400 border-gray-100'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 text-sm">Tarjeta de Crédito/Débito</p>
                        <p className="text-[11px] text-gray-400 font-medium">Visa, Mastercard</p>
                    </div>
                </div>
                {method === 'card' && <div className="w-4 h-4 bg-slate-800 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>}
            </div>
        </div>

        {/* Botón Principal más neutro y premium */}
        <button className="w-full bg-slate-800 text-white py-4 rounded-2xl font-semibold shadow-md hover:bg-slate-900 transition-all active:scale-[0.98] text-sm">
            {method === 'wallet' ? 'Pagar con DayWallet' : 'Continuar con Tarjeta'}
        </button>
      </div>
    </div>
  );
}