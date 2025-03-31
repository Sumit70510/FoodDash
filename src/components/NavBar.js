import React from 'react'
import {Link,useNavigate} from 'react-router-dom';

export default function NavBar() {
  const navigate=useNavigate();
  const handleLogout=()=>{
    localStorage.removeItem('authToken');
    navigate("/Home");
  }
  return (
    <div>
     <nav className="navbar navbar-expand-lg navbar-dark " style={{ backgroundColor: "rgb(0, 126, 188)" }}>
  <Link className="navbar-brand fs-1 fst-italic" to="/">FoodDash</Link>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto me-auto mb-2">
      <li className="nav-item">
        <Link className="nav-link active fs-5" to="/">Home</Link>
      </li>
        {(localStorage.getItem("authToken"))? 
           <li className='nav-item'>
            <Link className="nav-link active fs-5" aria-current="page" to="/">MyOrders</Link>
           </li>
           :""
          }
    </ul>
      <div>
        {
          (!localStorage.getItem("authToken"))? 
           <div className='d-flex'>
            <Link className="btn bg-white mx-2 nav-link" to="/login">Login</Link>
            <Link className="nav-link btn bg-white mx-2 " to="/CreateUser">SignUp</Link>
           </div>
           :
           <div className='d-flex'>
            <Link className="nav-link btn bg-white mx-2 " to="/login">Cart</Link>
            <Link className="nav-link btn bg-white mx-2 " to="/" onClick={handleLogout}>LogOut</Link>
           </div>
        }
      </div>
  </div>
</nav>
    </div>
  )
}
