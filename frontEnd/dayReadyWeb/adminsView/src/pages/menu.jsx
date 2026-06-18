import { useState, useEffect } from 'react';
import { Search, Bell, Filter, Plus } from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import ProductTable from '../Components/ProductTable';
import Modal from '../Components/Modal';
import ConfirmModal from '../Components/ConfirmModal';
import FormAddMenu from '../Components/FormAddMenu';

const BASE_URL = 'http://localhost:4000/api';

const DAYS = ['all', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Menu() {
  const [activeMenu, setActiveMenu]  = useState('menu');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Local 1');
  const [selectedDay, setSelectedDay] = useState('all');
  const [currentPage, setCurrentPage]  = useState(1);

  const [menus, setMenus]  = useState([]);
  const [loading, setLoading]  = useState(true);
  const [error, setError]  = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitting, setSubmitting]  = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const mapMenu = (m) => ({
    id: m._id,
    name: m.name,
    description: m.description,
    category: m.dayOfWeek,
    price: m.price,
    stock: m.stock,
    status: m.stock > 0 ? 'Activo' : 'Inactivo',
    image: m.image || 'https://via.placeholder.com/100',
    dayOfWeek: m.dayOfWeek,
    productId: m.productId,
  });

  //cargar menús
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/menu`, { credentials: 'include' });
        if (!res.ok) throw new Error('Error al cargar menús');
        const data = await res.json();
        setMenus(data.map(mapMenu));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  const reload = async () => {
    const res = await fetch(`${BASE_URL}/menu`, { credentials: 'include' });
    if (!res.ok) throw new Error('Error al cargar menús');
    const data = await res.json();
    setMenus(data.map(mapMenu));
  };

  //crear menú
  const handleAddMenu = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          dayOfWeek:formData.dayOfWeek,
          productId:formData.productId,
          image:formData.image,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Error al agregar menús');
      await reload();
      setIsModalOpen(false);
      showSuccess('Menú agregado exitosamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  //actualizar menú
  const handleUpdateMenu = async (formData) => {
    if (!selectedMenu) return;
    try {
      setSubmitting(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/menu/${selectedMenu.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock:  parseInt(formData.stock),
          dayOfWeek:formData.dayOfWeek,
          productId: formData.productId,
          image: formData.image,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Error al actualizar menús');
      await reload();
      setIsEditModalOpen(false);
      setSelectedMenu(null);
      showSuccess('Menú actualizado exitosamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  //eliminar menú
  const handleConfirmDelete = async () => {
    if (!selectedMenu) return;
    try {
      setSubmitting(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/menu/${selectedMenu}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Error al elimar menú');
      setMenus((prev) => prev.filter((m) => m.id !== selectedMenu));
      setIsDeleteConfirmOpen(false);
      setSelectedMenu(null);
      showSuccess('Menú eliminado');
    } catch (err) {
      setError(err.message);
      setIsDeleteConfirmOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMenus = menus.filter((m) => {
    const matchDay = selectedDay === 'all' || m.dayOfWeek === selectedDay;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch = !q || m.name.toLowerCase().includes(q);
    return matchDay && matchSearch;
  });

  const itemsPerPage = 3;
  const totalPages = Math.max(1, Math.ceil(filteredMenus.length / itemsPerPage));
  const startIdx= (currentPage - 1) * itemsPerPage;
  const paginated = filteredMenus.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <main className="flex-1 overflow-auto">
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
                <input type="text" placeholder="Search menu..."
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
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 font-bold text-lg">DE</div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Gestión del menú del Día</h1>
            <p className="text-gray-600 text-sm mt-1">Administra los platillos del menú del día</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>
          )}
          {successMessage && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-200">{successMessage}</div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => { setSelectedMenu(null); setIsModalOpen(true); }}
                      className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold flex items-center space-x-2 text-sm transition-all">
                <Plus className="w-4 h-4" /><span>Agregar Menú</span>
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center space-x-2 text-sm">
                <Filter className="w-4 h-4" /><span>Más flitros</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <button key={day} onClick={() => { setSelectedDay(day); setCurrentPage(1); }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                          selectedDay === day ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}>
                  {day === 'all' ? 'All menus' : day}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-gray-500">Cargando menús...</div>
            ) : menus.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <p className="text-lg font-medium">No hay menús agregados</p>
                <p className="text-sm mt-1">Haz click en Nuevo menú </p>
              </div>
            ) : (
              <>
                <ProductTable
                  products={paginated}
                  onEdit={(menu) => { setSelectedMenu(menu); setIsEditModalOpen(true); }}
                  onDelete={(id) => { setSelectedMenu(id); setIsDeleteConfirmOpen(true); }}
                />
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    {filteredMenus.length === 0
                      ? 'No results'
                      : `showing ${startIdx + 1} to ${Math.min(startIdx + itemsPerPage, filteredMenus.length)} of ${filteredMenus.length} menus`}
                  </p>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 text-sm">
                      Previous
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
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
             title="Add Daily Menu" description="Complete the dish details to add it to today's menu.">
        <FormAddMenu onSubmit={handleAddMenu} onCancel={() => setIsModalOpen(false)} submitting={submitting} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}
             title="Edit Menu" description="Update the dish details.">
        <FormAddMenu initialMenu={selectedMenu} onSubmit={handleUpdateMenu}
                     onCancel={() => setIsEditModalOpen(false)} submitting={submitting} />
      </Modal>

      <ConfirmModal isOpen={isDeleteConfirmOpen} onConfirm={handleConfirmDelete}
                    onCancel={() => { setIsDeleteConfirmOpen(false); setSelectedMenu(null); }}
                    title="Delete Menu"
                    message="Are you sure you want to delete this menu item? This action cannot be undone."
                    confirmText="Delete" isDangerous={true} />
    </div>
  );
}
