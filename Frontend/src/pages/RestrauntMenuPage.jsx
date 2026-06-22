import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios.js";
import { toast } from "sonner";

export default function RestaurantMenuPage() {
  const { user ,type } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();

  const [menus, setMenus] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [currentMenuIndex, setCurrentMenuIndex] =  useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      fetchMenus();
    }
  }, [user]);
  
  useEffect(() => {
    if (user?._id) {
      fetchMenuItems();
    }
  }, [user]);
  
  useEffect(() => {
    if (user?._id) {
      fetchCategory();
    }
  }, [user]);

  const fetchMenus = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `/menu/${user?._id}/menu`
      );

      if (data.success) {
        toast.success("All Menus Fetched")
        setMenus(data.menus || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
 
  const fetchMenuItems = async ()=>{
     try {
        setLoading(true);
        const response = await api.get(`/menu-item/restaurant/${user?._id}`);
  
        if (response?.data?.success) {
          setMenuItems(response?.data.menuItems || []);
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message||"Error Fetching Menu-Items!")
      } finally {
        setLoading(false);
      }
  }  
  const currentMenu = menus[currentMenuIndex]||{};
  const [categories,setCategories] = useState([]); 
  
  const fetchCategory = async ()=>{
     try {
        setLoading(true);
        console.log(menus);
        console.log(menus[0]);
        const currMenuId = menus[currentMenuIndex]?._id||null;
        const response = await api.get(`/category/menu/${currMenuId}`);
  
        if (response?.data?.success) {
          console.log("success");
          console.log(response);
          toast.success("Category Fetched");
          setCategories(response?.data.categories || []);
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message||"Error Fetching Menu-Items!")
      } finally {
        setLoading(false);
      }
   }  
  
  const nextMenu = () => {
    fetchCategory();
    console.log(currentMenu);
    if (
      currentMenuIndex <
      menus.length - 1
    ) {
      setCurrentMenuIndex(
        currentMenuIndex + 1
      );
    }
  };
  
  const previousMenu = () => {
    fetchCategory();
    console.log(currentMenu);
    if (currentMenuIndex > 0) {
      setCurrentMenuIndex(
        currentMenuIndex - 1
      );
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
    <div className="min-h-screen bg-[#111827] p-4 md:p-6">

      {/* Header */}

      <div className="bg-[#1F2937] rounded-2xl p-5 mb-6">

        <div className="flex flex-col lg:flex-row justify-between gap-4">

          <div className="flex items-center justify-center gap-3">

            <button
              onClick={previousMenu}
              disabled={
                currentMenuIndex === 0
              }
              className="
              px-3 py-2
              rounded-lg
              bg-gray-700
              text-white
              disabled:opacity-40
              "
            >
              ◀
            </button>

            <h1 className="text-xl md:text-3xl font-bold text-white">
              {currentMenu?.name ||
                "No Menu"}
            </h1>

            <button
              onClick={nextMenu}
              disabled={
                currentMenuIndex ===
                menus.length - 1
              }
              className="
              px-3 py-2
              rounded-lg
              bg-gray-700
              text-white
              disabled:opacity-40
              "
            >
              ▶
            </button>

          </div>

          <div className="flex flex-wrap gap-2">

            <button
              onClick={() =>
                navigate(
                  "/restaurant/menu/create-menu"
                )
              }
              className="
              bg-orange-500
              hover:bg-orange-600
              px-4 py-2
              rounded-xl
              text-white
              "
            >
              + New Menu
            </button>

            <button
               onClick={() =>
                navigate(
                  "/restaurant/categories"
                )
              }
              className="
              bg-blue-500
              hover:bg-blue-600
              px-4 py-2
              rounded-xl
              text-white
              "
            >
              + New Category
            </button>

            <button
               onClick={() =>
                navigate(
                  "/restaurant/menu/create-menuItem"
                )
              }
              className="
              bg-green-500
              hover:bg-green-600
              px-4 py-2
              rounded-xl
              text-white
              "
            >
              + New Item
            </button>

          </div>

        </div>

      </div>

      {/* Categories */}

      <div className="space-y-4">

        {categories?.map(
            (category) => (
             <div
              key={category._id}
              className="
              bg-[#1F2937]
              rounded-2xl
              overflow-hidden
              ">

              {/* Category Header */}

              <div
                className="
                flex
                justify-between
                items-center
                p-4
                border-b
                border-gray-700
                "
              >

                <div>

                  <h2 className="text-white text-lg font-bold">
                    {category.name}
                  </h2>

                  <p className="text-gray-400 text-sm">
                    {category.items?.length || 0}{" "}
                    Items
                  </p>

                </div>

                <div className="flex gap-2">

                  <button
                    className="
                    bg-blue-500
                    hover:bg-blue-600
                    px-3 py-2
                    rounded-lg
                    text-white
                    "
                  >
                    Edit
                  </button>

                  <button
                    className="
                    bg-red-500
                    hover:bg-red-600
                    px-3 py-2
                    rounded-lg
                    text-white
                    "
                  >
                    Delete
                  </button>

                </div>

              </div>

              {/* Items */}

              <div className="divide-y divide-gray-800">

                {category.items?.map(
                  (item) => (
                    <div
                      key={item._id}
                      className="
                      flex
                      flex-col
                      md:flex-row
                      md:justify-between
                      md:items-center
                      gap-4
                      p-4
                      hover:bg-[#374151]">

                      <div className="flex gap-4">

                        <img
                          src={
                            item.image?.[0]
                              ?.url ||
                            "/food-placeholder.jpg"
                          }
                          alt={
                            item.name
                          }
                          className="
                          w-20
                          h-20
                          rounded-xl
                          object-cover
                          "
                        />

                        <div>

                          <h3 className="text-white font-semibold">
                            {item.name}
                          </h3>

                          <p className="text-gray-400 text-sm">
                            {
                              item.categoryId
                                ?.name
                            }
                          </p>

                          <div className="flex gap-2 mt-2">

                            <span
                              className={`
                              px-2 py-1 rounded text-xs
                              ${
                                item.foodType ===
                                "Veg"
                                  ? "bg-green-500 text-white"
                                  : item.foodType ===
                                    "Non-Veg"
                                  ? "bg-red-500 text-white"
                                  : "bg-yellow-500 text-black"
                              }
                              `}
                            >
                              {
                                item.foodType
                              }
                            </span>

                            <span className="text-orange-400 font-bold">
                              ₹
                              {item
                                .variants?.[0]
                                ?.discountPrice ||
                                item
                                  .variants?.[0]
                                  ?.price}
                            </span>

                          </div>

                        </div>

                      </div>

                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            navigate(
                              `/restaurant/menu/edit/${item._id}`
                            )
                          }
                          className="
                          bg-blue-500
                          hover:bg-blue-600
                          px-3 py-2
                          rounded-lg
                          text-white
                          "
                        >
                          Edit
                        </button>

                        <button
                          className="
                          bg-red-500
                          hover:bg-red-600
                          px-3 py-2
                          rounded-lg
                          text-white
                          "
                        >
                          Delete
                        </button>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>
          )
        )}

      </div>

      {!currentMenu && (
        <div className="text-center text-gray-400 mt-10">
          No Menus Found
        </div>
      )}

    </div>
  );
}