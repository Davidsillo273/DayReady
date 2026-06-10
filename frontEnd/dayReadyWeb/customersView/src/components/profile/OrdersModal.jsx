import React from 'react';

export default function OrdersView({ onBack }) {
  const orders = [
    { id: '1042', date: 'Hoy, 10:30 AM', total: 4.50, items: 'Hamburguesa + Refresco', status: 'En preparación', color: 'text-amber-600 bg-amber-50' },
    { id: '1041', date: 'Ayer, 12:15 PM', total: 2.75, items: 'Ensalada César', status: 'Entregado', color: 'text-emerald-600 bg-emerald-50' },
    { id: '1035', date: '15 Abr, 09:00 AM', total: 1.50, items: 'Café Americano', status: 'Entregado', color: 'text-emerald-600 bg-emerald-50' },
  ];

  return (
    <div className="p-8 flex flex-col h-full w-full">
      <button onClick={onBack} className="mb-6 text-slate-400 font-bold text-xs uppercase flex items-center gap-2 hover:text-slate-600 transition">
        ← Volver
      </button>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Mis Pedidos</h2>

      <div className="space-y-4 flex-grow overflow-y-auto pr-2">
          {orders.map((order) => (
            <div key={order.id} className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs font-semibold text-slate-400">Orden #{order.id} • {order.date}</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">{order.items}</p>
                </div>
                <p className="text-sm font-black text-slate-800">${order.total.toFixed(2)}</p>
              </div>
              <div className="flex items-center mt-3">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${order.color}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}

      </div>
    </div>
  );
}