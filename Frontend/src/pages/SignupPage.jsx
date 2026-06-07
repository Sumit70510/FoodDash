import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../api/axios.js";

export default function SignupPage() {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setPasswordsMatch(
      credentials.password === credentials.confirmPassword &&
        credentials.password.length > 0
    );
  }, [credentials.password, credentials.confirmPassword]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password || !credentials.name) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/user/register", {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
      });

      if (response.data.success) {
        toast.success("Account created successfully");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Signup failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
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
        onSubmit={signupHandler}
        className="
          w-full
          max-w-105
          bg-white
          rounded-[28px]
          shadow-[0_25px_70px_rgba(0,0,0,0.25)]
          p-8 px-6
          flex flex-col gap-4
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

          <p className="text-sm text-gray-500 mt-2 text-center">
            Create your account to get started
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your full name"
            name="name"
            value={credentials.name}
            onChange={changeEventHandler}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            value={credentials.email}
            onChange={changeEventHandler}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>

          <input
            type="password"
            placeholder="Create a password"
            name="password"
            value={credentials.password}
            onChange={changeEventHandler}
            className={`
              w-full
              px-4 py-3
              border 
              ${passwordsMatch ? 'border-gray-300' : 'border-red-500'}
              rounded-xl
              outline-none
              transition-all
              hover:border-orange-300
              focus:border-orange-500
              focus:ring-4
              focus:ring-orange-100
            `}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>

          <input
            type="password"
            placeholder="Confirm your password"
            name="confirmPassword"
            value={credentials.confirmPassword}
            onChange={changeEventHandler}
            className={`
              w-full
              px-4 py-3
              border
              ${passwordsMatch ? 'border-gray-300' : 'border-red-500'}
              rounded-xl
              outline-none
              transition-all
              hover:border-orange-300
              focus:border-orange-500
              focus:ring-4
              focus:ring-orange-100
            `}
          />
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
          Create Account
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="
              font-semibold
              text-orange-500
              hover:text-orange-600
              hover:underline
            "
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}