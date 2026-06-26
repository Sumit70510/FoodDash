import React from "react";
import { useSelector } from "react-redux";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
  Package,
  Settings,
  Pencil,
  Star,
  ShoppingBag,
  CreditCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserProfilePage() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const stats = [
    {
      title: "Orders",
      value: "24",
      icon: Package,
      color: "bg-orange-500",
    },
    {
      title: "Wishlist",
      value: "18",
      icon: Heart,
      color: "bg-red-500",
    },
    {
      title: "Addresses",
      value: "3",
      icon: MapPin,
      color: "bg-blue-500",
    },
    {
      title: "Reviews",
      value: "11",
      icon: Star,
      color: "bg-green-500",
    },
  ];

  const quickActions = [
    {
      title: "My Orders",
      description: "Track previous orders",
      icon: Package,
      path: "/orders",
      color: "bg-orange-500",
    },
    {
      title: "Saved Addresses",
      description: "Manage delivery locations",
      icon: MapPin,
      path: "/profile/addresses",
      color: "bg-blue-500",
    },
    {
      title: "Wishlist",
      description: "Favourite restaurants",
      icon: Heart,
      path: "/profile/wishlist",
      color: "bg-red-500",
    },
    {
      title: "Payment Methods",
      description: "Cards & UPI",
      icon: CreditCard,
      path: "/payments",
      color: "bg-purple-500",
    },
    {
      title: "Settings",
      description: "Account preferences",
      icon: Settings,
      path: "/profile/settings",
      color: "bg-gray-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#111827] py-8 px-4 md:px-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold text-white mb-8">
          My Profile
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Section */}

          <div className="space-y-6">

            {/* Profile Card */}

            <div className="bg-[#1F2937] rounded-3xl p-8 border border-gray-700">

              <div className="flex flex-col items-center">

                <img
                  src={
                    user?.profileImage ||
                    "https://ui-avatars.com/api/?background=f97316&color=fff&name=" +
                      encodeURIComponent(user?.name || "User")
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
                  <Pencil size={18} />
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
                    className="bg-[#111827] rounded-2xl p-5 text-center"
                  >
                    <div
                      className={`${item.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}
                    >
                      <item.icon color="white" />
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

          {/* Right Section */}

          <div className="lg:col-span-2 space-y-6">

            {/* Personal Info */}

            <div className="bg-[#1F2937] rounded-3xl p-8 border border-gray-700">

              <h2 className="text-2xl text-white font-bold mb-8">
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">

                <InfoCard
                  icon={<User size={22} />}
                  label="Full Name"
                  value={user?.name || "Not Available"}
                />

                <InfoCard
                  icon={<Mail size={22} />}
                  label="Email"
                  value={user?.email || "Not Available"}
                />

                <InfoCard
                  icon={<Phone size={22} />}
                  label="Phone"
                  value={user?.phone || "Not Added"}
                />

                <InfoCard
                  icon={<Calendar size={22} />}
                  label="Joined"
                  value={
                    user?.createdAt
                      ? new Date(
                          user.createdAt
                        ).toLocaleDateString()
                      : "Recently"
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
                    className="bg-[#111827] rounded-2xl p-5 flex items-center gap-5 hover:bg-[#374151] transition text-left"
                  >

                    <div
                      className={`${action.color} w-14 h-14 rounded-xl flex items-center justify-center`}
                    >
                      <action.icon color="white" />
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

              <h2 className="text-2xl font-bold text-white mb-6">
                Recent Activity
              </h2>

              <div className="space-y-4">

                <Activity
                  icon={<ShoppingBag size={18} />}
                  title="Ordered Chicken Biryani"
                  date="2 hours ago"
                />

                <Activity
                  icon={<Heart size={18} />}
                  title="Added Domino's to wishlist"
                  date="Yesterday"
                />

                <Activity
                  icon={<MapPin size={18} />}
                  title="Added Home Address"
                  date="2 days ago"
                />

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-[#111827] rounded-2xl p-5">

      <div className="flex items-center gap-3 text-orange-400 mb-3">
        {icon}
        <span className="font-semibold">{label}</span>
      </div>

      <p className="text-white text-lg wrap-break-word">
        {value}
      </p>

    </div>
  );
}

function Activity({ icon, title, date }) {
  return (
    <div className="bg-[#111827] rounded-2xl p-5 flex justify-between items-center">

      <div className="flex items-center gap-4">

        <div className="bg-orange-500 p-3 rounded-xl text-white">
          {icon}
        </div>

        <div>

          <h3 className="text-white font-medium">
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