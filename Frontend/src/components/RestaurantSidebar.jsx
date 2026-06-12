import React from "react";
import { NavLink } from "react-router-dom";

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
      {isOpen && (
        <div
          className="
            fixed
            inset-0
            bg-black/50
            z-40
            md:hidden
          "
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`
          hidden md:flex
          fixed
          top-16
          left-0
          w-64
          h-[calc(100vh-64px)]
          bg-[#1F2937]
          border-r
          border-gray-800
          flex-col

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
        <div className="p-4 space-y-2">

          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `
                block
                px-4
                py-4
                rounded-xl
                transition

                ${
                  isActive
                    ? "bg-orange-500 text-white font-semibold"
                    : "hover:bg-[#374151]"
                }
              `
              }
            >
              {item.title}
            </NavLink>
          ))}

        </div>
      </aside>
    </>
  );
}