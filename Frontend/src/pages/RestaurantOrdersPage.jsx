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

    // if (!token) {
    //   navigate("/restaurant/login");
    //   return;
    // }

    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get("/order", {
        params: {
          status: filter !== "all" ? filter : undefined,
        },
      });

      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (
    orderId,
    status
  ) => {
    try {
      const response = await api.put(
        `/order/${orderId}`,
        { status }
      );

      if (response.data.success) {
        toast.success("Order updated");
        fetchOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update order");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Placed":
        return "bg-yellow-500/20 text-yellow-400";

      case "Accepted":
        return "bg-blue-500/20 text-blue-400";

      case "Preparing":
        return "bg-purple-500/20 text-purple-400";

      case "Ready For Pickup":
        return "bg-green-500/20 text-green-400";

      case "Picked Up":
        return "bg-indigo-500/20 text-indigo-400";

      case "Out For Delivery":
        return "bg-orange-500/20 text-orange-400";

      case "Delivered":
        return "bg-green-600/20 text-green-500";

      case "Cancelled":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const pendingCount = orders.filter(
    (o) => o.status === "Placed"
  ).length;

  const preparingCount = orders.filter(
    (o) => o.status === "Preparing"
  ).length;

  const readyCount = orders.filter(
    (o) => o.status === "Ready For Pickup"
  ).length;

  return (
    <div className="min-h-screen bg-[#111827] px-4 md:px-6 lg:px-8 py-6 ">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-8">
          Orders Management
        </h1>

        {/* STATS */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1F2937] rounded-2xl p-5">
            <p className="text-gray-400">
              Total Orders
            </p>

            <h2 className="text-3xl font-bold text-white">
              {orders.length}
            </h2>
          </div>

          <div className="bg-[#1F2937] rounded-2xl p-5">
            <p className="text-gray-400">
              Pending
            </p>

            <h2 className="text-3xl font-bold text-yellow-400">
              {pendingCount}
            </h2>
          </div>

          <div className="bg-[#1F2937] rounded-2xl p-5">
            <p className="text-gray-400">
              Preparing
            </p>

            <h2 className="text-3xl font-bold text-purple-400">
              {preparingCount}
            </h2>
          </div>

          <div className="bg-[#1F2937] rounded-2xl p-5">
            <p className="text-gray-400">
              Ready
            </p>

            <h2 className="text-3xl font-bold text-green-400">
              {readyCount}
            </h2>
          </div>
        </div>

        {/* FILTERS */}

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {[
            "all",
            "Placed",
            "Accepted",
            "Preparing",
            "Ready For Pickup",
            "Delivered",
            "Cancelled",
          ].map((status) => (
            <button
              key={status}
              onClick={() =>
                setFilter(status)
              }
              className={`px-4 py-2 rounded-xl whitespace-nowrap font-medium transition ${
                filter === status
                  ? "bg-orange-500 text-white"
                  : "bg-[#1F2937] text-gray-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* CONTENT */}

        {loading ? (
          <div className="text-center text-white py-20">
            Loading Orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#1F2937] rounded-3xl p-16 text-center">
            <h3 className="text-2xl text-gray-400">
              No Orders Found
            </h3>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="
                  bg-[#1F2937]
                  border
                  border-gray-800
                  rounded-3xl
                  p-6
                "
              >
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Order #
                      {order._id
                        ?.slice(-6)
                        .toUpperCase()}
                    </h2>

                    <p className="text-gray-400">
                      {order.userId?.name ||
                        "Customer"}
                    </p>

                    <p className="text-gray-500 text-sm">
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-2">
                    <span className="text-2xl font-bold text-orange-500">
                      ₹
                      {order.totalAmount}
                    </span>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* ITEMS */}

                <div className="mt-5 bg-[#111827] rounded-2xl p-4">
                  <h3 className="text-white font-semibold mb-3">
                    Ordered Items
                  </h3>

                  <div className="space-y-2">
                    {order.items?.map(
                      (item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-gray-300"
                        >
                          <span>
                            {item.quantity} ×{" "}
                            {item.name}
                          </span>

                          <span>
                            ₹
                            {item.price *
                              item.quantity}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* DELIVERY */}

                <div className="mt-4 bg-[#111827] rounded-2xl p-4">
                  <h3 className="text-white font-semibold mb-2">
                    Delivery Address
                  </h3>

                  <p className="text-gray-300">
                    {order.deliveryAddress}
                  </p>
                </div>

                {/* PAYMENT */}

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-[#111827] p-4 rounded-2xl">
                    <p className="text-gray-400 text-sm">
                      Payment Method
                    </p>

                    <p className="text-white font-semibold">
                      {order.paymentMethod ||
                        "COD"}
                    </p>
                  </div>

                  <div className="bg-[#111827] p-4 rounded-2xl">
                    <p className="text-gray-400 text-sm">
                      Payment Status
                    </p>

                    <p className="text-green-400 font-semibold">
                      {order.paymentStatus ||
                        "Paid"}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}

                <div className="flex flex-wrap gap-3 mt-6">
                  {order.status ===
                    "Placed" && (
                    <button
                      onClick={() =>
                        updateOrderStatus(
                          order._id,
                          "Accepted"
                        )
                      }
                      className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl text-white"
                    >
                      Accept Order
                    </button>
                  )}

                  {order.status ===
                    "Accepted" && (
                    <button
                      onClick={() =>
                        updateOrderStatus(
                          order._id,
                          "Preparing"
                        )
                      }
                      className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-xl text-white"
                    >
                      Start Preparing
                    </button>
                  )}

                  {order.status ===
                    "Preparing" && (
                    <button
                      onClick={() =>
                        updateOrderStatus(
                          order._id,
                          "Ready For Pickup"
                        )
                      }
                      className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl text-white"
                    >
                      Ready For Pickup
                    </button>
                  )}

                  {![
                    "Delivered",
                    "Cancelled",
                  ].includes(
                    order.status
                  ) && (
                    <button
                      onClick={() =>
                        updateOrderStatus(
                          order._id,
                          "Cancelled"
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-white"
                    >
                      Cancel Order
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