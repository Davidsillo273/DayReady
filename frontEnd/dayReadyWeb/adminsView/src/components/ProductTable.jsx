import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-300 bg-gray-50">
            <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm">IMG</th>
            <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm">NOMBRE</th>
            <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm">CATEGORÍA</th>
            <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm">PRECIO</th>
            <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm">STOCK</th>
            <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm">ESTADO</th>
            <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, idx) => (
            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-4 px-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                />
              </td>
              <td className="py-4 px-4">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{product.name}</p>
                  <p className="text-gray-600 text-xs">SKU: {product.sku}</p>
                </div>
              </td>
              <td className="py-4 px-4 text-gray-700 text-sm capitalize">{product.category}</td>
              <td className="py-4 px-4 font-bold text-gray-900 text-sm">${product.price}</td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 font-medium text-sm">{product.stock}</span>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      product.stock > 20 ? 'bg-green-500' : product.stock > 10 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  ></div>
                </div>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                    product.status === 'Activo'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {product.status === 'Activo' ? '● Activo' : '● Inactivo'}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-orange-500 hover:text-orange-600 transition-all"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="text-red-500 hover:text-red-600 transition-all"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
