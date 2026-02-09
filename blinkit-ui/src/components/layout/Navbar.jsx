import { Link,useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext"; // ✅ NEW: context import
import {useSearch} from "../../context/SearchContext"
import {useEffect,useState}  from "react"

export default function Navbar() {
  const { cartCount } = useCart(); 
  const {search,setSearch}=useSearch()
  

  const [isLoggedIn,setIsLoggedIn]=useState(false)
  const navigate=useNavigate()
   
const role=localStorage.getItem("role")


  useEffect(()=>{
    const token=localStorage.getItem("token")
    setIsLoggedIn(!!token)
  },[])

const handleLogout = () => {
  localStorage.clear();
  window.location.href = "/login";
};


  return (
    <div className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <Link to="/" className="text-2xl font-extrabold text-green-600">
          blinkit
        </Link>

        <div className="hidden md:flex flex-1 mx-6">
          <input
            type="text"
            placeholder="Search for products..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-700 font-medium">
            Home
          </Link>
          {role==="admin" &&(
          <Link to="/add-product" className="text-gray-700 font-medium">
            Add Product
          </Link>
          )}

          <Link to="/orders" className="text-gray-700 font-medium">
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

          {!isLoggedIn ?(<Link to="/login" className="text-gray-700 font-medium">
          Login
          </Link>
          ):(
            <button
            onClick={handleLogout}
            className="text-red-500 font-semibold hover:text-red-600 transition"
            >
              Logout
            </button>
          )}

        </div>
      </div>

      <div className="px-4 pb-3 md:hidden">
        <input
          type="text"
          placeholder="Search for products..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    </div>
  );
}
