// Pantalla de carga adicional. Aparece justo después del splash nativo de
// Expo (que sólo muestra el ícono fijo un instante) mientras la app decide
// si hay una sesión guardada o no. Es la pantalla que pide el criterio 14
// de la rúbrica ("pantalla de carga adicional al Splash Screen").
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import Logo from "../components/Logo";
import { colors, fonts } from "../theme/colors";

export default function LoadingScreen() {
  const pulse = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    // Animación simple de "respiración" en bucle: no busca ser vistosa,
    // sólo darle vida a la pantalla mientras se resuelve la sesión.
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 650, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.85, duration: 650, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <Logo size={1.1} />
      </Animated.View>
      <Text style={styles.subtitle}>Preparando tu comedor digital...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", gap: 24 },
  subtitle: { color: colors.white, fontFamily: fonts.body, fontSize: 13, opacity: 0.9 },
});
