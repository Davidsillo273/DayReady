import React, { useState } from 'react';
import { Search, Bell, Plus, Filter, Eye, Edit2, Trash2, AlertCircle, X } from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import Modal from '../Components/Modal';
import ConfirmModal from '../Components/ConfirmModal';
import Button from '../Components/Button';

export default function Orders() {
  const [activeMenu, setActiveMenu] = useState('pedidos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Local 1');
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editForm, setEditForm] = useState({});
  
  // Productos disponibles (menú)
  const availableMenuItems = [
    { id: 1, name: 'Combo Clásico', price: 5.00, category: 'menu' },
    { id: 2, name: 'Ensalada Cesar', price: 4.50, category: 'menu' },
    { id: 3, name: 'Hamburguesa de queso', price: 4.50, category: 'menu' },
  ];

  // Productos disponibles (inventario)
  const availableProducts = [
    { id: 101, name: 'Jugo Natural', price: 2.50, category: 'producto' },
    { id: 102, name: 'Refresco Cola', price: 1.50, category: 'producto' },
    { id: 103, name: 'Café Americano', price: 1.25, category: 'producto' },
    { id: 104, name: 'Galletas de Chocolate', price: 1.50, category: 'producto' },
    { id: 105, name: 'Brownie de Chocolate', price: 2.00, category: 'producto' },
    { id: 106, name: 'Donut de Fresa', price: 1.80, category: 'producto' },
  ];

  // Estado para nuevo pedido
  const [newOrderForm, setNewOrderForm] = useState({
    customerName: '',
    customerId: '',
    selectedItems: [],
  });
  
  const [orders, setOrders] = useState([
    {
      id: '#ORD-9023',
      customer: { name: 'Mateo Fernández', avatar: 'https://i.pravatar.cc/100?img=1', contact: 'ID: 2023-1001' },
      datetime: 'Hoy, 12:30 PM',
      paymentStatus: 'Pagado',
      deliveryStatus: 'Pendiente',
      total: 6.50,
      items: [
        { name: 'Combo Clásico', quantity: 1, price: 5.00 },
        { name: 'Refresco Cola', quantity: 1, price: 1.50 }
      ]
    },
    {
      id: '#ORD-9022',
      customer: { name: 'Lucia Garcia', avatar: 'https://i.pravatar.cc/100?img=2', contact: 'ID: 2023-1002' },
      datetime: 'Hoy, 11:45 AM',
      paymentStatus: 'Pagado',
      deliveryStatus: 'Entregado',
      total: 3.75,
      items: [
        { name: 'Brownie de Chocolate', quantity: 1, price: 2.00 },
        { name: 'Café Americano', quantity: 1, price: 1.75 }
      ]
    },
    {
      id: '#ORD-9021',
      customer: { name: 'Carlos Ruiz', avatar: 'https://i.pravatar.cc/100?img=3', contact: 'ID: 2023-1003' },
      datetime: 'Hoy, 11:15 AM',
      paymentStatus: 'Pagado',
      deliveryStatus: 'No entregado',
      total: 5.20,
      items: [
        { name: 'Ensalada Cesar', quantity: 1, price: 4.50 },
        { name: 'Jugo Natural', quantity: 1, price: 2.50 }
      ]
    },
    {
      id: '#ORD-9020',
      customer: { name: 'Elena Rojas', avatar: 'https://i.pravatar.cc/100?img=4', contact: 'ID: 2023-1004' },
      datetime: 'Ayer, 10:20 AM',
      paymentStatus: 'Pagado',
      deliveryStatus: 'Entregado',
      total: 6.50,
      items: [
        { name: 'Hamburguesa de queso', quantity: 1, price: 4.50 },
        { name: 'Donut de Fresa', quantity: 1, price: 2.00 }
      ]
    },
    {
      id: '#ORD-9019',
      customer: { name: 'Diego López', avatar: 'https://i.pravatar.cc/100?img=5', contact: 'ID: 2023-1005' },
      datetime: 'Ayer, 09:30 AM',
      paymentStatus: 'Pendiente',
      deliveryStatus: 'Pendiente',
      total: 4.25,
      items: [
        { name: 'Galletas de Chocolate', quantity: 2, price: 1.50 }
      ]
    },
  ]);

  // Filtrar pedidos
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.contact.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === 'todos' ||
      (selectedStatus === 'pendientes' && order.deliveryStatus === 'Pendiente') ||
      (selectedStatus === 'entregados' && order.deliveryStatus === 'Entregado') ||
      (selectedStatus === 'no-entregados' && order.deliveryStatus === 'No entregado');
    
    return matchesSearch && matchesStatus;
  });

  // Paginación
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIdx, startIdx + itemsPerPage);

  // Estadísticas
  const stats = {
    today: orders.filter(o => o.datetime.includes('Hoy')).length,
    pending: orders.filter(o => o.deliveryStatus === 'Pendiente').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    averageOrder: (orders.reduce((sum, o) => sum + o.total, 0) / orders.length).toFixed(2)
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setEditForm({
      paymentStatus: order.paymentStatus,
      deliveryStatus: order.deliveryStatus
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteOrder = (order) => {
    setSelectedOrder(order);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setOrders(orders.filter(o => o.id !== selectedOrder.id));
    setIsDeleteConfirmOpen(false);
    setSelectedOrder(null);
  };

  const handleSaveEdit = () => {
    const updatedOrders = orders.map(o =>
      o.id === selectedOrder.id
        ? { ...o, ...editForm }
        : o
    );
    setOrders(updatedOrders);
    setIsEditModalOpen(false);
    setSelectedOrder(null);
  };

  const handleAddItemToOrder = (product) => {
    const existingItem = newOrderForm.selectedItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setNewOrderForm({
        ...newOrderForm,
        selectedItems: newOrderForm.selectedItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
    } else {
      setNewOrderForm({
        ...newOrderForm,
        selectedItems: [
          ...newOrderForm.selectedItems,
          { ...product, quantity: 1 }
        ]
      });
    }
  };

  const handleRemoveItemFromOrder = (productId) => {
    setNewOrderForm({
      ...newOrderForm,
      selectedItems: newOrderForm.selectedItems.filter(item => item.id !== productId)
    });
  };

  const handleUpdateItemQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveItemFromOrder(productId);
    } else {
      setNewOrderForm({
        ...newOrderForm,
        selectedItems: newOrderForm.selectedItems.map(item =>
          item.id === productId
            ? { ...item, quantity }
            : item
        )
      });
    }
  };

  const calculateOrderTotal = () => {
    return newOrderForm.selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSaveNewOrder = () => {
    if (!newOrderForm.customerName || newOrderForm.selectedItems.length === 0) {
      alert('Por favor completa el nombre del cliente y agrega al menos un producto');
      return;
    }

    const orderId = `#ORD-${9000 + orders.length}`;
    const newOrder = {
      id: orderId,
      customer: {
        name: newOrderForm.customerName,
        avatar: 'https://i.pravatar.cc/100?img=' + Math.floor(Math.random() * 70),
        contact: `ID: ${newOrderForm.customerId || 'N/A'}`
      },
      datetime: new Date().toLocaleString('es-ES', { 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '-'),
      paymentStatus: 'Pendiente',
      deliveryStatus: 'Pendiente',
      total: calculateOrderTotal(),
      items: newOrderForm.selectedItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price * item.quantity
      }))
    };

    setOrders([newOrder, ...orders]);
    setIsNewOrderModalOpen(false);
    setNewOrderForm({
      customerName: '',
      customerId: '',
      selectedItems: [],
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pagado':
        return 'bg-green-100 text-green-700';
      case 'Pendiente':
        return 'bg-orange-100 text-orange-700';
      case 'No entregado':
        return 'bg-red-100 text-red-700';
      case 'Entregado':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusDot = (status) => {
    if (status === 'Pagado' || status === 'Entregado') return 'bg-green-500';
    if (status === 'Pendiente') return 'bg-orange-500';
    return 'bg-red-500';
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
                <option value="Local 1">Local 1</option>
                <option value="Local 2">Local 2</option>
                <option value="Local 3">Local 3</option>
              </select>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar pedidos, clientes, IDs..."
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
                DE
              </div>
            </div>
          </div>
        </header>

        {/* CONTENIDO */}
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
              <p className="text-gray-600 text-sm mt-1">Monitorea y gestiona todos los pedidos de los clientes en tiempo real.</p>
            </div>
            <button 
              onClick={() => setIsNewOrderModalOpen(true)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all flex items-center space-x-2 text-sm">
              <Plus className="w-4 h-4" />
              <span>Nuevo Pedido</span>
            </button>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'todos', label: 'Todos los pedidos' },
                  { id: 'pendientes', label: 'Pendientes' },
                  { id: 'entregados', label: 'Entregados' },
                  { id: 'no-entregados', label: 'No Entregados' }
                ].map(status => (
                  <button
                    key={status.id}
                    onClick={() => {
                      setSelectedStatus(status.id);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                      selectedStatus === status.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all flex items-center space-x-2 text-sm">
                <Filter className="w-4 h-4" />
                <span>Más filtros</span>
              </button>
            </div>
          </div>

          {/* Tabla de Pedidos */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID PEDIDO</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">CLIENTES</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">FECHA/HORA</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ESTADO PAGO</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ESTADO ENTREGA</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">TOTAL</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">{order.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <img src={order.customer.avatar} alt={order.customer.name} className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{order.customer.name}</p>
                          <p className="text-xs text-gray-500">{order.customer.contact}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{order.datetime}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${getStatusDot(order.paymentStatus)}`}></span>
                        <span className="text-sm text-gray-700 font-medium">{order.paymentStatus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${getStatusDot(order.deliveryStatus)}`}></span>
                        <span className="text-sm text-gray-700 font-medium">{order.deliveryStatus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">${order.total.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditOrder(order)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginación */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                mostrando {startIdx + 1} a {Math.min(startIdx + itemsPerPage, filteredOrders.length)} de{' '}
                {filteredOrders.length} pedidos
              </p>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                >
                  Anterior
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg font-medium transition-all text-sm ${
                      currentPage === page
                        ? 'bg-orange-500 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">PEDIDOS DE HOY</p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-gray-900">{stats.today}</span>
                <span className="text-green-600 text-sm font-semibold">↗ +12%</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">PENDIENTES ENTREGA</p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-gray-900">{stats.pending}</span>
                <span className="text-orange-600 text-sm font-semibold flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>ACCIÓN REQUERIDA</span>
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">TOTAL RECAUDADO</p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">PROMEDIO PEDIDO</p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-gray-900">${stats.averageOrder}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL VER DETALLES */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detalles del Pedido"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm mb-1">ID Pedido</p>
                <p className="font-semibold text-gray-900">{selectedOrder.id}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Cliente</p>
                <p className="font-semibold text-gray-900">{selectedOrder.customer.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Fecha/Hora</p>
                <p className="font-semibold text-gray-900">{selectedOrder.datetime}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Total</p>
                <p className="font-semibold text-gray-900">${selectedOrder.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="font-semibold text-gray-900 mb-3">Artículos</p>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-600">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleEditOrder(selectedOrder);
                }}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
              >
                Editar
              </button>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg font-medium transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL EDITAR PEDIDO */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Pedido"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado de Pago</label>
              <select
                value={editForm.paymentStatus}
                onChange={(e) => setEditForm({ ...editForm, paymentStatus: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
              >
                <option value="Pagado">Pagado</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado de Entrega</label>
              <select
                value={editForm.deliveryStatus}
                onChange={(e) => setEditForm({ ...editForm, deliveryStatus: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Entregado">Entregado</option>
                <option value="No entregado">No entregado</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all"
              >
                Guardar
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg font-medium transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL CONFIRMAR ELIMINACIÓN */}
      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteConfirmOpen(false);
          setSelectedOrder(null);
        }}
        title="Eliminar Pedido"
        message="¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        isDangerous={true}
      />

      {/* MODAL CREAR NUEVO PEDIDO */}
      <Modal
        isOpen={isNewOrderModalOpen}
        onClose={() => {
          setIsNewOrderModalOpen(false);
          setNewOrderForm({ customerName: '', customerId: '', selectedItems: [] });
        }}
        title="Crear Nuevo Pedido"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Información del Cliente */}
          <div className="space-y-3 pb-4 border-b">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Cliente</label>
              <input
                type="text"
                value={newOrderForm.customerName}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, customerName: e.target.value })}
                placeholder="Ej: Juan Pérez"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID del Cliente (Opcional)</label>
              <input
                type="text"
                value={newOrderForm.customerId}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, customerId: e.target.value })}
                placeholder="Ej: 2023-1001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
              />
            </div>
          </div>

          {/* Productos del Menú */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Menú del Día</h3>
            <div className="grid grid-cols-1 gap-2">
              {availableMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAddItemToOrder(item)}
                  className="text-left p-3 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-lg transition-all border border-orange-200 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-orange-600 font-medium">${item.price.toFixed(2)}</p>
                  </div>
                  <Plus className="w-4 h-4 text-orange-600" />
                </button>
              ))}
            </div>
          </div>

          {/* Productos del Inventario */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Productos (Bebidas, Dulces)</h3>
            <div className="grid grid-cols-1 gap-2">
              {availableProducts.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAddItemToOrder(item)}
                  className="text-left p-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all border border-blue-200 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-blue-600 font-medium">${item.price.toFixed(2)}</p>
                  </div>
                  <Plus className="w-4 h-4 text-blue-600" />
                </button>
              ))}
            </div>
          </div>

          {/* Artículos Seleccionados */}
          {newOrderForm.selectedItems.length > 0 && (
            <div className="pt-4 border-t">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Artículos del Pedido</h3>
              <div className="space-y-2">
                {newOrderForm.selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-600">${item.price.toFixed(2)} c/u</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateItemQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded transition-all text-xs"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateItemQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded transition-all text-xs"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveItemFromOrder(item.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-all ml-2"
                        title="Eliminar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-900">Total del Pedido:</span>
                  <span className="text-lg font-bold text-orange-600">${calculateOrderTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex space-x-2 pt-4 border-t">
            <button
              onClick={handleSaveNewOrder}
              className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all"
            >
              Crear Pedido
            </button>
            <button
              onClick={() => {
                setIsNewOrderModalOpen(false);
                setNewOrderForm({ customerName: '', customerId: '', selectedItems: [] });
              }}
              className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg font-medium transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
