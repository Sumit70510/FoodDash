import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      className="
        sticky top-0 z-50
        flex items-center justify-between
        min-h-[10vh]
        px-6 md:px-10
        border-b border-white/10
        backdrop-blur-md
      "
      style={{
        background: `
          radial-gradient(circle at top left,
          rgba(249,115,22,0.08), transparent 30%),

          linear-gradient(135deg, #1F2937, #111827)
        `,
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-3"
      >
        <div
          className="
            w-10 h-10
            rounded-full
            bg-orange-500
            text-white
            flex items-center justify-center
            font-bold text-xl
            shadow-lg
          "
        >
          ƒ
        </div>

        <h1 className="text-white text-2xl md:text-3xl font-bold">
          FoodDash
        </h1>
      </Link>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="
            px-5 py-2
            rounded-full
            text-white
            border border-white/20
            hover:border-orange-400
            hover:bg-white/5
            transition-all duration-200
          "
        >
          Login
        </Link>

        <Link
          to="/signup"
          className="
            px-5 py-2
            rounded-full
            bg-orange-500
            text-white
            font-medium
            hover:bg-orange-600
            hover:shadow-lg
            hover:-translate-y-0.5
            transition-all duration-200
          "
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}