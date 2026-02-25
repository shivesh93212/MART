import { Trash2 } from "lucide-react";



export default function ProductCard({
  product,
  cartItem,
  onAdd,
  onIncrease,
  onDecrease,
  onDelete,
}) {

  const role=localStorage.getItem("role")

  return (
    <div className=" relative bg-white rounded-2xl shadow-sm hover:shadow-md transition p-3 flex flex-col">

      {role=="admin" && (
        <button 
        onClick={()=>onDelete(product.id)}
        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition z-10"
        >
          <Trash2 size={16}/>

        </button>
      )}
      <div className="h-32 flex items-center justify-center overflow-hidden">
        <img
          src={`https://mart-ba0h.onrender.com/${product.image}`}
          alt={product.name}
          className="h-full object-contain"
        />
      </div>

      <h3 className="font-semibold text-gray-800 text-sm mt-2 line-clamp-2">
        {product.name}
      </h3>

      <p className="text-gray-700 font-bold mt-1 text-sm">
        ₹{product.price}
      </p>

      <p className="text-xs text-gray-500 mt-1">
        Stock: {product.quantity}
      </p>

      <div className="mt-3">
        {/* ✅ NEW: agar cartItem nahi hai tab ADD button show */}
        {!cartItem ? (
          <button
            onClick={() => onAdd(product.id)} // ✅ NEW: add to cart call
            disabled={product.quantity <= 0}
            className="w-full border border-green-600 text-green-600 font-bold py-2 rounded-xl hover:bg-green-600 hover:text-white transition disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-white"
          >
            ADD
          </button>
        ) : (
          // ✅ NEW: agar cartItem exist karta hai to stepper show
          <div className="flex items-center justify-between bg-green-600 text-white rounded-xl px-3 py-2 font-bold">
            <button
              onClick={() => onDecrease(cartItem.id, cartItem.quantity)} // ✅ NEW: decrease qty
              className="text-lg"
            >
              -
            </button>

            <span>{cartItem.quantity}</span>

            <button
              onClick={() => onIncrease(cartItem.id, cartItem.quantity)} // ✅ NEW: increase qty
              className="text-lg"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
