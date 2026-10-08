// Mensaje para listas vacías (carrito sin productos, sin pedidos, etc.).
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, fonts } from "../theme/colors";

export default function EmptyState({ icon = "inbox", title, message, children }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Feather name={icon} size={30} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: 32, paddingHorizontal: 16 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.bgPeach, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  title: { fontFamily: fonts.heading, fontSize: 15, color: colors.textDark, textAlign: "center" },
  message: { fontFamily: fonts.body, fontSize: 13, color: colors.textLight, textAlign: "center", marginTop: 4, marginBottom: 12 },
});
