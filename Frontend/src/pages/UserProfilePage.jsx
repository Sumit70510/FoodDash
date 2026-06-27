import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaHeart,
  FaBoxOpen,
  FaCog,
  FaEdit,
  FaStar,
  FaShoppingBag,
  FaCreditCard,
} from "react-icons/fa";
import Navbar from "../components/Navbar.jsx";

export default function UserProfilePage() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const stats = [
    {
      title: "Orders",
      value: 24,
      icon: <FaBoxOpen />,
      color: "bg-orange-500",
    },
    {
      title: "Wishlist",
      value: 18,
      icon: <FaHeart />,
      color: "bg-red-500",
    },
    {
      title: "Addresses",
      value: 3,
      icon: <FaMapMarkerAlt />,
      color: "bg-blue-500",
    },
    {
      title: "Reviews",
      value: 11,
      icon: <FaStar />,
      color: "bg-green-500",
    },
  ];

  const quickActions = [
    {
      title: "My Orders",
      description: "Track previous orders",
      icon: <FaBoxOpen />,
      path: "/account/orders",
      color: "bg-orange-500",
    },
    {
      title: "Saved Addresses",
      description: "Manage delivery locations",
      icon: <FaMapMarkerAlt />,
      path: "/account/addresses",
      color: "bg-blue-500",
    },
    {
      title: "Wishlist",
      description: "Favourite restaurants",
      icon: <FaHeart />,
      path: "/account/wishlist",
      color: "bg-red-500",
    },
    {
      title: "Payment Methods",
      description: "Cards & UPI",
      icon: <FaCreditCard />,
      path: "/account/payments",
      color: "bg-purple-500",
    },
    {
      title: "Settings",
      description: "Account preferences",
      icon: <FaCog />,
      path: "/account/settings",
      color: "bg-gray-600",
    },
  ];

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-[#111827] py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold text-white mb-8">
          My Profile
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Side */}
          <div className="space-y-6">

            {/* Profile Card */}

            <div className="bg-[#1F2937] rounded-3xl p-8 border border-gray-700">

              <div className="flex flex-col items-center">

                <img
                  src={
                    user?.profileImage ||
                    `https://ui-avatars.com/api/?background=f97316&color=fff&name=${encodeURIComponent(
                      user?.name || "User"
                    )}`
                  }
                  alt="profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-orange-500"
                />

                <h2 className="text-3xl font-bold text-white mt-5">
                  {user?.name}
                </h2>

                <p className="text-gray-400 mt-2">
                  {user?.email}
                </p>

                <button
                  className="mt-6 bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl flex items-center gap-2 text-white font-semibold"
                >
                  <FaEdit />
                  Edit Profile
                </button>

              </div>

            </div>

            {/* Statistics */}

            <div className="bg-[#1F2937] rounded-3xl p-6 border border-gray-700">

              <h3 className="text-white text-xl font-semibold mb-5">
                Statistics
              </h3>

              <div className="grid grid-cols-2 gap-4">

                {stats.map((item, index) => (

                  <div
                    key={index}
                    className="bg-[#111827] rounded-2xl p-5 text-center hover:bg-[#374151] transition"
                  >

                    <div
                      className={`${item.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-xl`}
                    >
                      {item.icon}
                    </div>

                    <h2 className="text-2xl font-bold text-white">
                      {item.value}
                    </h2>

                    <p className="text-gray-400 text-sm">
                      {item.title}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* Right Side */}

          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}

            <div className="bg-[#1F2937] rounded-3xl p-8 border border-gray-700">

              <div className="flex items-center justify-between mb-8">

                <h2 className="text-2xl font-bold text-white">
                  Personal Information
                </h2>

                <button
                  className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-xl text-white flex items-center gap-2 transition"
                >
                  <FaEdit />
                  Edit
                </button>

              </div>

              <div className="grid md:grid-cols-2 gap-6">

                <InfoCard
                  icon={<FaUser />}
                  label="Full Name"
                  value={user?.name || "Not Available"}
                />

                <InfoCard
                  icon={<FaEnvelope />}
                  label="Email Address"
                  value={user?.email || "Not Available"}
                />

                <InfoCard
                  icon={<FaPhone />}
                  label="Phone Number"
                  value={user?.phone || "Not Added"}
                />

                <InfoCard
                  icon={<FaCalendarAlt />}
                  label="Member Since"
                  value={
                    user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "Recently Joined"
                  }
                />

              </div>

            </div>

            {/* Quick Actions */}

            <div className="bg-[#1F2937] rounded-3xl p-8 border border-gray-700">

              <h2 className="text-2xl font-bold text-white mb-6">
                Quick Actions
              </h2>

              <div className="grid md:grid-cols-2 gap-5">

                {quickActions.map((action, index) => (

                  <button
                    key={index}
                    onClick={() => navigate(action.path)}
                    className="bg-[#111827] rounded-2xl p-5 flex items-center gap-5 hover:bg-[#374151] transition text-left group"
                  >

                    <div
                      className={`${action.color} w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition`}
                    >
                      {action.icon}
                    </div>

                    <div>

                      <h3 className="text-white font-semibold text-lg">
                        {action.title}
                      </h3>

                      <p className="text-gray-400 text-sm">
                        {action.description}
                      </p>

                    </div>

                  </button>

                ))}

              </div>

            </div>

            {/* Recent Activity */}

            <div className="bg-[#1F2937] rounded-3xl p-8 border border-gray-700">

              <div className="flex items-center justify-between mb-6">

                <h2 className="text-2xl font-bold text-white">
                  Recent Activity
                </h2>

                <button
                  onClick={() => navigate("/account/orders")}
                  className="text-orange-400 hover:text-orange-300"
                >
                  View All
                </button>

              </div>

              <div className="space-y-4">

                <Activity
                  icon={<FaShoppingBag />}
                  title="Ordered Chicken Biryani"
                  date="2 hours ago"
                />

                <Activity
                  icon={<FaHeart />}
                  title="Added Domino's to Wishlist"
                  date="Yesterday"
                />

                <Activity
                  icon={<FaMapMarkerAlt />}
                  title="Added Home Address"
                  date="2 days ago"
                />

                <Activity
                  icon={<FaCreditCard />}
                  title="Payment completed"
                  date="4 days ago"
                />

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
    </>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-[#111827] rounded-2xl p-5 hover:bg-[#1a2332] transition">
      <div className="flex items-center gap-3 text-orange-400 mb-3 text-lg">
        {icon}
        <span className="font-semibold">
          {label}
        </span>
      </div>

      <p className="text-white text-lg wrap-break-word">
        {value}
      </p>

    </div>
  );
}

function Activity({ icon, title, date }) {
  return (
    <div className="bg-[#111827] rounded-2xl p-5 flex justify-between items-center hover:bg-[#1a2332] transition">

      <div className="flex items-center gap-4">

        <div className="bg-orange-500 w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg">
          {icon}
        </div>

        <div>

          <h3 className="text-white font-semibold">
            {title}
          </h3>

          <p className="text-gray-400 text-sm">
            {date}
          </p>

        </div>

      </div>

    </div>
  );
}