import { createPaymentOrder, verifyPayment } from "../api/paymentApi";

export default function Checkout() {
  const userId = localStorage.getItem("userId");

  const handlePayment = async () => {
    try {
      const orderData = await createPaymentOrder(userId);

      const options = {
        key: orderData.key,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: "Blinkit Clone",
        description: "Order Payment",
        order_id: orderData.razorpay_order_id,

        handler: async function (response) {
          const payload = {
            order_id: orderData.order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };

          const verifyRes = await verifyPayment(payload);

          alert("Payment Successful ✅ Order Confirmed");
          console.log(verifyRes);
        },

        theme: {
          color: "#22c55e",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      alert(err.response?.data?.detail || "Payment error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <button
        onClick={handlePayment}
        className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
      >
        Pay Now
      </button>
    </div>
  );
}
