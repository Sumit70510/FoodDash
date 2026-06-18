import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AuthWatcher() {
  const navigate = useNavigate();

  const { user, type } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!user) {
      const loginRoutes = {
        user: "/login",
        restaurant: "/restaurant/login",
        delivery: "/delivery/login",
      };

      navigate(
        loginRoutes[type] || "/login",
        { replace: true }
      );
    }
  }, [user, type, navigate]);

  return null;
}