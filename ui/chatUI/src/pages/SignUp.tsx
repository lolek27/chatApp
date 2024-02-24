import { FormEvent, useRef } from "react";
import Input from "../shared/Input";
import Button from "../shared/Button";
import { User, useAuth } from "../context/AuthContext";

const SignUp = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const { signup, isSigningUp } = useAuth();

  const handleSignup = async (ev: FormEvent) => {
    ev.preventDefault();
    if (isSigningUp) return;
    const id = usernameRef.current?.value;
    const name = nameRef.current?.value;
    const image = imageRef.current?.value;
    if (!id || !name) {
      return;
    }
    const newUser: User = { id, name, image };
    try {
      await signup(newUser);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <h1 className="text-2xl text-pink-600 font-bold mb-7 text-center">
        Sign Up
      </h1>
      <form
        onSubmit={handleSignup}
        className="grid gap-y-5 gap-x-4 grid-cols-[auto,1fr] justify-items-en items-center">
        <label htmlFor="username">Username</label>
        <Input name="username" pattern="\S*" required ref={usernameRef} />
        <label htmlFor="name">Name</label>
        <Input name="name" required ref={nameRef} />
        <label htmlFor="imageUrl">Image URL</label>
        <Input name="imageUrl" type="url" ref={imageRef} />
        <Button type="submit" className="col-span-full" disabled={isSigningUp}>
          {isSigningUp ? "Loading..." : "Sign Up"}
        </Button>
      </form>
    </>
  );
};

export default SignUp;
