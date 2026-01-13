const userId = 1; // TEMP user

async function loadProducts() {
  const products = await apiFetch("/product");
  const div = document.getElementById("products");

  products.forEach(p => {
    div.innerHTML += `
      <div class="card">
        <img src="${BASE_URL}/${p.image}">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart(${p.id})">Add</button>
      </div>
    `;
  });
}

async function addToCart(productId) {
  await apiFetch(`/cart/add?user_id=${userId}&product_id=${productId}`, {
    method: "POST"
  });
  alert("Added to cart");
}

loadProducts();
