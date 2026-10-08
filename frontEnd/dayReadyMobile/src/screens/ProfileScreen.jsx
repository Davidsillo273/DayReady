// Perfil del cliente. Trae y guarda datos reales contra
// PUT /customers/:id, y muestra el saldo de la DayWallet (billetera digital
// del proyecto, campo "balance" del modelo Customer) en vez de un dato
// inventado.
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import customersService from "../services/customersService";
import { useAuth } from "../context/AuthContext";
import { validateName, validatePhone, validateAge } from "../utils/validators";
import { colors, fonts } from "../theme/colors";

export default function ProfileScreen({ navigation }) {
  const { customer, logout, refreshProfile } = useAuth();
  const [name, setName] = useState(customer?.name || "");
  const [lastName, setLastName] = useState(customer?.lastName || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [age, setAge] = useState(customer?.age ? String(customer.age) : "");

  // Cuando el perfil cambia (al guardar o al refrescar) los campos se
  // sincronizan con lo que quedó en la base de datos.
  useEffect(() => {
    setName(customer?.name || "");
    setLastName(customer?.lastName || "");
    setPhone(customer?.phone || "");
    setAge(customer?.age ? String(customer.age) : "");
  }, [customer]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const fieldErrors = {
      name: validateName(name, "El nombre"),
      lastName: validateName(lastName, "El apellido"),
      phone: validatePhone(phone),
      age: validateAge(age),
    };
    if (Object.values(fieldErrors).some(Boolean)) return setErrors(fieldErrors);

    setErrors({});
    setSaving(true);
    try {
      await customersService.updateProfile(customer._id, {
        name: name.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        age: Number(age),
      });
      await refreshProfile();
      Alert.alert("Listo", "Perfil actualizado correctamente.");
    } catch (error) {
      Alert.alert("No se pudo actualizar", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Seguro que quieres salir?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Salir", style: "destructive", onPress: logout },
    ]);
  };

  const initials = `${customer?.name?.[0] || ""}${customer?.lastName?.[0] || ""}`.toUpperCase();

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials || "DR"}</Text>
        </View>
        <View style={styles.walletCard}>
          <Feather name="credit-card" size={16} color={colors.primary} />
          <Text style={styles.walletLabel}>DayWallet</Text>
          <Text style={styles.walletValue}>${Number(customer?.balance || 0).toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <InputField label="Nombre" value={name} onChangeText={setName} error={errors.name} />
        <InputField label="Apellido" value={lastName} onChangeText={setLastName} error={errors.lastName} />
        <InputField label="Correo electrónico" value={customer?.email || ""} editable={false} />
        <InputField label="Carnet" value={customer?.carnet || ""} editable={false} />
        <InputField label="Teléfono" value={phone} onChangeText={setPhone} keyboardType="phone-pad" error={errors.phone} />
        <InputField
          label="Edad"
          value={age}
          onChangeText={(v) => setAge(v.replace(/\D/g, "").slice(0, 2))}
          keyboardType="number-pad"
          error={errors.age}
        />

        <PrimaryButton title="Guardar cambios" onPress={handleSave} loading={saving} style={{ marginTop: 8 }} />

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("ChangePassword", { email: customer.email })}
        >
          <Feather name="lock" size={16} color={colors.primaryDark} />
          <Text style={styles.secondaryText}>Cambiar contraseña</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={16} color={colors.red} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  header: { backgroundColor: colors.primaryLight, alignItems: "center", paddingTop: 50, paddingBottom: 30, gap: 12 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: colors.white },
  avatarText: { color: colors.white, fontFamily: fonts.headingExtra, fontSize: 28 },
  walletCard: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.white, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, elevation: 2 },
  walletLabel: { fontFamily: fonts.heading, fontSize: 12, color: colors.textDark },
  walletValue: { fontFamily: fonts.headingExtra, fontSize: 14, color: colors.primaryDark },
  card: { backgroundColor: colors.white, borderRadius: 20, padding: 20, margin: 20, marginTop: -10, elevation: 2 },
  secondaryButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16, paddingVertical: 10 },
  secondaryText: { color: colors.primaryDark, fontFamily: fonts.heading, fontSize: 14 },
  logoutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4, paddingVertical: 10 },
  logoutText: { color: colors.red, fontFamily: fonts.heading, fontSize: 14 },
});
