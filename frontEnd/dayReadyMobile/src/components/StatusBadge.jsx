// Etiqueta de color con el estado de un pedido (pendiente, entregado...).
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "../theme/colors";

const STATUS = {
  pendiente: { label: "Pendiente", color: colors.primaryDark, bg: colors.primaryLight },
  entregado: { label: "Entregado", color: colors.greenDark, bg: colors.greenLight },
  "no entregado": { label: "No entregado", color: colors.red, bg: "#FDE2E0" },
  cancelado: { label: "Cancelado", color: colors.textMedium, bg: colors.border },
};

export default function StatusBadge({ status }) {
  const style = STATUS[status] || { label: status, color: colors.textDark, bg: colors.border };

  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.text, { color: style.color }]}>{style.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  text: { fontFamily: fonts.heading, fontSize: 11 },
});
