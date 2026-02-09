import { useEffect, useState } from "react";
import { getAllProducts } from "../api/productApi";
import { addToCart, getCartItems, updateCartItem } from "../api/cartApi";
import ProductGrid from "../components/product/ProductGrid";
// import CategoryBar from "../components/home/CategoryBar";
// import Banner from "../components/home/Banner";
import { useCart } from "../context/CartContext"; // ✅ FIXED: correct path
import {useSearch} from "../context/SearchContext"
import UserCard from "../components/user/UserCard"


export default function Home() {


  const { refreshCartCount } = useCart(); // ✅ FIXED: use refresh function for realtime badge
  const {search} = useSearch()

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]); // ✅ cart items store
  
  const filteredProducts=products.filter((p)=>(p.name||"").toLowerCase().includes((search||"").toLowerCase().trim()))


  const userId = 1;
  const cartId = localStorage.getItem("cartId"); // ✅ cartId localStorage se

  useEffect(() => {
    fetchProducts();
    if (cartId) fetchCart(); // ✅ if cart exists then fetch
  }, []);

  const fetchProducts = async () => {
    const data = await getAllProducts();
    setProducts(data);
  };

  const fetchCart = async () => {
    try {
      const data = await getCartItems(cartId);
      setCartItems(data);
    } catch (err) {
      setCartItems([]);
    }
  };

  const handleAdd = async (productId) => {
    const res = await addToCart(userId, productId, 1);

    if (res.cart_id) {
      localStorage.setItem("cartId", res.cart_id); // ✅ cartId save
    }

    fetchCart(); // ✅ refresh cart items
    refreshCartCount(); // ✅ NEW: realtime badge update
  };

  const handleIncrease = async (itemId, qty) => {
    await updateCartItem(itemId, qty + 1);
    fetchCart(); // ✅ refresh cart items
    refreshCartCount(); // ✅ NEW: realtime badge update
  };

  const handleDecrease = async (itemId, qty) => {
    await updateCartItem(itemId, qty - 1);
    fetchCart(); // ✅ refresh cart items
    refreshCartCount(); // ✅ NEW: realtime badge update
  };

  return (
    
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <UserCard />
      </div>
      
      {/* <div className="max-w-6xl mx-auto px-4 pt-6">
        <Banner />
      </div> */}

      {/* <div className="max-w-6xl mx-auto px-4 mt-6">
        <CategoryBar />
      </div> */}

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
