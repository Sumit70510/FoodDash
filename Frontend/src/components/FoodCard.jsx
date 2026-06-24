import React, { useState } from "react";
import { FaLeaf } from "react-icons/fa";
import { GiChicken } from "react-icons/gi";
import { IoEgg } from "react-icons/io5";
import { toast } from "sonner";
import api from "../utils/axios.js";

export default function FoodCard({ item }) {
  const [quantity, setQuantity] = useState(1);

  const [selectedVariant, setSelectedVariant] =
    useState(
      item?.variants?.length
        ? item.variants[0]
        : null
    );

  const getFoodIcon = () => {
    switch (item.foodType) {
      case "Veg":
        return (
          <FaLeaf className="text-green-500" />
        );

      case "Non-Veg":
        return (
          <GiChicken className="text-red-500" />
        );

      case "Egg-Only":
        return (
          <IoEgg className="text-yellow-500" />
        );

      default:
        return null;
    }
  };

  const updateQuantity = (symbol) => {
    if (symbol === "+") {
      setQuantity((prev) =>
        Math.min(prev + 1, 50)
      );
    }

    if (symbol === "-") {
      setQuantity((prev) =>
        Math.max(prev - 1, 0)
      );
    }
  };

  const handleAddToCart = async () => {
    try {
      if (!selectedVariant) {
        return toast.error(
          "Please select a size"
        );
      }

      const payload = { menuItemId : item._id,
                        restaurantId : typeof item.restaurantId === "object" ? item.restaurantId?._id :item.restaurantId,
        quantity,
        selectedVariant: {
          sizeType:
            selectedVariant.sizeType,

          price:
            selectedVariant.price,

          discountPrice:
            selectedVariant.discountPrice ||
            0,
        },
      };
      
      // console.log(payload?.restaurantId);

      const response = await api.post("/cart/add",payload);

      if (response.data.success) {
        toast.success("Added to cart successfully");
        setQuantity(0);
      }
     } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to add item to cart"
      );
    }
  };

  const displayPrice =   selectedVariant?.discountPrice > 0
      ? selectedVariant.discountPrice
      : selectedVariant?.price || 0;

  const originalPrice =  selectedVariant?.price || 0;

  return (
    <div
      className="
        group
        bg-[#1F2937]
        rounded-3xl
        overflow-hidden
        border
        border-gray-800
        hover:border-orange-500/40
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-2xl
        hover:shadow-orange-500/10
      "
    >
      <div className="relative overflow-hidden">
        <img
          src={
            item?.image?.[0]?.url ||
            item?.image ||
            "/food-placeholder.jpg"
          }
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
          <div
            className="
              flex
              items-center
              gap-2
              bg-black/70
              backdrop-blur-md
              px-3
              py-1
              rounded-full
              text-white
              text-xs
              font-medium
            "
          >
            {getFoodIcon()}
            {item.foodType}
          </div>
        </div>

        {!item.isAvailable && (
          <div
            className="
              absolute
              inset-0
              bg-black/70
              flex
              items-center
              justify-center
            "
          >
            <span
              className="
                bg-red-500
                text-white
                px-4
                py-2
                rounded-xl
                font-semibold
              "
            >
              Unavailable
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between gap-3">
          <div className="flex-1">
            <h2
              className="
                text-xl
                font-bold
                text-white
                line-clamp-1
              "
            >
              {item.name}
            </h2>

            <p
              className="
                text-gray-400
                text-sm
                mt-2
                line-clamp-2
              "
            >
              {item.description}
            </p>
          </div>

          <div className="text-right">
            <div
              className="
                text-orange-500
                text-lg
                font-bold
              "
            >
              ₹{displayPrice}
            </div>

            {selectedVariant?.discountPrice >
              0 && (
              <div
                className="
                  text-gray-500
                  line-through
                  text-sm
                "
              >
                ₹{originalPrice}
              </div>
            )}
          </div>
        </div>

        {item?.variants?.length > 0 && (
          <div className="mt-5">
            <p
              className="
                text-gray-400
                text-sm
                mb-2
              "
            >
              Select Size
            </p>

            <div className="flex flex-wrap gap-2">
              {item.variants.map(
                (variant, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      setSelectedVariant(
                        variant
                      )
                    }
                    className={`
                      px-3
                      py-2
                      rounded-xl
                      border
                      text-sm
                      transition-all
                      ${
                        selectedVariant?.sizeType ===
                        variant.sizeType
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-[#111827] text-gray-300 border-gray-700 hover:border-orange-400"
                      }
                    `}
                  >
                    {variant.sizeType}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center gap-4">
          <div
            className="
              flex
              items-center
              overflow-hidden
              rounded-xl
              border
              border-gray-700
              bg-[#111827]
            "
          >
            <button
              type="button"
              onClick={() =>
                updateQuantity("-")
              }
              className="
                px-4
                py-2
                text-orange-400
                hover:bg-gray-800
              "
            >
              −
            </button>

            <span
              className="
                px-4
                py-2
                text-white
                font-semibold
              "
            >
              {quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                updateQuantity("+")
              }
              className="
                px-4
                py-2
                text-orange-400
                hover:bg-gray-800
              "
            >
              +
            </button>
          </div>

          <button
            disabled={!item.isAvailable}
            onClick={handleAddToCart}
            className="
              flex-1
              py-2.5
              rounded-xl
              bg-orange-500
              hover:bg-orange-600
              disabled:bg-gray-600
              disabled:cursor-not-allowed
              text-white
              font-semibold
              transition-all
            "
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}