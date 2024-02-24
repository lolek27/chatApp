import React, { DetailedHTMLProps, ButtonHTMLAttributes } from "react";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <button
        className={`w-full border-2 px-2 py-1 border-pink-700 bg-pink-600 rounded text-white font-semibold 
        hover:bg-pink-700 focus:bg-pink-500 disabled:bg-slate-400 disabled:border-slate-500 transition-colors ${className}`}
        ref={ref}
        {...rest}>
        {children}
      </button>
    );
  }
);

export default Button;
