import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RootLayout = () => {
  const { loggedUser } = useAuth();
  if (!loggedUser) <Navigate to="/login" />;

  return <Outlet />;
};

export default RootLayout;
