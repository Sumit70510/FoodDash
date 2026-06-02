import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-white">

      <div
        className="
          max-w-7xl
          mx-auto
          px-8
          py-14
          grid
          md:grid-cols-4
          gap-10
        "
      >
        <div>
          <h2 className="text-3xl font-bold text-orange-500">
            FoodDash
          </h2>

          <p className="mt-4 text-gray-400">
            Fast delivery, great restaurants,
            and amazing food experiences.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">
            Customer
          </h3>

          <div className="flex flex-col gap-2 text-gray-400">
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">
            Restaurant Partner
          </h3>

          <div className="flex flex-col gap-2 text-gray-400">
            <Link to="/restaurant/login">
              Login
            </Link>

            <Link to="/restaurant/signup">
              Signup
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">
            Delivery Partner
          </h3>

          <div className="flex flex-col gap-2 text-gray-400">
            <Link to="/delivery/login">
              Login
            </Link>

            <Link to="/delivery/signup">
              Signup
            </Link>
          </div>
        </div>
      </div>

      <div
        className="
          border-t
          border-gray-800
          py-4
          text-center
          text-gray-500
        "
      >
        © 2026 FoodDash. All rights reserved.
      </div>
    </footer>
  );
}