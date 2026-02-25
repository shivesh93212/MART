import { createContext, useContext, useEffect, useState } from "react";
import { getCartItems } from "../api/cartApi";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = async () => {
    try {
      const token =localStorage.getItem("token");

      if (!token) {
        setCartCount(0);
        return;
      }

      // ✅ cart items fetch
      const items = await getCartItems();

      const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

      setCartCount(totalQty);
    } catch (err) {
      setCartCount(0);

    }
  };

  useEffect(() => {
    refreshCartCount(); 
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
