// Encabezado con forma de "ola" en la parte de abajo, usado en Login,
// Register, Checkout, Payment, etc. Es el mismo recorte SVG del diseño
// original, ahora con react-native-svg en vez de <svg> de HTML.
import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// "safeTop": la pantalla no tiene header de navegación (ej. Login), así que
// el encabezado se estira bajo la barra de estado y baja su contenido.
export default function WaveHeader({ color = "#F4A261", lightColor = "#FDEBD0", height = 220, safeTop = false, children }) {
  const insets = useSafeAreaInsets();
  const topInset = safeTop ? insets.top : 0;
  return (
    <View style={[styles.container, { height: height + topInset, backgroundColor: color }]}>
      {/* Mancha clara decorativa, apenas visible detrás del contenido */}
      <Svg
        style={StyleSheet.absoluteFill}
        viewBox="0 0 420 220"
        preserveAspectRatio="none"
      >
        <Path
          d="M0 0 Q200 40 420 0 L420 220 Q280 160 100 200 Q50 215 0 180 Z"
          fill={lightColor}
          opacity={0.6}
        />
      </Svg>
      {/* Recorte blanco que da el efecto de "ola" hacia la pantalla siguiente */}
      <Svg
        style={styles.bottomWave}
        viewBox="0 0 420 60"
        preserveAspectRatio="none"
      >
        <Path d="M0 60 Q105 0 210 40 Q315 80 420 20 L420 60 Z" fill="#FFFFFF" />
      </Svg>
      <View style={[styles.content, { paddingTop: 40 + topInset }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: "hidden", position: "relative" },
  bottomWave: { position: "absolute", bottom: -1, left: 0, width: "100%", height: 60 },
  content: { paddingHorizontal: 24, paddingTop: 40, zIndex: 2 },
});
