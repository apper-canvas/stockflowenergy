import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  error = false,
  ...props 
}, ref) => {
  const baseStyles = "flex w-full rounded-md border px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50";
  
  const variants = {
    default: "border-slate-300 bg-white focus:border-primary-500 focus:ring-primary-500",
    error: "border-error-500 bg-error-50 focus:border-error-600 focus:ring-error-500"
  };
  
  return (
    <input
      type={type}
      className={cn(baseStyles, error ? variants.error : variants.default, className)}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;