import { useEffect, useState } from "react";
import { getAllProducts } from "../api/productApi";
import { addToCart, getCartItems, updateCartItem } from "../api/cartApi";
import ProductGrid from "../components/product/ProductGrid";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";
import UserCard from "../components/user/UserCard";
import { Link } from "react-router-dom";

export default function Home() {
  const { refreshCartCount } = useCart();
  const { search } = useSearch();
  
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategory,setSelectedCategory]= useState("All")
  const search_categories = ["All",...new Set(products.map((p)=>p.category))] 

  const filteredProducts = products.filter((p) =>{
    const matchSearch=(p.name || "").toLowerCase().includes((search || "").toLowerCase().trim())
    
    const matchCategory = selectedCategory==="All" || p.category===selectedCategory

    return matchSearch && matchCategory
   });
  

  useEffect(() => {
    fetchProducts();
    const token = localStorage.getItem("token");
    if (token) fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const data = await getCartItems();
      setCartItems(data);
    } catch (err) {
      setCartItems([]);
    }
  };

  const handleAdd = async (productId) => {
    await addToCart(productId, 1);
    fetchCart();
    refreshCartCount();
  };

  const handleIncrease = async (itemId, qty) => {
    await updateCartItem(itemId, qty + 1);
    fetchCart();
    refreshCartCount();
  };

  const handleDecrease = async (itemId, qty) => {
    await updateCartItem(itemId, qty - 1);
    fetchCart();
    refreshCartCount();
  };

  const categories = ["All", ...new Set(products.map((p)=>p.category))]

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO SECTION */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="bg-gradient-to-r from-green-600 to-emerald-400 text-white rounded-3xl p-6 md:p-10 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">
              Fresh Grocery Delivered <br /> in 30 Minutes 🚀
            </h1>
            <p className="mt-3 text-sm md:text-base text-white/90 max-w-lg">
              Order fresh fruits, vegetables, snacks & more at best price.
              Guaranteed quality with fast delivery.
            </p>

            <Link
              to="/cart"
              className="inline-block mt-5 bg-white text-green-700 font-bold px-6 py-3 rounded-2xl shadow hover:bg-gray-100 transition"
            >
              View Cart 🛒
            </Link>
          </div>

          <div className="text-center md:text-right">
            <p className="text-lg font-semibold">🔥 Special Offer</p>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-1">
              50% OFF
            </h2>
            <p className="text-sm text-white/90 mt-2">
              On first 3 orders today
            </p>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
          Shop By Category 🏷️
        </h2>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={()=>setSelectedCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full font-semibold shadow-sm transition
          ${
            selectedCategory === cat
              ? "bg-green-600 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-green-600 hover:text-white"
          }`}
      >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="max-w-6xl mx-auto px-4 mt-10 pb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
  <h2 className="text-lg md:text-xl font-bold text-gray-800">
    Best Deals For You 🔥
  </h2>

  <div className="flex items-center gap-4">
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="border px-4 py-2 rounded-xl bg-white text-gray-700 font-semibold shadow-sm outline-none"
    >
      {search_categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>

    <p className="text-sm text-gray-500">
      Showing products
    </p>
  </div>
</div>


        {/* LOADING SKELETON */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-sm p-4 animate-pulse"
                >
                  <div className="h-28 bg-gray-200 rounded-xl"></div>
                  <div className="h-4 bg-gray-200 rounded mt-3"></div>
                  <div className="h-4 bg-gray-200 rounded mt-2 w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded-xl mt-4"></div>
                </div>
              ))}
          </div>
        ) : (
          <ProductGrid
            products={filteredProducts}
            cartItems={cartItems}
            onAdd={handleAdd}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />
        )}
      </div>
    </div>
  );
}
