import React, { useState } from "react";
import api from "../utils/axios.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateMenuItemPage() {
  const navigate = useNavigate();
  const { user, type } = useSelector((state) => state.auth);
  // const dispatch = useDispatch();
  const restaurant = user||{};
  // const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    foodType: "Veg",
    isAvailable: true,
  });

  const [variants, setVariants] = useState([
    {
      sizeType: "Small",
      price: "",
      discountPrice: "",
    },
  ]);

  const [images, setImages] = useState([]);

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        sizeType: "Medium",
        price: "",
        discountPrice: "",
      },
    ]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
   console.log("here 1");
    try {
  const data = new FormData();

  data.append("name", formData.name);
  data.append("description", formData.description);
  data.append("restaurantId", user?._id);
  data.append("categoryId", formData.categoryId);
  data.append("foodType", formData.foodType);
  data.append(
    "variants",
    JSON.stringify(variants)
  );

  images.forEach((file) => {
    data.append("image", file);
  });

  await api.post(
    "/menu-item/create",
    data
  );

  navigate("/restaurant/menu");

} catch (error) {
  console.log(error);
}
  };

  return (
    <div className="min-h-screen bg-[#111827] p-6">
      <div className="max-w-4xl mx-auto bg-[#1F2937] rounded-2xl p-6">

        <h1 className="text-3xl font-bold text-white mb-6">
          Add Menu Item
        </h1>

        <form
          onSubmit={submitHandler}
          className="space-y-5"
        >
          <input
            type="text"
            placeholder="Item Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            className="w-full p-3 rounded-xl bg-[#111827] text-white"
          />

          <textarea
            rows={4}
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description:
                  e.target.value,
              })
            }
            className="w-full p-3 rounded-xl bg-[#111827] text-white"
          />

          <input
            type="text"
            placeholder="Category Id"
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({
                ...formData,
                categoryId:
                  e.target.value,
              })
            }
            className="w-full p-3 rounded-xl bg-[#111827] text-white"
          />

          <select
            value={formData.foodType}
            onChange={(e) =>
              setFormData({
                ...formData,
                foodType:
                  e.target.value,
              })
            }
            className="w-full p-3 rounded-xl bg-[#111827] text-white"
          >
            <option>Veg</option>
            <option>Non-Veg</option>
            <option>Egg-Only</option>
          </select>

          <input
            multiple
            type="file"
            accept="image/*,video/*"
            onChange={(e) =>
              setImages(
                Array.from(
                  e.target.files
                )
              )
            }
            className="text-white"
          />

          <div className="space-y-4">
            {variants.map(
              (variant, index) => (
                <div
                  key={index}
                  className="grid md:grid-cols-3 gap-3"
                >
                  <select
                    value={
                      variant.sizeType
                    }
                    onChange={(e) => {
                      const copy = [
                        ...variants,
                      ];

                      copy[
                        index
                      ].sizeType =
                        e.target.value;

                      setVariants(
                        copy
                      );
                    }}
                    className="p-3 rounded-xl bg-[#111827] text-white"
                  >
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
                      Full
                    </option>
                  </select>

                  <input
                    type="number"
                    placeholder="Price"
                    value={
                      variant.price
                    }
                    onChange={(e) => {
                      const copy = [
                        ...variants,
                      ];

                      copy[
                        index
                      ].price =
                        e.target.value;

                      setVariants(
                        copy
                      );
                    }}
                    className="p-3 rounded-xl bg-[#111827] text-white"
                  />

                  <input
                    type="number"
                    placeholder="Discount Price"
                    value={
                      variant.discountPrice
                    }
                    onChange={(e) => {
                      const copy = [
                        ...variants,
                      ];

                      copy[
                        index
                      ].discountPrice =
                        e.target.value;

                      setVariants(
                        copy
                      );
                    }}
                    className="p-3 rounded-xl bg-[#111827] text-white"
                  />
                </div>
              )
            )}

            <button
              type="button"
              onClick={addVariant}
              className="bg-blue-500 px-4 py-2 rounded-lg text-white"
            >
              Add Variant
            </button>
          </div>

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
            Create Item
          </button>
        </form>
      </div>
    </div>
  );
}