import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../api/axios.js";

export default function DeliveryLoginPage() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/deliveryPartner/login", credentials);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("role", "delivery");
        toast.success("Login successful");
        navigate("/delivery/dashboard");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
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
        onSubmit={handleSubmit}
        className="
          w-full
          max-w-md
          bg-white
          rounded-2xl
          shadow-2xl
          p-8
          space-y-6
        "
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Delivery Partner Login
          </h1>
          <p className="text-gray-600">Start earning with FoodDash</p>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="
              w-full
              px-4 py-3
              border border-gray-300
              rounded-lg
              focus:outline-none
              focus:border-orange-500
              focus:ring-2
              focus:ring-orange-200
            "
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="
              w-full
              px-4 py-3
              border border-gray-300
              rounded-lg
              focus:outline-none
              focus:border-orange-500
              focus:ring-2
              focus:ring-orange-200
            "
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            py-3
            bg-orange-500
            text-white
            rounded-lg
            font-semibold
            hover:bg-orange-600
            transition
            disabled:opacity-50
          "
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/delivery/signup"
              className="text-orange-500 font-semibold hover:text-orange-600"
            >
              Sign Up
            </Link>
          </p>
        </div>

        <div className="text-center border-t pt-6">
          <Link to="/login" className="text-gray-500 hover:text-gray-700">
            ← Back to Customer Login
          </Link>
        </div>
      </form>
    </div>
  );
}
