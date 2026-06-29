import React, {
  useEffect,
  useState,
} from "react";

import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import api from "../utils/axios.js";

import { toast } from "sonner";

export default function CreateMenuItemPage() {
  const navigate = useNavigate();

  const { user } = useSelector(
    (state) => state.auth
  );

  const [loading, setLoading] =
    useState(false);

  const [menus, setMenus] = useState([]);

  const [categories, setCategories] =
    useState([]);

  const [selectedMenu, setSelectedMenu] =
    useState("");

  const [images, setImages] = useState([]);

  const [
    imagePreviews,
    setImagePreviews,
  ] = useState([]);

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      categoryId: "",
      foodType: "Veg",
      isAvailable: true,
    });

  const [variants, setVariants] =
    useState([
      {
        sizeType: "Small",
        price: "",
        discountPrice: "",
      },
    ]);

  useEffect(() => {
    if (user?._id) {
      fetchMenus();
    }
  }, [user]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) =>
        URL.revokeObjectURL(url)
      );
    };
  }, [imagePreviews]);

  const fetchMenus = async () => {
    try {
      const { data } = await api.get(
        `/menu/${user._id}/menu`
      );

      if (data.success) {
        setMenus(data.menus || []);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch menus"
      );
    }
  };

  const fetchCategories = async (
    menuId
  ) => {
    try {
      const { data } = await api.get(
        `/category/menu/${menuId}`
      );

      if (data.success) {
        setCategories(
          data.categories || []
        );
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch categories"
      );
    }
  };

  const handleMenuChange = async (
    e
  ) => {
    const menuId = e.target.value;

    setSelectedMenu(menuId);

    setFormData((prev) => ({
      ...prev,
      categoryId: "",
    }));

    setCategories([]);

    if (menuId) {
      await fetchCategories(menuId);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(
      e.target.files
    );

    if (!files.length) return;

    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setImages((prev) => [
      ...prev,
      ...files,
    ]);

    setImagePreviews((prev) => [
      ...prev,
      ...newPreviews,
    ]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(
      imagePreviews[index]
    );

    setImages((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );

    setImagePreviews((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        sizeType: "Medium",
        price: "",
        discountPrice: "",
      },
    ]);
  };

  const removeVariant = (index) => {
    if (variants.length === 1) {
      return;
    }

    setVariants((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  const updateVariant = (
    index,
    field,
    value
  ) => {
    const copy = [...variants];

    copy[index][field] = value;

    setVariants(copy);
  };

  const submitHandler = async (
    e
  ) => {
    e.preventDefault();

    if (!selectedMenu) {
      return toast.error(
        "Please select a menu"
      );
    }

    if (!formData.categoryId) {
      return toast.error(
        "Please select a category"
      );
    }

    if (!formData.name.trim()) {
      return toast.error(
        "Item name is required"
      );
    }

    if (
      !formData.description.trim()
    ) {
      return toast.error(
        "Description is required"
      );
    }

    if (images.length === 0) {
      return toast.error(
        "Please upload at least one image"
      );
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append(
        "name",
        formData.name
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "restaurantId",
        user?._id
      );

      data.append(
        "categoryId",
        formData.categoryId
      );

      data.append(
        "foodType",
        formData.foodType
      );

      data.append(
        "variants",
        JSON.stringify(variants)
      );

      images.forEach((file) => {
        data.append(
          "image",
          file
        );
      });

      const response =
        await api.post(
          "/menu-item/create",
          data
        );

      if (
        response?.data?.success
      ) {
        toast.success(
          "Menu Item Created Successfully"
        );

        navigate(
          "/restaurant/menu"
        );
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to create menu item"
      );
    } finally {
      setLoading(false);
    }
  };
  
    return (
    <div className="min-h-screen bg-[#111827] p-6">
      <div className="max-w-7xl mx-auto bg-[#1F2937] rounded-2xl p-6">

        <h1 className="text-3xl font-bold text-white mb-8">
          Add Menu Item
        </h1>

        <form
          onSubmit={submitHandler}
          className="space-y-6"
        >
          <div className="grid lg:grid-cols-2 gap-6">

            <div className="space-y-5">

              <div>
                <label className="block text-white mb-2 font-medium">
                  Item Name
                </label>

                <input
                  type="text"
                  placeholder="Enter item name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-xl bg-[#111827] border border-gray-700 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">
                  Description
                </label>

                <textarea
                  rows={4}
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description:
                        e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-xl bg-[#111827] border border-gray-700 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">
                  Menu
                </label>

                <select
                  value={selectedMenu}
                  onChange={
                    handleMenuChange
                  }
                  className="w-full p-3 rounded-xl bg-[#111827] border border-gray-700 text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">
                    Select Menu
                  </option>

                  {menus.map((menu) => (
                    <option
                      key={menu._id}
                      value={menu._id}
                    >
                      {menu.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">
                  Category
                </label>

                <select
                  value={
                    formData.categoryId
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categoryId:
                        e.target.value,
                    })
                  }
                  disabled={
                    !selectedMenu
                  }
                  className="w-full p-3 rounded-xl bg-[#111827] border border-gray-700 text-white focus:outline-none focus:border-orange-500 disabled:opacity-50"
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={
                          category._id
                        }
                        value={
                          category._id
                        }
                      >
                        {category.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">
                  Food Type
                </label>

                <select
                  value={
                    formData.foodType
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      foodType:
                        e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-xl bg-[#111827] border border-gray-700 text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Veg">
                    Veg
                  </option>

                  <option value="Non-Veg">
                    Non-Veg
                  </option>

                  <option value="Egg-Only">
                    Egg-Only
                  </option>
                </select>
              </div>

            </div>

            <div>

              <label className="block text-white mb-2 font-medium">
                Upload Images
              </label>

              <div className="border-2 border-dashed border-gray-600 rounded-2xl p-6">

                <input
                  multiple
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                  className="text-white w-full"
                />

                <p className="text-gray-400 text-sm mt-2">
                  Upload up to 5 images
                </p>

              </div>

              {imagePreviews.length >
                0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">

                  {imagePreviews.map(
                    (
                      image,
                      index
                    ) => (
                      <div
                        key={index}
                        className="relative"
                      >
                        <img
                          src={image}
                          alt=""
                          className="w-full h-36 rounded-xl object-cover border border-gray-700"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(
                              index
                            )
                          }
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    )
                  )}

                </div>
              )}

            </div>

          </div>

          <div className="bg-[#111827] rounded-2xl p-5">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-white text-xl font-semibold">
                Variants
              </h2>

              <button
                type="button"
                onClick={addVariant}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white"
              >
                Add Variant
              </button>

            </div>

            <div className="space-y-4">

              {variants.map(
                (variant,index) => (
                  <div
                    key={index}
                    className="grid lg:grid-cols-4 gap-3 items-center"
                  >
                    <select
                      value={
                        variant.sizeType
                      }
                      onChange={(e) =>
                        updateVariant(
                          index,
                          "sizeType",
                          e.target.value
                        )
                      }
                      className="p-3 rounded-xl bg-[#1F2937] border border-gray-700 text-white"
                    >
                      <option>
                        Quarter
                      </option>

                      <option>
                        Half
                      </option>

                      <option>
                        Full
                      </option>

                      <option>
                        Small
                      </option>

                      <option>
                        Medium
                      </option>

                      <option>
                        Large
                      </option>

                      <option>
                        ExL
                      </option>
                    </select>

                    <input
                      type="number"
                      placeholder="Price"
                      value={
                        variant.price
                      }
                      onChange={(e) =>
                        updateVariant(
                          index,
                          "price",
                          e.target.value
                        )
                      }
                      className="p-3 rounded-xl bg-[#1F2937] border border-gray-700 text-white"
                    />

                    <input
                      type="number"
                      placeholder="Discount Price"
                      value={
                        variant.discountPrice
                      }
                      onChange={(e) =>
                        updateVariant(
                          index,
                          "discountPrice",
                          e.target.value
                        )
                      }
                      className="p-3 rounded-xl bg-[#1F2937] border border-gray-700 text-white"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeVariant(
                          index
                        )
                      }
                      disabled={
                        variants.length ===
                        1
                      }
                      className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-3 rounded-xl"
                    >
                      Remove
                    </button>

                  </div>
                )
              )}

            </div>

          </div>

          <div className="flex justify-end gap-4 pt-4">

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/restaurant/menu"
                )
              }
              className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold"
            >
              {loading
                ? "Creating..."
                : "Create Menu Item"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}