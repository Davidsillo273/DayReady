import cartModel from "../models/cartModels.js";
import productsModel from "../models/productsModel.js";

// Array de métodos
const cartController = {};

// Obtener todos los carritos
cartController.getAllCarts = async (req, res) => {
  try {
    const carts = await cartModel
      .find()
      .populate("customerId", "name email")
      .populate("items.productoId", "name price");

    return res.status(200).json(carts);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Obtener un carrito por ID
cartController.getCartById = async (req, res) => {
  try {
    const cart = await cartModel
      .findById(req.params.id)
      .populate("customerId", "name email")
      .populate("items.productoId", "name price");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Crear un carrito
cartController.insertCart = async (req, res) => {
  try {
    // Solicitar los datos a guardar
    const { customerId, items, descuentos, status } = req.body;

    // Validaciones
    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    // Variable para guardar el total del carrito
    let total = 0;
    let newItems = [];

    // Recorrer todos los items para calcularles el subtotal
    for (let i = 0; i < items.length; i++) {
      // Buscar el producto en la base de datos
      const productFound = await productsModel.findById(items[i].productoId);

      if (!productFound) {
        return res
          .status(404)
          .json({ message: `Product with ID ${items[i].productoId} not found` });
      }

      // Validar cantidad
      if (!items[i].cantidad || items[i].cantidad <= 0) {
        return res.status(400).json({ message: "Quantity must be greater than 0" });
      }

      // Calcular el subtotal
      const subtotal = productFound.price * items[i].cantidad;

      // Calcular cuánto de total llevamos
      total += subtotal;

      // Guardar el item junto con el subtotal calculado
      newItems.push({
        productoId: items[i].productoId,
        cantidad: items[i].cantidad,
        subtotal: subtotal,
      });
    }

    // Calcular descuentos (si no viene, es 0)
    const discountAmount = descuentos || 0;
    const totalFinal = total - discountAmount;

    // Guardar en la base de datos
    const newCart = new cartModel({
      customerId,
      items: newItems,
      total,
      descuentos: discountAmount,
      totalFinal,
      status: status || "active",
    });

    await newCart.save();

    return res.status(201).json({ message: "Cart saved", cart: newCart });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Actualizar un carrito
cartController.updateCart = async (req, res) => {
  try {
    // Solicitar los datos
    const { customerId, items, descuentos, status } = req.body;

    // Validaciones
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    // Variable para guardar el total del carrito
    let total = 0;
    let newItems = [];

    // Recorrer todos los items para calcularles el subtotal
    for (let i = 0; i < items.length; i++) {
      // Buscar el producto en la base de datos
      const productFound = await productsModel.findById(items[i].productoId);

      if (!productFound) {
        return res
          .status(404)
          .json({ message: `Product with ID ${items[i].productoId} not found` });
      }

      // Validar cantidad
      if (!items[i].cantidad || items[i].cantidad <= 0) {
        return res.status(400).json({ message: "Quantity must be greater than 0" });
      }

      // Calcular el subtotal
      const subtotal = productFound.price * items[i].cantidad;

      // Calcular el total
      total += subtotal;

      // Guardar el item junto con su subtotal
      newItems.push({
        productoId: items[i].productoId,
        cantidad: items[i].cantidad,
        subtotal: subtotal,
      });
    }

    // Calcular descuentos (si no viene, es 0)
    const discountAmount = descuentos || 0;
    const totalFinal = total - discountAmount;

    // Actualizar en la base de datos
    const updatedCart = await cartModel.findByIdAndUpdate(
      req.params.id,
      {
        customerId: customerId || undefined,
        items: newItems,
        total,
        descuentos: discountAmount,
        totalFinal,
        status: status || undefined,
      },
      { new: true },
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json({ message: "Cart updated", cart: updatedCart });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Eliminar un carrito
cartController.deleteCart = async (req, res) => {
  try {
    const cart = await cartModel.findByIdAndDelete(req.params.id);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json({ message: "Cart deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default cartController;
