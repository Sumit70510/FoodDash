import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import api from "../api/axios.js";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await api.get("/order/my-orders");

      setOrders(res.data.orders || res.data.data || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>

        {loading && <p>Loading orders...</p>}

        {message && <p className="text-red-500">{message}</p>}

        {!loading && orders.length === 0 && (
          <p>No orders found.</p>
        )}

        <div className="flex flex-col gap-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-md border p-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">
                    Order #{order._id}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Restaurant:{" "}
                    {order.restaurantName ||
                      order.restaurantId?.name ||
                      order.restaurantId?.restaurantName ||
                      "N/A"}
                  </p>
                </div>

                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
                  {order.status || "Pending"}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {(order.items || []).map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-gray-700"
                  >
                    <span>
                      {item.name || item.menuItemId?.name} × {item.quantity}
                    </span>

                    <span>
                      ₹{item.totalPrice || item.price * item.quantity || 0}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>
                  ₹{order.totalAmount || order.grandTotal || order.total || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}