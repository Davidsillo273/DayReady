// Tarjeta de producto usada en la grilla de Home. "product" viene tal cual
// lo devuelve el backend (name, price, category, image, quantity...).
// "rating" es { average, count } y viene del resumen de reseñas.
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import StarRating from "./StarRating";
import { colors, radius, fonts, shadow } from "../theme/colors";

export default function ProductCard({ product, rating, onAdd, onPress }) {
  const outOfStock = Number(product.quantity ?? 0) <= 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View>
        <Image
          source={{ uri: product.image || "https://via.placeholder.com/300x180?text=DayReady" }}
          style={styles.image}
        />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{product.category}</Text>
        </View>
        {outOfStock && (
          <View style={styles.soldOut}>
            <Text style={styles.soldOutText}>Agotado</Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={10} color={colors.primary} />
          <Text style={styles.locationText} numberOfLines={1}>{product.type || "Cafetería"}</Text>
        </View>
        <View style={styles.ratingRow}>
          <StarRating value={rating?.average || 0} size={11} />
          <Text style={styles.ratingText}>({rating?.count || 0})</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.price}>${Number(product.price).toFixed(2)}</Text>
          <TouchableOpacity
            style={[styles.addButton, outOfStock && styles.addButtonDisabled]}
            disabled={outOfStock}
            onPress={(event) => {
              event.stopPropagation?.();
              onAdd(product);
            }}
          >
            <Text style={styles.addButtonText}>{outOfStock ? "Agotado" : "Agregar"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: "48%", backgroundColor: colors.white, borderRadius: radius.md, overflow: "hidden", ...shadow.card },
  image: { width: "100%", height: 110 },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: { color: colors.white, fontSize: 10, fontFamily: fonts.heading },
  body: { padding: 10 },
  name: { fontFamily: fonts.heading, fontSize: 13, color: colors.textDark, marginBottom: 2 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 3, marginBottom: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 8 },
  ratingText: { fontSize: 10, color: colors.textLight },
  soldOut: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center", justifyContent: "center" },
  soldOutText: { color: colors.white, fontFamily: fonts.headingExtra, fontSize: 14 },
  addButtonDisabled: { backgroundColor: colors.textLight },
  locationText: { fontSize: 11, color: colors.textLight },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  price: { fontFamily: fonts.heading, fontSize: 15, color: colors.textDark },
  addButton: { backgroundColor: colors.primary, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14 },
  addButtonText: { color: colors.white, fontSize: 12, fontFamily: fonts.heading },
});
