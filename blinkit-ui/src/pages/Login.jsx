import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {loginUser} from "../api/authApi"



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // ✅ NEW: role selector

  const navigate = useNavigate();

  const handleLogin =async (e) => {
    e.preventDefault();
     try{

     const data=await loginUser({email,password})

    localStorage.setItem("token",data.access_token)
    localStorage.setItem("userId",data.user_id)
    
    localStorage.removeItem("cartId")
    
    localStorage.setItem("name",data.name)
    localStorage.setItem("email",data.email)
    localStorage.setItem("role",role)
    
    if (role === "admin") {
      window.location.href="/add-product"

      navigate("/add-product"); // ✅ admin dashboard
    } else {
       // ✅ home page
      window.location.href="/"
    }
  }
  catch(err){
    alert(err.response?.data?.detail || "Login failed")
  }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        
        {/* ✅ Title */}
        <h2 className="text-3xl font-extrabold text-green-600 text-center">
          blinkit
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Login to continue shopping 🛒
        </p>

        {/* ✅ Login Form */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          
          {/* ✅ Role Select */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Login As
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)} // ✅ NEW
              className="w-full border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* ✅ Email */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* ✅ Password */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* ✅ Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>

        {/* ✅ Register Link */}
        <p className="text-center text-gray-600 mt-5">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-600 font-bold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
