// Detalle de un producto. Recibe el producto por parámetro de navegación
// (route.params.product) para pintarlo al instante, pero igual lo vuelve a
// pedir al backend para tener el stock actualizado. Desde el historial de
// pedidos se puede llegar sólo con route.params.productId.
//
// Aquí también viven las valoraciones: el promedio, la lista de reseñas y
// el formulario para opinar, que sólo aparece si el cliente ya compró el
// producto (el backend lo vuelve a validar al guardar).
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import QuantityControl from "../components/QuantityControl";
import PrimaryButton from "../components/PrimaryButton";
import StarRating from "../components/StarRating";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";
import productsService from "../services/productsService";
import reviewsService from "../services/reviewsService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { colors, fonts } from "../theme/colors";

const PLACEHOLDER = "https://placehold.co/600x400/F4A261/FFFFFF/png?text=DayReady";

export default function ProductDetailScreen({ route, navigation }) {
  const productId = route.params.product?._id || route.params.productId;
  const { customer } = useAuth();
  const cart = useCart();

  const [product, setProduct] = useState(route.params.product || null);
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState({ average: 0, count: 0, reviews: [] });
  const [eligibility, setEligibility] = useState({ canReview: false, review: null });

  const loadReviews = useCallback(async () => {
    const [list, status] = await Promise.all([
      reviewsService.getByProduct(productId),
      reviewsService.getEligibility(productId, customer._id),
    ]);
    setReviews(list);
    setEligibility(status);
  }, [productId, customer._id]);

  useEffect(() => {
    // Producto fresco (stock real). Si viene del menú del día se conserva
    // el precio y stock de ese menú, que son los que valen ese día.
    productsService
      .getById(productId)
      .then((fresh) => setProduct(route.params.product ? { ...fresh, ...route.params.product } : fresh))
      .catch((error) => {
        if (!route.params.product) Alert.alert("No se pudo cargar el producto", error.message);
      });
    loadReviews().catch(() => {});
  }, [productId, loadReviews, route.params.product]);

  useEffect(() => {
    if (!product?.category) return;
    productsService
      .getByCategory(product.category)
      .then((list) => setRelated(list.filter((p) => p._id !== productId).slice(0, 5)))
      .catch(() => setRelated([])); // si no hay más de esa categoría, simplemente no se muestra la sección
  }, [product?.category, productId]);

  if (!product) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const stock = Number(product.quantity ?? 0);
  const inCart = cart.items.find((i) => i.productId === productId)?.cantidad || 0;
  const available = Math.max(stock - inCart, 0);
  const outOfStock = available <= 0;

  // Si el stock disponible baja (por ejemplo, ya se agregó al carrito), la
  // cantidad elegida no puede quedarse por encima.
  if (!outOfStock && quantity > available) setQuantity(available);

  const handleContinue = () => {
    const error = cart.addItem(product, quantity);
    if (error) return Alert.alert("Sin stock suficiente", error);
    navigation.navigate("Checkout");
  };

  const handleSaveReview = async ({ rating, comment }) => {
    await reviewsService.save({ productId, customerId: customer._id, rating, comment });
    await loadReviews();
    Alert.alert("¡Gracias!", "Tu valoración se guardó correctamente.");
  };

  const handleDeleteReview = () => {
    Alert.alert("Eliminar reseña", "¿Seguro que quieres borrar tu valoración?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await reviewsService.remove(eligibility.review._id, customer._id);
            await loadReviews();
          } catch (error) {
            Alert.alert("No se pudo eliminar", error.message);
          }
        },
      },
    ]);
  };

  const otherReviews = reviews.reviews.filter((r) => r._id !== eligibility.review?._id);

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <Image source={{ uri: product.image || PLACEHOLDER }} style={styles.heroImage} />
        <TouchableOpacity style={[styles.roundButton, styles.backButton]} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color={colors.textDark} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.details}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{product.category}</Text>
        </View>

        <Text style={styles.name}>{product.name}</Text>
        <View style={styles.ratingRow}>
          <StarRating value={reviews.average} size={14} />
          <Text style={styles.ratingText}>
            {reviews.count ? `${reviews.average} (${reviews.count} reseña${reviews.count === 1 ? "" : "s"})` : "Sin reseñas todavía"}
          </Text>
        </View>
        <Text style={[styles.stock, stock <= 0 && { color: colors.red }]}>
          {stock > 0 ? `${stock} disponibles` : "Agotado"}
          {inCart > 0 ? ` · ${inCart} en tu carrito` : ""}
        </Text>
        <Text style={styles.price}>${Number(product.price).toFixed(2)}</Text>
        <Text style={styles.description}>{product.description}</Text>

        {related.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Los demás también compraron</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, marginBottom: 24 }}>
              {related.map((r) => (
                <TouchableOpacity
                  key={r._id}
                  style={{ width: 110 }}
                  onPress={() => navigation.push("ProductDetail", { product: r })}
                >
                  <Image source={{ uri: r.image || PLACEHOLDER }} style={styles.relatedImage} />
                  <Text style={styles.relatedPrice}>${Number(r.price).toFixed(2)}</Text>
                  <Text style={styles.relatedName} numberOfLines={1}>{r.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        <Text style={styles.sectionTitle}>Valoraciones y comentarios</Text>

        {eligibility.canReview ? (
          <>
            <ReviewForm initialReview={eligibility.review} onSubmit={handleSaveReview} />
            {eligibility.review && (
              <TouchableOpacity onPress={handleDeleteReview} style={styles.deleteReview}>
                <Feather name="trash-2" size={13} color={colors.red} />
                <Text style={styles.deleteReviewText}>Eliminar mi reseña</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={styles.reviewHint}>
            <Feather name="info" size={14} color={colors.primaryDark} />
            <Text style={styles.reviewHintText}>Podrás valorar este producto después de comprarlo.</Text>
          </View>
        )}

        {otherReviews.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
        {reviews.count === 0 && <Text style={styles.noReviews}>Nadie ha opinado todavía.</Text>}
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomBarQty}>{quantity} producto{quantity > 1 ? "s" : ""}</Text>
          <Text style={styles.bottomBarTotal}>${(product.price * quantity).toFixed(2)}</Text>
        </View>
        <View style={styles.bottomBarActions}>
          {!outOfStock && <QuantityControl value={quantity} onChange={setQuantity} max={available} />}
          <PrimaryButton
            title={outOfStock ? (stock > 0 ? "Ya en carrito" : "Agotado") : "Agregar"}
            onPress={handleContinue}
            disabled={outOfStock}
            style={{ width: "auto", paddingHorizontal: 24 }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white },
  hero: { height: 280 },
  heroImage: { width: "100%", height: "100%" },
  roundButton: {
    position: "absolute",
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  backButton: { top: 48, left: 16 },
  details: { padding: 20, paddingBottom: 40 },
  categoryBadge: { alignSelf: "flex-start", backgroundColor: colors.primary, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 10 },
  categoryText: { color: colors.white, fontSize: 11, fontFamily: fonts.heading },
  name: { fontFamily: fonts.headingExtra, fontSize: 22, color: colors.textDark, marginBottom: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  ratingText: { fontSize: 12, color: colors.textMedium },
  stock: { fontSize: 12, color: "#999", marginBottom: 4 },
  price: { fontFamily: fonts.heading, fontSize: 18, color: colors.textDark, marginBottom: 12 },
  description: { fontSize: 13, color: "#666", lineHeight: 22, marginBottom: 24 },
  sectionTitle: { fontFamily: fonts.heading, fontSize: 14, color: colors.textDark, marginBottom: 14 },
  relatedImage: { width: 110, height: 90, borderRadius: 12 },
  relatedPrice: { fontFamily: fonts.heading, fontSize: 13, color: colors.textDark, marginTop: 6 },
  relatedName: { fontSize: 11, color: "#888" },
  reviewHint: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.bgPeach, borderRadius: 12, padding: 12, marginBottom: 14 },
  reviewHintText: { flex: 1, fontSize: 12, color: colors.textMedium },
  deleteReview: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-end", marginTop: -8, marginBottom: 14 },
  deleteReviewText: { color: colors.red, fontSize: 12, fontFamily: fonts.heading },
  noReviews: { color: colors.textLight, fontSize: 12, textAlign: "center", marginTop: 4 },
  bottomBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, backgroundColor: colors.white, elevation: 6 },
  bottomBarQty: { fontSize: 12, color: "#999" },
  bottomBarTotal: { fontFamily: fonts.heading, fontSize: 16, color: colors.textDark },
  bottomBarActions: { flexDirection: "row", alignItems: "center", gap: 16 },
});
