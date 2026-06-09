import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import InputField from './InputField';
import Button from './Button';

export default function FormAddProduct({ onSubmit, onCancel, initialProduct = null }) {
  const [formData, setFormData] = useState({
    name: initialProduct?.name || '',
    description: initialProduct?.description || '',
    category: initialProduct?.category || '',
    serviceType: initialProduct?.serviceType || 'Presencial',
    price: initialProduct?.price || '',
    stock: initialProduct?.stock || '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(initialProduct?.image || null);

  const categories = [
    { value: '', label: 'Seleccionar categoría' },
    { value: 'combos', label: 'Combos' },
    { value: 'saludable', label: 'Saludable' },
    { value: 'comida rápida', label: 'Comida Rápida' },
    { value: 'bebida', label: 'Bebida' },
    { value: 'sopa', label: 'Sopa' },
  ];

  const serviceTypes = [
    { value: 'Presencial', label: 'Presencial' },
    { value: 'Delivery', label: 'Delivery' },
    { value: 'Ambos', label: 'Ambos' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          image: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          image: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Columna Izquierda - Imagen */}
      <div>
        <label className="block text-gray-900 font-bold mb-4">Imagen del Producto</label>
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-all cursor-pointer"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-input"
          />
          {imagePreview ? (
            <div className="space-y-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg"
              />
              <label htmlFor="image-input" className="text-orange-500 hover:text-orange-600 font-medium text-sm cursor-pointer">
                Cambiar imagen
              </label>
            </div>
          ) : (
            <label htmlFor="image-input" className="cursor-pointer">
              <Upload className="w-12 h-12 text-orange-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium mb-1">Arrastra una imagen o haz clic</p>
              <p className="text-gray-400 text-xs">JPG, PNG o WEBP (Máx. 5MB)</p>
              <p className="text-orange-500 text-xs font-semibold mt-3">
                Consejo: Una foto iluminada y clara atrae más clientes a tu menú del día.
              </p>
            </label>
          )}
        </div>
      </div>

      {/* Columna Derecha - Formulario */}
      <div className="space-y-5">
        <InputField
          label="Nombre del Producto"
          type="text"
          placeholder="Ej. Hamburguesa Clasica"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />

        <div>
          <label className="block text-gray-700 text-xs font-semibold mb-2">Descripción</label>
          <textarea
            placeholder="Describe los ingredientes, extras, entre otros..."
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition resize-none h-24"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-xs font-semibold mb-2">Categoría</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition"
              required
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-xs font-semibold mb-2">Tipo de Servicio</label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition"
            >
              {serviceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-xs font-semibold mb-2">Precio</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 pr-12 text-sm rounded-lg border-2 border-gray-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">USD</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-xs font-semibold mb-2">Stock / Cantidad</label>
            <input
              type="number"
              placeholder="20"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition"
              required
            />
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="md:col-span-2 flex items-center justify-end space-x-4 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-lg font-semibold text-orange-400 hover:bg-orange-50 transition border border-orange-400"
        >
          Cancelar
        </button>
        <Button type="submit" variant="primary">
          {initialProduct ? 'Actualizar Producto' : 'Guardar Producto'}
        </Button>
      </div>
    </form>
  );
}
