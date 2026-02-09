import { createContext, useContext, useEffect, useState } from "react";
import { getCartByUser, getCartItems } from "../api/cartApi";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = async () => {
    try {
      const userId = Number(localStorage.getItem("userId"));

      if (!userId) {
        setCartCount(0);
        return;
      }

      // ✅ user se cartId nikalna
      const cartRes = await getCartByUser(userId);
      localStorage.setItem("cartId", cartRes.cart_id);

      // ✅ cart items fetch
      const items = await getCartItems(cartRes.cart_id);

      const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

      setCartCount(totalQty);
    } catch (err) {
      setCartCount(0);
      localStorage.removeItem("cartId");

    }
  };

  useEffect(() => {
    refreshCartCount(); // ✅ app load pe
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
