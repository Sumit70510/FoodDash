import React, { useEffect, useState } from "react";

export default function RestaurantCategoriesPage() {
  const restaurant =
    JSON.parse(localStorage.getItem("restaurant")) || {};

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/v1/category/restaurant/${restaurant._id}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name,
        description,
      };

      const url = editingId
        ? `http://localhost:5000/api/v1/category/${editingId}`
        : `http://localhost:5000/api/v1/category/create`;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setName("");
        setDescription("");
        setEditingId(null);

        fetchCategories();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setName(category.name);
    setDescription(
      category.description || ""
    );
  };

  const handleDelete = async (
    categoryId
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this category?"
      );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/category/${categoryId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        setCategories((prev) =>
          prev.filter(
            (item) =>
              item._id !== categoryId
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          Categories
        </h1>

        {/* Add Category */}

        <div className="bg-[#1F2937] p-6 rounded-3xl border border-gray-800 mb-8">
          <h2 className="text-2xl font-bold text-white mb-5">
            {editingId
              ? "Edit Category"
              : "Add Category"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Category Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
              className="
                w-full
                bg-[#111827]
                border
                border-gray-700
                text-white
                p-3
                rounded-xl
              "
            />

            <textarea
              rows="3"
              placeholder="Description"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              className="
                w-full
                bg-[#111827]
                border
                border-gray-700
                text-white
                p-3
                rounded-xl
              "
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="
                  bg-orange-500
                  hover:bg-orange-600
                  px-6
                  py-3
                  rounded-xl
                  text-white
                  font-semibold
                "
              >
                {editingId
                  ? "Update Category"
                  : "Add Category"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setName("");
                    setDescription("");
                  }}
                  className="
                    bg-gray-700
                    hover:bg-gray-600
                    px-6
                    py-3
                    rounded-xl
                    text-white
                  "
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories List */}

        <div className="bg-[#1F2937] rounded-3xl border border-gray-800 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-white">
              Loading...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No Categories Found
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-4 text-left text-gray-300">
                    Name
                  </th>

                  <th className="p-4 text-left text-gray-300">
                    Description
                  </th>

                  <th className="p-4 text-left text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {categories.map(
                  (category) => (
                    <tr
                      key={category._id}
                      className="
                        border-b
                        border-gray-800
                        hover:bg-[#374151]
                      "
                    >
                      <td className="p-4 text-white font-medium">
                        {category.name}
                      </td>

                      <td className="p-4 text-gray-300">
                        {category.description ||
                          "-"}
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleEdit(
                                category
                              )
                            }
                            className="
                              bg-blue-500
                              hover:bg-blue-600
                              px-4
                              py-2
                              rounded-lg
                              text-white
                            "
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                category._id
                              )
                            }
                            className="
                              bg-red-500
                              hover:bg-red-600
                              px-4
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
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}