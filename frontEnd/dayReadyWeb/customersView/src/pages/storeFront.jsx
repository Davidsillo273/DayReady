import React, { useState } from 'react';
import Navbar from '../../../customersView/src/components/NavBar';
import CategoryBar from '../../../customersView/src/components/CategoryBar';
import PromoCard from '../../../customersView/src/components/PromoCard';
import ProductCard from '../../../customersView/src/components/ProductCard';
import ProductSection from '../../../customersView/src/components/ProductSection';
import ProductModal from '../../../customersView/src/components/ProductModal';
import CartSidebar from '../../../customersView/src/components/CartSideBar';
import WalletModal from '../../../customersView/src/components/WalletModal';
import ProfileModal from '../../../customersView/src/components/ProfileModal';
import CheckoutModal from '../../../customersView/src/components/CheckoutModal';

export default function Storefront() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWalletOpen, setIsWalletOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // DATOS CON IMÁGENES REALES DE PRUEBA (Unsplash)
    const data = {
        destacados: [
            { id: 101, title: "Bowl de Pollo Teriyaki", price: 4.25, location: "Kiosko Saludable", category: "Almuerzos", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80" },
            { id: 102, title: "Club Sandwich + Papas", price: 3.99, location: "Cafetería Central", category: "Combos", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&q=80" },
            { id: 103, title: "Frappé de Caramelo", price: 2.50, location: "Coffee Bar", category: "Bebidas", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80" },
            { id: 104, title: "Tacos al Pastor (3)", price: 3.00, location: "La Taquería", category: "Mexicana", image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&q=80" },
        ],
        snacks: [
            { id: 201, title: "Muffin de Arándanos", price: 1.25, location: "Bakery", category: "Repostería", image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=500&q=80" },
            { id: 202, title: "Papas Nativas", price: 1.00, location: "Cafetería Central", category: "Snacks", image: "https://images.unsplash.com/photo-1518013034484-0ac29cf80dee?w=500&q=80" },
            { id: 203, title: "Yogurt con Granola", price: 1.75, location: "Kiosko Saludable", category: "Saludable", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80" },
        ],
        bebidas: [
            { id: 301, title: "Jugo de Naranja Natural", price: 1.50, location: "Kiosko Saludable", category: "Bebidas", image: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=500&q=80" },
            { id: 302, title: "Cappuccino Italiano", price: 2.00, location: "Coffee Bar", category: "Bebidas Calientes", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80" },
            { id: 303, title: "Té Frío de Limón", price: 1.25, location: "Cafetería Central", category: "Bebidas", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80" },
        ]
    };

    const handleCheckout = () => {
        setIsCartOpen(false);
        setIsCheckoutOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-20">
            <Navbar onCartClick={() => setIsCartOpen(true)} onWalletClick={() => setIsWalletOpen(true)} onProfileClick={() => setIsProfileOpen(true)} />
            <CategoryBar />

            <main className="max-w-6xl mx-auto px-6 py-4 space-y-12">

                {/* 1. SECCIÓN DE REPETIR PEDIDO */}
                <section>
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">¿Lo de siempre, David?</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        <div className="flex-shrink-0 flex items-center gap-3 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all">
                            <img src={data.destacados[0].image} className="w-12 h-12 rounded-xl object-cover" />
                            <div>
                                <p className="text-sm font-bold text-gray-800">Bowl de Pollo</p>
                                <p className="text-[10px] text-orange-500 font-bold">Repetir por $4.25</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. BANNERS DINÁMICOS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PromoCard title="Hora del Almuerzo" subtitle="Menú completo desde $3.50" bgColor="bg-blue-50" borderColor="border-blue-100" icon={<svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" strokeWidth="1" /></svg>} />
                    <PromoCard title="DayWallet" subtitle="10% de cashback en café" bgColor="bg-green-50" borderColor="border-green-100" isWallet icon={<svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.621 1M12 17c-1.12 0-2.09-.447-2.637-1m1-11V4m0 14v-1" strokeWidth="1" /></svg>} />
                </div>

                {/* 3. SECCIONES DE PRODUCTOS */}
                <ProductSection title="Los más populares" icon={<svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>}>
                    {data.destacados.map(p => (
                        <div key={p.id} onClick={() => setSelectedProduct(p)}><ProductCard {...p} /></div>
                    ))}
                </ProductSection>

                <ProductSection title="Bebidas Frías y Café" icon={<svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}>
                    {data.bebidas.map(p => (
                        <div key={p.id} onClick={() => setSelectedProduct(p)}><ProductCard {...p} /></div>
                    ))}
                </ProductSection>

                <ProductSection title="Snacks para el receso" icon={<svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3" /></svg>}>
                    {data.snacks.map(p => (
                        <div key={p.id} onClick={() => setSelectedProduct(p)}><ProductCard {...p} /></div>
                    ))}
                </ProductSection>

            </main>

            {/* Modales */}
            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
            <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

            {/* AGREGA ESTA LÍNEA AQUÍ ABAJO */}
            <ProductModal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                product={selectedProduct}
            />
            
            {/* En el CartSidebar, el botón debe disparar handleCheckout */}
            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onCheckout={handleCheckout}
            />
        </div>
    );
}