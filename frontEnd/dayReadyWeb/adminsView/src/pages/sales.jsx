import React, { useState } from 'react';
import { Search, Bell, Download, TrendingUp, TrendingDown, ShoppingBag, DollarSign, Package } from 'lucide-react';
import Sidebar from '../Components/Sidebar';

export default function Sales() {
  const [activeMenu, setActiveMenu] = useState('ventas');
  const [selectedLocation, setSelectedLocation] = useState('Local Principal');
  const [searchQuery, setSearchQuery] = useState('');
  const [timePeriod, setTimePeriod] = useState('30');

  // Datos de estadísticas
  const stats = [
    {
      id: 1,
      title: 'INGRESOS TOTALES',
      value: '$12,450.80',
      trend: '+13.8%',
      isPositive: true,
      icon: DollarSign,
      color: 'orange',
      barData: [30, 45, 35, 50, 40, 60, 55]
    },
    {
      id: 2,
      title: 'PEDIDOS COMPLETADOS',
      value: '1,284',
      trend: '+8.2%',
      isPositive: true,
      icon: ShoppingBag,
      color: 'blue',
      barData: [25, 35, 30, 40, 35, 45, 50]
    },
    {
      id: 3,
      title: 'VENTA PROMEDIO',
      value: '$9.70',
      trend: '-9.1%',
      isPositive: false,
      icon: Package,
      color: 'purple',
      barData: [50, 40, 45, 35, 40, 30, 35]
    },
    {
      id: 4,
      title: 'CRECIMIENTO MENSUAL',
      value: '18.5%',
      trend: '+22.4%',
      isPositive: true,
      icon: TrendingUp,
      color: 'green',
      barData: [20, 30, 35, 45, 55, 60, 70]
    }
  ];

  // Datos de tendencia de ventas
  const trendData = [
    { day: 'DÍA 1', value: 3000 },
    { day: 'DÍA 7', value: 4500 },
    { day: 'DÍA 14', value: 5200 },
    { day: 'DÍA 21', value: 6800 },
    { day: 'DÍA 30', value: 8200 }
  ];

  // Datos de productos más vendidos
  const topProducts = [
    { id: 1, name: 'Hamburguesa', category: 'Categoria: Almuerzo', quantity: 245, revenue: '$2,450.00' },
    { id: 2, name: 'Papas Artesanales', category: 'Categoria: Snacks', quantity: 182, revenue: '$910.00' },
    { id: 3, name: 'Refresco Natural', category: 'Categoria: Bebidas', quantity: 156, revenue: '$468.00' }
  ];

  // Datos de ventas por categoría
  const categorySales = [
    { name: 'Almuerzos', percentage: 50, color: 'from-orange-400 to-orange-500' },
    { name: 'Snacks', percentage: 30, color: 'from-yellow-400 to-yellow-500' },
    { name: 'Bebidas', percentage: 20, color: 'from-blue-400 to-blue-500' }
  ];

  const getColorClass = (color) => {
    const colors = {
      orange: 'text-orange-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      green: 'text-green-600'
    };
    return colors[color];
  };

  const getBarColor = (color) => {
    const colors = {
      orange: 'bg-orange-400',
      blue: 'bg-blue-400',
      purple: 'bg-purple-400',
      green: 'bg-green-400'
    };
    return colors[color];
  };

  const getBackgroundColor = (color) => {
    const colors = {
      orange: 'bg-orange-100',
      blue: 'bg-blue-100',
      purple: 'bg-purple-100',
      green: 'bg-green-100'
    };
    return colors[color];
  };

  // Gráfico de dona simple
  const renderPieChart = () => {
    let cumulativePercent = 0;
    const slices = [];
    const colors = ['#f97316', '#eab308', '#3b82f6'];
    
    categorySales.forEach((cat, idx) => {
      const startAngle = (cumulativePercent / 100) * 360;
      const endAngle = ((cumulativePercent + cat.percentage) / 100) * 360;
      cumulativePercent += cat.percentage;
      slices.push({ ...cat, startAngle, endAngle, color: colors[idx] });
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
          $12.4K
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
          {/* Encabezado */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard de Ventas y Analítica</h1>
              <p className="text-gray-600 text-sm mt-1">Análisis detallado del rendimiento de ventas actualmente.</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all flex items-center space-x-2 text-sm">
                <span>📅 Últimos {timePeriod} días</span>
              </button>
              <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all flex items-center space-x-2 text-sm">
                <Download className="w-4 h-4" />
                <span>Exportar Informe</span>
              </button>
            </div>
          </div>

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
                        <TrendingUp className={`w-4 h-4 ${getColorClass(stat.color)}`} />
                      ) : (
                        <TrendingDown className={`w-4 h-4 ${getColorClass(stat.color)}`} />
                      )}
                      <span className={`text-sm font-semibold ${getColorClass(stat.color)}`}>
                        {stat.trend}
                      </span>
                    </div>
                  </div>

                  {/* Mini gráfico de barras */}
                  <div className="flex items-end justify-center space-x-1 h-12">
                    {stat.barData.map((value, idx) => (
                      <div
                        key={idx}
                        className={`${getBarColor(stat.color)} rounded-t opacity-75 hover:opacity-100 transition-all`}
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
                <p className="text-gray-600 text-sm">Ingresos diarios recordados de los últimos 30 días</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-3 py-1 bg-orange-100 text-orange-600 rounded font-medium text-xs hover:bg-orange-200 transition-all">
                  Este mes
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded font-medium text-xs hover:bg-gray-200 transition-all">
                  Mes anterior
                </button>
              </div>
            </div>

            {/* Gráfico de líneas simple */}
            <svg viewBox="0 0 800 300" className="w-full h-64">
              {/* Grid */}
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Líneas de grid */}
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

              {/* Eje X */}
              <line x1="80" y1="260" x2="780" y2="260" stroke="#e5e7eb" strokeWidth="2" />
              {/* Eje Y */}
              <line x1="80" y1="40" x2="80" y2="260" stroke="#e5e7eb" strokeWidth="2" />

              {/* Línea de datos */}
              <polyline
                points="80,220 260,180 440,150 620,100 780,50"
                fill="none"
                stroke="#f97316"
                strokeWidth="3"
              />

              {/* Área bajo la línea */}
              <polygon
                points="80,220 260,180 440,150 620,100 780,50 780,260 80,260"
                fill="url(#areaGradient)"
              />

              {/* Puntos */}
              {[
                { x: 80, y: 220 },
                { x: 260, y: 180 },
                { x: 440, y: 150 },
                { x: 620, y: 100 },
                { x: 780, y: 50 }
              ].map((point, idx) => (
                <circle
                  key={`point-${idx}`}
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  fill="#f97316"
                />
              ))}

              {/* Etiquetas X */}
              {trendData.map((data, idx) => (
                <text
                  key={`label-${idx}`}
                  x={80 + idx * (700 / 4)}
                  y="285"
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {data.day}
                </text>
              ))}
            </svg>
          </div>

          {/* Productos y Categorías */}
          <div className="grid grid-cols-2 gap-8">
            {/* Productos más vendidos */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Productos más vendidos</h2>
                <a href="#" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                  Ver todos
                </a>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      PRODUCTO
                    </th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      CANT.
                    </th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      INGRESOS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, idx) => (
                    <tr key={product.id} className={`border-b border-gray-100 ${idx === topProducts.length - 1 ? 'border-0' : ''}`}>
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
                        <p className="text-sm font-bold text-gray-900">{product.revenue}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ventas por Categoría */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Ventas por Categoría</h2>
              <p className="text-gray-600 text-sm mb-6">Distribución de ingresos por tipo de producto</p>

              <div className="flex flex-col items-center">
                {/* Gráfico de Dona */}
                {renderPieChart()}

                {/* Leyenda */}
                <div className="mt-8 w-full space-y-3">
                  {categorySales.map((category, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${['bg-orange-400', 'bg-yellow-400', 'bg-blue-400'][idx]}`}></div>
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{category.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
