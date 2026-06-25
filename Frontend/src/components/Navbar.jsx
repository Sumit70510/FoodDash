import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setAuthUser } from "../redux/auth.Slice.js";
import { toast } from "sonner";
import api from "../utils/axios.js";

export default function Navbar() {
  const { user, type } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const location = useLocation();

  const [cartCount, setCartCount] =
    useState(0);

  useEffect(() => {
    if (user) {
      fetchCartCount();
    }
  }, [user]);

  const fetchCartCount = async () => {
    try {
      const { data } = await api.get(
        "/cart/items"
      );

      if (
        data?.success &&
        data?.cart?.items
      ) {
        const totalItems =
          data.cart.items.reduce(
            (sum, item) =>
              sum + item.quantity,
            0
          );

        setCartCount(totalItems);
      }
    } catch (error) {
      console.log(
        "Cart Count Error:",
        error
      );
    }
  };

  const logoutHandler = async () => {
    try {
      const { data } =
        await api.post(
          `/${type}/logout`
        );

      if (data.success) {
        dispatch(
          setAuthUser({
            user: null,
            type: "",
          })
        );

        setCartCount(0);

        toast.success(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Logout failed"
      );
    }
  };

  return (
    <nav
      className="
        sticky top-0 z-50
        flex items-center justify-between
        min-h-[10vh]
        px-6 md:px-10
        border-b border-white/10
        backdrop-blur-md
      "
      style={{
        background: `
          radial-gradient(
            circle at top left,
            rgba(249,115,22,0.08),
            transparent 30%
          ),
          linear-gradient(
            135deg,
            #1F2937,
            #111827
          )
        `,
      }}
    >
      <Link
        to="/"
        className="flex items-center gap-3"
      >
        <div
          className="
            w-10 h-10
            rounded-full
            bg-orange-500
            text-white
            flex items-center
            justify-center
            font-bold text-xl
            shadow-lg
          "
        >
          ƒ
        </div>

        <h1 className="text-white text-2xl md:text-3xl font-bold">
          FoodDash
        </h1>
      </Link>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            {location.pathname ===
              "/cart" && (
              <Link
                to="/"
                className="
                  px-5 py-2
                  rounded-full
                  text-white
                  border border-white/20
                  hover:border-orange-400
                  hover:bg-white/5
                  transition-all
                "
              >
                🏠 Home
              </Link>
            )}

            <Link
              to="/cart"
              className={`
                relative
                px-5 py-2
                rounded-full
                text-white
                border
                transition-all

                ${
                  location.pathname ===
                  "/cart"
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-white/20 hover:border-orange-400 hover:bg-white/5"
                }
              `}
            >
              🛒 Cart

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -top-2
                    -right-2
                    min-w-5.5
                    h-5.5
                    px-1
                    rounded-full
                    bg-orange-500
                    text-white
                    text-xs
                    font-bold
                    flex
                    items-center
                    justify-center
                  "
                >
                  {cartCount}
                </span>
              )}
            </Link>

            <div
              className="
                w-10 h-10
                rounded-full
                bg-orange-500
                text-white
                flex
                items-center
                justify-center
                font-bold
                shadow-lg
              "
              title={
                user?.fullName ||
                user?.name
              }
            >
              {(
                user?.fullName?.[0] ||
                user?.name?.[0] ||
                "U"
              ).toUpperCase()}
            </div>

            <button
              onClick={logoutHandler}
              className="
                px-5 py-2
                rounded-full
                bg-red-500
                text-white
                font-medium
                hover:bg-red-600
                hover:shadow-lg
                transition-all
              "
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="
                px-5 py-2
                rounded-full
                text-white
                border border-white/20
                hover:border-orange-400
                hover:bg-white/5
                transition-all
              "
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="
                px-5 py-2
                rounded-full
                bg-orange-500
                text-white
                font-medium
                hover:bg-orange-600
                hover:shadow-lg
                hover:-translate-y-0.5
                transition-all
              "
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}