import React, { useState } from "react";
import {
  Bike,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
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
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState(INITIAL_FORM_DATA);

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const changeEventHandler = (event) => {
    const {
      name,
      value,
    } = event.target;

    let formattedValue = value;

    if (
      name === "contactNo" ||
      name === "aadharNo"
    ) {
      formattedValue = value
        .replace(/\D/g, "")
        .slice(
          0,
          name === "contactNo"
            ? 10
            : 12
        );
    }

    if (
      name === "vehicleNo" ||
      name === "licenseNo"
    ) {
      formattedValue = value
        .toUpperCase()
        .replace(/\s+/g, "");
    }

    setFormData(
      (previousData) => ({
        ...previousData,
        [name]: formattedValue,
      })
    );
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
      toast.error(
        "Please fill all required fields."
      );

      return false;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(
        email.trim()
      )
    ) {
      toast.error(
        "Please enter a valid email address."
      );

      return false;
    }

    if (
      !/^[6-9]\d{9}$/.test(
        contactNo
      )
    ) {
      toast.error(
        "Please enter a valid 10-digit Indian mobile number."
      );

      return false;
    }

    if (
      !/^\d{12}$/.test(aadharNo)
    ) {
      toast.error(
        "Aadhaar number must contain exactly 12 digits."
      );

      return false;
    }

    if (password.length < 8) {
      toast.error(
        "Password must contain at least 8 characters."
      );

      return false;
    }

    if (
      password !== confirmPassword
    ) {
      toast.error(
        "Passwords do not match."
      );

      return false;
    }

    if (
      licenseNo.trim().length < 5
    ) {
      toast.error(
        "Please enter a valid driving licence number."
      );

      return false;
    }

    /*
     * A bicycle may not have a registration number.
     * Your current backend model previously marked
     * vehicleNo as required, so this validation keeps
     * it required for every vehicle type.
     */
    if (
      vehicleNo.trim().length < 4
    ) {
      toast.error(
        "Please enter a valid vehicle number."
      );

      return false;
    }

    const allowedVehicleTypes = [
      "Bike",
      "Scooter",
      "Cycle",
      "Car",
    ];

    if (
      !allowedVehicleTypes.includes(
        vehicleType
      )
    ) {
      toast.error(
        "Please select a valid vehicle type."
      );

      return false;
    }

    return true;
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (
      !validateForm() ||
      loading
    ) {
      return;
    }

    try {
      setLoading(true);

      /*
       * This payload matches the delivery-partner model
       * naming you shared earlier.
       *
       * The Aadhaar field is sent as AADHAR because your
       * model used that exact uppercase field name.
       */
      const payload = {
        name: formData.name.trim(),

        email: formData.email
          .trim()
          .toLowerCase(),

        password: formData.password,

        contactNo:
          formData.contactNo,

        licenseNo:
          formData.licenseNo
            .trim()
            .toUpperCase(),

        vehicleType:
          formData.vehicleType,

        vehicleNo:
          formData.vehicleNo
            .trim()
            .toUpperCase(),

        AADHAR:
          formData.aadharNo,
      };

      const response = await api.post(
        "/deliveryPartner/register",
        payload
      );

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Registration failed."
        );

        return;
      }

      toast.success(
        response.data?.message ||
          "Delivery partner registered successfully."
      );

      setFormData(
        INITIAL_FORM_DATA
      );

      setShowPassword(false);
      setShowConfirmPassword(false);

      navigate("/delivery/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Delivery partner registration error:",
        error
      );

      const errorData =
        error?.response?.data;

      if (
        errorData?.errors &&
        Array.isArray(
          errorData.errors
        )
      ) {
        toast.error(
          errorData.errors
            .map(
              (validationError) =>
                validationError.message ||
                validationError.msg
            )
            .filter(Boolean)
            .join(", ")
        );

        return;
      }

      toast.error(
        errorData?.message ||
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
    py-3
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
      className="
        flex
        min-h-screen
        items-center
        justify-center
        px-4
        py-8
        sm:px-5
      "
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
          linear-gradient(
            135deg,
            #1F2937,
            #111827
          )
        `,
      }}
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="
          w-full
          max-w-3xl
          space-y-6
          rounded-2xl
          bg-white
          p-5
          shadow-2xl
          sm:p-8
        "
      >
        <div className="text-center">
          <div
            className="
              mx-auto
              mb-4
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-orange-500
              text-white
              shadow-lg
              shadow-orange-500/20
            "
          >
            <UserPlus className="h-7 w-7" />
          </div>

          <h1
            className="
              text-2xl
              font-bold
              text-gray-800
              sm:text-3xl
            "
          >
            Join as Delivery Partner
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-gray-600
              sm:text-base
            "
          >
            Register to start accepting
            deliveries with FoodDash
          </p>
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
          "
        >
          <FormField
            label="Full Name"
            required
          >
            <input
              id="delivery-name"
              type="text"
              name="name"
              value={formData.name}
              disabled={loading}
              onChange={
                changeEventHandler
              }
              placeholder="Your full name"
              autoComplete="name"
              className={
                inputClassName
              }
            />
          </FormField>

          <FormField
            label="Email"
            required
          >
            <input
              id="delivery-signup-email"
              type="email"
              name="email"
              value={formData.email}
              disabled={loading}
              onChange={
                changeEventHandler
              }
              placeholder="your@email.com"
              autoComplete="email"
              className={
                inputClassName
              }
            />
          </FormField>

          <FormField
            label="Password"
            required
          >
            <div className="relative">
              <input
                id="delivery-signup-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={
                  formData.password
                }
                disabled={loading}
                onChange={
                  changeEventHandler
                }
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                className={`${inputClassName} pr-12`}
              />

              <PasswordToggle
                visible={showPassword}
                disabled={loading}
                onClick={() =>
                  setShowPassword(
                    (previousValue) =>
                      !previousValue
                  )
                }
              />
            </div>
          </FormField>

          <FormField
            label="Confirm Password"
            required
          >
            <div className="relative">
              <input
                id="delivery-confirm-password"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                value={
                  formData.confirmPassword
                }
                disabled={loading}
                onChange={
                  changeEventHandler
                }
                placeholder="Re-enter password"
                autoComplete="new-password"
                className={`${inputClassName} pr-12`}
              />

              <PasswordToggle
                visible={
                  showConfirmPassword
                }
                disabled={loading}
                onClick={() =>
                  setShowConfirmPassword(
                    (previousValue) =>
                      !previousValue
                  )
                }
              />
            </div>
          </FormField>

          <FormField
            label="Phone Number"
            required
          >
            <input
              id="delivery-contact"
              type="tel"
              name="contactNo"
              value={formData.contactNo}
              disabled={loading}
              onChange={
                changeEventHandler
              }
              placeholder="10-digit mobile number"
              maxLength={10}
              inputMode="numeric"
              autoComplete="tel"
              className={
                inputClassName
              }
            />
          </FormField>

          <FormField
            label="Aadhaar Number"
            required
          >
            <input
              id="delivery-aadhaar"
              type="text"
              name="aadharNo"
              value={formData.aadharNo}
              disabled={loading}
              onChange={
                changeEventHandler
              }
              placeholder="12-digit Aadhaar number"
              maxLength={12}
              inputMode="numeric"
              autoComplete="off"
              className={
                inputClassName
              }
            />
          </FormField>

          <FormField
            label="Licence Number"
            required
          >
            <input
              id="delivery-licence"
              type="text"
              name="licenseNo"
              value={formData.licenseNo}
              disabled={loading}
              onChange={
                changeEventHandler
              }
              placeholder="Driving licence number"
              maxLength={25}
              autoComplete="off"
              className={
                inputClassName
              }
            />
          </FormField>

          <FormField
            label="Vehicle Type"
            required
          >
            <div className="relative">
              <Bike
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  h-5
                  w-5
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <select
                id="delivery-vehicle-type"
                name="vehicleType"
                value={
                  formData.vehicleType
                }
                disabled={loading}
                onChange={
                  changeEventHandler
                }
                className={`${inputClassName} pl-12`}
              >
                <option value="Bike">
                  Bike
                </option>

                <option value="Scooter">
                  Scooter
                </option>

                <option value="Cycle">
                  Cycle
                </option>

                <option value="Car">
                  Car
                </option>
              </select>
            </div>
          </FormField>

          <div className="md:col-span-2">
            <FormField
              label="Vehicle Number"
              required
            >
              <input
                id="delivery-vehicle-number"
                type="text"
                name="vehicleNo"
                value={
                  formData.vehicleNo
                }
                disabled={loading}
                onChange={
                  changeEventHandler
                }
                placeholder="Example: HR26AB1234"
                maxLength={15}
                autoComplete="off"
                className={
                  inputClassName
                }
              />
            </FormField>
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
            gap-2
            rounded-xl
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
          {loading && (
            <Loader2 className="h-5 w-5 animate-spin" />
          )}

          {loading
            ? "Registering..."
            : "Register as Delivery Partner"}
        </button>

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{" "}

            <Link
              to="/delivery/login"
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
        </div>
      </form>
    </div>
  );
}

function FormField({
  label,
  required = false,
  children,
}) {
  return (
    <div>
      <label
        className="
          mb-2
          block
          font-semibold
          text-gray-700
        "
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

function PasswordToggle({
  visible,
  disabled,
  onClick,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="
        absolute
        right-3
        top-1/2
        -translate-y-1/2
        text-gray-500
        transition
        hover:text-gray-700
        disabled:cursor-not-allowed
      "
      aria-label={
        visible
          ? "Hide password"
          : "Show password"
      }
    >
      {visible ? (
        <EyeOff className="h-5 w-5" />
      ) : (
        <Eye className="h-5 w-5" />
      )}
    </button>
  );
}