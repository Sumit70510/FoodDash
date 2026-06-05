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

      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />

      {/* Customer Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Restaurant Auth */}
      <Route path="/restaurant/login" element={<RestaurantLoginPage />} />
      <Route path="/restaurant/signup" element={<RestaurantSignupPage />} />

      {/* Delivery Auth */}
      <Route path="/delivery/login" element={<DeliveryLoginPage />} />
      <Route path="/delivery/signup" element={<DeliverySignupPage />} />

      {/* Customer Routes */}
      <Route path="/restaurants" element={<RestaurantListPage />} />
      <Route path="/restaurant/:id" element={<RestaurantPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/orders/:id" element={<OrderDetailsPage />} />
      <Route path="/profile" element={<ProfilePage />} />

      {/* Restaurant Dashboard */}
      <Route path="/restaurant/dashboard"
             element={<RestaurantDashboard />} />

      <Route path="/restaurant/menu"
             element={<RestaurantMenuPage />}  />

      <Route path="/restaurant/orders"
             element={<RestaurantOrdersPage />} />

      <Route path="/restaurant/analytics"
             element={<RestaurantAnalyticsPage />} />

      {/* Delivery Dashboard */}
      <Route path="/delivery/dashboard"
             element={<DeliveryDashboard />} />

      <Route path="/delivery/orders"
             element={<DeliveryOrdersPage />} />

      <Route path="/delivery/history"
             element={<DeliveryHistoryPage />} />

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />

     </Routes>
    </BrowserRouter>
   </>
  )
}

export default App;
