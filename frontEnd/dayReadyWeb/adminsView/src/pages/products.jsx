import { useState, useEffect } from 'react';
import { Search, Bell, Filter, Plus, X } from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import ProductTable from '../Components/ProductTable';
import Modal from '../Components/Modal';
import ConfirmModal from '../Components/ConfirmModal';
import FormAddProduct from '../Components/FormAddProduct';

const BASE_URL = 'http://localhost:4000/api';

const CATEGORIES = [
  { id: 'todos',         label: 'Todos los productos' },
  { id: 'combos',        label: 'Combos'        },
  { id: 'saludable',     label: 'Saludable'     },
  { id: 'comida rápida', label: 'Comida Rápida' },
  { id: 'bebida',        label: 'Bebida'        },
  { id: 'sopa',          label: 'Sopa'          },
];

const SERVICE_TYPES = [
  { id: 'todos',      label: 'Todos'       },
  { id: 'Presencial', label: 'Presencial'  },
  { id: 'Delivery',   label: 'Delivery'    },
  { id: 'Ambos',      label: 'Ambos'       },
];

const STOCK_OPTIONS = [
  { id: 'todos',    label: 'Todos'     },
  { id: 'activo',   label: 'Activo'    },
  { id: 'inactivo', label: 'Inactivo'  },
];

export default function Products() {
  const [activeMenu, setActiveMenu]             = useState('productos');
  const [searchQuery, setSearchQuery]           = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Local 1');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [currentPage, setCurrentPage]           = useState(1);

  // Filtros extra
  const [showExtraFilters, setShowExtraFilters] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState('todos');
  const [selectedStock, setSelectedStock]             = useState('todos');

  // Datos
  const [products, setProducts]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitting, setSubmitting]         = useState(false);

  // Modales
  const [isModalOpen, setIsModalOpen]                   = useState(false);
  const [isEditModalOpen, setIsEditModalOpen]           = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen]   = useState(false);
  const [selectedProduct, setSelectedProduct]           = useState(null);

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const mapProduct = (p) => ({
    id: p._id,
    name: p.name,
    description: p.description,
    category: p.category,
    serviceType: p.type,
    price: p.price,
    stock: p.quantity,
    status: p.quantity > 0 ? 'Activo' : 'Inactivo',
    image: p.image || 'https://via.placeholder.com/100',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${BASE_URL}/products`, { credentials: 'include' });
        if (!res.ok) throw new Error('Error al cargar los productos');
        const data = await res.json();
        setProducts(data.map(mapProduct));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const reload = async () => {
    const res = await fetch(`${BASE_URL}/products`, { credentials: 'include' });
    if (!res.ok) throw new Error('Error al recargar');
    const data = await res.json();
    setProducts(data.map(mapProduct));
  };

  const handleAddProduct = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('type', formData.serviceType || '');
      data.append('price', formData.price);
      data.append('quantity', formData.stock);
      if (formData.image instanceof File) data.append('image', formData.image);
      const res = await fetch(`${BASE_URL}/products`, { method: 'POST', credentials: 'include', body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Error al crear el producto');
      await reload();
      setIsModalOpen(false);
      showSuccess('Producto creado exitosamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProduct = async (formData) => {
    if (!selectedProduct) return;
    try {
      setSubmitting(true);
      setError(null);
      const data = new FormData();
      if (formData.name)        data.append('name', formData.name);
      if (formData.description) data.append('description', formData.description);
      if (formData.category)    data.append('category', formData.category);
      if (formData.serviceType) data.append('type', formData.serviceType);
      if (formData.price)       data.append('price', formData.price);
      if (formData.stock)       data.append('quantity', formData.stock);
      if (formData.image instanceof File) data.append('image', formData.image);
      const res = await fetch(`${BASE_URL}/products/${selectedProduct.id}`, { method: 'PUT', credentials: 'include', body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Error al actualizar');
      await reload();
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      showSuccess('Producto actualizado exitosamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      setSubmitting(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/products/${selectedProduct}`, { method: 'DELETE', credentials: 'include' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Error al eliminar');
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct));
      setIsDeleteConfirmOpen(false);
      setSelectedProduct(null);
      showSuccess('Producto eliminado exitosamente');
    } catch (err) {
      setError(err.message);
      setIsDeleteConfirmOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const activeExtraFilters = [selectedServiceType, selectedStock].filter((f) => f !== 'todos').length;

  const resetExtraFilters = () => {
    setSelectedServiceType('todos');
    setSelectedStock('todos');
  };

  // Filtrado completo
  const filteredProducts = products.filter((p) => {
    const matchCat     = selectedCategory === 'todos' || p.category === selectedCategory;
    const matchService = selectedServiceType === 'todos' || p.serviceType === selectedServiceType;
    const matchStock   = selectedStock === 'todos'
      || (selectedStock === 'activo'   && p.stock > 0)
      || (selectedStock === 'inactivo' && p.stock === 0);
    const q = searchQuery.trim().toLowerCase();
    const matchSearch  = !q || `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q);
    return matchCat && matchService && matchStock && matchSearch;
  });

  const itemsPerPage = 3;
  const totalPages   = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const startIdx     = (currentPage - 1) * itemsPerPage;
  const paginated    = filteredProducts.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <main className="flex-1 overflow-auto">
        {/* Barra superior */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-6 flex-1">
              <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}
                      className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium focus:outline-none border border-gray-200 text-sm">
                <option>Local 1</option>
                <option>Local 2</option>
                <option>Local 3</option>
              </select>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="text" placeholder="Buscar producto..."
                       value={searchQuery}
                       onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                       className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none border border-gray-200 focus:border-orange-400 text-sm" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 font-bold text-lg">DR</div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
            <p className="text-gray-600 text-sm mt-1">Administra bebidas, dulces y otros productos del cafetín</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>
          )}
          {successMessage && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-200">{successMessage}</div>
          )}

          {/* Controles */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
                      className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold flex items-center space-x-2 text-sm transition-all">
                <Plus className="w-4 h-4" /><span>Agregar Producto</span>
              </button>
              <button onClick={() => setShowExtraFilters((v) => !v)}
                      className={`px-3 py-2 border rounded-lg flex items-center space-x-2 text-sm transition-all relative ${
                        showExtraFilters ? 'border-orange-400 text-orange-500 bg-orange-50' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}>
                <Filter className="w-4 h-4" /><span>Más filtros</span>
                {activeExtraFilters > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                    {activeExtraFilters}
                  </span>
                )}
              </button>
            </div>

            {/* Filtros por categoría */}
            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                          selectedCategory === cat.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}>
                  {cat.label}
                </button>
              ))}
            </div>

            {showExtraFilters && (
              <div className="border-t border-gray-200 pt-4 mt-2">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700">Filtros adicionales</p>
                  {activeExtraFilters > 0 && (
                    <button onClick={resetExtraFilters}
                            className="text-xs text-orange-500 hover:text-orange-600 flex items-center space-x-1">
                      <X className="w-3 h-3" /><span>Limpiar filtros</span>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {/* Tipo de servicio */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Tipo de Servicio</p>
                    <div className="flex flex-wrap gap-2">
                      {SERVICE_TYPES.map((t) => (
                        <button key={t.id} onClick={() => { setSelectedServiceType(t.id); setCurrentPage(1); }}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                  selectedServiceType === t.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Estado</p>
                    <div className="flex flex-wrap gap-2">
                      {STOCK_OPTIONS.map((s) => (
                        <button key={s.id} onClick={() => { setSelectedStock(s.id); setCurrentPage(1); }}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                  selectedStock === s.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-gray-500">Cargando productos...</div>
            ) : (
              <>
                <ProductTable
                  products={paginated}
                  onEdit={(product) => { setSelectedProduct(product); setIsEditModalOpen(true); }}
                  onDelete={(id) => { setSelectedProduct(id); setIsDeleteConfirmOpen(true); }}
                />
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    {filteredProducts.length === 0
                      ? 'Sin resultados'
                      : `mostrando ${startIdx + 1} a ${Math.min(startIdx + itemsPerPage, filteredProducts.length)} de ${filteredProducts.length} productos`}
                  </p>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 text-sm">
                      Anterior
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button key={page} onClick={() => setCurrentPage(page)}
                              className={`w-8 h-8 rounded-lg font-medium text-sm ${
                                currentPage === page ? 'bg-orange-500 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                              }`}>
                        {page}
                      </button>
                    ))}
                    <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 text-sm">
                      Siguiente
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
             title="Agregar Nuevo Producto" description="Completa los detalles del producto para agregarlo al catálogo.">
        <FormAddProduct onSubmit={handleAddProduct} onCancel={() => setIsModalOpen(false)} submitting={submitting} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}
             title="Editar Producto" description="Actualiza los detalles del producto.">
        <FormAddProduct initialProduct={selectedProduct} onSubmit={handleUpdateProduct}
                        onCancel={() => setIsEditModalOpen(false)} submitting={submitting} />
      </Modal>

      <ConfirmModal isOpen={isDeleteConfirmOpen} onConfirm={handleConfirmDelete}
                    onCancel={() => { setIsDeleteConfirmOpen(false); setSelectedProduct(null); }}
                    title="Eliminar Producto"
                    message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
                    confirmText="Eliminar" isDangerous={true} />
    </div>
  );
}