// Contexto del carrito de compras. Mientras el estudiante navega por el
// catálogo el carrito vive sólo en memoria (no tiene sentido crear un
// registro en la base de datos por cada producto que toca "Agregar"); recién
// se guarda en el backend cuando llega a Checkout, y ahí sí queda un
// documento real en la colección "carts" que se puede actualizar o borrar.
//
// Cada item recuerda el stock del producto, así el carrito nunca deja
// pedir más unidades de las que hay. Aun así el backend vuelve a validar
// el stock al crear la orden (por si otro cliente compró antes).
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import cartService from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ productId, name, image, price, cantidad, stock }]
  const [cartId, setCartId] = useState(null); // id de Mongo una vez creado en el backend
  const { customer } = useAuth();

  // Al cerrar sesión (o entrar con otra cuenta) el carrito se vacía, para
  // que el siguiente usuario no vea productos del anterior.
  useEffect(() => {
    setItems([]);
    setCartId(null);
  }, [customer?._id]);

  // Devuelve null si se agregó, o un mensaje si se topó con el stock.
  const addItem = (product, cantidad = 1) => {
    const stock = Number(product.quantity ?? 0);
    const existing = items.find((i) => i.productId === product._id);
    const alreadyInCart = existing?.cantidad || 0;

    if (stock <= 0) return `"${product.name}" está agotado.`;
    if (alreadyInCart + cantidad > stock) {
      return `Sólo hay ${stock} unidades de "${product.name}" y ya tienes ${alreadyInCart} en el carrito.`;
    }

    if (existing) {
      setItems((prev) =>
        prev.map((i) => (i.productId === product._id ? { ...i, cantidad: i.cantidad + cantidad, stock } : i))
      );
    } else {
      setItems((prev) => [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          image: product.image,
          price: Number(product.price),
          cantidad,
          stock,
        },
      ]);
    }
    return null;
  };

  const updateQuantity = (productId, cantidad) => {
    if (cantidad <= 0) return removeItem(productId);
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, cantidad: Math.min(cantidad, i.stock) } : i))
    );
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  // Si el backend avisa que ya no hay stock suficiente, se ajusta el item
  // al stock real (o se quita si se agotó).
  const syncStock = (productId, available) => {
    setItems((prev) =>
      available <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) =>
            i.productId === productId ? { ...i, stock: available, cantidad: Math.min(i.cantidad, available) } : i
          )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCartId(null);
  };

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.cantidad, 0),
    [items]
  );

  const itemCount = useMemo(() => items.reduce((n, i) => n + i.cantidad, 0), [items]);

  // Guarda (o actualiza, si ya existía) el carrito en el backend. Se llama
  // al entrar a Checkout, para que el pedido quede respaldado en la base de
  // datos antes de pasar a la pantalla de pago.
  const persistCart = async (customerId) => {
    const payloadItems = items.map((i) => ({ productoId: i.productId, cantidad: i.cantidad }));

    if (cartId) {
      const { cart } = await cartService.update(cartId, payloadItems);
      return cart;
    }

    const cart = await cartService.create(customerId, payloadItems);
    setCartId(cart._id);
    return cart;
  };

  // Se llama después de pagar: la orden ya quedó creada, así que el
  // carrito temporal en la base de datos ya no hace falta (delete real).
  const discardPersistedCart = async () => {
    if (cartId) {
      await cartService.remove(cartId).catch(() => {});
    }
    clearCart();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemCount,
        cartId,
        addItem,
        updateQuantity,
        removeItem,
        syncStock,
        clearCart,
        persistCart,
        discardPersistedCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}
