import React from "react";
import { LinkProps, Link as RouterLink } from "react-router-dom";

const Link = ({ children, className, ...rest }: LinkProps) => {
  return (
    <RouterLink
      {...rest}
      className={`text-cyan-600 underline underline-offset-2 ${className}`}>
      {children}
    </RouterLink>
  );
};

export default Link;
