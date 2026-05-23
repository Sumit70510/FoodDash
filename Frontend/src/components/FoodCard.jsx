import React from "react";

export default function FoodCard({ item }) {
  return (
    <div className="w-full max-w-sm rounded-xl bg-white shadow-md overflow-hidden border border-gray-100">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-44 object-cover"
      />

      <div className="p-4">
        <div className="flex justify-between items-start gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {item.name}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {item.description}
            </p>
          </div>

          <span className="text-sm font-semibold text-orange-500">
            ₹{item.price}
          </span>
        </div>

        <button className="w-full mt-4 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition">
          Add to Cart
        </button>
      </div>
    </div>
  );
}