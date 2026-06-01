import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
     {/* Hero Section */}
      <section
        className="min-h-[90vh] flex flex-col items-center justify-center px-6"
        style={{
          background: `
            radial-gradient(circle at top left,
            rgba(249,115,22,0.15), transparent 25%),

            radial-gradient(circle at bottom right,
            rgba(251,146,60,0.12), transparent 25%),

            linear-gradient(135deg, #1F2937, #111827)
          `,
        }}
      >
        <h1 className="text-5xl md:text-6xl font-bold text-white text-center">
          Delicious Food,
          <span className="text-orange-500"> Delivered Fast</span>
        </h1>

        <p className="mt-5 text-lg text-gray-300 text-center max-w-2xl">
          Order food from your favourite restaurants, grow your business,
          or earn by delivering with FoodDash.
        </p>

        <div className="text-7xl mt-8">
          🍔 🍕 🌮 🍟 🥤
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 w-full max-w-6xl">
          
          {/* Customer */}
          <div
            className="
              bg-white
              rounded-3xl
              p-6
              shadow-xl
              flex flex-col
              items-center
              text-center
            "
          >
            <div className="text-6xl">🍔</div>

            <h2 className="text-2xl font-bold mt-4">
              Customer
            </h2>

            <p className="text-gray-600 mt-3">
              Browse restaurants, add items to cart,
              and get food delivered to your doorstep.
            </p>

            <div className="flex gap-3 mt-6">
              <Link
                to="/login"
                className="px-5 py-2 bg-orange-500 text-white rounded-xl"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-5 py-2 border border-orange-500 text-orange-500 rounded-xl"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Restaurant */}
          <div
            className="
              bg-white
              rounded-3xl
              p-6
              shadow-xl
              flex flex-col
              items-center
              text-center
            "
          >
            <div className="text-6xl">🏪</div>

            <h2 className="text-2xl font-bold mt-4">
              Restaurant Partner
            </h2>

            <p className="text-gray-600 mt-3">
              Reach thousands of customers and
              manage orders through FoodDash.
            </p>

            <div className="flex gap-3 mt-6">
              <Link
                to="/restaurant/login"
                className="px-5 py-2 bg-orange-500 text-white rounded-xl"
              >
                Login
              </Link>

              <Link
                to="/restaurant/signup"
                className="px-5 py-2 border border-orange-500 text-orange-500 rounded-xl"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Delivery */}
          <div
            className="
              bg-white
              rounded-3xl
              p-6
              shadow-xl
              flex flex-col
              items-center
              text-center
            "
          >
            <div className="text-6xl">🛵</div>

            <h2 className="text-2xl font-bold mt-4">
              Delivery Partner
            </h2>

            <p className="text-gray-600 mt-3">
              Earn money on your schedule by
              delivering orders in your city.
            </p>

            <div className="flex gap-3 mt-6">
              <Link
                to="/delivery/login"
                className="px-5 py-2 bg-orange-500 text-white rounded-xl"
              >
                Login
              </Link>

              <Link
                to="/delivery/signup"
                className="px-5 py-2 border border-orange-500 text-orange-500 rounded-xl"
              >
                Sign Up
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

      