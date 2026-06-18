import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from './Button';

const BASE_URL = 'http://localhost:4000/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function FormAddMenu({ onSubmit, onCancel, initialMenu = null, submitting = false }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      productId:initialMenu?.productId || '',
      name: initialMenu?.name || '',
      description: initialMenu?.description || '',
      price: initialMenu?.price  || '',
      stock: initialMenu?.stock  || '',
      dayOfWeek: initialMenu?.dayOfWeek || '',
    },
  });

  const productIdWatch = watch('productId');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/products`, { credentials: 'include' });
        if (!res.ok) throw new Error('Error loading products');
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
    setValue('name',  prod.name || '');
    setValue('description', prod.description || '');
    setValue('price', prod.price || '');
    setValue('stock',prod.quantity || '');
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
        <label className="block text-gray-700 text-xs font-semibold mb-1">Product</label>
        {loadingProducts ? (
          <p className="text-sm text-gray-400">Cargando productos...</p>
        ) : (
          <select {...register('productId', { required: 'Please select a product' })}
                  className={fieldClass(errors.productId)}>
            <option value="">-- Select a product --</option>
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
        {/* Name */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-xs font-semibold mb-1">Name</label>
          <input type="text" placeholder="Ej. Monday Menu"
                 {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name too short' } })}
                 className={fieldClass(errors.name)} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-xs font-semibold mb-1">Description</label>
          <textarea placeholder="Describe the dish..."
                    {...register('description', { required: 'Description is required' })}
                    className={`${fieldClass(errors.description)} resize-none h-20`} />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-700 text-xs font-semibold mb-1">Price</label>
          <div className="relative">
            <input type="number" step="0.01" placeholder="0.00"
                   {...register('price', { required: 'Price is required', min: { value: 0.01, message: 'Must be greater than 0' } })}
                   className={`${fieldClass(errors.price)} pr-12`} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">USD</span>
          </div>
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
        </div>

        {/* Stock */}
        <div>
          <label className="block text-gray-700 text-xs font-semibold mb-1">Stock</label>
          <input type="number" placeholder="20"
                 {...register('stock', { required: 'Stock is required', min: { value: 0, message: 'Cannot be negative' } })}
                 className={fieldClass(errors.stock)} />
          {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
        </div>

        {/* Dia de la semana */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-xs font-semibold mb-1">Day of the week</label>
          <select {...register('dayOfWeek', { required: 'Please select a day' })}
                  className={fieldClass(errors.dayOfWeek)}>
            <option value="">Selecciona el día</option>
            {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          {errors.dayOfWeek && <p className="text-red-500 text-xs mt-1">{errors.dayOfWeek.message}</p>}
        </div>
      </div>

      {/* Botones */}
      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
        <button type="button" onClick={onCancel} disabled={submitting}
                className="px-6 py-3 rounded-lg font-semibold text-orange-400 hover:bg-orange-50 transition border border-orange-400 disabled:opacity-50">
          Cancel
        </button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Saving...' : initialMenu ? 'Update Menu' : 'Save Menu'}
        </Button>
      </div>
    </form>
  );
}
