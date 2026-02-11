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

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setProducts([]);
    }
  };

  const fetchCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      const data = await getCartItems();
      console.log("CART DATA:", data);
      setCartItems(data);
    } catch (err) {
      setCartItems([]);
    }
  };

  const handleAdd = async (productId) => {
    await addToCart(productId, 1);
    await fetchCart();
    await refreshCartCount();
  };

  const handleIncrease = async (itemId, qty) => {
    await updateCartItem(itemId, qty + 1);
    await fetchCart();
    await refreshCartCount();
  };

  const handleDecrease = async (itemId, qty) => {
    await updateCartItem(itemId, qty - 1);
    await fetchCart();
    await refreshCartCount();
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
