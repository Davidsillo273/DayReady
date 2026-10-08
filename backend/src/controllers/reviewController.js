import mongoose from "mongoose";
import reviewModel from "../models/reviewModel.js";
import orderModel from "../models/orderModels.js";
import customerModel from "../models/customerModels.js";

const reviewController = {};

// Un cliente sólo puede valorar lo que compró: tiene que existir una orden
// suya (no cancelada) que incluya ese producto.
const hasPurchased = (customerId, productId) =>
    orderModel.exists({
        customerId,
        "items.productId": productId,
        estado: { $ne: "cancelado" },
    });

// Reseñas de un producto con su promedio
reviewController.getByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: "Invalid product id" });
        }
        const reviews = await reviewModel.find({ productId }).sort({ updatedAt: -1 });
        const count = reviews.length;
        const average = count ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
        return res.status(200).json({ average: Number(average.toFixed(1)), count, reviews });
    } catch (error) {
        console.error("Error getting reviews:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Promedio y cantidad de reseñas de todos los productos (para el catálogo)
reviewController.getSummary = async (req, res) => {
    try {
        const summary = await reviewModel.aggregate([
            { $group: { _id: "$productId", average: { $avg: "$rating" }, count: { $sum: 1 } } },
        ]);
        return res.status(200).json(
            summary.map((s) => ({ productId: s._id, average: Number(s.average.toFixed(1)), count: s.count }))
        );
    } catch (error) {
        console.error("Error getting review summary:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ¿Este cliente puede valorar este producto? Devuelve también su reseña si ya existe.
reviewController.getEligibility = async (req, res) => {
    try {
        const { productId, customerId } = req.query;
        if (!mongoose.isValidObjectId(productId) || !mongoose.isValidObjectId(customerId)) {
            return res.status(400).json({ message: "Invalid product or customer id" });
        }
        const [purchased, review] = await Promise.all([
            hasPurchased(customerId, productId),
            reviewModel.findOne({ productId, customerId }),
        ]);
        return res.status(200).json({ canReview: Boolean(purchased), review });
    } catch (error) {
        console.error("Error checking review eligibility:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Crear o actualizar la reseña del cliente para un producto
reviewController.upsertReview = async (req, res) => {
    try {
        const { productId, customerId, rating, comment } = req.body;

        if (!mongoose.isValidObjectId(productId) || !mongoose.isValidObjectId(customerId)) {
            return res.status(400).json({ message: "Invalid product or customer id" });
        }
        const parsedRating = Number(rating);
        if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
            return res.status(400).json({ message: "La valoración debe ser un número entero entre 1 y 5." });
        }
        if (!comment || typeof comment !== "string" || comment.trim().length < 3) {
            return res.status(400).json({ message: "El comentario debe tener al menos 3 caracteres." });
        }
        if (comment.trim().length > 500) {
            return res.status(400).json({ message: "El comentario no puede pasar de 500 caracteres." });
        }

        const customer = await customerModel.findById(customerId).select("name lastName");
        if (!customer) return res.status(404).json({ message: "Customer not found" });

        if (!(await hasPurchased(customerId, productId))) {
            return res.status(403).json({ message: "Sólo puedes valorar productos que ya compraste." });
        }

        const review = await reviewModel.findOneAndUpdate(
            { productId, customerId },
            {
                $set: {
                    rating: parsedRating,
                    comment: comment.trim(),
                    customerName: `${customer.name} ${customer.lastName}`.trim(),
                },
            },
            { new: true, upsert: true, runValidators: true }
        );

        return res.status(200).json({ message: "Review saved", review });
    } catch (error) {
        console.error("Error saving review:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Borrar una reseña (sólo su autor)
reviewController.deleteReview = async (req, res) => {
    try {
        const { customerId } = req.body;
        const review = await reviewModel.findOneAndDelete({ _id: req.params.id, customerId });
        if (!review) return res.status(404).json({ message: "Review not found" });
        return res.status(200).json({ message: "Review deleted" });
    } catch (error) {
        console.error("Error deleting review:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default reviewController;
