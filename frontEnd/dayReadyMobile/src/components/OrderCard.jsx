// Resumen de un pedido en el historial. Al tocarlo se abre su detalle.
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import StatusBadge from "./StatusBadge";
import { colors, fonts, radius } from "../theme/colors";

const PLACEHOLDER = "https://placehold.co/120x100/F4A261/FFFFFF/png?text=DayReady";

export default function OrderCard({ order, onPress }) {
  const firstImage = order.items.find((i) => i.productId?.image)?.productId.image;
  const units = order.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: firstImage || PLACEHOLDER }} style={styles.image} />
      <View style={{ flex: 1 }}>
        <View style={styles.topRow}>
          <Text style={styles.date}>{new Date(order.fecha).toLocaleDateString("es-ES")}</Text>
          <StatusBadge status={order.estado} />
        </View>
        <Text style={styles.items} numberOfLines={2}>
          {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
        </Text>
        <View style={styles.bottomRow}>
          <Text style={styles.units}>{units} producto{units === 1 ? "" : "s"}</Text>
          <Text style={styles.total}>${Number(order.total).toFixed(2)}</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={18} color={colors.textLight} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.bgPeach, borderRadius: radius.md, padding: 12, marginBottom: 12 },
  image: { width: 70, height: 70, borderRadius: 12 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  date: { fontSize: 12, color: colors.textLight },
  items: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.textDark, marginBottom: 4 },
  bottomRow: { flexDirection: "row", justifyContent: "space-between" },
  units: { fontSize: 12, color: colors.textMedium },
  total: { fontFamily: fonts.heading, fontSize: 14, color: colors.textDark },
});
