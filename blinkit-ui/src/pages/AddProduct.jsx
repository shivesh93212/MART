import { useState } from "react";
import { addProduct } from "../api/productApi";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category,setCategory] = useState("")
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("category",category)
    formData.append("image", image);

    try {
      const res = await addProduct(formData);
      alert("Product Added Successfully ✅");

      setName("");
      setPrice("");
      setQuantity("");
      setImage(null);

      console.log(res);
    } catch (err) {
      alert(err.response?.data?.detail || "Error adding product");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Add Product (Admin)</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-sm space-y-4"
      >
        <div>
          <label className="block font-semibold mb-1">Product Name</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Price</label>
          <input
            type="number"
            className="w-full border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Quantity</label>
          <input
            type="number"
            className="w-full border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Category</label>
          <input
          type="text"
          className="w-full border px-4 py-2 rounded-lg outline-none focus:ring-2 focus-ring-green-500"
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
          placeholder="eg: Dairy, Snacks, Fruits"
          required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Product Image</label>
          <input
            type="file"
            className="w-full border px-4 py-2 rounded-lg"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
