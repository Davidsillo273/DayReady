import React from 'react';

export default function CartSidebar({ isOpen, onClose, onCheckout }) {
    if (!isOpen) return null;

    return (
        <>
            {/* Fondo oscuro */}
            <div className="fixed inset-0 bg-black/40 z-40 transition-opacity" onClick={onClose} />

            {/* Panel lateral */}
            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300">

                {/* Header del carrito */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        🛒 Tu Pedido
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Lista de productos (Ejemplo estático) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    <div className="flex gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <h4 className="font-bold text-gray-800">1x Hamburguesa Clásica</h4>
                                <span className="font-bold text-gray-800">$3.50</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">+ Papas fritas medianas</p>
                            <button className="text-xs text-red-500 mt-2 hover:underline">Eliminar</button>
                        </div>
                    </div>

                </div>

                {/* Resumen y Pago */}
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>$3.50</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                            <span>Descuento DayWallet</span>
                            <span>-$0.50</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg text-gray-800 mt-2 pt-2 border-t border-gray-200">
                            <span>Total a pagar</span>
                            <span>$3.00</span>
                        </div>
                    </div>

                    <button
                        onClick={onCheckout}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition shadow-md active:scale-95"
                    >
                        Ir a Pagar
                    </button>
                </div>

            </div>
        </>
    );
}