const cartId = 1;

async function loadCart() {
  const items = await apiFetch(`/cart/${cartId}`);
  const div = document.getElementById("cart");

  items.forEach(i => {
    div.innerHTML += `
      <div class="row">
        Product ID: ${i.product_id}
        Qty: ${i.quantity}
      </div>
    `;
  });
}

loadCart();
