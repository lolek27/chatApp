import { useLocation } from "react-router-dom";
import Link from "../shared/Link";

const LoginLink = () => {
  const isLoginPage = useLocation().pathname === "/login";
  const location = isLoginPage ? "/signup" : "/login";
  const text = isLoginPage ? "Create Account" : "Sign In";
  return <Link to={location}>{text}</Link>;
};

export default LoginLink;
