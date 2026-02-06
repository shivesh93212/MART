import React from 'react'
import {Routes,Route,useLocation} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Navbar from "./components/layout/Navbar"
import AddProduct from "./pages/AddProduct";
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'


const App = () => {
  const location = useLocation()

  const hideNavbar=
  location.pathname==="/login" || location.pathname==="/register"
  
   return (
    <div className="min-h-screen bg-gray-50">
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* ✅ Protected user routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        {/* ✅ Admin route */}
        <Route
          path="/add-product"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />

        {/* ✅ Public auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
};

export default App
