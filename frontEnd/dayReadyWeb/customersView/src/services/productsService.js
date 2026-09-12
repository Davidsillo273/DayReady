// Llamadas a /products (backend/src/routes/productsRoutes.js). Se mapea
// cada producto al mismo shape que ya esperaban ProductCard/ProductModal
// (id, title, location, category...) para no tener que tocar esos
// componentes, que antes recibían datos de ejemplo con esos mismos nombres.
const API_BASE_URL = 'http://localhost:4000/api';

const mapProduct = (p) => ({
  id: p._id,
  title: p.name,
  description: p.description,
  price: p.price,
  category: p.category,
  location: p.type || 'Cafetería',
  image: p.image,
  quantity: p.quantity,
});

export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`, { credentials: 'include' });

  if (!response.ok) {
    throw new Error('No se pudo cargar el catálogo de productos');
  }

  const products = await response.json();
  return products.map(mapProduct);
};
