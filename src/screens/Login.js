import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:4000/api/loginuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
    });
    const json = await response.json();
    if (!json.success) {
      alert("Enter Valid Credentials");
    } else {
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
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          background: "linear-gradient(to right, #141E30, #243B55)",
          minHeight: "100vh",
        }}
      >
        <div className="card p-4 shadow-lg" style={{ width: "380px",background:"white", borderRadius: "10px", backgroundColor: "#f8f9fa" }}>
          <h3 className="text-center mb-3" style={{ color: "#6A1880" }}>Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-bold" style={{ color: "#333" }}>Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={credentials.email}
                onChange={onChange}
                required
                style={{
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid #ccc",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-bold" style={{ color: "#333" }}>Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={credentials.password}
                onChange={onChange}
                required
                style={{
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid #ccc",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-2">Login</button>
            <Link to="/CreateUser" className="btn btn-outline-dark w-100">I'm a New User</Link>
          </form>
        </div>
      </div>
    </>
  );
}
