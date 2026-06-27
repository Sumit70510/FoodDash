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

// Delivery Pages
import DeliveryLoginPage from './pages/DeliveryLoginPage.jsx';
import DeliverySignupPage from './pages/DeliverySignupPage.jsx';
import RestaurantDashboard from './pages/RestaurantDashboard.jsx';
import RestaurantMenuPage from './pages/RestrauntMenuPage.jsx';
import RestaurantOrdersPage from './pages/RestaurantOrdersPage.jsx';
import RestaurantDeliveriesPage from './pages/RestaurantDeliveriesPage.jsx';
import RestaurantDetailsPage from './pages/RestaurantDetailsPage.jsx';
import RestaurantLayout from './pages/RestaurantLayout.jsx';
import CreateMenuItemPage from './pages/CreateMenuItemPage.jsx';
import CreateMenuPage from './pages/CreateMenuPage.jsx';
import EditMenuItemPage from './pages/EditMenuItemPage.jsx';
import AuthWatcher from './components/AuthWatcher.jsx';
import ProtectedRoute from './components/ProtectedRoutes.jsx';
import CartPage from './pages/CartPage.jsx';
import UserOrdersPage from './pages/UserOrdersPage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import DeliveryPartnerDashboard from './pages/DeliveryPartnerDashboard.jsx';
import DeliveryPartnerOrders from './pages/DeliveryPartnerOrders.jsx';


function App() {
  return (
    <>
      <BrowserRouter>
      {/* <AuthWatcher/>  */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          // Customer Routes
          {/* <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="profile" element={<UserProfilePage />} />
              <Route path="orders" element={<UserOrdersPage />} />
              <Route path="addresses" element={<UserAddressesPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
          </Route>
           */}
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
         <Route path="/cart" element={<CartPage/>}/> 
         <Route path="/user/orders" element={<UserOrdersPage/>}/>
         <Route path="/user/profile" element={<UserProfilePage />} />

          
        <Route element={<ProtectedRoute allowedType="restaurant" />}>          
          {/* Restaurant Dashboard */}
          <Route
           path="/restaurant/:id"
           element={<RestaurantDetailsPage />}
           />
          {/* <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
          <Route path="/restaurant/menu" element={<RestaurantMenuPage />} />
          <Route path="/restaurant/orders" element={<RestaurantOrdersPage />} />
          <Route path="/restaurant/profile" element={<RestaurantProfilePage/>} /> 
          <Route path="/restaurant/categories" element={<RestaurantCategoriesPage/>} /> 
          <Route path="/restaurant/deliveries" element={<RestaurantDeliveriesPage/>} />  */}
          
          <Route path="/restaurant" element={<RestaurantLayout />} >
                <Route
                  path="dashboard"
                  element={<RestaurantDashboard />} />
              
                <Route
                  path="menu"
                  element={<RestaurantMenuPage />} />
              
                <Route path="menu/create-menu" element={<CreateMenuPage />} />
                <Route path="menu/create-category" element={<CreateMenuPage />} />
                <Route path="menu/create-menuItem" element={<CreateMenuItemPage />} />
                {/* <Route path="edit/:id" element={<EditMenuItemPage />} /> */}
              
                <Route
                  path="categories"
                  element={<RestaurantCategoriesPage />}/>
              
                <Route
                  path="orders"
                  element={<RestaurantOrdersPage/>}/>
              
                <Route
                  path="deliveries"
                  element={<RestaurantDeliveriesPage />}/>
              
                <Route
                  path="profile"
                  element={<RestaurantProfilePage />}/>
              </Route>
          </Route>
          {/* Delivery Dashboard */}
          {/* <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
          <Route path="/delivery/orders" element={<DeliveryOrdersPage />} />
          <Route path="/delivery/history" element={<DeliveryHistoryPage />} /> */}
         
        <Route
          path="delivery/dashboard"
          element={<DeliveryPartnerDashboard/>}/>

        <Route
          path="delivery/orders"
          element={<DeliveryPartnerOrders/>}/>

          {/* Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
