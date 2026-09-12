import React, { useState } from 'react';
import { updateCustomer } from '../../services/customersService';

export default function PersonalInfoView({ customer, onBack, onSaved }) {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    lastName: customer?.lastName || '',
    phone: customer?.phone || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!customer?._id) return onBack();

    setSaving(true);
    setError('');
    try {
      await updateCustomer(customer._id, formData);
      await onSaved?.(); // refresca el perfil en el Storefront con los datos ya guardados
      onBack();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 flex flex-col h-full w-full">
      <button onClick={onBack} className="mb-6 text-slate-400 font-bold text-xs uppercase flex items-center gap-2 hover:text-slate-600 transition">
        ← Volver
      </button>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Información Personal</h2>
      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
      <div className="space-y-4 flex-grow">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm mt-1 focus:ring-2 focus:ring-slate-300 outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Apellidos</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm mt-1 focus:ring-2 focus:ring-slate-300 outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Teléfono</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm mt-1 focus:ring-2 focus:ring-slate-300 outline-none"
          />
        </div>
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold mt-4 shadow-lg hover:bg-slate-900 transition disabled:opacity-50"
      >
        {saving ? 'Guardando...' : 'Guardar Cambios'}
      </button>
    </div>
  );
}
