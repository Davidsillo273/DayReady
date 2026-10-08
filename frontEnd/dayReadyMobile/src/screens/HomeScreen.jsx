// Pantalla principal. Antes mostraba 6 productos quemados en el código;
// ahora trae el catálogo real de /products y el menú del día real de
// /menu, y agregar al carrito llama a CartContext (que si hiciera falta,
// lo persiste en el backend al llegar a Checkout).
import React, { useCallback, useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import ProductCard from "../components/ProductCard";
import CartModal from "../components/CartModal";
import productsService from "../services/productsService";
import menuService from "../services/menuService";
import reviewsService from "../services/reviewsService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { colors, fonts } from "../theme/colors";

export default function HomeScreen({ navigation }) {
  const { customer } = useAuth();
  const cart = useCart();

  const [products, setProducts] = useState([]);
  const [dailyMenu, setDailyMenu] = useState([]);
  const [ratings, setRatings] = useState({}); // { [productId]: { average, count } }
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadCatalog = useCallback(async () => {
    setLoadError("");
    try {
      const [productList, menuList, summary] = await Promise.all([
        productsService.getAll(),
        menuService.getAll(),
        reviewsService.getSummary().catch(() => []),
      ]);
      setProducts(productList);
      setDailyMenu(menuList);
      setRatings(Object.fromEntries(summary.map((s) => [s.productId, s])));
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Se recarga cada vez que se vuelve a Home: así el stock y las
  // valoraciones siempre están al día (por ejemplo después de comprar o de
  // cancelar un pedido).
  useFocusEffect(
    useCallback(() => {
      loadCatalog();
    }, [loadCatalog])
  );

  const term = search.trim().toLowerCase();
  const filteredProducts = products.filter(
    (p) => p.name?.toLowerCase().includes(term) || p.category?.toLowerCase().includes(term)
  );
  // "Destacados" viene del menú del día (dailyMenu.productId trae el
  // producto ya populado desde el backend, pero sólo con name/image/
  // category); el precio, la descripción y el stock del día se toman del
  // propio documento de menú, no del producto base, porque pueden variar
  // día a día. Si el estudiante busca algo, el menú también se filtra por
  // el mismo texto.
  const featured = dailyMenu
    .filter((m) => m.productId && m.productId.name?.toLowerCase().includes(term))
    .map((m) => ({
      ...m.productId,
      price: m.price,
      name: m.name || m.productId.name,
      description: m.description,
      quantity: m.stock,
    }));

  // Nombre real del cliente (no el correo), tal como se registró.
  const fullName = [customer?.name, customer?.lastName].filter(Boolean).join(" ") || "Estudiante";
  const initials = `${customer?.name?.[0] || ""}${customer?.lastName?.[0] || ""}`.toUpperCase();

  const handleAdd = (product) => {
    const error = cart.addItem(product);
    if (error) Alert.alert("Sin stock suficiente", error);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials || "DR"}</Text>
            </View>
            <View>
              <Text style={styles.greeting} numberOfLines={1}>Hola, {fullName}</Text>
              <Text style={styles.question}>¿Listo para ordenar?</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setShowCart(true)} style={styles.cartButton}>
            <Feather name="shopping-cart" size={24} color={colors.textDark} />
            {cart.items.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cart.itemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <Feather name="search" size={16} color="#aaa" />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar comida, bebida..."
            placeholderTextColor={colors.textLight}
          />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadCatalog} colors={[colors.primary]} />}
      >
        {loadError ? <Text style={styles.errorText}>{loadError}</Text> : null}

        <View style={styles.banner}>
          <View>
            <Text style={styles.bannerTitle}>¡Evita la fila!</Text>
            <Text style={styles.bannerSubtitle}>Ordena para el receso ahora mismo.</Text>
          </View>
          <Feather name="clock" size={34} color={colors.primary} />
        </View>

        {featured.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionTitle}>Destacados de hoy</Text>
            <Text style={styles.sectionSubtitle}>Menú del día:</Text>
            <View style={styles.grid}>
              {featured.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  rating={ratings[p._id]}
                  onAdd={handleAdd}
                  onPress={() => navigation.navigate("ProductDetail", { product: p })}
                />
              ))}
            </View>
          </View>
        )}

        <Text style={styles.sectionSubtitle}>Catálogo completo:</Text>
        <View style={styles.grid}>
          {filteredProducts.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              rating={ratings[p._id]}
              onAdd={handleAdd}
              onPress={() => navigation.navigate("ProductDetail", { product: p })}
            />
          ))}
        </View>

        {!loading && filteredProducts.length === 0 && (
          <Text style={styles.emptyText}>No se encontraron productos para "{search}".</Text>
        )}
      </ScrollView>

      <CartModal
        visible={showCart}
        items={cart.items}
        total={cart.total}
        onClose={() => setShowCart(false)}
        onUpdateQuantity={cart.updateQuantity}
        onRemove={cart.removeItem}
        onCheckout={() => {
          setShowCart(false);
          navigation.navigate("Checkout");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  header: { backgroundColor: colors.white, paddingTop: 20, paddingHorizontal: 20, paddingBottom: 16, elevation: 2 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  avatarText: { color: colors.white, fontFamily: fonts.headingExtra, fontSize: 15 },
  greeting: { fontSize: 13, fontFamily: fonts.heading, color: colors.primaryDark, maxWidth: 220 },
  question: { fontSize: 14, fontFamily: fonts.heading, color: colors.textDark },
  cartButton: { padding: 8 },
  cartBadge: { position: "absolute", top: 2, right: 2, backgroundColor: colors.primary, borderRadius: 9, width: 18, height: 18, alignItems: "center", justifyContent: "center" },
  cartBadgeText: { color: colors.white, fontSize: 10, fontFamily: fonts.heading },
  searchRow: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#F5F5F8", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  searchInput: { flex: 1, fontSize: 13, color: colors.textMedium },
  content: { padding: 20, paddingBottom: 40 },
  errorText: { color: colors.red, marginBottom: 12 },
  banner: { backgroundColor: colors.bgPeach, borderRadius: 16, padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  bannerTitle: { fontFamily: fonts.heading, fontSize: 14, color: colors.textDark },
  bannerSubtitle: { fontSize: 12, color: "#777", marginTop: 2 },
  sectionTitle: { fontFamily: fonts.heading, fontSize: 15, color: colors.textDark, marginBottom: 2 },
  sectionSubtitle: { fontSize: 12, color: "#999", marginBottom: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 12 },
  emptyText: { textAlign: "center", color: colors.textLight, marginTop: 20 },
});
