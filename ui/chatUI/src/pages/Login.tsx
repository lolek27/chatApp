import { FormEvent, useRef } from "react";
import Input from "../shared/Input";
import Button from "../shared/Button";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const Login = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { login, isLogging, loggedUser } = useAuth();

  if (loggedUser) return <Navigate to="/" />;

  const handleLogin = async (ev: FormEvent) => {
    ev.preventDefault();
    if (isLogging) return;
    const id = usernameRef.current?.value;
    if (!id) {
      return;
    }
    try {
      await login(id);

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <h1 className="text-2xl text-pink-600 font-bold mb-7 text-center">
        Login
      </h1>
      <form
        onSubmit={handleLogin}
        className="grid gap-y-5 gap-x-4 grid-cols-[auto,1fr] justify-items-en items-center">
        <label htmlFor="username">Username</label>
        <Input name="username" required ref={usernameRef} />
        <Button type="submit" className="col-span-full" disabled={isLogging}>
          {isLogging ? "Logging..." : "Sign In"}
        </Button>
      </form>
    </>
  );
};

export default Login;
