import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  registerUser,
  logoutUser,
  updateProfile,
} from "../redux/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, loading, error, isAuthenticated } = useSelector(
    (s) => s.auth
  );

  const login = async (credentials) => {
    const result = await dispatch(loginUser(credentials));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/");
      return true;
    }
    return false;
  };

  const register = async (userData) => {
    const result = await dispatch(registerUser(userData));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/");
      return true;
    }
    return false;
  };

  const logout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const update = async (data) => {
    const result = await dispatch(updateProfile(data));
    return result.meta.requestStatus === "fulfilled";
  };

  const isAdmin = user?.role === "admin";

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    update,
  };
};

export default useAuth;