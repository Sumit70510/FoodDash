import React, { useState } from "react";
import {
  Bike,
  Contact,
  IdCard,
  LoaderCircle,
  Mail,
  Save,
  ShieldCheck,
  Truck,
  UserRound,
} from "lucide-react";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import { toast } from "sonner";

import api from "../utils/axios.js";
import {
  setAuthUser,
} from "../redux/auth.Slice.js";

export default function DeliveryPartnerProfile() {
  const dispatch = useDispatch();

  const { user } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] =
    useState({
      name: user?.name || "",
      email: user?.email || "",
      contactNo: user?.contactNo || "",
      licenseNo: user?.licenseNo || "",
      vehicleType:
        user?.vehicleType || "",
      vehicleNo: user?.vehicleNo || "",
      AADHAR:
        user?.AADHAR ||
        user?.aadharNo ||
        "",
    });

  const [saving, setSaving] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event
  ) => {
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

      const updatedPartner =
        response.data?.deliveryPartner ||
        response.data?.user ||
        {
          ...user,
          name: formData.name.trim(),
          contactNo:
            formData.contactNo.trim(),
          vehicleType:
            formData.vehicleType,
          vehicleNo:
            formData.vehicleNo.trim(),
        };

      dispatch(
        setAuthUser({
          user: updatedPartner,
          type: "delivery",
        })
      );

      toast.success(
        response.data?.message ||
          "Profile updated successfully"
      );
    } catch (error) {
      console.error(
        "Profile update error:",
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

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Delivery Partner Profile
          </h1>

          <p className="mt-2 text-slate-400">
            Review and update your account
            information.
          </p>
        </div>

        <section className="mb-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400">
                <ShieldCheck size={23} />
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Verification Status
                </p>

                <p className="mt-1 font-bold">
                  {user?.verificationStatus ||
                    "Pending"}
                </p>
              </div>
            </div>

            <VerificationBadge
              status={
                user?.verificationStatus ||
                "Pending"
              }
            />
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-800 bg-slate-900 p-5 md:p-7"
        >
          <h2 className="text-xl font-bold">
            Personal Information
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <ProfileInput
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              icon={UserRound}
              required
            />

            <ProfileInput
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              disabled
            />

            <ProfileInput
              label="Contact Number"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              icon={Contact}
              required
            />

            <ProfileInput
              label="License Number"
              name="licenseNo"
              value={formData.licenseNo}
              onChange={handleChange}
              icon={IdCard}
              disabled
            />

            <ProfileInput
              label="Aadhaar Number"
              name="AADHAR"
              value={formData.AADHAR}
              onChange={handleChange}
              icon={IdCard}
              disabled
            />
          </div>

          <h2 className="mt-10 text-xl font-bold">
            Vehicle Information
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="vehicleType"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Vehicle Type
              </label>

              <div className="relative">
                <Bike
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={
                    formData.vehicleType
                  }
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 outline-none focus:border-orange-500"
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
              icon={Truck}
            />
          </div>

          <div className="mt-8 rounded-2xl bg-slate-950 p-5">
            <h3 className="font-semibold">
              Protected information
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Email, licence number and
              identity details cannot be edited
              directly because they are used
              during account verification.
            </p>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {saving ? (
                <LoaderCircle
                  size={19}
                  className="animate-spin"
                />
              ) : (
                <Save size={19} />
              )}

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
  icon: Icon,
  disabled = false,
  ...props
}) {
  return (
    <div>
      <label
        htmlFor={props.name}
        className="mb-2 block text-sm font-medium text-slate-300"
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          id={props.name}
          disabled={disabled}
          {...props}
          className={`w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 outline-none placeholder:text-slate-500 focus:border-orange-500 ${
            disabled
              ? "cursor-not-allowed opacity-60"
              : ""
          }`}
        />
      </div>
    </div>
  );
}

function VerificationBadge({ status }) {
  const styles = {
    Verified:
      "bg-green-500/15 text-green-400",
    Pending:
      "bg-yellow-500/15 text-yellow-400",
    Rejected:
      "bg-red-500/15 text-red-400",
  };

  return (
    <span
      className={`rounded-full px-4 py-2 text-sm font-semibold ${
        styles[status] ||
        "bg-slate-800 text-slate-400"
      }`}
    >
      {status}
    </span>
  );
}