import React from "react";
import {
  FaUtensils,
  FaList,
  FaShoppingBag,
  FaTruck,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

export default function RestaurantDashboard() {
  
  const { user, type } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const restaurant = user||{};
  // console.log(restaurant);

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 space-y-8">

      {/* Welcome */}
      <div className="bg-[#1F2937] border border-gray-800 rounded-3xl p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Welcome Back,
          <span className="text-orange-500 ml-2">
            {restaurant?.name}
          </span>
        </h1>

        <p className="text-gray-400 mt-3">
          Manage your restaurant, menu, orders and deliveries
          from one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="bg-[#1F2937] rounded-2xl p-5 border border-gray-800">
          <div className="flex items-center justify-between">
            <FaUtensils className="text-orange-500 text-3xl" />
            <span className="text-4xl font-bold text-white">
              0
            </span>
          </div>

          <p className="text-gray-400 mt-3">
            Menu Items
          </p>
        </div>

        <div className="bg-[#1F2937] rounded-2xl p-5 border border-gray-800">
          <div className="flex items-center justify-between">
            <FaList className="text-green-500 text-3xl" />
            <span className="text-4xl font-bold text-white">
              0
            </span>
          </div>

          <p className="text-gray-400 mt-3">
            Categories
          </p>
        </div>

        <div className="bg-[#1F2937] rounded-2xl p-5 border border-gray-800">
          <div className="flex items-center justify-between">
            <FaShoppingBag className="text-yellow-500 text-3xl" />
            <span className="text-4xl font-bold text-white">
              0
            </span>
          </div>

          <p className="text-gray-400 mt-3">
            Pending Orders
          </p>
        </div>

        <div className="bg-[#1F2937] rounded-2xl p-5 border border-gray-800">
          <div className="flex items-center justify-between">
            <FaTruck className="text-blue-500 text-3xl" />
            <span className="text-4xl font-bold text-white">
              0
            </span>
          </div>

          <p className="text-gray-400 mt-3">
            Deliveries
          </p>
        </div>

      </div>

      {/* Restaurant Information */}
      <div className="bg-[#1F2937] border border-gray-800 rounded-3xl p-6">

        <h2 className="text-2xl font-bold text-white mb-6">
          Restaurant Information
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <p className="text-gray-400">Restaurant Name</p>
            <p className="text-white font-semibold">
              {restaurant?.name || "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Owner Name</p>
            <p className="text-white font-semibold">
              {restaurant?.ownerName || "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Email</p>
            <p className="text-white font-semibold">
              {restaurant?.email || "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">
              Restaurant Contact
            </p>
            <p className="text-white font-semibold">
              {restaurant?.restaurantContactNo || "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Address</p>
            <p className="text-white font-semibold">
              {restaurant?.location?.address || "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">FSSAI</p>
            <p className="text-white font-semibold">
              {restaurant?.FSSAI || "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">GST</p>
            <p className="text-white font-semibold">
              {restaurant?.GST || "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Status</p>

            <div className="flex items-center gap-2 mt-1">
              <div
                className={`w-3 h-3 rounded-full ${
                  restaurant?.isOpen
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              />

              <span className="text-white font-semibold">
                {restaurant?.isOpen
                  ? "Open"
                  : "Closed"}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#1F2937] border border-gray-800 rounded-3xl p-6">

        <h2 className="text-2xl font-bold text-white mb-4">
          Recent Activity
        </h2>

        <div className="space-y-3">

          <div className="bg-[#111827] rounded-xl p-4">
            <p className="text-gray-300">
              No recent orders available
            </p>
          </div>

          <div className="bg-[#111827] rounded-xl p-4">
            <p className="text-gray-300">
              No delivery updates available
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}