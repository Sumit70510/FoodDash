import HomePage from './pages/HomePage.jsx';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import OrderCard from './components/OrderCard.jsx';

function App() {
  return (
    <>
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/orders" element={<OrderCard />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App;
