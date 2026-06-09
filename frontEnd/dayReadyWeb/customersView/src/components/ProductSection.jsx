import React from 'react';

export default function ProductSection({ title, icon, children }) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">{icon}</span>
        <h2 className="text-lg font-bold text-gray-700">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </section>
  );
}