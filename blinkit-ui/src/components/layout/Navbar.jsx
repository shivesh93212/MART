import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useSearch } from "../../context/SearchContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { cartCount } = useCart();
  const { search, setSearch } = useSearch();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const role = localStorage.getItem("role");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

        {/* TOP ROW (Logo + Cart + Login/Logout) */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link to="/" className="text-2xl font-extrabold text-green-600">
            blinkit
          </Link>

          <div className="flex items-center gap-3 md:hidden">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Login/Logout */}
            {!isLoggedIn ? (
              <Link to="/login" className="text-gray-700 font-semibold">
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="text-red-500 font-semibold hover:text-red-600 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* SEARCH (Desktop) */}
        <div className="hidden md:flex flex-1 mx-6">
          <input
            type="text"
            placeholder="Search for products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* NAV LINKS (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/" className="text-gray-700 font-medium hover:text-green-600">
            Home
          </Link>

          {role === "admin" && (
            <Link
              to="/add-product"
              className="text-gray-700 font-medium hover:text-green-600"
            >
              Add Product
            </Link>
          )}

          <Link to="/orders" className="text-gray-700 font-medium hover:text-green-600">
            Orders
          </Link>

          <Link
            to="/cart"
            className="relative bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            My Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {!isLoggedIn ? (
            <Link to="/login" className="text-gray-700 font-medium">
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-500 font-semibold hover:text-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>

        {/* NAV LINKS (Mobile) */}
        <div className="flex items-center gap-4 justify-center md:hidden border-t pt-2">
          <Link to="/" className="text-gray-700 font-semibold hover:text-green-600">
            Home
          </Link>

          <Link to="/orders" className="text-gray-700 font-semibold hover:text-green-600">
            Orders
          </Link>

          {role === "admin" && (
            <Link
              to="/add-product"
              className="text-gray-700 font-semibold hover:text-green-600"
            >
              Add Product
            </Link>
          )}
        </div>
      </div>

      {/* SEARCH (Mobile) */}
      <div className="px-4 pb-3 md:hidden">
        <input
          type="text"
          placeholder="Search for products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    </div>
  );
}
