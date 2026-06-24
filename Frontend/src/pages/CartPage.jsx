import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import api from "../utils/axios.js";
import { toast } from "sonner";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const response = await api.get("/cart/items");

      if (response?.data?.success) {
        setCart(response?.data?.cart);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message||"Failed Loading Cart Items")
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (
    cartItemId,
    currentQuantity,
    operation
  ) => {
    try {
      setUpdatingItem(cartItemId);

      let quantity =
        operation === "inc"
          ? currentQuantity + 1
          : currentQuantity - 1;

      if (quantity < 1) return;

      await api.put(
        `/cart/update/${cartItemId}`,
        { quantity }
      );

      setCart((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item._id === cartItemId
            ? {
                ...item,
                quantity,
              }
            : item
        ),
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setUpdatingItem(null);
    }
  };

  const removeItem = async (
    cartItemId
  ) => {
    try {
      await api.delete(
        `/cart/remove/${cartItemId}`
      );

      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete(
        "/cart/clear"
      );

      setCart(null);
    } catch (error) {
      console.log(error);
    }
  };

  const subtotal = useMemo(() => {
    if (!cart?.items) return 0;

    return cart.items.reduce(
      (acc, item) =>
        acc +
        (item.discountPrice > 0
          ? item.discountPrice
          : item.price) *
          item.quantity,
      0
    );
  }, [cart]);

  const deliveryFee =
    subtotal > 0 ? 40 : 0;

  const tax = Math.round(
    subtotal * 0.05
  );

  const grandTotal =
    subtotal +
    deliveryFee +
    tax;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111827]">
        <Navbar />

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center text-white text-xl">
            Loading Cart...
          </div>
        </div>
      </div>
    );
  }

  if (
    !cart ||
    !cart.items ||
    cart.items.length === 0
  ) {
    return (
      <div className="min-h-screen bg-[#111827]">
        <Navbar />

        <div className="flex flex-col items-center justify-center py-28 px-6">
          <div className="text-8xl mb-6">
            🛒
          </div>

          <h1 className="text-4xl font-bold text-white">
            Your Cart is Empty
          </h1>

          <p className="text-gray-400 mt-4 text-center">
            Looks like you haven't
            added any delicious food
            yet.
          </p>

          <Link
            to="/"
            className="
              mt-8
              bg-orange-500
              hover:bg-orange-600
              px-8
              py-4
              rounded-2xl
              text-white
              font-semibold
              transition
            "
          >
            Explore Food
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111827]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white">
            Shopping Cart
          </h1>

          <p className="text-gray-400 mt-2">
            {cart.items.length} items
            in your cart
          </p>

          {cart.restaurantId && (
            <div className="mt-4 inline-flex items-center gap-2 bg-[#1F2937] px-4 py-2 rounded-full border border-gray-700">
              <span>🏪</span>

              <span className="text-gray-300">
                {
                  cart.restaurantId
                    .name
                }
              </span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-5">
            {cart.items.map((item) => {
              const menuItem =
                item.menuItemId;

              const image =
                menuItem?.image?.[0]
                  ?.url ||
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";

              const finalPrice =
                item.discountPrice >
                0
                  ? item.discountPrice
                  : item.price;

              return (
                <div
                  key={item._id}
                  className="
                    bg-[#1F2937]
                    border
                    border-gray-800
                    rounded-3xl
                    p-5
                    hover:border-orange-500
                    transition-all
                  "
                >
                  <div className="flex flex-col md:flex-row gap-5">
                    <img
                      src={image}
                      alt={
                        menuItem?.name
                      }
                      className="
                        w-full
                        md:w-36
                        h-36
                        object-cover
                        rounded-2xl
                      "
                    />

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h2 className="text-2xl font-bold text-white">
                          {
                            menuItem?.name
                          }
                        </h2>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            menuItem?.foodType ===
                            "Veg"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {
                            menuItem?.foodType
                          }
                        </span>

                        <span className="px-3 py-1 rounded-full text-xs bg-orange-500/20 text-orange-400">
                          {
                            item.sizeType
                          }
                        </span>
                      </div>

                      <p className="text-gray-400 mb-4 line-clamp-2">
                        {
                          menuItem?.description
                        }
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="text-2xl font-bold text-orange-400">
                            ₹
                            {
                              finalPrice
                            }
                          </div>

                          {item.discountPrice >
                            0 && (
                            <div className="text-sm text-gray-500 line-through">
                              ₹
                              {
                                item.price
                              }
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <div
                            className="
                              flex
                              items-center
                              bg-[#111827]
                              rounded-full
                              overflow-hidden
                              border
                              border-gray-700
                            "
                          >
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  item.quantity,
                                  "dec"
                                )
                              }
                              disabled={
                                updatingItem ===
                                item._id
                              }
                              className="px-4 py-2 text-orange-400 text-xl"
                            >
                              −
                            </button>

                            <span className="px-4 text-white font-semibold">
                              {
                                item.quantity
                              }
                            </span>

                            <button
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  item.quantity,
                                  "inc"
                                )
                              }
                              disabled={
                                updatingItem ===
                                item._id
                              }
                              className="px-4 py-2 text-orange-400 text-xl"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() =>
                              removeItem(
                                item._id
                              )
                            }
                            className="text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="
              bg-[#1F2937]
              border
              border-gray-800
              rounded-3xl
              p-6
              h-fit
              sticky
              top-24
            "
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between text-gray-300">
                <span>
                  Subtotal
                </span>
                <span>
                  ₹{subtotal}
                </span>
              </div>

              <div className="flex justify-between text-gray-300">
                <span>
                  Delivery Fee
                </span>
                <span>
                  ₹
                  {
                    deliveryFee
                  }
                </span>
              </div>

              <div className="flex justify-between text-gray-300">
                <span>Tax</span>
                <span>
                  ₹{tax}
                </span>
              </div>

              <div className="bg-green-500/10 text-green-400 p-3 rounded-xl text-sm">
                🎉 Freshly prepared
                and delivered hot
              </div>

              <div className="border-t border-gray-700 pt-5 flex justify-between text-xl font-bold text-white">
                <span>Total</span>

                <span>
                  ₹
                  {
                    grandTotal
                  }
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="
                block
                text-center
                mt-6
                w-full
                bg-orange-500
                hover:bg-orange-600
                py-4
                rounded-2xl
                text-white
                font-semibold
                transition
              "
            >
              Proceed To Checkout →
            </Link>

            <button
              onClick={clearCart}
              className="
                mt-4
                w-full
                border
                border-red-500
                text-red-400
                py-3
                rounded-2xl
                hover:bg-red-500/10
              "
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}