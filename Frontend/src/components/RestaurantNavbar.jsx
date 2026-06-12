import React from "react";
import {
  FaBars,
  FaArrowLeft,
  FaSignOutAlt,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "../redux/auth.Slice.js";
import { toast } from "sonner";
import api from "../utils/axios.js";

export default function RestaurantNavbar({
  openSidebar,
}) {
  const navigate = useNavigate();

  const restaurant =
    JSON.parse(
      localStorage.getItem("restaurant")
    ) || {}; 
   
  const { user, type } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const logoutHandler = async () => {
   try{
    console.log("Type:",type);
    const { data } = await api.post(
      `/${type}/logout`,
    );
    if(data.success){
       navigate('/restaurant/login');
       dispatch(setAuthUser({user : null,type :""}));
       toast.success(data.message);
      }
     } 
    catch(error) {
      toast.error(
      error.response?.data?.message || "Logout failed"
    );
   }
  };
  
  return (
    <header
      className="
        fixed
        top-0
        left-0
        right-0
        h-16
        z-100
        bg-[#1F2937]
        border-b
        border-gray-800
      "
    >
      <div className="h-full px-6 flex items-center justify-between">

        <div className="flex items-center gap-4">

          {/* <button
            onClick={() => navigate(-1)}
            className="hover:text-orange-500"
          >
            <FaArrowLeft />
          </button> */}

          <button
            onClick={openSidebar}
            className="md:hidden"
          >
            <FaBars />
          </button>

          <h1 className="font-bold text-xl text-orange-500">
            FoodDash Partner
          </h1>
        </div>

        <div className="flex items-center gap-6">

          <div className="flex items-center gap-2">

            <div
              className={`w-3 h-3 rounded-full ${
                restaurant?.isOpen
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            />

            <span>
              {restaurant?.isOpen
                ? "Open"
                : "Closed"}
            </span>
          </div>

          <button
            onClick={logoutHandler}
            className="
              px-4
              py-2
              rounded-lg
              bg-red-500
              hover:bg-red-600
            "
          >
            <FaSignOutAlt />
          </button>

        </div>
      </div>
    </header>
  );
}