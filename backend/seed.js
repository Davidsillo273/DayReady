// Carga datos de prueba para demostrar la app móvil: productos (uno de
// ellos agotado), un cliente de prueba con pedidos ya hechos (para el
// historial y para poder valorar productos) y algunas reseñas.
//
// Uso:  npm run seed
//
// No borra nada: si un dato de prueba ya existe (mismo nombre de producto o
// mismo correo de cliente) se deja como está, así que se puede correr
// varias veces sin duplicar información.
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { config } from "./config.js";
import productsModel from "./src/models/productsModel.js";
import customerModel from "./src/models/customerModels.js";
import orderModel from "./src/models/orderModels.js";
import reviewModel from "./src/models/reviewModel.js";

const DEMO_EMAIL = "demo@dayready.com";
const DEMO_PASSWORD = "Demo1234!";

const image = (text) => `https://placehold.co/600x400/F4A261/FFFFFF/png?text=${encodeURIComponent(text)}`;

const DEMO_PRODUCTS = [
    { name: "Pupusas revueltas", description: "Tres pupusas de chicharrón con queso, con curtido y salsa.", price: 1.5, category: "Comida", type: "Cafetería", quantity: 40 },
    { name: "Sándwich de pollo", description: "Pan integral, pechuga de pollo, lechuga y tomate.", price: 2.25, category: "Comida", type: "Cafetería", quantity: 25 },
    { name: "Pizza personal", description: "Pizza de pepperoni con queso mozzarella.", price: 2.75, category: "Comida", type: "Cafetería", quantity: 15 },
    { name: "Jugo de naranja", description: "Jugo natural recién exprimido, 12 oz.", price: 1.0, category: "Bebidas", type: "Kiosko", quantity: 30 },
    { name: "Horchata", description: "Horchata de morro bien fría, 16 oz.", price: 0.75, category: "Bebidas", type: "Kiosko", quantity: 50 },
    { name: "Brownie", description: "Brownie de chocolate con nueces.", price: 1.25, category: "Postres", type: "Kiosko", quantity: 0 },
];

async function seed() {
    await mongoose.connect(config.db.URI);
    console.log("Conectado a la base de datos");

    // Productos
    const products = {};
    for (const data of DEMO_PRODUCTS) {
        let product = await productsModel.findOne({ name: data.name });
        if (!product) {
            product = await productsModel.create({ ...data, image: image(data.name) });
            console.log(`  + producto: ${data.name}`);
        }
        products[data.name] = product;
    }

    // Cliente de prueba
    let customer = await customerModel.findOne({ email: DEMO_EMAIL });
    if (!customer) {
        customer = await customerModel.create({
            name: "Estudiante",
            lastName: "Demo",
            email: DEMO_EMAIL,
            carnet: "DEMO-2026",
            phone: "7777-7777",
            age: 17,
            password: await bcryptjs.hash(DEMO_PASSWORD, 10),
            balance: 25,
            status: "active",
        });
        console.log(`  + cliente: ${DEMO_EMAIL}`);
    }

    // Pedidos del cliente de prueba (uno entregado y uno pendiente que se
    // puede cancelar desde la app para ver cómo vuelve el stock)
    const hasOrders = await orderModel.exists({ customerId: customer._id });
    if (!hasOrders) {
        const line = (name, quantity) => ({
            productId: products[name]._id,
            name,
            quantity,
            price: products[name].price,
        });
        const total = (items) => items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const customerName = `${customer.name} ${customer.lastName}`;

        const delivered = [line("Pupusas revueltas", 2), line("Horchata", 1)];
        await orderModel.create({
            customerId: customer._id,
            customerName,
            customerContact: customer.email,
            items: delivered,
            total: total(delivered),
            estadoPago: true,
            estado: "entregado",
            fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            horaCreacion: "09:12:00",
            horaEntrega: "09:35:00",
            horaRecogida: "9:30 am",
        });

        const pending = [line("Sándwich de pollo", 1), line("Jugo de naranja", 2)];
        // El stock de un pedido pendiente ya está reservado
        for (const item of pending) {
            await productsModel.updateOne({ _id: item.productId }, { $inc: { quantity: -item.quantity } });
        }
        await orderModel.create({
            customerId: customer._id,
            customerName,
            customerContact: customer.email,
            items: pending,
            total: total(pending),
            estadoPago: true,
            estado: "pendiente",
            horaCreacion: "08:05:00",
            horaRecogida: "10:00 am",
        });
        console.log("  + 2 pedidos del cliente de prueba");
    }

    // Reseña de ejemplo
    const pupusas = products["Pupusas revueltas"];
    const hasReview = await reviewModel.exists({ productId: pupusas._id, customerId: customer._id });
    if (!hasReview) {
        await reviewModel.create({
            productId: pupusas._id,
            customerId: customer._id,
            customerName: `${customer.name} ${customer.lastName}`,
            rating: 5,
            comment: "Llegaron calientitas y a tiempo para el receso.",
        });
        console.log("  + reseña de ejemplo");
    }

    console.log(`\nListo. Usuario de prueba: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
    await mongoose.disconnect();
}

seed().catch(async (error) => {
    console.error("Error cargando datos de prueba:", error);
    await mongoose.disconnect();
    process.exit(1);
});
