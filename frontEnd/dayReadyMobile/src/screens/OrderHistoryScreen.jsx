// Historial de pedidos del cliente. Trae sólo las órdenes de quien inició
// sesión (GET /orders/customer/:id) y al tocar una se abre su detalle, donde
// se puede cancelar si sigue pendiente o valorar los productos comprados.
import React, { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import OrderCard from "../components/OrderCard";
import EmptyState from "../components/EmptyState";
import PrimaryButton from "../components/PrimaryButton";
import ordersService from "../services/ordersService";
import { useAuth } from "../context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts } from "../theme/colors";

export default function OrderHistoryScreen({ navigation }) {
  const { customer } = useAuth();
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setOrders(await ordersService.getByCustomer(customer._id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [customer._id]);

  // Se recarga cada vez que la pestaña vuelve a tomar foco (por ejemplo,
  // justo después de pagar o cancelar un pedido).
  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.title}>Historial de pedidos</Text>
        <Text style={styles.subtitle}>Toca un pedido para ver su detalle.</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadOrders} colors={[colors.primary]} />}
        ListHeaderComponent={error ? <Text style={styles.error}>{error}</Text> : null}
        ListEmptyComponent={
          !loading && !error ? (
            <EmptyState icon="file-text" title="Todavía no tienes pedidos" message="Cuando hagas tu primer pedido aparecerá aquí.">
              <PrimaryButton title="Ver catálogo" onPress={() => navigation.navigate("Inicio")} style={{ width: 180 }} />
            </EmptyState>
          ) : null
        }
        renderItem={({ item }) => (
          <OrderCard order={item} onPress={() => navigation.navigate("OrderDetail", { orderId: item._id })} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  header: { backgroundColor: colors.primaryLight, padding: 24, paddingTop: 48, alignItems: "center" },
  title: { fontFamily: fonts.heading, fontSize: 18, color: colors.textDark },
  subtitle: { color: colors.primary, fontSize: 12, fontFamily: fonts.heading, marginTop: 4 },
  list: { padding: 20, flexGrow: 1 },
  error: { color: colors.red, textAlign: "center", marginBottom: 12 },
});
