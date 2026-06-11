import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios.js";
import { toast } from "sonner";

export default function RestaurantOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/restaurant/login");
      return;
    }
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/order", { params: { status: filter } });
      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await api.put(`/order/${orderId}`, {
        status: newStatus,
      });
      if (response.data.success) {
        toast.success("Order status updated");
        fetchOrders();
      }
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-purple-100 text-purple-800",
      ready: "bg-green-100 text-green-800",
      completed: "bg-green-200 text-green-900",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Orders Management</h1>

        <div className="mb-6 flex gap-2 flex-wrap">
          {["all", "pending", "confirmed", "preparing", "ready", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg capitalize font-semibold transition ${
                filter === status
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      Order #{order._id?.slice(-6).toUpperCase()}
                    </h3>
                    <p className="text-gray-600">
                      {order.userId?.name} • {order.userId?.phone}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full font-semibold capitalize ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Items:</h4>
                  <ul className="space-y-1">
                    {order.items?.map((item, idx) => (
                      <li key={idx} className="text-gray-700">
                        {item.quantity}x {item.name} - ₹{item.price * item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Delivery Address:</p>
                  <p className="font-semibold">{order.deliveryAddress}</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {order.status !== "completed" && order.status !== "cancelled" && (
                    <>
                      {order.status === "pending" && (
                        <button
                          onClick={() => updateOrderStatus(order._id, "confirmed")}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Confirm
                        </button>
                      )}
                      {order.status === "confirmed" && (
                        <button
                          onClick={() => updateOrderStatus(order._id, "preparing")}
                          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                        >
                          Start Preparing
                        </button>
                      )}
                      {order.status === "preparing" && (
                        <button
                          onClick={() => updateOrderStatus(order._id, "ready")}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Ready for Pickup
                        </button>
                      )}
                      {order.status === "ready" && (
                        <button
                          onClick={() => updateOrderStatus(order._id, "completed")}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Completed
                        </button>
                      )}
                      <button
                        onClick={() => updateOrderStatus(order._id, "cancelled")}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
