import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import RestaurantNavbar from "../components/RestaurantNavbar.jsx";
import RestaurantSidebar from "../components/RestaurantSidebar.jsx";
import Navbar from "../components/Navbar.jsx";

export default function RestaurantLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  
  return (
    <div className="h-screen overflow-hidden bg-[#111827] text-white">

      {/* Navbar */}
      <header className="h-16 fixed top-0 left-0 right-0 z-50">
        <RestaurantNavbar
          openSidebar={() => setSidebarOpen(true)}
        />
        {/* <Navbar/> */}
      </header>

      {/* Main Layout */}
      <div className="pt-16 h-full flex">

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <RestaurantSidebar />
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <RestaurantSidebar
            mobile
            isOpen={sidebarOpen}
            closeSidebar={() => setSidebarOpen(false)}
          />
        )}

        {/* Content */}
        <main
          className="
            flex-1
            h-[calc(100vh-64px)]
            overflow-y-auto
            scrollbar-hide
          "
        >
          <div className="min-h-full flex flex-col">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}