import React from 'react'
import {Link} from 'react-router-dom'
export default function NavBar() {
  return (
    <div>
     <nav className="navbar navbar-expand-lg navbar-dark bg-success">
  <Link className="navbar-brand fs-1 fst-italic" to="/">GoFood</Link>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/login">Login</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/CreateUser">SignUp</Link>
      </li>
    </ul>
  </div>
</nav>
    </div>
  )
}
