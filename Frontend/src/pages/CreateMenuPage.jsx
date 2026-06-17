import React, { useState } from "react";
import api from "../utils/axios.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";

export default function CreateMenuPage() {
    
  const navigate = useNavigate();
  const { user, type } = useSelector((state) => state.auth);
  
  const restaurant = user||{};

  const [formData, setFormData] = useState({
    name: "",
    restaurantId: "",
    isAvailable:true,
  });

  const [categories, setCategories] = useState([]);
  const [loading,setLoading] = useState(false);
  const [menus,setMenus]=useState([]);
  
  useEffect(()=>{
     fetchCategories();
     fetchMenus(); 
   },[]);
  
  const fetchMenus = async () => {
      try
       {  
         setLoading(true);
         const response = await api.get(`menu/${restaurant._id}/menu`);
         if(response.data.success)
          {setMenus(response.data.menus);} 
       }
      catch(error)
       {
         console.log(error);
         toast.error(error?.response?.data?.message||'Error Fetching Menus!');
       }
       finally{
        setLoading(false);
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
   
  const onChangeHandler = (e)=>
     { 
       setFormData({...formData, [e.target.name] : e.target.value})
     }
 
  const submitHandler = async (e) => {
    e.preventDefault();
    try 
     {
       console.log((formData?.isAvailable==='Available'));
       const response = await api.post( "/menu/create",
                        {
                          name : formData?.name,
                          restaurantId : restaurant?._id,
                          isAvailable : (formData?.isAvailable==='Available')
                        });
       if(response.data.success)
        {
          toast.success(response?.data?.message)  
          //   fetchMenus();
          //navigate("/restaurant/menu");
        }
        
     }catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message||"Menu Creation Failed");
     }
  };

  return (
    <div className="min-h-screen bg-[#111827] p-6">
      <div className="max-w-full bg-[#1F2937] rounded-2xl p-6">

        <h1 className="text-3xl font-bold text-white mb-6">
          Add New Menu
        </h1>

        <form
          onSubmit={submitHandler}
          className="space-y-5" >
          <input
            type="text"
            name="name"
            placeholder="Menu Name"
            value={formData.name}
            onChange={onChangeHandler}
            className="w-full p-3 rounded-xl bg-[#111827] text-white"
          />

          
          <select
            name="isAvailable"
            value={formData.isAvailable}
            onChange={onChangeHandler}
            className="w-full p-3 rounded-xl bg-[#111827] text-white"
          >
            <option>Available</option>
            <option>Not Available</option>
          </select>

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
            Create Menu
          </button>
        </form>
        
        {loading ? 
            (
              <div className="p-8 text-center text-white">
                Loading...
              </div>
            ) : 
          menus.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No Menu Found
            </div>
           ) : (
  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
  {menus.map((menu) => (
    <div
      key={menu._id}
      className="
        bg-[#1F2937]
        rounded-2xl
        p-5
        shadow-lg
        hover:shadow-xl
        transition-all
        border
        border-gray-700
      "
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">
          {menu.name}
        </h3>

        <span
          className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${
              menu.isAvailable
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }
          `}
        >
          {menu.isAvailable===true
            ? "Available"
            : "Unavailable"}
        </span>
      </div>

      {/* Categories */}
      <div className="mb-5">
        <p className="text-sm text-gray-400 mb-2">
          Categories
        </p>

        <div className="flex flex-wrap gap-2">
          {menu.categories?.length > 0 ? (
            menu.categories.map((category) => (
              <span
                key={category._id}
                className="
                  bg-orange-500/20
                  text-orange-400
                  px-3
                  py-1
                  rounded-full
                  text-xs
                "
              >
                {category.name}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">
              No Categories
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3">
        <button
          className="
            flex-1
            bg-blue-500
            hover:bg-blue-600
            py-2
            rounded-xl
            text-white
            font-medium
          "
        >
          Edit
        </button>

        <button
          className="
            flex-1
            bg-red-500
            hover:bg-red-600
            py-2
            rounded-xl
            text-white
            font-medium
          "
        >
         Delete
        </button>
      </div>
    </div>
  ))}
</div>
          )}
      </div>
    </div>
  );
}