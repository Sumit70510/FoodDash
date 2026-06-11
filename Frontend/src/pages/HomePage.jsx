import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import FoodCard from "../components/FoodCard.jsx";

export default function HomePage() {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [foodType, setFoodType] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/v1/menu"
      );

      const data = await response.json();

      if (data.success) {
        setMenuItems(data.menuItems || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFoodType =
        foodType === "All"
          ? true
          : item.foodType === foodType;

      return matchesSearch && matchesFoodType;
    });
  }, [menuItems, search, foodType]);

  return (
    <div className="min-h-screen bg-[#111827]">
      <Navbar />

      <section
        className="h-[70vh] flex flex-col justify-center items-center px-4 text-center"
        style={{
          background: `
            linear-gradient(
              rgba(0,0,0,0.55),
              rgba(0,0,0,0.55)
            ),
            url("https://images.unsplash.com/photo-1504674900247-0877df9cc836")
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white">
          Food Delivered
        </h1>

        <span className="text-orange-500 text-5xl md:text-7xl font-bold">
          To Your Doorstep
        </span>

        <p className="text-gray-300 mt-5 max-w-2xl">
          Discover restaurants, order delicious meals,
          and enjoy lightning-fast delivery with FoodDash.
        </p>

        <div className="mt-8 w-full max-w-3xl">
          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search food..."
            className="
              w-full
              px-5
              py-4
              rounded-2xl
              bg-white
              shadow-xl
              outline-none
            "
          />
        </div>

        <div className="flex gap-3 mt-5 flex-wrap justify-center">
          {[
            "All",
            "Veg",
            "Non-Veg",
            "Egg-Only",
          ].map((type) => (
            <button
              key={type}
              onClick={() =>
                setFoodType(type)
              }
              className={`
                px-5 py-2 rounded-full
                ${
                  foodType === type
                    ? "bg-orange-500 text-white"
                    : "bg-white text-black"
                }
              `}
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      <section className="px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-white">
            Popular Dishes
          </h2>

          <span className="text-gray-400">
            {filteredItems.length} Items
          </span>
        </div>

        {loading ? (
          <div className="text-center text-white text-xl">
            Loading Menu...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center text-gray-400 text-xl">
            No Food Found
          </div>
        ) : (
          <div
            className="
              grid
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-8
            "
          >
            {filteredItems.map((item) => (
              <FoodCard
                key={item._id}
                item={{
                  _id: item._id,
                  name: item.name,
                  image:
                    item.image?.[0] ||
                    "/food-placeholder.jpg",
                  foodType: item.foodType,
                  price:
                    item.variants?.[0]
                      ?.discountPrice ||
                    item.variants?.[0]?.price ||
                    0,
                }}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}