import React, { useState } from 'react';

export default function PersonalInfoView({ onBack }) {
  const [formData, setFormData] = useState({ firstName: 'Diego', lastName: 'Estudiante' });

  const handleSave = () => {
    // Aquí iría la lógica para guardar
    onBack();
  };

  return (
    <div className="p-8 flex flex-col h-full w-full">
      <button onClick={onBack} className="mb-6 text-slate-400 font-bold text-xs uppercase flex items-center gap-2 hover:text-slate-600 transition">
        ← Volver
      </button>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Información Personal</h2>
      <div className="space-y-4 flex-grow">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre</label>
          <input 
            type="text" 
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm mt-1 focus:ring-2 focus:ring-slate-300 outline-none" 
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Apellidos</label>
          <input 
            type="text" 
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm mt-1 focus:ring-2 focus:ring-slate-300 outline-none" 
          />
        </div>
      </div>
      <button 
        onClick={handleSave}
        className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold mt-4 shadow-lg hover:bg-slate-900 transition"
      >
        Guardar Cambios
      </button>
    </div>
  );
}