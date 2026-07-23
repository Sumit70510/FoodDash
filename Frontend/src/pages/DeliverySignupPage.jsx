import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import api from "../utils/axios.js";

const INITIAL_FORM_DATA = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  contactNo: "",
  licenseNo: "",
  vehicleType: "Bike",
  vehicleNo: "",
  aadharNo: "",
};

export default function DeliverySignupPage() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const changeEventHandler = (event) => {
    const { name, value } = event.target;

    let formattedValue = value;

    if (name === "contactNo" || name === "aadharNo") {
      formattedValue = value.replace(/\D/g, "");
    }

    if (name === "vehicleNo" || name === "licenseNo") {
      formattedValue = value.toUpperCase().replace(/\s+/g, "");
    }

    setFormData((previousData) => ({
      ...previousData,
      [name]: formattedValue,
    }));
  };

  const validateForm = () => {
    const {
      name,
      email,
      password,
      confirmPassword,
      contactNo,
      licenseNo,
      vehicleType,
      vehicleNo,
      aadharNo,
    } = formData;

    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword ||
      !contactNo ||
      !licenseNo.trim() ||
      !vehicleType ||
      !vehicleNo.trim() ||
      !aadharNo
    ) {
      toast.error("Please fill all required fields.");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(contactNo)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return false;
    }

    if (!/^\d{12}$/.test(aadharNo)) {
      toast.error("Aadhaar number must contain exactly 12 digits.");
      return false;
    }

    if (password.length < 8) {
      toast.error("Password must contain at least 8 characters.");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    if (licenseNo.trim().length < 5) {
      toast.error("Please enter a valid driving license number.");
      return false;
    }

    if (vehicleNo.trim().length < 6) {
      toast.error("Please enter a valid vehicle number.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm() || loading) {
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/deliveryPartner/register",
        {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          contactNo: formData.contactNo,
          licenseNo: formData.licenseNo.trim().toUpperCase(),
          vehicleType: formData.vehicleType,
          vehicleNo: formData.vehicleNo.trim().toUpperCase(),
          AADHAR: formData.aadharNo,
        }
      );

      if (response.data?.success) {
        toast.success(
          response.data.message || "Registered successfully."
        );

        setFormData(INITIAL_FORM_DATA);
        navigate("/delivery/login");
      } else {
        toast.error(
          response.data?.message || "Registration failed."
        );
      }
    } catch (error) {
      console.error("Delivery partner registration error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = `
    w-full
    rounded-lg
    border
    border-gray-300
    px-4
    py-2.5
    text-gray-900
    outline-none
    transition
    placeholder:text-gray-400
    focus:border-orange-500
    focus:ring-2
    focus:ring-orange-500/20
    disabled:cursor-not-allowed
    disabled:bg-gray-100
  `;

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-5"
      style={{
        background: `
          radial-gradient(
            circle at top left,
            rgba(249, 115, 22, 0.15),
            transparent 25%
          ),
          radial-gradient(
            circle at bottom right,
            rgba(251, 146, 60, 0.12),
            transparent 25%
          ),
          linear-gradient(135deg, #1F2937, #111827)
        `,
      }}
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="
          w-full
          max-w-2xl
          space-y-6
          rounded-2xl
          bg-white
          p-5
          shadow-2xl
          sm:p-8
        "
      >
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl">
            Join as Delivery Partner
          </h1>

          <p className="text-sm text-gray-600 sm:text-base">
            Start delivering orders and earning money
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block font-semibold text-gray-700"
            >
              Full Name *
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              disabled={loading}
              onChange={changeEventHandler}
              placeholder="Your full name"
              autoComplete="name"
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block font-semibold text-gray-700"
            >
              Email *
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              disabled={loading}
              onChange={changeEventHandler}
              placeholder="your@email.com"
              autoComplete="email"
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block font-semibold text-gray-700"
            >
              Password *
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                disabled={loading}
                onChange={changeEventHandler}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                className={`${inputClassName} pr-11`}
              />

              <button
                type="button"
                disabled={loading}
                onClick={() => setShowPassword((value) => !value)}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-gray-700
                  disabled:cursor-not-allowed
                "
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block font-semibold text-gray-700"
            >
              Confirm Password *
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                disabled={loading}
                onChange={changeEventHandler}
                placeholder="Re-enter password"
                autoComplete="new-password"
                className={`${inputClassName} pr-11`}
              />

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  setShowConfirmPassword((value) => !value)
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-gray-700
                  disabled:cursor-not-allowed
                "
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="contactNo"
              className="mb-2 block font-semibold text-gray-700"
            >
              Phone Number *
            </label>

            <input
              id="contactNo"
              type="tel"
              name="contactNo"
              value={formData.contactNo}
              disabled={loading}
              onChange={changeEventHandler}
              placeholder="10-digit mobile number"
              maxLength={10}
              inputMode="numeric"
              autoComplete="tel"
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="aadharNo"
              className="mb-2 block font-semibold text-gray-700"
            >
              Aadhaar Number *
            </label>

            <input
              id="aadharNo"
              type="text"
              name="aadharNo"
              value={formData.aadharNo}
              disabled={loading}
              onChange={changeEventHandler}
              placeholder="12-digit Aadhaar number"
              maxLength={12}
              inputMode="numeric"
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="licenseNo"
              className="mb-2 block font-semibold text-gray-700"
            >
              License Number *
            </label>

            <input
              id="licenseNo"
              type="text"
              name="licenseNo"
              value={formData.licenseNo}
              disabled={loading}
              onChange={changeEventHandler}
              placeholder="Driving license number"
              maxLength={25}
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="vehicleType"
              className="mb-2 block font-semibold text-gray-700"
            >
              Vehicle Type *
            </label>

            <select
              id="vehicleType"
              name="vehicleType"
              value={formData.vehicleType}
              disabled={loading}
              onChange={changeEventHandler}
              className={inputClassName}
            >
              <option value="Bike">Bike</option>
              <option value="Scooter">Scooter</option>
              <option value="Cycle">Cycle</option>
              <option value="Car">Car</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="vehicleNo"
              className="mb-2 block font-semibold text-gray-700"
            >
              Vehicle Number *
            </label>

            <input
              id="vehicleNo"
              type="text"
              name="vehicleNo"
              value={formData.vehicleNo}
              disabled={loading}
              onChange={changeEventHandler}
              placeholder="Example: HR26AB1234"
              maxLength={15}
              className={inputClassName}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="
            flex
            w-full
            items-center
            justify-center
            rounded-lg
            bg-orange-500
            py-3
            font-semibold
            text-white
            transition
            hover:bg-orange-600
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Registering...
            </>
          ) : (
            "Register as Delivery Partner"
          )}
        </button>

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/delivery/login"
              className="font-semibold text-orange-500 hover:text-orange-600"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}