// Confirmación de datos antes de pagar. Al tocar "Siguiente" el carrito se
// guarda de verdad en el backend (POST /cart o PUT /cart/:id si ya
// existía), para que quede un registro real antes de simular el pago.
import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import EmptyState from "../components/EmptyState";
import { validatePhone } from "../utils/validators";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts, radius } from "../theme/colors";

const PICKUP_SLOTS = ["9:30 am", "10:00 am", "10:30 am", "12:00 pm", "12:30 pm"];

export default function CheckoutScreen({ navigation }) {
  const { customer } = useAuth();
  const cart = useCart();
  const insets = useSafeAreaInsets();

  const [phone, setPhone] = useState(customer?.phone || "");
  const [pickupTime, setPickupTime] = useState(PICKUP_SLOTS[1]);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState(null);

  const handleContinue = async () => {
    if (cart.items.length === 0) {
      Alert.alert("Carrito vacío", "Agrega al menos un producto antes de continuar.");
      return;
    }
    const error = validatePhone(phone);
    setPhoneError(error);
    if (error) return;

    setLoading(true);
    try {
      await cart.persistCart(customer._id);
      navigation.navigate("Payment", { pickupTime });
    } catch (error) {
      Alert.alert("No se pudo guardar el carrito", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 20, paddingBottom: 20 + insets.bottom }}>
      <View style={styles.card}>
        <InputField label="Nombre" value={`${customer?.name || ""} ${customer?.lastName || ""}`} editable={false} />
        <InputField label="Correo electrónico" value={customer?.email || ""} editable={false} />
        <InputField label="Teléfono" value={phone} onChangeText={setPhone} keyboardType="phone-pad" error={phoneError} />

        <Text style={styles.label}>Selecciona hora de recogida</Text>
        <View style={styles.slotsRow}>
          {PICKUP_SLOTS.map((slot) => (
            <TouchableOpacity
              key={slot}
              style={[styles.slot, pickupTime === slot && styles.slotActive]}
              onPress={() => setPickupTime(slot)}
            >
              <Text style={[styles.slotText, pickupTime === slot && styles.slotTextActive]}>{slot}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Detalles del pedido</Text>
        {cart.items.length === 0 ? (
          <View style={styles.empty}>
            <EmptyState icon="shopping-cart" title="No hay productos en el carrito" message="No puedes hacer un pedido sin productos.">
              <PrimaryButton title="Ir al catálogo" onPress={() => navigation.navigate("Main", { screen: "Inicio" })} style={{ width: 180 }} />
            </EmptyState>
          </View>
        ) : (
          cart.items.map((item) => (
            <View key={item.key} style={styles.item}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemText}><Text style={styles.bold}>Producto:</Text> {item.name}</Text>
                <Text style={styles.itemText}><Text style={styles.bold}>Cantidad:</Text> {item.cantidad}</Text>
                <Text style={styles.itemText}>
                  <Text style={styles.bold}>Subtotal:</Text> ${(item.price * item.cantidad).toFixed(2)}
                </Text>
              </View>
            </View>
          ))
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${cart.total.toFixed(2)}</Text>
        </View>

        <PrimaryButton title="Siguiente" onPress={handleContinue} loading={loading} disabled={cart.items.length === 0} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.primaryLight },
  card: { backgroundColor: colors.white, borderRadius: 24, padding: 20 },
  label: { fontFamily: fonts.heading, fontSize: 14, color: colors.textDark, marginBottom: 8 },
  slotsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  slot: { borderWidth: 1.5, borderColor: colors.border, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14 },
  slotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  slotText: { fontSize: 12, color: colors.textDark },
  slotTextActive: { color: colors.white, fontFamily: fonts.heading },
  sectionTitle: { fontFamily: fonts.heading, fontSize: 14, color: colors.textDark, marginBottom: 10 },
  empty: { backgroundColor: colors.bgPeach, borderRadius: radius.md },
  item: { flexDirection: "row", gap: 12, backgroundColor: colors.bgPeach, borderRadius: radius.md, padding: 14, marginBottom: 10 },
  itemImage: { width: 70, height: 65, borderRadius: 10 },
  itemText: { fontSize: 12, marginBottom: 3, color: colors.textDark },
  bold: { fontFamily: fonts.heading },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 16 },
  totalLabel: { fontFamily: fonts.heading, fontSize: 15, color: colors.textDark },
  totalValue: { fontFamily: fonts.headingExtra, fontSize: 18, color: colors.textDark },
});
