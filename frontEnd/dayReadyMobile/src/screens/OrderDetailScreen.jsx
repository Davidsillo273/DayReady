// Detalle de un pedido: productos, totales, horas y estado. Si el pedido
// sigue "pendiente" se puede cancelar (el backend devuelve el stock de cada
// producto). De cada producto comprado se puede ir a su detalle para dejar
// una valoración.
import React, { useCallback, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import StatusBadge from "../components/StatusBadge";
import PrimaryButton from "../components/PrimaryButton";
import ordersService from "../services/ordersService";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts, radius } from "../theme/colors";

const PLACEHOLDER = "https://placehold.co/120x100/F4A261/FFFFFF/png?text=DayReady";

export default function OrderDetailScreen({ route, navigation }) {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const insets = useSafeAreaInsets();

  const loadOrder = useCallback(async () => {
    try {
      setOrder(await ordersService.getById(orderId));
    } catch (error) {
      Alert.alert("No se pudo cargar el pedido", error.message);
    }
  }, [orderId]);

  useFocusEffect(
    useCallback(() => {
      loadOrder();
    }, [loadOrder])
  );

  const handleCancel = () => {
    Alert.alert("Cancelar pedido", "¿Seguro que quieres cancelar este pedido? Los productos volverán a estar disponibles.", [
      { text: "No", style: "cancel" },
      {
        text: "Sí, cancelar",
        style: "destructive",
        onPress: async () => {
          setCancelling(true);
          try {
            const { order: updated } = await ordersService.cancel(orderId);
            setOrder((prev) => ({ ...prev, estado: updated.estado }));
            Alert.alert("Pedido cancelado", "El stock de los productos se devolvió al inventario.");
          } catch (error) {
            Alert.alert("No se pudo cancelar", error.message);
          } finally {
            setCancelling(false);
          }
        },
      },
    ]);
  };

  if (!order) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const canReview = order.estado !== "cancelado";

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 20, paddingBottom: 20 + insets.bottom }}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.orderNumber}>Pedido #{order._id.slice(-6).toUpperCase()}</Text>
          <StatusBadge status={order.estado} />
        </View>

        <InfoRow icon="calendar" label="Fecha" value={new Date(order.fecha).toLocaleDateString("es-ES")} />
        {order.horaCreacion ? <InfoRow icon="clock" label="Hora del pedido" value={order.horaCreacion} /> : null}
        {order.horaRecogida ? <InfoRow icon="map-pin" label="Hora de recogida" value={order.horaRecogida} /> : null}
        {order.horaEntrega ? <InfoRow icon="check-circle" label="Entregado a las" value={order.horaEntrega} /> : null}
        <InfoRow
          icon="credit-card"
          label="Pago"
          value={order.estadoPago ? "Completado" : "Pendiente"}
          valueColor={order.estadoPago ? colors.green : colors.red}
        />

        <Text style={styles.sectionTitle}>Productos</Text>
        {order.items.map((item, index) => {
          const product = item.productId; // viene populado con { _id, image }
          return (
            <View key={item._id || index} style={styles.item}>
              <Image source={{ uri: product?.image || PLACEHOLDER }} style={styles.itemImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemText}>
                  {item.quantity} x ${Number(item.price).toFixed(2)}
                </Text>
                <Text style={styles.itemSubtotal}>${(item.quantity * item.price).toFixed(2)}</Text>
              </View>
              {canReview && product?._id ? (
                <TouchableOpacity
                  style={styles.reviewButton}
                  onPress={() => navigation.navigate("ProductDetail", { productId: product._id })}
                >
                  <Feather name="star" size={14} color={colors.primaryDark} />
                  <Text style={styles.reviewText}>Valorar</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          );
        })}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${Number(order.total).toFixed(2)}</Text>
        </View>

        {order.estado === "pendiente" && (
          <PrimaryButton title="Cancelar pedido" onPress={handleCancel} loading={cancelling} style={styles.cancelButton} />
        )}
      </View>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value, valueColor = colors.textDark }) {
  return (
    <View style={styles.infoRow}>
      <Feather name={icon} size={14} color={colors.primary} />
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={[styles.infoValue, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.primaryLight },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.primaryLight },
  card: { backgroundColor: colors.white, borderRadius: 24, padding: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  orderNumber: { fontFamily: fonts.headingExtra, fontSize: 17, color: colors.textDark },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  infoLabel: { fontFamily: fonts.heading, fontSize: 13, color: colors.textDark },
  infoValue: { flex: 1, fontFamily: fonts.body, fontSize: 13 },
  sectionTitle: { fontFamily: fonts.heading, fontSize: 14, color: colors.textDark, marginTop: 12, marginBottom: 10 },
  item: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.bgPeach, borderRadius: radius.md, padding: 12, marginBottom: 10 },
  itemImage: { width: 60, height: 56, borderRadius: 10 },
  itemName: { fontFamily: fonts.heading, fontSize: 13, color: colors.textDark },
  itemText: { fontSize: 12, color: colors.textMedium },
  itemSubtotal: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.textDark },
  reviewButton: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.white, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  reviewText: { fontFamily: fonts.heading, fontSize: 11, color: colors.primaryDark },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 16 },
  totalLabel: { fontFamily: fonts.heading, fontSize: 15, color: colors.textDark },
  totalValue: { fontFamily: fonts.headingExtra, fontSize: 18, color: colors.textDark },
  cancelButton: { backgroundColor: colors.red },
});
