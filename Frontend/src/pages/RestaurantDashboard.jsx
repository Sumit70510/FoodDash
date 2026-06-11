import React from "react";
import {
  FaUtensils,
  FaList,
  FaShoppingBag,
  FaTruck,
  FaStore,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function RestaurantDashboard() {
  const restaurant =
    JSON.parse(localStorage.getItem("restaurant")) || {};

  return (
    <div className="min-h-screen bg-[#111827] text-white">
      {/* Navbar */}
      <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-[#1F2937]">
        <h1 className="text-2xl font-bold text-orange-500">
          FoodDash Partner
        </h1>

        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              restaurant?.isOpen
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />

          <span>
            {restaurant?.isOpen
              ? "Restaurant Open"
              : "Restaurant Closed"}
          </span>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-64px)] bg-[#1F2937] border-r border-gray-800">
          <nav className="p-5 space-y-3">
            <Link
              to="/restaurant/dashboard"
              className="flex items-center gap-3 p-3 rounded-xl bg-orange-500"
            >
              <FaStore />
              Dashboard
            </Link>

            <Link
              to="/restaurant/menu"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#374151]"
            >
              <FaUtensils />
              Menu Items
            </Link>

            <Link
              to="/restaurant/categories"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#374151]"
            >
              <FaList />
              Categories
            </Link>

            <Link
              to="/restaurant/orders"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#374151]"
            >
              <FaShoppingBag />
              Orders
            </Link>

            <Link
              to="/restaurant/deliveries"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#374151]"
            >
              <FaTruck />
              Deliveries
            </Link>

            <Link
              to="/restaurant/profile"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#374151]"
            >
              <FaStore />
              Restaurant Profile
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Welcome Card */}
          <div className="bg-[#1F2937] rounded-3xl p-6 mb-8 border border-gray-800">
            <h2 className="text-3xl font-bold">
              Welcome,
              <span className="text-orange-500 ml-2">
                {restaurant?.name || "Restaurant"}
              </span>
            </h2>

            <p className="text-gray-400 mt-2">
              Manage your menu, orders, deliveries and
              restaurant settings from one place.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#1F2937] p-6 rounded-2xl border border-gray-800">
              <h3 className="text-gray-400">
                Total Menu Items
              </h3>
              <p className="text-4xl font-bold mt-2 text-orange-500">
                0
              </p>
            </div>

            <div className="bg-[#1F2937] p-6 rounded-2xl border border-gray-800">
              <h3 className="text-gray-400">
                Categories
              </h3>
              <p className="text-4xl font-bold mt-2 text-green-500">
                0
              </p>
            </div>

            <div className="bg-[#1F2937] p-6 rounded-2xl border border-gray-800">
              <h3 className="text-gray-400">
                Pending Orders
              </h3>
              <p className="text-4xl font-bold mt-2 text-yellow-500">
                0
              </p>
            </div>

            <div className="bg-[#1F2937] p-6 rounded-2xl border border-gray-800">
              <h3 className="text-gray-400">
                Deliveries
              </h3>
              <p className="text-4xl font-bold mt-2 text-blue-500">
                0
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#1F2937] rounded-3xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-5">
              Quick Actions
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/restaurant/menu"
                className="bg-orange-500 hover:bg-orange-600 transition p-4 rounded-xl text-center font-semibold"
              >
                Add Menu Item
              </Link>

              <Link
                to="/restaurant/categories"
                className="bg-green-600 hover:bg-green-700 transition p-4 rounded-xl text-center font-semibold"
              >
                Add Category
              </Link>

              <Link
                to="/restaurant/orders"
                className="bg-blue-600 hover:bg-blue-700 transition p-4 rounded-xl text-center font-semibold"
              >
                View Orders
              </Link>

              <Link
                to="/restaurant/profile"
                className="bg-purple-600 hover:bg-purple-700 transition p-4 rounded-xl text-center font-semibold"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="mt-8 bg-[#1F2937] rounded-3xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">
              Restaurant Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4 text-gray-300">
              <p>
                <span className="font-semibold text-white">
                  Owner:
                </span>{" "}
                {restaurant?.ownerName || "-"}
              </p>

              <p>
                <span className="font-semibold text-white">
                  Email:
                </span>{" "}
                {restaurant?.email || "-"}
              </p>

              <p>
                <span className="font-semibold text-white">
                  Contact:
                </span>{" "}
                {restaurant?.restaurantContactNo ||
                  "-"}
              </p>

              <p>
                <span className="font-semibold text-white">
                  Address:
                </span>{" "}
                {restaurant?.location?.address ||
                  "-"}
              </p>

              <p>
                <span className="font-semibold text-white">
                  FSSAI:
                </span>{" "}
                {restaurant?.FSSAI || "-"}
              </p>

              <p>
                <span className="font-semibold text-white">
                  GST:
                </span>{" "}
                {restaurant?.GST || "-"}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}