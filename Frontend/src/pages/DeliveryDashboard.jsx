import React from "react";
import { Link } from "react-router-dom";

export default function DeliveryDashboard() {
  const stats = [
    {
      title: "Available Orders",
      value: 12,
      color: "bg-blue-500",
    },
    {
      title: "Active Deliveries",
      value: 3,
      color: "bg-orange-500",
    },
    {
      title: "Completed Today",
      value: 18,
      color: "bg-green-500",
    },
    {
      title: "Today's Earnings",
      value: "₹1,250",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Delivery Dashboard
            </h1>
            <p className="text-gray-500">
              Welcome back, Delivery Partner
            </p>
          </div>

          <button className="px-4 py-2 bg-red-500 text-white rounded-lg">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-md"
            >
              <div
                className={`w-12 h-12 rounded-xl ${item.color}`}
              />

              <h3 className="mt-4 text-gray-500">
                {item.title}
              </h3>

              <p className="text-3xl font-bold mt-1">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-8">

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Quick Actions
            </h2>

            <div className="flex flex-col gap-3">

              <Link
                to="/delivery/orders"
                className="bg-orange-500 text-white py-3 rounded-xl text-center"
              >
                View Available Orders
              </Link>

              <Link
                to="/delivery/active"
                className="bg-blue-500 text-white py-3 rounded-xl text-center"
              >
                Active Deliveries
              </Link>

              <Link
                to="/delivery/history"
                className="bg-green-500 text-white py-3 rounded-xl text-center"
              >
                Delivery History
              </Link>

              <Link
                to="/delivery/profile"
                className="bg-purple-500 text-white py-3 rounded-xl text-center"
              >
                My Profile
              </Link>

            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-xl font-semibold mb-4">
              Recent Deliveries
            </h2>

            <div className="space-y-4">

              <div className="border rounded-xl p-4">
                <h3 className="font-semibold">
                  Order #FD1024
                </h3>

                <p className="text-gray-500">
                  Burger King → Rohini
                </p>

                <span className="text-green-600 font-medium">
                  Delivered
                </span>
              </div>

              <div className="border rounded-xl p-4">
                <h3 className="font-semibold">
                  Order #FD1023
                </h3>

                <p className="text-gray-500">
                  Domino's → Pitampura
                </p>

                <span className="text-green-600 font-medium">
                  Delivered
                </span>
              </div>

              <div className="border rounded-xl p-4">
                <h3 className="font-semibold">
                  Order #FD1022
                </h3>

                <p className="text-gray-500">
                  KFC → Rohini
                </p>

                <span className="text-green-600 font-medium">
                  Delivered
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}