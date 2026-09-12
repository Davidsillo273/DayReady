import React from 'react';
import { useCart } from '../context/CartContext';

export default function CartSidebar({ isOpen, onClose, onCheckout }) {
    // Los items ya traen su propio name/price/image (los guarda
    // CartContext al momento de agregarlos), así que aquí ya no hace
    // falta ir a buscar la info del producto en ningún lado.
    const { items, total, descuentos, totalFinal, removeFromCart, updateQuantity, loading } = useCart();

    if (!isOpen) return null;

    const isEmpty = items.length === 0;

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

                {/* Lista de productos */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {isEmpty ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 6h12l-2-6m0 0h2m-2 0h-2m2 0v2m-2-2v2" />
                            </svg>
                            <p className="text-center text-sm">Tu carrito está vacío</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.productoId} className="flex gap-4 pb-6 border-b border-gray-100">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                    {item.image && (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-sm">{item.name || 'Producto'}</h4>
                                            <p className="text-xs text-gray-500 mt-1">${item.price.toFixed(2)}</p>
                                        </div>
                                        <span className="font-bold text-gray-800 text-sm">${(item.price * item.cantidad).toFixed(2)}</span>
                                    </div>

                                    {/* Controles de cantidad */}
                                    <div className="flex items-center gap-2 mt-3">
                                        <button
                                            onClick={() => updateQuantity(item.productoId, item.cantidad - 1)}
                                            disabled={loading}
                                            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center text-sm font-bold">{item.cantidad}</span>
                                        <button
                                            onClick={() => updateQuantity(item.productoId, item.cantidad + 1)}
                                            disabled={loading}
                                            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => removeFromCart(item.productoId)}
                                            disabled={loading}
                                            className="text-xs text-red-500 ml-auto hover:underline disabled:opacity-50"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Resumen y Pago */}
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        {descuentos > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Descuento DayWallet</span>
                                <span>-${descuentos.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-lg text-gray-800 mt-2 pt-2 border-t border-gray-200">
                            <span>Total a pagar</span>
                            <span>${totalFinal.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        onClick={onCheckout}
                        disabled={isEmpty || loading}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Ir a Pagar
                    </button>
                </div>

            </div>
        </>
    );
}
