import axios from "@/lib/axios";

export const GUEST_TOKEN_KEY = "guest_token";

export function getStoredGuestToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(GUEST_TOKEN_KEY);
}

export function setStoredGuestToken(token) {
  if (typeof window === "undefined" || !token) return;
  localStorage.setItem(GUEST_TOKEN_KEY, token);
}

export function clearStoredGuestToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_TOKEN_KEY);
}

/** POST /cart/guest-token — create and persist a guest cart token */
export const createGuestToken = async () => {
  const response = await axios.post("/cart/guest-token");
  const token =
    response?.guest_token ||
    response?.data?.guest_token ||
    response?.data?.data?.guest_token;
  if (token) setStoredGuestToken(token);
  return token;
};

/** Ensure a guest token exists (create once if missing). */
export async function ensureGuestToken() {
  const existing = getStoredGuestToken();
  if (existing) return existing;
  return createGuestToken();
}

export const getCart = async () => {
  const response = await axios.get("/cart");
  return response?.data ?? response;
};

export const addToCart = async ({ product_id, quantity = 1 }) => {
  const response = await axios.post("/cart", { product_id, quantity });
  return response?.data ?? response;
};

export const updateCartItem = async (cartItemId, { quantity }) => {
  const response = await axios.post(`/cart/${cartItemId}`, { quantity });
  return response?.data ?? response;
};

export const removeCartItem = async (cartItemId) => {
  const response = await axios.delete(`/cart/${cartItemId}`);
  return response?.data ?? response;
};

export const clearCart = async () => {
  const response = await axios.delete("/cart");
  return response?.data ?? response;
};

/**
 * Merge guest cart into the logged-in user's cart.
 * Call once after login/register, then clear guest token.
 */
export const mergeGuestCart = async (guestToken) => {
  const token = guestToken || getStoredGuestToken();
  if (!token) return null;

  const response = await axios.post(
    "/cart/merge",
    { guest_token: token },
    {
      headers: {
        "X-Guest-Token": token,
      },
    }
  );

  clearStoredGuestToken();
  return response?.data ?? response;
};
