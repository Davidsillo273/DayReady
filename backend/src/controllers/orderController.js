import orderModel from "../models/orderModels.js";
import cartModel from "../models/cartModels.js";

// Array de métodos
const orderController = {};

// Obtener todas las órdenes
orderController.getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("carritoComprasId", "total totalFinal")
      .exec();

    return res.status(200).json(orders);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Obtener una orden por ID
orderController.getOrderById = async (req, res) => {
  try {
    const order = await orderModel
      .findById(req.params.id)
      .populate("carritoComprasId", "total totalFinal");

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
    // Solicitar los datos
    const { carritoComprasId, estadoPago, estado } = req.body;

    // Validaciones
    if (!carritoComprasId) {
      return res.status(400).json({ message: "Cart ID is required" });
    }

    // Verificar que el carrito existe
    const cartFound = await cartModel.findById(carritoComprasId);
    if (!cartFound) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Obtener la hora actual
    const now = new Date();
    const horaCreacion = now.toLocaleTimeString("es-ES");

    // Crear la nueva orden
    const newOrder = new orderModel({
      carritoComprasId,
      estadoPago: estadoPago || false,
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
    // Solicitar los datos
    const { carritoComprasId, estadoPago, estado, horaEntrega } = req.body;

    // Si se actualiza el estado a "entregado", registrar la hora de entrega
    let updateData = {
      estadoPago: estadoPago !== undefined ? estadoPago : undefined,
      estado: estado || undefined,
    };

    // Limpiar undefined
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    // Si el estado es "entregado" y no viene horaEntrega, generarla
    if (estado === "entregado" && !horaEntrega) {
      const now = new Date();
      updateData.horaEntrega = now.toLocaleTimeString("es-ES");
    } else if (horaEntrega) {
      updateData.horaEntrega = horaEntrega;
    }

    // Si se proporciona carritoComprasId, validar que exista
    if (carritoComprasId) {
      const cartFound = await cartModel.findById(carritoComprasId);
      if (!cartFound) {
        return res.status(404).json({ message: "Cart not found" });
      }
      updateData.carritoComprasId = carritoComprasId;
    }

    // Actualizar en la base de datos
    const updatedOrder = await orderModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res
      .status(200)
      .json({ message: "Order updated", order: updatedOrder });
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
