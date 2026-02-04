
export default function Productcard({product,onAdd}){
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-3 flex flex-col">
            
            <div className="h-40 flex items-center justify-center overflow-hidden">
                <img
                src={`http://localhost:8000/${product.image}`}
                alt={product.name}
                className="h-full object-contain"
                />
            </div>

            <h3 className="font-semibold text-gray-800 mt-2 line-clamp-1">
                {product.name}
            </h3>

            <p className="tex-gray-600 text-sm mt-1">
                ₹{product.price}
            </p>

            <p className="text-xs text-gray-500 mt-1">
                Stock: {product.quantity}
            </p>
            
            <button 
            onClick={()=>onAdd(product.id)}
            disable={product.quantity<=0}
            className="mt-3 bg-green-600 text-white py-2 rounded-lg font-semobold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
                Add
            </button>
        </div>
    )
}