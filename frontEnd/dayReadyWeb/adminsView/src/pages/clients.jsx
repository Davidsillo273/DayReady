import React, { useState } from 'react';
import { Search, Bell, UserCheck, DollarSign, Wallet, Filter } from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import Modal from '../Components/Modal';
import Button from '../Components/Button';

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
  const [recentRecharges, setRecentRecharges] = useState([
    {
      id: 1,
      clientName: 'Mateo Rodriguez',
      clientId: 'ID: 2023-0045',
      avatar: 'https://i.pravatar.cc/100?img=1',
      initials: 'MR',
      amount: 25.00,
      date: 'Hoy, 10:45 AM',
      paymentMethod: 'Tarjeta Crédito (**** 4242)',
      status: 'Exitoso'
    },
    {
      id: 2,
      clientName: 'Sofia Alarcón',
      clientId: 'ID: 2023-0046',
      avatar: 'https://i.pravatar.cc/100?img=2',
      initials: 'SA',
      amount: 10.00,
      date: 'Ayer, 04:20 PM',
      paymentMethod: 'Efectivo (Caja)',
      status: 'Exitoso'
    },
    {
      id: 3,
      clientName: 'Daniel López',
      clientId: 'ID: 2023-0042',
      avatar: 'https://i.pravatar.cc/100?img=3',
      initials: 'DL',
      amount: 50.00,
      date: '24 Oct, 09:15 AM',
      paymentMethod: 'Transferencia',
      status: 'Exitoso'
    }
  ]);

  // Base de datos de clientes
  const clientsDatabase = [
    {
      id: 1,
      name: 'Mateo Rodriguez',
      clientId: '2023-0045',
      balance: 12.45,
      status: 'Activo',
      initials: 'MR'
    },
    {
      id: 2,
      name: 'Sofia Alarcón',
      clientId: '2023-0046',
      balance: 5.80,
      status: 'Activo',
      initials: 'SA'
    },
    {
      id: 3,
      name: 'Daniel López',
      clientId: '2023-0042',
      balance: 0.00,
      status: 'Activo',
      initials: 'DL'
    },
    {
      id: 4,
      name: 'Carolina Martínez',
      clientId: '2023-0047',
      balance: 25.50,
      status: 'Activo',
      initials: 'CM'
    },
    {
      id: 5,
      name: 'Juan Pérez',
      clientId: '2023-0048',
      balance: 8.00,
      status: 'Activo',
      initials: 'JP'
    }
  ];

  const predefinedAmounts = [5.00, 10.00, 20.00, 50.00];

  const handleSearchClient = () => {
    let found = null;
    if (clientIdSearch) {
      found = clientsDatabase.find(c => c.clientId.includes(clientIdSearch));
    } else if (clientNameSearch) {
      found = clientsDatabase.find(c => c.name.toLowerCase().includes(clientNameSearch.toLowerCase()));
    }
    
    if (found) {
      setSelectedClient(found);
      setSelectedAmount('');
      setCustomAmount('');
    } else {
      alert('Cliente no encontrado');
      setSelectedClient(null);
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

  const handleConfirmRecharge = () => {
    const totalAmount = getTotalAmount();
    if (totalAmount <= 0) {
      alert('Por favor selecciona o ingresa un monto válido');
      return;
    }

    const newRecharge = {
      id: recentRecharges.length + 1,
      clientName: selectedClient.name,
      clientId: `ID: ${selectedClient.clientId}`,
      avatar: `https://i.pravatar.cc/100?img=${selectedClient.id}`,
      initials: selectedClient.initials,
      amount: totalAmount,
      date: new Date().toLocaleString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).replace(/,/g, ','),
      paymentMethod: 'Tarjeta Crédito (**** 4242)',
      status: 'Exitoso'
    };

    // Actualizar balance del cliente
    const updatedClient = {
      ...selectedClient,
      balance: selectedClient.balance + totalAmount
    };

    setRecentRecharges([newRecharge, ...recentRecharges]);
    setSelectedClient(updatedClient);
    setSelectedAmount('');
    setCustomAmount('');
    setIsConfirmModalOpen(false);

    // Limpiar búsqueda
    setTimeout(() => {
      setClientIdSearch('');
      setClientNameSearch('');
      alert(`✅ Recarga de $${totalAmount.toFixed(2)} realizada exitosamente para ${selectedClient.name}`);
    }, 500);
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
                    <label className="block text-xs font-medium text-gray-700 mb-2">ID del cliente</label>
                    <input
                      type="text"
                      value={clientIdSearch}
                      onChange={(e) => setClientIdSearch(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ej: 2023-0045"
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

                  <button
                    onClick={handleSearchClient}
                    className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition-all text-sm"
                  >
                    Buscar
                  </button>
                </div>
              </div>

              {/* Cliente Seleccionado */}
              {selectedClient && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">Cliente Seleccionado</p>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                      {selectedClient.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{selectedClient.name}</p>
                      <p className="text-xs text-gray-600">ID: {selectedClient.clientId}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 py-2 px-3 bg-green-100 rounded-lg">
                    <UserCheck className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-green-700">{selectedClient.status}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Panel Derecho - Cargar Saldo */}
            <div className="col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Cargar Saldo</h2>
                  <p className="text-gray-600 text-sm">Agrega fondos a la cuenta de {selectedClient?.name || 'cliente'}</p>
                </div>

                {selectedClient ? (
                  <div className="space-y-6">
                    {/* Saldo Actual */}
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                      <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">Saldo Actual</p>
                      <p className="text-3xl font-bold text-orange-600">${selectedClient.balance.toFixed(2)}</p>
                    </div>

                    {/* Montos Predefinidos */}
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-3">Selecciona un monto o ingresa uno personalizado</p>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {predefinedAmounts.map((amount) => (
                          <button
                            key={amount}
                            onClick={() => handleSelectAmount(amount)}
                            className={`py-3 px-4 rounded-lg font-semibold transition-all text-sm border-2 ${
                              selectedAmount === amount
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
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">Monto Personalizado</p>
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
                  {recentRecharges.map((recharge) => (
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
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-center">
              <a href="#" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                Ver Historial Completo
              </a>
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
            <p className="text-lg font-bold text-gray-900">{selectedClient?.name}</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <p className="text-xs font-medium text-gray-600 mb-1">Saldo Anterior</p>
            <p className="text-lg font-bold text-gray-900">${selectedClient?.balance.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <p className="text-xs font-medium text-gray-600 mb-1">Monto a Cargar</p>
            <p className="text-lg font-bold text-orange-600">+${getTotalAmount().toFixed(2)}</p>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-700">Saldo Final</span>
              <span className="text-xl font-bold text-gray-900">
                ${(selectedClient ? selectedClient.balance + getTotalAmount() : 0).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleConfirmRecharge}
              className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all"
            >
              Confirmar Recarga
            </button>
            <button
              onClick={() => setIsConfirmModalOpen(false)}
              className="flex-1 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg font-semibold transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
