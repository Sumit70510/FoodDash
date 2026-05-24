import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between min-w-full min-h-[10vh] px-2"
      style={{background: "linear-gradient(to right, #141E30, #243B55)"}} >
      
      <div className="flex items-center gap-2">
        <h1 className="text-white text-4xl">
          FoodDash
        </h1>

        {/* <Link to="/" className="p-2 py-1 bg-white text-gray-800 rounded-md">
          Home
        </Link> */}
      </div>

      <div className="flex items-center gap-2">
        
        <Link to="/login" className="p-2 py-1 bg-white text-gray-800 rounded-md">
          Login
        </Link>

        <Link to="/signup" className="p-2 py-1 bg-white text-gray-800 rounded-md">
          Signup
        </Link>
      </div>
    </nav>
  );
}