import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../api/axios.js";

export default function DeliverySignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    licenseNumber: "",
    vehicleType: "bike",
    vehicleNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/deliveryPartner/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        licenseNumber: formData.licenseNumber,
        vehicleType: formData.vehicleType,
        vehicleNumber: formData.vehicleNumber,
      });

      if (response.data.success) {
        toast.success("Registered successfully");
        navigate("/delivery/login");
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed");
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
          max-w-2xl
          bg-white
          rounded-2xl
          shadow-2xl
          p-8
          space-y-6
        "
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Join as Delivery Partner
          </h1>
          <p className="text-gray-600">Start delivering and earn money</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="
                w-full
                px-4 py-2
                border border-gray-300
                rounded-lg
                focus:outline-none
                focus:border-orange-500
              "
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="
                w-full
                px-4 py-2
                border border-gray-300
                rounded-lg
                focus:outline-none
                focus:border-orange-500
              "
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="
                w-full
                px-4 py-2
                border border-gray-300
                rounded-lg
                focus:outline-none
                focus:border-orange-500
              "
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="
                w-full
                px-4 py-2
                border border-gray-300
                rounded-lg
                focus:outline-none
                focus:border-orange-500
              "
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              className="
                w-full
                px-4 py-2
                border border-gray-300
                rounded-lg
                focus:outline-none
                focus:border-orange-500
              "
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              License Number
            </label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="Driver License"
              className="
                w-full
                px-4 py-2
                border border-gray-300
                rounded-lg
                focus:outline-none
                focus:border-orange-500
              "
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Vehicle Type
            </label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="
                w-full
                px-4 py-2
                border border-gray-300
                rounded-lg
                focus:outline-none
                focus:border-orange-500
              "
            >
              <option value="bike">Bike</option>
              <option value="scooter">Scooter</option>
              <option value="car">Car</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Vehicle Number
            </label>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              placeholder="Vehicle Registration"
              className="
                w-full
                px-4 py-2
                border border-gray-300
                rounded-lg
                focus:outline-none
                focus:border-orange-500
              "
            />
          </div>
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
          {loading ? "Registering..." : "Register as Delivery Partner"}
        </button>

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/delivery/login"
              className="text-orange-500 font-semibold hover:text-orange-600"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
