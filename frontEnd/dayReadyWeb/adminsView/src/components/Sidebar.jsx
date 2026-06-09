import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  Menu as MenuIcon,
  BarChart3,
} from 'lucide-react';
import dayReadyLogo from '../imgs/DayReadyLogo.png';

export default function Sidebar({ activeMenu, setActiveMenu }) {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: Home, path: '/admin/dashboard' },
    { id: 'menu', label: 'Menú del Día', icon: MenuIcon, path: '/admin/menu' },
    { id: 'productos', label: 'Gestión de Productos', icon: Package, path: '/admin/products' },
    { id: 'pedidos', label: 'Gestión de Pedidos', icon: ShoppingCart, path: '/admin/orders' },
    { id: 'ventas', label: 'Ventas', icon: BarChart3, path: '/admin/sales' },
    { id: 'clientes', label: 'Clientes', icon: Users, path: '/admin/customers' },
  ];

  const handleMenuClick = (item) => {
    setActiveMenu(item.id);
    navigate(item.path);
  };

  const handleLogout = () => {
    navigate('/admin');
  };

  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-center">
        <img
          src={dayReadyLogo}
          alt="Day Ready Logo"
          className="h-12 object-contain"
        />
      </div>

      {/* Menú de navegación */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeMenu === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-orange-100 text-orange-600 border-l-4 border-orange-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Botón logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
