import { createBrowserRouter } from "react-router-dom";
import SharedLayout from "./pages/layouts/SharedLayout";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { AuthContextWrapper } from "./context/AuthContext";
import RootLayout from "./pages/layouts/RootLayout";
import Home from "./pages/Home";

export const router = createBrowserRouter([
  {
    element: <AuthContextWrapper />,
    children: [
      {
        element: <RootLayout />,
        path: "/",
        children: [
          { index: true, element: <Home /> },
          {
            path: "/channel",
            children: [
              { path: "new", element: <h1>This is stub new channel</h1> },
            ],
          },
        ],
      },
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
