// Pantalla de inicio de sesión. Llama a AuthContext.login, que a su vez
// pega contra el backend real (POST /auth/customers/login) y luego busca
// el perfil del cliente. Si el login funciona, RootNavigator cambia solo
// hacia las pestañas principales (no se navega manualmente a "Home": el
// cambio de pantalla ocurre porque "customer" deja de ser null).
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import WaveHeader from "../components/WaveHeader";
import InputField from "../components/InputField";
import Logo from "../components/Logo";
import PrimaryButton from "../components/PrimaryButton";
import SocialButton from "../components/SocialButton";
import { useAuth } from "../context/AuthContext";
import { validateEmail, validatePassword } from "../utils/validators";
import { colors, fonts } from "../theme/colors";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const emailError = validateEmail(email);
    // En login no se valida la fortaleza de la contraseña (eso es cosa del
    // registro); aquí sólo se exige que no venga vacía.
    const passwordError = password ? null : "La contraseña es obligatoria.";
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setErrors({});
    setGeneralError("");
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (error) {
      setGeneralError(error.message);
      setPassword(""); // no se deja la contraseña equivocada escrita
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.screen}>
        <WaveHeader color={colors.primary} lightColor={colors.primaryLight} height={220}>
          <Logo color={colors.primaryDark} size={0.9} />
        </WaveHeader>

        <ScrollView contentContainerStyle={styles.form}>
          {generalError ? <Text style={styles.generalError}>{generalError}</Text> : null}

          <InputField
            label="Correo institucional"
            placeholder="usuario@institucion.edu"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
          />
          <InputField
            label="Contraseña"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            error={errors.password}
          />

          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <PrimaryButton title="Iniciar" onPress={handleLogin} loading={loading} style={{ marginBottom: 16 }} />
          <SocialButton onPress={() => setGeneralError("El inicio de sesión con Google llegará próximamente.")} />
        </ScrollView>

        <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.footerText}>
            ¿Nuevo acá? <Text style={styles.footerLink}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  form: { padding: 28, paddingTop: 24 },
  generalError: { color: colors.red, fontSize: 13, marginBottom: 12, fontFamily: fonts.body },
  forgot: { color: colors.green, fontFamily: fonts.heading, fontSize: 13, marginTop: -8, marginBottom: 20 },
  footer: { backgroundColor: colors.primary, padding: 18, alignItems: "center" },
  footerText: { color: colors.white, fontFamily: fonts.body, fontSize: 14 },
  footerLink: { fontFamily: fonts.headingExtra, textDecorationLine: "underline" },
});
