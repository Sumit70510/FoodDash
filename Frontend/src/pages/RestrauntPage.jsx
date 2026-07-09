import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../redux/cartSlice.js";
import api from "../api/axios.js";
import { toast } from "sonner";

export default function RestaurantPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/menu/${id}`);
      
      if (response.data.success) {
        setRestaurant(response.data.restaurant);
        setMenuItems(response.data.menuItems || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load restaurant details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    dispatch(addItemToCart({
      menuItemId: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: id,
    }));
    toast.success(`${item.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen app-bg text-muted">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen app-bg text-muted">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted">Restaurant not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-bg text-muted">
      <Navbar />

      <div className="surface shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate(-1)}
            className="text-orange-500 hover:text-orange-600 mb-4"
          >
            ← Back
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <img
                src={
                  restaurant.image ||
                  "https://images.unsplash.com/photo-1504674900152-b8b29ef1143f"
                }
                alt={restaurant.name}
                className="w-full h-64 md:h-80 object-cover rounded-lg"
              />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">{restaurant.name}</h1>
                <p className="text-muted mb-4">{restaurant.address}</p>

                <div className="p-4 rounded-lg surface space-y-2">
                <div className="flex justify-between">
                  <span>Rating:</span>
                  <span className="font-semibold">
                    {restaurant.rating || "4.5"} ⭐
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Time:</span>
                  <span className="font-semibold">
                    {restaurant.deliveryTime || "30-40 min"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span className="font-semibold">₹40</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6 text-white">Menu</h2>

        {menuItems.length === 0 ? (
          <p className="text-muted">No menu items available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="surface rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={
                    item.image ||
                    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
                  }
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />

                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {item.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-orange-500 font-bold">
                      ₹{item.price}
                    </span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="
                        px-4 py-2
                        bg-orange-500
                        text-white
                        rounded-lg
                        hover:bg-orange-600
                        transition
                      "
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
