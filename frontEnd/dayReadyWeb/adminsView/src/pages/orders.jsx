import { useState, useEffect } from 'react';
import { Search, Bell, Plus, Filter, Eye, Edit2, Trash2, AlertCircle, X } from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import Modal from '../Components/Modal';
import ConfirmModal from '../Components/ConfirmModal';

const BASE_URL = 'http://localhost:4000/api';

export default function Orders() {
  const [activeMenu, setActiveMenu] = useState('pedidos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Local 1');
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);

  // Estados para pedidos
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Estado para productos reales desde la API
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // Estado para nuevo pedido
  const [newOrderForm, setNewOrderForm] = useState({
    customerName: '',
    customerId: '',
    selectedItems: [],
  });

  // Modales
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Función para mostrar mensaje de éxito
  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Mapear orden del backend al formato del frontend
  const mapOrder = (backendOrder) => ({
    id: backendOrder._id,
    customer: {
      name: backendOrder.customerName,
      contact: backendOrder.customerContact || 'N/A',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(backendOrder.customerName)}&background=orange&color=fff&size=32`,
    },
    datetime: `${new Date(backendOrder.fecha).toLocaleDateString('es-ES')}, ${backendOrder.horaCreacion}`,
    paymentStatus: backendOrder.estadoPago ? 'Pagado' : 'Pendiente',
    deliveryStatus: backendOrder.estado.charAt(0).toUpperCase() + backendOrder.estado.slice(1),
    total: backendOrder.total,
    items: backendOrder.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price * item.quantity,
    })),
    _raw: backendOrder,
  });

  // Cargar órdenes
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/orders`, { credentials: 'include' });
      if (!res.ok) throw new Error('Error al cargar los pedidos');
      const data = await res.json();
      setOrders(data.map(mapOrder));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos desde la API
  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      const res = await fetch(`${BASE_URL}/products`, { credentials: 'include' });
      if (!res.ok) throw new Error('Error al cargar productos');
      const data = await res.json();
      // Mapear a formato con id, name, price, category, quantity
      const mapped = data.map(p => ({
        id: p._id,
        name: p.name,
        price: p.price,
        category: p.category,
        quantity: p.quantity,
      }));
      setAllProducts(mapped);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  // Cargar datos al montar
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Cargar órdenes y productos en paralelo
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`${BASE_URL}/orders`, { credentials: 'include' }),
          fetch(`${BASE_URL}/products`, { credentials: 'include' }),
        ]);

        if (!ordersRes.ok) throw new Error('Error al cargar los pedidos');
        if (!productsRes.ok) throw new Error('Error al cargar productos');

        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();

        if (isMounted) {
          setOrders(ordersData.map(mapOrder));
          setAllProducts(productsData.map(p => ({
            id: p._id,
            name: p.name,
            price: p.price,
            category: p.category,
            quantity: p.quantity,
          })));
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []); // Solo una vez al montar

  // Función para recargar después de cambios (usando un flag para forzar recarga)
  const [refreshKey, setRefreshKey] = useState(0);

  // Este efecto se ejecuta cuando refreshKey cambia
  useEffect(() => {
    let isMounted = true;

    const reloadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`${BASE_URL}/orders`, { credentials: 'include' }),
          fetch(`${BASE_URL}/products`, { credentials: 'include' }),
        ]);

        if (!ordersRes.ok) throw new Error('Error al cargar los pedidos');
        if (!productsRes.ok) throw new Error('Error al cargar productos');

        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();

        if (isMounted) {
          setOrders(ordersData.map(mapOrder));
          setAllProducts(productsData.map(p => ({
            id: p._id,
            name: p.name,
            price: p.price,
            category: p.category,
            quantity: p.quantity,
          })));
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    reloadData();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const reload = () => setRefreshKey(prev => prev + 1);

  // Crear nuevo pedido
  const handleSaveNewOrder = async () => {
    if (!newOrderForm.customerName || newOrderForm.selectedItems.length === 0) {
      alert('Por favor completa el nombre del cliente y agrega al menos un producto');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const orderData = {
        customerName: newOrderForm.customerName,
        customerContact: newOrderForm.customerId || '',
        items: newOrderForm.selectedItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: calculateOrderTotal(),
        estadoPago: false,
        estado: 'pendiente',
      };

      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Error al crear el pedido');

      await reload();
      setIsNewOrderModalOpen(false);
      setNewOrderForm({ customerName: '', customerId: '', selectedItems: [] });
      showSuccess('Pedido creado exitosamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Actualizar pedido
  const handleSaveEdit = async () => {
    if (!selectedOrder) return;
    try {
      setSubmitting(true);
      setError(null);

      const updateData = {
        estadoPago: editForm.paymentStatus === 'Pagado',
        estado: editForm.deliveryStatus.toLowerCase(),
      };

      const res = await fetch(`${BASE_URL}/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Error al actualizar el pedido');

      await reload();
      setIsEditModalOpen(false);
      setSelectedOrder(null);
      showSuccess('Pedido actualizado exitosamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Eliminar pedido
  const handleConfirmDelete = async () => {
    if (!selectedOrder) return;
    try {
      setSubmitting(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/orders/${selectedOrder.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Error al eliminar el pedido');

      await reload();
      setIsDeleteConfirmOpen(false);
      setSelectedOrder(null);
      showSuccess('Pedido eliminado exitosamente');
    } catch (err) {
      setError(err.message);
      setIsDeleteConfirmOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  // Funciones auxiliares para el formulario de nuevo pedido
  const handleAddItemToOrder = (product) => {
    const existingItem = newOrderForm.selectedItems.find(item => item.id === product.id);
    if (existingItem) {
      setNewOrderForm({
        ...newOrderForm,
        selectedItems: newOrderForm.selectedItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      });
    } else {
      setNewOrderForm({
        ...newOrderForm,
        selectedItems: [...newOrderForm.selectedItems, { ...product, quantity: 1 }],
      });
    }
  };

  const handleRemoveItemFromOrder = (productId) => {
    setNewOrderForm({
      ...newOrderForm,
      selectedItems: newOrderForm.selectedItems.filter(item => item.id !== productId),
    });
  };

  const handleUpdateItemQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveItemFromOrder(productId);
    } else {
      setNewOrderForm({
        ...newOrderForm,
        selectedItems: newOrderForm.selectedItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        ),
      });
    }
  };

  const calculateOrderTotal = () => {
    return newOrderForm.selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Handlers para los botones de acciones
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setEditForm({
      paymentStatus: order.paymentStatus,
      deliveryStatus: order.deliveryStatus,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteOrder = (order) => {
    setSelectedOrder(order);
    setIsDeleteConfirmOpen(true);
  };

  // Filtrado y paginación
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

  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIdx, startIdx + itemsPerPage);

  // Estadísticas
 // Estadísticas
const todayStr = new Date().toLocaleDateString('es-ES');
const stats = {
  today: orders.filter(o => {
    const datePart = o.datetime.split(',')[0];
    return datePart === todayStr;
  }).length,
  pending: orders.filter(o => o.deliveryStatus === 'Pendiente').length,
  totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
  averageOrder: orders.length ? (orders.reduce((sum, o) => sum + o.total, 0) / orders.length).toFixed(2) : '0.00',
};

  const getStatusDot = (status) => {
    if (status === 'Pagado' || status === 'Entregado') return 'bg-green-500';
    if (status === 'Pendiente') return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Definir categorías para menú del día (ajusta según tu base de datos)
  const menuCategories = ['combos', 'saludable', 'comida rápida', 'sopa'];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <main className="flex-1 overflow-auto">
        {/* Barra superior (sin cambios) */}
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

        {/* Contenido */}
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
              <p className="text-gray-600 text-sm mt-1">Monitorea y gestiona todos los pedidos de los clientes en tiempo real.</p>
            </div>
            <button
              onClick={() => setIsNewOrderModalOpen(true)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all flex items-center space-x-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Pedido</span>
            </button>
          </div>

          {/* Mensajes de error/éxito */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-200">
              {successMessage}
            </div>
          )}

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'todos', label: 'Todos los pedidos' },
                  { id: 'pendientes', label: 'Pendientes' },
                  { id: 'entregados', label: 'Entregados' },
                  { id: 'no-entregados', label: 'No Entregados' },
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

          {/* Tabla */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-gray-500">
                Cargando pedidos...
              </div>
            ) : (
              <>
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
              </>
            )}
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

      {/* MODALES (sin cambios estructurales, solo se actualizan las listas de productos) */}

      {/* Modal Ver Detalles */}
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

      {/* Modal Editar Pedido */}
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
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all disabled:opacity-50"
              >
                {submitting ? 'Guardando...' : 'Guardar'}
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

      {/* Modal Confirmar Eliminación */}
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

      {/* Modal Crear Nuevo Pedido con productos dinámicos */}
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

          {/* Productos del Menú (filtrados por categoría) */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Menú del Día</h3>
            {productsLoading ? (
              <p className="text-gray-500 text-sm">Cargando productos...</p>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {allProducts
                  .filter(p => menuCategories.includes(p.category?.toLowerCase()))
                  .filter(p => p.quantity > 0)
                  .map((item) => (
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
                {allProducts.filter(p => menuCategories.includes(p.category?.toLowerCase())).length === 0 && (
                  <p className="text-gray-500 text-sm">No hay productos en el menú</p>
                )}
              </div>
            )}
          </div>

          {/* Productos del Inventario (resto de categorías) */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Productos (Bebidas, Dulces)</h3>
            {productsLoading ? (
              <p className="text-gray-500 text-sm">Cargando productos...</p>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {allProducts
                  .filter(p => !menuCategories.includes(p.category?.toLowerCase()))
                  .filter(p => p.quantity > 0)
                  .map((item) => (
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
                {allProducts.filter(p => !menuCategories.includes(p.category?.toLowerCase())).length === 0 && (
                  <p className="text-gray-500 text-sm">No hay productos en esta categoría</p>
                )}
              </div>
            )}
          </div>

          {/* Artículos Seleccionados (sin cambios) */}
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
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all disabled:opacity-50"
            >
              {submitting ? 'Creando...' : 'Crear Pedido'}
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