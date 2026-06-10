import React, { useState } from 'react';

export default function CardsView({ onBack }) {
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [editingId, setEditingId] = useState(null);
  const [cards, setCards] = useState([
    { id: 1, nickname: 'Mi Tarjeta Principal', brand: 'Visa', last4: '4242', exp: '12/25' }
  ]);
  
  const [formData, setFormData] = useState({ nickname: '', number: '', exp: '', cvv: '' });

  const handleOpenForm = (card = null) => {
    if (card) {
      setFormData({ nickname: card.nickname, number: `**** **** **** ${card.last4}`, exp: card.exp, cvv: '***' });
      setEditingId(card.id);
    } else {
      setFormData({ nickname: '', number: '', exp: '', cvv: '' });
      setEditingId(null);
    }
    setView('form');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      // Editar
      setCards(cards.map(c => c.id === editingId ? { ...c, nickname: formData.nickname } : c));
    } else {
      // Agregar nueva (simulación)
      const newCard = {
        id: Date.now(),
        nickname: formData.nickname || 'Nueva Tarjeta',
        brand: 'Mastercard',
        last4: formData.number.slice(-4) || '0000',
        exp: formData.exp
      };
      setCards([...cards, newCard]);
    }
    setView('list');
  };

  return (
    <div className="p-8 flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => view === 'form' ? setView('list') : onBack()} className="text-slate-400 font-bold text-xs uppercase flex items-center gap-2 hover:text-slate-600 transition">
            ← Volver
          </button>
          <h2 className="text-xl font-bold text-gray-800">{view === 'list' ? 'Mis Tarjetas' : (editingId ? 'Editar Tarjeta' : 'Agregar Tarjeta')}</h2>
        </div>
        {view === 'list' && (
          <button onClick={() => handleOpenForm()} className="w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center hover:bg-slate-900 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          </button>
        )}
      </div>

      <div className="flex-grow flex flex-col">
        {view === 'list' ? (
          <div className="space-y-3 flex-grow">
            {cards.map(card => (
              <div key={card.id} className="p-4 rounded-2xl border border-slate-200 flex justify-between items-center group hover:border-slate-300 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200">
                    {card.brand}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{card.nickname}</p>
                    <p className="text-xs text-slate-500 font-medium">**** {card.last4}</p>
                  </div>
                </div>
                <button onClick={() => handleOpenForm(card)} className="text-slate-400 hover:text-slate-800 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
              </div>
            ))}
            {cards.length === 0 && <p className="text-center text-sm text-slate-500 py-4">No tienes tarjetas guardadas.</p>}
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 flex-grow flex flex-col">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Apodo de la tarjeta</label>
              <input type="text" placeholder="Ej: Tarjeta Mamá" value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Número de Tarjeta</label>
              <input type="text" disabled={!!editingId} placeholder="0000 0000 0000 0000" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Vencimiento</label>
                <input type="text" disabled={!!editingId} placeholder="MM/AA" value={formData.exp} onChange={e => setFormData({...formData, exp: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">CVV</label>
                <input type="password" disabled={!!editingId} placeholder="123" value={formData.cvv} onChange={e => setFormData({...formData, cvv: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 text-sm" />
              </div>
            </div>
            <button type="submit" className="w-full mt-4 bg-slate-800 text-white py-4 rounded-2xl font-semibold hover:bg-slate-900 transition text-sm">
              Guardar Tarjeta
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
