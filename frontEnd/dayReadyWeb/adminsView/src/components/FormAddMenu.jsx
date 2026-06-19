import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from './Button';

const BASE_URL = 'http://localhost:4000/api';

// El valor (value) se guarda en inglés en la base de datos.
// La etiqueta (label) es lo que se muestra al usuario en español.
const DAYS = [
  { value: 'Monday', label: 'Lunes' },
  { value: 'Tuesday', label: 'Martes' },
  { value: 'Wednesday', label: 'Miércoles' },
  { value: 'Thursday', label: 'Jueves' },
  { value: 'Friday', label: 'Viernes' },
  { value: 'Saturday', label: 'Sábado' },
  { value: 'Sunday', label: 'Domingo' },
];

export default function FormAddMenu({ onSubmit, onCancel, initialMenu = null, submitting = false }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      productId: initialMenu?.productId || '',
      name: initialMenu?.name || '',
      description: initialMenu?.description || '',
      price: initialMenu?.price || '',
      stock: initialMenu?.stock || '',
      dayOfWeek: initialMenu?.dayOfWeek || '',
    },
  });

  const productIdWatch = watch('productId');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/products`, { credentials: 'include' });
        if (!res.ok) throw new Error('Error al cargar los productos');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!productIdWatch) { setSelectedProduct(null); return; }
    const prod = products.find((p) => p._id === productIdWatch);
    if (!prod) return;
    setSelectedProduct(prod);
    setValue('name', prod.name || '');
    setValue('description', prod.description || '');
    setValue('price', prod.price || '');
    setValue('stock', prod.quantity || '');
  }, [productIdWatch, products, setValue]);

  const fieldClass = (hasError) =>
    `w-full px-3 py-2 text-sm rounded-lg border-2 focus:outline-none focus:ring-2 transition ${
      hasError
        ? 'border-red-500 focus:ring-red-200'
        : 'border-gray-300 focus:border-orange-400 focus:ring-orange-200'
    }`;

  const onFormSubmit = (data) => {
    onSubmit({ ...data, image: selectedProduct?.image || 'https://via.placeholder.com/100' });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">

      <div>
        <label className="block text-gray-700 text-xs font-semibold mb-1">Producto</label>
        {loadingProducts ? (
          <p className="text-sm text-gray-400">Cargando productos...</p>
        ) : (
          <select {...register('productId', { required: 'Selecciona un producto' })}
                  className={fieldClass(errors.productId)}>
            <option value="">-- Selecciona un producto --</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>{p.name} — {p.category}</option>
            ))}
          </select>
        )}
        {errors.productId && <p className="text-red-500 text-xs mt-1">{errors.productId.message}</p>}
      </div>

      {/* Preview del producto elegido */}
      {selectedProduct && (
        <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
          <img src={selectedProduct.image || 'https://via.placeholder.com/60'} alt={selectedProduct.name}
               className="w-14 h-14 rounded-lg object-cover" />
          <div>
            <p className="font-semibold text-gray-800 text-sm">{selectedProduct.name}</p>
            <p className="text-xs text-gray-500">{selectedProduct.category}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nombre */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-xs font-semibold mb-1">Nombre</label>
          <input type="text" placeholder="Ej. Menú del lunes"
                 {...register('name', { required: 'El nombre es obligatorio', minLength: { value: 2, message: 'El nombre es muy corto' } })}
                 className={fieldClass(errors.name)} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-xs font-semibold mb-1">Descripción</label>
          <textarea placeholder="Describe el platillo..."
                    {...register('description', { required: 'La descripción es obligatoria' })}
                    className={`${fieldClass(errors.description)} resize-none h-20`} />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        {/* Precio */}
        <div>
          <label className="block text-gray-700 text-xs font-semibold mb-1">Precio</label>
          <div className="relative">
            <input type="number" step="0.01" placeholder="0.00"
                   {...register('price', { required: 'El precio es obligatorio', min: { value: 0.01, message: 'Debe ser mayor a 0' } })}
                   className={`${fieldClass(errors.price)} pr-12`} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">USD</span>
          </div>
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
        </div>

        {/* Stock */}
        <div>
          <label className="block text-gray-700 text-xs font-semibold mb-1">Existencias</label>
          <input type="number" placeholder="20"
                 {...register('stock', { required: 'Las existencias son obligatorias', min: { value: 0, message: 'No puede ser negativo' } })}
                 className={fieldClass(errors.stock)} />
          {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
        </div>

        {/* Día de la semana */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-xs font-semibold mb-1">Día de la semana</label>
          <select {...register('dayOfWeek', { required: 'Selecciona un día' })}
                  className={fieldClass(errors.dayOfWeek)}>
            <option value="">Selecciona el día</option>
            {DAYS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
          {errors.dayOfWeek && <p className="text-red-500 text-xs mt-1">{errors.dayOfWeek.message}</p>}
        </div>
      </div>

      {/* Botones */}
      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
        <button type="button" onClick={onCancel} disabled={submitting}
                className="px-6 py-3 rounded-lg font-semibold text-orange-400 hover:bg-orange-50 transition border border-orange-400 disabled:opacity-50">
          Cancelar
        </button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Guardando...' : initialMenu ? 'Actualizar Menú' : 'Guardar Menú'}
        </Button>
      </div>
    </form>
  );
}
