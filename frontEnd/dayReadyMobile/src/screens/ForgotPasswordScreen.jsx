// Recuperación / cambio de contraseña. Sigue los 3 pasos del backend
// (backend/src/controllers/auth/recoveryPasswordController.js):
// 1) se manda un código al correo, 2) se verifica, 3) se guarda la nueva
// contraseña. Se usa desde Login ("¿Olvidaste tu contraseña?") y desde
// Perfil ("Cambiar contraseña"), en ese caso con el correo ya lleno.
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import authService from "../services/authService";
import {
  validateEmail,
  validateVerificationCode,
  validatePassword,
  validateConfirmPassword,
} from "../utils/validators";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts } from "../theme/colors";

const STEP_TITLES = {
  1: "¿Cuál es tu correo?",
  2: "Revisa tu correo",
  3: "Crea tu nueva contraseña",
};

const STEP_HINTS = {
  1: "Te enviaremos un código de 6 caracteres para confirmar que eres tú.",
  2: "Escribe el código que te enviamos. Vence en 15 minutos.",
  3: "Mínimo 8 caracteres, con una mayúscula, un número y un símbolo.",
};

export default function ForgotPasswordScreen({ route, navigation }) {
  const presetEmail = route.params?.email || "";
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(presetEmail);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const runStep = async (action) => {
    setErrors({});
    setGeneralError("");
    setLoading(true);
    try {
      await action();
    } catch (error) {
      setGeneralError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const goNext = () => {
    if (step === 1) {
      const error = validateEmail(email);
      if (error) return setErrors({ email: error });
      return runStep(async () => {
        await authService.requestRecoveryCode(email.trim().toLowerCase());
        setStep(2);
      });
    }

    if (step === 2) {
      const error = validateVerificationCode(code);
      if (error) return setErrors({ code: error });
      return runStep(async () => {
        await authService.verifyRecoveryCode(code.trim().toUpperCase());
        setStep(3);
      });
    }

    const fieldErrors = {
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };
    if (Object.values(fieldErrors).some(Boolean)) return setErrors(fieldErrors);
    return runStep(async () => {
      await authService.setNewPassword(password, confirmPassword);
      // Se limpian los campos para que no queden contraseñas en memoria.
      setPassword("");
      setConfirmPassword("");
      setCode("");
      Alert.alert("Contraseña actualizada", "Ya puedes usar tu nueva contraseña.", [
        { text: "Aceptar", onPress: () => navigation.goBack() },
      ]);
    });
  };

  const resendCode = () =>
    runStep(async () => {
      await authService.requestRecoveryCode(email.trim().toLowerCase());
      setCode("");
      Alert.alert("Código reenviado", "Revisa tu bandeja de entrada.");
    });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.form, { paddingBottom: 28 + insets.bottom }]} keyboardShouldPersistTaps="handled">
      <Text style={styles.stepLabel}>Paso {step} de 3</Text>
      <Text style={styles.title}>{STEP_TITLES[step]}</Text>
      <Text style={styles.hint}>{STEP_HINTS[step]}</Text>

      {generalError ? <Text style={styles.generalError}>{generalError}</Text> : null}

      {step === 1 && (
        <InputField
          label="Correo electrónico"
          placeholder="usuario@institucion.edu"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!presetEmail}
          error={errors.email}
        />
      )}

      {step === 2 && (
        <>
          <InputField label="Código de verificación" placeholder="A1B2C3" value={code} onChangeText={setCode} error={errors.code} />
          <TouchableOpacity onPress={resendCode} disabled={loading}>
            <Text style={styles.link}>Reenviar código</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 3 && (
        <>
          <InputField label="Nueva contraseña" secureTextEntry value={password} onChangeText={setPassword} error={errors.password} />
          <InputField
            label="Confirmar contraseña"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
          />
        </>
      )}

      <PrimaryButton title={step === 3 ? "Guardar contraseña" : "Continuar"} onPress={goNext} loading={loading} style={{ marginTop: 8 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  form: { padding: 28 },
  stepLabel: { color: colors.primaryDark, fontFamily: fonts.heading, fontSize: 12, marginBottom: 4 },
  title: { fontFamily: fonts.heading, fontSize: 18, color: colors.textDark, marginBottom: 6 },
  hint: { fontFamily: fonts.body, fontSize: 13, color: colors.textMedium, marginBottom: 20 },
  generalError: { color: colors.red, fontSize: 13, marginBottom: 12, fontFamily: fonts.body },
  link: { color: colors.green, fontFamily: fonts.heading, fontSize: 13, marginTop: -6, marginBottom: 16 },
});
