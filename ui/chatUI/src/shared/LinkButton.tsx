import React, { DetailedHTMLProps, ButtonHTMLAttributes } from "react";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const LinkButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <button
        className={`border-none px-2 py-1 bg-transparent text-pink-600 underline
        hover:text-pink-700 focus:text-pink-500 disabled:text-slate-400 transition-colors ${className}`}
        ref={ref}
        {...rest}>
        {children}
      </button>
    );
  }
);

export default LinkButton;
