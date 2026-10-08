// Fila de 5 estrellas. Sin "onChange" sólo muestra la valoración (por
// ejemplo el promedio de un producto); con "onChange" se vuelve un input
// para que el cliente elija de 1 a 5 al dejar su reseña.
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../theme/colors";

const STAR_COLOR = "#FFB400";

export default function StarRating({ value = 0, onChange, size = 14 }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.row}>
      {stars.map((star) => {
        // Media estrella cuando el promedio cae a la mitad (ej. 3.5)
        const name = value >= star ? "star" : value >= star - 0.5 ? "star-half-full" : "star-o";
        const icon = <FontAwesome name={name} size={size} color={value >= star - 0.5 ? STAR_COLOR : colors.border} />;

        return onChange ? (
          <TouchableOpacity key={star} onPress={() => onChange(star)} hitSlop={6} style={styles.touch}>
            {icon}
          </TouchableOpacity>
        ) : (
          <View key={star}>{icon}</View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 2 },
  touch: { paddingHorizontal: 3 },
});
