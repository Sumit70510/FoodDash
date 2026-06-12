import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function RestaurantMenuPage() {
  
  const { user, type } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const restaurant = user;
  
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
        `http://localhost:5000/api/v1/menu/restraunt/${restaurant._id}`,
        {
          credentials: "include",
        }
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

  const deleteMenuItem = async (menuItemId) => {
    const confirmDelete = window.confirm(
      "Delete this menu item?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/menu/${menuItemId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        setMenuItems((prev) =>
          prev.filter(
            (item) => item._id !== menuItemId
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesType =
        foodType === "All"
          ? true
          : item.foodType === foodType;

      return matchesSearch && matchesType;
    });
  }, [menuItems, search, foodType]);

  return (
    <div className="min-h-screen bg-[#111827] px-4 md:px-5 lg:px-6 py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">
          Menu Management
        </h1>

        <button
          className="
            bg-orange-500
            hover:bg-orange-600
            px-5
            py-3
            rounded-xl
            text-white
            font-semibold
          "
        >
          + Add Menu Item
        </button>
      </div>

      {/* Search + Filters */}

      <div className="bg-[#1F2937] p-5 rounded-2xl mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search menu item..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              px-4
              py-3
              rounded-xl
              bg-[#111827]
              text-white
              outline-none
            "
          />

          <select
            value={foodType}
            onChange={(e) =>
              setFoodType(e.target.value)
            }
            className="
              px-4
              py-3
              rounded-xl
              bg-[#111827]
              text-white
              outline-none
            "
          >
            <option>All</option>
            <option>Veg</option>
            <option>Non-Veg</option>
            <option>Egg-Only</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-white">
          Loading...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center text-gray-400">
          No Menu Items Found
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl">
          <table className="w-full bg-[#1F2937]">
            <thead>
              <tr className="border-b border-gray-700 text-left">
                <th className="p-4 text-gray-300">
                  Image
                </th>

                <th className="p-4 text-gray-300">
                  Name
                </th>

                <th className="p-4 text-gray-300">
                  Category
                </th>

                <th className="p-4 text-gray-300">
                  Food Type
                </th>

                <th className="p-4 text-gray-300">
                  Price
                </th>

                <th className="p-4 text-gray-300">
                  Status
                </th>

                <th className="p-4 text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item) => (
                <tr
                  key={item._id}
                  className="
                    border-b
                    border-gray-800
                    hover:bg-[#374151]
                  "
                >
                  <td className="p-4">
                    <img
                      src={
                        item.image?.[0] ||
                        "/food-placeholder.jpg"
                      }
                      alt={item.name}
                      className="
                        w-16
                        h-16
                        rounded-lg
                        object-cover
                      "
                    />
                  </td>

                  <td className="p-4 text-white">
                    {item.name}
                  </td>

                  <td className="p-4 text-white">
                    {item.categoryId?.name ||
                      "Unknown"}
                  </td>

                  <td className="p-4">
                    <span
                      className={`
                        px-3 py-1 rounded-full text-sm
                        ${
                          item.foodType === "Veg"
                            ? "bg-green-500 text-white"
                            : item.foodType ===
                              "Non-Veg"
                            ? "bg-red-500 text-white"
                            : "bg-yellow-500 text-black"
                        }
                      `}
                    >
                      {item.foodType}
                    </span>
                  </td>

                  <td className="p-4 text-orange-500 font-bold">
                    ₹
                    {item.variants?.[0]
                      ?.discountPrice ||
                      item.variants?.[0]?.price ||
                      0}
                  </td>

                  <td className="p-4">
                    {item.isAvailable ? (
                      <span className="text-green-500">
                        Available
                      </span>
                    ) : (
                      <span className="text-red-500">
                        Unavailable
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        className="
                          bg-blue-500
                          hover:bg-blue-600
                          px-3
                          py-2
                          rounded-lg
                          text-white
                        "
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteMenuItem(item._id)
                        }
                        className="
                          bg-red-500
                          hover:bg-red-600
                          px-3
                          py-2
                          rounded-lg
                          text-white
                        "
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}