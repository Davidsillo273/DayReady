import React, { useState } from 'react';

export default function NotificationsView({ onBack }) {
  const [notifications, setNotifications] = useState([
    { id: 1, title: '¡Pedido Listo!', text: 'Tu orden #1042 ya puede ser retirada.', time: 'Hace 5 min', unread: true },
    { id: 2, title: 'Recarga Exitosa', text: 'Se han acreditado $10.00 a tu DayWallet.', time: 'Ayer', unread: false },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="p-8 flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-slate-400 font-bold text-xs uppercase flex items-center gap-2 hover:text-slate-600 transition">
            ← Volver
          </button>
          <h2 className="text-xl font-bold text-gray-800">Notificaciones</h2>
        </div>
        <button onClick={markAllRead} className="text-xs font-semibold text-slate-500 hover:text-slate-800">
          Marcar leídas
        </button>
      </div>

      <div className="space-y-1 flex-grow overflow-y-auto pr-2">
          {notifications.map(notif => (
            <div key={notif.id} className={`p-4 rounded-2xl transition-colors ${notif.unread ? 'bg-slate-50' : 'bg-white'}`}>
              <div className="flex justify-between items-start">
                <p className={`text-sm font-semibold ${notif.unread ? 'text-slate-800' : 'text-slate-600'}`}>
                  {notif.title}
                  {notif.unread && <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full ml-2 mb-0.5"></span>}
                </p>
                <span className="text-[10px] text-slate-400 font-medium">{notif.time}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{notif.text}</p>
            </div>
          ))}

      </div>
    </div>
  );
}