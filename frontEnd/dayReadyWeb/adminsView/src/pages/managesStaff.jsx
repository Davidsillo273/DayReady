import React, { useState } from 'react';
import { Search, Bell, UserCheck, Pencil, Trash2, Save, X } from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import Modal from '../Components/Modal';

const BASE_URL = 'http://localhost:4000/api';

const ROLE_CONFIG = {
    admin: { endpoint: 'admins', label: 'Administrador' },
    employee: { endpoint: 'employees', label: 'Empleado' },
};

export default function ManageStaff() {
    const [activeMenu, setActiveMenu] = useState('gestionar-equipo');
    const [activeTab, setActiveTab] = useState('admin'); // 'admin' | 'employee'

    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [results, setResults] = useState([]);

    const [selectedStaff, setSelectedStaff] = useState(null);
    const [editData, setEditData] = useState(null);
    const [editing, setEditing] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [saving, setSaving] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const getInitials = (name, lastName) => {
        const first = name?.[0] || '';
        const second = lastName?.[0] || '';
        return `${first}${second}`.toUpperCase();
    };

    const resetSelection = () => {
        setSelectedStaff(null);
        setEditData(null);
        setEditing(false);
        setSaveError('');
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setResults([]);
        setSearchQuery('');
        setSearchError('');
        resetSelection();
    };

    // --- Buscar admins/employees por nombre o correo ---
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchError('Ingresa un nombre o correo para buscar');
            return;
        }

        setSearching(true);
        setSearchError('');
        try {
            const { endpoint } = ROLE_CONFIG[activeTab];
            const params = new URLSearchParams();

            // Si parece correo, busca por email; si no, busca por nombre
            if (searchQuery.includes('@')) {
                params.append('email', searchQuery.trim());
            } else {
                params.append('name', searchQuery.trim());
            }

            const response = await fetch(`${BASE_URL}/${endpoint}?${params.toString()}`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                setSearchError(data.message || 'Error al buscar');
                setResults([]);
                return;
            }

            if (!data || data.length === 0) {
                setSearchError('No se encontraron resultados');
                setResults([]);
                return;
            }

            setResults(data);
        } catch (error) {
            console.error('Error al buscar:', error);
            setSearchError('No se pudo conectar con el servidor');
            setResults([]);
        } finally {
            setSearching(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleSelectStaff = (staff) => {
        setSelectedStaff(staff);
        setEditData({
            name: staff.name || '',
            lastName: staff.lastName || '',
            phone: staff.phone || '',
            local: staff.local || '',
            status: staff.status || 'active',
        });
        setEditing(false);
        setSaveError('');
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    // --- Guardar cambios ---
    const handleSave = async () => {
        setSaving(true);
        setSaveError('');
        try {
            const { endpoint } = ROLE_CONFIG[activeTab];

            const response = await fetch(`${BASE_URL}/${endpoint}/${selectedStaff._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(editData),
            });

            const data = await response.json();

            if (!response.ok) {
                setSaveError(data.message || 'Error al actualizar');
                return;
            }

            const updated = data.data;
            setSelectedStaff(updated);
            setResults(results.map((r) => (r._id === updated._id ? updated : r)));
            setEditing(false);
        } catch (error) {
            console.error('Error al guardar cambios:', error);
            setSaveError('No se pudo conectar con el servidor');
        } finally {
            setSaving(false);
        }
    };

    // --- Eliminar ---
    const handleDelete = async () => {
        setDeleting(true);
        try {
            const { endpoint } = ROLE_CONFIG[activeTab];

            const response = await fetch(`${BASE_URL}/${endpoint}/${selectedStaff._id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || 'Error al eliminar');
                return;
            }

            setResults(results.filter((r) => r._id !== selectedStaff._id));
            resetSelection();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error al eliminar:', error);
            alert('No se pudo conectar con el servidor');
        } finally {
            setDeleting(false);
        }
    };

    const roleLabel = ROLE_CONFIG[activeTab].label;

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

            <main className="flex-1 overflow-auto">
                {/* BARRA SUPERIOR */}
                <header className="bg-white shadow-sm sticky top-0 z-40">
                    <div className="px-8 py-4 flex items-center justify-between">
                        <h1 className="text-lg font-bold text-gray-900">Gestión de Equipo</h1>
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

                <div className="p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Gestión de Equipo</h1>
                        <p className="text-gray-600 text-sm mt-1">Administra los administradores y empleados de la plataforma.</p>
                    </div>

                    {/* TABS */}
                    <div className="flex space-x-2 mb-8 border-b border-gray-200">
                        <button
                            onClick={() => handleTabChange('admin')}
                            className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'admin'
                                    ? 'border-orange-500 text-orange-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Administradores
                        </button>
                        <button
                            onClick={() => handleTabChange('employee')}
                            className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'employee'
                                    ? 'border-orange-500 text-orange-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Empleados
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        {/* Panel Izquierdo - Búsqueda y resultados */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <Search className="w-5 h-5 text-orange-600" />
                                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                                        Buscar {roleLabel}
                                    </h2>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-2">Nombre o correo</label>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Ej: David Castro"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 text-sm"
                                        />
                                    </div>

                                    {searchError && (
                                        <p className="text-red-600 text-xs font-medium">{searchError}</p>
                                    )}

                                    <button
                                        onClick={handleSearch}
                                        disabled={searching}
                                        className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition-all text-sm disabled:opacity-50"
                                    >
                                        {searching ? 'Buscando...' : 'Buscar'}
                                    </button>
                                </div>
                            </div>

                            {/* Resultados de búsqueda */}
                            {results.length > 0 && (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">
                                        Resultados ({results.length})
                                    </p>
                                    <div className="space-y-2">
                                        {results.map((staff) => (
                                            <button
                                                key={staff._id}
                                                onClick={() => handleSelectStaff(staff)}
                                                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all text-left ${selectedStaff?._id === staff._id
                                                        ? 'bg-orange-50 border-2 border-orange-300'
                                                        : 'border-2 border-transparent hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="w-9 h-9 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 font-bold text-xs flex-shrink-0">
                                                    {getInitials(staff.name, staff.lastName)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                                        {staff.name} {staff.lastName}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">{staff.email}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Panel Derecho - Detalle / Edición */}
                        <div className="col-span-2">
                            <div className="bg-white rounded-lg shadow-sm p-8">
                                {selectedStaff ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-14 h-14 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 font-bold text-lg">
                                                    {getInitials(selectedStaff.name, selectedStaff.lastName)}
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-gray-900">
                                                        {selectedStaff.name} {selectedStaff.lastName}
                                                    </h2>
                                                    <p className="text-sm text-gray-500">{selectedStaff.email}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                {!editing ? (
                                                    <button
                                                        onClick={() => setEditing(true)}
                                                        className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-sm transition-all"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                        <span>Editar</span>
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={handleSave}
                                                            disabled={saving}
                                                            className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm transition-all disabled:opacity-50"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                            <span>{saving ? 'Guardando...' : 'Guardar'}</span>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setEditing(false);
                                                                handleSelectStaff(selectedStaff);
                                                            }}
                                                            disabled={saving}
                                                            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold text-sm transition-all disabled:opacity-50"
                                                        >
                                                            <X className="w-4 h-4" />
                                                            <span>Cancelar</span>
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => setIsDeleteModalOpen(true)}
                                                    className="flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold text-sm transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Eliminar</span>
                                                </button>
                                            </div>
                                        </div>

                                        {saveError && (
                                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                                <p className="text-red-600 text-sm">{saveError}</p>
                                            </div>
                                        )}

                                        <div className="flex items-center space-x-2 py-2 px-3 bg-green-100 rounded-lg w-fit">
                                            <UserCheck className="w-4 h-4 text-green-600" />
                                            <span className="text-xs font-semibold text-green-700 capitalize">{selectedStaff.status}</span>
                                        </div>

                                        {/* Formulario de datos */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-2">Nombre</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editData.name}
                                                    onChange={handleEditChange}
                                                    disabled={!editing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-2">Apellido</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={editData.lastName}
                                                    onChange={handleEditChange}
                                                    disabled={!editing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-2">Teléfono</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={editData.phone}
                                                    onChange={handleEditChange}
                                                    disabled={!editing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-2">Local</label>
                                                <input
                                                    type="text"
                                                    name="local"
                                                    value={editData.local}
                                                    onChange={handleEditChange}
                                                    disabled={!editing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-2">Estado</label>
                                                <select
                                                    name="status"
                                                    value={editData.status}
                                                    onChange={handleEditChange}
                                                    disabled={!editing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                                                >
                                                    <option value="active">Activo</option>
                                                    <option value="inactive">Inactivo</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-16 text-center">
                                        <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-600 text-sm">
                                            Busca y selecciona un {roleLabel.toLowerCase()} para ver y editar su información
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* MODAL CONFIRMAR ELIMINACIÓN */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title={`Eliminar ${roleLabel}`}
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-700">
                        ¿Estás seguro que deseas eliminar a{' '}
                        <strong>{selectedStaff?.name} {selectedStaff?.lastName}</strong>? Esta acción no se puede deshacer.
                    </p>

                    <div className="flex space-x-3 pt-4">
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
                        >
                            {deleting ? 'Eliminando...' : 'Sí, eliminar'}
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={deleting}
                            className="flex-1 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg font-semibold transition-all disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}