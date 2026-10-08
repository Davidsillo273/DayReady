// Stack raíz de la app. Decide qué grupo de pantallas mostrar según si hay
// sesión iniciada o no (patrón estándar de React Navigation para flujos de
// autenticación): sin sesión sólo existen Login/Register/Terms; con sesión
// se habilitan las pestañas principales y las pantallas de compra.
//
// Las pantallas que no viven dentro del Tab menú (Register, Terms,
// Checkout, Payment) sí muestran el header nativo con flecha de "volver",
// para cumplir con la navegabilidad fuera del menú. ProductDetail trae su
// propio botón de volver dibujado en la pantalla, así que aquí se le quita
// el header para no duplicarlo.
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import MainTabs from "./MainTabs";
import LoadingScreen from "../screens/LoadingScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import TermsScreen from "../screens/TermsScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import PaymentScreen from "../screens/PaymentScreen";
import OrderDetailScreen from "../screens/OrderDetailScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import { colors, fonts } from "../theme/colors";

const Stack = createNativeStackNavigator();

const headerOptions = {
  headerTintColor: colors.textDark,
  headerTitleStyle: { fontFamily: fonts.heading, fontSize: 16 },
  headerShadowVisible: false,
  headerStyle: { backgroundColor: colors.white },
};

export default function RootNavigator() {
  const { customer, isRestoringSession } = useAuth();

  // Mientras se intenta recuperar la sesión guardada, se muestra la
  // pantalla de carga adicional (cumple el criterio de splash + loading).
  if (isRestoringSession) return <LoadingScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {customer ? (
        <Stack.Group>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={{ headerShown: true, title: "Datos de compra", ...headerOptions }}
          />
          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{ headerShown: true, title: "Pago", ...headerOptions }}
          />
          <Stack.Screen
            name="OrderDetail"
            component={OrderDetailScreen}
            options={{ headerShown: true, title: "Detalle del pedido", ...headerOptions }}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ForgotPasswordScreen}
            options={{ headerShown: true, title: "Cambiar contraseña", ...headerOptions }}
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: true, title: "Crear cuenta", ...headerOptions }}
          />
          <Stack.Screen
            name="Terms"
            component={TermsScreen}
            options={{ headerShown: true, title: "Términos y condiciones", ...headerOptions }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ headerShown: true, title: "Recuperar contraseña", ...headerOptions }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
