import React from "react";
import { Link } from "react-router-dom";

export default function RoleCard({
  icon,
  title,
  description,
  loginLink,
  signupLink,
}) {
  return (
    <div
      className="
        bg-white
        rounded-3xl
        p-8
        shadow-xl
        hover:-translate-y-2
        hover:shadow-2xl
        transition-all
        duration-300
        flex flex-col
        items-center
        text-center
      "
    >
      <div className="text-6xl">
        {icon}
      </div>

      <h2 className="text-2xl font-bold mt-4 text-gray-800">
        {title}
      </h2>

      <p className="text-gray-600 mt-3">
        {description}
      </p>

      <div className="flex gap-3 mt-6">
        <Link
          to={loginLink}
          className="
            px-5 py-2
            bg-orange-500
            text-white
            rounded-xl
            hover:bg-orange-600
          "
        >
          Login
        </Link>

        <Link
          to={signupLink}
          className="
            px-5 py-2
            border border-orange-500
            text-orange-500
            rounded-xl
            hover:bg-orange-50
          "
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}