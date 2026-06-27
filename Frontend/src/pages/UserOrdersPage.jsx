import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const statusColor = {
  Placed: "bg-blue-500",
  Confirmed: "bg-indigo-500",
  Preparing: "bg-yellow-500",
  "Picked Up": "bg-purple-500",
  "Out For Delivery": "bg-orange-500",
  Delivered: "bg-green-600",
  Cancelled: "bg-red-600",
};

const paymentColor = {
  Pending: "bg-yellow-500",
  Paid: "bg-green-600",
  Failed: "bg-red-600",
  Refunded: "bg-purple-600",
};

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/order/user");

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message ||
          "Unable to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      const { data } = await api.put(
        `/order/cancel/${id}`
      );

      if (data.success) {
        toast.success(data.message);
        fetchOrders();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to cancel order"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111827] flex justify-center items-center text-white">
        Loading Orders...
      </div>
    );
  }

  return (
    <>
     <Navbar/>
    <div className="min-h-screen bg-[#111827] px-4 py-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-white mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-[#1F2937] rounded-3xl p-12 text-center">

            <h2 className="text-2xl text-white font-bold mb-3">
              No Orders Yet
            </h2>

            <p className="text-gray-400 mb-6">
              Looks like you haven't ordered anything.
            </p>

            <Link
              to="/restaurants"
              className="bg-orange-500 px-6 py-3 rounded-xl text-white"
            >
              Browse Restaurants
            </Link>

          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (

              <div
                key={order._id}
                className="bg-[#1F2937] rounded-3xl border border-gray-700 p-6"
              >

                {/* Header */}

                <div className="flex flex-col lg:flex-row justify-between gap-4">

                  <div>

                    <h2 className="text-white text-2xl font-bold">
                      {order.restaurantId?.restaurantName ||
                        order.restaurantId?.name}
                    </h2>

                    <p className="text-gray-400">
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>

                  <div className="flex gap-3 flex-wrap">

                    <span
                      className={`${statusColor[
                        order.orderStatus
                      ]} text-white px-4 py-2 rounded-full`}
                    >
                      {order.orderStatus}
                    </span>

                    <span
                      className={`${paymentColor[
                        order.paymentStatus
                      ]} text-white px-4 py-2 rounded-full`}
                    >
                      {order.paymentStatus}
                    </span>

                  </div>

                </div>

                <hr className="border-gray-700 my-5" />

                <div className="space-y-4">

                  {order.items.map((item) => (

                    <div
                      key={item.menuItemId}
                      className="flex justify-between border-b border-gray-800 pb-3"
                    >

                      <div>

                        <h3 className="text-white font-semibold">
                          {item.name}
                        </h3>

                        <p className="text-gray-400">
                          {item.sizeType}
                        </p>

                        <p className="text-gray-500">
                          Qty : {item.quantity}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="text-orange-400 font-bold">
                          ₹{item.totalPrice}
                        </p>

                      </div>

                    </div>

                  ))}

                </div>

                <div className="flex justify-between mt-6 flex-wrap gap-4">

                  <div>

                    <p className="text-gray-400">
                      Payment :
                      <span className="text-white ml-2">
                        {order.paymentMethod}
                      </span>
                    </p>

                    <p className="text-gray-400">
                      Total :
                      <span className="text-orange-400 font-bold ml-2">
                        ₹{order.totalAmount}
                      </span>
                    </p>

                  </div>

                  <div className="flex gap-3">

                    <Link
                      to={`/orders/${order._id}`}
                      className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl text-white"
                    >
                      View Details
                    </Link>

                    {order.orderStatus !== "Delivered" &&
                      order.orderStatus !== "Cancelled" && (
                        <button
                          onClick={() =>
                            cancelOrder(order._id)
                          }
                          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl text-white"
                        >
                          Cancel Order
                        </button>
                      )}

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
    </>
  );
}