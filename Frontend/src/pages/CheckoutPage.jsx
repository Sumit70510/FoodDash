import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const { cartItems = [] } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [paymentMethod, setPaymentMethod] = useState("Cod");
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    address: user?.address || "",
    lat: "",
    lng: "",
  });

  const subTotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
  }, [cartItems]);

  const deliveryFee = subTotal > 500 ? 0 : 40;

  const tax = Math.round(subTotal * 0.05);

  const discount = 0;

  const total = subTotal + deliveryFee + tax - discount;

  const handlePlaceOrder = async () => {
    if (!address.address.trim()) {
      return toast.error("Delivery address required");
    }

    if (cartItems.length === 0) {
      return toast.error("Cart is empty");
    }

    try {
      setLoading(true);

      const payload = {
        restaurantId: cartItems[0].restaurantId,

        items: cartItems.map((item) => ({
          menuItemId: item._id,
          name: item.name,
          quantity: item.quantity,
          sizeType: item.sizeType,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
        })),

        subTotal,
        deliveryFee,
        tax,
        discount,

        totalAmount: total,

        paymentMethod,

        pickUpLocation: {
          address: cartItems[0].restaurantAddress || "",
        },

        dropLocation: address,
      };

      if (paymentMethod === "Cod") {
        const res = await api.post("/order/place", payload);

        if (res.data.success) {
          toast.success("Order placed successfully");

          navigate("/user/orders");
        }

        return;
      }

      const order = await api.post("/payment/create-order", {
        amount: total,
      });

      const razorpayOrder = order.data.order;

      const options = {
        key: order.data.key || import.meta.env.VITE_RAZORPAY_KEY,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        order_id: razorpayOrder.id,

        name: "FoodDash",

        description: "Food Order",

        handler: async (response) => {
          const verify = await api.post("/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,

            razorpay_payment_id:
              response.razorpay_payment_id,

            razorpay_signature:
              response.razorpay_signature,

            orderData: payload,
          });

          if (verify.data.success) {
            toast.success("Payment Successful");

            navigate("/payment/success");
          }
        },

        prefill: {
          name: user?.name,

          email: user?.email,

          contact: user?.phone,
        },

        theme: {
          color: "#f97316",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (err) {
      console.log(err);

      toast.error(
        err?.response?.data?.message ||
          "Unable to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen app-bg text-muted py-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-4">

          <div className="surface rounded-xl p-4">

            <h2 className="text-2xl font-bold mb-3 text-white">Delivery Address</h2>

            <textarea
              rows={4}
              value={address.address}
              onChange={(e) =>
                setAddress({
                  ...address,
                  address: e.target.value,
                })
              }
              className="w-full bg-transparent border border-gray-700 rounded-lg p-3 text-white"
            />

          </div>

          <div className="surface rounded-xl p-4">

            <h2 className="text-2xl font-bold mb-4 text-white">Cart Items</h2>

            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between border-b border-gray-700 py-3">
                <div>
                  <h3 className="text-white">{item.name}</h3>

                  <p className="text-sm text-muted">{item.sizeType}</p>

                  <p className="text-sm text-muted">Qty : {item.quantity}</p>
                </div>

                <div className="text-white">₹{item.quantity * item.unitPrice}</div>
              </div>
            ))}

          </div>

        </div>

        <div>

          <div className="surface rounded-xl p-4 sticky top-5">

            <h2 className="text-2xl font-bold mb-4 text-white">Order Summary</h2>

            <div className="flex justify-between mb-3">
              <span>Subtotal</span>
              <span>₹{subTotal}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span>Delivery</span>
              <span>₹{deliveryFee}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span>GST</span>
              <span>₹{tax}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span>Discount</span>
              <span>-₹{discount}</span>
            </div>

            <hr className="border-gray-700 my-4"/>

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <div className="mt-8">

              <h3 className="font-semibold mb-3">
                Payment Method
              </h3>

              <label className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  checked={paymentMethod === "Cod"}
                  onChange={() =>
                    setPaymentMethod("Cod")
                  }
                />
                Cash On Delivery
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={paymentMethod === "UPI"}
                  onChange={() =>
                    setPaymentMethod("UPI")
                  }
                />
                Razorpay (UPI/Card/NetBanking)
              </label>

            </div>

            <button disabled={loading} onClick={handlePlaceOrder} className="mt-6 w-full bg-orange-500 hover:bg-orange-600 rounded-lg py-3 font-semibold text-white">
              {loading ? "Processing..." : paymentMethod === "Cod" ? "Place Order" : "Proceed to Payment"}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}