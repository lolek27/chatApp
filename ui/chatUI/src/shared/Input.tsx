import React, { DetailedHTMLProps, InputHTMLAttributes } from "react";

type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...rest }, ref) => {
    return (
      <input
        className={`w-full p-1 border rounded-sm border-slate-400 focus:border-pink-600 outline-none ${className}`}
        ref={ref}
        {...rest}
      />
    );
  }
);

export default Input;
