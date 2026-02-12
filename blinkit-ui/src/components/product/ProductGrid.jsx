import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  cartItems,
  onAdd,
  onIncrease,
  onDecrease,
  onDelete,
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {products.map((p) => {
      
        const cartItem = cartItems.find((c) =>Number(c.product_id) === Number(p.id));

        return (
          <ProductCard
            key={p.id}
            product={p}
            cartItem={cartItem} 
            onAdd={onAdd}
            onIncrease={onIncrease} 
            onDecrease={onDecrease}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
}
