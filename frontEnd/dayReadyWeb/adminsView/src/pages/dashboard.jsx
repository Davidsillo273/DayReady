import React, { useState } from 'react';
import { Search, Bell, ChevronRight, Clock } from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import ProductCard from '../Components/ProductCard';
import StatCard from '../Components/StatCard';
import Button from '../Components/Button';

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('inicio');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Local 1');

  // Datos de productos destacados (más comprados)
  const featuredProducts = [
    {
      id: 1,
      name: 'Hamburguesa Clásica',
      price: 3.5,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      category: 'Comida Rápida',
      sales: 1250,
    },
    {
      id: 2,
      name: 'Ensalada César',
      price: 2.75,
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
      category: 'Saludable',
      sales: 980,
    },
    {
      id: 3,
      name: 'Porción de Pizza',
      price: 1.5,
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
      category: 'Comida Rápida',
      sales: 1500,
    },
    {
      id: 4,
      name: 'Jugo Natural Naranja',
      price: 1.25,
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd1f89c8?w=400&h=300&fit=crop',
      category: 'Bebida',
      sales: 850,
    },
    {
      id: 5,
      name: 'Papas fritas',
      price: 2.5,
      image: 'https://images.unsplash.com/photo-1585238341710-57b0e7e0bf1f?w=400&h=300&fit=crop',
      category: 'Acompañamientos',
      sales: 1100,
    },
    {
      id: 6,
      name: 'Sopa de Tortilla',
      price: 3.25,
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
      category: 'Sopa',
      sales: 720,
    },
  ];

  // Datos de estadísticas
  const stats = [
    {
      title: 'Ventas del Día',
      value: '$2,450',
      change: '+12%',
      icon: '📊',
      color: 'bg-blue-100',
    },
    {
      title: 'Órdenes',
      value: '45',
      change: '+5',
      icon: '📦',
      color: 'bg-green-100',
    },
    {
      title: 'Clientes',
      value: '128',
      change: '+8',
      icon: '👥',
      color: 'bg-purple-100',
    },
    {
      title: 'Productos',
      value: '34',
      change: '+2',
      icon: '🍽️',
      color: 'bg-orange-100',
    },
  ];

  const recentOrders = [
    {
      id: '#ORD001',
      client: 'Juan Carlos',
      total: '$45.50',
      status: 'Entregado',
      time: '10:30 AM',
    },
    {
      id: '#ORD002',
      client: 'María García',
      total: '$32.75',
      status: 'Preparando',
      time: '10:45 AM',
    },
    {
      id: '#ORD003',
      client: 'Carlos López',
      total: '$56.20',
      status: 'Pendiente',
      time: '11:00 AM',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-auto">
        {/* BARRA SUPERIOR */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-8 py-4 flex items-center justify-between">
            {/* Ubicación y búsqueda */}
            <div className="flex items-center space-x-6 flex-1">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium focus:outline-none border border-gray-200 text-sm"
              >
                <option value="Local 1">Local 1</option>
                <option value="Local 2">Local 2</option>
                <option value="Local 3">Local 3</option>
              </select>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar comida, bebida..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none border border-gray-200 focus:border-orange-400 text-sm"
                />
              </div>
            </div>

            {/* Notificaciones y perfil */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 font-bold text-lg">
                DE
              </div>
            </div>
          </div>
        </header>

        {/* CONTENIDO */}
        <div className="p-8">
          {/* Alerta de agregar menú */}
          <div className="mb-8 p-4 bg-orange-100 border-l-4 border-orange-500 rounded-lg flex items-start justify-between">
            <div>
              <h3 className="font-bold text-orange-900 mb-1">
                ¡Agrega el menú de mañana!
              </h3>
              <p className="text-orange-800 text-sm">
                Empieza a agregar los almuerzos de mañana ahora mismo.
              </p>
            </div>
            <Button variant="primary">
              <span className="flex items-center space-x-2">
                <span>Agregar</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </Button>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                icon={stat.icon}
                color={stat.color}
              />
            ))}
          </div>

          {/* MENÚ DESTACADO */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Menú Destacado
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Platillos más comprados por los clientes
                </p>
              </div>
              <button className="text-orange-500 hover:text-orange-600 font-medium flex items-center space-x-2">
                <span>Ver todos</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Grid de productos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* SECCIÓN DE ÓRDENES RECIENTES */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Órdenes Recientes
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-bold text-gray-700 text-sm">
                      ID Orden
                    </th>
                    <th className="text-left py-3 px-4 font-bold text-gray-700 text-sm">
                      Cliente
                    </th>
                    <th className="text-left py-3 px-4 font-bold text-gray-700 text-sm">
                      Total
                    </th>
                    <th className="text-left py-3 px-4 font-bold text-gray-700 text-sm">
                      Estado
                    </th>
                    <th className="text-left py-3 px-4 font-bold text-gray-700 text-sm">
                      Hora
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900 text-sm">
                        {order.id}
                      </td>
                      <td className="py-3 px-4 text-gray-700 text-sm">{order.client}</td>
                      <td className="py-3 px-4 font-bold text-gray-900 text-sm">
                        {order.total}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                            order.status === 'Entregado'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'Preparando'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 flex items-center space-x-2 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{order.time}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
