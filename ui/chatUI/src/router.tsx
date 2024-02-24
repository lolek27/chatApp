import { createBrowserRouter } from "react-router-dom";
import SharedLayout from "./pages/layouts/SharedLayout";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { AuthContextWrapper } from "./context/AuthContext";

export const router = createBrowserRouter([
  {
    element: <AuthContextWrapper />,
    children: [
      {
        element: <SharedLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "signup", element: <SignUp /> },
        ],
      },
    ],
  },
]);
