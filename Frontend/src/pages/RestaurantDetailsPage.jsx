import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import api from "../utils/axios.js";
import { toast } from "sonner";
import { IoLeaf } from "react-icons/io5";
import { GiChicken } from "react-icons/gi";
import { FaEgg } from "react-icons/fa";

export default function RestaurantDetailsPage() {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [foodFilter, setFoodFilter] = useState("All");

  const [selectedVariants, setSelectedVariants] = useState({});

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  useEffect(() => {
    filterItems();
  }, [menuItems, search, foodFilter]);

  const fetchRestaurant = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/menu/restraunt/${id}`);

      if (res.data.success) {
        setRestaurant(res.data.restaurant);
        setMenuItems(res.data.menuItems || []);

        const variantsObj = {};

        res.data.menuItems?.forEach((item) => {
          if (item.variants?.length) {
            variantsObj[item._id] = item.variants[0];
          }
        });

        setSelectedVariants(variantsObj);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load restaurant");
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let items = [...menuItems];

    if (search) {
      items = items.filter(
        (item) =>
          item.name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          item.description
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    if (foodFilter !== "All") {
      items = items.filter(
        (item) => item.foodType === foodFilter
      );
    }

    setFilteredItems(items);
  };

  const addToCart = async (item) => {
    try {
      const selectedVariant =
        selectedVariants[item._id];

      await api.post("/cart/add", {
        restaurantId: id,
        menuItemId: item._id,
        quantity: 1,
        variant: selectedVariant?.sizeType,
      });

      toast.success("Added to cart");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add item"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111827]">
        <Navbar />

        <div className="flex justify-center items-center h-[70vh]">
          <h2 className="text-white text-xl">
            Loading Restaurant...
          </h2>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#111827]">
        <Navbar />

        <div className="flex justify-center items-center h-[70vh]">
          <h2 className="text-white text-xl">
            Restaurant Not Found
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111827]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="relative rounded-3xl overflow-hidden">
          <img
            src={
              restaurant.restrauntPicture ||
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
            }
            alt={restaurant.name}
            className="w-full h-62.5 md:h-100 object-cover"
          />

          <div className="absolute inset-0 bg-black/50 flex items-end">
            <div className="p-6 md:p-8 text-white">
              <h1 className="text-3xl md:text-5xl font-bold">
                {restaurant.name}
              </h1>

              <p className="mt-2 text-gray-200">
                {restaurant.location?.address}
              </p>

              <div className="mt-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    restaurant.isOpen
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {restaurant.isOpen
                    ? "Open"
                    : "Closed"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col lg:flex-row gap-4">
          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              flex-1
              px-5
              py-3
              rounded-xl
              bg-[#1F2937]
              text-white
              outline-none
            "
          />

          <div className="flex gap-2 overflow-auto">
            {[
              "All",
              "Veg",
              "Non-Veg",
              "Egg-Only",
            ].map((type) => (
              <button
                key={type}
                onClick={() =>
                  setFoodFilter(type)
                }
                className={`px-5 py-3 rounded-xl whitespace-nowrap ${
                  foodFilter === type
                    ? "bg-orange-500 text-white"
                    : "bg-[#1F2937] text-gray-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const selectedVariant =
              selectedVariants[item._id];

            const price =
              selectedVariant?.discountPrice ||
              selectedVariant?.price;

            return (
              <div
                key={item._id}
                className="
                  bg-[#1F2937]
                  rounded-3xl
                  overflow-hidden
                  border
                  border-gray-800
                "
              >
                <img
                  src={
                    item.image?.[0] ||
                    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38"
                  }
                  alt={item.name}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white text-lg font-bold">
                      {item.name}
                    </h3>

                    {item.foodType === "Veg" && (
                      <IoLeaf className="text-green-500 text-xl" />
                    )}

                    {item.foodType ===
                      "Non-Veg" && (
                      <GiChicken className="text-red-500 text-xl" />
                    )}

                    {item.foodType ===
                      "Egg-Only" && (
                      <FaEgg className="text-yellow-500 text-xl" />
                    )}
                  </div>

                  <p className="text-gray-400 text-sm mt-2 h-10 overflow-hidden">
                    {item.description}
                  </p>

                  <select
                    value={
                      selectedVariant?.sizeType
                    }
                    onChange={(e) => {
                      const variant =
                        item.variants.find(
                          (v) =>
                            v.sizeType ===
                            e.target.value
                        );

                      setSelectedVariants(
                        (prev) => ({
                          ...prev,
                          [item._id]:
                            variant,
                        })
                      );
                    }}
                    className="
                      w-full
                      mt-4
                      bg-[#111827]
                      text-white
                      rounded-lg
                      px-3
                      py-2
                    "
                  >
                    {item.variants?.map(
                      (variant) => (
                        <option
                          key={
                            variant.sizeType
                          }
                          value={
                            variant.sizeType
                          }
                        >
                          {variant.sizeType}
                        </option>
                      )
                    )}
                  </select>

                  <div className="mt-5 flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange-500">
                      ₹{price}
                    </span>

                    <button
                      onClick={() =>
                        addToCart(item)
                      }
                      className="
                        bg-orange-500
                        hover:bg-orange-600
                        px-4
                        py-2
                        rounded-xl
                        text-white
                        font-medium
                      "
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-gray-400 text-xl">
              No Items Found
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}