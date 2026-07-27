import React, { useState } from "react";
import {
  FaBars,
  FaChartLine,
  FaClipboardList,
  FaHistory,
  FaHome,
  FaMotorcycle,
  FaSignOutAlt,
  FaTimes,
  FaUser,
  FaWallet,
} from "react-icons/fa";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import api from "../utils/axios.js";

// Import your actual Redux logout action.
// import { clearAuthUser } from "../redux/auth.Slice.js";

const navigationItems = [
  {
    title: "Dashboard",
    path: "/delivery/dashboard",
    icon: FaHome,
  },
  {
    title: "Available Orders",
    path: "/delivery/orders",
    icon: FaClipboardList,
  },
  {
    title: "Active Delivery",
    path: "/delivery/active",
    icon: FaMotorcycle,
  },
  {
    title: "Delivery History",
    path: "/delivery/history",
    icon: FaHistory,
  },
  {
    title: "Earnings",
    path: "/delivery/earnings",
    icon: FaWallet,
  },
  {
    title: "Profile",
    path: "/delivery/profile",
    icon: FaUser,
  },
];

export default function DeliveryPartnerLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector(
    (state) => state.auth
  );

  const deliveryPartner = user || {};

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [logoutLoading, setLogoutLoading] =
    useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    if (logoutLoading) {
      return;
    }

    try {
      setLogoutLoading(true);

      const response = await api.post(
        "/deliveryPartner/logout"
      );

      if (response.data?.success) {
        localStorage.removeItem("token");

        // Uncomment your Redux logout action.
        // dispatch(clearAuthUser());

        toast.success(
          response.data?.message ||
            "Logged out successfully"
        );

        navigate("/delivery/login", {
          replace: true,
        });
      } else {
        toast.error(
          response.data?.message ||
            "Unable to logout"
        );
      }
    } catch (error) {
      console.error(
        "Delivery logout error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to logout"
      );
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111827]">
      {/* Mobile Header */}

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-800 bg-[#1F2937] px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
            <FaMotorcycle />
          </div>

          <div>
            <h1 className="font-bold text-white">
              FoodDash
            </h1>

            <p className="text-xs text-gray-400">
              Delivery Partner
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111827] text-white"
        >
          <FaBars />
        </button>
      </header>

      {/* Mobile Overlay */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-72
          flex-col
          border-r
          border-gray-800
          bg-[#1F2937]
          transition-transform
          duration-300
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Sidebar Header */}

        <div className="flex h-20 items-center justify-between border-b border-gray-800 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-xl text-white">
              <FaMotorcycle />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                FoodDash
              </h2>

              <p className="text-xs text-gray-400">
                Delivery Partner
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeSidebar}
            className="text-gray-400 hover:text-white lg:hidden"
          >
            <FaTimes />
          </button>
        </div>

        {/* User Card */}

        <div className="border-b border-gray-800 p-4">
          <div className="rounded-2xl bg-[#111827] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-500/20 font-bold text-orange-400">
                {getInitials(
                  deliveryPartner?.name
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate font-semibold text-white">
                  {deliveryPartner?.name ||
                    "Delivery Partner"}
                </p>

                <p className="truncate text-xs text-gray-400">
                  {deliveryPartner?.vehicleNo ||
                    "Vehicle not added"}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  deliveryPartner?.availabilityStatus ===
                  "Online"
                    ? "bg-green-500"
                    : deliveryPartner?.availabilityStatus ===
                      "Busy"
                    ? "bg-orange-500"
                    : "bg-red-500"
                }`}
              />

              <span className="text-xs font-medium text-gray-300">
                {deliveryPartner?.availabilityStatus ||
                  "Offline"}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    font-medium
                    transition
                    ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : "text-gray-400 hover:bg-[#111827] hover:text-white"
                    }
                  `
                }
              >
                <Icon className="text-lg" />
                {item.title}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}

        <div className="border-t border-gray-800 p-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutLoading}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-3
              rounded-xl
              border
              border-red-500/40
              bg-red-500/10
              px-4
              py-3
              font-semibold
              text-red-400
              transition
              hover:bg-red-500
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <FaSignOutAlt />

            {logoutLoading
              ? "Logging out..."
              : "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}

      <main className="min-h-screen lg:ml-72">
        <Outlet />
      </main>
    </div>
  );
}

function getInitials(name) {
  if (!name) {
    return "DP";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}