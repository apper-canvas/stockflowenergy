import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md hover:shadow-lg hover:from-primary-700 hover:to-primary-600 focus:ring-primary-500",
    secondary: "border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:shadow-md focus:ring-primary-500",
    outline: "border border-primary-600 text-primary-600 bg-transparent hover:bg-primary-50 hover:shadow-sm focus:ring-primary-500",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400",
    danger: "bg-gradient-to-r from-error-600 to-error-500 text-white shadow-md hover:shadow-lg hover:from-error-700 hover:to-error-600 focus:ring-error-500"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm h-8",
    md: "px-4 py-2 text-sm h-10",
    lg: "px-6 py-3 text-base h-12"
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;