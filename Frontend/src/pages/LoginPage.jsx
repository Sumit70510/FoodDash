import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../api/axios.js";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [forceLogin,setForceLogin] = useState(false);
   const changeEventHandler = (e) => {
    
    const { name, value, type, checked } = e.target;    
    setCredentials({...credentials, [name]: type === "checkbox" ? checked : value,});
    
   };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/user/login", credentials);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("role", "customer");
        toast.success("Login successful");
        navigate("/");
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

        {/* Email Input */}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={changeEventHandler}
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

        {/* Password */}

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            {/* <button
              type="button"
              className="
                text-sm
                text-orange-500
                hover:text-orange-600
                hover:underline
              "
            >
              Forgot Password?
            </button> */}
          </div>

          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            value={credentials.password}
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

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            id="remember"
            name="rememberMe"
            value={credentials.rememberMe}
            onChange={changeEventHandler}
            className="accent-orange-500"
          />

          <label htmlFor="remember">
            Remember me
          </label>
        </div>


        <button
           type="submit"
           disabled={loading}
           className={`
            w-full
            py-3
            rounded-xl
          text-white
            font-semibold
            transition-all
            duration-200
            flex items-center
            justify-center
            gap-3
           ${loading ? "bg-orange-400 cursor-not-allowed"
             : forceLogin ? "bg-gray-800 hover:bg-black hover:-translate-y-0.5 hover:shadow-lg"
             : "bg-orange-500 hover:bg-orange-600 hover:-translate-y-0.5 hover:shadow-lg"
            } `} >
            
              {loading && (
                <span className="
                    inline-block
                    w-4 h-4
                    border-2
                  border-white/30
                  border-t-white
                    rounded-full
                    animate-spin "/>)
              }
             {loading ? "Please Wait..." : forceLogin ? "Continue" : "Login"}
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