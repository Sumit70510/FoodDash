import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/v1/user/login", {
      method: "POST",
     credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password ,force :false}),
    });
    const json = await response.json();
    if (!json.success) {
      console.log(json.message);
      alert(json.message);
    } else {
      console.log(json.message);
      localStorage.setItem("userEmail",credentials.email);
      localStorage.setItem("authToken", json.authToken);
      // console.log(localStorage.getItem("authToken"));
      navigate("/");
    }
  };

  const onChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  return (
    <>
      <div className={`flex items-center min-h-screen justify-center
                       ${`bg-linear-to-r from-[#141E30] to-[#243B55]`}`}>
         <form className={`flex flex-col gap-5 p-4 
                           ${`bg-white text-black border rounded-lg`}`} onSubmit={handleSubmit}>
            <label className="flex item">LogIn</label>
            <div className="">
              <label>Email address</label>
              <input className="block"/>
            </div>
            <div className="">
              <label>Password</label>
              <input className="block"/>
            </div>
            {/* <button type="submit" className="">Login</button> */}
            <Link to="/signup" className="">I'm a New User</Link>
         </form>
      </div>
    </>
  );
}
