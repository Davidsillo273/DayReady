import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronRight, Clock } from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import ProductCard from '../Components/ProductCard';
import StatCard from '../Components/StatCard';
import Button from '../Components/Button';

const BASE_URL = 'http://localhost:4000/api';

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('inicio');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Local 1');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customersCount, setCustomersCount] = useState(0);

  // --- Cargar productos, órdenes y clientes desde el backend ---
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const [productsRes, ordersRes, customersRes] = await Promise.all([
          fetch(`${BASE_URL}/products`, { credentials: 'include' }),
          fetch(`${BASE_URL}/orders`, { credentials: 'include' }),
          fetch(`${BASE_URL}/customers`, { credentials: 'include' }),
        ]);

        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();
        const customersData = await customersRes.json();

        if (!productsRes.ok) throw new Error(productsData.message || 'Error al cargar productos');
        if (!ordersRes.ok) throw new Error(ordersData.message || 'Error al cargar órdenes');
        if (!customersRes.ok) throw new Error(customersData.message || 'Error al cargar clientes');

        setProducts(Array.isArray(productsData) ? productsData : []);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setCustomersCount(Array.isArray(customersData) ? customersData.length : 0);
      } catch (err) {
        console.error('Error al cargar el dashboard:', err);
        setError('No se pudieron cargar los datos del dashboard.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // --- Productos más recientes (no hay campo de ventas en el modelo) ---
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  // --- Órdenes de hoy, para ventas y conteo del día ---
  const isToday = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const ordersToday = orders.filter((order) => isToday(order.fecha));
  const salesToday = ordersToday.reduce((sum, order) => sum + (order.total || 0), 0);

  const stats = [
    {
      title: 'Ventas del Día',
      value: `$${salesToday.toFixed(2)}`,
      icon: '📊',
      color: 'bg-blue-100',
    },
    {
      title: 'Órdenes (Hoy)',
      value: ordersToday.length,
      icon: '📦',
      color: 'bg-green-100',
    },
    {
      title: 'Clientes',
      value: customersCount,
      icon: '👥',
      color: 'bg-purple-100',
    },
    {
      title: 'Productos',
      value: products.length,
      icon: '🍽️',
      color: 'bg-orange-100',
    },
  ];

  // --- Últimas 3 órdenes (ya vienen ordenadas desc por fecha desde el backend) ---
  const recentOrders = orders.slice(0, 5);

  const getStatusBadge = (estado) => {
    if (estado === 'entregado') return 'bg-green-100 text-green-700';
    if (estado === 'no entregado') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const formatStatusLabel = (estado) => {
    if (estado === 'entregado') return 'Entregado';
    if (estado === 'no entregado') return 'No Entregado';
    return 'Pendiente';
  };

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
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="py-20 text-center text-gray-500 text-sm">Cargando datos del dashboard...</div>
          ) : (
            <>
              {/* Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    color={stat.color}
                  />
                ))}
              </div>

              {/* MENÚ DESTACADO (productos más recientes) */}
              <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Productos Recientes
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Últimos platillos agregados al menú
                    </p>
                  </div>
                  <button className="text-orange-500 hover:text-orange-600 font-medium flex items-center space-x-2">
                    <span>Ver todos</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {recentProducts.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">No hay productos registrados aún.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentProducts.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                )}
              </div>

              {/* SECCIÓN DE ÓRDENES RECIENTES */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Órdenes Recientes
                </h2>

                {recentOrders.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">No hay órdenes registradas aún.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
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
                        {recentOrders.map((order) => (
                          <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-700 text-sm">{order.customerName}</td>
                            <td className="py-3 px-4 font-bold text-gray-900 text-sm">
                              ${order.total?.toFixed(2)}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${getStatusBadge(order.estado)}`}
                              >
                                {formatStatusLabel(order.estado)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600 flex items-center space-x-2 text-sm">
                              <Clock className="w-4 h-4" />
                              <span>{order.horaCreacion}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}