import { ReactNode } from "react";

type CardPropsType = {
  children: ReactNode;
};
const Card = ({ children }: CardPropsType) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-100">
      <div className="max-w-md w-full">{children}</div>
    </div>
  );
};

export default Card;

Card.Body = function ({ children }: CardPropsType) {
  return <div className="shadow bg-white p-4 py-5 rounded-md">{children}</div>;
};

Card.CardFooter = function ({ children }: CardPropsType) {
  return <div className="flex gap-4 justify-center mt-2 p-4 ">{children}</div>;
};
