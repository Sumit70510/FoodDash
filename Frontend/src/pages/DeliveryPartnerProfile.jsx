import React, { useState } from "react";
import {
  FaEnvelope,
  FaIdCard,
  FaMotorcycle,
  FaPhoneAlt,
  FaSave,
  FaShieldAlt,
  FaTruck,
  FaUser,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import api from "../utils/axios.js";

// Import your actual Redux update action.
// import { setAuthUser } from "../redux/auth.Slice.js";

export default function DeliveryPartnerProfile() {
  const dispatch = useDispatch();

  const { user, type } = useSelector(
    (state) => state.auth
  );

  const deliveryPartner = user || {};

  const [formData, setFormData] =
    useState({
      name: deliveryPartner.name || "",
      email: deliveryPartner.email || "",
      contactNo:
        deliveryPartner.contactNo || "",
      vehicleType:
        deliveryPartner.vehicleType || "",
      vehicleNo:
        deliveryPartner.vehicleNo || "",
      licenseNo:
        deliveryPartner.licenseNo || "",
    });

  const [saving, setSaving] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.contactNo.trim()
    ) {
      toast.error(
        "Name and contact number are required"
      );
      return;
    }

    try {
      setSaving(true);

      const response = await api.patch(
        "/deliveryPartner/profile",
        {
          name: formData.name.trim(),
          contactNo:
            formData.contactNo.trim(),
          vehicleType:
            formData.vehicleType,
          vehicleNo:
            formData.vehicleNo.trim(),
        }
      );

      if (response.data?.success) {
        const updatedPartner =
          response.data.deliveryPartner ||
          response.data.user;

        /*
         * Update Redux using your actual auth action.
         *
         * dispatch(
         *   setAuthUser({
         *     user: updatedPartner,
         *     type,
         *   })
         * );
         */

        toast.success(
          "Profile updated successfully"
        );
      } else {
        toast.error(
          response.data?.message ||
            "Unable to update profile"
        );
      }
    } catch (error) {
      console.error(
        "Delivery profile update error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            Account Settings
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Delivery Partner Profile
          </h1>

          <p className="mt-2 text-gray-400">
            Review and update your delivery
            partner information.
          </p>
        </div>

        {/* Verification */}

        <section className="mb-6 rounded-3xl border border-gray-800 bg-[#1F2937] p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400">
                <FaShieldAlt />
              </div>

              <div>
                <p className="text-sm text-gray-400">
                  Verification Status
                </p>

                <p className="mt-1 font-bold text-white">
                  {deliveryPartner.verificationStatus ||
                    "Pending"}
                </p>
              </div>
            </div>

            <VerificationBadge
              status={
                deliveryPartner.verificationStatus ||
                "Pending"
              }
            />
          </div>
        </section>

        {/* Profile Form */}

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-gray-800 bg-[#1F2937] p-5 md:p-7"
        >
          <h2 className="text-2xl font-bold text-white">
            Personal Information
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <ProfileInput
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              icon={<FaUser />}
              required
            />

            <ProfileInput
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              icon={<FaEnvelope />}
              disabled
            />

            <ProfileInput
              label="Contact Number"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              icon={<FaPhoneAlt />}
              required
            />

            <ProfileInput
              label="License Number"
              name="licenseNo"
              value={formData.licenseNo}
              onChange={handleChange}
              icon={<FaIdCard />}
              disabled
            />
          </div>

          <h2 className="mt-10 text-2xl font-bold text-white">
            Vehicle Information
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="vehicleType"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Vehicle Type
              </label>

              <div className="relative">
                <FaMotorcycle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-gray-700 bg-[#111827] py-3 pl-11 pr-4 text-white outline-none transition focus:border-orange-500"
                >
                  <option value="">
                    Select vehicle
                  </option>

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
            </div>

            <ProfileInput
              label="Vehicle Number"
              name="vehicleNo"
              value={formData.vehicleNo}
              onChange={handleChange}
              icon={<FaTruck />}
            />
          </div>

          {/* Read-only Account Details */}

          <div className="mt-8 rounded-2xl bg-[#111827] p-5">
            <h3 className="font-bold text-white">
              Protected Information
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Email, license number and identity
              information cannot be changed
              directly because they are used for
              account verification.
            </p>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <FaSave />

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProfileInput({
  label,
  icon,
  disabled = false,
  ...props
}) {
  return (
    <div>
      <label
        htmlFor={props.name}
        className="mb-2 block text-sm font-medium text-gray-300"
      >
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
          {icon}
        </span>

        <input
          id={props.name}
          disabled={disabled}
          {...props}
          className={`
            w-full
            rounded-xl
            border
            border-gray-700
            bg-[#111827]
            py-3
            pl-11
            pr-4
            text-white
            outline-none
            transition
            placeholder:text-gray-500
            focus:border-orange-500
            ${
              disabled
                ? "cursor-not-allowed opacity-60"
                : ""
            }
          `}
        />
      </div>
    </div>
  );
}

function VerificationBadge({ status }) {
  const statusClasses = {
    Verified:
      "bg-green-500/20 text-green-400",
    Pending:
      "bg-yellow-500/20 text-yellow-400",
    Rejected:
      "bg-red-500/20 text-red-400",
  };

  return (
    <span
      className={`
        rounded-full
        px-4
        py-2
        text-sm
        font-semibold
        ${
          statusClasses[status] ||
          "bg-gray-500/20 text-gray-400"
        }
      `}
    >
      {status}
    </span>
  );
}