import React, {useEffect, useState,} from "react";
import { useNavigate, useParams, } from "react-router-dom";
import api from "../utils/axios.js";
import { toast } from "sonner";

export default function EditMenuItemPage() {
  const { menuItemId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
                                             name: "",
                                             description: "",
                                             categoryId: "",
                                             foodType: "Veg",
                                             isAvailable: true,
                                           });

  const [variants, setVariants] =  useState([]);

  const [images, setImages] = useState([]);

  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => { fetchMenuItem(); }, []);

  const fetchMenuItem = async () => {
    try 
     {
      setLoading(true);

      const { data } = await api.get(`/menu-item/${menuItemId}`);

      if(data.success) 
       {
        const item = data.menuItem;

        setFormData({
          name : item.name,
          description : item.description,
          categoryId : item.categoryId?._id || "",
          foodType : item.foodType,
          isAvailable : item.isAvailable,
        });

        setVariants(item.variants || []);
        setPreviewImages(item.image || []);
       }
     } 
    catch(error) 
     {
      console.log(error);
      toast.error(error?.response?.data?.message);
     } 
    finally {
      setLoading(false);
    }
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        sizeType: "Small",
        price: "",
        discountPrice: "",
      },
    ]);
  };

  const removeVariant = (index) => {
    setVariants(
      variants.filter(
        (_, i) => i !== index
      )
    );
  };

  const updateVariant = (index,field,value) => 
    {
     const updated = [...variants];
     updated[index][field] = value;
     setVariants(updated);
   };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
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
        "categoryId",
        formData.categoryId
      );

      data.append(
        "foodType",
        formData.foodType
      );

      data.append(
        "isAvailable",
        formData.isAvailable
      );

      data.append(
        "variants",
        JSON.stringify(variants)
      );

      images.forEach((file) => {
        data.append("images", file);
      });

      const response =
        await api.put(
          `/menu-item/${menuItemId}`,
          data
        );

      if (response.data.success) {
        navigate(
          "/restaurant/menu"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111827] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111827] p-6">
      <div className="max-w-4xl mx-auto bg-[#1F2937] rounded-2xl p-6">

        <h1 className="text-3xl font-bold text-white mb-6">
          Edit Menu Item
        </h1>

        <form
          onSubmit={submitHandler}
          className="space-y-5"
        >
          <input
            type="text"
            value={formData.name}
            placeholder="Item Name"
            onChange={(e) =>
              setFormData({
                ...formData,
                name:
                  e.target.value,
              })
            }
            className="
              w-full
              p-3
              rounded-xl
              bg-[#111827]
              text-white
              outline-none
            "
          />

          <textarea
            rows={4}
            value={
              formData.description
            }
            placeholder="Description"
            onChange={(e) =>
              setFormData({
                ...formData,
                description:
                  e.target.value,
              })
            }
            className="
              w-full
              p-3
              rounded-xl
              bg-[#111827]
              text-white
              outline-none
            "
          />

          <input
            type="text"
            value={
              formData.categoryId
            }
            placeholder="Category Id"
            onChange={(e) =>
              setFormData({
                ...formData,
                categoryId:
                  e.target.value,
              })
            }
            className="
              w-full
              p-3
              rounded-xl
              bg-[#111827]
              text-white
              outline-none
            "
          />

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
            className="
              w-full
              p-3
              rounded-xl
              bg-[#111827]
              text-white
            "
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

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={
                formData.isAvailable
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isAvailable:
                    e.target.checked,
                })
              }
            />

            <label className="text-white">
              Available
            </label>
          </div>

          <div>
            <p className="text-white mb-3">
              Current Images
            </p>

            <div className="flex gap-3 flex-wrap">
              {previewImages.map(
                (
                  image,
                  index
                ) => (
                  <img
                    key={index}
                    src={image.url}
                    alt=""
                    className="
                      w-24
                      h-24
                      object-cover
                      rounded-lg
                    "
                  />
                )
              )}
            </div>
          </div>

          <input
            type="file"
            multiple
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
              (
                variant,
                index
              ) => (
                <div
                  key={index}
                  className="grid md:grid-cols-4 gap-3"
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
                    className="
                      p-3
                      rounded-xl
                      bg-[#111827]
                      text-white
                    "
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
                      Extra Large
                    </option>
                  </select>

                  <input
                    type="number"
                    value={
                      variant.price
                    }
                    placeholder="Price"
                    onChange={(e) =>
                      updateVariant(
                        index,
                        "price",
                        e.target.value
                      )
                    }
                    className="
                      p-3
                      rounded-xl
                      bg-[#111827]
                      text-white
                    "
                  />

                  <input
                    type="number"
                    value={
                      variant.discountPrice ||
                      ""
                    }
                    placeholder="Discount Price"
                    onChange={(e) =>
                      updateVariant(
                        index,
                        "discountPrice",
                        e.target.value
                      )
                    }
                    className="
                      p-3
                      rounded-xl
                      bg-[#111827]
                      text-white
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeVariant(
                        index
                      )
                    }
                    className="
                      bg-red-500
                      hover:bg-red-600
                      rounded-xl
                      text-white
                    "
                  >
                    Remove
                  </button>
                </div>
              )
            )}

            <button
              type="button"
              onClick={addVariant}
              className="
                bg-blue-500
                hover:bg-blue-600
                px-4
                py-2
                rounded-xl
                text-white
              "
            >
              Add Variant
            </button>
          </div>

          <button
            type="submit"
            className="
              w-full
              py-3
              bg-orange-500
              hover:bg-orange-600
              rounded-xl
              text-white
              font-semibold
            "
          >
            Update Menu Item
          </button>
        </form>
      </div>
    </div>
  );
}