import Home from "./screens/Home";
import{
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import Login from "./screens/Login";
import '../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import SignUp from "./screens/SignUp.js";
import { CartProvider } from "./components/ContextReduce.js";

function App() {
  return (
    <CartProvider>
     <Router>
      <div style={{ background: 'linear-gradient(to right, #243B55, #141E30)' }}>
        <Routes>
          <Route exact path="/" element={<Home/>}></Route>
          <Route exact path="/login" element={<Login/>}></Route>
          <Route exact path="/CreateUser" element={<SignUp/>}></Route>
        </Routes> 
      </div>
     </Router>
    </CartProvider>
  );
}

export default App;
