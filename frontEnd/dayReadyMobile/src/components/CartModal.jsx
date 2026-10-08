// Hoja modal del carrito, se abre desde el ícono del carrito en Home.
// Usa el Modal nativo de React Native (transparente + animación "slide")
// para lograr el mismo efecto de "hoja que sube desde abajo" que tenía el
// mockup web con CSS puro.
import React from "react";
import { Modal, View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import QuantityControl from "./QuantityControl";
import PrimaryButton from "./PrimaryButton";
import EmptyState from "./EmptyState";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts, radius } from "../theme/colors";

export default function CartModal({ visible, items, total, onClose, onUpdateQuantity, onRemove, onCheckout }) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={[styles.sheet, { paddingBottom: 24 + insets.bottom }]} activeOpacity={1} onPress={() => {}}>
          <View style={styles.handle} />
          <Text style={styles.title}>Carrito de compras</Text>

          <ScrollView style={{ maxHeight: height * 0.5 }}>
            {items.length === 0 ? (
              <EmptyState icon="shopping-cart" title="Tu carrito está vacío" message="Agrega productos del catálogo para hacer un pedido." />
            ) : (
              items.map((item) => (
                <View key={item.key} style={styles.item}>
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemText}>
                        <Text style={styles.itemLabel}>Producto: </Text>
                        {item.name}
                      </Text>
                      <Text style={[styles.itemText, { marginBottom: 8 }]}>
                        <Text style={styles.itemLabel}>Precio: </Text>${item.price.toFixed(2)}
                      </Text>
                      <QuantityControl
                        value={item.cantidad}
                        max={item.stock}
                        onChange={(qty) => onUpdateQuantity(item.key, qty)}
                      />
                      {item.cantidad >= item.stock ? (
                        <Text style={styles.stockHint}>Máximo disponible: {item.stock}</Text>
                      ) : null}
                    </View>
                  </View>
                  <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(item.key)}>
                    <Feather name="trash-2" size={14} color={colors.textLight} />
                    <Text style={styles.removeText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>

          <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
          <PrimaryButton title="Continuar" onPress={onCheckout} disabled={items.length === 0} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 36 },
  handle: { width: 40, height: 4, backgroundColor: "#E0E0E8", borderRadius: 4, alignSelf: "center", marginBottom: 20 },
  title: { fontFamily: fonts.heading, fontSize: 18, color: colors.textDark, textAlign: "center", marginBottom: 20 },
  stockHint: { fontSize: 11, color: colors.primaryDark, marginTop: 6 },
  item: { backgroundColor: colors.bgPeach, borderRadius: radius.md, padding: 16, marginBottom: 12 },
  itemImage: { width: 80, height: 80, borderRadius: 10 },
  itemText: { fontSize: 13, color: colors.textDark, marginBottom: 4 },
  itemLabel: { fontFamily: fonts.heading },
  removeButton: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-end", marginTop: 8 },
  removeText: { color: colors.textLight, fontSize: 13 },
  total: { fontFamily: fonts.heading, fontSize: 18, color: colors.textDark, textAlign: "center", marginVertical: 16 },
});
