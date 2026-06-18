import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({
  allowedType,
}) {
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
        to={loginRoutes[type] || "/login"}
        replace
      />
    );
  }

  if (allowedType && type !== allowedType) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}