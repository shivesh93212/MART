import api from "./axios";

export const addToCart = async (productId, quantity = 1) => {
  const res = await api.post(
    `/cart/add?product_id=${productId}&quantity=${quantity}`
  );
  return res.data;
};

export const getCartItems = async () => {
  const res = await api.get(`/cart`);
  return res.data;
};

export const updateCartItem = async (itemId, quantity) => {
  const res = await api.patch(`/cart/item/${itemId}?quantity=${quantity}`);
  return res.data;
};

export const deleteCartItem = async (itemId) => {
  const res = await api.delete(`/cart/item/${itemId}`);
  return res.data;
};
