import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar.jsx";
import {
  increaseQuantity,
  decreaseQuantity,
  removeItemFromCart,
  clearCart,
} from "../redux/cartSlice.js";

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, subTotal } = useSelector((state) => state.cart);

  const deliveryFee = items.length > 0 ? 40 : 0;
  const tax = Math.round(subTotal * 0.05);
  const grandTotal = subTotal + deliveryFee + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        {items.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center">
            <p className="text-gray-600 mb-4">Your cart is empty.</p>

            <Link
              to="/restaurants"
              className="inline-block px-6 py-2 bg-orange-500 text-white rounded-md"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.menuItemId}
                  className="bg-white rounded-xl shadow p-4 flex items-center gap-4"
                >
                  <img
                    src={
                      item.image ||
                      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38"
                    }
                    alt={item.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-orange-500 font-medium">
                      ₹{item.price}
                    </p>

                    <button
                      onClick={() => dispatch(removeItemFromCart(item.menuItemId))}
                      className="text-sm text-red-500 mt-2"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => dispatch(decreaseQuantity(item.menuItemId))}
                      className="w-8 h-8 border rounded-md"
                    >
                      -
                    </button>

                    <span className="font-semibold">{item.quantity}</span>

                    <button
                      onClick={() => dispatch(increaseQuantity(item.menuItemId))}
                      className="w-8 h-8 border rounded-md"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow p-5 h-fit">
              <h2 className="text-xl font-bold mb-4">Bill Details</h2>

              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{subTotal}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>

              <div className="flex justify-between mb-4">
                <span>Tax</span>
                <span>₹{tax}</span>
              </div>

              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>

              <Link
                to="/checkout"
                className="block text-center mt-5 w-full bg-orange-500 text-white py-2 rounded-md"
              >
                Proceed to Checkout
              </Link>

              <button
                onClick={() => dispatch(clearCart())}
                className="mt-3 w-full border border-red-500 text-red-500 py-2 rounded-md"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}