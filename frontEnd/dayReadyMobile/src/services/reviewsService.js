// Valoraciones y comentarios de productos (backend/src/routes/reviewRoutes.js).
// El backend sólo deja valorar productos que el cliente ya compró.
import { apiFetch } from "../config/api";

const reviewsService = {
  // { average, count, reviews: [...] }
  getByProduct(productId) {
    return apiFetch(`/reviews/product/${productId}`);
  },

  // [{ productId, average, count }] de todo el catálogo, para las tarjetas.
  getSummary() {
    return apiFetch("/reviews/summary");
  },

  // { canReview, review } — si ya opinó, "review" trae su reseña.
  getEligibility(productId, customerId) {
    return apiFetch(`/reviews/eligibility?productId=${productId}&customerId=${customerId}`);
  },

  // Crea la reseña o actualiza la que el cliente ya tenía.
  save({ productId, customerId, rating, comment }) {
    return apiFetch("/reviews", {
      method: "POST",
      body: JSON.stringify({ productId, customerId, rating, comment }),
    });
  },

  remove(reviewId, customerId) {
    return apiFetch(`/reviews/${reviewId}`, {
      method: "DELETE",
      body: JSON.stringify({ customerId }),
    });
  },
};

export default reviewsService;
