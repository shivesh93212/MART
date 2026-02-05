import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  cartItems,
  onAdd,
  onIncrease,
  onDecrease,
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {products.map((p) => {
        // ✅ NEW: cartItem find kar rahe based on product id
        const cartItem = cartItems.find((c) => c.product_id === p.id);

        return (
          <ProductCard
            key={p.id}
            product={p}
            cartItem={cartItem} // ✅ NEW: product ke corresponding cart item
            onAdd={onAdd} // ✅ NEW
            onIncrease={onIncrease} // ✅ NEW
            onDecrease={onDecrease} // ✅ NEW
          />
        );
      })}
    </div>
  );
}
