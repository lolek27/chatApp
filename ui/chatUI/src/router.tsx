import { createBrowserRouter } from "react-router-dom";
import SharedLayout from "./pages/layouts/SharedLayout";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { AuthContextWrapper } from "./context/AuthContext";
import RootLayout from "./pages/layouts/RootLayout";
import Home from "./pages/Home";
import NewChannel from "./pages/channel/New";
import ErrorBoundary from "./components/ErrorBoundary";

export const router = createBrowserRouter([
  {
    element: (
      <ErrorBoundary>
        <AuthContextWrapper />
      </ErrorBoundary>
    ),
    children: [
      {
        element: <RootLayout />,
        path: "/",
        children: [
          { index: true, element: <Home /> },
          {
            path: "/channel",
            children: [
              {
                path: "new",
                element: <NewChannel />,
              },
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
    errorElement: <div>Sorry, this path could not be displayed.</div>,
  },
]);
