import {Link} from "react-router-dom"

export default function Navbar(){
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
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-green-500"
                />  
            </div>

            <div className="flex item-center gap-4">
                <Link to="/orders" className="text-gray-700 font-medium">
                   Orders
                </Link>
                <Link to="/cart"
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                    My cart
                </Link>

                <Link to="/add-product" className="text-gray-700 font-medium">
                    Add Product
                </Link>

                <Link to="/" className="text-gray-700 font-medium">
                  Home
                 </Link>


            </div>
         </div>

         {/* mobile search */}

         <div className="px-4 pb-3 md:hidden">
            <input 
            type="text"
            placeholder="Search for products..."
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ribg-2 focus:ring-green-500"
            />
         </div>
        </div>
    )
}