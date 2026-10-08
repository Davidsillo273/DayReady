// Una reseña dentro del detalle de producto: autor, estrellas, fecha y comentario.
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import StarRating from "./StarRating";
import { colors, fonts, radius } from "../theme/colors";

export default function ReviewCard({ review, isMine = false }) {
  const date = new Date(review.updatedAt || review.createdAt).toLocaleDateString("es-ES");

  return (
    <View style={[styles.card, isMine && styles.mine]}>
      <View style={styles.header}>
        <Text style={styles.author}>
          {review.customerName || "Cliente"}
          {isMine ? " (tú)" : ""}
        </Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <StarRating value={review.rating} size={12} />
      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.bgLight, borderRadius: radius.sm, padding: 12, marginBottom: 10 },
  mine: { borderWidth: 1.5, borderColor: colors.primaryLight },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  author: { fontFamily: fonts.heading, fontSize: 13, color: colors.textDark },
  date: { fontSize: 11, color: colors.textLight },
  comment: { fontFamily: fonts.body, fontSize: 13, color: colors.textMedium, marginTop: 6, lineHeight: 19 },
});
