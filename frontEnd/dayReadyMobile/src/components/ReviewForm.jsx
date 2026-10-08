// Formulario para valorar un producto (estrellas + comentario). Si el
// cliente ya había opinado, llega con su reseña anterior para editarla.
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import StarRating from "./StarRating";
import InputField from "./InputField";
import PrimaryButton from "./PrimaryButton";
import { validateComment, validateRating } from "../utils/validators";
import { colors, fonts, radius } from "../theme/colors";

export default function ReviewForm({ initialReview, onSubmit }) {
  const [rating, setRating] = useState(initialReview?.rating || 0);
  const [comment, setComment] = useState(initialReview?.comment || "");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Si cambia la reseña de origen (por ejemplo al recargar), el formulario
  // se sincroniza para no quedarse con valores viejos.
  useEffect(() => {
    setRating(initialReview?.rating || 0);
    setComment(initialReview?.comment || "");
  }, [initialReview]);

  const handleSubmit = async () => {
    const fieldErrors = { rating: validateRating(rating), comment: validateComment(comment) };
    if (Object.values(fieldErrors).some(Boolean)) return setErrors(fieldErrors);

    setErrors({});
    setSaving(true);
    try {
      await onSubmit({ rating, comment: comment.trim() });
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{initialReview ? "Edita tu valoración" : "Valora este producto"}</Text>
      <StarRating value={rating} onChange={setRating} size={26} />
      {errors.rating ? <Text style={styles.error}>{errors.rating}</Text> : null}

      <View style={{ marginTop: 12 }}>
        <InputField
          placeholder="¿Qué te pareció?"
          value={comment}
          onChangeText={setComment}
          multiline
          error={errors.comment}
        />
      </View>
      {errors.general ? <Text style={styles.error}>{errors.general}</Text> : null}

      <PrimaryButton title={initialReview ? "Actualizar reseña" : "Publicar reseña"} onPress={handleSubmit} loading={saving} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.bgPeach, borderRadius: radius.md, padding: 16, marginBottom: 16 },
  title: { fontFamily: fonts.heading, fontSize: 14, color: colors.textDark, marginBottom: 8 },
  error: { color: colors.red, fontSize: 12, marginTop: 4, marginBottom: 8, fontFamily: fonts.body },
});
