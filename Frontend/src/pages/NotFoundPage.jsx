import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div
        className="flex flex-col items-center justify-center min-h-[70vh] px-6"
        style={{
          background: `
            radial-gradient(circle at top left,
            rgba(249,115,22,0.1), transparent 30%),
            linear-gradient(135deg, #f3f4f6, #e5e7eb)
          `,
        }}
      >
        <div className="text-center">
          <h1 className="text-9xl font-bold text-orange-500 mb-4">404</h1>

          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Page Not Found
          </h2>

          <p className="text-xl text-gray-600 mb-8 max-w-md">
            Sorry, the page you're looking for doesn't exist. It might have been
            moved or deleted.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/"
              className="
                px-8 py-3
                bg-orange-500
                text-white
                rounded-lg
                font-semibold
                hover:bg-orange-600
                transition
              "
            >
              Go to Home
            </Link>

            <Link
              to="/restaurants"
              className="
                px-8 py-3
                border-2 border-orange-500
                text-orange-500
                rounded-lg
                font-semibold
                hover:bg-orange-50
                transition
              "
            >
              Browse Restaurants
            </Link>
          </div>
        </div>

        <div className="mt-12 w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-orange-500 hover:text-orange-600">
                → Home
              </Link>
              <Link
                to="/restaurants"
                className="block text-orange-500 hover:text-orange-600"
              >
                → Browse Restaurants
              </Link>
              <Link
                to="/orders"
                className="block text-orange-500 hover:text-orange-600"
              >
                → My Orders
              </Link>
              <Link to="/cart" className="block text-orange-500 hover:text-orange-600">
                → Cart
              </Link>
              <Link
                to="/profile"
                className="block text-orange-500 hover:text-orange-600"
              >
                → Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
