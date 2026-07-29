import React from "react";
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({
  allowedType,
}) {
  const location = useLocation();

  const { user, type } = useSelector(
    (state) => state.auth
  );

  if (!user) {
    const loginRoutes = {
      user: "/login",
      restaurant: "/restaurant/login",
      delivery: "/delivery/login",
    };

    return (
      <Navigate
        to={
          loginRoutes[allowedType] ||
          "/login"
        }
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  if (
    allowedType &&
    type !== allowedType
  ) {
    const dashboardRoutes = {
      user: "/",
      restaurant:
        "/restaurant/dashboard",
      delivery: "/delivery/dashboard",
    };

    return (
      <Navigate
        to={
          dashboardRoutes[type] || "/"
        }
        replace
      />
    );
  }

  return <Outlet />;
}