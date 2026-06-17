import orderModel from "../models/orderModels.js";

const orderController = {};

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

// Obtener una orden por ID
orderController.getOrderById = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
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
  try {
    const { customerName, customerContact, items, total, estadoPago, estado } = req.body;

    // Validaciones
    if (!customerName || !items || items.length === 0) {
      return res.status(400).json({ message: "Customer name and at least one item are required" });
    }

    // Calcular total si no viene
    const calculatedTotal = total !== undefined ? total : items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Generar hora de creación
    const now = new Date();
    const horaCreacion = now.toLocaleTimeString("es-ES");

    const newOrder = new orderModel({
      customerName: customerName.trim(),
      customerContact: customerContact?.trim() || "",
      items: items.map(item => ({
        name: item.name.trim(),
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),
      total: Number(calculatedTotal),
      estadoPago: estadoPago === true || estadoPago === "true",
      estado: estado || "pendiente",
      fecha: now,
      horaCreacion,
    });

    await newOrder.save();
    return res.status(201).json({ message: "Order created", order: newOrder });
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
      updateData.items = items.map(item => ({
        name: item.name.trim(),
        quantity: Number(item.quantity),
        price: Number(item.price),
      }));
    }
    if (total !== undefined) updateData.total = Number(total);
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

    const updatedOrder = await orderModel.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
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
    return res.status(200).json({ message: "Order deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default orderController;