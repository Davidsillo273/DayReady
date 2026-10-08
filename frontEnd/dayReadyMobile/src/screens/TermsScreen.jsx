// Términos y condiciones, se muestran al terminar el registro. Al aceptar
// se manda a Login: la cuenta ya existe en la base de datos pero, como se
// explicó en RegisterScreen, el registro no deja una sesión abierta.
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Logo from "../components/Logo";
import PrimaryButton from "../components/PrimaryButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts } from "../theme/colors";

export default function TermsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Logo size={0.85} />
        <Text style={styles.subtitle}>Información legal</Text>
      </View>

      <ScrollView style={styles.card} contentContainerStyle={{ padding: 24, paddingBottom: 24 + insets.bottom }}>
        <Text style={styles.title}>Términos y Condiciones</Text>

        <Text style={styles.sectionTitle}>1. Uso de la App</Text>
        <Text style={styles.paragraph}>
          Al registrarte, confirmas que eres estudiante del centro o cuentas con autorización de
          tus padres/tutores para realizar pedidos y gestionar pagos.
        </Text>

        <Text style={styles.sectionTitle}>2. Pedidos y Horarios</Text>
        <Text style={styles.paragraph}>
          • Reservas: deben realizarse antes de las 9:00 AM para garantizar disponibilidad.{"\n"}
          • Cancelaciones: sólo se aceptan cambios hasta 1 hora antes del receso/almuerzo.
        </Text>

        <Text style={styles.sectionTitle}>3. Alergias y Salud</Text>
        <Text style={styles.paragraph}>
          Es responsabilidad del usuario informar sus restricciones alimentarias. El colegio no se
          hace responsable por omisiones en la información de salud del perfil.
        </Text>

        <Text style={styles.sectionTitle}>4. Pagos y Reembolsos</Text>
        <Text style={styles.paragraph}>
          • Los saldos cargados a la DayWallet no son transferibles.{"\n"}
          • No se gestionan reembolsos por productos no recogidos sin previo aviso.
        </Text>

        <Text style={styles.sectionTitle}>5. Privacidad</Text>
        <Text style={styles.paragraph}>
          Tus datos se usan exclusivamente para la gestión del comedor escolar y no serán
          compartidos con terceros ajenos a la institución.
        </Text>

        <PrimaryButton
          title="He leído y aceptado estos términos"
          onPress={() => navigation.replace("Login")}
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.primaryLight },
  header: { alignItems: "center", paddingTop: 20, paddingBottom: 20 },
  subtitle: { color: colors.primary, fontFamily: fonts.heading, fontSize: 13, marginTop: 12 },
  card: { flex: 1, backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  title: { fontFamily: fonts.heading, fontSize: 15, color: colors.textDark, marginBottom: 10 },
  sectionTitle: { fontFamily: fonts.heading, fontSize: 13, color: colors.textDark, marginTop: 10, marginBottom: 4 },
  paragraph: { fontSize: 13, color: "#444", lineHeight: 20 },
});
