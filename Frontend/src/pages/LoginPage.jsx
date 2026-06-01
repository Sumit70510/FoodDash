import React from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const loginHandler = (e) => {
    e.preventDefault();
    try{
       
      
     }
    catch(error)
     {
      
     }
    
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 py-8"
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
      <form
        onSubmit={loginHandler}
        className="
          w-full
          max-w-105
          bg-white
          rounded-[28px]
          shadow-[0_25px_70px_rgba(0,0,0,0.25)]
          p-8 px-6
          flex flex-col gap-5
        "
      >
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center gap-3">
            <div
              className="
                flex items-center justify-center
                w-12 h-12
                rounded-full
                bg-orange-500
                text-white
                text-2xl
                font-bold
                shadow-md
              "
            >
              ƒ
            </div>

            <h1 className="text-3xl font-bold text-gray-800">
              FoodDash
            </h1>
          </div>

          <p className="text-sm text-gray-500 mt-3 text-center">
            Login to continue ordering delicious food
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            className="
              w-full
              px-4 py-3
              border border-gray-300
              rounded-xl
              outline-none
              transition-all
              hover:border-orange-300
              focus:border-orange-500
              focus:ring-4
              focus:ring-orange-100
            "
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <button
              type="button"
              className="
                text-sm
                text-orange-500
                hover:text-orange-600
                hover:underline
              "
            >
              Forgot Password?
            </button>
          </div>

          <input
            type="password"
            placeholder="Enter your password"
            className="
              w-full
              px-4 py-3
              border border-gray-300
              rounded-xl
              outline-none
              transition-all
              hover:border-orange-300
              focus:border-orange-500
              focus:ring-4
              focus:ring-orange-100
            "
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            id="remember"
            className="accent-orange-500"
          />

          <label htmlFor="remember">
            Remember me
          </label>
        </div>

        <button
          type="submit"
          className="
            w-full
            py-3
            rounded-xl
            bg-orange-500
            text-white
            font-semibold
            transition-all
            duration-200
            hover:bg-orange-600
            hover:-translate-y-0.5
            hover:shadow-lg
          "
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="
              font-semibold
              text-orange-500
              hover:text-orange-600
              hover:underline
            "
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}