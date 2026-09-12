import React, { useEffect, useState } from 'react';
import { getOrders } from '../../services/ordersService';

const STATUS_STYLES = {
  entregado: 'text-emerald-600 bg-emerald-50',
  pendiente: 'text-amber-600 bg-amber-50',
  'no entregado': 'text-red-600 bg-red-50',
};

export default function OrdersView({ customer, onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // El modelo Order no guarda el id del cliente, sólo su correo en
    // "customerContact" (así se crea la orden en CheckoutModal), así que
    // se filtra en el cliente igual que en el resto de la app.
    getOrders()
      .then((all) => setOrders(all.filter((o) => o.customerContact === customer?.email)))
      .catch((err) => console.error('Error al cargar pedidos:', err))
      .finally(() => setLoading(false));
  }, [customer]);

  return (
    <div className="p-8 flex flex-col h-full w-full">
      <button onClick={onBack} className="mb-6 text-slate-400 font-bold text-xs uppercase flex items-center gap-2 hover:text-slate-600 transition">
        ← Volver
      </button>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Mis Pedidos</h2>

      <div className="space-y-4 flex-grow overflow-y-auto pr-2">
        {loading && <p className="text-sm text-gray-400">Cargando pedidos...</p>}
        {!loading && orders.length === 0 && (
          <p className="text-sm text-gray-400">Todavía no tienes pedidos.</p>
        )}
        {orders.map((order) => (
          <div key={order._id} className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-xs font-semibold text-slate-400">
                  {new Date(order.fecha).toLocaleDateString('es-ES')} • {order.horaCreacion}
                </p>
                <p className="text-sm font-bold text-slate-800 mt-1">
                  {order.items.map((item) => `${item.quantity}x ${item.name}`).join(', ')}
                </p>
              </div>
              <p className="text-sm font-black text-slate-800">${order.total.toFixed(2)}</p>
            </div>
            <div className="flex items-center mt-3">
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[order.estado] || 'text-slate-600 bg-slate-50'}`}>
                {order.estado}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
