import axios from "axios";
import { logout } from "../redux/auth.Slice.js";
import store from "../redux/store.js";


const api = axios.create({
  baseURL: `${import.meta.env.VITE_URL}/api/v1`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      
      // const { type } = store.getState().auth;
      
      store.dispatch(
         store.dispatch(logout())
      );
      
      // const loginRoutes = {
      //   customer: "/login",
      //   restaurant: "/restaurant/login",
      //   delivery: "/delivery/login",
      // };

      // window.location.href =
      //   loginRoutes[type] || "/login";
    }

    return Promise.reject(error);
  }
);

export default api; 