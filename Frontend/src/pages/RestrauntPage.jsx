import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import api from "../api/axios.js";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await api.get("/restaurant/getAllRestaurants");

      setRestaurants(res.data.restaurants || res.data.data || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Restaurants</h1>

        {loading && <p>Loading restaurants...</p>}

        {message && <p className="text-red-500">{message}</p>}

        {!loading && restaurants.length === 0 && (
          <p>No restaurants found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Link
              to={`/restaurant/${restaurant._id}`}
              key={restaurant._id}
              className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition"
            >
              <img
                src={
                  restaurant.image ||
                  restaurant.restaurantImage ||
                  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
                }
                alt={restaurant.name}
                className="w-full h-44 object-cover"
              />

              <div className="p-4">
                <h2 className="text-xl font-semibold">
                  {restaurant.name || restaurant.restaurantName}
                </h2>

                <p className="text-gray-500 mt-1">
                  {restaurant.address || "Address not available"}
                </p>

                <p className="text-orange-500 mt-2 font-medium">
                  View Menu
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}