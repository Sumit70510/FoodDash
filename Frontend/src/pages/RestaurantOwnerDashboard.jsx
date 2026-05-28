import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import api from "../api/axios.js";

export default function RestaurantOwnerDashboard() {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [message, setMessage] = useState("");

  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });

  const fetchOwnerData = async () => {
    try {
      const ordersRes = await api.get("/owner/orders");
      const menuRes = await api.get("/owner/menu");

      setOrders(ordersRes.data.orders || ordersRes.data.data || []);
      setMenuItems(menuRes.data.menuItems || menuRes.data.data || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch dashboard data");
    }
  };

  const handleChange = (e) => {
    setNewItem((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();

    try {
      setMessage("");

      await api.post("/owner/menu/add", {
        ...newItem,
        price: Number(newItem.price),
      });

      setNewItem({
        name: "",
        description: "",
        price: "",
        image: "",
      });

      fetchOwnerData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add menu item");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.patch(`/owner/order/${orderId}/status`, { status });
      fetchOwnerData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Restaurant Owner Dashboard</h1>

        {message && <p className="text-red-500 mb-4">{message}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form
            onSubmit={handleAddMenuItem}
            className="bg-white rounded-xl shadow p-5 h-fit"
          >
            <h2 className="text-xl font-bold mb-4">Add Menu Item</h2>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                value={newItem.name}
                onChange={handleChange}
                placeholder="Item name"
                className="border p-3 rounded-md outline-none"
                required
              />

              <input
                type="text"
                name="description"
                value={newItem.description}
                onChange={handleChange}
                placeholder="Description"
                className="border p-3 rounded-md outline-none"
              />

              <input
                type="number"
                name="price"
                value={newItem.price}
                onChange={handleChange}
                placeholder="Price"
                className="border p-3 rounded-md outline-none"
                required
              />

              <input
                type="text"
                name="image"
                value={newItem.image}
                onChange={handleChange}
                placeholder="Image URL"
                className="border p-3 rounded-md outline-none"
              />

              <button className="bg-orange-500 text-white py-2 rounded-md">
                Add Item
              </button>
            </div>
          </form>

          <div className="lg:col-span-2 bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-bold mb-4">Menu Items</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <div key={item._id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">
                    {item.name || item.itemName}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {item.description}
                  </p>

                  <p className="text-orange-500 font-bold mt-2">
                    ₹{item.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 mt-8">
          <h2 className="text-xl font-bold mb-4">Incoming Orders</h2>

          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <h3 className="font-semibold">Order #{order._id}</h3>

                  <p className="text-gray-500">
                    Total: ₹{order.totalAmount || order.total || 0}
                  </p>

                  <p className="text-sm text-orange-500">
                    Status: {order.status}
                  </p>
                </div>

                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className="border p-2 rounded-md"
                >
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Ready For Pickup">Ready For Pickup</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}