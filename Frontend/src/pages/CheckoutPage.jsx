import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import api from "../api/axios.js";
import { clearCart } from "../redux/cartSlice.js";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { restaurantId, items, subTotal } = useSelector((state) => state.cart);

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const deliveryFee = items.length > 0 ? 40 : 0;
  const tax = Math.round(subTotal * 0.05);
  const grandTotal = subTotal + deliveryFee + tax;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      setMessage("Your cart is empty");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const orderPayload = {
        restaurantId,
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
        deliveryAddress: address,
        paymentMethod,
        subTotal,
        deliveryFee,
        tax,
        totalAmount: grandTotal,
      };

      await api.post("/order/create", orderPayload);

      dispatch(clearCart());
      navigate("/my-orders");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        {message && <p className="text-red-500 mb-4">{message}</p>}

        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-bold mb-4">Delivery Details</h2>

            <div className="flex flex-col gap-2 mb-5">
              <label>Delivery Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border rounded-md p-3 outline-none min-h-28"
                placeholder="Enter your full delivery address"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>Payment Method</label>

              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="border rounded-md p-3 outline-none"
              >
                <option value="COD">Cash on Delivery</option>
                <option value="ONLINE">Online Payment</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5 h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            {items.map((item) => (
              <div
                key={item.menuItemId}
                className="flex justify-between text-sm mb-2"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>

                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{subTotal}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>

              <div className="flex justify-between mb-4">
                <span>Tax</span>
                <span>₹{tax}</span>
              </div>

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full bg-orange-500 text-white py-2 rounded-md disabled:opacity-60"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}