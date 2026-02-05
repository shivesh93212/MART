import React  from 'react'
import { useEffect, useState } from "react";
import {getAllProducts} from "../api/productApi"
import {addToCart} from "../api/cartApi"
import ProductGrid from "../components/product/ProductGrid"



const Home = () => {

    const [products,setProducts]=useState([])
    const [cartId,setCartId]=useState(localStorage.getItem("cartId")||null)

    const userId=1


    useEffect(()=>{
     fetchProducts();
     
    },[])

    const fetchProducts=async ()=>{
      const data=await getAllProducts();
      setProducts(data)
    }
    const handleAdd=async (productId)=>{
        try{
          const res=await addToCart(userId,productId,1)

          if(res.cart_id){
            setCartId(res.cart_id)
            localStorage.setItem("cartId",res.cart_id)
          }
          alert("Added to cart ✅")
        }
        catch(err){
          alert(err.response?.data?.detail || "Error adding to cart")

        }
    }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-5">
        Groceries delivered in minutes 🚀
      </h1>
      <ProductGrid products={products} onAdd={handleAdd}/>
      
    </div>
  )
}

export default Home
