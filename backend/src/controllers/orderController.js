import mongoose from "mongoose";
import orderModel from "../models/orderModels.js";
import productsModel from "../models/productsModel.js";
import dailyMenuModel from "../models/dailyMenuModel.js";

const orderController = {};

// Devuelve al inventario lo que se había descontado por una orden. Los
// items del menú del día devuelven al stock de ese menú; el resto, al del
// producto. Las órdenes viejas de la web no guardan ninguno de los dos, así
// que esas no mueven stock.
const restoreStock = async (items) => {
  for (const item of items) {
    if (item.menuId) {
      await dailyMenuModel.updateOne({ _id: item.menuId }, { $inc: { stock: item.quantity } });
    } else if (item.productId) {
      await productsModel.updateOne({ _id: item.productId }, { $inc: { quantity: item.quantity } });
    }
  }
};

// Descuenta el stock de un item y devuelve null, o lo que queda disponible
// si no alcanza. La condición ">= cantidad" dentro del mismo update evita
// vender de más aunque dos clientes compren al mismo tiempo.
const reserveStock = async (item, quantity) => {
  if (item.menuId) {
    const updated = await dailyMenuModel.findOneAndUpdate(
      { _id: item.menuId, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } }
    );
    if (updated) return null;
    const menu = await dailyMenuModel.findById(item.menuId);
    return menu ? menu.stock || 0 : 0;
  }
  const updated = await productsModel.findOneAndUpdate(
    { _id: item.productId, quantity: { $gte: quantity } },
    { $inc: { quantity: -quantity } }
  );
  if (updated) return null;
  const product = await productsModel.findById(item.productId);
  return product ? product.quantity || 0 : 0;
};

// Valida la forma de cada item antes de tocar la base de datos.
const validateItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return "At least one item is required";
  }
  for (const item of items) {
    if (!item.name || typeof item.name !== "string" || item.name.trim() === "") {
      return "Every item needs a name";
    }
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      return `Invalid quantity for "${item.name}". It must be a whole number greater than 0`;
    }
    const price = Number(item.price);
    if (isNaN(price) || price < 0) {
      return `Invalid price for "${item.name}". It cannot be negative`;
    }
    if (item.productId && !mongoose.isValidObjectId(item.productId)) {
      return `Invalid product id for "${item.name}"`;
    }
    if (item.menuId && !mongoose.isValidObjectId(item.menuId)) {
      return `Invalid menu id for "${item.name}"`;
    }
  }
  return null;
};

// Obtener todas las órdenes
orderController.getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().sort({ fecha: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Historial de un cliente (lo usa la app móvil)
orderController.getOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    if (!mongoose.isValidObjectId(customerId)) {
      return res.status(400).json({ message: "Invalid customer id" });
    }
    const orders = await orderModel
      .find({ customerId })
      .populate("items.productId", "image")
      .sort({ fecha: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Obtener una orden por ID
orderController.getOrderById = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id).populate("items.productId", "image");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json(order);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Crear una orden
orderController.insertOrder = async (req, res) => {
  // Lo que ya se descontó, por si hay que deshacerlo a mitad del proceso.
  const reserved = [];
  try {
    const { customerId, customerName, customerContact, items, total, estadoPago, estado, horaRecogida } = req.body;

    // Validaciones
    if (!customerName || !items || items.length === 0) {
      return res.status(400).json({ message: "Customer name and at least one item are required" });
    }
    const itemsError = validateItems(items);
    if (itemsError) return res.status(400).json({ message: itemsError });
    if (customerId && !mongoose.isValidObjectId(customerId)) {
      return res.status(400).json({ message: "Invalid customer id" });
    }

    // Descuenta el stock item por item (del menú del día o del producto).
    for (const item of items) {
      if (!item.productId && !item.menuId) continue;
      const quantity = Number(item.quantity);
      const available = await reserveStock(item, quantity);
      if (available !== null) {
        await restoreStock(reserved);
        return res.status(409).json({
          message: `Stock insuficiente para "${item.name}". Disponibles: ${available}.`,
          productId: item.productId,
          menuId: item.menuId,
          available,
        });
      }
      reserved.push({ productId: item.productId, menuId: item.menuId, quantity });
    }

    // Calcular total si no viene
    const calculatedTotal = total !== undefined ? total : items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (isNaN(Number(calculatedTotal)) || Number(calculatedTotal) < 0) {
      await restoreStock(reserved);
      return res.status(400).json({ message: "Total cannot be negative" });
    }

    // Generar hora de creación
    const now = new Date();
    const horaCreacion = now.toLocaleTimeString("es-ES");

    const newOrder = new orderModel({
      customerId: customerId || undefined,
      customerName: customerName.trim(),
      customerContact: customerContact?.trim() || "",
      items: items.map(item => ({
        productId: item.productId || undefined,
        menuId: item.menuId || undefined,
        name: item.name.trim(),
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),
      total: Number(calculatedTotal),
      estadoPago: estadoPago === true || estadoPago === "true",
      estado: estado || "pendiente",
      fecha: now,
      horaCreacion,
      horaRecogida,
    });

    await newOrder.save();
    return res.status(201).json({ message: "Order created", order: newOrder });
  } catch (error) {
    await restoreStock(reserved).catch(() => {});
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Cancelar una orden: sólo si sigue pendiente, y devuelve el stock.
orderController.cancelOrder = async (req, res) => {
  try {
    // Se cambia el estado de forma atómica para que dos cancelaciones
    // simultáneas no devuelvan el stock dos veces.
    const order = await orderModel.findOneAndUpdate(
      { _id: req.params.id, estado: "pendiente" },
      { $set: { estado: "cancelado" } },
      { new: true }
    );
    if (!order) {
      const exists = await orderModel.exists({ _id: req.params.id });
      if (!exists) return res.status(404).json({ message: "Order not found" });
      return res.status(400).json({ message: "Only pending orders can be cancelled" });
    }

    await restoreStock(order.items);
    return res.status(200).json({ message: "Order cancelled", order });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Actualizar una orden
orderController.updateOrder = async (req, res) => {
  try {
    const { customerName, customerContact, items, total, estadoPago, estado, horaEntrega } = req.body;

    const updateData = {};

    // Solo actualizar campos que vengan definidos
    if (customerName !== undefined) updateData.customerName = customerName.trim();
    if (customerContact !== undefined) updateData.customerContact = customerContact.trim();
    if (items !== undefined) {
      const itemsError = validateItems(items);
      if (itemsError) return res.status(400).json({ message: itemsError });
      updateData.items = items.map(item => ({
        productId: item.productId || undefined,
        menuId: item.menuId || undefined,
        name: item.name.trim(),
        quantity: Number(item.quantity),
        price: Number(item.price),
      }));
    }
    if (total !== undefined) {
      if (isNaN(Number(total)) || Number(total) < 0) {
        return res.status(400).json({ message: "Total cannot be negative" });
      }
      updateData.total = Number(total);
    }
    if (estadoPago !== undefined) updateData.estadoPago = estadoPago === true || estadoPago === "true";

    if (estado !== undefined) {
      updateData.estado = estado;
      // Si se marca como entregado y no se envía horaEntrega, se genera automáticamente
      if (estado === "entregado" && !horaEntrega) {
        const now = new Date();
        updateData.horaEntrega = now.toLocaleTimeString("es-ES");
      }
    }
    if (horaEntrega !== undefined) {
      updateData.horaEntrega = horaEntrega;
    }

    const previous = await orderModel.findById(req.params.id);
    if (!previous) {
      return res.status(404).json({ message: "Order not found" });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(req.params.id, updateData, { new: true });

    // Si el panel web cancela una orden, también se devuelve el stock.
    if (estado === "cancelado" && previous.estado !== "cancelado") {
      await restoreStock(previous.items);
    }

    return res.status(200).json({ message: "Order updated", order: updatedOrder });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Eliminar una orden
orderController.deleteOrder = async (req, res) => {
  try {
    const order = await orderModel.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    // Una orden pendiente que se borra nunca se entregó: su stock vuelve.
    if (order.estado === "pendiente") {
      await restoreStock(order.items);
    }
    return res.status(200).json({ message: "Order deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default orderController;
