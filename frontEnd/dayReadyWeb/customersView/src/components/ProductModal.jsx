import React, { useState } from 'react';

export default function ProductModal({ isOpen, onClose, product }) {
  const [quantity, setQuantity] = useState(1);
  const [extras, setExtras] = useState({ papas: false, soda: false });

  if (!isOpen || !product) return null;

  // Calculamos el total dinámico basado en la cantidad y los extras
  const extrasTotal = (extras.papas ? 1.50 : 0) + (extras.soda ? 1.00 : 0);
  const total = ((product.price + extrasTotal) * quantity).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cabecera y Botón Cerrar */}
        <div className="relative">
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="h-48 bg-gray-200 w-full relative">
             {/* Aquí irá tu imagen: <img src={product.image} className="w-full h-full object-cover" /> */}
             <div className="absolute inset-0 flex items-center justify-center text-gray-400 italic">
               Imagen del producto ({product.title})
             </div>
          </div>
        </div>

        {/* Contenido (Hacemos que esta parte tenga scroll si es muy larga) */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <h2 className="text-2xl font-bold text-gray-800">{product.title}</h2>
          <p className="text-gray-500 text-sm mt-2">{product.description || 'Deliciosa opción preparada con ingredientes frescos y de alta calidad.'}</p>
          <p className="text-xl font-bold text-gray-800 mt-2">${product.price.toFixed(2)}</p>

          <hr className="my-6 border-gray-100" />

          {/* Sección de Acompañamientos */}
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            ✨ ¿Te gustaría acompañarlo con?
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-orange-50 transition">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={extras.papas}
                  onChange={(e) => setExtras({...extras, papas: e.target.checked})}
                  className="w-5 h-5 text-orange-500 focus:ring-orange-400 rounded" 
                />
                <span className="text-gray-700 text-sm">Papas fritas medianas</span>
              </div>
              <span className="text-gray-500 text-sm">+$1.50</span>
            </label>

            <label className="flex items-center justify-between p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-orange-50 transition">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={extras.soda}
                  onChange={(e) => setExtras({...extras, soda: e.target.checked})}
                  className="w-5 h-5 text-orange-500 focus:ring-orange-400 rounded" 
                />
                <span className="text-gray-700 text-sm">Soda en lata (Coca-Cola)</span>
              </div>
              <span className="text-gray-500 text-sm">+$1.00</span>
            </label>
          </div>
        </div>

        {/* Pie: Cantidad y Botón de Agregar */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className="text-gray-700 font-medium">Unidades</span>
            <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg px-2 py-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-gray-500 hover:text-orange-500 text-xl font-bold w-8 h-8 flex items-center justify-center"
              >
                -
              </button>
              <span className="font-bold text-gray-800">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="text-gray-500 hover:text-orange-500 text-xl font-bold w-8 h-8 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          <button 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition flex justify-between px-6 shadow-md hover:shadow-lg active:scale-[0.98]"
            onClick={() => {
              console.log("Agregado al carrito:", { ...product, quantity, extras, total });
              onClose();
            }}
          >
            <span>Agregar a mi pedido</span>
            <span>${total}</span>
          </button>
        </div>

      </div>
    </div>
  );
}