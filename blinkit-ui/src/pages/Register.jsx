import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {signupUser,loginUser} from "../api/authApi"


export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
      try{
        await signupUser({name,email,password})
        const loginData=await loginUser({email,password})
        localStorage.setItem("token",loginData.access_token)
        localStorage.setItem("userId",loginData.user_id)
        localStorage.setItem("role","user")

        navigate("/");
        window.location.reload()
      }
      catch(err){
        alert(err.response?.data?.detail || "signup failed")
      }

    // ✅ TEMP: backend register connect baad me
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        
        <h2 className="text-3xl font-extrabold text-green-600 text-center">
          blinkit
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Create your account ✨
        </p>

        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

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

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-600 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
