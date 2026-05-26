import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import api from "../api/axios.js";

export default function RestaurantDetailsPage() {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await api.get(`/restaurant/${id}`);

      setRestaurant(res.data.restaurant || res.data.data || null);
      setMenuItems(res.data.menuItems || res.data.menu || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch restaurant details");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (menuItemId) => {
    try {
      const res = await api.post("/cart/add", {
        restaurantId: id,
        menuItemId,
        quantity: 1,
      });

      alert(res.data.message || "Item added to cart");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add item to cart");
    }
  };

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-8">
        {loading && <p>Loading menu...</p>}

        {message && <p className="text-red-500">{message}</p>}

        {restaurant && (
          <div className="mb-8 bg-white p-6 rounded-xl shadow-md">
            <h1 className="text-3xl font-bold">
              {restaurant.name || restaurant.restaurantName}
            </h1>

            <p className="text-gray-500 mt-2">
              {restaurant.address || "Address not available"}
            </p>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6">Menu Items</h2>

        {!loading && menuItems.length === 0 && (
          <p>No menu items found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md overflow-hidden border"
            >
              <img
                src={
                  item.image ||
                  item.itemImage ||
                  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38"
                }
                alt={item.name}
                className="w-full h-44 object-cover"
              />

              <div className="p-4">
                <h3 className="text-xl font-semibold">
                  {item.name || item.itemName}
                </h3>

                <p className="text-gray-500 mt-1">
                  {item.description || "Fresh and delicious food item"}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-orange-500 font-bold">
                    ₹{item.price}
                  </span>

                  <button
                    onClick={() => addToCart(item._id)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}