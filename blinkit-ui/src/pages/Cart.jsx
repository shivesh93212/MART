import { useEffect, useState } from "react";
import { deleteCartItem, getCartItems, updateCartItem } from "../api/cartApi";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const [items, setItems] = useState([]);

  const { refreshCartCount } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
   
    try {
      const data = await getCartItems();
      setItems(data);
    } catch (err) {
      setItems([]);
    }
  };

  const handleUpdate = async (itemId, qty) => {
    if (qty < 0) return;

    await updateCartItem(itemId, qty);

   fetchCart(); 
   refreshCartCount(); 
  };

  const handleDelete = async (itemId) => {
    await deleteCartItem(itemId);

     fetchCart(); 
     refreshCartCount();
  };

  const totalAmount = items.reduce((sum, item) => sum + item.total_price, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">My Cart 🛒</h2>

      {items.length === 0 ? (
        <p className="text-gray-600 text-lg">Cart is empty</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl shadow-sm flex gap-4 items-center"
              >
                <div className="w-20 h-20 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
                  <img
                    src={`https://mart-ba0h.onrender.com/${item.image}`}
                    alt={item.product_name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {item.product_name}
                  </h3>

                  <p className="text-gray-600 text-sm mt-1">₹{item.price}</p>

                  <p className="text-gray-800 font-bold mt-1">
                    Total: ₹{item.total_price}
                  </p>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 text-sm font-semibold mt-2"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex items-center gap-2 bg-green-50 border border-green-300 rounded-xl px-3 py-2">
                  <button
                    onClick={() => handleUpdate(item.id, item.quantity - 1)}
                    className="font-bold text-green-700"
                  >
                    -
                  </button>

                  <span className="font-bold text-gray-800">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => handleUpdate(item.id, item.quantity + 1)}
                    className="font-bold text-green-700"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 h-fit sticky top-24">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Price Details
            </h3>

            <div className="flex justify-between text-gray-700 mb-2">
              <span>Total Items</span>
              <span>{items.length}</span>
            </div>

            <div className="flex justify-between text-gray-700 mb-2">
              <span>Total Amount</span>
              <span className="font-bold">₹{totalAmount}</span>
            </div>

            <Link
              to="/checkout"
              className="block text-center bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition mt-5"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
