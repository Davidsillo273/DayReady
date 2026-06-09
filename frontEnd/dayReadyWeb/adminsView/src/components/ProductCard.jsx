import React from 'react';
import { TrendingUp, ChevronRight } from 'lucide-react';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all group">
      {/* Imagen */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          {product.category}
        </div>
        <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 px-2 py-1 rounded flex items-center space-x-1 text-xs font-medium text-gray-700">
          <TrendingUp className="w-3 h-3" />
          <span>{product.sales} ventas</span>
        </div>
      </div>

      {/* Información */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2 text-sm line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-orange-500">
            ${product.price}
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
