import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import * as cartService from '../services/cartService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartId, setCartId] = useState(null);
  const [items, setItems] = useState([]); // [{ productoId, cantidad, price, name, image }]
  const [descuentos, setDescuentos] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // CartProvider envuelve todo el <Router> en App.jsx y no se vuelve a
  // montar al navegar entre páginas, así que leer localStorage
  // directamente en el cuerpo del componente (como estaba antes) sólo
  // capturaba el valor de la primera vez que se dibujó (normalmente en
  // Login, antes de iniciar sesión, o sea siempre null). Se guarda en
  // estado y loginCustomer.jsx llama a refreshCustomerId() justo después
  // de guardar la sesión para que el carrito se entere.
  const [customerId, setCustomerIdState] = useState(() => localStorage.getItem('customerId'));
  const refreshCustomerId = () => setCustomerIdState(localStorage.getItem('customerId'));

  // Calcular totales a partir del precio real de cada item (antes esto
  // siempre daba $0 porque los items nunca traían "subtotal").
  const total = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.cantidad, 0),
    [items]
  );
  const totalFinal = total - descuentos;

  // Guarda el carrito en el backend cada vez que cambia: crea el
  // documento la primera vez y lo actualiza las siguientes. Antes esta
  // lógica estaba repetida (y desincronizada) en ProductModal y
  // CartSidebar; centralizarla aquí evita que un componente pise el
  // carrito que guardó el otro.
  const syncCart = async (updatedItems) => {
    if (!customerId) return;

    const payloadItems = updatedItems.map((i) => ({ productoId: i.productoId, cantidad: i.cantidad }));

    try {
      if (updatedItems.length === 0) {
        if (cartId) await cartService.deleteCart(cartId);
        setCartId(null);
        return;
      }

      if (cartId) {
        await cartService.updateCart(cartId, payloadItems, descuentos);
      } else {
        const newCart = await cartService.createCart(customerId, payloadItems);
        setCartId(newCart._id);
      }
    } catch (err) {
      console.error('Error al sincronizar el carrito:', err);
      setError(err.message);
    }
  };

  // Agregar producto al carrito. Recibe el producto completo (no sólo el
  // id) para poder calcular el subtotal sin tener que ir a buscarlo de
  // nuevo en otro lado.
  const addToCart = async (product, cantidad = 1) => {
    setLoading(true);
    setError(null);
    try {
      const existingItem = items.find((item) => item.productoId === product.id);

      const updatedItems = existingItem
        ? items.map((item) =>
            item.productoId === product.id ? { ...item, cantidad: item.cantidad + cantidad } : item
          )
        : [
            ...items,
            {
              productoId: product.id,
              cantidad,
              price: product.price,
              name: product.title,
              image: product.image,
            },
          ];

      setItems(updatedItems);
      await syncCart(updatedItems);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, cantidad) => {
    if (cantidad <= 0) return removeFromCart(productId);

    const updatedItems = items.map((item) =>
      item.productoId === productId ? { ...item, cantidad } : item
    );
    setItems(updatedItems);
    await syncCart(updatedItems);
  };

  const removeFromCart = async (productId) => {
    const updatedItems = items.filter((item) => item.productoId !== productId);
    setItems(updatedItems);
    await syncCart(updatedItems);
  };

  // Limpia sólo el estado local; se usa después de pagar, cuando el
  // carrito real ya se borró del backend como parte del checkout.
  const clearCart = () => {
    setItems([]);
    setCartId(null);
    setDescuentos(0);
  };

  const setDiscounts = (amount) => setDescuentos(amount);

  const value = {
    cartId,
    items,
    total,
    descuentos,
    totalFinal,
    loading,
    error,
    customerId,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    setDiscounts,
    setCartId,
    setItems,
    refreshCustomerId,
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
