import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/auth.Slice.js";
import axios from "axios";
import { toast } from "sonner";
import api from "../utils/axios.js";

export default function Navbar() {
  
  const { user, type } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const logoutHandler = async () => {
   try{
    console.log("Type:",type);
    const { data } = await api.post(
      `/${type}/logout`,
    );
    if(data.success){
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
    <nav
      className="
        sticky top-0 z-50
        flex items-center justify-between
        min-h-[10vh]
        px-6 md:px-10
        border-b border-white/10
        backdrop-blur-md
      "
      style={{
        background: `
          radial-gradient(circle at top left,
          rgba(249,115,22,0.08), transparent 30%),

          linear-gradient(135deg, #1F2937, #111827)
        `,
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-3"
      >
        <div
          className="
            w-10 h-10
            rounded-full
            bg-orange-500
            text-white
            flex items-center justify-center
            font-bold text-xl
            shadow-lg
          "
        >
          ƒ
        </div>

        <h1 className="text-white text-2xl md:text-3xl font-bold">
          FoodDash
        </h1>
      </Link>

      {/* Navigation */}
      <div className="flex items-center gap-3">
         {(user) ? (
           <>
             <Link
               to="/cart"
               className="
                 px-5 py-2
                 rounded-full
                 text-white
                 border border-white/20
                 hover:border-orange-400
                 hover:bg-white/5
                 transition-all duration-200
               "
             >
               Cart
             </Link>
       
             <button
               onClick={logoutHandler}
               className="
                 px-5 py-2
                 rounded-full
                 bg-red-500
                 text-white
                 font-medium
                 hover:bg-red-600
                 hover:shadow-lg
                 transition-all duration-200
               "
             >
               Logout
             </button>
           </>
         ) : (
           <>
             <Link
               to="/login"
               className="
                 px-5 py-2
                 rounded-full
                 text-white
                 border border-white/20
                 hover:border-orange-400
                 hover:bg-white/5
                 transition-all duration-200
               "
             >
               Login
             </Link>
       
             <Link
               to="/signup"
               className="
                 px-5 py-2
                 rounded-full
                 bg-orange-500
                 text-white
                 font-medium
                 hover:bg-orange-600
                 hover:shadow-lg
                 hover:-translate-y-0.5
                 transition-all duration-200
               ">
                   Sign Up
               </Link>
               </>
             )}
      </div>
    </nav>
  );
}