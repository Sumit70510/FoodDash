import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Public Pages
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Restaurant Pages
import RestaurantLoginPage from './pages/RestaurantLoginPage.jsx';
import RestaurantSignupPage from './pages/RestaurantSignupPage.jsx';
import RestaurantProfilePage from './pages/RestaurantProfilePage.jsx';
import RestaurantCategoriesPage from './pages/RestaurantCategoriesPage.jsx';
// import RestaurantOwnerDashboard from './pages/RestaurantOwnerDashboard.jsx';
// import RestaurantMenuPage from './pages/RestaurantMenuPage.jsx';
// import RestaurantOrdersPage from './pages/RestaurantOrdersPage.jsx';
// import RestaurantAnalyticsPage from './pages/RestaurantAnalyticsPage.jsx';

// Delivery Pages
import DeliveryLoginPage from './pages/DeliveryLoginPage.jsx';
import DeliverySignupPage from './pages/DeliverySignupPage.jsx';
import RestaurantDashboard from './pages/RestaurantDashboard.jsx';
import RestaurantMenuPage from './pages/RestrauntMenuPage.jsx';
import RestaurantOrdersPage from './pages/RestrauntOrderPage.jsx';
// import DeliveryDashboard from './pages/DeliveryDashboard.jsx';
// import DeliveryOrdersPage from './pages/DeliveryOrdersPage.jsx';
// import DeliveryHistoryPage from './pages/DeliveryHistoryPage.jsx';

// Customer Pages
// import RestaurantListPage from './pages/RestaurantListPage.jsx';
// import RestaurantPage from './pages/RestaurantPage.jsx';
// import CartPage from './pages/CartPage.jsx';
// import CheckoutPage from './pages/CheckoutPage.jsx';
// import MyOrdersPage from './pages/MyOrdersPage.jsx';
// import OrderDetailsPage from './pages/OrderDetailsPage.jsx';
// import ProfilePage from './pages/ProfilePage.jsx';

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
          {/* <Route path="/restaurants" element={<RestaurantListPage />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} /> 
          */}

          {/* Restaurant Dashboard */}
          
          <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
          <Route path="/restaurant/menu" element={<RestaurantMenuPage />} />
          <Route path="/restaurant/orders" element={<RestaurantOrdersPage />} />
          <Route path="/restaurant/profile" element={<RestaurantProfilePage/>} /> 
          <Route path="/restaurant/categories" element={<RestaurantCategoriesPage/>} /> 
          
          {/* Delivery Dashboard */}
          {/* <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
          <Route path="/delivery/orders" element={<DeliveryOrdersPage />} />
          <Route path="/delivery/history" element={<DeliveryHistoryPage />} /> */}

          {/* Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
