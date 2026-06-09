import React, { useState } from 'react';
import { Search, Bell, ChevronRight, Filter, Plus } from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import ProductTable from '../Components/ProductTable';
import Modal from '../Components/Modal';
import ConfirmModal from '../Components/ConfirmModal';
import FormAddProduct from '../Components/FormAddProduct';
import Button from '../Components/Button';

export default function Products() {
  const [activeMenu, setActiveMenu] = useState('productos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Local 1');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Jugo Natural Naranja',
      sku: 'DR-001-B',
      category: 'bebida',
      price: 2.5,
      stock: 60,
      status: 'Activo',
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd1f89c8?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      name: 'Refresco Cola 500ml',
      sku: 'DR-002-B',
      category: 'bebida',
      price: 1.75,
      stock: 40,
      status: 'Activo',
      image: 'https://images.unsplash.com/photo-1554866585-60550dab2c18?w=100&h=100&fit=crop',
    },
    {
      id: 3,
      name: 'Galletas de Chocolate',
      sku: 'DR-003-D',
      category: 'dulce',
      price: 1.5,
      stock: 35,
      status: 'Activo',
      image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=100&h=100&fit=crop',
    },
    {
      id: 4,
      name: 'Brownie de Chocolate',
      sku: 'DR-004-D',
      category: 'dulce',
      price: 2.0,
      stock: 25,
      status: 'Activo',
      image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=100&h=100&fit=crop',
    },
    {
      id: 5,
      name: 'Café Americano',
      sku: 'DR-005-B',
      category: 'bebida',
      price: 1.25,
      stock: 50,
      status: 'Activo',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=100&h=100&fit=crop',
    },
    {
      id: 6,
      name: 'Donut de Fresa',
      sku: 'DR-006-D',
      category: 'dulce',
      price: 1.8,
      stock: 20,
      status: 'Activo',
      image: 'https://images.unsplash.com/photo-1585074213823-e92342dce146?w=100&h=100&fit=crop',
    },
  ]);

  // Filtrar productos
  const filteredProducts =
    selectedCategory === 'todos'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  // Datos de categorías
  const categories = [
    { id: 'todos', label: 'Todos los productos' },
    { id: 'bebida', label: 'Bebidas' },
    { id: 'dulce', label: 'Dulces' },
    { id: 'snack', label: 'Snacks' },
  ];

  // Paginación
  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIdx, startIdx + itemsPerPage);

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = (productId) => {
    setSelectedProduct(productId);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setProducts(products.filter((p) => p.id !== selectedProduct));
    setIsDeleteConfirmOpen(false);
    setSelectedProduct(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdateProduct = (formData) => {
    const updatedProducts = products.map((p) =>
      p.id === selectedProduct.id
        ? {
            ...p,
            name: formData.name,
            category: formData.category,
            description: formData.description,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            image: formData.image ? URL.createObjectURL(formData.image) : p.image,
          }
        : p
    );
    setProducts(updatedProducts);
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddProduct = (formData) => {
    const newProduct = {
      id: products.length + 1,
      name: formData.name,
      sku: `DR-${String(products.length + 1).padStart(3, '0')}-${formData.category.charAt(0).toUpperCase()}`,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      status: 'Activo',
      image: formData.image ? URL.createObjectURL(formData.image) : 'https://via.placeholder.com/100',
    };
    setProducts([...products, newProduct]);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
                  placeholder="Buscar producto..."
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
            <p className="text-gray-600 text-sm mt-1">Administra bebidas, dulces y otros productos del cafetín</p>
          </div>

          {/* Controles */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all flex items-center space-x-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Producto</span>
              </button>

              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all flex items-center space-x-2 text-sm">
                  <Filter className="w-4 h-4" />
                  <span>mas filtros</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    selectedCategory === cat.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabla de productos */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <ProductTable
              products={paginatedProducts}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />

            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                mostrando {startIdx + 1} a {Math.min(startIdx + itemsPerPage, filteredProducts.length)} de{' '}
                {filteredProducts.length} productos
              </p>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                >
                  Anterior
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL AGREGAR PRODUCTO */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Agregar Nuevo Producto"
        description="Completa los detalles del producto para agregarlo al catálogo."
      >
        <FormAddProduct onSubmit={handleAddProduct} onCancel={handleCloseModal} />
      </Modal>

      {/* MODAL EDITAR PRODUCTO */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Producto"
        description="Actualiza los detalles del producto."
      >
        <FormAddProduct
          initialProduct={selectedProduct}
          onSubmit={handleUpdateProduct}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* MODAL CONFIRMAR ELIMINACIÓN */}
      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Eliminar Producto"
        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        isDangerous={true}
      />
    </div>
  );
}
