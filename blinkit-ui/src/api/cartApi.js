import api from "./axios";

export const addToCart = async (userId, productId, quantity = 1) => {
  const res = await api.post(
    `/cart/add?user_id=${userId}&product_id=${productId}&quantity=${quantity}`
  );
  return res.data;
};

export const getCartItems = async (cartId) => {
  const res = await api.get(`/cart/${cartId}`);
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

export const getCartByUser=async (userId)=>{
     const res=await api.get(`/cart/user/${userId}`)

     return res.data
}
