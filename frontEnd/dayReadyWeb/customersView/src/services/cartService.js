// Configuración base de la API
const API_BASE_URL = 'http://localhost:4000/api'; // Ajusta según tu URL del backend

// Crear un nuevo carrito
export const createCart = async (customerId, items) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        items, // Array de {productoId, cantidad}
      }),
    });

    if (!response.ok) {
      throw new Error('Error al crear el carrito');
    }

    const data = await response.json();
    return data.cart;
  } catch (error) {
    console.error('Error en createCart:', error);
    throw error;
  }
};

// Obtener todos los carritos
export const getAllCarts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener carritos');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getAllCarts:', error);
    throw error;
  }
};

// Obtener carrito por ID
export const getCartById = async (cartId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${cartId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el carrito');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getCartById:', error);
    throw error;
  }
};

// Actualizar carrito
export const updateCart = async (cartId, items, descuentos = 0) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${cartId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items, // Array de {productoId, cantidad}
        descuentos,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el carrito');
    }

    const data = await response.json();
    return data.cart;
  } catch (error) {
    console.error('Error en updateCart:', error);
    throw error;
  }
};

// Eliminar carrito
export const deleteCart = async (cartId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${cartId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el carrito');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en deleteCart:', error);
    throw error;
  }
};

// Obtener carrito por customerId (obtener el último o activo)
export const getCartByCustomerId = async (customerId) => {
  try {
    const carts = await getAllCarts();
    // Filtrar carritos del cliente y obtener el más reciente
    const customerCarts = carts.filter(cart => cart.customerId._id === customerId);
    return customerCarts.length > 0 ? customerCarts[0] : null;
  } catch (error) {
    console.error('Error en getCartByCustomerId:', error);
    throw error;
  }
};
