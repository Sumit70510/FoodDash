import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
return ( <footer className="bg-black border-t border-orange-500/20"> <div
     className="
       max-w-7xl
       mx-auto
       px-6
       py-10
     "
   > <div
       className="
         grid
         grid-cols-1
         sm:grid-cols-2
         lg:grid-cols-4
         gap-8
       "
     >
{/* Brand */} <div className="lg:col-span-1"> <div className="flex items-center gap-3"> <div
             className="
               w-10 h-10
               rounded-full
               bg-orange-500
               flex
               items-center
               justify-center
               text-white
               font-bold
               text-lg
             "
           >
ƒ </div>
        <h2 className="text-2xl font-bold text-white">
            Food<span className="text-orange-500">Dash</span>
          </h2>
        </div>

        <p className="mt-4 text-sm text-gray-400 leading-relaxed">
          Fast delivery. Fresh food.
          Great restaurants at your fingertips.
        </p>
      </div>

      {/* Customer */}
      <div>
        <h3 className="text-white font-semibold mb-4">
          Customer
        </h3>

        <div className="flex flex-col gap-2 text-sm">
          <Link
            to="/login"
            className="text-gray-400 hover:text-orange-500 transition"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="text-gray-400 hover:text-orange-500 transition"
          >
            Sign Up
          </Link>

          <Link
            to="/cart"
            className="text-gray-400 hover:text-orange-500 transition"
          >
            Cart
          </Link>
        </div>
      </div>

      {/* Partners */}
      <div>
        <h3 className="text-white font-semibold mb-4">
          Partners
        </h3>

        <div className="flex flex-col gap-2 text-sm">
          <Link
            to="/restaurant/login"
            className="text-gray-400 hover:text-orange-500 transition"
          >
            Restaurant Login
          </Link>

          <Link
            to="/restaurant/signup"
            className="text-gray-400 hover:text-orange-500 transition"
          >
            Join as Restaurant
          </Link>

          <Link
            to="/delivery/signup"
            className="text-gray-400 hover:text-orange-500 transition"
          >
            Become a Delivery Partner
          </Link>
        </div>
      </div>

      {/* Support */}
      <div>
        <h3 className="text-white font-semibold mb-4">
          Support
        </h3>

        <div className="flex flex-col gap-2 text-sm">
          <Link
            to="/contact"
            className="text-gray-400 hover:text-orange-500 transition"
          >
            Contact Us
          </Link>

          <Link
            to="/privacy"
            className="text-gray-400 hover:text-orange-500 transition"
          >
            Privacy Policy
          </Link>

          <Link
            to="/terms"
            className="text-gray-400 hover:text-orange-500 transition"
          >
            Terms & Conditions
          </Link>
        </div>
      </div>
    </div>

    <div
      className="
        mt-8
        pt-6
        border-t
        border-gray-800
        flex
        flex-col
        md:flex-row
        items-center
        justify-between
        gap-4
      "
    >
      <p className="text-gray-500 text-sm text-center">
        © {new Date().getFullYear()} FoodDash. All rights reserved.
      </p>

      <div className="flex items-center gap-5">
        <button className="text-gray-400 hover:text-orange-500 transition text-lg">
          📘
        </button>

        <button className="text-gray-400 hover:text-orange-500 transition text-lg">
          📸
        </button>

        <button className="text-gray-400 hover:text-orange-500 transition text-lg">
          🐦
        </button>

        <button className="text-gray-400 hover:text-orange-500 transition text-lg">
          💼
        </button>
      </div>
    </div>
  </div>
</footer>

);
}
