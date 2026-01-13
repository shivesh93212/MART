const userId = 1;

async function pay() {
  const order = await apiFetch(`/payment/create_order?user_id=${userId}`, {
    method: "POST"
  });

  const options = {
    key: order.key,
    amount: order.amount * 100,
    currency: "INR",
    order_id: order.razorpay_order_id,
    handler: async function (response) {
      await apiFetch("/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: order.order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature
        })
      });
      alert("Payment Success 🎉");
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}
