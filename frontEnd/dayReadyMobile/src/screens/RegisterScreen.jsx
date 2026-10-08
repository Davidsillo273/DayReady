// Registro de un nuevo estudiante. El backend exige un flujo de 4 pasos
// (backend/src/controllers/auth/customers/registerCustomerController.js):
// 1) enviar código al correo, 2) verificar ese código, 3) datos personales,
// 4) contraseña. Cada paso depende de una cookie temporal que deja el paso
// anterior, así que hay que completarlos en orden; no se puede saltar
// directo a "crear cuenta" con un solo formulario como en el mockup viejo.
import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import WaveHeader from "../components/WaveHeader";
import InputField from "../components/InputField";
import Logo from "../components/Logo";
import PrimaryButton from "../components/PrimaryButton";
import SocialButton from "../components/SocialButton";
import authService from "../services/authService";
import {
  validateEmail,
  validateVerificationCode,
  validateName,
  validateCarnet,
  validatePhone,
  validateAge,
  validatePassword,
  validateConfirmPassword,
} from "../utils/validators";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts } from "../theme/colors";

const STEP_TITLES = {
  1: "¿Cuál es tu correo institucional?",
  2: "Revisa tu correo",
  3: "Cuéntanos sobre ti",
  4: "Crea tu contraseña",
};

export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [errors, setErrors] = useState({});
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [carnet, setCarnet] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const goNext = async () => {
    setGeneralError("");

    if (step === 1) {
      const error = validateEmail(email);
      if (error) return setErrors({ email: error });
      return runStep({}, async () => {
        await authService.sendVerificationCode(email.trim().toLowerCase());
        setStep(2);
      });
    }

    if (step === 2) {
      const error = validateVerificationCode(code);
      if (error) return setErrors({ code: error });
      return runStep({}, async () => {
        await authService.verifyCode(code.trim().toUpperCase());
        setStep(3);
      });
    }

    if (step === 3) {
      const fieldErrors = {
        name: validateName(name, "El nombre"),
        lastName: validateName(lastName, "El apellido"),
        carnet: validateCarnet(carnet),
        phone: validatePhone(phone),
        age: validateAge(age),
      };
      if (Object.values(fieldErrors).some(Boolean)) return setErrors(fieldErrors);
      return runStep({}, async () => {
        await authService.savePersonalInfo({ name: name.trim(), lastName: lastName.trim(), carnet: carnet.trim(), phone: phone.trim(), age });
        setStep(4);
      });
    }

    // step 4
    const passwordError = validatePassword(password);
    const matchError = validateConfirmPassword(password, confirmPassword);
    if (passwordError || matchError) {
      return setErrors({ password: passwordError, confirmPassword: matchError });
    }
    return runStep({}, async () => {
      await authService.setPassword(password);
      // La cuenta ya quedó creada en la base de datos, pero el registro no
      // deja sesión iniciada (eso sólo lo hace /auth/customers/login), así
      // que se manda a Términos y de ahí a Login para que inicie sesión.
      navigation.replace("Terms");
    });
  };

  const runStep = async (_unused, action) => {
    setErrors({});
    setLoading(true);
    try {
      await action();
    } catch (error) {
      setGeneralError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <WaveHeader color={colors.green} lightColor={colors.greenLight} height={200}>
        <Logo size={0.85} />
      </WaveHeader>

      <ScrollView contentContainerStyle={[styles.form, { paddingBottom: 28 + insets.bottom }]} keyboardShouldPersistTaps="handled">
        <Text style={styles.stepLabel}>Paso {step} de 4</Text>
        <Text style={styles.title}>{STEP_TITLES[step]}</Text>

        {generalError ? <Text style={styles.generalError}>{generalError}</Text> : null}

        {step === 1 && (
          <InputField
            label="Correo institucional"
            placeholder="usuario@institucion.edu"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
          />
        )}

        {step === 2 && (
          <InputField
            label="Código de verificación"
            placeholder="A1B2C3"
            value={code}
            onChangeText={setCode}
            error={errors.code}
          />
        )}

        {step === 3 && (
          <>
            <InputField label="Nombres" value={name} onChangeText={setName} error={errors.name} />
            <InputField label="Apellidos" value={lastName} onChangeText={setLastName} error={errors.lastName} />
            <InputField label="Carnet" value={carnet} onChangeText={setCarnet} error={errors.carnet} />
            <InputField
              label="Teléfono"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              error={errors.phone}
            />
            <InputField
              label="Edad"
              placeholder="Ej. 17"
              keyboardType="number-pad"
              value={age}
              onChangeText={(v) => setAge(v.replace(/\D/g, "").slice(0, 2))}
              error={errors.age}
            />
          </>
        )}

        {step === 4 && (
          <>
            <InputField
              label="Contraseña"
              placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 símbolo"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              error={errors.password}
            />
            <InputField
              label="Confirmar contraseña"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errors.confirmPassword}
            />
          </>
        )}

        <PrimaryButton
          title={step === 4 ? "Registrarte" : "Continuar"}
          variant="green"
          onPress={goNext}
          loading={loading}
          style={{ marginTop: 8, marginBottom: 16 }}
        />

        {step === 1 && <SocialButton onPress={() => setGeneralError("El registro con Google llegará próximamente.")} />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  form: { padding: 28, paddingTop: 20 },
  stepLabel: { color: colors.green, fontFamily: fonts.heading, fontSize: 12, marginBottom: 4 },
  title: { fontFamily: fonts.heading, fontSize: 17, color: colors.textDark, marginBottom: 18 },
  generalError: { color: colors.red, fontSize: 13, marginBottom: 12, fontFamily: fonts.body },
});
