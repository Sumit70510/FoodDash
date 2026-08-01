import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  LogIn,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

import api from "../utils/axios.js";
import {
  setAuthUser,
} from "../redux/auth.Slice.js";

const INITIAL_CREDENTIALS = {
  email: "",
  password: "",
  rememberMe: false,
  force: false,
};

export default function DeliveryLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [credentials, setCredentials] =
    useState(INITIAL_CREDENTIALS);

  const [loading, setLoading] =
    useState(false);

  const [forceLoginRequired, setForceLoginRequired] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const changeEventHandler = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setCredentials((previousCredentials) => ({
      ...previousCredentials,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const validateForm = () => {
    const email =
      credentials.email.trim();

    if (!email || !credentials.password) {
      toast.error(
        "Please enter your email and password."
      );

      return false;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      toast.error(
        "Please enter a valid email address."
      );

      return false;
    }

    return true;
  };

  const loginHandler = async (event) => {
    event.preventDefault();

    if (!validateForm() || loading) {
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/deliveryPartner/login",
        {
          email: credentials.email
            .trim()
            .toLowerCase(),

          password: credentials.password,

          force:
            forceLoginRequired ||
            credentials.force,
        }
      );

      /*
       * Some backends return force-login confirmation
       * using HTTP 200 instead of an error response.
       */
      if (
        response.data?.requireConfirmation
      ) {
        setForceLoginRequired(true);

        setCredentials(
          (previousCredentials) => ({
            ...previousCredentials,
            force: true,
          })
        );

        toast.warning(
          response.data?.message ||
            "Another active session exists. Click Continue to close it and log in."
        );

        return;
      }

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Login failed."
        );

        return;
      }

      /*
       * Support the most common response field names.
       */
      const deliveryPartner =
        response.data?.deliveryPartner ||
        response.data?.user ||
        response.data?.partner;

      if (!deliveryPartner) {
        toast.error(
          "Login succeeded, but delivery partner data was not returned."
        );

        return;
      }

      /*
       * Your ProtectedRoute expects the exact type:
       * "delivery"
       */
      dispatch(
        setAuthUser({
          user: deliveryPartner,
          type: "delivery",
        })
      );

      if (credentials.rememberMe) {
        localStorage.setItem(
          "foodDashAuthType",
          "delivery"
        );
      } else {
        localStorage.removeItem(
          "foodDashAuthType"
        );
      }

      toast.success(
        response.data?.message ||
          "Login successful."
      );

      setCredentials(
        INITIAL_CREDENTIALS
      );

      setForceLoginRequired(false);

      /*
       * Return to the requested delivery page when
       * ProtectedRoute redirected the user to login.
       */
      const redirectPath =
        location.state?.from;

      const safeRedirect =
        typeof redirectPath === "string" &&
        redirectPath.startsWith(
          "/delivery/"
        )
          ? redirectPath
          : "/delivery/dashboard";

      navigate(safeRedirect, {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Delivery partner login error:",
        error
      );

      const errorData =
        error?.response?.data;

      if (
        errorData?.requireConfirmation
      ) {
        setForceLoginRequired(true);

        setCredentials(
          (previousCredentials) => ({
            ...previousCredentials,
            force: true,
          })
        );

        toast.warning(
          errorData?.message ||
            "Another active session exists. Click Continue to close it and log in."
        );

        return;
      }

      toast.error(
        errorData?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelForceLogin = () => {
    setForceLoginRequired(false);

    setCredentials(
      (previousCredentials) => ({
        ...previousCredentials,
        force: false,
      })
    );
  };

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
        onSubmit={loginHandler}
        noValidate
        className="
          w-full
          max-w-md
          space-y-6
          rounded-2xl
          bg-white
          p-6
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
            <LogIn className="h-7 w-7" />
          </div>

          <h1
            className="
              text-2xl
              font-bold
              text-gray-800
              sm:text-3xl
            "
          >
            Delivery Partner Login
          </h1>

          <p className="mt-2 text-gray-600">
            Sign in to manage deliveries and
            earnings
          </p>
        </div>

        {forceLoginRequired && (
          <div
            className="
              rounded-xl
              border
              border-amber-300
              bg-amber-50
              p-4
            "
          >
            <h2
              className="
                font-semibold
                text-amber-800
              "
            >
              Active session found
            </h2>

            <p
              className="
                mt-1
                text-sm
                leading-6
                text-amber-700
              "
            >
              Another device is already logged
              in. Click Continue to close the old
              session and log in here.
            </p>

            <button
              type="button"
              onClick={cancelForceLogin}
              className="
                mt-3
                text-sm
                font-semibold
                text-amber-800
                hover:underline
              "
            >
              Cancel force login
            </button>
          </div>
        )}

        <div>
          <label
            htmlFor="delivery-email"
            className="
              mb-2
              block
              font-semibold
              text-gray-700
            "
          >
            Email
          </label>

          <input
            id="delivery-email"
            type="email"
            name="email"
            value={credentials.email}
            onChange={changeEventHandler}
            disabled={loading}
            placeholder="your@email.com"
            autoComplete="email"
            className="
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
            "
          />
        </div>

        <div>
          <label
            htmlFor="delivery-password"
            className="
              mb-2
              block
              font-semibold
              text-gray-700
            "
          >
            Password
          </label>

          <div className="relative">
            <input
              id="delivery-password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              value={credentials.password}
              onChange={changeEventHandler}
              disabled={loading}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                px-4
                py-3
                pr-12
                text-gray-900
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-orange-500
                focus:ring-2
                focus:ring-orange-500/20
                disabled:cursor-not-allowed
                disabled:bg-gray-100
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (previousValue) =>
                    !previousValue
                )
              }
              disabled={loading}
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
                showPassword
                  ? "Hide password"
                  : "Show password"
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

        <label
          className="
            flex
            cursor-pointer
            items-center
            gap-3
            text-sm
            text-gray-600
          "
        >
          <input
            type="checkbox"
            name="rememberMe"
            checked={
              credentials.rememberMe
            }
            onChange={changeEventHandler}
            disabled={loading}
            className="
              h-4
              w-4
              rounded
              border-gray-300
              accent-orange-500
            "
          />

          Remember me
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            py-3
            font-semibold
            text-white
            transition
            duration-200
            disabled:cursor-not-allowed
            disabled:opacity-60

            ${
              forceLoginRequired
                ? `
                  bg-gray-800
                  hover:bg-black
                `
                : `
                  bg-orange-500
                  hover:bg-orange-600
                `
            }
          `}
        >
          {loading && (
            <Loader2 className="h-5 w-5 animate-spin" />
          )}

          {loading
            ? "Please wait..."
            : forceLoginRequired
              ? "Continue Login"
              : "Login"}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}

            <Link
              to="/delivery/signup"
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
        </div>
      </form>
    </div>
  );
}