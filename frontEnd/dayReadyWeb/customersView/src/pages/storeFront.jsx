import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import CategoryBar from '../components/CategoryBar';
import PromoCard from '../components/PromoCard';
import ProductCard from '../components/ProductCard';
import ProductSection from '../components/ProductSection';
import ProductModal from '../components/ProductModal';
import CartSidebar from '../components/CartSideBar';
import WalletModal from '../components/WalletModal';
import ProfileModal from '../components/ProfileModal';
import CheckoutModal from '../components/CheckoutModal';
import { getProducts } from '../services/productsService';
import { getCustomerByEmail } from '../services/customersService';

export default function Storefront() {
    const navigate = useNavigate();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWalletOpen, setIsWalletOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const [products, setProducts] = useState([]);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadCustomer = async () => {
        const email = localStorage.getItem('customerEmail');
        if (!email) return;
        const found = await getCustomerByEmail(email);
        setCustomer(found);
    };

    useEffect(() => {
        // Si no hay sesión guardada, no tiene caso mostrar el storefront.
        if (!localStorage.getItem('customerId')) {
            navigate('/');
            return;
        }

        Promise.all([getProducts(), loadCustomer()])
            .then(([productList]) => setProducts(productList))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    // Agrupar el catálogo real por categoría en vez de las 3 listas fijas
    // (destacados/snacks/bebidas) que antes venían quemadas en el código.
    const productsByCategory = products.reduce((groups, product) => {
        const key = product.category || 'Otros';
        if (!groups[key]) groups[key] = [];
        groups[key].push(product);
        return groups;
    }, {});

    const handleCheckout = () => {
        setIsCartOpen(false);
        setIsCheckoutOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-20">
            <Navbar
                customer={customer}
                onCartClick={() => setIsCartOpen(true)}
                onWalletClick={() => setIsWalletOpen(true)}
                onProfileClick={() => setIsProfileOpen(true)}
            />
            <CategoryBar />

            <main className="max-w-6xl mx-auto px-6 py-4 space-y-12">

                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                {/* 1. SECCIÓN DE REPETIR PEDIDO */}
                {products[0] && (
                    <section>
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
                            ¿Lo de siempre, {customer?.name || 'estudiante'}?
                        </h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                            <div
                                onClick={() => setSelectedProduct(products[0])}
                                className="flex-shrink-0 flex items-center gap-3 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all"
                            >
                                <img src={products[0].image} className="w-12 h-12 rounded-xl object-cover" />
                                <div>
                                    <p className="text-sm font-bold text-gray-800">{products[0].title}</p>
                                    <p className="text-[10px] text-orange-500 font-bold">Repetir por ${products[0].price.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* 2. BANNERS DINÁMICOS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PromoCard title="Hora del Almuerzo" subtitle="Menú completo desde $3.50" bgColor="bg-blue-50" borderColor="border-blue-100" icon={<svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" strokeWidth="1" /></svg>} />
                    <PromoCard
                        title="DayWallet"
                        subtitle={`Saldo disponible: $${Number(customer?.balance || 0).toFixed(2)}`}
                        bgColor="bg-green-50"
                        borderColor="border-green-100"
                        isWallet
                        icon={<svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.621 1M12 17c-1.12 0-2.09-.447-2.637-1m1-11V4m0 14v-1" strokeWidth="1" /></svg>}
                    />
                </div>

                {/* 3. SECCIONES DE PRODUCTOS, una por categoría real */}
                {loading && <p className="text-center text-gray-400">Cargando catálogo...</p>}
                {!loading && products.length === 0 && !error && (
                    <p className="text-center text-gray-400">Todavía no hay productos en el catálogo.</p>
                )}
                {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
                    <ProductSection key={category} title={category} icon="🍽️">
                        {categoryProducts.map((p) => (
                            <div key={p.id} onClick={() => setSelectedProduct(p)}><ProductCard {...p} /></div>
                        ))}
                    </ProductSection>
                ))}

            </main>

            {/* Modales */}
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                customer={customer}
                onProfileUpdated={loadCustomer}
            />
            <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} customer={customer} />
            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} customer={customer} />

            <ProductModal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                product={selectedProduct}
            />

            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onCheckout={handleCheckout}
            />
        </div>
    );
}
