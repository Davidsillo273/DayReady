import React, { useState, useEffect } from 'react';
import { Search, Bell, TrendingUp, TrendingDown, ShoppingBag, DollarSign, Package } from 'lucide-react';
import Sidebar from '../Components/Sidebar';

const BASE_URL = 'http://localhost:4000/api';

export default function Sales() {
  const [activeMenu, setActiveMenu] = useState('ventas');
  const [selectedLocation, setSelectedLocation] = useState('Local Principal');
  const [searchQuery, setSearchQuery] = useState('');

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const reload = () => setRefreshKey(prev => prev + 1);

  const mapOrder = (backendOrder) => ({
    id: backendOrder._id,
    customerName: backendOrder.customerName,
    customerContact: backendOrder.customerContact || 'N/A',
    datetime: `${new Date(backendOrder.fecha).toLocaleDateString('es-ES')}, ${backendOrder.horaCreacion}`,
    paymentStatus: backendOrder.estadoPago ? 'Pagado' : 'Pendiente',
    deliveryStatus: backendOrder.estado.charAt(0).toUpperCase() + backendOrder.estado.slice(1),
    total: backendOrder.total,
    items: backendOrder.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      totalPrice: item.price * item.quantity,
    })),
    fecha: new Date(backendOrder.fecha),
    _raw: backendOrder,
  });

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`${BASE_URL}/orders`, { credentials: 'include' }),
          fetch(`${BASE_URL}/products`, { credentials: 'include' }),
        ]);
        if (!ordersRes.ok) throw new Error('Error al cargar pedidos');
        if (!productsRes.ok) throw new Error('Error al cargar productos');
        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();
        if (isMounted) {
          setOrders(ordersData.map(mapOrder));
          setProducts(productsData.map(p => ({
            id: p._id,
            name: p.name,
            category: p.category,
          })));
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [refreshKey]);

  // Estadísticas
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const completedOrders = orders.filter(o => o.deliveryStatus === 'Entregado').length;
  const averageOrder = orders.length > 0 ? (totalRevenue / orders.length) : 0;

  const getMonthlyRevenue = (monthOffset = 0) => {
    const now = new Date();
    const targetMonth = now.getMonth() - monthOffset;
    const targetYear = now.getFullYear() + Math.floor((now.getMonth() - monthOffset) / 12);
    return orders
      .filter(o => {
        const d = o.fecha;
        return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
      })
      .reduce((sum, o) => sum + o.total, 0);
  };

  const currentMonthRevenue = getMonthlyRevenue(0);
  const previousMonthRevenue = getMonthlyRevenue(1);
  const growth = previousMonthRevenue > 0
    ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
    : 0;

  const getTrendData = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const filtered = orders.filter(o => o.fecha >= thirtyDaysAgo);
    const groups = {};
    filtered.forEach(o => {
      const key = o.fecha.toLocaleDateString('es-ES');
      if (!groups[key]) groups[key] = 0;
      groups[key] += o.total;
    });
    const sortedKeys = Object.keys(groups).sort((a, b) => new Date(a) - new Date(b));
    return sortedKeys.map(day => ({ day, value: groups[day] }));
  };

  const getTopProducts = () => {
    const itemCount = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const name = item.name;
        if (!itemCount[name]) itemCount[name] = { quantity: 0, revenue: 0 };
        itemCount[name].quantity += item.quantity;
        itemCount[name].revenue += item.totalPrice;
      });
    });
    const sorted = Object.entries(itemCount)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 3);
    return sorted.map(item => {
      const product = products.find(p => p.name === item.name);
      return {
        ...item,
        category: product ? `Categoria: ${product.category}` : 'Categoria: Sin categoría',
      };
    });
  };

  const getCategorySales = () => {
    const categoryRevenue = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.name === item.name);
        const cat = product ? product.category : 'Otros';
        if (!categoryRevenue[cat]) categoryRevenue[cat] = 0;
        categoryRevenue[cat] += item.totalPrice;
      });
    });
    const total = Object.values(categoryRevenue).reduce((a, b) => a + b, 0);
    if (total === 0) return [];
    return Object.entries(categoryRevenue)
      .map(([name, value]) => ({
        name,
        percentage: (value / total) * 100,
        value,
      }))
      .sort((a, b) => b.percentage - a.percentage);
  };

  const stats = [
    {
      id: 1,
      title: 'INGRESOS TOTALES',
      value: `$${totalRevenue.toFixed(2)}`,
      trend: `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`,
      isPositive: growth >= 0,
      icon: DollarSign,
      color: 'orange',
      barData: [30, 45, 35, 50, 40, 60, 55]
    },
    {
      id: 2,
      title: 'PEDIDOS COMPLETADOS',
      value: `${completedOrders}`,
      trend: `${orders.length > 0 ? '+' : ''}${((completedOrders / orders.length) * 100).toFixed(1)}%`,
      isPositive: true,
      icon: ShoppingBag,
      color: 'blue',
      barData: [25, 35, 30, 40, 35, 45, 50]
    },
    {
      id: 3,
      title: 'VENTA PROMEDIO',
      value: `$${averageOrder.toFixed(2)}`,
      trend: `${averageOrder > 0 ? '+' : ''}${averageOrder.toFixed(1)}%`,
      isPositive: averageOrder >= 0,
      icon: Package,
      color: 'purple',
      barData: [50, 40, 45, 35, 40, 30, 35]
    },
    {
      id: 4,
      title: 'CRECIMIENTO MENSUAL',
      value: `${growth.toFixed(1)}%`,
      trend: `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`,
      isPositive: growth >= 0,
      icon: TrendingUp,
      color: 'green',
      barData: [20, 30, 35, 45, 55, 60, 70]
    }
  ];

  const trendData = getTrendData();
  const displayTrend = trendData.length > 0 ? trendData : [
    { day: 'DÍA 1', value: 0 },
    { day: 'DÍA 7', value: 0 },
    { day: 'DÍA 14', value: 0 },
    { day: 'DÍA 21', value: 0 },
    { day: 'DÍA 30', value: 0 }
  ];

  const topProducts = getTopProducts();
  const categorySales = getCategorySales();
  const pieColors = ['#f97316', '#eab308', '#3b82f6', '#8b5cf6', '#ec4899'];

  const renderPieChart = () => {
    if (categorySales.length === 0) {
      return (
        <div className="text-gray-500 text-center py-8">
          No hay datos suficientes para mostrar categorías
        </div>
      );
    }
    let cumulativePercent = 0;
    const slices = categorySales.map((cat, idx) => {
      const startAngle = (cumulativePercent / 100) * 360;
      const endAngle = ((cumulativePercent + cat.percentage) / 100) * 360;
      cumulativePercent += cat.percentage;
      return { ...cat, startAngle, endAngle, color: pieColors[idx % pieColors.length] };
    });

    return (
      <svg viewBox="0 0 200 200" className="w-32 h-32 mx-auto">
        {slices.map((slice, idx) => {
          const startRad = (slice.startAngle * Math.PI) / 180;
          const endRad = (slice.endAngle * Math.PI) / 180;
          const x1 = 100 + 60 * Math.cos(startRad);
          const y1 = 100 + 60 * Math.sin(startRad);
          const x2 = 100 + 60 * Math.cos(endRad);
          const y2 = 100 + 60 * Math.sin(endRad);
          const largeArc = slice.endAngle - slice.startAngle > 180 ? 1 : 0;
          return (
            <path
              key={idx}
              d={`M 100 100 L ${x1} ${y1} A 60 60 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={slice.color}
            />
          );
        })}
        <circle cx="100" cy="100" r="35" fill="white" />
        <text x="100" y="100" textAnchor="middle" dy="0.3em" className="text-xs font-bold">
          ${totalRevenue.toFixed(1)}
        </text>
      </svg>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <main className="flex-1 overflow-auto">
        {/* BARRA SUPERIOR */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-6 flex-1">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium focus:outline-none border border-gray-200 text-sm"
              >
                <option value="Local Principal">Local Principal</option>
                <option value="Local 2">Local 2</option>
                <option value="Local 3">Local 3</option>
              </select>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar reportes, productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none border border-gray-200 focus:border-orange-400 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 font-bold text-lg">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* CONTENIDO */}
        <div className="p-8">
          {/* Encabezado sin botones adicionales */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Ventas y Analítica</h1>
            <p className="text-gray-600 text-sm mt-1">Análisis detallado del rendimiento de ventas actualmente.</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
              {error}
            </div>
          )}

          {/* Tarjetas de Estadísticas */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.id} className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-4">{stat.title}</p>
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                    <div className="flex items-center space-x-1">
                      {stat.isPositive ? (
                        <TrendingUp className={`w-4 h-4 text-${stat.color}-600`} />
                      ) : (
                        <TrendingDown className={`w-4 h-4 text-${stat.color}-600`} />
                      )}
                      <span className={`text-sm font-semibold text-${stat.color}-600`}>
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-end justify-center space-x-1 h-12">
                    {stat.barData.map((value, idx) => (
                      <div
                        key={idx}
                        className={`bg-${stat.color}-400 rounded-t opacity-75 hover:opacity-100 transition-all`}
                        style={{ height: `${(value / 60) * 100}%`, width: '8px' }}
                      ></div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tendencia de Ventas */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Tendencia de Ventas</h2>
                <p className="text-gray-600 text-sm">Ingresos diarios de los últimos 30 días</p>
              </div>
              {/* Botones de mes (opcional, puedes mantenerlos o quitarlos) */}
              <div className="flex items-center space-x-3">
                <button className="px-3 py-1 bg-orange-100 text-orange-600 rounded font-medium text-xs hover:bg-orange-200 transition-all">
                  Este mes
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded font-medium text-xs hover:bg-gray-200 transition-all">
                  Mes anterior
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64 text-gray-500">Cargando datos...</div>
            ) : trendData.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-500">No hay datos de ventas en este período</div>
            ) : (
              <svg viewBox="0 0 800 300" className="w-full h-64">
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[1, 2, 3, 4].map((i) => (
                  <line
                    key={`grid-${i}`}
                    x1="80"
                    y1={40 + i * 50}
                    x2="780"
                    y2={40 + i * 50}
                    stroke="#f0f0f0"
                    strokeWidth="1"
                  />
                ))}
                <line x1="80" y1="260" x2="780" y2="260" stroke="#e5e7eb" strokeWidth="2" />
                <line x1="80" y1="40" x2="80" y2="260" stroke="#e5e7eb" strokeWidth="2" />

                {displayTrend.length > 0 && (() => {
                  const maxValue = Math.max(...displayTrend.map(d => d.value), 1);
                  const minValue = Math.min(...displayTrend.map(d => d.value), 0);
                  const range = maxValue - minValue || 1;
                  const points = displayTrend.map((d, idx) => {
                    const x = 80 + (idx / (displayTrend.length - 1)) * 700;
                    const y = 260 - ((d.value - minValue) / range) * 200;
                    return { x, y, label: d.day };
                  });
                  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
                  const areaPoints = points.map(p => `${p.x},${p.y}`).join(' ') + ` 780,260 80,260`;
                  return (
                    <>
                      <polygon points={areaPoints} fill="url(#areaGradient)" />
                      <polyline points={polylinePoints} fill="none" stroke="#f97316" strokeWidth="3" />
                      {points.map((p, idx) => (
                        <circle key={`point-${idx}`} cx={p.x} cy={p.y} r="5" fill="#f97316" />
                      ))}
                      {points.map((p, idx) => (
                        <text
                          key={`label-${idx}`}
                          x={p.x}
                          y="285"
                          textAnchor="middle"
                          className="text-xs fill-gray-600"
                        >
                          {p.label}
                        </text>
                      ))}
                    </>
                  );
                })()}
              </svg>
            )}
          </div>

          {/* Productos y Categorías */}
          <div className="grid grid-cols-2 gap-8">
            {/* Productos más vendidos - sin "Ver todos" */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Productos más vendidos</h2>

              {loading ? (
                <div className="text-center py-8 text-gray-500">Cargando...</div>
              ) : topProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No hay productos vendidos aún</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">PRODUCTO</th>
                      <th className="text-left py-3 px-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">CANT.</th>
                      <th className="text-left py-3 px-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">INGRESOS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, idx) => (
                      <tr key={idx} className={`border-b border-gray-100 ${idx === topProducts.length - 1 ? 'border-0' : ''}`}>
                        <td className="py-4 px-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${['bg-orange-400', 'bg-yellow-400', 'bg-blue-400'][idx]}`}></div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                              <p className="text-xs text-gray-600">{product.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-3">
                          <p className="text-sm font-semibold text-gray-900">{product.quantity}</p>
                        </td>
                        <td className="py-4 px-3">
                          <p className="text-sm font-bold text-gray-900">${product.revenue.toFixed(2)}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Ventas por Categoría */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Ventas por Categoría</h2>
              <p className="text-gray-600 text-sm mb-6">Distribución de ingresos por tipo de producto</p>

              <div className="flex flex-col items-center">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Cargando...</div>
                ) : categorySales.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No hay datos de categorías</div>
                ) : (
                  <>
                    {renderPieChart()}
                    <div className="mt-8 w-full space-y-3">
                      {categorySales.map((cat, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: pieColors[idx % pieColors.length] }}></div>
                            <span className="text-sm text-gray-700">{cat.name}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-900">{cat.percentage.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}