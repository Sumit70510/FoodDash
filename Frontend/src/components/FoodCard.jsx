import React from "react";
import { FaLeaf } from "react-icons/fa";
import { GiChicken } from "react-icons/gi";
import { IoEgg } from "react-icons/io5";

export default function FoodCard({ item }) {
  const getFoodIcon = () => {
    switch (item.foodType) {
      case "Veg":
        return <FaLeaf className="text-green-500" />;
      case "Non-Veg":
        return <GiChicken className="text-red-500" />;
      case "Egg-Only":
        return <IoEgg className="text-yellow-500" />;
      default:
        return null;
    } 
  }; 

  return (
    <div
      className="
        group
        bg-[#1F2937]
        rounded-3xl
        overflow-hidden
        border border-gray-800
        hover:border-orange-500/40
        transition-all duration-300
        hover:-translate-y-2
        hover:shadow-2xl
        hover:shadow-orange-500/10
      "
    >
      <div className="relative overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="
            w-full
            h-56
            object-cover
            transition-transform
            duration-500
            group-hover:scale-110
          "
        />

        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium">
            {getFoodIcon()}
            {item.foodType}
          </div>
        </div>

        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold">
              Unavailable
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start gap-3">
          <div>
            <h2 className="text-xl font-bold text-white line-clamp-1">
              {item.name}
            </h2>

            <p className="text-gray-400 text-sm mt-2 line-clamp-2">
              {item.description}
            </p>
          </div>

          <span className="text-orange-500 text-lg font-bold whitespace-nowrap">
            ₹{item.price}
          </span>
        </div>

        <button
          className="
            w-full
            mt-5
            py-3
            rounded-xl
            bg-orange-500
            hover:bg-orange-600
            text-white
            font-semibold
            transition-all
          "
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
}