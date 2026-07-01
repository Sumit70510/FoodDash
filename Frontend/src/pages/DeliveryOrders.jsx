import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import { toast } from "sonner";

export default function DeliveryOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Replace this endpoint after adding delivery partner backend
      const { data } = await api.get("/order/available");

      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.log(error);

      // Temporary fallback
      try {
        const { data } = await api.get("/order/all");

        if (data.success) {
          const activeOrders = data.orders.filter(
            (order) =>
              order.orderStatus !== "Delivered" &&
              order.orderStatus !== "Cancelled"
          );

          setOrders(activeOrders);
        }
      } catch (err) {
        toast.error("Unable to fetch orders");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/order/status/${id}`, {
        orderStatus: status,
      });

      if (data.success) {
        toast.success("Status Updated");
        fetchOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  const acceptOrder = (id) => {
    updateStatus(id, "Picked Up");
  };

  const deliverOrder = (id) => {
    updateStatus(id, "Delivered");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111827] flex items-center justify-center">
        <h2 className="text-white text-xl">Loading Orders...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111827] px-6 py-8">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold text-white">
            Available Orders
          </h1>

          <button
            onClick={fetchOrders}
            className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-xl text-white"
          >
            Refresh
          </button>

        </div>

        {orders.length === 0 ? (
          <div className="bg-[#1F2937] rounded-3xl p-12 text-center">

            <h2 className="text-2xl text-gray-300">
              No Active Orders
            </h2>

          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">

            {orders.map((order) => (

              <div
                key={order._id}
                className="bg-[#1F2937] rounded-3xl p-6 border border-gray-700"
              >

                <div className="flex justify-between mb-4">

                  <div>

                    <h2 className="text-white text-xl font-semibold">
                      Order #{order._id.slice(-6)}
                    </h2>

                    <p className="text-gray-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>

                  </div>

                  <span className="bg-orange-500 text-white px-4 py-2 rounded-full h-fit">
                    {order.orderStatus}
                  </span>

                </div>

                <div className="space-y-2">

                  <h3 className="text-white font-semibold">
                    Customer Items
                  </h3>

                  {order.items.map((item, index) => (

                    <div
                      key={index}
                      className="flex justify-between text-gray-300"
                    >

                      <span>
                        {item.quantity} × {item.name}
                      </span>

                      <span>
                        ₹{item.totalPrice}
                      </span>

                    </div>

                  ))}

                </div>

                <div className="border-t border-gray-700 my-5"></div>

                <div className="space-y-2">

                  <div className="flex justify-between text-gray-300">
                    <span>Payment</span>
                    <span>{order.paymentMethod}</span>
                  </div>

                  <div className="flex justify-between text-gray-300">
                    <span>Status</span>
                    <span>{order.paymentStatus}</span>
                  </div>

                  <div className="flex justify-between text-white font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{order.totalAmount}</span>
                  </div>

                </div>

                <div className="mt-6">

                  <div className="bg-[#111827] rounded-xl p-4 mb-4">

                    <h4 className="text-orange-400 mb-2">
                      Pickup Address
                    </h4>

                    <p className="text-gray-300">
                      {order.pickUpLocation?.address || "Restaurant Address"}
                    </p>

                  </div>

                  <div className="bg-[#111827] rounded-xl p-4">

                    <h4 className="text-green-400 mb-2">
                      Delivery Address
                    </h4>

                    <p className="text-gray-300">
                      {order.dropLocation?.address || "Customer Address"}
                    </p>

                  </div>

                </div>

                <div className="flex gap-4 mt-6">

                  {order.orderStatus === "Preparing" && (

                    <button
                      onClick={() => acceptOrder(order._id)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 py-3 rounded-xl text-white font-semibold"
                    >
                      Pick Up
                    </button>

                  )}

                  {(order.orderStatus === "Picked Up" ||
                    order.orderStatus === "Out For Delivery") && (

                    <button
                      onClick={() =>
                        updateStatus(
                          order._id,
                          "Out For Delivery"
                        )
                      }
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 py-3 rounded-xl text-white font-semibold"
                    >
                      Out For Delivery
                    </button>

                  )}

                  {order.orderStatus === "Out For Delivery" && (

                    <button
                      onClick={() => deliverOrder(order._id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 py-3 rounded-xl text-white font-semibold"
                    >
                      Delivered
                    </button>

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