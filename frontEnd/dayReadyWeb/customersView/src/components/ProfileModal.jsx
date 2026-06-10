import React, { useState } from 'react';
import PersonalInfoView from './profile/PersonalInfoView';
import OrdersView from './profile/OrdersView';
import CardsView from './profile/CardsView';
import NotificationsView from './profile/NotificationsView';
import HelpView from './profile/HelpView';

export default function ProfileModal({ isOpen, onClose }) {
  const [view, setView] = useState('menu'); // Estado para navegar entre secciones

  if (!isOpen) return null;

  // Función para cerrar el modal completo y resetear a la vista menú
  const handleFullClose = () => {
    setView('menu');
    onClose();
  };

  // Mapeo de iconos para el menú principal
  const icons = {
    personal: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    orders: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
    cards: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
    notifications: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    help: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-300">
        
        {/* Renderizado condicional según la vista */}
        {view === 'menu' ? (
          <>
            {/* Cabecera del Perfil */}
            <div className="relative h-32 bg-slate-50 border-b border-slate-100 flex items-end justify-center pb-4">
              <button onClick={handleFullClose} className="absolute top-4 right-4 bg-white p-2 rounded-full text-gray-400 hover:text-gray-700 shadow-sm transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="w-20 h-20 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center text-2xl font-black text-slate-700 absolute -bottom-10">
                DE
              </div>
            </div>

            <div className="pt-14 pb-6 px-6 text-center">
              <h2 className="text-xl font-bold text-gray-800">Diego Estudiante</h2>
              <p className="text-gray-400 text-xs font-medium mt-1">ID: #2024-DR01</p>

              <div className="grid grid-cols-1 gap-2 mt-8">
                <MenuButton title="Información Personal" sub="Nombre y seguridad" icon={icons.personal} color="bg-slate-50 text-slate-600" onClick={() => setView('personal')} />
                <MenuButton title="Mis Pedidos" sub="Historial de compras" icon={icons.orders} color="bg-stone-50 text-stone-600" onClick={() => setView('orders')} />
                <MenuButton title="Mis Tarjetas" sub="Métodos de pago" icon={icons.cards} color="bg-blue-50 text-blue-600" onClick={() => setView('cards')} />
                <MenuButton title="Notificaciones" sub="Alertas de actividad" icon={icons.notifications} color="bg-slate-50 text-slate-600" onClick={() => setView('notifications')} />
                <MenuButton title="Ayuda" sub="Soporte técnico" icon={icons.help} color="bg-gray-50 text-gray-600" onClick={() => setView('help')} />
              </div>

              <button className="mt-6 w-full py-4 text-red-700/80 font-semibold text-sm hover:bg-red-50 rounded-2xl transition" onClick={() => window.location.href = "/login"}>
                Cerrar Sesión
              </button>
            </div>
          </>
        ) : (
          /* Sub-vistas (Se renderizan dentro del mismo modal) */
          <div className="animate-in slide-in-from-right-5 duration-300">
            {view === 'personal' && <PersonalInfoView onBack={() => setView('menu')} />}
            {view === 'orders' && <OrdersView onBack={() => setView('menu')} />}
            {view === 'cards' && <CardsView onBack={() => setView('menu')} />}
            {view === 'notifications' && <NotificationsView onBack={() => setView('menu')} />}
            {view === 'help' && <HelpView onBack={() => setView('menu')} />}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente pequeño para los botones del menú principal
function MenuButton({ title, sub, icon, color, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-all group border border-transparent">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <div className="text-left">
        <p className="font-semibold text-gray-800 text-sm">{title}</p>
        <p className="text-[11px] text-gray-400 font-medium">{sub}</p>
      </div>
      <svg className="w-4 h-4 ml-auto text-gray-300 group-hover:text-slate-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
    </button>
  );
}