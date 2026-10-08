// Logotipo oficial de DayReady (assets/DayReadyLogo.png, recortado a sus
// bordes) sobre una tarjeta blanca centrada: el logo es naranja, así que
// sobre los encabezados de color no se vería sin ese fondo. Se usa en
// Login, Registro, Términos y la pantalla de carga.
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

// Proporción del PNG recortado (558×262).
const RATIO = 262 / 558;

export default function Logo({ size = 1 }) {
  const width = 200 * size;
  return (
    <View style={[styles.badge, { borderRadius: 24 * size, paddingVertical: 14 * size, paddingHorizontal: 22 * size }]}>
      <Image
        source={require("../../assets/DayReadyLogo.png")}
        style={{ width, height: width * RATIO }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: "center", backgroundColor: colors.white, elevation: 3 },
});
