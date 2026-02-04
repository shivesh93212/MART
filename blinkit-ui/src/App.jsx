import React from 'react'
import {Routes,Route} from "react-router-dom"
import Home from "./pages/Home"
import Navbar from "./components/layout/Navbar"
const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
      </Routes>

    </div>
  )
}

export default App
