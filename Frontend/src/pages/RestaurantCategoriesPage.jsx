import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/axios.js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function RestaurantCategoriesPage() {
  
  const { user, type } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const restaurant = user||{};
  const navigate = useNavigate();
  // console.log(restaurant);

  const [categories, setCategories] = useState([]);
  const [menus,setMenus]=useState([]);
  const [data, setData] = useState({
                                    name : "",
                                    description : "",
                                    // menuName : "",
                                    menuId : "" });
                                    
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchMenus();
  }, []);
  
  const fetchMenus = async () => {
      try
       {
         const response = await api.get(`menu/${restaurant._id}/menu`);
         if(response.data.success)
          {setMenus(response.data.menus);} 
       }
      catch(error)
       {
         console.log(error);
         toast.error(error?.response?.data?.message||'Error Fetching Menus!');
       }         
    }
  
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get(`category/restaurant/${restaurant._id}`);
      if (response?.data?.success) {
        setCategories(response?.data?.categories || []);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message||"Error In Fetching Categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => 
    {
    e.preventDefault();

    try {
      const payload = {
        name : data?.name,
        description : data?.description,
        restaurantId : restaurant?._id,
        menuId : data?.menuId             
      };

      const url = editingId ? `/category/edit/${editingId}` : `/category/create`;

      const method = editingId ? "put" : "post";

      console.log("here");
      const response = await api[method](url, payload);

      if(response?.data?.success) 
       {
        // console.log("Success in Category");
        setEditingId(null);
        setData({ name : "",
                  description : "",
                  // menuName : "",
                  menuId : "" });
        fetchCategories();          
       } 
      else 
       {
        toast.message(response?.data?.message);
       }
     } 
    catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message||"Category Creation/Editing Failed!")
     }
  };
  
const handleEdit = (category) => {
  console.log(category)
  setData({
    name: category.name,
    description: category.description || "",
    menuId: category?.menuId?._id || "",
  });
  setEditingId(category._id);
};
  
  const handleDelete = async ( categoryId ) => 
    {
      const confirmDelete =
       window.confirm(
        "Delete this category?"
       );

    if(!confirmDelete) return;

    try {
      const response = await api.delete(`/category/${categoryId}`);

      if(response?.data?.success) {
        setCategories((prev) =>
          prev.filter(
            (item) =>
              item._id !== categoryId
          )
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message||"Deletion Failed!")
    }
  };
  
  const onChangeEventHandler = (e,reset=false)=>
    {
       if(reset)
        {
          setData({ name : "",
                    description : "",
                    menuId : "" });
          return;          
        }
       else
        {
          setData({...data,[e.target.name]:e.target.value});
        } 
    }

  return (
    <div className="min-h-screen bg-[#111827] px-4 md:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-4xl font-bold text-white mb-8">
          Categories
        </h1>

        {/* Add Category */}
        
        { menus.length===0 ? 
           (
             <button
              onClick={()=>navigate('../menu/create-menu')}
              className="
               bg-orange-500
               hover:bg-orange-600
               px-6
               py-3
               mb-8
               rounded-xl
               text-white
               font-semibold">
              Create A Menu First
             </button>
           ) 
           : 
          (
           <div className="bg-[#1F2937] p-6 rounded-3xl border border-gray-800 mb-8">
             <h2 className="text-2xl font-bold text-white mb-5">
              {editingId
                ? "Edit Category"
                : "Add Category"}
            </h2>
  
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text"
                name="name"
                placeholder="Category Name"
                value={data.name}
                onChange={onChangeEventHandler}
                required
                className="
                  w-full
                  bg-[#111827]
                  border
                  border-gray-700
                  text-white
                  p-3
                  rounded-xl"
              />
  
              <textarea
                rows="2"
                placeholder="Description"
                name="description"
                value={data.description}
                onChange={onChangeEventHandler}
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
              
               <select
               name="menuId"
                value={data.menuId}
                onChange={onChangeEventHandler}
                className="w-full p-3 rounded-xl bg-[#111827] text-white">
                <option value="">Select Menu</option>
                {menus?.map((menu) => (
                  <option
                    key={menu._id}
                    value={menu._id}
                    >
                    {menu.name}
                  </option>
                ))}
              </select>
                     
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
                    onClick={(e) => {setEditingId(null)
                                     onChangeEventHandler(null,true);}}
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
           
          )}
         
         
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
                      key={category?._id}
                      className="
                        border-b
                        border-gray-800
                        hover:bg-[#374151]
                      "
                    >
                      <td className="p-4 text-white font-medium">
                        {category?.name}
                      </td>

                      <td className="p-4 text-gray-300">
                        {category?.description ||
                          "----"}
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