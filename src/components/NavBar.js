import React, { useState } from 'react'
import {Link,useNavigate} from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import {useCart} from './ContextReduce.js';
import Modal from '../Modal.js';
import Cart from '../screens/Cart';
export default function NavBar(){

  let data=useCart();
  const [cartView,setCartView]=useState(false);
  const navigate=useNavigate();

  const handleLogout=()=>{
    localStorage.removeItem('authToken');
    navigate("/Home");
  }

  return(
    <div>
    <nav className="navbar navbar-expand-lg navbar-dark" >
  <div className="container-fluid">
    <Link className="navbar-brand fs-1 ps-2" to="/">FoodDash</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse justify-content-center align-items-center" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 align-items-left">
        <li className="nav-item">
          <Link className="nav-link active fs-5" to="/">Home</Link>
        </li>
        {localStorage.getItem("authToken") &&
          <li className="nav-item">
            <Link className="nav-link active fs-5" to="/myOrder">MyOrders</Link>
          </li>
        }
      </ul>

      <div className="d-flex align-items-center">
        {!localStorage.getItem("authToken") ? (
          <div className="d-flex">
            <Link className="btn bg-white mx-2 ms-0 nav-link" to="/login">Login</Link>
            <Link className="nav-link btn bg-white ms-0 mx-2" to="/CreateUser">SignUp</Link>
          </div>
        ) : (
          <div className="d-flex">
            <button className="nav-link btn bg-white mx-2 ms-0 text-primary d-flex align-items-center" onClick={() => setCartView(true)}>
              Cart <Badge pill bg="danger" className="ms-1">{data.length}</Badge>
            </button>
            {cartView && <Modal onClose={() => setCartView(false)}><Cart/></Modal>}
            <Link className="nav-link btn bg-white text-danger ms-0 mx-2" to="/" onClick={handleLogout}>LogOut</Link>
          </div>
        )}
      </div>
    </div>
  </div>
</nav>
    </div>
  )
}
