import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartId, setCartId] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [descuentos, setDescuentos] = useState(0);
  const [totalFinal, setTotalFinal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const customerId = localStorage.getItem('customerId');

  // Calcular totales
  useEffect(() => {
    const subtotal = items.reduce((acc, item) => acc + (item.subtotal || 0), 0);
    setTotal(subtotal);
    setTotalFinal(subtotal - descuentos);
  }, [items, descuentos]);

  // Agregar producto al carrito
  const addToCart = async (productId, cantidad, extras = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar si el producto ya existe en el carrito
      const existingItem = items.find(item => item.productoId === productId);
      
      let updatedItems;
      if (existingItem) {
        // Aumentar cantidad si ya existe
        updatedItems = items.map(item =>
          item.productoId === productId
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      } else {
        // Agregar nuevo item
        updatedItems = [...items, { productoId, cantidad }];
      }
      
      setItems(updatedItems);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(items.map(item =>
      item.productoId === productId
        ? { ...item, cantidad }
        : item
    ));
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId) => {
    setItems(items.filter(item => item.productoId !== productId));
  };

  // Limpiar carrito
  const clearCart = () => {
    setItems([]);
    setCartId(null);
    setDescuentos(0);
  };

  // Establecer descuentos
  const setDiscounts = (amount) => {
    setDescuentos(amount);
  };

  const value = {
    // Estado
    cartId,
    items,
    total,
    descuentos,
    totalFinal,
    loading,
    error,
    customerId,
    
    // Acciones
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    setDiscounts,
    setCartId,
    setItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};
