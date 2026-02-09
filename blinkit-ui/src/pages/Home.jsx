import { useEffect, useState } from "react";
import { getAllProducts } from "../api/productApi";
import { addToCart, getCartItems, updateCartItem } from "../api/cartApi";
import ProductGrid from "../components/product/ProductGrid";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";
import UserCard from "../components/user/UserCard";

export default function Home() {
  const { refreshCartCount } = useCart();
  const { search } = useSearch();

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const filteredProducts = products.filter((p) =>
    (p.name || "").toLowerCase().includes((search || "").toLowerCase().trim())
  );

  const userId = localStorage.getItem("userId"); // ✅ FIXED

  useEffect(() => {
    fetchProducts();
    fetchCart(); // ✅ FIXED: always call
  }, []);

  const fetchProducts = async () => {
    const data = await getAllProducts();
    setProducts(data);
  };

  const fetchCart = async () => {
    const cartId = localStorage.getItem("cartId"); // ✅ FIXED: always fresh

    if (!cartId) {
      setCartItems([]);
      return;
    }

    try {
      const data = await getCartItems(cartId);
      setCartItems(data);
    } catch (err) {
      setCartItems([]);
    }
  };

  const handleAdd = async (productId) => {
    if (!userId) return;

    const res = await addToCart(userId, productId, 1);

    if (res.cart_id) {
      localStorage.setItem("cartId", res.cart_id);
    }

    await fetchCart(); // ✅ FIXED: await
    await refreshCartCount(); // ✅ FIXED: await
  };

  const handleIncrease = async (itemId, qty) => {
    await updateCartItem(itemId, qty + 1);

    await fetchCart(); // ✅ FIXED: await
    await refreshCartCount(); // ✅ FIXED: await
  };

  const handleDecrease = async (itemId, qty) => {
    await updateCartItem(itemId, qty - 1);

    await fetchCart(); // ✅ FIXED: await
    await refreshCartCount(); // ✅ FIXED: await
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <UserCard />
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 pb-10">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
          Best Deals For You 🔥
        </h2>

        <ProductGrid
          products={filteredProducts}
          cartItems={cartItems}
          onAdd={handleAdd}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />
      </div>
    </div>
  );
}
