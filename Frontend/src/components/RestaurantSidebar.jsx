import React from "react";
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

export default function RestaurantSidebar({
  isOpen,
  closeSidebar,
}) {
  const menu = [
    {
      title: "Dashboard",
      path: "/restaurant/dashboard",
    },
    {
      title: "Menu",
      path: "/restaurant/menu",
    },
    {
      title: "Categories",
      path: "/restaurant/categories",
    },
    {
      title: "Orders",
      path: "/restaurant/orders",
    },
    {
      title: "Deliveries",
      path: "/restaurant/deliveries",
    },
    {
      title: "Profile",
      path: "/restaurant/profile",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="
            fixed inset-0
            bg-black/50
            z-40
            md:hidden
          "
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          top-16
          left-0
          z-50

          w-64
          h-[calc(100vh-64px)]

          bg-[#1F2937]
          border-r border-gray-800

          flex flex-col

          transform
          transition-transform
          duration-300

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          md:translate-x-0
        `}
      >
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="font-semibold text-lg">
            FoodDash
          </h2>

          <button
            onClick={closeSidebar}
            className="text-gray-300 hover:text-white"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Menu */}
        <div className="p-4 space-y-2 flex-1 overflow-y-auto">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `
                  block
                  px-4
                  py-3
                  rounded-xl
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? "bg-orange-500 text-white font-semibold shadow-md"
                      : "text-gray-300 hover:bg-[#374151] hover:text-white"
                  }
                `
              }
            >
              {item.title}
            </NavLink>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 text-xs text-gray-400">
          FoodDash Restaurant Panel
        </div>
      </aside>
    </>
  );
}