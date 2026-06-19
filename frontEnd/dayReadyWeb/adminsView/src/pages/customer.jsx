import React, { useState } from 'react';
import { Search, Bell, UserCheck, DollarSign, Wallet, Filter } from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import Modal from '../Components/Modal';
import Button from '../Components/Button';

const BASE_URL = 'http://localhost:4000/api';

export default function Clients() {
  const [activeMenu, setActiveMenu] = useState('clientes');
  const [selectedLocation, setSelectedLocation] = useState('Local Principal');
  const [searchQuery, setSearchQuery] = useState('');
  const [clientIdSearch, setClientIdSearch] = useState('');
  const [clientNameSearch, setClientNameSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [recharging, setRecharging] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [recentRecharges, setRecentRecharges] = useState([]);

  const predefinedAmounts = [5.00, 10.00, 20.00, 50.00];

  const getInitials = (name, lastName) => {
    const first = name?.[0] || '';
    const second = lastName?.[0] || '';
    return `${first}${second}`.toUpperCase();
  };

  // --- Buscar cliente en el backend por carnet o por nombre ---
  const handleSearchClient = async () => {
    if (!clientIdSearch.trim() && !clientNameSearch.trim()) {
      setSearchError('Ingresa un ID o un nombre para buscar');
      return;
    }

    setSearching(true);
    setSearchError('');
    try {
      const params = new URLSearchParams();
      if (clientIdSearch.trim()) params.append('carnet', clientIdSearch.trim());
      if (clientNameSearch.trim()) params.append('name', clientNameSearch.trim());

      const response = await fetch(`${BASE_URL}/customers?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setSearchError(data.message || 'Error al buscar cliente');
        setSelectedClient(null);
        return;
      }

      if (!data || data.length === 0) {
        setSearchError('Cliente no encontrado');
        setSelectedClient(null);
        return;
      }

      // Tomamos el primer resultado que coincida
      const found = data[0];
      setSelectedClient(found);
      setSelectedAmount('');
      setCustomAmount('');
    } catch (error) {
      console.error('Error al buscar cliente:', error);
      setSearchError('No se pudo conectar con el servidor');
      setSelectedClient(null);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectAmount = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value) {
      setSelectedAmount('');
    }
  };

  const getTotalAmount = () => {
    if (selectedAmount) {
      return selectedAmount;
    }
    return customAmount ? parseFloat(customAmount) : 0;
  };

  // --- Confirmar recarga: llama al backend para sumar el balance ---
  const handleConfirmRecharge = async () => {
    const totalAmount = getTotalAmount();
    if (totalAmount <= 0 || !selectedClient) {
      alert('Por favor selecciona o ingresa un monto válido');
      return;
    }

    setRecharging(true);
    try {
      const response = await fetch(`${BASE_URL}/customers/${selectedClient._id}/balance`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount: totalAmount }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Error al cargar el saldo');
        return;
      }

      const updatedClient = data.data;

      const newRecharge = {
        id: Date.now(),
        clientName: `${updatedClient.name} ${updatedClient.lastName}`,
        clientId: `ID: ${updatedClient.carnet}`,
        initials: getInitials(updatedClient.name, updatedClient.lastName),
        amount: totalAmount,
        date: new Date().toLocaleString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        paymentMethod: 'Caja / Manual',
        status: 'Exitoso'
      };

      setRecentRecharges([newRecharge, ...recentRecharges]);
      setSelectedClient(updatedClient);
      setSelectedAmount('');
      setCustomAmount('');
      setIsConfirmModalOpen(false);

      setTimeout(() => {
        alert(`Recarga de $${totalAmount.toFixed(2)} realizada exitosamente para ${updatedClient.name} ${updatedClient.lastName}`);
      }, 300);
    } catch (error) {
      console.error('Error al confirmar recarga:', error);
      alert('No se pudo conectar con el servidor');
    } finally {
      setRecharging(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClient();
    }
  };

  const getStatusColor = (status) => {
    return status === 'Exitoso' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  };

  const getAmountColor = (amount) => {
    return amount > 0 ? 'text-green-600' : 'text-gray-600';
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
                  placeholder="Buscar estudiantes, transacciones..."
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Recarga de Saldo</h1>
            <p className="text-gray-600 text-sm mt-1">Gestiona las billeteras digitales y saldos de los clientes.</p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Panel Izquierdo - Búsqueda y Cliente Seleccionado */}
            <div className="space-y-6">
              {/* Búsqueda de Cliente */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Search className="w-5 h-5 text-orange-600" />
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Buscar Cliente</h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Carnet (ID) del cliente</label>
                    <input
                      type="text"
                      value={clientIdSearch}
                      onChange={(e) => setClientIdSearch(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ej: 20230045"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Nombre completo</label>
                    <input
                      type="text"
                      value={clientNameSearch}
                      onChange={(e) => setClientNameSearch(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ej: Mateo Rodriguez"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 text-sm"
                    />
                  </div>

                  {searchError && (
                    <p className="text-red-600 text-xs font-medium">{searchError}</p>
                  )}

                  <button
                    onClick={handleSearchClient}
                    disabled={searching}
                    className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition-all text-sm disabled:opacity-50"
                  >
                    {searching ? 'Buscando...' : 'Buscar'}
                  </button>
                </div>
              </div>

              {/* Cliente Seleccionado */}
              {selectedClient && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">Cliente Seleccionado</p>

                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                      {getInitials(selectedClient.name, selectedClient.lastName)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{selectedClient.name} {selectedClient.lastName}</p>
                      <p className="text-xs text-gray-600">ID: {selectedClient.carnet}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 py-2 px-3 bg-green-100 rounded-lg">
                    <UserCheck className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-green-700 capitalize">{selectedClient.status}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Panel Derecho - Cargar Saldo */}
            <div className="col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Cargar Saldo</h2>
                  <p className="text-gray-600 text-sm">
                    Agrega fondos a la cuenta de {selectedClient ? `${selectedClient.name} ${selectedClient.lastName}` : 'cliente'}
                  </p>
                </div>

                {selectedClient ? (
                  <div className="space-y-6">
                    {/* Saldo Actual */}
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                      <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">Saldo Actual</p>
                      <p className="text-3xl font-bold text-orange-600">${(selectedClient.balance ?? 0).toFixed(2)}</p>
                    </div>

                    {/* Montos Predefinidos */}
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-3">Selecciona un monto o ingresa uno personalizado</p>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {predefinedAmounts.map((amount) => (
                          <button
                            key={amount}
                            onClick={() => handleSelectAmount(amount)}
                            className={`py-3 px-4 rounded-lg font-semibold transition-all text-sm border-2 ${selectedAmount === amount
                                ? 'bg-orange-500 text-white border-orange-500'
                                : 'bg-white text-orange-600 border-orange-300 hover:border-orange-500'
                              }`}
                          >
                            ${amount.toFixed(2)}
                          </button>
                        ))}
                      </div>

                      {/* Monto Personalizado */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Monto Personalizado</label>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-gray-600" />
                          <input
                            type="number"
                            value={customAmount}
                            onChange={handleCustomAmountChange}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 text-sm"
                          />
                        </div>
                      </div>

                      {/* Total a Cargar */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">Monto a Cargar</p>
                        <p className="text-3xl font-bold text-gray-900">$ {getTotalAmount().toFixed(2)}</p>
                      </div>

                      {/* Botón Confirmar */}
                      <button
                        onClick={() => {
                          if (getTotalAmount() > 0) {
                            setIsConfirmModalOpen(true);
                          } else {
                            alert('Por favor selecciona o ingresa un monto válido');
                          }
                        }}
                        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
                      >
                        <Wallet className="w-5 h-5" />
                        <span>Confirmar Recarga</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center">
                    <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-sm">Selecciona un cliente para cargar saldo</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Historial de Recargas */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Historial de Recargas Recientes</h2>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-all">
                <Filter className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Cliente</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Monto</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Fecha y Hora</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Método de Pago</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRecharges.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
                        Aún no hay recargas en esta sesión.
                      </td>
                    </tr>
                  ) : (
                    recentRecharges.map((recharge) => (
                      <tr key={recharge.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {recharge.initials}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{recharge.clientName}</p>
                              <p className="text-xs text-gray-600">{recharge.clientId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className={`text-sm font-semibold ${getAmountColor(recharge.amount)}`}>
                            +${recharge.amount.toFixed(2)}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-700">{recharge.date}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-700">{recharge.paymentMethod}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(recharge.status)}`}>
                            {recharge.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL CONFIRMAR RECARGA */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirmar Recarga de Saldo"
      >
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <p className="text-xs font-medium text-gray-600 mb-1">Cliente</p>
            <p className="text-lg font-bold text-gray-900">
              {selectedClient ? `${selectedClient.name} ${selectedClient.lastName}` : ''}
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <p className="text-xs font-medium text-gray-600 mb-1">Saldo Anterior</p>
            <p className="text-lg font-bold text-gray-900">${(selectedClient?.balance ?? 0).toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <p className="text-xs font-medium text-gray-600 mb-1">Monto a Cargar</p>
            <p className="text-lg font-bold text-orange-600">+${getTotalAmount().toFixed(2)}</p>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-700">Saldo Final</span>
              <span className="text-xl font-bold text-gray-900">
                ${(selectedClient ? (selectedClient.balance ?? 0) + getTotalAmount() : 0).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleConfirmRecharge}
              disabled={recharging}
              className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {recharging ? 'Procesando...' : 'Confirmar Recarga'}
            </button>
            <button
              onClick={() => setIsConfirmModalOpen(false)}
              disabled={recharging}
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