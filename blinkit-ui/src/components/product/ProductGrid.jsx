import ProductCard from "./ProductCard"

export default function ProductGrid({products,onAdd}){
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {products.map((p)=>(
                <ProductCard key={p.id} product={p} onAdd={onAdd}/>
                
            ))}
        </div>
    )
}