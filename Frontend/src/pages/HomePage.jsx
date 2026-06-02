import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import FoodCard from "../components/FoodCard.jsx";

export default function HomePage() {

  const foodItems = [
    {
      id: 1,
      name: "Chicken Biryani",
      image:
        "https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd",
      price: 170,
    },
    {
      id: 2,
      name: "Veg Biryani",
      image:
        "https://images.unsplash.com/photo-1631452180519-c014fe946bc7",
      price: 150,
    },
    {
      id: 3,
      name: "Fish Biryani",
      image:
        "https://images.unsplash.com/photo-1642821373181-696a54913e93",
      price: 200,
    },
    {
      id: 4,
      name: "Chicken Fried Rice",
      image:
        "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
      price: 130,
    },
    {
      id: 5,
      name: "Prawns Fried Rice",
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19",
      price: 120,
    },
    {
      id: 6,
      name: "Veg Pizza",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591",
      price: 299,
    },
  ];

  return (
    <div className="min-h-screen bg-[#111827]">

      <Navbar />

      {/* HERO */}
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
            placeholder="Search food, restaurants..."
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
      </section>

      {/* FOOD SECTION */}
      <section className="px-8 py-14">

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-white">
            Popular Dishes
          </h2>

          <button className="text-orange-500 hover:text-orange-400">
            View All →
          </button>
        </div>

        <div
          className="
            grid
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-8
          "
        >
          {foodItems.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
            />
          ))}
        </div>

      </section>

      <Footer />
    </div>
  );
}