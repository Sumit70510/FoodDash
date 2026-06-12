import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../utils/axios.js";
import { useDispatch } from "react-redux";
import {setAuthUser} from "../redux/auth.Slice.js"

export default function RestrauntLoginPage() {
  
  const [credentials,setCredentials] = useState({email:"",password:"",rememberMe:false,force:false});
  
  const [loading,setLoading] = useState(false);
  const [forceLogin,setForceLogin] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    
    const { name, value, type, checked } = e.target;    
    setCredentials({...credentials, [name]: type === "checkbox" ? checked : value,});
    
   };
   
  const loginHandler = async (e) => {
    
    e.preventDefault();
    if(!credentials.email || !credentials.password) 
      {
       toast.error("Please fill all required fields");
       return;
      }
    try
     {
      setLoading(true);
      const response = await api.post("/restaurant/login",
                  {
                   email: credentials.email,
                   password: credentials.password,
                   force: forceLogin,
                  });    
       if(response.data.success) 
        {
          dispatch(setAuthUser({user : response.data.user,
            type : 'restaurant'
           }));
         console.log(response.data.user);  
         navigate('/restaurant/dashboard');
         toast.success(response.data.message);
         setCredentials({ email: "", password: "" ,force :false,rememberMe:false});
         setForceLogin(false);
        }else{
          toast.error(response.message || "Login failed");
         }           
       } 
      catch (error) {
         if(error?.response?.data?.requireConfirmation)
          {
          toast.error(error.response?.data?.message);
          setForceLogin(true);
          return;
          }
        console.error(error);
        toast.error(error.response?.data?.message || "Login failed");
       }
       finally {
        setLoading(false);
     }
    
  };

  return (
        <div
      className="min-h-screen flex items-center justify-center px-5 py-8"
      style={{
        background: `
          radial-gradient(circle at top left,
          rgba(249,115,22,0.15), transparent 25%),
          radial-gradient(circle at bottom right,
          rgba(251,146,60,0.12), transparent 25%),
          linear-gradient(135deg, #1F2937, #111827)
        `,
      }}
    >
      <form
        onSubmit={loginHandler}
        className="
          w-full
          max-w-md
          bg-white
          rounded-2xl
          shadow-2xl
          p-8
          space-y-6
        "
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Restaurant Login
          </h1>
          <p className="text-gray-600">Manage your restaurant</p>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={changeEventHandler}
            placeholder="your@restaurant.com"
            className="
              w-full
              px-4 py-3
              border border-gray-300
              rounded-lg
              focus:outline-none
              focus:border-orange-500
              focus:ring-2
              focus:ring-orange-200
            "
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={changeEventHandler}
            placeholder="••••••••"
            className="
              w-full
              px-4 py-3
              border border-gray-300
              rounded-lg
              focus:outline-none
              focus:border-orange-500
              focus:ring-2
              focus:ring-orange-200
            "
          />
        </div>
        <button
           type="submit"
           disabled={loading}
           className={`
            w-full
            py-3
            rounded-xl
          text-white
            font-semibold
            transition-all
            duration-200
            flex items-center
            justify-center
            gap-3
           ${loading ? "bg-orange-400 cursor-not-allowed"
             : forceLogin ? "bg-gray-800 hover:bg-black hover:-translate-y-0.5 hover:shadow-lg"
             : "bg-orange-500 hover:bg-orange-600 hover:-translate-y-0.5 hover:shadow-lg"
            } `} >
            
              {loading && (
                <span className="
                    inline-block
                    w-4 h-4
                    border-2
                  border-white/30
                  border-t-white
                    rounded-full
                    animate-spin "/>)
              }
             {loading ? "Please Wait..." : forceLogin ? "Continue" : "Login"}
        </button>  

        <div className="text-center">
          <p className="text-sm text-gray-600">
           Don't have an account?{" "}
           <Link
            to="/restaurant/signup"
            className="
            font-semibold
            text-orange-500
              hover:text-orange-600
              hover:underline
              "
            >
            Sign Up
           </Link>
         </p>
        </div>
        
        {/* <div className="text-center border-t pt-6">
          <Link to="/login" className="text-gray-500 hover:text-gray-700">
            ← Back to Customer Login
          </Link>
        </div> */}
      </form>
    </div>
  );
}
