import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SignUp() {
    const [credentials, setcredentials] = useState({ name: "", email: "", password: "", geolocation: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:4000/api/createuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password, location: credentials.geolocation })
        });
        const json = await response.json();
        console.log(json);
        if (!json.success) {
            alert("Enter Valid Credentials");
        }
    };

    const onChange = (event) => {
        setcredentials({ ...credentials, [event.target.name]: event.target.value });
    }

    return (
        <div
            className="d-flex justify-content-center align-items-center vh-100"
            style={{
                background: "linear-gradient(to right, #141E30, #243B55)",
                minHeight: "100vh",
            }}
        >
            <div className="card p-4 shadow-lg" style={{ width: "380px", borderRadius: "10px", backgroundColor: "#f8f9fa" }}>
                <h3 className="text-center mb-3" style={{ color: "#6A1880" }}>Sign Up</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="Name" className="form-label fw-bold" style={{ color: "#333" }}>Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={credentials.name}
                            onChange={onChange}
                            style={{
                                backgroundColor: "white",
                                color: "black",
                                border: "1px solid #ccc",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label fw-bold" style={{ color: "#333" }}>Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            name="email"
                            value={credentials.email}
                            onChange={onChange}
                            style={{
                                backgroundColor: "white",
                                color: "black",
                                border: "1px solid #ccc",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                            }}
                        />
                        <div id="emailHelp" className="form-text" style={{ color: "#333" }}>We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label fw-bold" style={{ color: "#333" }}>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="exampleInputPassword1"
                            name="password"
                            value={credentials.password}
                            onChange={onChange}
                            style={{
                                backgroundColor: "white",
                                color: "black",
                                border: "1px solid #ccc",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputAddress1" className="form-label fw-bold" style={{ color: "#333" }}>Address</label>
                        <input
                            type="text"
                            className="form-control"
                            id="exampleInputAddress1"
                            name="geolocation"
                            value={credentials.geolocation}
                            onChange={onChange}
                            style={{
                                backgroundColor: "white",
                                color: "black",
                                border: "1px solid #ccc",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                            }}
                        />
                    </div>
                    <button type="submit" className="m-3 btn btn-primary">Submit</button>
                    <Link to="/login" className="m-3 btn btn-danger">Already a User</Link>
                </form>
            </div>
        </div>
    )
}
