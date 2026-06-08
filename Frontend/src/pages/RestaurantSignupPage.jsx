import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../utils/axios.js";

export default function RestaurantSignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    email: "",
    password: "",
    restaurantContactNo: "",
    address: "",
    lat: "",
    lng: "",
    PAN: "",
    FSSAI: "",
    GST: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.ownerName || !formData.email || !formData.password
        || !formData.restaurantContactNo || !formData.address || !formData.PAN || !formData.FSSAI) 
    {
      toast.error("Please fill all required fields");
      return;
    }

    // if (formData.password !== formData.confirmPassword) {
    //   toast.error("Passwords don't match");
    //   return;
    // }

    try {
      setLoading(true);
      const response = await api.post("/restaurant/register", {
        name: formData.name,
        ownerName: formData.ownerName,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        restaurantContactNo : formData.restaurantContactNo,
        lat: parseFloat(formData.lat) || 0,
        lng: parseFloat(formData.lng) || 0,
        PAN: formData.PAN,
        FSSAI: formData.FSSAI,
        GST: formData.GST,
      });

      if (response.data.success) {
        toast.success("Restaurant registered successfully");
        navigate("/restaurant/login");
        setFormData({
          name: "",
          ownerName: "",
          email: "",
          password: "",
          restaurantContactNo: "",
          address: "",
          lat: "",
          lng: "",
          PAN: "",
          FSSAI: "",
          GST: "",
         });
       }
      else{
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
            Register Your Restaurant
          </h1>
          <p className="text-gray-600">Start selling food on FoodDash</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Restaurant Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={changeEventHandler}
              placeholder="Your Restaurant"
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
              Owner Name *
            </label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={changeEventHandler}
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
              onChange={changeEventHandler}
              placeholder="restaurant@example.com"
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
              onChange={changeEventHandler}
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
              Phone Number *
            </label>
          
            <input
              type="tel"
              name="restaurantContactNo"
              value={formData.restaurantContactNo}
              onChange={changeEventHandler}
              placeholder="10-digit mobile number"
              maxLength={10}
              pattern="[0-9]{10}"
              required
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
              Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={changeEventHandler}
              placeholder="Restaurant Address"
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
              FSSAI License *
            </label>
            <input
              type="text"
              name="FSSAI"
              value={formData.FSSAI}
              onChange={changeEventHandler}
              placeholder="FSSAI License Number"
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

          {/* <div>
            <label className="block text-gray-700 font-semibold mb-2">
              GST Number
            </label>
            <input
              type="text"
              name="GST"
              value={formData.GST}
              onChange={changeEventHandler}
              placeholder="GST Number"
              className="
                w-full
                px-4 py-2
                border border-gray-300
                rounded-lg
                focus:outline-none
                focus:border-orange-500
              "
            />
          </div> */}

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              PAN Number *
            </label>
            <input
              type="text"
              name="PAN"
              value={formData.PAN}
              onChange={changeEventHandler}
              placeholder="PAN Number"
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
          {loading ? "Registering..." : "Register Restaurant"}
        </button>

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/restaurant/login"
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
