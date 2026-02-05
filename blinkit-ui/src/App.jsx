import React from 'react'
import {Routes,Route} from "react-router-dom"
import Home from "./pages/Home"
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Navbar from "./components/layout/Navbar"
import AddProduct from "./pages/AddProduct";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/checkout" element={<Checkout />} /> 
        <Route path="/add-product" element={<AddProduct />} />

      </Routes>

    </div>
  )
}

export default App
