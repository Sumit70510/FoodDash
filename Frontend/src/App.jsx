import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

// Public Pages
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Customer Pages
import CartPage from "./pages/CartPage.jsx";
import UserOrdersPage from "./pages/UserOrdersPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import RestaurantDetailsPage from "./pages/RestaurantDetailsPage.jsx";

// Restaurant Authentication Pages
import RestaurantLoginPage from "./pages/RestaurantLoginPage.jsx";
import RestaurantSignupPage from "./pages/RestaurantSignupPage.jsx";

// Restaurant Dashboard Pages
import RestaurantLayout from "./pages/RestaurantLayout.jsx";
import RestaurantDashboard from "./pages/RestaurantDashboard.jsx";
import RestaurantMenuPage from "./pages/RestrauntMenuPage.jsx";
import RestaurantOrdersPage from "./pages/RestaurantOrdersPage.jsx";
import RestaurantDeliveriesPage from "./pages/RestaurantDeliveriesPage.jsx";
import RestaurantProfilePage from "./pages/RestaurantProfilePage.jsx";
import RestaurantCategoriesPage from "./pages/RestaurantCategoriesPage.jsx";
import CreateMenuItemPage from "./pages/CreateMenuItemPage.jsx";
import CreateMenuPage from "./pages/CreateMenuPage.jsx";
import EditMenuItemPage from "./pages/EditMenuItemPage.jsx";

// Delivery Partner Authentication Pages
import DeliveryLoginPage from "./pages/DeliveryLoginPage.jsx";
import DeliverySignupPage from "./pages/DeliverySignupPage.jsx";

// Delivery Partner Pages
import DeliveryPartnerLayout from "./pages/DeliveryPartnerLayout.jsx";
import DeliveryPartnerDashboard from "./pages/DeliveryPartnerDashboard.jsx";
import DeliveryPartnerOrders from "./pages/DeliveryPartnerOrders.jsx";
import DeliveryPartnerActiveDelivery from "./pages/DeliveryPartnerActiveDelivery.jsx";
import DeliveryPartnerHistory from "./pages/DeliveryPartnerHistory.jsx";
import DeliveryPartnerEarnings from "./pages/DeliveryPartnerEarnings.jsx";
import DeliveryPartnerProfile from "./pages/DeliveryPartnerProfile.jsx";

// Components
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import AuthWatcher from "./components/AuthWatcher.jsx";

function App() {
  return (
    <BrowserRouter>
      {/*
        Enable AuthWatcher when it is ready to restore
        authentication after page refresh.
      */}

      {/* <AuthWatcher /> */}

      <Routes>
        {/* =========================
            PUBLIC ROUTES
        ========================== */}

        <Route
          path="/"
          element={<HomePage />}
        />

        {/* Customer Authentication */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/signup"
          element={<SignupPage />}
        />

        {/* Restaurant Authentication */}

        <Route
          path="/restaurant/login"
          element={<RestaurantLoginPage />}
        />

        <Route
          path="/restaurant/signup"
          element={<RestaurantSignupPage />}
        />

        {/* Delivery Partner Authentication */}

        <Route
          path="/delivery/login"
          element={<DeliveryLoginPage />}
        />

        <Route
          path="/delivery/signup"
          element={<DeliverySignupPage />}
        />

        {/* Public Restaurant Details */}

        <Route
          path="/restaurant/:id"
          element={<RestaurantDetailsPage />}
        />

        {/* =========================
            CUSTOMER PROTECTED ROUTES
        ========================== */}

        <Route
          element={
            <ProtectedRoute allowedType="user" />
          }
        >
          <Route
            path="/cart"
            element={<CartPage />}
          />

          <Route
            path="/user/orders"
            element={<UserOrdersPage />}
          />

          <Route
            path="/user/profile"
            element={<UserProfilePage />}
          />
        </Route>

        {/* =========================
            RESTAURANT PROTECTED ROUTES
        ========================== */}

        <Route
          element={
            <ProtectedRoute
              allowedType="restaurant"
            />
          }
        >
          <Route
            path="/restaurant"
            element={<RestaurantLayout />}
          >
            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={<RestaurantDashboard />}
            />

            <Route
              path="menu"
              element={<RestaurantMenuPage />}
            />

            <Route
              path="menu/create-menu"
              element={<CreateMenuPage />}
            />

            <Route
              path="menu/create-category"
              element={<CreateMenuPage />}
            />

            <Route
              path="menu/create-menuItem"
              element={<CreateMenuItemPage />}
            />

            <Route
              path="menu/edit/:id"
              element={<EditMenuItemPage />}
            />

            <Route
              path="categories"
              element={
                <RestaurantCategoriesPage />
              }
            />

            <Route
              path="orders"
              element={<RestaurantOrdersPage />}
            />

            <Route
              path="deliveries"
              element={
                <RestaurantDeliveriesPage />
              }
            />

            <Route
              path="profile"
              element={<RestaurantProfilePage />}
            />
          </Route>
        </Route>

        {/* =========================
            DELIVERY PARTNER PROTECTED ROUTES
        ========================== */}

        <Route
          element={
            <ProtectedRoute
              allowedType="delivery"
            />
          }
        >
          <Route
            path="/delivery"
            element={<DeliveryPartnerLayout />}
          >
            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={
                <DeliveryPartnerDashboard />
              }
            />

            <Route
              path="orders"
              element={
                <DeliveryPartnerOrders />
              }
            />

            <Route
              path="active"
              element={
                <DeliveryPartnerActiveDelivery />
              }
            />

            <Route
              path="history"
              element={
                <DeliveryPartnerHistory />
              }
            />

            <Route
              path="earnings"
              element={
                <DeliveryPartnerEarnings />
              }
            />

            <Route
              path="profile"
              element={
                <DeliveryPartnerProfile />
              }
            />
          </Route>
        </Route>

        {/* =========================
            FALLBACK ROUTE
        ========================== */}

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;